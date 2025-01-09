import express from "express";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({
  origin: 'https://stocks-generates.vercel.app/',  // Replace this with the actual frontend URL
  methods: ['GET', 'POST'],
  credentials:true
}));

app.post("/generate-stock-report", async (req, res) => {
  const { ticker } = req.body;

  if (!ticker || typeof ticker !== "string") {
    return res.status(400).json({ error: "Invalid ticker provided" });
  }

  try {
    await new Promise((resolve, reject) => {
      exec(`python3 stocks.py ${ticker}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
          return reject(error);
        }
        console.log(`Python script output: ${stdout}`);
        resolve();
      });
    });

    const files = await fs.readdir(".");
    const pdfFile = files.find(
      (file) => file.startsWith(`${ticker}_Analysis_`) && file.endsWith(".pdf")
    );

    if (!pdfFile) {
      return res.status(500).json({ error: "PDF file not generated" });
    }

    const pdfData = await fs.readFile(pdfFile);
    const base64Pdf = pdfData.toString("base64");

    await fs.unlink(pdfFile);

    res.json({ pdf: base64Pdf });
  } catch (error) {
    console.error(`Error processing request: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
