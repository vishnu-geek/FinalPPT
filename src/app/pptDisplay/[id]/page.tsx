"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/fancy-dark-loading";
import { StockDataDisplay } from "@/components/StockDataDisplay";
import type { StockData } from "../../../../types/StockData";

export default function Page() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const loadStockData = async () => {
      if (typeof id !== "string") {
        setError("Invalid stock ticker");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchStockData = async (id: string) => {
          try {
            const response = await fetch(
              `https://finalppt.onrender.com`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch stock data");
            }
            const data = await response.json();
            console.log(
              "Stock data for",
              id,
              ":",
              JSON.stringify(data, null, 2)
            );
            return data;
          } catch (error) {
            console.error("Error:", error);
          }
        };

        const data = await fetchStockData(id);

        setStockData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load stock data"
        );
        console.error("Error loading stock data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStockData();
  }, [id]);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stockData) return <div>No data available</div>;

  return <StockDataDisplay data={stockData} />;
}
