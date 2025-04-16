"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './username.module.css';

const UserName = () => {
  const [isClient, setIsClient] = useState(false);
  const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  const userName = user?.user_name;

  useEffect(() => {
    setIsClient(true);
  },[]);

  if (!isClient) {
    return null; // Don't render anything on the server
  }

  return <p className={styles.userName}>{userName}</p>;
};

export default UserName;