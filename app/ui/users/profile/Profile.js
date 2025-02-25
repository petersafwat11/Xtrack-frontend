"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import styles from './profile.module.css';
import DateInput from '../../inputs/dateInput/DateInput';
import CustomCheckbox from '../../inputs/checkbox/CustomCheckbox';

const Profile = ({ initialData, isNewUser = false , admin}) => {
    console.log('initialData', initialData)
  const router = useRouter();
//   (user_id varchar(100) not null,
// user_name varchar(100) not null,
// user_email varchar(100) not null,
// user_pwd varchar(20) not null,
// user_company varchar(100) not null,
// user_address varchar(300) null,
// user_country varchar(100) null,
// user_phone varchar(50) null,
// admin_user char(1) not null default 'N',
// dashboard char(1) not null default 'Y',
// ocean_af char(1) not null default 'Y',
// ocean_ar char(1) not null default 'Y',
// ocean_ft char(1) not null default 'Y',
// ocean_schedule char(1) not null default 'Y',
// air_cargo char(1) not null default 'Y',
// air_schedule char(1) not null default 'Y',
// vessel_tracking char(1) not null default 'Y’,
// marine_traffic char(1) not null default 'Y',
// create_date timestamptz not null default current_timestamp,
// update_date timestamptz not null default current_timestamp,
// primary key(user_id));

  const [formData, setFormData] = useState(initialData || {
    user_id: '',
    user_name: '',
    user_email: '',
    user_pwd: '',
    user_company: '',
    user_address:"",
    user_country: '',
    user_phone:"",
    ...(admin ? {
      dashboard: 'Y',
      ocean_af: 'Y',
      ocean_ar: 'Y',
      ocean_ft: 'Y',
      ocean_schedule: 'Y',
      air_cargo: 'Y',
      air_schedule: 'Y',
      vessel_tracking: 'Y',
      marine_traffic: 'Y',
      user_active: 'Y',
      valid_till: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      admin_user: 'N'
    } : {})
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
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
          <label htmlFor="user_address">Address:</label>
          <input
            type="text"
            id="user_address"
            name="user_address"
            value={formData.user_address}
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
          <label htmlFor="user_phone">Phone:</label>
          <input
            type="text"
            id="user_phone"
            name="user_phone"
            value={formData.user_phone}
            onChange={handleChange}
          />
        </div>

        {admin && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="valid_till">Valid Till:</label>
              <DateInput
                data={formData}
                dataKey="valid_till"
                onChange={setFormData}
              />
            </div>

            <div className={styles.adminSection}>
              <h3>User Permissions</h3>
              <div className={styles.checkboxGrid}>
                <CustomCheckbox
                  label="Admin User"
                  checked={formData.admin_user}
                  onChange={handleCheckboxChange}
                  name="admin_user"
                />
                <CustomCheckbox
                  label="Dashboard Access"
                  checked={formData.dashboard}
                  onChange={handleCheckboxChange}
                  name="dashboard"
                />
                <CustomCheckbox
                  label="Ocean AF Access"
                  checked={formData.ocean_af}
                  onChange={handleCheckboxChange}
                  name="ocean_af"
                />
                <CustomCheckbox
                  label="Ocean AR Access"
                  checked={formData.ocean_ar}
                  onChange={handleCheckboxChange}
                  name="ocean_ar"
                />
                <CustomCheckbox
                  label="Ocean FT Access"
                  checked={formData.ocean_ft}
                  onChange={handleCheckboxChange}
                  name="ocean_ft"
                />
                <CustomCheckbox
                  label="Ocean Schedule Access"
                  checked={formData.ocean_schedule}
                  onChange={handleCheckboxChange}
                  name="ocean_schedule"
                />
                <CustomCheckbox
                  label="Air Cargo Access"
                  checked={formData.air_cargo}
                  onChange={handleCheckboxChange}
                  name="air_cargo"
                />
                <CustomCheckbox
                  label="Air Schedule Access"
                  checked={formData.air_schedule}
                  onChange={handleCheckboxChange}
                  name="air_schedule"
                />
                <CustomCheckbox
                  label="Vessel Tracking Access"
                  checked={formData.vessel_tracking}
                  onChange={handleCheckboxChange}
                  name="vessel_tracking"
                />
                <CustomCheckbox
                  label="Marine Traffic Access"
                  checked={formData.marine_traffic}
                  onChange={handleCheckboxChange}
                  name="marine_traffic"
                />
                <CustomCheckbox
                  label="User Active"
                  checked={formData.user_active}
                  onChange={handleCheckboxChange}
                  name="user_active"
                />
              </div>
            </div>

            {/* <div className={styles.formGroup}>
              <label htmlFor="user_active">User Active:</label>
              <select
                id="user_active"
                name="user_active"
                value={formData.user_active}
                onChange={handleChange}
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div> */}

          </>
        )}

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