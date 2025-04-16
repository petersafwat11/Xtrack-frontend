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
        <div className={styles.inputContainer}>
          <p className={styles.searchLabel}>From</p>
          <DateInput
            label="From"
            data={dateRange}
            dataKey="from"
            setData={setDateRange}
          />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.searchLabel}>To</p>
          <DateInput
            label="To"
            data={dateRange}
            dataKey="to"
            setData={setDateRange}
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
        <p className={styles.userId}>User : {userID}</p>
        <div className={styles.searchControls}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <div className={styles.statusButtons}>
            <button
              className={`${styles.statusButton} ${
                status === "" ? styles.statusActive : ""
              }`}
              onClick={() => handleStatusFilter("")}
            >
              All
            </button>
            <button
              className={`${styles.statusButton} ${styles.successButton} ${
                status === "S" ? styles.statusActive : ""
              }`}
              onClick={() => handleStatusFilter("S")}
            >
              Success
            </button>
            <button
              className={`${styles.statusButton} ${styles.failureButton} ${
                status === "F" ? styles.statusActive : ""
              }`}
              onClick={() => handleStatusFilter("F")}
            >
              Failure
            </button>
          </div>
          <button
            onClick={exportToExcel}
            className={styles.exportButton}
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
