import React from 'react';
import Profile from '@/app/ui/users/profile/Profile';
import { cookies } from 'next/headers'

async function getCurrentUserData(id) {
  try {
    const response = await fetch(`${process.env.BACKEND_SERVER}/api/users/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const user = JSON.parse(cookieStore.get('user').value);
  console.log('user', user)
  let userData = null;

  try {
    userData = await getCurrentUserData(user.user_id);
    console.log('user', user)

  } catch (error) {
    console.error('Error:', error);
  }

  return (
    <div className="container">
      <h2 className="title">Users</h2>
      <Profile 
      admin={false}
      initialData={userData?.data || null} isNewUser={false} 
      />
    </div>
  );
}