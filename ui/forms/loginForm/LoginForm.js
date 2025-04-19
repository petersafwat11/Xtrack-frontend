"use client";
import React, { useState, useEffect } from "react";
import styles from "./loginForm.module.css";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Signup from "../signupForm/signup";
import Cookies from "js-cookie";
import ForgetPassword from "../forgetPassword/ForgetPassword";

const LoginForm = () => {
  const router = useRouter();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    user_pwd: "",
  });
  const [error, setError] = useState("");

  // Check for existing auth on mount
  useEffect(() => {
    const token = Cookies.get("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      router.push("/");
    }
  }, [router]);

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

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, formData);

      console.log("response", response);

      if (response.status === 200) {
        const { token, data } = response.data;

        // Store auth data in both cookies and localStorage
        Cookies.set("token", token, { expires: 1 }); // Expires in 1 day
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 }); // Expires in 1 day

        // Update axios default headers
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        toast.success("Login successful!");
        router.push("/");
      }
    } catch (error) {
      // Just use the error message from the backend
      console.log("error", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };
  return (
    <>
      <Signup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <ForgetPassword
        isOpen={isForgetPasswordOpen}
        onClose={() => setIsForgetPasswordOpen(false)}
      />
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.input_group}>
            <label htmlFor="user_id" className={styles.label}>
              User ID
            </label>
            <input
              id="user_id"
              type="text"
              name="user_id"
              placeholder="Enter your user ID"
              value={formData.user_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.input_group}>
            <label htmlFor="user_pwd" className={styles.label}>
              Password
            </label>
            <input
              id="user_pwd"
              type="password"
              name="user_pwd"
              placeholder="Enter your password"
              value={formData.user_pwd}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submit_button}>
            Login
          </button>
        </form>
        <div className={styles.form_footer}>
          <button
            onClick={() => setIsSignupOpen(true)}
            className={styles.signup_button}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsForgetPasswordOpen(true)}
            className={styles.forgot_password_button}
          >
            Reset Password
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
