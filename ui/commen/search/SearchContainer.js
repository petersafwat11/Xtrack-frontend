import React from 'react'
import styles from './searchContainer.module.css'
const SearchContainer = ({ label,loading, fetchData, searchNumber, handleSearchChange}) => {
  return (
    <div className={styles.searchSection}>
    <div className={styles.searchForm}>
      <div className={styles.searchInputContainer}>
        <p className={styles.searchLabel}>{label}</p>

        <input
          type="text"
          value={searchNumber}
          onChange={handleSearchChange}
          placeholder="Enter tracking number"
          className={styles.searchInput}
          maxLength={12}
        />
      </div>
      <button
        onClick={fetchData}
        className={styles.searchButton}
        disabled={loading}
      >
        {loading ? "Tracking..." : "Track"}
      </button>
    </div>
  </div>
)
}

export default SearchContainer