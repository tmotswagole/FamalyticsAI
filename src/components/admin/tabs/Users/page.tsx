// Import necessary hooks and libraries
import { useState, useEffect } from "react"; // React hooks for state and lifecycle management
import { createClient } from "@supabase/supabase-js"; // Supabase client for database interaction
import { LineChart, BarChart, PieChart } from "../../charts"; // Custom chart components
import MetricCard from "../../MetricCard/page"; // Custom metric card component

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Define the UsersTab component
const UsersTab = ({
  startDate,
  endDate,
}: {
  startDate: Date; // Start date for data filtering
  endDate: Date; // End date for data filtering
}) => {
  const [loading, setLoading] = useState(true); // State to track loading status
  interface UserData {
    // Interface defining the structure of user data
    totalUsers?: number; // Total number of users
    userGrowthRate?: string; // Growth rate of users
    activeUsers?: number; // Number of active users
    activeUserChange?: string; // Change in active users
    newSignups?: number; // Number of new signups
    signupChange?: string; // Change in new signups
    conversionRate?: number; // Conversion rate percentage
    conversionRateChange?: string; // Change in conversion rate
    userGrowthTrend?: {
      date: string; // Date of the trend
      userCount: number; // Total user count
      activeUsers: number; // Active user count
    }[];
    newSignupsByDay?: { date: string; count: number }[]; // Daily new signups
    userSegments?: { segment: string; count: number }[]; // User segmentation data
    engagementMetrics?: {
      date: string; // Date of engagement
      sessionsPerUser: number; // Sessions per user
      avgSessionDuration: number; // Average session duration
    }[];
    retentionCohorts?: { cohortDate: string; retention: number[] }[]; // Retention cohort data
    trafficSources?: {
      source: string; // Traffic source
      users: number; // Number of users from the source
      conversionRate: number; // Conversion rate for the source
    }[];
    geoDistribution?: { country: string; users: number }[]; // Geographical distribution of users
  }

  const [userData, setUserData] = useState<UserData | null>(null); // State to store user data

  // Fetch data from the database using Supabase RPC
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const res = await supabase.rpc("get_user_dashboard_data", {
          start_date: startDate.toISOString(), // Pass start date as ISO string
          end_date: endDate.toISOString(), // Pass end date as ISO string
        });

        const data: UserData = res.data; // Extract data from the response
        setUserData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching user metrics data:", error); // Log errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData(); // Call the fetchData function
  }, [startDate, endDate]); // Re-run effect when startDate or endDate changes

  // Show loading skeleton while data is being fetched
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
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

  // Render the dashboard with user metrics and visualizations
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* User Metrics Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">User Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Metric cards for various user metrics */}
          <MetricCard
            title="Total Users"
            value={userData?.totalUsers?.toLocaleString() || "0"}
            change={userData?.userGrowthRate || "+0%"}
            icon="👥"
          />
          <MetricCard
            title="Active Users"
            value={userData?.activeUsers?.toLocaleString() || "0"}
            change={userData?.activeUserChange || "+0%"}
            icon="🔵"
          />
          <MetricCard
            title="New Signups"
            value={userData?.newSignups?.toLocaleString() || "0"}
            change={userData?.signupChange || "+0%"}
            icon="✨"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${userData?.conversionRate || "0"}%`}
            change={userData?.conversionRateChange || "0%"}
            icon="🔄"
          />
        </div>
      </div>

      {/* User Growth Trend Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">User Growth</h3>
        <LineChart
          data={userData?.userGrowthTrend || []} // Data for the line chart
          xField="date" // X-axis field
          yField="userCount" // Y-axis field
          secondaryYField="activeUsers" // Secondary Y-axis field
          title="Total vs Active Users" // Chart title
          areaFill={true} // Enable area fill
          formatter={(value) => value.toLocaleString()} // Format values
          height={300} // Chart height
        />
      </div>

      {/* New Signups by Day Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">New Signups</h3>
        <BarChart
          data={userData?.newSignupsByDay || []} // Data for the bar chart
          xField="date" // X-axis field
          yField="count" // Y-axis field
          color="#10b981" // Bar color
          title="Daily New User Registrations" // Chart title
          formatter={(value) => value.toLocaleString()} // Format values
          height={300} // Chart height
        />
      </div>

      {/* User Segments Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">User Segments</h3>
        <PieChart
          data={userData?.userSegments || []} // Data for the pie chart
          nameField="segment" // Field for segment names
          valueField="count" // Field for segment values
          title="User Distribution" // Chart title
          innerRadius={60} // Inner radius for donut chart
          height={300} // Chart height
        />
      </div>

      {/* User Engagement Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          User Engagement
        </h3>
        <LineChart
          data={userData?.engagementMetrics || []} // Data for the line chart
          xField="date" // X-axis field
          yField="sessionsPerUser" // Y-axis field
          secondaryYField="avgSessionDuration" // Secondary Y-axis field
          title="Sessions & Duration" // Chart title
          formatter={(value) =>
            value > 60
              ? `${Math.floor(value / 60)}m ${value % 60}s` // Format duration
              : value.toFixed(1)
          }
          height={300} // Chart height
        />
      </div>

      {/* Retention Cohort Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          User Retention
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cohort
                </th>
                {/* Render week headers dynamically */}
                {userData?.retentionCohorts?.[0]?.retention.map((_, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Week {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Render retention data for each cohort */}
              {userData?.retentionCohorts?.map((cohort, cohortIndex) => (
                <tr key={cohortIndex}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cohort.cohortDate}
                  </td>
                  {cohort.retention.map((value, i) => (
                    <td
                      key={i}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <div
                        className="px-2 py-1 rounded text-center"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${value / 100})`, // Dynamic background color
                          color: value > 50 ? "white" : "black", // Text color based on value
                        }}
                      >
                        {value}% {/* Retention percentage */}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic Sources Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Traffic Sources
        </h3>
        <BarChart
          data={userData?.trafficSources || []} // Data for the bar chart
          xField="source" // X-axis field
          yField="users" // Y-axis field
          title="Users by Source" // Chart title
          formatter={(value) => value.toLocaleString()} // Format values
          horizontal={true} // Render bars horizontally
          height={300} // Chart height
        />
      </div>

      {/* Geographical Distribution Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Geographical Distribution
        </h3>
        <BarChart
          data={userData?.geoDistribution || []} // Data for the bar chart
          xField="country" // X-axis field
          yField="users" // Y-axis field
          title="Users by Country" // Chart title
          formatter={(value) => value.toLocaleString()} // Format values
          horizontal={true} // Render bars horizontally
          color="#8b5cf6" // Bar color
          height={300} // Chart height
        />
      </div>
    </div>
  );
};

export default UsersTab; // Export the component
