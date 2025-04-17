"use client";

import styles from "../dashboard.module.css";

export default function TotalsCard({
  title,
  value,
  backgroundColor,
  textColor = "black",
}) {
  return (
    <div
      className={styles.total_box}
      style={{ backgroundColor, color: textColor }}
    >
      <h3>{title}</h3>
      <div className={styles.total_value}>{value}</div>
    </div>
  );
}
