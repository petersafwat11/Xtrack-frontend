import React from 'react';
import Logs from '../ui/logs/Logs';
import axios from 'axios';
import { cookies } from 'next/headers'

const LogsPage = async (props) => {
  const cookieStore = await cookies()
  const user = JSON.parse(cookieStore.get('user').value);

  return (
    <div className="container">
      <h2 className="title">Tracking Logs</h2>
      <Logs userID={
        user?.user_id
         }/>
    </div>
  );
}; 

export default LogsPage;