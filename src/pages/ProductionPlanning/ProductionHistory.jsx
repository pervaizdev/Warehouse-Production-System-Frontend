import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../apis/axiosinstance';
import { API_ENDPOINTS } from '../../apis/endpoints';
import Table from '../../global-components/Table/Table';

const fmt = (n) => (n == null || isNaN(n)) ? '0' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

const ProductionHistory = () => {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState(3);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTION_PLANNING.HISTORY, { params: { months, search } });
        if (res.data?.success) {
          setData(res.data.data);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error(err);
      }
    };
    const handler = setTimeout(fetchHistory, 400);
    return () => clearTimeout(handler);
  }, [months, search]);

  const columns = [
    { header: 'Item Code', key: 'ItemCode' },
    { header: 'Item Name', key: 'ItemName', render: r => <span title={r.ItemName}>{(r.ItemName || '').substring(0,25)}</span> },
    { header: 'Produced', key: 'ProducedQty', render: r => <span className="tabular-nums">{fmt(r.ProducedQty)}</span> },
    { header: 'Delivered', key: 'DeliveredQty', render: r => <span className="tabular-nums">{fmt(r.DeliveredQty)}</span> },
    { header: 'Net Variance', key: 'NetProduction', render: r => {
        const diff = r.ProducedQty - r.DeliveredQty;
        const cls = diff > 0 ? 'success' : diff < 0 ? 'critical' : 'normal';
        return <span className={`status-badge ${cls} tabular-nums`}>{diff > 0 ? '+' : ''}{fmt(diff)}</span>;
    }},
    { header: 'Ratio', key: 'ProdToDelvRatio', render: r => <span className="tabular-nums">{r.ProdToDelvRatio ? Number(r.ProdToDelvRatio).toFixed(2) : '—'}</span> },
    { header: 'Available Stock', key: 'AvailableQty', render: r => <span className="tabular-nums">{fmt(r.AvailableQty)}</span> },
    { header: 'Open SO', key: 'OpenSO', render: r => <span className="tabular-nums">{fmt(r.OpenSO)}</span> },
    { header: 'Open Prod', key: 'OpenProduction', render: r => <span className="tabular-nums">{fmt(r.OpenProduction)}</span> },
  ];

  const totalEntries = data.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="planning-section fade-in-up delay-100">
      <h3>Production vs Delivery History</h3>
      <p className="section-desc">Historical analysis of production output vs customer deliveries.</p>
      
      <div className="planning-filters">
        <select value={months} onChange={e => setMonths(Number(e.target.value))}>
          <option value={1}>Last 1 Month</option>
          <option value={2}>Last 2 Months</option>
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={8}>Last 8 Months</option>
        </select>
        <input 
          className="search-input" 
          placeholder="Search items..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
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

export default ProductionHistory;
