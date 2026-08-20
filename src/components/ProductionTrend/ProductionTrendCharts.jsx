import React from 'react';
import GlobalPieChart from '../../global-components/Charts/PieChart';
import GlobalBarChart from '../../global-components/Charts/BarChart';
import Skeleton from '../../global-components/Skeleton/Skeleton';
import EmptyState from '../../global-components/EmptyState/EmptyState';
import { IconChartPie, IconChartBar, IconInfoCircle } from '@tabler/icons-react';
import './ProductionTrend.css';

const ProductionTrendCharts = ({ productShare, monthlyData, comparisonData, loading }) => {
  // Sort productShare for chart display
  const topProducts = (productShare || []).slice(0, 8);

  return (
    <div className="pt-charts-grid">
      
      {/* 1. Product Share Donut Chart */}
      <div className="pt-chart-card col-6">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Product Production Share</h3>
        </div>
        <div className="pt-chart-container flex-center">
          {loading ? (
            <Skeleton type="chart" height="100%" />
          ) : topProducts.length === 0 ? (
            <EmptyState message="No product share data available" icon={IconChartPie} />
          ) : (
            <div className="full-wh">
              <GlobalPieChart 
                data={topProducts.map(p => ({ name: p.productName, value: p.totalQty }))} 
                innerRadius={65} 
                outerRadius={95} 
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Monthly Production Bar Chart */}
      <div className="pt-chart-card col-6">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Monthly Production Totals</h3>
        </div>
        <div className="pt-chart-container">
          {loading ? (
            <Skeleton type="chart" height="100%" />
          ) : (!monthlyData || monthlyData.length === 0) ? (
             <EmptyState message="No monthly production data available" icon={IconChartBar} />
          ) : (
            <GlobalBarChart 
              data={monthlyData} 
              xAxisKey="month" 
              dataKey="totalQty" 
            />
          )}
        </div>
      </div>

      {/* 3. Year-over-Year Month Comparison */}
      <div className="pt-chart-card col-12">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Current Year vs Previous Year Comparison</h3>
        </div>
        <div className="pt-chart-container">
          {loading ? (
            <Skeleton type="chart" height="100%" />
          ) : (!comparisonData || comparisonData.length === 0) ? (
             <EmptyState message="No year comparison data available" icon={IconChartBar} />
          ) : (
            <GlobalBarChart 
              data={comparisonData} 
              xAxisKey="month" 
              showLegend={true}
              series={[
                { key: 'previousYearQty', name: `Year ${comparisonData?.[0]?.previousYearLabel || 'Prev'}`, color: '#94B5E3' },
                { key: 'currentYearQty', name: `Year ${comparisonData?.[0]?.currentYearLabel || 'Curr'}`, color: '#1B47DB' }
              ]}
            />
          )}
        </div>
      </div>

      {/* 4. Top Produced Products Horizontal Bar Chart */}
      <div className="pt-chart-card col-12">
        <div className="pt-chart-header">
          <h3 className="pt-chart-title">Top Produced Products</h3>
        </div>
        <div className="pt-chart-container chart-h350">
          {loading ? (
            <Skeleton type="chart" height="100%" />
          ) : topProducts.length === 0 ? (
            <EmptyState message="No product data available" icon={IconChartBar} />
          ) : (
            <GlobalBarChart 
              data={topProducts} 
              xAxisKey="productName" 
              dataKey="totalQty" 
              layout="vertical"
              yAxisWidth={200}
            />
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductionTrendCharts;
