import { useState, useEffect } from 'react'
import { authApi } from './apis/auth/auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/login/Login';
import DashboardPlaceholder from './pages/dashboard/DashboardPlaceholder';
import MachineEfficiency from './pages/Machine Efficiency/machineefficiency.jsx';
import CostAnalysis from './pages/CostAnalysis/CostAnalysis.jsx';
import ProductionTrend from './pages/ProductionTrend/ProductionTrend.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import './App.css'

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';

// Simple placeholder for other routes
const SimplePlaceholder = () => (
  <></>
);

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPlaceholder />} />
          <Route path="analytics" element={<SimplePlaceholder title="Analytics" />} />
          <Route path="production-trend" element={<ProductionTrend />} />
          <Route path="inventory" element={<SimplePlaceholder title="Inventory" />} />
          <Route path="orders" element={<SimplePlaceholder title="Orders" />} />
          <Route path="customers" element={<SimplePlaceholder title="Customers" />} />
          <Route path="delivery" element={<SimplePlaceholder title="Delivery" />} />
          <Route path="storage" element={<SimplePlaceholder title="Storage" />} />
          <Route path="machine-efficiency" element={<MachineEfficiency />} />
          <Route path="cost-analysis" element={<CostAnalysis />} />
          <Route path="settings" element={<SimplePlaceholder title="Settings" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
