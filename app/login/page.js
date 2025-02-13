import React from "react";
import classes from "./page.module.css";
import LoginForm from "../ui/loginForm/LoginForm";

const Login = () => {
  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
