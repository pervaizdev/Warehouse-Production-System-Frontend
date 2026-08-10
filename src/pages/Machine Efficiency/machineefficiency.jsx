import { useState, useEffect } from 'react';
import { machineEfficiencyApi } from '../../apis/auth/machine-efficiency';
import './MachineEfficiency.css';

const MachineEfficiency = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEfficiencyData();
  }, []);

  const fetchEfficiencyData = async () => {
    try {
      setLoading(true);
      const response = await machineEfficiencyApi.getMachineEfficiencyData();
      if (response.data.success) {
        setData(response.data.data);
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

  // Calculate global KPIs
  const totalAvailable = data.reduce((sum, row) => sum + parseFloat(row.availableHrs), 0);
  const totalConsumed = data.reduce((sum, row) => sum + parseFloat(row.consumedHrs), 0);
  const globalUtilization = totalAvailable > 0 ? (totalConsumed / totalAvailable) * 100 : 0;
  
  const totalPlannedOutput = data.reduce((sum, row) => sum + parseFloat(row.outputQty / (row.efficiency / 100 || 1)), 0);
  const totalOutput = data.reduce((sum, row) => sum + parseFloat(row.outputQty), 0);
  const globalEfficiency = totalPlannedOutput > 0 ? (totalOutput / totalPlannedOutput) * 100 : 0;

  if (loading) return <div className="machine-efficiency-loading">Loading SAP B1 Live Data...</div>;
  if (error) return <div className="machine-efficiency-error">{error}</div>;

  return (
    <div className="machine-efficiency-container">
      <div className="kpi-summary-cards">
        <div className="kpi-card">
          <div className="kpi-title">Global Utilization</div>
          <div className="kpi-value">{globalUtilization.toFixed(1)}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Total Consumed Hrs</div>
          <div className="kpi-value">{totalConsumed.toFixed(0)} Hrs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Global Efficiency</div>
          <div className="kpi-value">{globalEfficiency.toFixed(1)}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Total Output Qty</div>
          <div className="kpi-value">{totalOutput.toFixed(0)}</div>
        </div>
      </div>

      <div className="efficiency-table-wrapper">
        <table className="efficiency-table">
          <thead>
            <tr>
              <th>Machine</th>
              <th className="text-right">Available Hrs</th>
              <th className="text-right">Consumed Hrs</th>
              <th className="text-right">Remaining Hrs</th>
              <th className="text-right">Utilization</th>
              <th className="text-right">Output Qty</th>
              <th className="text-right">Qty/Hr</th>
              <th className="text-right">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No machine efficiency data available.</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td className="machine-name-cell">
                    <span className="machine-name" title={row.machineCode}>{row.machine}</span>
                  </td>
                  <td className="text-right">{row.availableHrs}</td>
                  <td className="text-right">{row.consumedHrs}</td>
                  <td className="text-right">{row.remainingHrs}</td>
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
    </div>
  );
};

export default MachineEfficiency;
