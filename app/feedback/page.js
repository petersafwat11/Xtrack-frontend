import React from "react";
import FeedbackForm from "../../ui/feedbackForm/FeedbackForm";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get("user").value);

  return (
    <div className="container">
      <h2 className="title">Submit Feedback </h2>
      <FeedbackForm userID={user?.user_id} />
    </div>
  );
};

export default page;
