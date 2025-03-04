"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

export default function YearSelector({ selectedYear, years, onYearChange }) {
  const handleYearChange = (e) => {
    onYearChange(parseInt(e.target.value));
  };

  return (
    <div className={styles.yearSelector}>
      <h3>Year</h3>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className={styles.yearDropdown}
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
}
