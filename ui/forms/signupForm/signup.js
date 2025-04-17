"use client";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./signup.module.css";
import { COUNTRIES } from "@/app/utils/countries";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

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
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Clear general error
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});
    setIsSubmitting(true);

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
        setGeneralError("Cannot connect to server. Please try again later.");
        toast.error("Cannot connect to server. Please try again later.");
      } else {
        const errorMessage =
          error.response?.data?.message ||
            error.message ||
            "Failed to submit account request";
          setGeneralError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Register Your Interest</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={errors.name ? styles.inputError : ""}
            />
            {errors.name && (
              <div className={styles.fieldError}>{errors.name}</div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              required
              className={errors.company ? styles.inputError : ""}
            />
            {errors.company && (
              <div className={styles.fieldError}>{errors.company}</div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className={errors.address ? styles.inputError : ""}
            />
            {errors.address && (
              <div className={styles.fieldError}>{errors.address}</div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className={`${styles.select} ${
                errors.country ? styles.inputError : ""
              }`}
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className={styles.fieldError}>{errors.country}</div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? styles.inputError : ""}
            />
            {errors.email && (
              <div className={styles.fieldError}>{errors.email}</div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className={errors.phone ? styles.inputError : ""}
            />
            {errors.phone && (
              <div className={styles.fieldError}>{errors.phone}</div>
            )}
          </div>

          {generalError && <div className={styles.error}>{generalError}</div>}

          <div className={styles.captchaContainer}>
            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
