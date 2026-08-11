import React from 'react';
import './ProductionTrend.css';

const ProductionTrendFilters = ({ options, filters, onFilterChange, onReset }) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="pt-filters-card">
      <div className="pt-filters-grid">
        
        {/* Date From */}
        <div className="pt-filter-group">
          <label>Date From</label>
          <input 
            type="date" 
            value={filters.dateFrom || ''} 
            onChange={(e) => handleChange('dateFrom', e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="pt-filter-group">
          <label>Date To</label>
          <input 
            type="date" 
            value={filters.dateTo || ''} 
            onChange={(e) => handleChange('dateTo', e.target.value)}
          />
        </div>

        {/* Year */}
        <div className="pt-filter-group">
          <label>Year</label>
          <select 
            value={filters.year || ''} 
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {options.years?.map(y => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="pt-filter-group">
          <label>Month</label>
          <select 
            value={filters.month || ''} 
            onChange={(e) => handleChange('month', e.target.value)}
          >
            <option value="">All Months</option>
            {options.months?.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Product Group */}
        <div className="pt-filter-group">
          <label>Product Group</label>
          <select 
            value={filters.productGroup || ''} 
            onChange={(e) => handleChange('productGroup', e.target.value)}
          >
            <option value="">All Product Groups</option>
            {options.productGroups?.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div className="pt-filter-group">
          <label>Product</label>
          <select 
            value={filters.product || ''} 
            onChange={(e) => handleChange('product', e.target.value)}
          >
            <option value="">All Products</option>
            {options.products?.map(p => (
              <option key={p.value} value={p.value}>{p.label} ({p.value})</option>
            ))}
          </select>
        </div>

        {/* Warehouse */}
        <div className="pt-filter-group">
          <label>Warehouse</label>
          <select 
            value={filters.warehouse || ''} 
            onChange={(e) => handleChange('warehouse', e.target.value)}
          >
            <option value="">All Warehouses</option>
            {options.warehouses?.map(w => (
              <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
            ))}
          </select>
        </div>

        {/* Machine */}
        <div className="pt-filter-group">
          <label>Machine</label>
          <select 
            value={filters.machine || ''} 
            onChange={(e) => handleChange('machine', e.target.value)}
          >
            <option value="">All Machines</option>
            {options.machines?.map(m => (
              <option key={m.value} value={m.value}>{m.label} ({m.value})</option>
            ))}
          </select>
        </div>

        {/* Order Status */}
        <div className="pt-filter-group">
          <label>Order Status</label>
          <select 
            value={filters.status || ''} 
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {options.statuses?.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="pt-filter-actions">
        <button className="btn-reset-filters" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductionTrendFilters;
