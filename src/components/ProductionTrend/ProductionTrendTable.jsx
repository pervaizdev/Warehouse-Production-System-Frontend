import React from 'react';
import Pagination from '../Pagination/Pagination';
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

      <div className="pt-table-wrapper">
        <table className="pt-table">
          <thead>
            <tr>
              <th>Receipt Date</th>
              <th>Order No</th>
              <th>Status</th>
              <th>Product Code</th>
              <th>Product Description</th>
              <th>Product Group</th>
              <th>Warehouse</th>
              <th className="text-right">Production Qty</th>
              <th className="text-right">Rejected Qty</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="pt-empty-state">Loading production receipts...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="9" className="pt-empty-state">No production records match the selected filters.</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>{formatDate(row.receiptDate)}</td>
                  <td><strong>#{row.orderNum}</strong></td>
                  <td>
                    <span className={`pt-status-badge ${row.orderStatus?.toLowerCase()}`}>
                      {row.orderStatus}
                    </span>
                  </td>
                  <td><code>{row.productCode}</code></td>
                  <td>{row.productDescription}</td>
                  <td>{row.productGroup}</td>
                  <td>{row.warehouse}</td>
                  <td className="text-right"><strong>{formatNumber(row.productionQty)}</strong></td>
                  <td className="text-right" style={{ color: parseFloat(row.rejectedQty) > 0 ? '#f43f5e' : 'inherit' }}>
                    {formatNumber(row.rejectedQty)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        limit={pagination.pageSize}
        onPageChange={onPageChange}
        onLimitChange={onPageSizeChange}
      />
    </div>
  );
};

export default ProductionTrendTable;
