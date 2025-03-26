// pages/admin/index.tsx
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SystemHealthTab from "../../../components/admin/tabs/SystemHealth/page";
import FinancialPerformanceTab from "../../../components/admin/tabs/FinancialPerformance/page";
import AuditLogsTab from "../../../components/admin/tabs/AuditLogs/page";
import DatabaseStatsTab from "../../../components/admin/tabs/DatabaseStats/page";
import UsersTab from "../../../components/admin/tabs/Users/page";
// Import other tab components as needed

// Icons for sidebar navigation
const Icons = {
  "system-health": "📊",
  "audit-logs": "📝",
  "database-stats": "🗄️",
  sales: "💰",
  financial: "💵",
  kpi: "📈",
  users: "👥",
  churn: "↩️",
  forecast: "🔮",
  menu: "☰",
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("system-health");
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ); // 30 days ago
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile on initial load
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "system-health":
        return <SystemHealthTab startDate={startDate} endDate={endDate} />;
      case "financial":
        return (
          <FinancialPerformanceTab startDate={startDate} endDate={endDate} />
        );
      case "audit-logs":
        return <AuditLogsTab startDate={startDate} endDate={endDate} />;
      case "database-stats":
        return <DatabaseStatsTab startDate={startDate.toISOString()} endDate={endDate.toISOString()} />;
      case "users":
        return <UsersTab startDate={startDate} endDate={endDate} />;
      // Add other cases as components are created
      default:
        return (
          <div className="bg-background p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              {activeTab
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </h3>
            <p className="text-foreground">
              This dashboard section is coming soon. Please check back later.
            </p>
          </div>
        );
    }
  };

  const navItems = [
    { id: "system-health", name: "System Health" },
    { id: "audit-logs", name: "Audit Logs" },
    { id: "database-stats", name: "Database Stats" },
    { id: "financial", name: "Financial" },
    { id: "users", name: "User Growth" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar Toggle Button - Visible only on mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-blue-600 text-foreground rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {Icons["menu"]}
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobile
            ? sidebarCollapsed
              ? "hidden"
              : "fixed inset-y-0 left-0 z-10 w-64"
            : sidebarCollapsed
              ? "w-16"
              : "w-64"
        } bg-background shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div
          className={`p-4 flex ${sidebarCollapsed ? "justify-center" : "justify-between"} items-center`}
        >
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-foreground">
              Admin Dashboard
            </h1>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-accent"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          )}
        </div>
        <nav className="mt-4">
          {navItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (isMobile) setSidebarCollapsed(true);
              }}
              className={`w-full flex items-center ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              } px-4 py-3 ${
                activeTab === tab.id
                  ? "bg-background text-foreground"
                  : "hover:bg-accent"
              } transition duration-150`}
              title={sidebarCollapsed ? tab.name : ""}
              aria-label={tab.name}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span className="text-xl mr-2">
                {Icons[tab.id as keyof typeof Icons]}
              </span>
              {!sidebarCollapsed && <span>{tab.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "pt-16" : ""}`}>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-2xl md:text-3xl font-semibold capitalize mb-4 md:mb-0">
            {activeTab.replace(/-/g, " ")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative">
              <label
                htmlFor="start-date-picker"
                className="block text-sm text-foreground mb-1"
              >
                Start Date
              </label>
              <DatePicker
                id="start-date-picker"
                selected={startDate}
                onChange={(date: Date | null) => date && setStartDate(date)}
                className="p-2 border rounded-md w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dateFormat="MMM d, yyyy"
                maxDate={endDate}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="end-date-picker"
                className="block text-sm text-foreground mb-1"
              >
                End Date
              </label>
              <DatePicker
                id="end-date-picker"
                selected={endDate}
                onChange={(date: Date | null) => date && setEndDate(date)}
                className="p-2 border rounded-md w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dateFormat="MMM d, yyyy"
                minDate={startDate}
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>

        {/* Main content area for the active tab */}
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
