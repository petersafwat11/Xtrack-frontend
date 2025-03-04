"use client";

import styles from "../dashboard.module.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const RADIAN = Math.PI / 180;

export default function TrackRatioChart({ trackRatio }) {
  // Transform the trackRatio object into an array format for the PieChart

  const transformedData = trackRatio ? Object.entries(trackRatio)
    .filter(([key, value]) => parseInt(value) > 0)
    .map(([key, value]) => ({
      name: key,
      value: parseInt(value)
    })) : [];

  const hasData = transformedData.length > 0;

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

  return (
    <div className={styles.chartBox}>
      <h3>Track Ratio</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          {hasData && (
            <Pie
              data={transformedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          )}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {!hasData && (
        <div className={styles.noData}>No data available</div>
      )}
    </div>
  );
}
