"use client";
import React from "react";
import styles from "./customCheckbox.module.css";

const CustomCheckbox = ({ label, checked, onChange, name }) => {
  return (
    <label className={styles.checkbox_container}>
      {label}
      <input
        type="checkbox"
        checked={checked === "Y"}
        onChange={(e) => onChange(name, e.target.checked ? "Y" : "N")}
        className={styles.hidden_checkbox}
      />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default CustomCheckbox;
