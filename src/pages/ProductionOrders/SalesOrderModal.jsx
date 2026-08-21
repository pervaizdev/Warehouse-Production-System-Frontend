import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../apis/axiosinstance';
import { API_ENDPOINTS } from '../../apis/endpoints';
import './SalesOrderModal.css';

const SalesOrderModal = ({ isOpen, onClose, onSelect }) => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSalesOrders();
    }
  }, [isOpen]);

  const fetchSalesOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTION_ORDERS.SALES_ORDERS);
      if (res.data?.success) {
        setSalesOrders(res.data.data);
      } else {
        setError('Failed to fetch sales orders');
      }
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredOrders = salesOrders.filter(o => 
    String(o.DocNum).includes(searchTerm) || 
    (o.CardName && o.CardName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="so-modal-overlay">
      <div className="so-modal-content">
        <div className="so-modal-header">
          <h3>List of Sales Orders</h3>
          <button onClick={onClose} className="so-modal-close">&times;</button>
        </div>
        
        <div className="so-modal-body">
          <input 
            type="text" 
            placeholder="Search by Doc. No. or Customer Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="so-search-input"
          />
          
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{color: 'red'}}>{error}</div>
          ) : (
            <div className="so-table-container">
              <table className="so-table">
                <thead>
                  <tr>
                    <th>Doc. No.</th>
                    <th>Doc. Date</th>
                    <th>Customer Name</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const d = new Date(order.DocDate);
                    const formattedDate = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
                    return (
                      <tr key={order.DocNum} onClick={() => { onSelect(order.DocNum); onClose(); }} className="so-table-row">
                        <td>{order.DocNum}</td>
                        <td>{formattedDate}</td>
                        <td>{order.CardName}</td>
                        <td>{order.Comments}</td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{textAlign: 'center'}}>No open sales orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesOrderModal;
