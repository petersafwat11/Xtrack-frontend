"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import styles from './profile.module.css';
import DateInput from '../../inputs/dateInput/DateInput';

const Profile = ({ initialData, isNewUser = false }) => {
    console.log('initialData', initialData)
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {
    user_id: '',
    user_name: '',
    user_email: '',
    user_pwd: '',
    user_company: '',
    user_country: '',
    is_active: true,
    valid_till: '',
    admin_user: 'N'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        await api.post('/api/users', formData);
      } else {
        await api.patch(`/api/users/${formData.user_id}`, formData);
      }
      router.push('/users');
    } catch (error) {
      console.error('Error saving user:', error);
    //   alert(error.response?.data?.message || 'Error saving user data');
    }
  };

  const handleCancel = () => {
    router.push('/users');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>{isNewUser ? 'Create New User' : 'Edit User'}</h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="user_id">User ID:</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            disabled={!isNewUser}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user_name">User Name:</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user_email">Email:</label>
          <input
            type="email"
            id="user_email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user_pwd">Password:</label>
          <input
            type="password"
            id="user_pwd"
            name="user_pwd"
            value={formData.user_pwd}
            onChange={handleChange}
            required={isNewUser}
            placeholder={!isNewUser ? "Leave empty to keep current password" : ""}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user_company">Company:</label>
          <input
            type="text"
            id="user_company"
            name="user_company"
            value={formData.user_company}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user_country">Country:</label>
          <input
            type="text"
            id="user_country"
            name="user_country"
            value={formData.user_country}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="valid_till">Valid Till:</label>
          <DateInput data={formData} setData={setFormData} dataKey="valid_till" />
          {/* <input
            type="date"
            id="valid_till"
            name="valid_till"
            value={formData.valid_till?.split('T')[0]}
            onChange={handleChange}
            required
          /> */}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Active User
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="admin_user"
              checked={formData.admin_user === 'Y'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                admin_user: e.target.checked ? 'Y' : 'N'
              }))}
            />
            Admin User
          </label>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
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