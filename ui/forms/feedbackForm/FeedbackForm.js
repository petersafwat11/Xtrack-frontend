"use client";
import { useState } from "react";
import styles from "./feedbackForm.module.css";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

const FeedbackForm = ({ userID }) => {
  const [formData, setFormData] = useState({
    user_id: userID,
    feedback_date: new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(",", "")
      .replace(/ /g, "-"),
    feedback_subject: "Error/Issue",
    feedback_description: "",
  });
  const [error, setError] = useState("");
  const feedbackTypes = ["Error/Issue", "Enhancement/Idea", "Others"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.feedback_subject) {
      const errorMessage = "Please enter a subject";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!formData.feedback_description) {
      const errorMessage = "Please enter a description";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      const response = await api.post("/api/feedback", formData);
      toast.success("Feedback submitted. Our support team will contact you");

      // Reset form after successful submission
      setFormData((prev) => ({
        ...prev,
        feedback_subject: "Error/Issue",
        feedback_description: "",
      }));
    } catch (error) {
      // Just use the error message from the backend
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit feedback. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.inputs}>
        {[
          { label: "User", value: formData.user_id, disabled: true },
          { label: "Date", value: formData.feedback_date, disabled: true },
        ].map((input) => (
          <div key={input.label} className={styles.form_group}>
            <label className={styles.label}>{input.label}</label>
            <input
              type="text"
              className={styles.input}
              value={input.value}
              disabled={input.disabled}
            />
          </div>
        ))}

        <div className={styles.form_group}>
          <label className={styles.label}>Subject</label>
          <select
            name="feedback_subject"
            className={styles.select}
            value={formData.feedback_subject}
            onChange={handleChange}
          >
            {feedbackTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form_group}>
          <label className={styles.label}>Description</label>
          <textarea
            name="feedback_description"
            className={styles.textarea}
            value={formData.feedback_description}
            onChange={handleChange}
            placeholder="Please provide detailed feedback..."
            maxLength={3000}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.footer}>
        <p className={styles.contact}>
          You may also reach us via email{" "}
          <a href="mailto:contact@trackww.com" className={styles.email}>
            contact@trackww.com
          </a>
        </p>
        <button type="submit" className={styles.submit_button}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
