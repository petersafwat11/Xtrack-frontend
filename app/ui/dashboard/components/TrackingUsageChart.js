import styles from "../dashboard.module.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrackingUsageChart({ last7Days }) {
  return (
    <div className={styles.chartBox}>
      <h3>Tracking Usage</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={last7Days}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#078fff" name="Tracks" />
        </BarChart>
      </ResponsiveContainer>
      {(!last7Days || last7Days.length === 0) && (
        <div className={styles.noData}>No data available</div>
      )}
    </div>
  );
}
