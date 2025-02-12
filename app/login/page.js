import React from "react";
import classes from "./page.module.css";
import LoginForm from "../ui/loginForm/LoginForm";

const Login = async () => {
  return (
    <div className={classes["page"]}>
      <LoginForm />
    </div>
  );
};

export default Login;
