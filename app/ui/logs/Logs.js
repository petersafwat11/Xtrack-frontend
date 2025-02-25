"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./logs.module.css";
import api from "@/app/lib/axios";
import DateInput from "../inputs/dateInput/DateInput";
import Cookies from "js-cookie";

const Logs = () => {
  const userID = JSON.parse(Cookies.get('user'))?.user_id|| 'petersafwat';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  let prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 7);
  const [dateRange, setDateRange] = useState({
    from: prevDate,
    to: new Date()
  });
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching logs with params:', {
        page,
        limit,
        search,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        user_id: userID
      });

      const response = await api.get('/api/tracking', {
        params: {
          page,
          limit,
          search,
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
          user_id: userID
        }
      });

      console.log('Response:', response.data);

      if (response.data.status === 'success') {
        setLogs(response.data.data);
        setTotalPages(Math.ceil(response.data.results / limit));
      } else {
        setError('Failed to fetch logs: Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch logs');
      setLogs([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, dateRange, userID]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '').replace(/ /g, "-");
  }


  return (
    <div className={styles.container}>
      <div className={styles.filters}>
            <div className={styles.inputContainer}>
              <p className={styles.searchLabel}>From</p>
              <DateInput
                label="From"
                data={dateRange}
                dataKey="from"
                onChange={setDateRange}
              />
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.searchLabel}>To</p>
              <DateInput
                label="To"
                data={dateRange}
                dataKey="to"
                onChange={setDateRange}
              />
            </div>
            <button
            onClick={fetchLogs}
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </div>

      <div className={styles.searchContainer}>
        <p className={styles['user-id']}>User : {userID}</p>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
            <tr className={styles["table-header"]}>
                <th className={styles["header-item"]}>User ID</th>
                <th className={styles["header-item"]}>Date</th>
                <th className={styles["header-item"]}>Menu</th>
                <th className={styles["header-item"]}>Request</th>
                <th className={styles["header-item"]}>Status</th>
                <th className={styles["header-item"]}>Error Description</th>
                <th className={styles["header-item"]}>IP Config</th>
                <th className={styles["header-item"]}>Location</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr className={styles["table-row"]}  key={log.log_id}>
                  <td className={styles["row-item"]}>{log.user_id}</td>
                  <td className={styles["row-item"]}>{formatDate(log.api_date)}</td>
                  <td className={styles["row-item"]}>{log.menu_id}</td>
                  <td className={styles["row-item"]}>{log.api_request}</td>
                  <td className={log.api_status === 'S' ? styles.success : styles.error}>
                    {log.api_status === 'S' ? 'Success' : 'Failed'}
                  </td>
                  <td className={styles["row-item"]}>{log.api_error || '-'}</td>
                  <td className={styles["row-item"]}>{log.ip_config}</td>
                  <td className={styles["row-item"]}>{log.ip_location || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;