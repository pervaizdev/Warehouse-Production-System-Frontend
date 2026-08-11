import React, { useState, useEffect, useCallback } from 'react';
import { machineEfficiencyApi } from '../../apis/auth/machine-efficiency';
import DashboardFilters from './DashboardFilters';
import DashboardCharts from './DashboardCharts';
import DrilldownModal from './DrilldownModal';
import Pagination from '../../components/Pagination/Pagination';
import DashboardStatCard from '../../global-components/DashboardStatCard/DashboardStatCard';
import Loading from '../../global-components/Loading/Loading';
import {
  IconChartBar,
  IconClipboardList,
  IconClock,
  IconGauge,
  IconTarget,
} from '@tabler/icons-react';
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
  const handleFiltersChange = (nextFilters) => { setPage(1); setFilters(nextFilters); };

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

  const fetchEfficiencyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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
  }, [filters, page, limit]);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchEfficiencyData();
  }, [fetchEfficiencyData]);

  // Use global KPIs from backend summary
  const totalAvailable = summary.totalAvailable || 0;
  const totalConsumed = summary.totalConsumed || 0;
  const globalUtilization = summary.globalUtilization || 0;
  const totalPlannedOutput = summary.totalPlannedOutput || 0;
  const totalOutput = summary.totalOutput || 0;
  const globalEfficiency = summary.globalEfficiency || 0;
  const globalQtyPerHour = summary.globalQtyPerHour || 0;

  if (error) return <div className="machine-efficiency-error"><strong>Could not load efficiency data</strong><span>{error}</span><button type="button" onClick={fetchEfficiencyData}>Try again</button></div>;

  return (
    <div className="machine-efficiency-container">

      <DashboardFilters
        options={filterOptions}
        filters={filters}
        onFilterChange={handleFiltersChange}
      />

      {loading && data.length === 0 ? (
        <Loading overlay={true} />
      ) : (
        <>
          {loading && <div className="data-refresh-banner">Refreshing data with your latest filters…</div>}
          <div className="kpi-summary-cards">
            <DashboardStatCard
              label="Actual Consumed / Available"
              icon={<IconClock size={20} />}
              value={<>{totalConsumed.toFixed(0)} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ {totalAvailable.toFixed(0)} Hrs</span></>}
              sub={<>Utilization: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{globalUtilization.toFixed(2)}%</span></>}
            />

            <DashboardStatCard
              label="Production Efficiency"
              icon={<IconGauge size={20} />}
              value={`${globalEfficiency.toFixed(2)}%`}
            >
              <div className="stat-sub">Actual Qty: {totalOutput.toFixed(0)}</div>
              <div className="stat-sub">Planned Qty: {totalPlannedOutput.toFixed(0)}</div>
            </DashboardStatCard>

            <DashboardStatCard
              label="Production Output"
              icon={<IconChartBar size={20} />}
              value={totalOutput.toFixed(0)}
            >
              <div className="stat-sub">Planned: {totalPlannedOutput.toFixed(0)}</div>
              <div className="stat-sub variance">Variance: {(totalOutput - totalPlannedOutput).toFixed(0)}</div>
            </DashboardStatCard>

            <DashboardStatCard
              label="Production / Machine Hr"
              icon={<IconTarget size={20} />}
              value={globalQtyPerHour.toFixed(2)}
            />

            <DashboardStatCard
              label="Active Production Orders"
              icon={<IconClipboardList size={20} />}
              value={summary.totalOrders}
            >
              <div className="stat-sub">Active: {summary.activeOrders}</div>
              <div className="stat-sub">Completed: {summary.closedOrders}</div>
            </DashboardStatCard>
          </div>

          <DashboardCharts data={chartData} />

          <div className="efficiency-table-wrapper">
            <div className="table-section-header"><div><span className="filters-eyebrow">Machine register</span><h3>Efficiency by machine</h3></div><span className="table-hint">Select a row to view production orders</span></div>
            <div className="efficiency-table-scroll">
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
            </div>
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
