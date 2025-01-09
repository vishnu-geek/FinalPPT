import express from "express";
import pkg from "pdfjs-dist/legacy/build/pdf.js";
const { getDocument } = pkg;
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: 'https://stocks-generates.vercel.app/',  // Replace this with the actual frontend URL
  methods: ['GET', 'POST'],
  credentials:true
}));

app.post("/api/extract-text", async (req, res) => {
  try {
    const { filePath, upload } = req.body;

    let data;

    if (filePath) {
      const absolutePath = path.resolve(filePath);
      data = fs.readFileSync(absolutePath);
    } else if (upload) {
      data = Buffer.from(upload, "base64");
    } else {
      return res.status(400).json({ error: "File path or upload is required" });
    }

    const loadingTask = getDocument({ data });
    const pdfDocument = await loadingTask.promise;

    let result = "";

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();

      textContent.items.forEach((item) => {
        const isHeading = item.height > 10;
        const isBold =
          item.fontName && item.fontName.toLowerCase().includes("bold");

        if (isHeading) {
          result += `<u>${item.str}</u>\n`;
        } else if (isBold) {
          result += `<strong>${item.str}</strong>\n`;
        } else {
          result += `${item.str}\n`;
        }
      });
    }

    res.status(200).json({ text: result });
  } catch (error) {
    console.error("Error extracting text:", error.stack);
    res.status(500).json({ error: "Failed to extract text from the PDF" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
