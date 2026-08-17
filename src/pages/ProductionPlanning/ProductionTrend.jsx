import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../apis/axiosinstance';
import { API_ENDPOINTS } from '../../apis/endpoints';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ProductionTrend = () => {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState(8);
  
  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTION_PLANNING.TREND, { params: { months } });
        if (res.data?.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrend();
  }, [months]);

  return (
    <div className="planning-section fade-in-up delay-100">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Production vs Delivery Trend</h3>
          <p className="section-desc">Month-over-month aggregated volume for the whole facility.</p>
        </div>
        <select value={months} onChange={e => setMonths(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '8px' }}>
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={8}>Last 8 Months</option>
          <option value={12}>Last 12 Months</option>
        </select>
      </div>

      <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="MonthKey" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="ProducedQty" name="Produced Qty" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="DeliveredQty" name="Delivered Qty" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionTrend;
