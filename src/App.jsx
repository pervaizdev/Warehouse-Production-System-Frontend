import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import DashboardPlaceholder from './components/Dashboard/DashboardPlaceholder';
import './App.css'

// Simple placeholder for other routes
const SimplePlaceholder = () => (
  <></>
);

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
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
