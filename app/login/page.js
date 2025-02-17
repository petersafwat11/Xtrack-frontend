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
Track WW provides the tracking of your Ocean, Air and Land cargo. You can also get sailing schedule, spot pricing, vessel tracking and port congestion information in this portal.

</p>
<p className={classes['text-item']}>
Track WW aims to provide any tracking required for the shipping community as well as your specific data needs. 
</p>
<p className={classes['text-item']}>
 Interested to know more?  Kindly signup using the signup link below. We will reach out to you soon.
</p>
            </div>
          </div>
          <LoginForm />
          <p className={classes["copyright"]}>Copyright © 2025 Xtrack.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
