// This component displays audit logs along with charts that visualize event data.
// It fetches audit log data from an API and supports filtering, sorting, searching, and pagination.

import { useState, useEffect } from "react";
import { BarChart, LineChart } from "../../charts";

const AuditLogsTab = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  // Manage whether the data is currently loading.
  const [loading, setLoading] = useState(true);
  // Store the audit log data fetched from the API.
  interface AuditLog {
    user_id?: string;
    created_at: string;
    payload?: {
      eventType?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  const [auditData, setAuditData] = useState<AuditLog[] | null>(null);
  // Store the logs after applying search and sorting filters.
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  // Store the currently selected event type filter.
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  // Store the search term entered by the user.
  const [searchTerm, setSearchTerm] = useState("");
  // Track the current page number for pagination.
  const [currentPage, setCurrentPage] = useState(1);
  // Field used to sort the logs (default is 'created_at').
  const [sortField, setSortField] = useState("created_at");
  // Direction for sorting: ascending ('asc') or descending ('desc').
  const [sortDirection, setSortDirection] = useState("desc");
  // Number of logs to show per page.
  const logsPerPage = 10;

  // useEffect to fetch audit log data when startDate, endDate, or eventTypeFilter changes.
  useEffect(() => {
    const fetchData = async () => {
      // Set loading to true while fetching data.
      setLoading(true);
      try {
        // Build the API endpoint with the startDate, endDate, and eventTypeFilter.
        const res = await fetch(
          `/api/admin/audit-logs?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&eventType=${eventTypeFilter}`
        );
        // Convert the response to JSON.
        const response = await res.json();
        // Save the audit logs data. If data is missing, use an empty array.
        setAuditData(response.data || []);
      } catch (error) {
        // Log any error that occurs during fetching.
        console.error("Error fetching audit logs:", error);
      } finally {
        // Stop the loading indicator.
        setLoading(false);
      }
    };
    // Call the fetch function.
    fetchData();
  }, [startDate, endDate, eventTypeFilter]);

  // useEffect to filter and sort the logs whenever the auditData, searchTerm, or sort parameters change.
  useEffect(() => {
    if (!auditData) return; // Do nothing if there is no data yet.

    // Start with a copy of the full auditData array.
    let filtered = [...auditData];

    // Apply search filtering if a searchTerm is provided.
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      // Filter logs by checking if user_id, eventType, or any payload content includes the search term.
      filtered = filtered.filter(
        (log) =>
          log.user_id?.toLowerCase().includes(searchLower) ||
          log.payload?.eventType?.toLowerCase().includes(searchLower) ||
          JSON.stringify(log.payload).toLowerCase().includes(searchLower)
      );
    }

    // Sort the filtered logs based on the sortField and sortDirection.
    filtered.sort((a, b) => {
      // For 'created_at', sort by date. Otherwise, convert values to strings.
      const fieldA =
        sortField === "created_at"
          ? new Date(a[sortField])
          : String(a[sortField] || "");
      const fieldB =
        sortField === "created_at"
          ? new Date(b[sortField])
          : String(b[sortField] || "");

      // Compare the two fields according to the selected sort direction.
      if (sortDirection === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    // Update the filteredLogs state with the new filtered and sorted logs.
    setFilteredLogs(filtered);
    // Reset the current page to 1 when the filter or sort changes.
    setCurrentPage(1);
  }, [auditData, searchTerm, sortField, sortDirection]);

  // Function to calculate the count of events by their type for the bar chart.
  const getEventCountsByType = () => {
    if (!auditData) return [];

    // Use an object to count occurrences of each event type.
    const counts: Record<string, number> = {};
    auditData.forEach((log) => {
      // Use the eventType from payload or 'unknown' if not available.
      const eventType = log.payload?.eventType || "unknown";
      counts[eventType] = (counts[eventType] || 0) + 1;
    });

    // Convert the counts object into an array of objects for the chart.
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
    }));
  };

  // Function to compute the activity timeline data for the line chart.
  const getActivityOverTime = () => {
    if (!auditData) return [];

    // Group logs by day.
    const activityByDay: Record<string, number> = {};
    auditData.forEach((log) => {
      // Get the date part from the created_at timestamp.
      const date = new Date(log.created_at).toISOString().split("T")[0];
      activityByDay[date] = (activityByDay[date] || 0) + 1;
    });

    // Convert the grouped data into an array and sort by date.
    return Object.entries(activityByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Function to extract unique event types from the audit logs.
  const getUniqueEventTypes = () => {
    if (!auditData) return [];

    // Use a Set to collect unique event types.
    const types = new Set();
    auditData.forEach((log) => {
      if (log.payload?.eventType) {
        types.add(log.payload.eventType);
      }
    });

    // Convert the Set into an array.
    return Array.from(types);
  };

  // Pagination logic:
  // Calculate the indices to slice the filtered logs for the current page.
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  // Slice the array to only include logs for the current page.
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  // Calculate the total number of pages.
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Function to toggle sorting for a given field.
  // If the same field is clicked, the sort direction is reversed.
  // Otherwise, the sort field is changed and direction resets to ascending.
  const toggleSort = (field: string): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Utility function to format a date string into a readable format.
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Utility function to truncate long strings.
  // If the string is longer than the given length, cut it off and add ellipsis.
  interface TruncateOptions {
    str: string;
    length?: number;
  }

  const truncate = (str: string, length: number = 30): string => {
    if (!str) return "";
    return str.length > length ? str.substring(0, length) + "..." : str;
  };

  // Show a loading skeleton while data is being fetched.
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm animate-pulse">
          {/* Simulated title loading */}
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          {/* Simulated chart loading */}
          <div className="h-40 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm animate-pulse">
          {/* Simulated filter loading */}
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-100 rounded mb-4"></div>
          {/* Simulated logs list loading */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render the charts, filters, logs table, and pagination controls.
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart for Event Types */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Event Types</h3>
          <BarChart
            data={getEventCountsByType()}
            xField="type"
            yField="count"
            horizontal={true}
            height={250}
            formatter={(value) => `${value} events`}
          />
        </div>

        {/* Line Chart for Activity Timeline */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
          <h3 className="text-lg md:text-xl font-semibold mb-4">
            Activity Timeline
          </h3>
          <LineChart
            data={getActivityOverTime()}
            xField="date"
            yField="count"
            areaFill={true}
            color="#8b5cf6"
            height={250}
            formatter={(value) => `${value} events`}
          />
        </div>
      </div>

      {/* Audit Log Listing */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Audit Logs</h3>

        {/* Filters and Search Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search logs
            </label>
            <div className="relative">
              {/* Search icon positioned inside the input field */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search audit logs"
                value={searchTerm}
                // Update search term state as user types
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Event Type Filter Dropdown */}
          <div className="w-full md:w-48">
            <label htmlFor="event-type" className="sr-only">
              Filter by event type
            </label>
            <select
              id="event-type"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={eventTypeFilter}
              // Update event type filter state when a new type is selected
              onChange={(e) => setEventTypeFilter(e.target.value)}
            >
              <option value="">All Event Types</option>
              {/* Create an option for each unique event type found in the data */}
              {getUniqueEventTypes().map((type) => (
                <option key={String(type)} value={type as string}>
                  {String(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logs Table Section */}
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Clickable table header for Timestamp */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("created_at")}
                >
                  <div className="flex items-center">
                    Timestamp
                    {sortField === "created_at" && (
                      // Display an arrow to indicate the sort direction
                      <svg
                        className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                {/* Clickable table header for User ID */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("user_id")}
                >
                  <div className="flex items-center">
                    User ID
                    {sortField === "user_id" && (
                      // Display an arrow to indicate the sort direction for user_id column
                      <svg
                        className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                {/* Static header for Event Type */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event Type
                </th>
                {/* Static header for Details */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.length > 0 ? (
                // Map each log to a table row
                currentLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* Display formatted timestamp */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.created_at)}
                    </td>
                    {/* Display user ID or 'System' if missing */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user_id || "System"}
                    </td>
                    {/* Display event type from the payload or 'Unknown' if not provided */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.payload?.eventType || "Unknown"}
                    </td>
                    {/* Display a truncated version of the log details */}
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      <div
                        className="tooltip"
                        title={JSON.stringify(log.payload, null, 2)}
                      >
                        {truncate(JSON.stringify(log.payload))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Show a message if no logs match the current filters
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No audit logs found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {filteredLogs.length > logsPerPage && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
            {/* Mobile pagination controls */}
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            {/* Desktop pagination controls */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstLog + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastLog, filteredLogs.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredLogs.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Generate page numbers dynamically.
                      If the total pages exceed 5, only a subset is shown.
                      The current page is highlighted. */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      const middle = Math.min(
                        Math.max(currentPage, 3),
                        totalPages - 2
                      );
                      pageNum = i + middle - 2;
                      if (pageNum < 1) pageNum = i + 1;
                      if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsTab;
