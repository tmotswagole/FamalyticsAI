"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLORS } from "@/lib/constants";
import { t } from "@/lib/content";

interface SentimentChartProps {
  data: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
  title?: string;
  height?: number;
}

export default function SentimentChart({
  data,
  title = "Sentiment Trends",
  height = 300,
}: SentimentChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      const ctx = document.getElementById(
        "sentimentChart",
      ) as HTMLCanvasElement;

      if (!ctx) return;

      // Destroy previous chart instance if it exists
      const chartInstance = Chart.getChart(ctx);
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create new chart
      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map((item) => {
            const date = new Date(item.date);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }),
          datasets: [
            {
              label: "Positive",
              data: data.map((item) => item.positive),
              borderColor: COLORS.positive,
              backgroundColor: `${COLORS.positive}20`,
              tension: 0.3,
              fill: true,
            },
            {
              label: "Neutral",
              data: data.map((item) => item.neutral),
              borderColor: COLORS.neutral,
              backgroundColor: `${COLORS.neutral}20`,
              tension: 0.3,
              fill: true,
            },
            {
              label: "Negative",
              data: data.map((item) => item.negative),
              borderColor: COLORS.negative,
              backgroundColor: `${COLORS.negative}20`,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              align: "end",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "#e2e8f0",
              },
            },
          },
        },
      });

      setChartData(newChart);

      // Cleanup function
      return () => {
        newChart.destroy();
      };
    };

    if (data && data.length > 0) {
      loadChart();
    }
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <canvas id="sentimentChart"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
