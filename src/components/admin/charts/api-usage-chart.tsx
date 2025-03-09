"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function ApiUsageChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Sample data for demonstration
    const hours = [
      "00:00",
      "02:00",
      "04:00",
      "06:00",
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
      "22:00",
    ];

    const requestCounts = [
      320, 280, 250, 310, 490, 720, 950, 880, 760, 650, 580, 420,
    ];
    const avgResponseTimes = [
      110, 105, 100, 115, 130, 150, 165, 155, 140, 125, 120, 115,
    ]; // in ms

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create the chart
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: hours,
        datasets: [
          {
            label: "API Requests",
            data: requestCounts,
            backgroundColor: "rgba(124, 58, 237, 0.5)",
            borderColor: "rgba(124, 58, 237, 1)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Avg. Response Time (ms)",
            data: avgResponseTimes,
            type: "line",
            borderColor: "rgba(234, 88, 12, 1)",
            backgroundColor: "rgba(234, 88, 12, 0.1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Request Count",
            },
            min: 0,
            grid: {
              display: false,
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Response Time (ms)",
            },
            min: 0,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
          legend: {
            position: "top",
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
}
