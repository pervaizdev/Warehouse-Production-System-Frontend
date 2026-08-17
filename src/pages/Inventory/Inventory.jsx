import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../apis/axiosinstance';
import { API_ENDPOINTS } from '../../apis/endpoints';
import StatCard from '../../global-components/StatCard/StatCard';
import Table from '../../global-components/Table/Table';
import GlobalPopup from '../../global-components/GlobalPopup/GlobalPopup';
import PieChart from '../../global-components/Charts/PieChart';
import BarChart from '../../global-components/Charts/BarChart';
import {
  IconBox,
  IconBuildingWarehouse,
  IconPackage,
  IconAlertTriangle,
  IconAlertCircle,
  IconTrendingDown,
  IconClock,
  IconShoppingCart,
  IconTruckDelivery,
  IconArrowsExchange,
  IconClipboardList,
  IconChartBar,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import './Inventory.css';

/* ── Number formatters ── */
const fmt = (n) => {
  if (n == null || isNaN(n)) return '0';
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
};
const fmtCurrency = (n) => {
  if (n == null || isNaN(n)) return 'PKR 0';
  if (Math.abs(n) >= 1e6) return `PKR ${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `PKR ${(n / 1e3).toFixed(1)}K`;
  return `PKR ${Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};
const fmtPrice = (n) => {
  if (n == null || isNaN(n)) return '0.00';
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/* ── Status badge renderer ── */
const StatusBadge = ({ status }) => {
  const cls = (status || '').toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge ${cls}`}>{status}</span>;
};

/* ── Tab definitions ── */
const TABS = [
  { key: 'stock', label: 'All Stock' },
  { key: 'warehouses', label: 'Warehouses' },
  { key: 'batches', label: 'Batches & Expiry' },
  { key: 'movements', label: 'Stock Movements' },
  { key: 'pipeline', label: 'Demand & Pipeline' },
];

const Inventory = () => {
  // ── State ──────────────────────────────────────────
  const [summary, setSummary] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [activeTab, setActiveTab] = useState('stock');

  // Filters
  const [warehouse, setWarehouse] = useState('');
  const [itemGroup, setItemGroup] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  // Stock tab
  const [stockData, setStockData] = useState([]);
  const [stockPage, setStockPage] = useState(1);
  const [stockPageSize, setStockPageSize] = useState(20);
  const [stockTotal, setStockTotal] = useState(0);
  const [stockStatus, setStockStatus] = useState('');

  // Warehouses tab
  const [warehouseData, setWarehouseData] = useState([]);

  // Item groups chart
  const [itemGroupData, setItemGroupData] = useState([]);

  // Batch / Expiry tab
  const [batchData, setBatchData] = useState([]);
  const [batchPage, setBatchPage] = useState(1);
  const [batchPageSize, setBatchPageSize] = useState(20);
  const [batchTotal, setBatchTotal] = useState(0);
  const [expiryBuckets, setExpiryBuckets] = useState([]);

  // Movements tab
  const [movementData, setMovementData] = useState([]);
  const [movementPage, setMovementPage] = useState(1);
  const [movementPageSize, setMovementPageSize] = useState(20);
  const [movementTotal, setMovementTotal] = useState(0);

  // Pipeline tab
  const [poPipeline, setPoPipeline] = useState([]);
  const [poPage, setPoPage] = useState(1);
  const [poPageSize, setPoPageSize] = useState(20);
  const [poTotal, setPoTotal] = useState(0);

  const [commitments, setCommitments] = useState([]);
  const [soPage, setSoPage] = useState(1);
  const [soPageSize, setSoPageSize] = useState(20);
  const [soTotal, setSoTotal] = useState(0);

  const [prodDemand, setProdDemand] = useState([]);
  const [prodPage, setProdPage] = useState(1);
  const [prodPageSize, setProdPageSize] = useState(20);
  const [prodTotal, setProdTotal] = useState(0);

  // Item detail modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemDetail, setItemDetail] = useState(null);

  // ── Fetch helpers ──────────────────────────────────
  const fetchSummary = useCallback(async () => {
    try {
      const params = {};
      if (warehouse) params.warehouse = warehouse;
      if (itemGroup) params.itemGroup = itemGroup;
      if (category) params.category = category;
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.SUMMARY, { params });
      if (res.data?.success) setSummary(res.data.data);
    } catch (err) {
      console.error('Inventory summary error:', err);
    }
  }, [warehouse, itemGroup, category]);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.FILTERS);
      if (res.data?.success) setFilterOptions(res.data.data);
    } catch (err) {
      console.error('Inventory filter error:', err);
    }
  }, []);

  const fetchStock = useCallback(async () => {
    try {
      const params = { page: stockPage, pageSize: stockPageSize };
      if (warehouse) params.warehouse = warehouse;
      if (itemGroup) params.itemGroup = itemGroup;
      if (category) params.category = category;
      if (search) params.search = search;
      if (stockStatus) params.status = stockStatus;
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.CURRENT, { params });
      if (res.data?.success) {
        setStockData(res.data.data);
        setStockTotal(res.data.pagination.totalRecords);
      }
    } catch (err) {
      console.error('Stock data error:', err);
    }
  }, [stockPage, stockPageSize, warehouse, itemGroup, category, search, stockStatus]);

  const fetchWarehouses = useCallback(async () => {
    try {
      const [whRes, grpRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.INVENTORY.WAREHOUSES),
        axiosInstance.get(API_ENDPOINTS.INVENTORY.ITEM_GROUPS),
      ]);
      if (whRes.data?.success) setWarehouseData(whRes.data.data);
      if (grpRes.data?.success) setItemGroupData(grpRes.data.data);
    } catch (err) {
      console.error('Warehouse data error:', err);
    }
  }, []);

  const fetchBatches = useCallback(async () => {
    try {
      const [bRes, eRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.INVENTORY.BATCHES, {
          params: { page: batchPage, pageSize: batchPageSize, search },
        }),
        axiosInstance.get(API_ENDPOINTS.INVENTORY.EXPIRY),
      ]);
      if (bRes.data?.success) {
        setBatchData(bRes.data.data);
        setBatchTotal(bRes.data.pagination.totalRecords);
      }
      if (eRes.data?.success) setExpiryBuckets(eRes.data.data);
    } catch (err) {
      console.error('Batch data error:', err);
    }
  }, [batchPage, batchPageSize, search]);

  const fetchMovements = useCallback(async () => {
    try {
      const params = { page: movementPage, pageSize: movementPageSize };
      if (warehouse) params.warehouse = warehouse;
      if (search) params.search = search;
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.MOVEMENTS, { params });
      if (res.data?.success) {
        setMovementData(res.data.data);
        setMovementTotal(res.data.pagination.totalRecords);
      }
    } catch (err) {
      console.error('Movement data error:', err);
    }
  }, [movementPage, movementPageSize, warehouse, search]);

  const fetchPoPipeline = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.PURCHASE_PIPELINE, {
        params: { page: poPage, pageSize: poPageSize }
      });
      if (res.data?.success) {
        setPoPipeline(res.data.data);
        setPoTotal(res.data.pagination.totalRecords);
      }
    } catch (err) {
      console.error('PO Pipeline error:', err);
    }
  }, [poPage, poPageSize]);

  const fetchCommitments = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.COMMITMENTS, {
        params: { page: soPage, pageSize: soPageSize }
      });
      if (res.data?.success) {
        setCommitments(res.data.data);
        setSoTotal(res.data.pagination.totalRecords);
      }
    } catch (err) {
      console.error('Commitments error:', err);
    }
  }, [soPage, soPageSize]);

  const fetchProdDemand = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.PRODUCTION_DEMAND, {
        params: { page: prodPage, pageSize: prodPageSize }
      });
      if (res.data?.success) {
        setProdDemand(res.data.data);
        setProdTotal(res.data.pagination.totalRecords);
      }
    } catch (err) {
      console.error('Production demand error:', err);
    }
  }, [prodPage, prodPageSize]);

  const fetchItemDetail = useCallback(async (itemCode) => {
    try {
      setSelectedItem(itemCode);
      setItemDetail(null);
      const res = await axiosInstance.get(API_ENDPOINTS.INVENTORY.ITEM_DETAIL(itemCode));
      if (res.data?.success) setItemDetail(res.data.data);
    } catch (err) {
      console.error('Item detail error:', err);
    }
  }, []);

  // ── Effects ────────────────────────────────────────
  useEffect(() => { fetchFilters(); }, [fetchFilters]);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  useEffect(() => {
    if (activeTab === 'stock') fetchStock();
    else if (activeTab === 'warehouses') fetchWarehouses();
    else if (activeTab === 'batches') fetchBatches();
    else if (activeTab === 'movements') fetchMovements();
    else if (activeTab === 'pipeline') {
      fetchPoPipeline();
      fetchCommitments();
      fetchProdDemand();
    }
  }, [activeTab, fetchStock, fetchWarehouses, fetchBatches, fetchMovements, fetchPoPipeline, fetchCommitments, fetchProdDemand]);

  // Reset page when filters change
  useEffect(() => { setStockPage(1); }, [warehouse, itemGroup, category, search, stockStatus]);

  // ── Chart data transforms ─────────────────────────
  const warehouseChartData = warehouseData.slice(0, 8).map((w) => ({
    name: w.WhsName || w.WhsCode,
    value: Math.round(w.InventoryValue || 0),
  }));

  const itemGroupChartData = itemGroupData.slice(0, 8).map((g) => ({
    name: g.ItemGroup || 'Unknown',
    value: Math.round(g.InventoryValue || 0),
  }));

  const expiryChartData = expiryBuckets.map((b) => ({
    name: b.Bucket,
    value: b.BatchCount,
    color: b.Bucket === 'Expired' ? '#dc2626' : b.Bucket === '0-30 Days' ? '#f59e0b' : b.Bucket === '31-60 Days' ? '#eab308' : '#10b981',
  }));

  // ── Stock Table Columns ────────────────────────────
  const stockColumns = [
    { header: 'Item Code', key: 'ItemCode' },
    { header: 'Item Name', key: 'ItemName', render: (r) => <span title={r.ItemName}>{(r.ItemName || '').substring(0, 35)}</span> },
    { header: 'Group', key: 'ItemGroup', render: (r) => <span title={r.ItemGroup}>{(r.ItemGroup || '').substring(0, 20)}</span> },
    { header: 'Warehouse', key: 'WhsCode', render: (r) => <span title={r.WhsName}>{r.WhsCode}</span> },
    { header: 'On Hand', key: 'OnHand', render: (r) => <span className="text-right tabular-nums">{fmt(r.OnHand)}</span> },
    { header: 'Committed', key: 'Committed', render: (r) => <span className="text-right tabular-nums">{fmt(r.Committed)}</span> },
    { header: 'On Order', key: 'OnOrder', render: (r) => <span className="text-right tabular-nums">{fmt(r.OnOrder)}</span> },
    { header: 'Available', key: 'Available', render: (r) => <span className="text-right tabular-nums">{fmt(r.Available)}</span> },
    { header: 'Avg Price', key: 'AvgPrice', render: (r) => <span className="text-right tabular-nums">{fmtPrice(r.AvgPrice)}</span> },
    { header: 'Value', key: 'InventoryValue', render: (r) => <span className="text-right tabular-nums">{fmtCurrency(r.InventoryValue)}</span> },
    { header: 'Status', key: 'StockStatus', render: (r) => <StatusBadge status={r.StockStatus} /> },
  ];

  // ── Warehouse Table Columns ────────────────────────
  const warehouseColumns = [
    { header: 'Code', key: 'WhsCode' },
    { header: 'Warehouse', key: 'WhsName' },
    { header: 'SKUs', key: 'TotalSKUs', render: (r) => <span className="tabular-nums">{fmt(r.TotalSKUs)}</span> },
    { header: 'On Hand', key: 'TotalOnHand', render: (r) => <span className="tabular-nums">{fmt(r.TotalOnHand)}</span> },
    { header: 'Committed', key: 'TotalCommitted', render: (r) => <span className="tabular-nums">{fmt(r.TotalCommitted)}</span> },
    { header: 'Available', key: 'TotalAvailable', render: (r) => <span className="tabular-nums">{fmt(r.TotalAvailable)}</span> },
    { header: 'Value', key: 'InventoryValue', render: (r) => <span className="tabular-nums">{fmtCurrency(r.InventoryValue)}</span> },
    { header: 'Critical', key: 'CriticalItems', render: (r) => r.CriticalItems > 0 ? <span className="status-badge critical">{r.CriticalItems}</span> : <span>0</span> },
  ];

  // ── Batch Table Columns ────────────────────────────
  const batchColumns = [
    { header: 'Item', key: 'ItemCode' },
    { header: 'Item Name', key: 'ItemName', render: (r) => <span title={r.ItemName}>{(r.ItemName || '').substring(0, 30)}</span> },
    { header: 'Batch', key: 'BatchNumber' },
    { header: 'Warehouse', key: 'WhsCode' },
    { header: 'Quantity', key: 'Quantity', render: (r) => <span className="tabular-nums">{fmt(r.Quantity)}</span> },
    { header: 'Expiry Date', key: 'ExpDate', render: (r) => r.ExpDate ? new Date(r.ExpDate).toLocaleDateString() : '—' },
    {
      header: 'Days Left', key: 'DaysUntilExpiry', render: (r) => {
        if (r.DaysUntilExpiry == null) return '—';
        if (r.DaysUntilExpiry < 0) return <span className="status-badge expired">Expired</span>;
        if (r.DaysUntilExpiry <= 90) return <span className="status-badge near-expiry">{r.DaysUntilExpiry}d</span>;
        return <span className="tabular-nums">{r.DaysUntilExpiry}d</span>;
      },
    },
    { header: 'QC', key: 'QCDecision', render: (r) => r.QCDecision || '—' },
  ];

  // ── Movement Table Columns ─────────────────────────
  const movementColumns = [
    { header: 'Date', key: 'DocDate', render: (r) => r.DocDate ? new Date(r.DocDate).toLocaleDateString() : '—' },
    { header: 'Item', key: 'ItemCode' },
    { header: 'Item Name', key: 'ItemName', render: (r) => <span title={r.ItemName}>{(r.ItemName || '').substring(0, 25)}</span> },
    { header: 'Warehouse', key: 'Warehouse', render: (r) => <span title={r.WhsName}>{r.Warehouse}</span> },
    { header: 'Type', key: 'TransTypeName' },
    { header: 'In', key: 'InQty', render: (r) => r.InQty > 0 ? <span className="tabular-nums qty-in-text">+{fmt(r.InQty)}</span> : '—' },
    { header: 'Out', key: 'OutQty', render: (r) => r.OutQty > 0 ? <span className="tabular-nums qty-out-text">-{fmt(r.OutQty)}</span> : '—' },
    { header: 'Value', key: 'TransValue', render: (r) => <span className="tabular-nums">{fmtCurrency(r.TransValue)}</span> },
    { header: 'Doc #', key: 'DocNumber' },
  ];

  // ── Purchase Pipeline Columns ──────────────────────
  const poColumns = [
    { header: 'PO #', key: 'PONumber' },
    { header: 'Supplier', key: 'Supplier', render: (r) => <span title={r.Supplier}>{(r.Supplier || '').substring(0, 25)}</span> },
    { header: 'Item', key: 'ItemCode' },
    { header: 'Item Name', key: 'ItemName', render: (r) => <span title={r.ItemName}>{(r.ItemName || '').substring(0, 20)}</span> },
    { header: 'Open Qty', key: 'OpenQty', render: (r) => <span className="tabular-nums">{fmt(r.OpenQty)}</span> },
    { header: 'Open Value', key: 'OpenValue', render: (r) => <span className="tabular-nums">{fmtCurrency(r.OpenValue)}</span> },
    { header: 'ETA', key: 'ExpectedDelivery', render: (r) => r.ExpectedDelivery ? new Date(r.ExpectedDelivery).toLocaleDateString() : '—' },
  ];

  // ── Commitment Columns ─────────────────────────────
  const soColumns = [
    { header: 'SO #', key: 'SONumber' },
    { header: 'Customer', key: 'Customer', render: (r) => <span title={r.Customer}>{(r.Customer || '').substring(0, 25)}</span> },
    { header: 'Item', key: 'ItemCode' },
    { header: 'Open Qty', key: 'OpenQty', render: (r) => <span className="tabular-nums">{fmt(r.OpenQty)}</span> },
    { header: 'Due', key: 'RequiredDate', render: (r) => r.RequiredDate ? new Date(r.RequiredDate).toLocaleDateString() : '—' },
  ];

  // ── Production Demand Columns ──────────────────────
  const prodColumns = [
    { header: 'Item', key: 'ItemCode' },
    { header: 'Item Name', key: 'ItemName', render: (r) => <span title={r.ItemName}>{(r.ItemName || '').substring(0, 25)}</span> },
    { header: 'Planned', key: 'TotalPlanned', render: (r) => <span className="tabular-nums">{fmt(r.TotalPlanned)}</span> },
    { header: 'Issued', key: 'TotalIssued', render: (r) => <span className="tabular-nums">{fmt(r.TotalIssued)}</span> },
    { header: 'Remaining', key: 'RemainingRequirement', render: (r) => <span className="tabular-nums">{fmt(r.RemainingRequirement)}</span> },
    { header: 'Available', key: 'AvailableStock', render: (r) => <span className="tabular-nums">{fmt(r.AvailableStock)}</span> },
    {
      header: 'Shortage', key: 'ShortageQty', render: (r) =>
        r.ShortageQty > 0 ? <span className="status-badge critical">{fmt(r.ShortageQty)}</span> : <span className="tabular-nums">0</span>,
    },
  ];

  // ── Render ─────────────────────────────────────────
  return (
    <div className="inventory-page fade-in-up">
      {/* Header */}
      <div className="inventory-header">
        <h1>Inventory Dashboard</h1>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <input
          className="search-input"
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
          <option value="">All Warehouses</option>
          {filterOptions?.warehouses?.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
        <select value={itemGroup} onChange={(e) => setItemGroup(e.target.value)}>
          <option value="">All Item Groups</option>
          {filterOptions?.itemGroups?.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {filterOptions?.categories?.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {activeTab === 'stock' && (
          <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="normal">Normal</option>
            <option value="critical">Critical</option>
            <option value="out">Out of Stock</option>
            <option value="negative">Negative</option>
            <option value="excess">Excess</option>
          </select>
        )}
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="inventory-kpi-grid fade-in-up">
          <StatCard
            title="Inventory Value"
            value={fmtCurrency(summary.totalInventoryValue)}
            icon={IconCurrencyDollar}
            color="primary"
            subtext={`${fmt(summary.activeSKUs)} active SKUs`}
          />
          <StatCard
            title="On Hand"
            value={fmt(summary.totalOnHand)}
            icon={IconPackage}
            color="blue"
            subtext={`${fmt(summary.activeWarehouses)} warehouses`}
          />
          <StatCard
            title="Committed"
            value={fmt(summary.totalCommitted)}
            icon={IconClipboardList}
            color="amber"
            subtext="Allocated to orders"
          />
          <StatCard
            title="On Order"
            value={fmt(summary.totalOnOrder)}
            icon={IconTruckDelivery}
            color="emerald"
            subtext="Incoming from POs"
          />
          <StatCard
            title="Out of Stock"
            value={fmt(summary.outOfStockItems)}
            icon={IconAlertCircle}
            color="rose"
            subtext={`${fmt(summary.negativeStockItems)} negative`}
          />
          <StatCard
            title="Expired Batches"
            value={fmt(summary.expiredBatches)}
            icon={IconClock}
            color="purple"
            subtext={`${fmt(summary.nearExpiryBatches)} near expiry`}
          />
        </div>
      )}

      {/* Charts (warehouse + item group) */}
      {activeTab === 'warehouses' && warehouseChartData.length > 0 && (
        <div className="inventory-charts-grid fade-in-up delay-100">
          <div className="inventory-chart-card">
            <h3>Inventory Value by Warehouse</h3>
            <div className="chart-wrapper">
              <PieChart data={warehouseChartData} />
            </div>
          </div>
          <div className="inventory-chart-card">
            <h3>Inventory Value by Item Group</h3>
            <div className="chart-wrapper">
              <BarChart data={itemGroupChartData} layout="vertical" />
            </div>
          </div>
        </div>
      )}

      {/* Expiry chart */}
      {activeTab === 'batches' && expiryChartData.length > 0 && (
        <div className="inventory-charts-grid fade-in-up delay-100">
          <div className="inventory-chart-card">
            <h3>Batch Expiry Distribution</h3>
            <div className="chart-wrapper">
              <PieChart data={expiryChartData} />
            </div>
          </div>
          <div className="inventory-chart-card">
            <h3>Batches by Expiry Bucket</h3>
            <div className="chart-wrapper">
              <BarChart data={expiryChartData} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="inventory-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`inventory-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}

      {/* All Stock */}
      {activeTab === 'stock' && (
        <div className="inventory-section fade-in-up">
          <Table
            data={stockData}
            columns={stockColumns}
            totalEntries={stockTotal}
            showActions={false}
            showPagination
            currentPage={stockPage}
            pageSize={stockPageSize}
            onPageChange={setStockPage}
            onItemsPerPageChange={(size) => { setStockPageSize(size); setStockPage(1); }}
            onRowClick={(row) => fetchItemDetail(row.ItemCode)}
          />
        </div>
      )}

      {/* Warehouses */}
      {activeTab === 'warehouses' && (
        <div className="inventory-section fade-in-up">
          <h3>Warehouse Inventory Overview</h3>
          <Table
            data={warehouseData}
            columns={warehouseColumns}
            totalEntries={warehouseData.length}
            showActions={false}
            showPagination={false}
          />
        </div>
      )}

      {/* Batches & Expiry */}
      {activeTab === 'batches' && (
        <div className="inventory-section fade-in-up">
          <h3>Batch Inventory</h3>
          <Table
            data={batchData}
            columns={batchColumns}
            totalEntries={batchTotal}
            showActions={false}
            showPagination
            currentPage={batchPage}
            pageSize={batchPageSize}
            onPageChange={setBatchPage}
            onItemsPerPageChange={(size) => { setBatchPageSize(size); setBatchPage(1); }}
          />
        </div>
      )}

      {/* Movements */}
      {activeTab === 'movements' && (
        <div className="inventory-section fade-in-up">
          <h3>Inventory Movement History</h3>
          <Table
            data={movementData}
            columns={movementColumns}
            totalEntries={movementTotal}
            showActions={false}
            showPagination
            currentPage={movementPage}
            pageSize={movementPageSize}
            onPageChange={setMovementPage}
            onItemsPerPageChange={(size) => { setMovementPageSize(size); setMovementPage(1); }}
          />
        </div>
      )}

      {/* Pipeline & Demand */}
      {activeTab === 'pipeline' && (
        <div className="fade-in-up">
          <div className="inventory-section">
            <h3>Purchase Pipeline (Open POs)</h3>
            <Table
              data={poPipeline}
              columns={poColumns}
              totalEntries={poTotal}
              showActions={false}
              showPagination
              currentPage={poPage}
              pageSize={poPageSize}
              onPageChange={setPoPage}
              onItemsPerPageChange={(size) => { setPoPageSize(size); setPoPage(1); }}
            />
          </div>
          <div className="inventory-section">
            <h3>Sales Commitments (Open SOs)</h3>
            <Table
              data={commitments}
              columns={soColumns}
              totalEntries={soTotal}
              showActions={false}
              showPagination
              currentPage={soPage}
              pageSize={soPageSize}
              onPageChange={setSoPage}
              onItemsPerPageChange={(size) => { setSoPageSize(size); setSoPage(1); }}
            />
          </div>
          <div className="inventory-section">
            <h3>Production Material Demand</h3>
            <Table
              data={prodDemand}
              columns={prodColumns}
              totalEntries={prodTotal}
              showActions={false}
              showPagination
              currentPage={prodPage}
              pageSize={prodPageSize}
              onPageChange={setProdPage}
              onItemsPerPageChange={(size) => { setProdPageSize(size); setProdPage(1); }}
            />
          </div>
        </div>
      )}

      {/* ── Item Detail Modal ── */}
      {selectedItem && (
        <GlobalPopup title={`Item: ${selectedItem}`} onClose={() => { setSelectedItem(null); setItemDetail(null); }} className="item-detail-modal">
          {!itemDetail ? (
            <div className="item-detail-body"><p>Loading...</p></div>
          ) : (
            <>
              <div className="item-detail-header">
                <h2>{itemDetail.overview?.ItemName || selectedItem}</h2>
                <div className="item-meta">
                  {itemDetail.overview?.ItemCode} • {itemDetail.overview?.ItemGroup} • {itemDetail.overview?.Category || '—'} • {itemDetail.overview?.UOM}
                </div>
              </div>
              <div className="item-detail-body">
                {/* Metrics */}
                <div className="item-detail-grid">
                  <div className="item-detail-metric"><span className="metric-label">On Hand</span><span className="metric-value">{fmt(itemDetail.overview?.OnHand)}</span></div>
                  <div className="item-detail-metric"><span className="metric-label">Committed</span><span className="metric-value">{fmt(itemDetail.overview?.Committed)}</span></div>
                  <div className="item-detail-metric"><span className="metric-label">On Order</span><span className="metric-value">{fmt(itemDetail.overview?.OnOrder)}</span></div>
                  <div className="item-detail-metric"><span className="metric-label">Available</span><span className="metric-value">{fmt(itemDetail.overview?.Available)}</span></div>
                  <div className="item-detail-metric"><span className="metric-label">Avg Price</span><span className="metric-value">{fmtPrice(itemDetail.overview?.AvgPrice)}</span></div>
                  <div className="item-detail-metric"><span className="metric-label">Inv. Value</span><span className="metric-value">{fmtCurrency(itemDetail.overview?.InventoryValue)}</span></div>
                </div>

                {/* Warehouse Breakdown */}
                {itemDetail.warehouses?.length > 0 && (
                  <div className="item-detail-section">
                    <h4>Stock by Warehouse</h4>
                    <Table
                      data={itemDetail.warehouses}
                      columns={[
                        { header: 'Warehouse', key: 'WhsCode', render: (r) => <span title={r.WhsName}>{r.WhsCode} - {r.WhsName}</span> },
                        { header: 'On Hand', key: 'OnHand', render: (r) => <span className="tabular-nums">{fmt(r.OnHand)}</span> },
                        { header: 'Committed', key: 'Committed', render: (r) => <span className="tabular-nums">{fmt(r.Committed)}</span> },
                        { header: 'Available', key: 'Available', render: (r) => <span className="tabular-nums">{fmt(r.Available)}</span> },
                        { header: 'Value', key: 'Value', render: (r) => <span className="tabular-nums">{fmtCurrency(r.Value)}</span> },
                      ]}
                      totalEntries={itemDetail.warehouses.length}
                      showActions={false}
                      showPagination={false}
                    />
                  </div>
                )}

                {/* Batches */}
                {itemDetail.batches?.length > 0 && (
                  <div className="item-detail-section">
                    <h4>Batches</h4>
                    <Table
                      data={itemDetail.batches}
                      columns={[
                        { header: 'Batch', key: 'BatchNumber' },
                        { header: 'Warehouse', key: 'WhsCode' },
                        { header: 'Quantity', key: 'Quantity', render: (r) => <span className="tabular-nums">{fmt(r.Quantity)}</span> },
                        { header: 'Expiry', key: 'ExpDate', render: (r) => r.ExpDate ? new Date(r.ExpDate).toLocaleDateString() : '—' },
                        {
                          header: 'Days Left', key: 'DaysUntilExpiry', render: (r) => {
                            if (r.DaysUntilExpiry == null) return '—';
                            if (r.DaysUntilExpiry < 0) return <span className="status-badge expired">Expired</span>;
                            if (r.DaysUntilExpiry <= 90) return <span className="status-badge near-expiry">{r.DaysUntilExpiry}d</span>;
                            return <span>{r.DaysUntilExpiry}d</span>;
                          },
                        },
                        { header: 'QC', key: 'QCDecision', render: (r) => r.QCDecision || '—' },
                      ]}
                      totalEntries={itemDetail.batches.length}
                      showActions={false}
                      showPagination={false}
                    />
                  </div>
                )}

                {/* Recent Movements */}
                {itemDetail.movements?.length > 0 && (
                  <div className="item-detail-section">
                    <h4>Recent Movements</h4>
                    <Table
                      data={itemDetail.movements}
                      columns={[
                        { header: 'Date', key: 'DocDate', render: (r) => r.DocDate ? new Date(r.DocDate).toLocaleDateString() : '—' },
                        { header: 'Type', key: 'TransTypeName' },
                        { header: 'Warehouse', key: 'Warehouse' },
                        { header: 'In', key: 'InQty', render: (r) => r.InQty > 0 ? <span className="tabular-nums qty-in-text">+{fmt(r.InQty)}</span> : '—' },
                        { header: 'Out', key: 'OutQty', render: (r) => r.OutQty > 0 ? <span className="tabular-nums qty-out-text">-{fmt(r.OutQty)}</span> : '—' },
                        { header: 'Doc #', key: 'DocNumber' },
                      ]}
                      totalEntries={itemDetail.movements.length}
                      showActions={false}
                      showPagination={false}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </GlobalPopup>
      )}
    </div>
  );
};

export default Inventory;
