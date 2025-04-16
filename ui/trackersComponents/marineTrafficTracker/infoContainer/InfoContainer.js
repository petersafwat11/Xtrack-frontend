import React from "react";
import styles from "./infoContainer.module.css";
const InfoContainer = ({ data }) => {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.vesselInfoContent}>
        {Object.keys(data).map((key) => (
          <div className={styles.vesselItem} key={key}>
            <p className={styles.vesselLabel}>{key}</p>
            <p className={styles.vesselValue}>{data[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoContainer;
