"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

export default function YearSelector({ selectedYear, years, onYearChange }) {
  const handleYearChange = (e) => {
    onYearChange(parseInt(e.target.value));
  };

  return (
    <div className={styles.year_selector}>
      <h3>Year</h3>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className={styles.year_dropdown}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
