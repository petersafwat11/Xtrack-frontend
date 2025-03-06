"use client";
import axios from "axios";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import classes from "./resetForm.module.css";
import InputGroup from "../inputGroup/InputGroup";
import { DMSans } from "@/app/fonts";

const ResetForm = () => {
  const router = useRouter();
  const [data, setData] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState({ state: false, message: "" });
  const handleSubmit = async () => {
    try {
      if (data.email.length < 1) {
        setError({
          state: true,
          message: "Error: you must enter both your password twice",
        });
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/users/forget-password`,
        { email: data.email }
      );
      console.log("response", response);
      //   Cookies.set("user", JSON.stringify(response.data.data.user), {
      //     expires: 1,
      //   });
      //   Cookies.set("token", response.data.token, {
      //     expires: 1,
      //   });

      router.push("/");
    } catch (error) {
      setError({
        state: true,
        message: "Error: either email or password is incorrect",
      });
      console.log("error", error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={`${DMSans.className} ${classes["container"]}`}>
      <div className={classes["form"]}>
        {error.state && <p className={classes["error"]}>{error.message}</p>}

        <h1 className={classes["title"]}>Title Placeholder</h1>

        <InputGroup
          placeHolder={"Please Enter Your New Passowrd"}
          handleKeyDown={handleKeyDown}
          id={"newPassword"}
          type={"password"}
          label={"New Password"}
          data={data}
          dataKey={"newPassword"}
          setData={setData}
        />
        <InputGroup
          placeHolder={"Please Confirm Your Password"}
          handleKeyDown={handleKeyDown}
          id={"confirmPassword"}
          type={"password"}
          label={"Confirm Password"}
          data={data}
          dataKey={"confirmPassword"}
          setData={setData}
        />
        <button onClick={handleSubmit} className={classes["login-button"]}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetForm;
