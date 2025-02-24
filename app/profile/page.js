import React from 'react';
import Profile from '@/app/ui/users/profile/Profile';

// async function getCurrentUserData() {
//   try {
//     const response = await fetch(`${process.env.BACKEND_SERVER}/api/users/me`, {
//       cache: 'no-store'
//     });
    
//     // if (!response.ok) {
//     //   throw new Error('Failed to fetch user data');
//     // }

//     const data = await response.json();
//     return data.data;
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error;
//   }
// }

export default async function ProfilePage() {
//   let userData = null;

//   try {
//     userData = await getCurrentUserData();
//   } catch (error) {
//     console.error('Error:', error);
//   }

  return (
    <div className="container">
      <h2 className="title">Users</h2>
      {/* - user_id (character varying) NOT NULL
  - user_name (character varying) NOT NULL
  - user_email (character varying) NOT NULL
  - user_pwd (character varying) NOT NULL
  - user_active (character varying) NOT NULL
  - valid_till (date) NOT NULL
  - user_company (character varying) NOT NULL
  - user_address (character varying) NULL
  - user_country (character varying) NULL
  - user_phone (character varying) NULL
  - admin_user (character varying) NOT NULL
  - dashboard (character varying) NOT NULL
  - ocean_af (character varying) NOT NULL
  - ocean_ar (character varying) NOT NULL
  - ocean_ft (character varying) NOT NULL
  - ocean_schedule (character varying) NOT NULL
  - air_cargo (character varying) NOT NULL
  - air_schedule (character varying) NOT NULL
  - vessel_tracking (character varying) NOT NULL
  - marine_traffic (character varying) NOT NULL
  - create_date (timestamp with time zone) NOT NULL
  - update_date (timestamp with time zone) NOT NULL */}
      {/* <Profile
       initialData={userData} isNewUser={false} /> */}
    </div>
  );
}