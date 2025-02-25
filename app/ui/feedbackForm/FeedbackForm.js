"use client";
import { useState } from 'react';
import styles from './feedbackForm.module.css';
// import { getCookie } from 'cookies-next';
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import api from '@/app/lib/axios';

const FeedbackForm = () => {
  const userID= JSON.parse(Cookies.get('user'))?.user_id || 
  'petersafwat';
  const [formData, setFormData] = useState({
    user_id: userID,
    feedback_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '').replace(/ /g, "-"),
    feedback_subject: '',
    feedback_description: ''
  });
  const feedbackTypes = ['Error/Issue', 'Enhancement/Idea', 'Others'];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response= await api.post('/api/feedback', formData);
      toast.success('Feedback submitted. Our support team will contact you');
      console.log('response', response)
      setFormData(prev => ({
        ...prev,
        feedback_subject: '',
        feedback_description: ''
      }));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.inputs}>
        <div className={styles.formGroup}>
        <label className={styles.label}>User</label>
        <input
          type="text"
          className={styles.input}
          value={formData.user_id}
          disabled
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Date</label>
        <input
        //   type="date"
          className={styles.input}
          value={formData.feedback_date}
          disabled
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Subject</label>
        <select
          name="feedback_subject"
          className={styles.select}
          value={formData.feedback_subject}
          onChange={handleChange}
        >
          {feedbackTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
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


        </div>
      <div className={styles.footer}>
        <p className={styles.contact}>
          You may also reach us via email{' '}
          <a href="mailto:contact@trackww.com" className={styles.email}>
            contact@trackww.com
          </a>
        </p>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;