import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StockData } from "../../types/StockData";

interface StockDataDisplayProps {
  data: StockData;
}

interface Strength {
  title: string;
  description: string;
}

export function StockDataDisplay({ data }: StockDataDisplayProps) {
  const [cachedData, setCachedData] = useState<StockData | null>(null);
  const [companyDescription, setCompanyDescription] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSrc2, setImageSrc2] = useState<string | null>(null);
  const [keyMetrics, setKeyMetrics] = useState<
    Array<{ label: string; value: string | number; description: string }>
  >([]);
  const [financialHealth, setFinancialHealth] = useState<
    Array<{ label: string; value: string | number; description: string }>
  >([]);
  const [strengthsAndCatalysts, setStrengthsAndCatalysts] = useState<
    Strength[]
  >([]);
  const [analystHealth, setAnalystHealth] = useState<
    Array<{ label: string; value: string | number; description: string }>
  >([]);
  const [risksAndMitigations, setRisksAndMitigations] = useState<Strength[]>(
    []
  );
  const [conclusion, setConclusion] = useState<string>("");
  const [loadingStates, setLoadingStates] = useState({
    companyOverview: true,
    keyMetrics: true,
    financialHealth: true,
    strengthsAndCatalysts: true,
    analystHealth: true,
    risksAndMitigations: true,
    conclusion: true,
  });

  useEffect(() => {
    if (!cachedData) {
      setCachedData(data);
    }
  }, [data, cachedData]);

  const fetchCompanyOverview = useCallback(async () => {
    if (cachedData) {
      try {
        const src = await getImage(cachedData.name);
        setImageSrc(src);
      } catch {
        setImageSrc(
          "https://images.unsplash.com/photo-1456930266018-fda42f7404a7?q=80&w=1595&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        );
      }
      const desc = await dsc(
        `Give ${cachedData.name} company's description in 50-70 words`
      );
      setCompanyDescription(desc);
      setLoadingStates((prev) => ({ ...prev, companyOverview: false }));
    }
  }, [cachedData]);


  const fetchKeyMetrics = useCallback(async () => {
    if (cachedData) {
      // Your logic to fetch key metrics
      const keyMetricsData = [
        { label: "Revenue", value: 1000000, description: "Annual Revenue" },
        { label: "Profit", value: 200000, description: "Annual Profit" },
      ];
      setKeyMetrics(keyMetricsData);
      setLoadingStates((prev) => ({ ...prev, keyMetrics: false }));
    }
  }, [cachedData]);

  const fetchFinancialHealth = useCallback(async () => {
    if (cachedData) {
      // Your logic to fetch financial health data
      const financialHealthData = [
        { label: "Debt to Equity", value: 0.5, description: "Debt to Equity Ratio" },
        { label: "Current Ratio", value: 1.5, description: "Current Ratio" },
      ];
      setFinancialHealth(financialHealthData);
      setLoadingStates((prev) => ({ ...prev, financialHealth: false }));
    }
  }, [cachedData]);

  const fetchStrengthsAndCatalysts = useCallback(async () => {
    if (cachedData) {
      // Your logic to fetch strengths and catalysts
      const strengthsAndCatalystsData = await dsc(
        `List 3 strengths and catalysts for ${cachedData.name}`
      );
      setStrengthsAndCatalysts(parsePoints(strengthsAndCatalystsData));
      setLoadingStates((prev) => ({
        ...prev,
        strengthsAndCatalysts: false,
      }));
    }
  }, [cachedData]);

  const fetchAnalystHealth = useCallback(async () => {
    if (cachedData) {
      // Your logic to fetch analyst health data
      const analystHealthData = [
        { label: "Average Rating", value: "Buy", description: "Average Analyst Rating" },
        { label: "Price Target", value: 150, description: "Average Price Target" },
      ];
      setAnalystHealth(analystHealthData);
      setLoadingStates((prev) => ({ ...prev, analystHealth: false }));
    }
  }, [cachedData]);

  const fetchRisksAndMitigations = useCallback(async () => {
    if (cachedData) {
      // Your logic to fetch risks and mitigations
      const risksAndMitigationsData = await dsc(
        `List 3 risks and mitigations for ${cachedData.name}`
      );
      setRisksAndMitigations(parseRisksAndMitigations(risksAndMitigationsData));
      setLoadingStates((prev) => ({
        ...prev,
        risksAndMitigations: false,
      }));
    }
  }, [cachedData]);

  const fetchConclusion = useCallback(async () => {
    if (cachedData) {
      // Your logic to fetch conclusion
      const conclusionData = await dsc(
        `Give a brief conclusion about ${cachedData.name} in 50-70 words`
      );
      setConclusion(conclusionData);
      try {
        const src2 = await getImage(cachedData.name);
        setImageSrc2(src2);
      } catch {
        setImageSrc2(
          "https://images.unsplash.com/photo-1456930266018-fda42f7404a7?q=80&w=1595&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        );
      }
      setLoadingStates((prev) => ({ ...prev, conclusion: false }));
    }
  }, [cachedData]);

  useEffect(() => {
    if (cachedData) {
      fetchCompanyOverview();
      fetchKeyMetrics();
      fetchFinancialHealth();
      fetchStrengthsAndCatalysts();
      fetchAnalystHealth();
      fetchRisksAndMitigations();
      fetchConclusion();
    }
  }, [
    cachedData,
    fetchCompanyOverview,
    fetchKeyMetrics,
    fetchFinancialHealth,
    fetchStrengthsAndCatalysts,
    fetchAnalystHealth,
    fetchRisksAndMitigations,
    fetchConclusion,
  ]);

  if (!cachedData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col gap-10 p-10 items-center justify-center bg-slate-900">
      {loadingStates.companyOverview ? (
        <LoadingCard />
      ) : (
        <CompanyOverview
          name={cachedData.name}
          description={companyDescription}
          imageSrc={imageSrc}
        />
      )}
      {loadingStates.keyMetrics ? (
        <LoadingCard />
      ) : (
        <KeyMetrics metrics={keyMetrics} />
      )}
      {loadingStates.financialHealth ? (
        <LoadingCard />
      ) : (
        <FinancialHealth financials={financialHealth} />
      )}
      {loadingStates.strengthsAndCatalysts ? (
        <LoadingCard />
      ) : (
        <StrengthsAndCatalysts strengths={strengthsAndCatalysts} />
      )}
      {loadingStates.analystHealth ? (
        <LoadingCard />
      ) : (
        <AnalystHealth analystData={analystHealth} />
      )}
      {loadingStates.risksAndMitigations ? (
        <LoadingCard />
      ) : (
        <RisksAnalysis points={risksAndMitigations} />
      )}
      {loadingStates.conclusion ? (
        <LoadingCard />
      ) : (
        <Conclusion description={conclusion} imageSrc={imageSrc2 || ''} />
      )}
    </div>
  );
}

function CompanyOverview({
  name,
  description,
  imageSrc,
}: {
  name: string;
  description: string;
  imageSrc: string | null;
}) {
  return (
    <Card className="flex w-[80vw] h-[75vh] bg-zinc-900 shadow-2xl shadow-cyan-400 text-white border-0">
      <CardHeader className="flex-1 p-16 items-center justify-center">
        <CardTitle className="barlow-bold text-5xl pb-3 font-bold text-white bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          {name}
        </CardTitle>
        <CardDescription className="montserrat text-xl text-center text-white">
          {description}
        </CardDescription>
      </CardHeader>
      <CardHeader className="w-5/12 p-0 relative overflow-hidden items-center justify-center">
        <CardDescription className="text-center overflow-hidden h-full w-full text-gray-400">
          <img
            className="object-cover w-full h-full rounded-r-lg"
            src={imageSrc || '/placeholder.svg?height=400&width=300'}
            alt={`${name} visual representation`}
          />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function KeyMetrics({ metrics }: { metrics: any }) {
  return (
    <Card className="w-[80vw] bg-zinc-900 shadow-2xl shadow-cyan-400 text-white border-0">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-bold">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {metrics.map((metric: any) => (
            <li key={metric.label} className="py-2">
              <span className="font-bold">{metric.label}:</span>{" "}
              {metric.value} - {metric.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function FinancialHealth({ financials }: { financials: any }) {
  return (
    <Card className="w-[80vw] bg-zinc-900 shadow-2xl shadow-cyan-400 text-white border-0">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-bold">Financial Health</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {financials.map((financial: any) => (
            <li key={financial.label} className="py-2">
              <span className="font-bold">{financial.label}:</span>{" "}
              {financial.value} - {financial.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function StrengthsAndCatalysts({
  strengths,
}: {
  strengths: Strength[];
}) {
  return (
    <Card className="w-[80vw] bg-zinc-900 shadow-2xl shadow-cyan-400 text-white border-0">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-bold">
          Strengths & Catalysts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {strengths.map((strength) => (
            <li key={strength.title} className="py-2">
              <span className="font-bold">{strength.title}:</span>{" "}
              {strength.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function AnalystHealth({ analystData }: { analystData: any }) {
  return (
    <Card className="w-[80vw] bg-zinc-900 shadow-2xl shadow-cyan-400 text-white border-0">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-bold">Analyst Health</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {analystData.map((data: any) => (
            <li key={data.label} className="py-2">
              <span className="font-bold">{data.label}:</span>{" "}
              {data.value} - {data.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function RisksAnalysis({ points }: { points: Strength[] }) {
  return (
    <Card className="w-[80vw] bg-zinc-900 shadow-2xl shadow-cyan-400 text-white border-0">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-bold">Risks & Mitigations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {points.map((point) => (
            <li key={point.title} className="py-2">
              <span className="font-bold">{point.title}:</span>{" "}
              {point.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function Conclusion({ description, imageSrc }: { description: string; imageSrc: string }) {
  return (
    <Card className="flex w-[80vw] h-[75vh] bg-zinc-900 shadow-2xl shadow-cyan-400 text-white border-0">
      <CardHeader className="flex-1 p-16 items-center justify-center">
        <CardTitle className="text-2xl font-bold">Conclusion</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>
      <CardHeader className="w-5/12 p-0 relative overflow-hidden items-center justify-center">
        <CardDescription className="text-center overflow-hidden h-full w-full text-gray-400">
          <img
            className="object-cover w-full h-full rounded-r-lg"
            src={imageSrc || '/placeholder.svg?height=400&width=300'}
            alt={`Conclusion visual representation`}
          />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

async function getImage(_name: string) {
  const data = { stockName: _name };
  const res = await fetch("http://localhost:8010/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response.imageUrl;
}

async function dsc(_prompt: string) {
  const data = { prompt: _prompt };
  const res = await fetch("http://localhost:8005/api/gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.text();
  const obj = JSON.parse(response);
  return obj.response;
}

function parsePoints(text: string): Strength[] {
  const strengths: Strength[] = [];
  const parts = text.split(/\d+\./).slice(1);

  for (const part of parts) {
    const [title, ...descriptionParts] = part.split(":");
    const description = descriptionParts.join(":").trim();
    if (title && description) {
      strengths.push({
        title: title.trim(),
        description: description.replace(/\.$/, ""),
      });
    }
  }

  return strengths;
}

function parseRisksAndMitigations(text: string): Strength[] {
  const risks: Strength[] = [];
  const parts = text.split(/\d+\./).slice(1);

  for (const part of parts) {
    const [title, ...descriptionParts] = part.split(":");
    const fullDescription = descriptionParts.join(":").trim();
    const [risk, mitigation] = fullDescription.split("Mitigation:");

    if (title && risk) {
      risks.push({
        title: title.trim(),
        description: `${risk.trim()}\nMitigation:${
          mitigation ? mitigation.trim() : "Not provided"
        }`,
      });
    }
  }

  return risks;
}

function LoadingCard() {
  return (
    <Card className="flex w-[80vw] h-[75vh] bg-zinc-900 shadow-2xl shadow-cyan-400 text-gray-100 border-0 items-center justify-center">
      <CardContent>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </CardContent>
    </Card>
  );
}

