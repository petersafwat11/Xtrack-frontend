"use client";
import React, { useState, useEffect } from "react";
import styles from "./forgetPassword.module.css";
import { toast } from "react-hot-toast";
import api from "@/app/lib/axios";

const ForgetPassword = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { user_id } = JSON.parse(userData);
      setUserId(user_id);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please login again");
      return;
    }

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords don't match");
      toast.error("New passwords don't match");
      return;
    }

    // Validate password length
    if (formData.new_password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await api.post("/api/users/change-password", {
        user_id: userId,
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully");
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const preventCopyPaste = (e) => {
    e.preventDefault();
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Change Password</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              id="old_password"
              type="password"
              name="old_password"
              placeholder="Enter current password"
              value={formData.old_password}
              onChange={handleChange}
              required
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
              onCut={preventCopyPaste}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              id="new_password"
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              required
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
              onCut={preventCopyPaste}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              id="confirm_password"
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
              onCut={preventCopyPaste}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitButton}>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
