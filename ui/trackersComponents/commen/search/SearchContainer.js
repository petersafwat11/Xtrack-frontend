import React from "react";
import styles from "./searchContainer.module.css";
const SearchContainer = ({
  label,
  loading,
  fetchData,
  searchNumber,
  handleSearchChange,
}) => {
  return (
    <div className={styles.search_section}>
      <div className={styles.search_form}>
        <div className={styles.search_input_container}>
          <p className={styles.search_label}>{label}</p>

          <input
            type="text"
            value={searchNumber}
            onChange={handleSearchChange}
            placeholder="Enter tracking number"
            className={styles.search_input}
            maxLength={12}
          />
        </div>
        <button
          onClick={fetchData}
          className={styles.search_button}
          disabled={loading}
        >
          {loading ? "Tracking..." : "Track"}
        </button>
      </div>
    </div>
  );
};

export default SearchContainer;
