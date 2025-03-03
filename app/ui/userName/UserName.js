import React from 'react'
import Cookies from 'js-cookie';
import styles from './username.module.css';
const UserName = () => {
  const user = JSON.parse(Cookies.get('user'));
  const userName = user?.user_name
  return (
    <p className={styles.userName}>{userName}</p>
  )
}

export default UserName