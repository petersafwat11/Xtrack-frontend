"use client";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./signup.module.css";
import { COUNTRIES } from "@/app/utils/countries";
import { toast, Toaster } from "react-hot-toast";
import api from "@/app/lib/axios";

const Signup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    address: "",
    country: "",
    email: "",
    phone: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState("");

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
    setError("");

    // Uncomment when ready to use captcha
    // if (!captchaValue) {
    //   toast.error("Please complete the captcha");
    //   return;
    // }

    try {
      const response = await api.post("/api/users/signup-request", formData);

      if (response.status === 201) {
        toast.success("Account request submitted successfully!");
        // Reset form
        setFormData({
          name: "",
          company: "",
          address: "",
          country: "",
          email: "",
          phone: "",
        });
        setCaptchaValue(null);
        onClose();
      }
    } catch (error) {
      console.error("Full error:", error);
      if (error.code === "ECONNREFUSED") {
        toast.error("Cannot connect to server. Please try again later.");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit account request";
        toast.error(errorMessage);
      }
      setError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}

      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.captchaContainer}>
            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
