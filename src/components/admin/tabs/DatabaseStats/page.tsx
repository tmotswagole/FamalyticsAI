import { useState, useEffect } from "react";
import { BarChart, LineChart, PieChart } from "../../charts";
import MetricCard from "../../MetricCard/page";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with environment variables for URL and anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface DatabaseStatsTabProps {
  startDate: string; // Start date for filtering database metrics
  endDate: string; // End date for filtering database metrics
}

const DatabaseStatsTab = ({ startDate, endDate }: DatabaseStatsTabProps) => {
  const [loading, setLoading] = useState(true); // State to track loading status

  // Define the structure of the database statistics data
  interface DbStatsData {
    totalSize: number; // Total size of the database in bytes
    tableCounts?: { total: number }; // Total number of tables
    connections?: { active: number; idle: number; percentUsed: number }; // Connection stats
    tableSizes?: { tableName: string; sizeBytes: number }[]; // Sizes of individual tables
    slowestQueries?: { queryType: string; avgExecutionTime: number }[]; // Slowest query types
    indexUsage?: { indexName: string; scans: number; reads: number }[]; // Index usage stats
    performanceTrends?: {
      timestamp: string;
      queryTime: number;
      connectionCount: number;
    }[]; // Performance trends over time
    tableGrowth?: { date: string; rowCount: number }[]; // Table growth over time
    recommendations?: {
      priority: string;
      title: string;
      description: string;
    }[]; // Recommendations for database health
  }

  const [dbStatsData, setDbStatsData] = useState<DbStatsData | null>(null); // State to store fetched data

  // Fetch data from Supabase using the RPC function `get_db_stats_data`
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true before fetching data
      try {
        // Call the Supabase RPC function with the provided date range
        const result = await supabase.rpc("get_db_stats_data", {
          startDate: startDate, // Pass start date as a parameter
          endDate: endDate, // Pass end date as a parameter
        });

        // Extract the data from the RPC result
        const data: DbStatsData = result.data;
        setDbStatsData(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching database statistics:", error); // Log any errors
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    };
    fetchData(); // Trigger the data fetch on component mount or when dates change
  }, [startDate, endDate]); // Re-run effect when startDate or endDate changes

  if (loading) {
    // Render a loading skeleton while data is being fetched
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-4 md:p-6 rounded-xl shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-40 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Helper function to format sizes (e.g., bytes to MB, GB, etc.)
  const formatSize = (sizeInBytes: number): string => {
    if (!sizeInBytes) return "0 Bytes";

    const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
    const i: number = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return (
      parseFloat((sizeInBytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Database Overview Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Database Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Display key metrics using MetricCard components */}
          <MetricCard
            title="Total Size"
            value={formatSize(dbStatsData?.totalSize || 0)}
            icon="💾"
          />
          <MetricCard
            title="Total Tables"
            value={dbStatsData?.tableCounts?.total || 0}
            icon="🗃️"
          />
          <MetricCard
            title="Active Connections"
            value={dbStatsData?.connections?.active || 0}
            change={`${dbStatsData?.connections?.percentUsed || 0}%`}
            icon="🔌"
          />
          <MetricCard
            title="Idle Connections"
            value={dbStatsData?.connections?.idle || 0}
            icon="⏰"
          />
        </div>
      </div>

      {/* Additional sections for visualizing database metrics */}
      {/* Table Size Distribution */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Table Size Distribution
        </h3>
        <PieChart
          data={dbStatsData?.tableSizes || []}
          nameField="tableName"
          valueField="sizeBytes"
          formatter={formatSize}
          height={300}
        />
      </div>

      {/* Query Performance */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Query Performance
        </h3>
        <BarChart
          data={dbStatsData?.slowestQueries || []}
          xField="queryType"
          yField="avgExecutionTime"
          title="Slowest Queries (ms)"
          formatter={(value) => `${value.toFixed(2)} ms`}
          horizontal={true}
          color="#ef4444"
          height={300}
        />
      </div>

      {/* Index Usage Stats */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Index Usage</h3>
        <BarChart
          data={dbStatsData?.indexUsage || []}
          xField="indexName"
          yField="scans"
          multipleData={["scans", "reads"]}
          title="Index Scans vs Reads"
          stacked={false}
          colorPalette={["#3b82f6", "#10b981"]}
          height={300}
        />
      </div>

      {/* Performance Trends */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Performance Trends
        </h3>
        <LineChart
          data={dbStatsData?.performanceTrends || []}
          xField="timestamp"
          yField="queryTime"
          secondaryYField="connectionCount"
          title="Query Time vs Connections"
          formatter={(value) => `${value.toFixed(2)} ms`}
          height={300}
        />
      </div>

      {/* Table Growth */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Table Growth</h3>
        <LineChart
          data={dbStatsData?.tableGrowth || []}
          xField="date"
          yField="rowCount"
          title="Row Count Over Time"
          color="#8b5cf6"
          areaFill={true}
          formatter={(value) => value.toLocaleString()}
          height={300}
        />
      </div>

      {/* Database Health Recommendations */}
      <div className="col-span-1 lg:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Database Health Recommendations
        </h3>
        <div className="space-y-3">
          {dbStatsData?.recommendations ? (
            dbStatsData.recommendations.map((rec, index) => (
              <div key={index} className="p-3 border rounded-lg flex">
                <div className="mr-3 text-xl">
                  {rec.priority === "high"
                    ? "🔴"
                    : rec.priority === "medium"
                      ? "🟠"
                      : "🟢"}
                </div>
                <div>
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 border rounded-lg bg-green-50 text-green-800">
              No database health issues detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatsTab;
