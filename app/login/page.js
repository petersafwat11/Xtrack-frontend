import React from "react";
import classes from "./page.module.css";
import LoginForm from "../ui/loginForm/LoginForm";
import Image from "next/image";
import { DMSans } from "../fonts";
const Login = () => {
  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <div className={classes.brandSection}>
          <div className={classes.brandImage}>
            <Image
              src="/svg/technology.png" // Add your brand image
              alt="Xtrack Brand"
              fill
              priority
            />
            {/* I Will Provide an Image Here */}
          </div>
        </div>
        <div className={classes.formSection}>
          <div className={classes['about-us']}>
            <h3 className={classes['title']}>ABOUT US   </h3>
            <div className={classes['text']}>
              <p className={classes['text-item']}>
              Track WW provides the real-time tracking of your Ocean, Air and Land cargo. You can also get the sailing schedule, vessel tracking and port details via this portal.
              </p>
              <p className={classes['text-item']}>
              We aim to provide tracking data to benefit the shipping community across the world. We can also directly deliver data to your email via our AI tools. Our AI tools can cater your business specific data needs in regard to tracking, rates, schedules, rates, co2 emissions and more.              
              </p>
              <p className={classes['text-item']}>
              Interested to know more? Signup using the Signup link below and we will reach out to you.              
              </p>
            </div>
          </div>
          <LoginForm />
          <p className={classes["copyright"]}>Copyright © 2025 TrackWW.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
