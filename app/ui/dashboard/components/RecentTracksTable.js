"use client";

import styles from "../../logs/logs.module.css";

export default function RecentTracksTable({ data }) {
  // Format date for display
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };
  "petersafwat"
  return (
    <div className={styles.recentTracksSection}>
      <h3 style={{ marginBottom: "1rem" }}>Recent Tracks</h3>
      {/* <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.headerItem}>User ID</th>
              <th className={styles.headerItem}>Date</th>
              <th className={styles.headerItem}>Menu</th>
              <th className={styles.headerItem}>Request</th>
              <th className={styles.headerItem}>Status</th>
              <th className={styles.headerItem}>Error</th>
              <th className={styles.headerItem}>IP</th>
              <th className={styles.headerItem}>Location</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <tr className={styles.tableRow} key={record.api_date}>
                <td className={styles.rowItem}>{record.user_id}</td>
                <td className={styles.rowItem}>{formatDate(record.api_date)}</td>
                <td className={styles.rowItem}>{record.menu_id || '-'}</td>
                <td className={styles.rowItem}>{record.api_request}</td>
                <td className={record.api_status === 'S' ? styles.success : styles.error}>
                  {record.api_status === 'S' ? 'Success' : 'Failed'}
                </td>
                <td className={styles.rowItem}>{record.api_error || '-'}</td>
                <td className={styles.rowItem}>{record.ip_config || '-'}</td>
                <td className={styles.rowItem}>{record.ip_location || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && (
          <div className={styles.noData}>No data available</div>
        )}
      </div> */}
      <table className={styles.table}>
            <thead>
              <tr  className={styles["table-header"]}>
                <th 
                  className={`${styles["header-item"]} ${styles.sortable}`}
                >
                  User ID 
                </th>
                <th 
                  className={`${styles["header-item"]} ${styles.sortable}`}
                >
                  Date 
                </th>
                <th 
                  className={`${styles["header-item"]} ${styles.sortable}`}
                >
                  Menu 
                </th>
                <th 
                  className={`${styles["header-item"]} ${styles.sortable}`}
                >
                  Request 
                </th>
                <th 
                  className={`${styles["header-item"]} ${styles.sortable}`}
                >
                  Status 
                </th>
                <th className={styles["header-item"]}>Error Description</th>
                <th className={styles["header-item"]}>IP Config</th>
                <th className={styles["header-item"]}>Location</th>
              </tr>
            </thead>
            <tbody>
              {data&&data.length>0 && data.map((log) => (
                <tr className={styles["table-row"]} key={log.log_id}>
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

    </div>
  );
}
