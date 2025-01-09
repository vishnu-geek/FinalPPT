"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Component() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-64 text-center">
        <div className="relative">
          <Loader2
            className="w-24 h-24 animate-spin text-blue-500 mx-auto mb-4"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-bold text-blue-300">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-blue-300">Loading...</h1>
        <p className="text-gray-400 mb-4">
          Preparing your presentation, This may take a while
        </p>
        
        {/* Use the Progress component here */}
        <Progress value={progress} className="w-full h-2 bg-gray-700" />

        <style jsx>{`
          .progress-indicator {
            background-color: #8b5cf6;
          }
        `}</style>

        <div className="mt-8 space-y-2">
          <div className="h-2 w-full bg-black rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 rounded-full animate-pulse"
              style={{ width: "75%" }}
            ></div>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full animate-pulse"
              style={{ width: "55%", animationDelay: "0.2s" }}
            ></div>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full animate-pulse"
              style={{ width: "90%", animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
