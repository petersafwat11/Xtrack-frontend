import styles from "../dashboard.module.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const SUCCESS_COLORS = ["#28a745", "#dc3545"];
const RADIAN = Math.PI / 180;

export default function SuccessRatioChart({ successRatio }) {
  const transformedData = successRatio
    ? [
        { name: "Success", value: successRatio.success },
        { name: "Failure", value: successRatio.fail },
      ].filter((item) => item.value > 0)
    : [];

  const hasData = transformedData.length > 0;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.chart_box}>
      <h3>Success Ratio</h3>
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
              {transformedData.map((entry, index) => {
                // Use green for Success and red for Failure
                const colorIndex = entry.name === "Success" ? 0 : 1;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={SUCCESS_COLORS[colorIndex]}
                  />
                );
              })}
            </Pie>
          )}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {!hasData && <div className={styles.no_data}>No data available</div>}
    </div>
  );
}
