"use client";
import React, { useState } from "react";
import styles from "./header.module.css";
import { FiMenu } from "react-icons/fi";
import LoginForm from "../../loginForm/LoginForm";
import Signup from "../../signupForm/signup";

const Header = ({ onMenuToggle, isMenuOpen }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <header className={styles.header}>
      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Signup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />

      <button className={styles.menuToggle} onClick={onMenuToggle}>
        <FiMenu />
      </button>

      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => setIsLoginOpen(true)}>
          Sign In
        </button>
        <button
          onClick={() => setIsSignupOpen(true)}
          className={`${styles.button} ${styles.primary}`}
        >
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
