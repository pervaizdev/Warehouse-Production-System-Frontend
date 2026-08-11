import React from 'react';
import Table from '../../global-components/Table/Table';
import './ProductionTrend.css';

const ProductionTrendTable = ({
  data,
  loading,
  pagination,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0.00';
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const columns = [
    { key: 'receiptDate', header: 'Receipt Date', render: (row) => formatDate(row.receiptDate) },
    { key: 'orderNum', header: 'Order No', render: (row) => <strong>#{row.orderNum}</strong> },
    { 
      key: 'orderStatus', 
      header: 'Status', 
      render: (row) => (
        <span className={`pt-status-badge ${row.orderStatus?.toLowerCase()}`}>
          {row.orderStatus}
        </span>
      )
    },
    { key: 'productCode', header: 'Product Code', render: (row) => <code>{row.productCode}</code> },
    { key: 'productDescription', header: 'Product Description' },
    { key: 'productGroup', header: 'Product Group' },
    { key: 'warehouse', header: 'Warehouse' },
    { 
      key: 'productionQty', 
      header: 'Production Qty', 
      render: (row) => <strong>{formatNumber(row.productionQty)}</strong> 
    },
    { 
      key: 'rejectedQty', 
      header: 'Rejected Qty', 
      render: (row) => (
        <span style={{ color: parseFloat(row.rejectedQty) > 0 ? '#f43f5e' : 'inherit' }}>
          {formatNumber(row.rejectedQty)}
        </span>
      )
    },
  ];

  return (
    <div className="pt-table-card">
      <div className="pt-table-toolbar">
        <h3 className="pt-chart-title">Detailed Production Receipts</h3>
        <input
          type="text"
          className="pt-search-input"
          placeholder="Search product, order, group..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div style={{ padding: '0 24px 24px 24px' }}>
        {loading ? (
           <div className="pt-empty-state">Loading table data...</div>
        ) : (
          <Table 
            data={data}
            columns={columns}
            totalEntries={pagination.totalItems}
            showActions={false}
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={onPageChange}
            onItemsPerPageChange={onPageSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductionTrendTable;
