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
            {/* <Image
              src="/images/brand-illustration.svg" // Add your brand image
              alt="Xtrack Brand"
              fill
              style={{ objectFit: "contain" }}
              priority
            /> */}
            I Will Provide an Image Here
          </div>
        </div>
        <div className={classes.formSection}>
          <LoginForm />
          <p className={classes["copyright"]}>Copyright © 2025 Xtrack.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
