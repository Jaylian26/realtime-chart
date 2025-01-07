"use client";

import { useEffect, useState } from "react";
import { CandlestickData } from "lightweight-charts";
import CandlestickChart from "../components/CandlestickChart";

export default function Home() {
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("message -->", message);

      if (message.type === "initial") {
        setCandlestickData(message.data);
      } else if (message.type === "update") {
        setCandlestickData((prevData) => [...prevData, message.data]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);
  console.log("candlestickData -->", candlestickData.length);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Real-time Candlestick Chart
      </h1>
      <div className="w-full max-w-6xl bg-gray-800 p-4 rounded-lg shadow-lg">
        {candlestickData.length > 0 ? (
          <CandlestickChart data={candlestickData} />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            Loading chart data...
          </div>
        )}
      </div>
    </main>
  );
}
