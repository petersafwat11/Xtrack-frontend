"use client";

import styles from "./dashboard.module.css";
// Import modular components
import TotalsCard from "./components/TotalsCard";
import YearSelector from "./components/YearSelector";
import TrackingUsageChart from "./components/TrackingUsageChart";
import TrackRatioChart from "./components/TrackRatioChart";
import SuccessRatioChart from "./components/SuccessRatioChart";
import { useState } from "react";
import axios from "axios";
import Table from "../trackersComponents/commen/table/Table";

const Dashboard = ({ data, userId }) => {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  console.log("years", years);
  const [pieChartsData, setPieChartsData] = useState({
    trackRatio: data?.trackRatio,
    successRatio: data?.successRatio,
  });
  const onYearChange = async (year) => {
    setSelectedYear(year);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/tracking/dashboard?user_id=${userId}&year=${year}`,
        {}
      );
      const data = response.data;
      console.log("data", data);
      setPieChartsData({
        trackRatio: data?.trackRatio,
        successRatio: data?.successRatio,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date
      .toLocaleDateString("en-GB", options)
      .replace(",", "")
      .replace(/ /g, "-");
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <TotalsCard
          title={`Total Tracks for ${currentMonth}`}
          value={data?.currentMonthTotal}
          backgroundColor="#8ded8d"
        />
        <TotalsCard
          title={`Total Tracks for ${currentYear}`}
          value={data?.currentYearTotal}
          backgroundColor="#2e7d32"
          textColor="white"
        />
        {years.length > 0 && (
          <YearSelector
            selectedYear={selectedYear}
            years={years}
            onYearChange={onYearChange}
          />
        )}
      </div>

      <div className={styles.chartsRow}>
        <TrackingUsageChart last7Days={data?.last7Days} />
        <TrackRatioChart trackRatio={pieChartsData.trackRatio} />
        <SuccessRatioChart successRatio={pieChartsData.successRatio} />
      </div>
      <Table
        headers={[
          "User ID",
          "Date",
          // <DateHeader
          //   handleSort={handleSort}
          //   getSortIcon={getSortIcon}
          //   key="date-header"
          // />,
          // "Date",
          "Menu",
          "Request",
          "Status",
          "Error Description",
          "IP Config",
          "Location",
        ]}
        data={data?.dataGrid?.map((log) => ({
          user_id: log.user_id,
          api_date: <span style={{ textWrap: "nowrap" }}>{formatDate(log.api_date)}</span>,
          menu_id: log.menu_id,
          api_request: log.api_request,
          api_status: getStatusElement(log.api_status),
          api_error: log.api_error || "-",
          ip_config: log.ip_config,
          ip_location: log.ip_location || "-",
        }))}
        smallPadding={true}
      />
    </div>
  );
};
export default Dashboard;
const getStatusElement = (status) => {
  return (
    <span className={status === "S" ? styles.success : styles.error}>
      {status === "S" ? "Success" : "Failed"}
    </span>
  );
};
