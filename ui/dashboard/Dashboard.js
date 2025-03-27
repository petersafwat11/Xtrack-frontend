"use client";

import styles from "./dashboard.module.css";
// Import modular components
import TotalsCard from "./components/TotalsCard";
import YearSelector from "./components/YearSelector";
import TrackingUsageChart from "./components/TrackingUsageChart";
import TrackRatioChart from "./components/TrackRatioChart";
import SuccessRatioChart from "./components/SuccessRatioChart";
import RecentTracksTable from "./components/RecentTracksTable";
import { useState } from "react";
import axios from "axios";

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

      <RecentTracksTable data={data?.dataGrid} />
    </div>
  );
};
export default Dashboard;
