// components/tabs/FinancialPerformanceTab.tsx
import { useState, useEffect } from "react";
import { LineChart, BarChart, PieChart } from "../../charts";
import MetricCard from "../../MetricCard/page";

const FinancialPerformanceTab = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const [loading, setLoading] = useState(true);
  interface FinancialData {
    mrr: number;
    mrrChange: string;
    arr: number;
    arrChange: string;
    arpu: number;
    arpuChange: string;
    ltv: number;
    ltvChange: string;
    mrrTrend: { date: string; mrr: number }[];
    revenueByPlan: { plan: string; revenue: number }[];
    growthDrivers: {
      month: string;
      newCustomers: number;
      expansions: number;
      contractions: number;
      churn: number;
    }[];
    profitMargins: { date: string; margin: number }[];
  }

  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/financial-performance`);
        const data = await res.json();
        setFinancialData(data);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-background p-4 md:p-6 rounded-xl shadow-sm animate-pulse"
          >
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Key Financial Metrics */}
      <div className="bg-muted p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Key Financials
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(financialData?.mrr || 0)}
            change={financialData?.mrrChange || "+0%"}
            icon="💰"
          />
          <MetricCard
            title="Annual Recurring Revenue"
            value={formatCurrency(financialData?.arr || 0)}
            change={financialData?.arrChange || "+0%"}
            icon="📈"
          />
          <MetricCard
            title="Average Revenue Per User"
            value={formatCurrency(financialData?.arpu || 0)}
            change={financialData?.arpuChange || "+0%"}
            icon="👤"
          />
          <MetricCard
            title="Lifetime Value"
            value={formatCurrency(financialData?.ltv || 0)}
            change={financialData?.ltvChange || "+0%"}
            icon="🏆"
          />
        </div>
      </div>

      {/* MRR Growth Trend */}
      <div className="bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">MRR Growth</h3>
        <LineChart
          data={financialData?.mrrTrend || []}
          xField="date"
          yField="mrr"
          title="Monthly Recurring Revenue"
          areaFill={true}
          color="#10b981"
          formatter={formatCurrency}
        />
      </div>

      {/* Revenue by Plan Type */}
      <div className="bg-muted p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Revenue by Plan
        </h3>
        <PieChart
          data={financialData?.revenueByPlan || []}
          nameField="plan"
          valueField="revenue"
          title="Revenue Distribution"
          formatter={formatCurrency}
          innerRadius={60}
        />
      </div>

      {/* Revenue Growth Drivers */}
      <div className="bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Revenue Growth Drivers
        </h3>
        <BarChart
          data={financialData?.growthDrivers || []}
          xField="month"
          yField="newCustomers" // Specify a default yField
          multipleData={["newCustomers", "expansions", "contractions", "churn"]}
          stacked={true}
          title="MRR Change Components"
          formatter={formatCurrency}
          colorPalette={["#10b981", "#3b82f6", "#f97316", "#ef4444"]}
        />
      </div>

      {/* Profitability Metrics */}
      <div className="bg-background p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Profitability</h3>
        <LineChart
          data={financialData?.profitMargins || []}
          xField="date"
          yField="margin"
          title="Profit Margin (%)"
          color="#8b5cf6"
          formatter={(value) => `${value}%`}
        />
      </div>
    </div>
  );
};

export default FinancialPerformanceTab;
