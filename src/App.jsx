import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import DashboardPlaceholder from './components/Dashboard/DashboardPlaceholder';
import './App.css'

// Simple placeholder for other routes
const SimplePlaceholder = ({ title }) => (
  <div style={{ padding: '24px', backgroundColor: 'var(--bg-card, #ffffff)', borderRadius: '12px', border: '1px solid var(--border-color, #dbdbdb)' }}>
    <h2 style={{ margin: 0, color: '#0f172a' }}>{title}</h2>
    <p style={{ marginTop: '16px', color: '#64748b' }}>This module is currently under development.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPlaceholder />} />
          <Route path="analytics" element={<SimplePlaceholder title="Analytics" />} />
          <Route path="inventory" element={<SimplePlaceholder title="Inventory" />} />
          <Route path="orders" element={<SimplePlaceholder title="Orders" />} />
          <Route path="customers" element={<SimplePlaceholder title="Customers" />} />
          <Route path="delivery" element={<SimplePlaceholder title="Delivery" />} />
          <Route path="storage" element={<SimplePlaceholder title="Storage" />} />
          <Route path="settings" element={<SimplePlaceholder title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
