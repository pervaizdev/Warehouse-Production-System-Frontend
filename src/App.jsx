<<<<<<< Updated upstream
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import DashboardPlaceholder from './components/Dashboard/DashboardPlaceholder';
import NotFound from './components/NotFound/NotFound';
import './App.css'

// Simple placeholder for other routes
const SimplePlaceholder = ({ title }) => (
  <section className="module-placeholder">
    <h2>{title}</h2>
    <p>This module is ready for its connected data view.</p>
  </section>
);

function App() {
  const [user, setUser] = useState(null);
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/login/Login';
import DashboardPlaceholder from './pages/dashboard/DashboardPlaceholder';
import MachineEfficiency from './pages/Machine Efficiency/machineefficiency.jsx';
import ModulePlaceholder from './pages/ModulePlaceholder/ModulePlaceholder.jsx';
import './App.css'

import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function AppContent() {
  const { user } = useAuth();
>>>>>>> Stashed changes

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPlaceholder />} />
<<<<<<< Updated upstream
          <Route path="analytics" element={<SimplePlaceholder title="Analytics" />} />
          <Route path="inventory" element={<SimplePlaceholder title="Inventory" />} />
          <Route path="orders" element={<SimplePlaceholder title="Orders" />} />
          <Route path="customers" element={<SimplePlaceholder title="Customers" />} />
          <Route path="delivery" element={<SimplePlaceholder title="Delivery" />} />
          <Route path="storage" element={<SimplePlaceholder title="Storage" />} />
          <Route path="settings" element={<SimplePlaceholder title="Settings" />} />
          <Route path="*" element={<NotFound />} />
=======
          <Route path="analytics" element={<ModulePlaceholder title="Analytics" description="Track operational trends, production performance, and warehouse insights from one workspace." />} />
          <Route path="inventory" element={<ModulePlaceholder title="Inventory" description="Monitor stock levels, bin locations, and inventory movement across your warehouses." />} />
          <Route path="orders" element={<ModulePlaceholder title="Orders" description="Review production and fulfillment orders as they move through the warehouse." />} />
          <Route path="customers" element={<ModulePlaceholder title="Customers" description="Manage customer records and follow the status of their warehouse activity." />} />
          <Route path="delivery" element={<ModulePlaceholder title="Delivery" description="Follow delivery performance, exceptions, and completed shipments." />} />
          <Route path="storage" element={<ModulePlaceholder title="Storage" description="Understand warehouse capacity, utilization, and available storage locations." />} />
          <Route path="machine-efficiency" element={<MachineEfficiency />} />
          <Route path="settings" element={<ModulePlaceholder title="Settings" description="Configure workspace preferences, access, and operational defaults." />} />
>>>>>>> Stashed changes
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
