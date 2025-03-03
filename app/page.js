"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Dashboard from "./ui/dashboard/Dashboard";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    
    if (!token || !user) {
      // Redirect to login if not logged in
      router.push("/login");
      return;
    }
    
    try {
      // Parse user data from cookie
      const userData = JSON.parse(user);
      setUserID(userData.user_id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Redirect to login if user data is invalid
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {userID && <Dashboard userID={userID} />}
    </div>
  );
}
