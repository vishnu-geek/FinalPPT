const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://stocks-generates.vercel.app/',  // Replace this with the actual frontend URL
  methods: ['GET', 'POST'],
  credentials:true
}));

app.post("/generate-image", async (req, res) => {
  const { stockName } = req.body;

  if (!stockName) {
    return res.status(400).json({ error: "Stock name is required" });
  }

  // Construct the prompt based on the stock name
  const prompt = `${stockName} logo with futuristic city, blue and purple color, neon glow, detailed, high quality. Modern,high tech,soft,bold aesthetic,using dark shades of purple, blue, and black in a gradient`;

  try {
    // Step 1: Generate the image using the BFL API
    const generateResponse = await axios.post(
      "https://api.bfl.ml/v1/flux-pro-1.1", // BFL API endpoint
      {
        prompt: prompt,
        width: 896, // Image width
        height: 1152, // Image height
      },
      {
        headers: {
          accept: "application/json",
          "x-key": process.env.BFL_API_KEY, // API Key from .env file
          "Content-Type": "application/json",
        },
      }
    );

    // Extract request ID from the response
    const requestId = generateResponse.data.id;

    if (!requestId) {
      return res
        .status(500)
        .json({ error: "No request ID received from BFL API" });
    }

    console.log("Image generation started, waiting for the result...");

    // Step 2: Poll the API until the image is ready
    let imageUrl = null;
    let status = "Processing";

    // Keep checking the status until the image is ready
    while (status !== "Ready") {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Sleep for 0.5 seconds
      const resultResponse = await axios.get(
        `https://api.bfl.ml/v1/get_result?id=${requestId}`,
        {
          headers: {
            accept: "application/json",
            "x-key": process.env.BFL_API_KEY, // API Key from .env file
          },
        }
      );

      status = resultResponse.data.status;
      if (status === "Ready") {
        imageUrl = resultResponse.data.result.sample;
        console.log("Image ready!");
      } else {
        console.log(`Status: ${status}`);
      }
    }

    if (imageUrl) {
      res.status(200).json({ imageUrl });
    } else {
      res.status(500).json({ error: "Failed to retrieve the image URL" });
    }
  } catch (error) {
    console.error(
      "Error generating or fetching image:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate or retrieve image" });
  }
});

const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
