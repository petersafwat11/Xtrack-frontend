import React from 'react';
import Logs from '../ui/logs/Logs';
import axios from 'axios';
import Cookies from "js-cookie";

const LogsPage = async (props) => {
  return (
    <div className="container">
      <h2 className="title">Tracking Logs</h2>
      <Logs/>
    </div>
  );
};

export default LogsPage;