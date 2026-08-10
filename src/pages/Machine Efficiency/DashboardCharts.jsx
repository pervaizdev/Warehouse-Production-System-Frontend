import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, LineChart, Line
} from 'recharts';
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="machineCode" tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }} interval={0} />
              <YAxis type="number" domain={[0, 100]} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="utilization" name="Utilization %" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Production Efficiency */}
      <div className="chart-card">
        <h3 className="chart-title">Top 10 Production Efficiency %</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={effData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="machineCode" tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }} interval={0} />
              <YAxis type="number" domain={[0, 120]} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="efficiency" name="Efficiency %" fill="var(--color-success)" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Available vs Consumed */}
      <div className="chart-card">
        <h3 className="chart-title">Top 15 Machines by Hours</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topOutputData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="machineCode" tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }} interval={0} />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="availableHrs" name="Available" fill="var(--text-muted)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consumedHrs" name="Consumed" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Planned vs Actual Production (Simple Line comparison) */}
      <div className="chart-card">
        <h3 className="chart-title">Top 15 Machines Production Output</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={topOutputData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="machineCode" tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }} interval={0} />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="plannedOutputQty" name="Planned" stroke="var(--text-muted)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="outputQty" name="Actual" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
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
