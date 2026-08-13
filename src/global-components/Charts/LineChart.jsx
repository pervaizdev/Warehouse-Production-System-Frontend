import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './LineChart.css';

const LineChart = ({ data, xAxisKey = 'name', series = [], showLegend = true }) => (
  <div className="line-chart-container">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        {series.map((item) => (
          <Line key={item.key} type="monotone" dataKey={item.key} name={item.name} stroke={item.color} strokeWidth={3} dot={{ r: 3 }} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChart;
