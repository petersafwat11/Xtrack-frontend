"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./logs.module.css";
import api from "@/lib/axios";
import FiltersAndAction from "./filtersAndActions/FiltersAndAction";
import Paginations from "./paginations/Paginations";
import Table from "../trackersComponents/commen/table/Table";

const Logs = ({ userID }) => {
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Date range initialization
  let prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 7);
  const [dateRange, setDateRange] = useState({
    from: prevDate,
    to: new Date(),
  });

  // Data and loading states
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/tracking", {
        params: {
          page,
          limit,
          search,
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
          user_id: userID,
          status,
          sortField: "api_date",
          sortOrder,
        },
      });

      if (response.data.status === "success") {
        setLogs(response.data.data);
        setTotalRecords(response.data.results);
        setTotalPages(Math.ceil(response.data.results / limit));
      } else {
        setError("Failed to fetch logs: Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError(err.response?.data?.message || "Failed to fetch logs");
      setLogs([]);
      setTotalPages(0);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, dateRange, userID, status, sortOrder]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Toggle sort order when clicking on the Date column
  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setPage(1); // Reset to first page when sorting
  };

  const exportToExcel = async () => {
    try {
      setExportLoading(true);

      // Create URL with current filter parameters
      const params = new URLSearchParams({
        search,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        user_id: userID,
        status,
        sortField: "api_date",
        sortOrder,
      });

      // Use window.open to trigger file download
      window.open(
        `${
          process.env.NEXT_PUBLIC_BACKEND_SERVER
        }/api/tracking/export?${params.toString()}`
      );
    } catch (err) {
      console.error("Error exporting logs:", err);
    } finally {
      setExportLoading(false);
    }
  };
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date
      .toLocaleDateString("en-GB", options)
      .replace(",", "")
      .replace(/ /g, "-");
  };
  const getSortIcon = () => {
    return sortOrder === "desc" ? "↑" : "↓";
  };

  return (
    <div className={styles.container}>
      <FiltersAndAction
        dateRange={dateRange}
        setDateRange={setDateRange}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        loading={loading}
        exportLoading={exportLoading}
        fetchLogs={fetchLogs}
        exportToExcel={exportToExcel}
        userID={userID}
      />

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error_fetching}>{error}</div>
      ) : (
        <>
          {logs.length > 0 && (
            <>
              <Table
                headers={[
                  "User ID",
                  <DateHeader
                    handleSort={handleSort}
                    getSortIcon={getSortIcon}
                    key="date-header"
                  />,
                  // "Date",
                  "Menu",
                  "Request",
                  "Status",
                  "Error Description",
                  "IP Config",
                  "Location",
                ]}
                data={logs?.map((log) => ({
                  user_id: log.user_id,
                  api_date: formatDate(log.api_date),
                  menu_id: log.menu_id,
                  api_request: log.api_request,
                  api_status: getStatusElement(log.api_status),
                  api_error: log.api_error || "-",
                  ip_config: log.ip_config,
                  ip_location: log.ip_location || "-",
                }))}
                smallPadding={true}
              />
              <Paginations
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Logs;

// Helper function to get status element instead of component
const getStatusElement = (status) => {
  return (
    <span className={status === "S" ? styles.success : styles.error}>
      {status === "S" ? "Success" : "Failed"}
    </span>
  );
};

const DateHeader = ({ handleSort, getSortIcon }) => {
  return (
    <th
      className={`${styles.header_item} ${styles.sortable}`}
      onClick={handleSort}
    >
      Date {getSortIcon()}
    </th>
  );
};
