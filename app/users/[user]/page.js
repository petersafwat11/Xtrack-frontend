import React from "react";
import Profile from "@/ui/users/profile/Profile";

const getUserData = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const Page = async ({ params }) => {
  const { user } = await params;
  const isNewUser = user === "create-user";
  let userData = null;

  if (!isNewUser) {
    userData = await getUserData(user);
  }

  return (
    <div className="container">
      <h2 className="title">Users</h2>
      <Profile
        admin={true}
        initialData={userData?.data || null}
        isNewUser={isNewUser}
      />
    </div>
  );
}

export default Page;
