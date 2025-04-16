import React from "react";
import styles from "./datesItems.module.css";
const DatesItems = ({ data }) => {
  return (
    <div className={styles.datesContainer}>
      {Object.keys(data).map((key) => (
        <div className={styles.datesItem} key={key}>
          <p className={styles.label}>{key}</p>
          <p className={styles.value}>{`${data[key]}`}</p>
        </div>
      ))}
    </div>
  );
};

export default DatesItems;
