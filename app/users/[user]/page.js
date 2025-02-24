import React from 'react';
import Profile from '@/app/ui/users/profile/Profile';

const getUserData = async (userId) => {
  try {
    // Using node-fetch on server side
    const response = await fetch(`${process.env.BACKEND_SERVER}/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching for this request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

async function Page({ params }) {
  const { user } = await params;
  console.log('user ', user);

  const isNewUser = user === 'create-user';
  let userData = null;

  if (!isNewUser) {
    userData = await getUserData(user);
  }

  return (
    <div className="container">
      <h2 className="title">Users</h2>
      <Profile initialData={userData?.data || null} isNewUser={isNewUser} />
    </div>
  );
}

export default Page;