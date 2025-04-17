"use client";
import { useRouter } from "next/navigation";
import styles from "./SignOutButton.module.css";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Call backend logout endpoint
      await api.get("/api/users/logout");

      // Clear frontend auth data
      Cookies.remove("token");
      Cookies.remove("user");
      localStorage.removeItem("user");

      // Redirect to login page
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <button onClick={handleSignOut} className={styles.sign_out_button}>
      Sign Out
    </button>
  );
}
