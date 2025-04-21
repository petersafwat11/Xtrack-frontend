"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./username.module.css";
import { usePathname } from "next/navigation";
const UserName = () => {
  const [isClient, setIsClient] = useState(false);
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const userName = user?.user_name;
  const pathname = usePathname();
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render anything on the server
  }

  return pathname === "/login" ? null : (
    <p className={styles.user_name}>{userName}</p>
  );
};

export default UserName;
