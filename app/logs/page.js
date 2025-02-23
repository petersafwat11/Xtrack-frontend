import React from 'react';
import Logs from '../ui/logs/Logs';
import axios from 'axios';
import Cookies from "js-cookie";

const LogsPage = async (props) => {
  // const userId = JSON.parse(Cookies.get('user')).user_id;
  // const searchParams = await props.searchParams;
  // const page = searchParams?.page || 1;
  // const rows = searchParams?.rows || 10;
  // const search = searchParams?.search || "";
  // let data;
  // try {
  //   data = await axios.get(`${process.env.BACKEND_SERVER}/api/tracking`, {
  //     params: {
  //       page: page,
  //       limit: rows,
  //       searchValue: search,
  //       user_id: "petersafwat",
  //       or: [
  //         "log_id",
  //         "log_date",
  //         "menu_id",
  //         "api_request",
  //         "api_status",
  //         "api_error",
  //         "ip_config",
  //         "ip_location",
  //       ],
  //     },
  //   });
  // } catch (err) {
  //   console.log("err", err);
  // }
  // const paginations = {
  //   results: data?.data?.results,
  //   rowsPerPage: rows,
  // };
  return (
    <div className="container">
      <h2 className="title">Tracking Logs</h2>
      <Logs
      //  paginations={paginations} logsData={data} 
       />
    </div>
  );
};

export default LogsPage;