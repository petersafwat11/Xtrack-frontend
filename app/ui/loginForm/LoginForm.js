"use client";
import React, { useState } from "react";
import styles from "./loginForm.module.css";
import { toast } from "react-hot-toast";
import api from "@/app/lib/axios";
import { useRouter } from "next/navigation";

const LoginForm = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_id: "",
    user_pwd: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/users/login", formData);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        toast.success("Login successful!");
        onClose();
        router.push("/forget-password");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Xtrack</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="user_id" className={styles.label}>
              User ID
            </label>
            <input
              id="user_id"
              type="text"
              name="user_id"
              placeholder="Enter your user ID"
              value={formData.user_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="user_pwd" className={styles.label}>
              Password
            </label>
            <input
              id="user_pwd"
              type="password"
              name="user_pwd"
              placeholder="Enter your password"
              value={formData.user_pwd}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
