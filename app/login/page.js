import React from "react";
import styles from "./page.module.css";
import LoginForm from "../../ui/forms/loginForm/LoginForm";
import Image from "next/image";
const Login = () => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.brandSection}>
          <div className={styles.brandImage}>
            <Image src="/svg/technology.png" alt="Xtrack Brand" fill priority />
          </div>
        </div>
        <div className={styles.formSection}>
          <div className={styles["about-us"]}>
            <h3 className={styles["title"]}>ABOUT US </h3>
            <div className={styles["text"]}>
              <p className={styles["text-item"]}>
                Track WW provides the real-time tracking of your Ocean, Air and
                Land cargo. You can also get the sailing schedule, vessel
                tracking and port details via this portal.
              </p>
              <p className={styles["text-item"]}>
                We aim to provide tracking data to benefit the shipping
                community across the world. We can also directly deliver data to
                your email via our AI tools. Our AI tools can cater your
                business specific data needs in regard to tracking, rates,
                schedules, rates, co2 emissions and more.
              </p>
              <p className={styles["text-item"]}>
                Interested to know more? Signup using the Signup link below and
                we will reach out to you.
              </p>
            </div>
          </div>
          <LoginForm />
          <p className={styles["copyright"]}>Copyright © 2025 TrackWW.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
