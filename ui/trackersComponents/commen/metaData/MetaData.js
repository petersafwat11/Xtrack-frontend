import React from "react";
import styles from "./metaData.module.css";

const MetaData = ({ metadata }) => {
  return (
    <div className={styles.metadata}>
      {metadata.map((item, index) => (
        <div className={styles.metadataItem} key={index}>
          <p className={styles.label}>{item.label}</p>
          <p className={styles.value}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default MetaData;
