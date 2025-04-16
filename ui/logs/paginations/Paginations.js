import React from "react";
import styles from "./paginations.module.css";

const Paginations = ({ page, setPage, totalPages, totalRecords }) => {
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.totalRecords}>Total Records: {totalRecords}</div>
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={styles.pageButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Paginations;
