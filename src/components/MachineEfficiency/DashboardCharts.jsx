import React from 'react';
import { CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell, XAxis, YAxis } from 'recharts';
import GlobalBarChart from '../../global-components/Charts/BarChart';
import GlobalLineChart from '../../global-components/Charts/LineChart';
import GlobalPieChart from '../../global-components/Charts/PieChart';
import './MachineEfficiency.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label || data.machineName}`}</p>
        <div className="tooltip-details">
          <p><strong>Actual Consumed:</strong> {data.consumedHrs} Hrs</p>
          <p><strong>Available/Planned:</strong> {data.availableHrs} Hrs</p>
          <p><strong>Utilization:</strong> {data.utilization}%</p>
          <p><strong>Actual Output:</strong> {data.outputQty}</p>
          <p><strong>Planned Output:</strong> {data.plannedOutputQty}</p>
          <p><strong>Efficiency:</strong> {data.efficiency}%</p>
        </div>
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Formatting data for Recharts
  const chartData = data.map(d => ({
    ...d,
    utilization: parseFloat(d.utilization),
    efficiency: parseFloat(d.efficiency),
    availableHrs: parseFloat(d.availableHrs),
    consumedHrs: parseFloat(d.consumedHrs),
    outputQty: parseFloat(d.outputQty),
    plannedOutputQty: parseFloat(d.plannedOutputQty),
  }));

  // Sort by utilization for the first chart and take Top 10
  const utilData = [...chartData].filter(d => d.utilization > 0).sort((a, b) => b.utilization - a.utilization).slice(0, 10);
  const effData = [...chartData].filter(d => d.efficiency > 0).sort((a, b) => b.efficiency - a.efficiency).slice(0, 10);
  
  // Sort by output quantity for bar/line charts to avoid clutter (Top 15 producers)
  const topOutputData = [...chartData].filter(d => d.outputQty > 0).sort((a, b) => b.outputQty - a.outputQty).slice(0, 15);

  return (
    <div className="dashboard-charts-grid">
      
      {/* Chart 1: Machine Utilization */}
      <div className="chart-card">
        <h3 className="chart-title">Top 10 Machine Utilization %</h3>
        <div className="chart-container">
          <GlobalBarChart data={utilData} dataKey="utilization" xAxisKey="machineCode" />
        </div>
      </div>

      {/* Chart 2: Production Efficiency */}
      <div className="chart-card">
        <h3 className="chart-title">Top 10 Production Efficiency %</h3>
        <div className="chart-container">
          <GlobalBarChart data={effData} dataKey="efficiency" xAxisKey="machineCode" />
        </div>
      </div>

      {/* Chart 3: Available vs Consumed */}
      <div className="chart-card">
        <h3 className="chart-title">Top 15 Machines by Hours</h3>
        <div className="chart-container">
          <GlobalBarChart
            data={topOutputData}
            xAxisKey="machineCode"
            series={[
              { dataKey: 'availableHrs', name: 'Available Hours', color: '#94a3b8' },
              { dataKey: 'consumedHrs', name: 'Consumed Hours', color: '#f97316' },
            ]}
          />
        </div>
      </div>

      {/* Chart 4: Planned vs Actual Production (Simple Line comparison) */}
      <div className="chart-card pie-card">
        <h3 className="chart-title">Top 15 Machines Production Output</h3>
        <div className="chart-container">
          <GlobalLineChart
            data={topOutputData}
            xAxisKey="machineCode"
            series={[
              { dataKey: 'plannedOutputQty', name: 'Planned Output', color: '#94a3b8', strokeWidth: 2 },
              { dataKey: 'outputQty', name: 'Actual Output', color: '#0f766e', strokeWidth: 3 },
            ]}
          />
        </div>
      </div>

      {/* Chart 4.5: Overall Hours Distribution (Pie) */}
      <div className="chart-card">
        <h3 className="chart-title">Overall Hours Distribution</h3>
        <div className="chart-container">
          <GlobalPieChart
            data={[
              { name: 'Consumed Hrs', value: chartData.reduce((sum, d) => sum + d.consumedHrs, 0), color: 'var(--color-warning)' },
              { name: 'Remaining Hrs', value: chartData.reduce((sum, d) => sum + (d.availableHrs - d.consumedHrs), 0), color: 'var(--primary)' }
            ]}
            outerRadius={120}
          />
        </div>
      </div>

      {/* Chart 5: Performance Matrix (Scatter) */}
      <div className="chart-card scatter-card">
        <h3 className="chart-title">Machine Performance Matrix</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="utilization" name="Utilization" unit="%" domain={[0, 100]} />
              <YAxis type="number" dataKey="efficiency" name="Efficiency" unit="%" domain={[0, 120]} />
              <ZAxis type="number" dataKey="outputQty" range={[60, 400]} name="Output Qty" />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter name="Machines" data={chartData}>
                {chartData.map((entry, index) => {
                  let fill = 'var(--primary)';
                  if (entry.utilization < 70 && entry.efficiency < 80) fill = 'var(--color-danger)'; // Low/Low
                  else if (entry.utilization >= 80 && entry.efficiency >= 90) fill = 'var(--color-success)'; // High/High
                  else if (entry.utilization >= 80 && entry.efficiency < 80) fill = 'var(--color-warning)'; // High/Low
                  return <Cell key={`cell-${index}`} fill={fill} fillOpacity={0.7} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
