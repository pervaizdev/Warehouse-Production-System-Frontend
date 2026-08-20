import React, { useState, useEffect, useCallback } from "react";
import {
  IconRefresh,
  IconAlertTriangle,
  IconAlertCircle,
  IconCheck,
  IconTrendingUp,
  IconTrendingDown,
  IconPackage,
  IconSettings,
  IconCurrencyDollar,
  IconClipboardList,
  IconClock,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { axiosInstance } from "../../apis/axiosinstance";
import { API_ENDPOINTS } from "../../apis/endpoints";
import Pagination from "../../global-components/Pagination/Pagination";
import "./Dashboard.css";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

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
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    pageSize: 5,
    totalRecords: 0,
    totalPages: 0,
  });
  const [historyLoading, setHistoryLoading] = useState(false);

  // Filtered Orders State
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderVolume, setOrderVolume] = useState({ ReleasedCount: 0, ClosedCount: 0, CancelledCount: 0, PlannedCount: 0, DelayedCount: 0 });
  const [filteredOrdersLoading, setFilteredOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [tableDateFilter, setTableDateFilter] = useState('today');
  const [volumeDateFilter, setVolumeDateFilter] = useState('yearly');

  // Filters and Warehouses
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({
    warehouse: "",
    dateFrom: "",
    dateTo: "",
  });

  const fetchHistory = useCallback(
    async (page = 1, pageSize = 5) => {
      setHistoryLoading(true);
      try {
        const params = { page, pageSize, months: 1 };
        if (filters.warehouse) params.warehouse = filters.warehouse;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;

        const res = await axiosInstance.get(
          API_ENDPOINTS.PRODUCTION_PLANNING.HISTORY,
          { params },
        );
        if (res.data?.success) {
          setHistory(res.data.data);
          setHistoryPagination({
            page: res.data.pagination.currentPage,
            pageSize: res.data.pagination.pageSize,
            totalRecords: res.data.pagination.totalRecords,
            totalPages: res.data.pagination.totalPages,
          });
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setHistoryLoading(false);
      }
    },
    [filters],
  );

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
        axiosInstance.get(API_ENDPOINTS.PRODUCTION_PLANNING.SHORTAGES, {
          params: { pageSize: 5, ...params },
        }),
      ]);

      if (overviewRes.data && overviewRes.data.success) {
        setData({
          ...overviewRes.data.data,
          shortages: shortagesRes.data?.data || [],
        });
      } else {
        throw new Error(
          overviewRes.data?.message || "Failed to fetch dashboard data",
        );
      }
    } catch (err) {
      console.error("Error fetching dashboard overview:", err);
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchFilteredOrders = useCallback(async () => {
    setFilteredOrdersLoading(true);
    try {
      const params = { 
        status: orderStatusFilter, 
        tableDateFilter: tableDateFilter,
        volumeDateFilter: volumeDateFilter
      };
      if (filters.warehouse) params.warehouse = filters.warehouse;
      
      const res = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.OVERVIEW + '/filtered-orders', { params });
      if (res.data?.success) {
        setFilteredOrders(res.data.data.orders || []);
        setOrderVolume(res.data.data.volume || { ReleasedCount: 0, ClosedCount: 0, CancelledCount: 0, PlannedCount: 0, DelayedCount: 0 });
      }
    } catch (err) {
      console.error("Error fetching filtered orders:", err);
    } finally {
      setFilteredOrdersLoading(false);
    }
  }, [orderStatusFilter, tableDateFilter, volumeDateFilter, filters.warehouse]);

  useEffect(() => {
    // Fetch warehouses for dropdown
    const fetchWarehouses = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.WAREHOUSES);
        if (res.data?.success) {
          setWarehouses(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch warehouses:", err);
      }
    };
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchOverviewData();
    fetchHistory(1, historyPagination.pageSize);
  }, [fetchOverviewData, fetchHistory]);

  useEffect(() => {
    fetchFilteredOrders();
  }, [fetchFilteredOrders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefresh = () => {
    fetchOverviewData();
    fetchFilteredOrders();
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
          <button className="btn-refresh" onClick={handleRefresh}>
            Try Again
          </button>
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
    openOrdersDetails,
    alerts,
    shortages,
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
            {warehouses.map((w) => (
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
                <span className="label">Total Orders</span>
                <span className="value">
                  {executiveKPIs.totalOrders}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper green">
                <IconCheck size={28} />
              </div>
              <div className="health-stat">
                <span className="label">In Progress Orders</span>
                <span className="value">
                  {executiveKPIs.activeOrders}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper orange">
                <IconAlertCircle size={28} />
              </div>
              <div className="health-stat">
                <span className="label">Cancelled Orders</span>
                <span className="value">
                  {executiveKPIs.cancelledOrders || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper red">
                <IconAlertTriangle size={28} />
              </div>
              <div className="health-stat">
                <span className="label">Delayed Orders</span>
                <span className="value">
                  {executiveKPIs.delayedOrders || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div className="kpi-stat-container">
              <div className="kpi-icon-wrapper blue">
                <IconCheck size={28} />
              </div>
              <div className="health-stat">
                <span className="label">Closed Orders</span>
                <span className="value">
                  {executiveKPIs.closedOrders || 0}
                </span>
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
              <h3>
                <IconTrendingUp size={20} /> Production Output Trend (Last 6
                Months)
              </h3>
            </div>
            <div className="dashboard-card-content">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={productionPerformance}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="Month"
                      tickFormatter={(val) => {
                        const months = [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];
                        return months[val - 1] || val;
                      }}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="PlannedQty"
                      stroke="#3b82f6"
                      name="Planned Qty"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="OrderCount"
                      stroke="#10b981"
                      name="Orders Count"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-col-1-3">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>
                <IconAlertCircle size={20} /> Operational Alerts
              </h3>
            </div>
            <div className="dashboard-card-content no-padding">
              {alerts && alerts.length > 0 ? (
                <div className="alert-list" style={{ padding: "1rem" }}>
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`alert-item ${alert.type}`}>
                      <div className={`alert-icon ${alert.type}`}>
                        {alert.type === "critical" ? (
                          <IconAlertTriangle />
                        ) : (
                          <IconAlertCircle />
                        )}
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
              <h3>
                <IconPackage size={20} /> Critical Material Shortages
              </h3>
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
                            <div
                              style={{ fontSize: "0.75rem", color: "#64748b" }}
                            >
                              {item.ComponentName}
                            </div>
                          </td>
                          <td className="text-right">
                            {item.RemainingRequired?.toLocaleString()}
                          </td>
                          <td className="text-right">
                            {item.TotalAvailable?.toLocaleString()}
                          </td>
                          <td className="text-right">
                            <span className="status-badge critical">
                              {item.ShortageQty?.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          style={{ textAlign: "center", padding: "2rem" }}
                        >
                          No critical shortages
                        </td>
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
              <h3>
                <IconClipboardList size={20} /> Open Orders
              </h3>
            </div>
            <div className="dashboard-card-content no-padding">
              <div
                className="compact-table-wrapper"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th className="text-right">Qty (Actual / Plan)</th>
                      <th className="text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openOrdersDetails && openOrdersDetails.length > 0 ? (
                      openOrdersDetails.map((order, idx) => {
                        const progress =
                          order.PlannedQty > 0
                            ? (order.ActualQty / order.PlannedQty) * 100
                            : 0;
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{order.DocNum}</strong>
                            </td>
                            <td>
                              {(order.ProductName || "").substring(0, 20)}
                            </td>
                            <td>
                              <span
                                className={`status-badge ${order.Status === "R" ? "warning" : "default"}`}
                              >
                                {order.Status === "R" ? "Released" : "Planned"}
                              </span>
                            </td>
                            <td className="text-right">
                              <strong>
                                {order.ActualQty?.toLocaleString()}
                              </strong>{" "}
                              / {order.PlannedQty?.toLocaleString()}
                            </td>
                            <td className="text-right">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  gap: "8px",
                                }}
                              >
                                <span style={{ fontSize: "0.8rem" }}>
                                  {progress.toFixed(0)}%
                                </span>
                                <div
                                  style={{
                                    width: "40px",
                                    height: "6px",
                                    background: "#e2e8f0",
                                    borderRadius: "3px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      height: "100%",
                                      width: `${Math.min(progress, 100)}%`,
                                      background:
                                        progress < 100 ? "#3b82f6" : "#10b981",
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          style={{ textAlign: "center", padding: "2rem" }}
                        >
                          No open orders
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Filtered Orders & Volume summary */}
      <div className="dashboard-row fade-in-up delay-300">
        <div className="dashboard-col-2-3">
          <div className="dashboard-card">
            <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0 }}>
                <IconClipboardList size={20} /> Production Orders
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  value={orderStatusFilter} 
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="R">Work In Progress</option>
                  <option value="L">Complete</option>
                  <option value="C">Cancelled</option>
                  <option value="Delayed">Delayed</option>
                </select>
                <select 
                  value={tableDateFilter} 
                  onChange={(e) => setTableDateFilter(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                >
                  <option value="today">Today</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="dashboard-card-content no-padding">
              <div className="compact-table-wrapper" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th className="text-right">Planned Qty</th>
                      <th className="text-right">Actual Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdersLoading ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                          Loading orders...
                        </td>
                      </tr>
                    ) : filteredOrders && filteredOrders.length > 0 ? (
                      filteredOrders.map((order, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{order.DocNum}</strong>
                          </td>
                          <td>
                            {(order.ProductName || "").substring(0, 25)}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                order.Status === "L"
                                  ? "success"
                                  : order.Status === "R"
                                    ? "warning"
                                    : order.Status === "C"
                                      ? "critical"
                                      : "default"
                              }`}
                            >
                              {order.Status === "L"
                                ? "Closed"
                                : order.Status === "R"
                                  ? "Released"
                                  : order.Status === "C"
                                    ? "Cancelled"
                                    : "Planned"}
                            </span>
                          </td>
                          <td className="text-right">{order.PlannedQty?.toLocaleString()}</td>
                          <td className="text-right">{order.ActualQty?.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                          No orders found for the selected filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-col-1-3">
          <div className="dashboard-card" style={{ height: '100%' }}>
            <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>
                <IconTrendingUp size={20} /> Order Volume (Created)
              </h3>
              <select 
                  value={volumeDateFilter} 
                  onChange={(e) => setVolumeDateFilter(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                >
                  <option value="today">Today</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
            </div>
            <div className="dashboard-card-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', padding: '1.5rem' }}>
              
              {/* Donut Chart */}
              <div style={{ flex: 1, minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {(() => {
                    const total = (orderVolume.ReleasedCount || 0) + 
                                  (orderVolume.ClosedCount || 0) + 
                                  (orderVolume.CancelledCount || 0) + 
                                  (orderVolume.PlannedCount || 0);
                    
                    const chartData = total > 0 ? [
                      { name: 'Released', value: orderVolume.ReleasedCount || 0, fill: '#10b981' },
                      { name: 'Closed', value: orderVolume.ClosedCount || 0, fill: '#3b82f6' },
                      { name: 'Cancelled', value: orderVolume.CancelledCount || 0, fill: '#ef4444' },
                      { name: 'Planned', value: orderVolume.PlannedCount || 0, fill: '#f59e0b' }
                    ].filter(d => d.value > 0) : [{ name: 'No Data', value: 1, fill: '#e2e8f0' }];

                    return (
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={total > 0 ? 5 : 0}
                          dataKey="value"
                          isAnimationActive={total > 0}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        {total > 0 && <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />}
                      </PieChart>
                    );
                  })()}
                </ResponsiveContainer>
              </div>

              {/* Legend / Stats List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Released</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem' }}>{orderVolume.ReleasedCount || 0}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Closed</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem' }}>{orderVolume.ClosedCount || 0}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Cancelled</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem' }}>{orderVolume.CancelledCount || 0}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Planned</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem' }}>{orderVolume.PlannedCount || 0}</strong>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>      
    </div>
  );
}
