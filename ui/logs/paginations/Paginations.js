import React from "react";
import styles from "./paginations.module.css";

const Paginations = ({ page, setPage, totalPages, totalRecords }) => {
  return (
    <div className={styles.pagination_container}>
      <div className={styles.total_records}>Total Records: {totalRecords}</div>
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={styles.page_button}
        >
          Previous
        </button>
        <span className={styles.page_info}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={styles.page_button}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Paginations;
