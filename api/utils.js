const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8005;

app.use(cors());

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

app.post("/api/gpt", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).send({ error: "Prompt is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.send({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Failed to get GPT response" });
  }
});

app.post("/api/get-ticker", async (req, res) => {
  const { stockName } = req.body;

  if (!stockName) {
    return res.status(400).send({ error: "Stock name is required" });
  }

  try {
    const searchResults = await yahooFinance.search(stockName);

    if (searchResults && searchResults.quotes.length > 0) {
      const ticker = searchResults.quotes[0].symbol;
      return res.send({ ticker });
    } else {
      return res.status(404).send({ error: "Stock not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to fetch stock data from Yahoo Finance" });
  }
});

app.post("/generate-image", async (req, res) => {
  const { stockName } = req.body;

  if (!stockName) {
    return res.status(400).json({ error: "Stock name is required" });
  }

  const prompt = `${stockName}logo with futurstic city blue and purple color neon glow detailed high quality stock market related and use its appropriate name under that stockName `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error.response.data || error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
