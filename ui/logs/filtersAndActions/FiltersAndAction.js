import React from "react";
import styles from "./filtersAndAction.module.css";
import DateInput from "../../inputs/dateInput/DateInput";

const FiltersAndAction = ({
  dateRange,
  setDateRange,
  search,
  setSearch,
  status,
  setStatus,
  loading,
  exportLoading,
  fetchLogs,
  exportToExcel,
  userID,
}) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusFilter = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.input_container}>
          <p className={styles.search_label}>From</p>
          <DateInput
            label="From"
            data={dateRange}
            dataKey="from"
            setData={setDateRange}
          />
        </div>
        <div className={styles.input_container}>
          <p className={styles.search_label}>To</p>
          <DateInput
            label="To"
            data={dateRange}
            dataKey="to"
            setData={setDateRange}
          />
        </div>
        <button
          onClick={fetchLogs}
          className={styles.search_button}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className={styles.search_container}>
        <p className={styles.user_id}>User : {userID}</p>
        <div className={styles.search_controls}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className={styles.search_input}
          />
          <div className={styles.status_buttons}>
            <button
              className={`${styles.status_button} ${
                status === "" ? styles.status_active : ""
              }`}
              onClick={() => handleStatusFilter("")}
            >
              All
            </button>
            <button
              className={`${styles.status_button} ${styles.success_button} ${
                status === "S" ? styles.status_active : ""
              }`}
              onClick={() => handleStatusFilter("S")}
            >
              Success
            </button>
            <button
              className={`${styles.status_button} ${styles.failure_button} ${
                status === "F" ? styles.status_active : ""
              }`}
              onClick={() => handleStatusFilter("F")}
            >
              Failure
            </button>
          </div>
          <button
            onClick={exportToExcel}
            className={styles.export_button}
            disabled={exportLoading || loading}
          >
            {exportLoading ? "Exporting..." : "Export to Excel"}
          </button>
        </div>
      </div>
    </>
  );
};

export default FiltersAndAction;
