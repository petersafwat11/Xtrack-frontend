"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./dashboard.module.css";
import api from "@/app/lib/axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';

import Cookies from "js-cookie";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const SUCCESS_COLORS = ['#28a745', '#dc3545'];

const Dashboard = ({ userID }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(2025); // Default to 2025
  const [years] = useState(Array.from({length: 11}, (_, i) => 2025 + i)); // 2025 to 2035
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard data states
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);
  const [weeklyUsage, setWeeklyUsage] = useState([]);
  const [trackRatio, setTrackRatio] = useState([]);
  const [successRatio, setSuccessRatio] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);

  const ratioData = [
    { name: 'AIR', value: 400 },
    { name: 'Vessel', value: 300 },
    { name: 'Ocean', value: 300 },
  ];
  const RatioColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  

  // Function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch totals (these don't change with year selection)
      const totalsResponse = await api.get('/api/tracking/totals', {
        params: {
          user_id: userID
        }
      });

      if (totalsResponse.data.status === 'success') {
        setMonthlyTotal(totalsResponse.data.monthlyTotal);
        setYearlyTotal(totalsResponse.data.yearlyTotal);
      }

      // Fetch chart data based on selected year
      const chartsResponse = await api.get('/api/tracking/charts', {
        params: {
          user_id: userID,
          year: selectedYear
        }
      });

      if (chartsResponse.data.status === 'success') {
        setWeeklyUsage(chartsResponse.data.weeklyUsage || []);
        setTrackRatio(chartsResponse.data.trackRatio || []);
        setSuccessRatio(chartsResponse.data.successRatio || []);
      }

      // Fetch recent tracks (always current)
      const recentResponse = await api.get('/api/tracking/recent', {
        params: {
          user_id: userID,
          limit: 20
        }
      });

      if (recentResponse.data.status === 'success') {
        setRecentTracks(recentResponse.data.data || []);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      // Set empty arrays for data if there's an error
      setWeeklyUsage([]);
      setTrackRatio([]);
      setSuccessRatio([]);
      setRecentTracks([]);
    } finally {
      setLoading(false);
    }
  }, [userID, selectedYear]);

  // Load dashboard data on component mount and when year changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Custom active shape for pie charts
  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  // State for active pie chart segments
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [activeSuccessIndex, setActiveSuccessIndex] = useState(0);

  // Format date for display
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Check if data is available for pie charts
  const hasTrackRatioData = trackRatio && trackRatio.length > 0 && trackRatio.some(item => item.value > 0);
  const hasSuccessRatioData = successRatio && successRatio.length > 0 && successRatio.some(item => item.value > 0);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.totalBox} style={{ backgroundColor: '#8ded8d' }}>
          <h3>Total Tracks for {new Date().toLocaleString('default', { month: 'long' })}</h3>
          <div className={styles.totalValue}>{monthlyTotal}</div>
        </div>
        <div className={styles.totalBox} style={{ backgroundColor: '#2e7d32', color: 'white' }}>
          <h3>Total Tracks for {new Date().getFullYear()}</h3>
          <div className={styles.totalValue}>{yearlyTotal}</div>
        </div>
        <div className={styles.yearSelector}>
          <h3>Year</h3>
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className={styles.yearDropdown}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading dashboard data...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div className={styles.chartsRow}>
            <div className={styles.chartBox}>
              <h3>Tracking Usage</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={weeklyUsage}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ffc107" name="API Calls" />
                </BarChart>
              </ResponsiveContainer>
              {weeklyUsage.length === 0 && (
                <div className={styles.noData}>No data available</div>
              )}
            </div>
            
            <div className={styles.chartBox}>
              <h3>Track Ratio</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  {hasTrackRatioData && (
                    <Pie
                      data={trackRatio}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trackRatio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  )}
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {!hasTrackRatioData && (
                <div className={styles.noData}>No data available</div>
              )}
            </div>
            
            <div className={styles.chartBox}>
              <h3>Success Ratio</h3>
              <ResponsiveContainer width="100%" height={250}>
                
                <PieChart>
                  {hasSuccessRatioData && (
                    <Pie
                      activeIndex={activeSuccessIndex}
                      activeShape={renderActiveShape}
                      data={successRatio}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveSuccessIndex(index)}
                    >
                      {successRatio.map((entry, index) => {
                        // Use green for Success and red for Failure
                        const colorIndex = entry.name === 'Success' ? 0 : 1;
                        return (
                          <Cell key={`cell-${index}`} fill={SUCCESS_COLORS[colorIndex]} />
                        );
                      })}
                    </Pie>
                  )}
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {!hasSuccessRatioData && (
                <div className={styles.noData}>No data available</div>
              )}
            </div>
          </div>

          <div className={styles.recentTracksSection}>
            <h3>Recent Tracks</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.headerItem}>User ID</th>
                    <th className={styles.headerItem}>Date</th>
                    <th className={styles.headerItem}>Menu</th>
                    <th className={styles.headerItem}>Request</th>
                    <th className={styles.headerItem}>Status</th>
                    <th className={styles.headerItem}>Error</th>
                    <th className={styles.headerItem}>IP</th>
                    <th className={styles.headerItem}>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTracks.map((track) => (
                    <tr className={styles.tableRow} key={track.id}>
                      <td className={styles.rowItem}>{track.userId}</td>
                      <td className={styles.rowItem}>{formatDate(track.date)}</td>
                      <td className={styles.rowItem}>{track.menuId || '-'}</td>
                      <td className={styles.rowItem}>{track.request}</td>
                      <td className={track.status === 'S' ? styles.success : styles.error}>
                        {track.status === 'S' ? 'Success' : 'Failed'}
                      </td>
                      <td className={styles.rowItem}>{track.error || '-'}</td>
                      <td className={styles.rowItem}>{track.ipConfig || '-'}</td>
                      <td className={styles.rowItem}>{track.ipLocation || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentTracks.length === 0 && (
                <div className={styles.noData}>No data available</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
