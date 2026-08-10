import React, { useState, useEffect } from 'react';
import { machineEfficiencyApi } from '../../apis/auth/machine-efficiency';
import DashboardFilters from './DashboardFilters';
import DashboardCharts from './DashboardCharts';
import DrilldownModal from './DrilldownModal';
import Pagination from '../../components/Pagination/Pagination';
import './MachineEfficiency.css';

const MachineEfficiency = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedMachine, setSelectedMachine] = useState(null);

  useEffect(() => {
    fetchOptions();
    fetchEfficiencyData();
  }, []);

  useEffect(() => {
    fetchEfficiencyData();
  }, [filters, page, limit]);

  const fetchOptions = async () => {
    try {
      const res = await machineEfficiencyApi.getFilterOptions();
      if (res.data.success) {
        setFilterOptions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEfficiencyData = async () => {
    try {
      setLoading(true);
      const response = await machineEfficiencyApi.getMachineEfficiencyData(filters, page, limit);
      if (response.data.success) {
        setData(response.data.data);
        if (response.data.chartData) {
          setChartData(response.data.chartData);
        }
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
        }
      } else {
        setError('Failed to load machine efficiency data.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching efficiency data.');
    } finally {
      setLoading(false);
    }
  };

  // Use global KPIs from backend summary
  const totalAvailable = summary.totalAvailable || 0;
  const totalConsumed = summary.totalConsumed || 0;
  const globalUtilization = summary.globalUtilization || 0;
  const totalPlannedOutput = summary.totalPlannedOutput || 0;
  const totalOutput = summary.totalOutput || 0;
  const globalEfficiency = summary.globalEfficiency || 0;
  const globalQtyPerHour = summary.globalQtyPerHour || 0;

  if (error) return <div className="machine-efficiency-error">{error}</div>;

  return (
    <div className="machine-efficiency-container">
      
      <DashboardFilters 
        options={filterOptions} 
        filters={filters} 
        onFilterChange={setFilters} 
      />

      {loading && data.length === 0 ? (
        <div className="machine-efficiency-loading">Loading SAP B1 Live Data...</div>
      ) : (
        <>
          <div className="kpi-summary-cards">
            <div className="kpi-card highlight">
              <div className="kpi-title">Actual Consumed / Available</div>
              <div className="kpi-value">{totalConsumed.toFixed(0)} <span style={{fontSize:'18px',color:'var(--text-muted)'}}>/ {totalAvailable.toFixed(0)} Hrs</span></div>
              <div className="kpi-subtext">Utilization: <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{globalUtilization.toFixed(2)}%</span></div>
            </div>
            
            <div className="kpi-card highlight-green">
              <div className="kpi-title">Production Efficiency</div>
              <div className="kpi-value">{globalEfficiency.toFixed(2)}%</div>
              <div className="kpi-subtext">Actual Qty: {totalOutput.toFixed(0)}</div>
              <div className="kpi-subtext">Planned Qty: {totalPlannedOutput.toFixed(0)}</div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-title">Production Output</div>
              <div className="kpi-value">{totalOutput.toFixed(0)}</div>
              <div className="kpi-subtext">Planned: {totalPlannedOutput.toFixed(0)}</div>
              <div className="kpi-subtext variance">Variance: {(totalOutput - totalPlannedOutput).toFixed(0)}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Production / Machine Hr</div>
              <div className="kpi-value">{globalQtyPerHour.toFixed(2)}</div>
            </div>

            <div className="kpi-card highlight-blue">
              <div className="kpi-title">Active Production Orders</div>
              <div className="kpi-value">{summary.totalOrders}</div>
              <div className="kpi-subtext">Active: {summary.activeOrders}</div>
              <div className="kpi-subtext">Completed: {summary.closedOrders}</div>
            </div>
          </div>

          <DashboardCharts data={chartData} />

          <div className="efficiency-table-wrapper">
            <table className="efficiency-table">
              <thead>
                <tr>
                  <th>Machine</th>
                  <th className="text-right">Avail Hr</th>
                  <th className="text-right">Used Hr</th>
                  <th className="text-right">Util %</th>
                  <th className="text-right">Output</th>
                  <th className="text-right">Qty/Hr</th>
                  <th className="text-right">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">No machine efficiency data available.</td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={index} className="clickable-row" onClick={() => setSelectedMachine(row)}>
                      <td className="machine-name-cell">
                        <span className="machine-name" title={row.machineCode}>{row.machineCode}</span>
                      </td>
                      <td className="text-right">{row.availableHrs}</td>
                      <td className="text-right">{row.consumedHrs}</td>
                      <td className="text-right">
                        <span className={`status-badge ${row.utilization >= 80 ? 'good' : row.utilization >= 50 ? 'warning' : 'danger'}`}>
                          {row.utilization}%
                        </span>
                      </td>
                      <td className="text-right">{row.outputQty}</td>
                      <td className="text-right">{row.qtyPerHour}</td>
                      <td className="text-right">
                        <span className={`status-badge ${row.efficiency >= 90 ? 'good' : row.efficiency >= 70 ? 'warning' : 'danger'}`}>
                          {row.efficiency}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination 
              currentPage={page} 
              totalPages={totalPages}
              totalItems={totalItems}
              limit={limit}
              onPageChange={setPage} 
              onLimitChange={setLimit}
            />
          </div>
        </>
      )}

      {selectedMachine && (
        <DrilldownModal 
          machine={selectedMachine} 
          onClose={() => setSelectedMachine(null)} 
        />
      )}
    </div>
  );
};

export default MachineEfficiency;
