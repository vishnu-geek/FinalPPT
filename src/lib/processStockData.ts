import type { StockData } from "../../types/StockData";

export function processStockData(text: string): StockData {
  const extractValue = (key: string): string => {
    const regex = new RegExp(`${key}\\s*:?\\s*(.+)`);
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const extractSection = (startKey: string, endKey: string): string => {
    const start = text.indexOf(startKey);
    const end = text.indexOf(endKey, start);
    return text.slice(start + startKey.length, end).trim();
  };

  const extractLast = (startKey: string): string => {
    const start = text.indexOf(startKey);
    const end = text.length;
    return text.slice(start + startKey.length, end).trim();
  };

  return {
    name: extractValue("Company Name"),
    description: extractSection(
      "Business Description\n:",
      "BUSINESS AND MARKET POSITION"
    ),
    marketCap: extractValue("Market Cap"),
    sharesOutstanding: extractValue("Shares Outstanding"),
    float: extractValue("Float"),
    evEbitda: extractValue("EV/EBITDA"),
    peTtm: extractValue("P/E TTM"),
    dividendRate: extractValue("Dividend Rate"),
    cashPosition: extractValue("Cash Position"),
    totalDebt: extractValue("Total Debt"),
    debtToEquity: extractSection("Debt to Equity:", "•"),
    currentRatio: extractSection("Current Ratio:", "A"),
    strengthsAndCatalysts:
      extractSection("GROWTH CATALYSTS", "INVESTMENT THESIS") +
      extractSection("KEY STRENGTHS", "GROWTH CATALYSTS"),
    analystRating: extractSection("Analyst Rating (1-5):", "•"),
    numberOfAnalysts: extractValue("Number of Analysts"),
    meanTargetPrice: extractValue("Mean Target Price"),
    impliedChange: extractSection("Implied +/-:", "•"),
    risksAndMitigation: extractLast("RISK ANALYSIS AND MITIGATION"),
    recommendation: extractValue("Recommendation").toLowerCase().includes("buy")
      ? "Buy"
      : "Sell",
  };
}
