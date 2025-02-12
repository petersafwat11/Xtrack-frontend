"use client";
import React, { useState } from "react";
import ForgetPassword from "../ui/forgetPassword/ForgetPassword";

const Page= () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <ForgetPassword isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Page;
