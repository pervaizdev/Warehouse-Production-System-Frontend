import React from 'react';
import BarChart from '../../global-components/Charts/BarChart';
import LineChart from '../../global-components/Charts/LineChart';
import './MachineEfficiency.css';

const toNumber = (value) => Number.parseFloat(value) || 0;
const formatMachineCode = (value) => {
  const label = String(value ?? '');
  return label.length > 11 ? `${label.slice(0, 10)}…` : label;
};

const DashboardCharts = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((machine) => ({
    ...machine,
    utilization: toNumber(machine.utilization),
    efficiency: toNumber(machine.efficiency),
    availableHrs: toNumber(machine.availableHrs),
    consumedHrs: toNumber(machine.consumedHrs),
    outputQty: toNumber(machine.outputQty),
    plannedOutputQty: toNumber(machine.plannedOutputQty),
  }));

  const utilData = [...chartData]
    .filter((machine) => machine.utilization > 0)
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 10);
  const efficiencyData = [...chartData]
    .filter((machine) => machine.efficiency > 0)
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 10);
  const topOutputData = [...chartData]
    .filter((machine) => machine.outputQty > 0)
    .sort((a, b) => b.outputQty - a.outputQty)
    .slice(0, 15);

  return (
    <div className="dashboard-charts-grid">
      <div className="chart-card">
        <h3 className="chart-title">Top 10 Machine Utilization %</h3>
        <div className="chart-container">
          <BarChart
            data={utilData}
            dataKey="utilization"
            xAxisKey="machineCode"
          />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Top 10 Production Efficiency %</h3>
        <div className="chart-container">
          <BarChart
            data={efficiencyData}
            dataKey="efficiency"
            xAxisKey="machineCode"
          />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Top 15 Machines by Hours</h3>
        <div className="chart-container">
          <BarChart
            data={topOutputData}
            xAxisKey="machineCode"
            showLegend
            series={[
              { key: 'availableHrs', name: 'Available' },
              { key: 'consumedHrs', name: 'Consumed' },
            ]}
          />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Top 15 Machines Production Output</h3>
        <div className="chart-container">
          <LineChart
            data={topOutputData}
            xAxisKey="machineCode"
            xAxisTickFormatter={formatMachineCode}
            series={[
              { key: 'plannedOutputQty', name: 'Planned', color: '#f0d64a' },
              { key: 'outputQty', name: 'Actual', color: '#9475ff' },
            ]}
          />
        </div>
      </div>

      <div className="chart-card scatter-card">
        <h3 className="chart-title">Machine Performance Matrix</h3>
        <div className="chart-container">
          <BarChart
            data={topOutputData}
            xAxisKey="machineCode"
            showLegend
            series={[
              { key: 'utilization', name: 'Utilization %', color: '#3b82f6' },
              { key: 'efficiency', name: 'Efficiency %', color: '#10b981' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
