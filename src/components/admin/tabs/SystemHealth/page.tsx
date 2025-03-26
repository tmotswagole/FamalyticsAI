// components/tabs/SystemHealthTab.tsx
import { useState, useEffect } from "react";
import { LineChart, BarChart, Heatmap } from "../../charts";
import MetricCard from "../../MetricCard/page";

interface SystemHealthData {
  totalJobs: number;
  jobsChange: string;
  errorRate: number;
  errorRateChange: string;
  avgResponseTime: number;
  responseTimeChange: string;
  successRate: number;
  successRateChange: string;
  errorTrends: { date: string; errorCount: number }[];
  resourceUsage: { time: string; resource: string; usage: number }[];
  jobTypes: { type: string; count: number }[];
  responseTimes: { date: string; time: number }[];
}

const SystemHealthTab = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const [loading, setLoading] = useState(true);
  const [systemHealthData, setSystemHealthData] =
    useState<SystemHealthData | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/system-health?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        const data = await res.json();
        setSystemHealthData(data);
      } catch (error) {
        console.error("Error fetching system health data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-background p-4 md:p-6 rounded-xl shadow-sm animate-pulse"
          >
            <div className="h-4 bg-background rounded w-1/3 mb-4"></div>
            <div className="h-40 bg-background rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Metrics Cards */}
      <div className="bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            title="Total Jobs"
            value={systemHealthData?.totalJobs || 0}
            change={systemHealthData?.jobsChange || "+0%"}
            icon="📊"
          />
          <MetricCard
            title="Error Rate"
            value={`${systemHealthData?.errorRate || 0}%`}
            change={systemHealthData?.errorRateChange || "0%"}
            isNegative={systemHealthData?.errorRateChange?.startsWith("+")}
            icon="⚠️"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${systemHealthData?.avgResponseTime || 0}ms`}
            change={systemHealthData?.responseTimeChange || "0%"}
            isNegative={systemHealthData?.responseTimeChange?.startsWith("+")}
            icon="⏱️"
          />
          <MetricCard
            title="Job Success Rate"
            value={`${systemHealthData?.successRate || 0}%`}
            change={systemHealthData?.successRateChange || "0%"}
            icon="✅"
          />
        </div>
      </div>

      {/* Error Trends Line Chart */}
      <div className="bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Error Trends</h3>
        <LineChart
          data={systemHealthData?.errorTrends || []}
          xField="date"
          yField="errorCount"
          title="Errors Over Time"
          areaFill={true}
          color="#ef4444"
          formatter={(value) => `${value} errors`}
        />
      </div>

      {/* Resource Usage Heatmap */}
      <div className="col-span-1 lg:col-span-2 bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Resource Usage
        </h3>
        <Heatmap
          data={systemHealthData?.resourceUsage || []}
          xField="time"
          yField="resource"
          colorField="usage"
          title="Resource Usage by Time"
          colorRange={["#ebf8ff", "#90cdf4", "#2b6cb0"]}
          height={280}
        />
      </div>

      {/* Job Types Bar Chart */}
      <div className="bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Job Types Distribution
        </h3>
        <BarChart
          data={systemHealthData?.jobTypes || []}
          xField="type"
          yField="count"
          title="Job Distribution by Type"
          horizontal={true}
          height={280}
          formatter={(value) => `${value} jobs`}
        />
      </div>

      {/* Response Time Line Chart */}
      <div className="bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Response Time Trends
        </h3>
        <LineChart
          data={systemHealthData?.responseTimes || []}
          xField="date"
          yField="time"
          title="Response Time (ms)"
          color="#10b981"
          formatter={(value) => `${value}ms`}
        />
      </div>
    </div>
  );
};

export default SystemHealthTab;
