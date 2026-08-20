import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../apis/axiosinstance';
import { API_ENDPOINTS } from '../../apis/endpoints';
import Table from '../../global-components/Table/Table';

const fmt = (n) => (n == null || isNaN(n)) ? '0' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

const ExpandableText = ({ text, maxLength = 30 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxLength) return <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{text}</span>;

  const spanStyle = {
    fontSize: '0.8rem',
    color: '#64748b',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    lineHeight: '1.4'
  };

  return (
    <span style={spanStyle}>
      {expanded ? text : `${text.substring(0, maxLength)}...`}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginLeft: '4px', padding: 0, fontSize: '0.75rem', textDecoration: 'underline' }}
      >
        {expanded ? 'less' : 'more'}
      </button>
    </span>
  );
};

const ProductionRecommendation = () => {
  const [data, setData] = useState([]);
  const [historyMonths, setHistoryMonths] = useState(6);
  const [targetDays, setTargetDays] = useState(30);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const params = { historyMonths, targetDays, search };
        const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTION_PLANNING.RECOMMENDATIONS, { params });
        if (res.data?.success) {
          setData(res.data.data);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error(err);
      }
    };
    const handler = setTimeout(fetchRecommendations, 400);
    return () => clearTimeout(handler);
  }, [historyMonths, targetDays, search]);

  const columns = [
    { header: 'Item Code', key: 'ItemCode' },
    { header: 'Item Name', key: 'ItemName', render: r => <span title={r.ItemName}>{(r.ItemName || '').substring(0, 20)}</span> },
    { header: 'Available', key: 'NetAvailable', render: r => <span className="tabular-nums">{fmt(r.NetAvailable)}</span> },
    { header: 'Open SO', key: 'OpenSO', render: r => <span className="tabular-nums">{fmt(r.OpenSO)}</span> },
    { header: 'Open Prod', key: 'OpenProduction', render: r => <span className="tabular-nums">{fmt(r.OpenProduction)}</span> },
    { header: `${historyMonths}M Avg`, key: 'MonthlyAvgDemand', render: r => <span className="tabular-nums">{fmt(r.MonthlyAvgDemand)}</span> },
    { header: 'Days of Stock', key: 'DaysOfStock', render: r => <span className="tabular-nums">{r.DaysOfStock > 900 ? '999+' : r.DaysOfStock}</span> },
    {
      header: 'Suggested Qty', key: 'SuggestedQty', render: r =>
        <span className={`status-badge ${r.SuggestedQty > 0 ? 'critical' : 'normal'} tabular-nums`}>
          {fmt(r.SuggestedQty)}
        </span>
    },
    {
      header: 'Priority', key: 'Priority', render: r => {
        let cls = 'normal';
        if (r.Priority.includes('1')) cls = 'critical';
        if (r.Priority.includes('2')) cls = 'warning';
        if (r.Priority.includes('Hold')) cls = 'expired';
        return <span className={`status-badge ${cls}`}>{r.Priority}</span>;
      }
    },
    { header: 'Reason', key: 'Reason', render: r => <ExpandableText text={r.Reason} /> }
  ];

  const totalEntries = data.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="planning-section fade-in-up delay-100">
      <div className="planning-filters" style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <strong>What-If Planner:</strong>

          <label style={{ fontSize: '0.9rem' }}>Historical Basis:</label>
          <select value={historyMonths} onChange={e => setHistoryMonths(Number(e.target.value))}>
            <option value={1}>Last 1 Month</option>
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={8}>Last 8 Months</option>
          </select>

          <label style={{ fontSize: '0.9rem' }}>Target Coverage:</label>
          <select value={targetDays} onChange={e => setTargetDays(Number(e.target.value))}>
            <option value={7}>7 Days</option>
            <option value={15}>15 Days</option>
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
          </select>

          <input
            className="search-input"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table
        data={paginatedData}
        columns={columns}
        showPagination={true}
        currentPage={currentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setPageSize}
        showActions={false}
      />
    </div>
  );
};

export default ProductionRecommendation;
