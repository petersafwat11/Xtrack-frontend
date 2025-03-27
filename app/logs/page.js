import React from "react";
import Logs from "../../ui/logs/Logs";
// import axios from 'axios';
import { cookies } from "next/headers";

const page = async (props) => {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user")?.value)
    : null;

  return (
    <div className="container">
      <h2 className="title">Tracking Logs</h2>
      <Logs userID={user?.user_id} />
    </div>
  );
};

export default page;
