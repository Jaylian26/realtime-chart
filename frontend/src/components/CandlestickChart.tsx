"use client";

import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

interface ChartProps {
  data: CandlestickData[];
}

const CandlestickChart = ({ data }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#1a1a1a" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#2B2B43" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      // borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    if (data && Array.isArray(data) && data.length > 0) {
      const validData = data.filter(
        (item) => item && typeof item === "object" && item.time
      );
      candlestickSeries.setData(validData);
    } else {
      console.warn("No valid data provided for the chart");
    }

    // Set data
    candlestickSeries.setData(data);

    // Store references
    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return <div ref={chartContainerRef} className="w-full" />;
};

export default CandlestickChart;
