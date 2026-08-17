import React, { useState, useEffect } from 'react';
import { machineEfficiencyApi } from '../../apis/auth/machine-efficiency';
import GlobalPopup from '../../global-components/GlobalPopup/GlobalPopup';
import './MachineEfficiency.css';
import { IconChevronRight } from '@tabler/icons-react';

const DrilldownModal = ({ machine, onClose }) => {
  const [level, setLevel] = useState(1); // 1 = Machine, 2 = Order
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchMachineOrders();
  }, [machine]);

  const fetchMachineOrders = async () => {
    try {
      setLoading(true);
      const res = await machineEfficiencyApi.getMachineDrilldown(machine.machineCode);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = async (orderNum) => {
    try {
      setLoading(true);
      const res = await machineEfficiencyApi.getOrderDrilldown(orderNum);
      if (res.data.success) {
        setOrderDetails(res.data.data);
        setSelectedOrder(orderNum);
        setLevel(2);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setLevel(1);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  return (
    <GlobalPopup onClose={onClose} title="Machine details">
        <div className="modal-header">
          <div className="drilldown-breadcrumb">
            <span className={`${level === 1 ? 'active' : ''} ${level === 2 ? 'clickable-breadcrumb' : ''}`} onClick={handleBack}>
              {machine.machineCode} - {machine.machine}
            </span>
            {level === 2 && (
              <>
                <IconChevronRight size={16} />
                <span className="active">Order #{selectedOrder}</span>
              </>
            )}
          </div>
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loading-spinner">Loading Details...</div>
          ) : level === 1 ? (
            <>
              <div className="kpi-summary-cards drilldown-cards">
                <div className="kpi-card">
                  <div className="kpi-title">Utilization</div>
                  <div className="kpi-value">{machine.utilization}%</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-title">Efficiency</div>
                  <div className="kpi-value">{machine.efficiency}%</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-title">Consumed / Avail</div>
                  <div className="kpi-value">{machine.consumedHrs} / {machine.availableHrs}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-title">Total Output</div>
                  <div className="kpi-value">{machine.outputQty}</div>
                </div>
              </div>

              <h4 className="section-title">Production Orders</h4>
              <div className="efficiency-table-wrapper">
                <table className="efficiency-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Status</th>
                      <th>Product</th>
                      <th className="text-right">Planned Qty</th>
                      <th className="text-right">Actual Qty</th>
                      <th className="text-right">Hrs</th>
                      <th className="text-right">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="7" className="empty-state">No orders found.</td></tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o.orderNum} onClick={() => handleOrderClick(o.orderNum)} className="clickable-row">
                          <td className="machine-name-cell">{o.orderNum}</td>
                          <td><span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                          <td>{o.productName || o.product}</td>
                          <td className="text-right">{o.plannedQty}</td>
                          <td className="text-right">{o.actualQty}</td>
                          <td className="text-right">{o.consumedHrs} / {o.plannedHrs}</td>
                          <td className="text-right">
                            <span className={`status-badge ${o.efficiency >= 90 ? 'good' : o.efficiency >= 70 ? 'warning' : 'danger'}`}>
                              {o.efficiency}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="order-details-view">
              <div className="details-grid">
                <div className="details-card">
                  <h4>Production Information</h4>
                  <div className="detail-row"><span>Order #</span> <strong>{orderDetails.orderInfo.orderNum}</strong></div>
                  <div className="detail-row"><span>Status</span> <strong>{orderDetails.orderInfo.status}</strong></div>
                  <div className="detail-row"><span>Product</span> <strong>{orderDetails.orderInfo.productName}</strong></div>
                  <div className="detail-row"><span>Planned Qty</span> <strong>{orderDetails.orderInfo.plannedQty}</strong></div>
                  <div className="detail-row"><span>Actual Qty</span> <strong>{orderDetails.orderInfo.actualQty}</strong></div>
                  <div className="detail-row"><span>Efficiency</span> <strong>{orderDetails.orderInfo.efficiency}%</strong></div>
                </div>

                <div className="details-card">
                  <h4>Cost Estimate</h4>
                  <div className="detail-row"><span>Machine Cost</span> <strong>${orderDetails.costs.machineCost}</strong></div>
                  <div className="detail-row"><span>Material Cost</span> <strong>${orderDetails.costs.materialCost}</strong></div>
                  <div className="detail-row highlight-row"><span>Total Production Cost</span> <strong>${orderDetails.costs.totalCost}</strong></div>
                  <div className="detail-row highlight-row"><span>Cost / Unit</span> <strong>${orderDetails.costs.costPerUnit}</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>
    </GlobalPopup>
  );
};

export default DrilldownModal;
