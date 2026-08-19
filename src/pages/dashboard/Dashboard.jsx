import React, { useState, useEffect, useCallback } from 'react';
import { 
  IconRefresh, IconAlertTriangle, IconAlertCircle, IconCheck, 
  IconTrendingUp, IconTrendingDown, IconPackage, IconSettings,
  IconCurrencyDollar, IconClipboardList, IconClock
} from '@tabler/icons-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { axiosInstance } from '../../apis/axiosinstance';
import { API_ENDPOINTS } from '../../apis/endpoints';
import Pagination from '../../global-components/Pagination/Pagination';
import './Dashboard.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const formatCompactCurrency = (value) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // History Pagination State
  const [history, setHistory] = useState([]);
  const [historyPagination, setHistoryPagination] = useState({ page: 1, pageSize: 5, totalRecords: 0, totalPages: 0 });
  const [historyLoading, setHistoryLoading] = useState(false);

  // Filters and Warehouses
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({
    warehouse: '',
    dateFrom: '',
    dateTo: ''
  });

  const fetchHistory = useCallback(async (page = 1, pageSize = 5) => {
    setHistoryLoading(true);
    try {
      const params = { page, pageSize, months: 1 };
      if (filters.warehouse) params.warehouse = filters.warehouse;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTION_PLANNING.HISTORY, { params });
      if (res.data?.success) {
        setHistory(res.data.data);
        setHistoryPagination({
          page: res.data.pagination.currentPage,
          pageSize: res.data.pagination.pageSize,
          totalRecords: res.data.pagination.totalRecords,
          totalPages: res.data.pagination.totalPages
        });
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [filters]);

  const fetchOverviewData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      const params = {};
      if (filters.warehouse) params.warehouse = filters.warehouse;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const [overviewRes, shortagesRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.DASHBOARD.OVERVIEW, { params }),
        axiosInstance.get(API_ENDPOINTS.PRODUCTION_PLANNING.SHORTAGES, { params: { pageSize: 5, ...params } })
      ]);
      
      if (overviewRes.data && overviewRes.data.success) {
        setData({
          ...overviewRes.data.data,
          shortages: shortagesRes.data?.data || []
        });
      } else {
        throw new Error(overviewRes.data?.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard overview:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Fetch warehouses for dropdown
    const fetchWarehouses = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.WAREHOUSES);
        if (res.data?.success) {
          setWarehouses(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch warehouses:', err);
      }
    };
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchOverviewData();
    fetchHistory(1, historyPagination.pageSize);
  }, [fetchOverviewData, fetchHistory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRefresh = () => {
    fetchOverviewData();
  };

  if (loading && !data) {
    return (
      <div className="executive-dashboard">
        <div className="dashboard-state">
          <IconRefresh className="spin" size={48} color="var(--primary)" />
          <p>Loading Executive Overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="executive-dashboard">
        <div className="dashboard-state">
          <IconAlertTriangle size={48} color="#ef4444" />
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button className="btn-refresh" onClick={handleRefresh}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    executiveKPIs,
    productionPerformance,
    inventoryHealth,
    recentOrders,
    productionMix,
    alerts,
    shortages
  } = data;

  return (
    <div className="executive-dashboard">
      <div className="dashboard-header fade-in-up">
        <h1>Executive Dashboard</h1>
        
        <div className="dashboard-filters-bar">
          <select 
            name="warehouse" 
            value={filters.warehouse} 
            onChange={handleFilterChange}
          >
            <option value="">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.WhsCode} value={w.WhsCode}>
                {w.WhsName} ({w.WhsCode})
              </option>
            ))}
          </select>

          <button className="btn-refresh" onClick={handleRefresh}>
            <IconRefresh size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Row 1: KPIs */}
      <div className="dashboard-kpi-grid fade-in-up delay-100">
        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper blue">
                <IconClipboardList size={28} />
              </div>
              <div className="health-stat">
                <span className="label">Total / Active Orders</span>
                <span className="value">{executiveKPIs.totalOrders} / {executiveKPIs.activeOrders}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper green">
                <IconCurrencyDollar size={28} />
              </div>
              <div className="health-stat">
                <span className="label">Total Inventory Value</span>
                <span className="value">{formatCompactCurrency(executiveKPIs.totalInventoryValue || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper orange">
                <IconSettings size={28} />
              </div>
              <div className="health-stat">
                <span className="label">Machine Util.</span>
                <span className="value">{executiveKPIs.machineUtilization}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper purple">
                <IconCheck size={28} />
              </div>
              <div className="health-stat">
                <span className="label">Overall Yield</span>
                <span className="value">{executiveKPIs.yieldPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Production Trend */}
      <div className="dashboard-row fade-in-up delay-200">
        <div className="dashboard-col-2-3">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3><IconTrendingUp size={20} /> Production Output Trend (Last 6 Months)</h3>
            </div>
            <div className="dashboard-card-content">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productionPerformance} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="Month" 
                      tickFormatter={(val) => {
                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        return months[val - 1] || val;
                      }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="PlannedQty" stroke="#3b82f6" name="Planned Qty" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="OrderCount" stroke="#10b981" name="Orders Count" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-col-1-3">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3><IconAlertCircle size={20} /> Operational Alerts</h3>
            </div>
            <div className="dashboard-card-content no-padding">
              {alerts && alerts.length > 0 ? (
                <div className="alert-list" style={{ padding: '1rem' }}>
                  {alerts.map(alert => (
                    <div key={alert.id} className={`alert-item ${alert.type}`}>
                      <div className={`alert-icon ${alert.type}`}>
                        {alert.type === 'critical' ? <IconAlertTriangle /> : <IconAlertCircle />}
                      </div>
                      <div className="alert-content">
                        <div className="alert-title">{alert.title}</div>
                        <div className="alert-desc">{alert.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-state">
                  <IconCheck size={48} color="#10b981" />
                  <p>All operations are normal</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Inventory & Mix */}
      <div className="dashboard-row fade-in-up delay-300">
        <div className="dashboard-col-1-2">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3><IconPackage size={20} /> Critical Material Shortages</h3>
            </div>
            <div className="dashboard-card-content no-padding">
              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th className="text-right">Required</th>
                      <th className="text-right">Available</th>
                      <th className="text-right">Shortage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortages && shortages.length > 0 ? (
                      shortages.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{item.ComponentCode}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.ComponentName}</div>
                          </td>
                          <td className="text-right">{item.RemainingRequired?.toLocaleString()}</td>
                          <td className="text-right">{item.TotalAvailable?.toLocaleString()}</td>
                          <td className="text-right">
                            <span className="status-badge critical">{item.ShortageQty?.toLocaleString()}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No critical shortages</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-col-1-2">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3><IconSettings size={20} /> Production Mix</h3>
            </div>
            <div className="dashboard-card-content">
              <div className="chart-container" style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
                    <Pie
                      data={productionMix}
                      cx="45%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="OrderCount"
                      nameKey="ItemGroup"
                      stroke="none"
                    >
                      {productionMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle" 
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Orders & Production History */}
      <div className="dashboard-row fade-in-up delay-300">
        <div className="dashboard-col-1-2">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3><IconClipboardList size={20} /> Recent Production Orders</h3>
            </div>
            <div className="dashboard-card-content no-padding">
              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th className="text-right">Planned Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order, idx) => (
                        <tr key={idx}>
                          <td><strong>{order.DocNum}</strong></td>
                          <td>{(order.ProductName || order.ProductCode).substring(0, 25)}</td>
                          <td>
                            <span className={`status-badge ${
                              order.Status === 'L' ? 'success' : 
                              order.Status === 'R' ? 'warning' : 'default'
                            }`}>
                              {order.Status === 'L' ? 'Closed' : order.Status === 'R' ? 'Released' : 'Planned'}
                            </span>
                          </td>
                          <td className="text-right">{order.PlannedQty}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No recent orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-col-1-2">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3><IconTrendingUp size={20} /> Production vs Delivery (Last Month)</h3>
            </div>
            <div className="dashboard-card-content no-padding">
              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-right">Produced</th>
                      <th className="text-right">Delivered</th>
                      <th className="text-right">Net Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history && history.length > 0 ? (
                      history.map((item, idx) => {
                        const diff = item.ProducedQty - item.DeliveredQty;
                        const cls = diff > 0 ? 'success' : diff < 0 ? 'critical' : 'normal';
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{item.ItemCode}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{(item.ItemName || '').substring(0,25)}</div>
                            </td>
                            <td className="text-right">{item.ProducedQty?.toLocaleString()}</td>
                            <td className="text-right">{item.DeliveredQty?.toLocaleString()}</td>
                            <td className="text-right">
                              <span className={`status-badge ${cls}`}>{diff > 0 ? '+' : ''}{diff?.toLocaleString()}</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                          {historyLoading ? 'Loading history...' : 'No production history found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                <Pagination 
                  currentPage={historyPagination.page}
                  totalPages={historyPagination.totalPages}
                  totalItems={historyPagination.totalRecords}
                  pageSize={historyPagination.pageSize}
                  onPageChange={(p) => fetchHistory(p, historyPagination.pageSize)}
                  onPageSizeChange={(s) => {
                    setHistoryPagination(prev => ({ ...prev, pageSize: s, page: 1 }));
                    fetchHistory(1, s);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
