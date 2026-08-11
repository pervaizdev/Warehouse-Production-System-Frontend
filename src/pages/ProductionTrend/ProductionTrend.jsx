import React, { useState, useEffect } from 'react';
import { productionTrendApi } from '../../apis/auth/production-trend';
import ProductionTrendFilters from '../../components/ProductionTrend/ProductionTrendFilters';
import ProductionTrendCharts from '../../components/ProductionTrend/ProductionTrendCharts';
import ProductionTrendTable from '../../components/ProductionTrend/ProductionTrendTable';
import '../../components/ProductionTrend/ProductionTrend.css';

const ProductionTrend = () => {
  const [summary, setSummary] = useState({
    totalProduction: '0.00',
    totalOrders: 0,
    totalProducts: 0,
    totalRejected: '0.00',
    growthPercent: '0.00'
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [productShare, setProductShare] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [filters]);

  useEffect(() => {
    fetchTableData();
  }, [filters, page, pageSize, search]);

  const fetchFilterOptions = async () => {
    try {
      const res = await productionTrendApi.getFilterOptions();
      if (res.data.success) {
        setFilterOptions(res.data.data);
      }
    } catch (err) {
      console.error("Error loading filter options:", err);
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const [sumRes, monthRes, yearRes, shareRes, compRes] = await Promise.all([
        productionTrendApi.getSummary(filters),
        productionTrendApi.getMonthlyTrend(filters),
        productionTrendApi.getYearlyTrend(filters),
        productionTrendApi.getProductShare(filters),
        productionTrendApi.getYearComparison(filters)
      ]);

      if (sumRes.data.success) setSummary(sumRes.data.data);
      if (monthRes.data.success) setMonthlyData(monthRes.data.data);
      if (yearRes.data.success) setYearlyData(yearRes.data.data);
      if (shareRes.data.success) setProductShare(shareRes.data.data);
      if (compRes.data.success) setComparisonData(compRes.data.data);
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async () => {
    try {
      setTableLoading(true);
      const res = await productionTrendApi.getTableData(filters, page, pageSize, search);
      if (res.data.success) {
        setTableData(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.pagination.totalItems);
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearch('');
    setPage(1);
  };

  const formatNumber = (num) => {
    const val = parseFloat(num);
    if (isNaN(val)) return '0';
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="production-trend-container">
      
      {/* Header */}
      <div className="production-trend-header">
        <div>
          <h1>Product-wise Production Trend Dashboard</h1>
          <div className="production-trend-subtitle">
            Historical production output based on SAP B1 Goods Receipts from Production (OIGN / IGN1)
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProductionTrendFilters
        options={filterOptions}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* KPI Cards */}
      <div className="pt-kpi-grid">
        <div className="pt-kpi-card accent-blue">
          <div className="pt-kpi-title">Total Production</div>
          <div className="pt-kpi-value">{formatNumber(summary.totalProduction)}</div>
          <div className="pt-kpi-subtext">Total Quantity Received</div>
        </div>

        <div className="pt-kpi-card accent-purple">
          <div className="pt-kpi-title">Production Orders</div>
          <div className="pt-kpi-value">{summary.totalOrders}</div>
          <div className="pt-kpi-subtext">Unique Work Orders</div>
        </div>

        <div className="pt-kpi-card accent-emerald">
          <div className="pt-kpi-title">Products Produced</div>
          <div className="pt-kpi-value">{summary.totalProducts}</div>
          <div className="pt-kpi-subtext">Distinct Finished Items</div>
        </div>

        <div className="pt-kpi-card accent-amber">
          <div className="pt-kpi-title">Rejected Quantity</div>
          <div className="pt-kpi-value">{formatNumber(summary.totalRejected)}</div>
          <div className="pt-kpi-subtext">Total Scrapped Items</div>
        </div>

        <div className="pt-kpi-card accent-rose">
          <div className="pt-kpi-title">Period Growth %</div>
          <div className="pt-kpi-value">
            <span className={`growth-badge ${parseFloat(summary.growthPercent) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(summary.growthPercent) >= 0 ? `+${summary.growthPercent}%` : `${summary.growthPercent}%`}
            </span>
          </div>
          <div className="pt-kpi-subtext">vs Previous Period</div>
        </div>
      </div>

      {/* Charts */}
      <ProductionTrendCharts
        productShare={productShare}
        monthlyData={monthlyData}
        comparisonData={comparisonData}
      />

      {/* Detailed Table */}
      <ProductionTrendTable
        data={tableData}
        loading={tableLoading}
        pagination={{ page, pageSize, totalPages, totalItems }}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

    </div>
  );
};

export default ProductionTrend;
