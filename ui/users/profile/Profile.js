"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import styles from "./profile.module.css";
import DateInput from "../../inputs/dateInput/DateInput";
import CustomCheckbox from "../../inputs/checkbox/CustomCheckbox";
import {
  permissionCheckboxes,
  userFormFields,
  getDefaultFormData,
  generateRandomPassword,
} from "./profileHelper";

const Profile = ({ initialData, isNewUser = false, admin }) => {
  console.log("initialData", initialData);
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialData || getDefaultFormData(isNewUser, admin)
  );

  // Generate a random password when creating a new user
  useEffect(() => {
    if (isNewUser && !formData.user_pwd) {
      setFormData((prev) => ({
        ...prev,
        user_pwd: generateRandomPassword(),
      }));
    }
  }, [isNewUser, formData.user_pwd]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        await api.post("/api/users", formData);
      } else {
        await api.patch(`/api/users/${formData.user_id}`, formData);
      }
      router.push("/users");
    } catch (error) {
      console.error("Error saving user:", error);
      //   alert(error.response?.data?.message || 'Error saving user data');
    }
  };

  const handleCancel = () => {
    router.push("/users");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>{isNewUser ? "Create New User" : "Edit User"}</h2>

        {userFormFields.map((field) => (
          <div className={styles.formGroup} key={field.id}>
            <label htmlFor={field.id}>
              {field.label}: <span className={styles.required}>*</span>
              {field.id === "user_id" && " "}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              required={
                field.required && (field.id !== "user_pwd" || isNewUser)
              }
              disabled={
                field.disabledWhen ? field.disabledWhen(isNewUser) : false
              }
              readOnly={
                field.readOnlyWhen ? field.readOnlyWhen(isNewUser) : false
              }
              placeholder={
                field.placeholderWhen ? field.placeholderWhen(isNewUser) : ""
              }
            />
            {field.note && field.note(isNewUser) && (
              <p className={styles.passwordNote}>{field.note(isNewUser)}</p>
            )}
          </div>
        ))}

        {admin && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="valid_till">
                Valid Till: <span className={styles.required}>*</span>
              </label>
              <DateInput
                data={formData}
                dataKey="valid_till"
                setData={setFormData}
              />
            </div>

            <div className={styles.adminSection}>
              <h3>User Permissions</h3>
              <div className={styles.checkboxGrid}>
                {permissionCheckboxes.map((checkbox) => (
                  <CustomCheckbox
                    key={checkbox.id}
                    label={checkbox.label}
                    checked={formData[checkbox.id]}
                    onChange={handleCheckboxChange}
                    name={checkbox.id}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
