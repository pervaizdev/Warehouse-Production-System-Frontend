import React from 'react';
import './MachineEfficiency.css';

const DashboardFilters = ({ options, filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="dashboard-filters">
      <div className="filter-group">
        <label>Date From</label>
        <input 
          type="date" 
          name="dateFrom" 
          value={filters.dateFrom || ''} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="filter-group">
        <label>Date To</label>
        <input 
          type="date" 
          name="dateTo" 
          value={filters.dateTo || ''} 
          onChange={handleChange} 
        />
      </div>

      <div className="filter-group">
        <label>Machine</label>
        <select name="machine" value={filters.machine || ''} onChange={handleChange}>
          <option value="">All Machines</option>
          {options.machines?.map(m => (
            <option key={m.value} value={m.value}>{m.label || m.value}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Product</label>
        <select name="product" value={filters.product || ''} onChange={handleChange}>
          <option value="">All Products</option>
          {options.products?.map(p => (
            <option key={p.value} value={p.value}>{p.label || p.value}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select name="status" value={filters.status || ''} onChange={handleChange}>
          <option value="">All Statuses</option>
          {options.statuses?.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Warehouse</label>
        <select name="warehouse" value={filters.warehouse || ''} onChange={handleChange}>
          <option value="">All Warehouses</option>
          {options.warehouses?.map(w => (
            <option key={w.value} value={w.value}>{w.label || w.value}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DashboardFilters;
