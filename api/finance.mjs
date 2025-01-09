import express from "express";
import yahooFinance from "yahoo-finance2";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const formatLargeNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  return num?.toString() || "N/A";
};

app.get("/api/stock/:ticker", async (req, res) => {
  const { ticker } = req.params;

  if (!ticker) {
    return res.status(400).json({ error: "Invalid ticker" });
  }

  try {
    const quote = await yahooFinance.quote(ticker);
    const financialData = await yahooFinance.quoteSummary(ticker, {
      modules: ["financialData", "defaultKeyStatistics", "recommendationTrend"],
    });

    const stockData = {
      name: quote.longName || "N/A",
      description: quote.longBusinessSummary || "N/A",
      marketCap: formatLargeNumber(quote.marketCap),
      sharesOutstanding: formatLargeNumber(quote.sharesOutstanding),
      float: formatLargeNumber(financialData.defaultKeyStatistics.floatShares),
      evEbitda:
        financialData.defaultKeyStatistics.enterpriseToEbitda?.toFixed(2) ||
        "N/A",
      peTtm: quote.trailingPE?.toFixed(2) || "N/A",
      dividendRate: quote.dividendRate?.toFixed(2) || "N/A",
      cashPosition: formatLargeNumber(financialData.financialData.totalCash),
      totalDebt: formatLargeNumber(financialData.financialData.totalDebt),
      debtToEquity:
        financialData.financialData.debtToEquity?.toFixed(2) || "N/A",
      currentRatio:
        financialData.financialData.currentRatio?.toFixed(2) || "N/A",
      strengthsAndCatalysts: "Requires manual input or additional API",
      analystRating:
        financialData.financialData.recommendationMean?.toFixed(2) || "N/A",
      numberOfAnalysts:
        financialData.financialData.numberOfAnalystOpinions?.toString() ||
        "N/A",
      meanTargetPrice:
        financialData.financialData.targetMeanPrice?.toFixed(2) || "N/A",
      impliedChange:
        (
          (financialData.financialData.targetMeanPrice /
            quote.regularMarketPrice -
            1) *
          100
        )?.toFixed(2) + "%" || "N/A",
      risksAndMitigation: "Requires manual input or additional API",
      recommendation:
        financialData.recommendationTrend.trend[0]?.strongBuy >
        financialData.recommendationTrend.trend[0]?.sell
          ? "Buy"
          : "Sell",
    };

    res.json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(port, () => {
  console.log(`Stock API server running at http://localhost:${port}`);
});
