import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../apis/axiosinstance';
import { API_ENDPOINTS } from '../../apis/endpoints';
import './SalesOrderModal.css';

const CustomerModal = ({ isOpen, onClose, onSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTION_ORDERS.CUSTOMERS);
      if (res.data?.success) {
        setCustomers(res.data.data);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(c => 
    (c.CardCode && c.CardCode.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (c.CardName && c.CardName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="so-modal-overlay">
      <div className="so-modal-content">
        <div className="so-modal-header">
          <h3>List of Customers</h3>
          <button onClick={onClose} className="so-modal-close">&times;</button>
        </div>
        
        <div className="so-modal-body">
          <input 
            type="text" 
            placeholder="Search by Code or Name..." 
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
                    <th>Customer Code</th>
                    <th>Customer Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(customer => (
                    <tr key={customer.CardCode} onClick={() => { onSelect(customer.CardCode); onClose(); }} className="so-table-row">
                      <td>{customer.CardCode}</td>
                      <td>{customer.CardName}</td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan="2" style={{textAlign: 'center'}}>No customers found.</td>
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

export default CustomerModal;
