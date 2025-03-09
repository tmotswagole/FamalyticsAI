"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";
import { t } from "@/lib/content";

interface ThemeDistributionProps {
  data: {
    name: string;
    count: number;
  }[];
  title?: string;
  height?: number;
}

export default function ThemeDistribution({
  data,
  title = "Theme Distribution",
  height = 300,
}: ThemeDistributionProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      const ctx = document.getElementById(
        "themeDistributionChart",
      ) as HTMLCanvasElement;

      if (!ctx) return;

      // Destroy previous chart instance if it exists
      const chartInstance = Chart.getChart(ctx);
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create new chart
      const newChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data.map((item) => item.name),
          datasets: [
            {
              data: data.map((item) => item.count),
              backgroundColor: CHART_COLORS.slice(0, data.length),
              borderWidth: 1,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 12,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw as number;
                  const total = context.dataset.data.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  ) as number;
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
          cutout: "60%",
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
          {data.length > 0 ? (
            <canvas id="themeDistributionChart"></canvas>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {t("chart.noData")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
