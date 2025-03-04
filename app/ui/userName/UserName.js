"use client";
import React from 'react'
import Cookies from 'js-cookie';
import styles from './username.module.css';
const UserName = () => {
  const user = Cookies.get('user')? JSON.parse(Cookies.get('user')) : null;
  const userName = user?.user_name
  // const userName = "Peter Safwat"
  return (
    <p className={styles.userName}>{userName}</p>
  )
}

export default UserName