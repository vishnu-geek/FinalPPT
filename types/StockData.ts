export interface StockData {
  name: string;
  description: string;
  marketCap: string;
  sharesOutstanding: string;
  float: string;
  evEbitda: string;
  peTtm: string;
  dividendRate: string;
  cashPosition: string;
  totalDebt: string;
  debtToEquity: string;
  currentRatio: string;
  strengthsAndCatalysts: string;
  analystRating: string;
  numberOfAnalysts: string;
  meanTargetPrice: string;
  impliedChange: string;
  risksAndMitigation: string;
  recommendation: "Buy" | "Sell";
}
