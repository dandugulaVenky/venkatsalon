import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Chart({
  data,
  XAxisDatakey,
  BarDataKey,
  BarDataAmount,
}) {
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth =
        document.getElementById("chart-container").clientWidth;
      setChartWidth(containerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const truncateLabel = (label, maxLength) => {
    maxLength = chartWidth < 768 ? maxLength : 12;
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + "...";
    }
    return label;
  };

  const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props;

    const fontSize = window.innerWidth <= 768 ? "12px" : "15px"; // Adjust the breakpoint and font sizes as needed

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-25)"
          style={{ fontSize }}
        >
          {truncateLabel(payload.value, 12)}
        </text>
      </g>
    );
  };
  return (
    <div id="chart-container">
      <BarChart
        width={chartWidth}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="6 6" />
        <XAxis
          dataKey={XAxisDatakey}
          height={100}
          tick={<CustomizedAxisTick />}
        />

        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={BarDataKey} fill="#00ccbb" />
        <Bar dataKey={BarDataAmount} fill="#868f00" />
      </BarChart>
    </div>
  );
}
