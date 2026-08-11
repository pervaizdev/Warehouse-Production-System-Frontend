import React, { useEffect, useState } from 'react';
import './MachineEfficiency.css';

const DashboardFilters = ({ options, filters, onFilterChange }) => {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => setDraftFilters(filters), [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraftFilters({ ...draftFilters, [name]: value });
  };

  const clearFilters = () => { const cleared = {}; setDraftFilters(cleared); onFilterChange(cleared); };

  return (
    <div className="dashboard-filters">
      <div className="filters-heading"><div><span className="filters-eyebrow">Production view</span><strong>Filter efficiency data</strong></div><span className="filter-count">{Object.values(draftFilters).filter(Boolean).length} active</span></div>
      <div className="filter-fields">
      <div className="filter-group">
        <label>Date From</label>
        <input 
          type="date" 
          name="dateFrom" 
          value={draftFilters.dateFrom || ''}
          onChange={handleChange} 
        />
      </div>
      
      <div className="filter-group">
        <label>Date To</label>
        <input 
          type="date" 
          name="dateTo" 
          value={draftFilters.dateTo || ''}
          onChange={handleChange} 
        />
      </div>

      <div className="filter-group">
        <label>Machine</label>
        <select name="machine" value={draftFilters.machine || ''} onChange={handleChange}>
          <option value="">All Machines</option>
          {options.machines?.map(m => (
            <option key={m.value} value={m.value}>{m.label || m.value}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Product</label>
        <select name="product" value={draftFilters.product || ''} onChange={handleChange}>
          <option value="">All Products</option>
          {options.products?.map(p => (
            <option key={p.value} value={p.value}>{p.label || p.value}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select name="status" value={draftFilters.status || ''} onChange={handleChange}>
          <option value="">All Statuses</option>
          {options.statuses?.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Warehouse</label>
        <select name="warehouse" value={draftFilters.warehouse || ''} onChange={handleChange}>
          <option value="">All Warehouses</option>
          {options.warehouses?.map(w => (
            <option key={w.value} value={w.value}>{w.label || w.value}</option>
          ))}
        </select>
      </div>
      </div>
      <div className="filter-actions"><button type="button" className="filter-clear-button" onClick={clearFilters}>Clear all</button><button type="button" className="filter-apply-button" onClick={() => onFilterChange(draftFilters)}>Apply filters</button></div>
    </div>
  );
};

export default DashboardFilters;
