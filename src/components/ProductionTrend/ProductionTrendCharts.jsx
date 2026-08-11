import React from 'react';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';
import './ProductionTrend.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{label || payload[0].name || payload[0].payload?.productName}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0 0 0', fontSize: '12px', color: entry.color || '#475569' }}>
            <span>{entry.name}: </span>
            <strong>{typeof entry.value === 'number' ? entry.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : entry.value}</strong>
            {entry.payload?.percentage ? ` (${entry.payload.percentage}%)` : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProductionTrendCharts = ({ productShare, monthlyData, comparisonData }) => {
  // Sort productShare for chart display
  const topProducts = (productShare || []).slice(0, 8);

  return (
    <div className="pt-charts-grid">
      
      {/* 1. Product Share Donut Chart */}
      <div className="pt-chart-card col-6">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Product Production Share</h3>
        </div>
        <div className="pt-chart-container" style={{ display: 'flex', alignItems: 'center' }}>
          {topProducts.length === 0 ? (
            <div className="pt-empty-state" style={{ width: '100%' }}>No product data available</div>
          ) : (
            <>
              <div style={{ flex: 1, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProducts}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="totalQty"
                      nameKey="productName"
                    >
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="donut-legend-container" style={{ width: '45%' }}>
                {topProducts.map((item, idx) => (
                  <div key={idx} className="donut-legend-item">
                    <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      <span className="legend-color-dot" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.productName}>
                        {item.productCode}
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, marginLeft: 8 }}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Monthly Production Bar Chart */}
      <div className="pt-chart-card col-6">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Monthly Production Totals</h3>
        </div>
        <div className="pt-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData || []} margin={{ top: 15, right: 20, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalQty" name="Production Qty" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Year-over-Year Month Comparison */}
      <div className="pt-chart-card col-12">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Current Year vs Previous Year Comparison</h3>
        </div>
        <div className="pt-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData || []} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="previousYearQty" 
                name={`Year ${comparisonData?.[0]?.previousYearLabel || 'Prev'}`} 
                fill="#94a3b8" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
              />
              <Bar 
                dataKey="currentYearQty" 
                name={`Year ${comparisonData?.[0]?.currentYearLabel || 'Curr'}`} 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Top Produced Products Horizontal Bar Chart */}
      <div className="pt-chart-card col-12">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Top Produced Products</h3>
        </div>
        <div className="pt-chart-container" style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical"
              data={topProducts} 
              margin={{ top: 10, right: 30, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <YAxis type="category" dataKey="productCode" tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalQty" name="Production Qty" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ProductionTrendCharts;
