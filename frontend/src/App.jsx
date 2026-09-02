import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Clients from './pages/Clients';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Products from './pages/Products';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-root-container">
        {/* Top Header Banner matching the Tuttis design */}
        <Header />

        {/* Body Layout: Left Sidebar + Main Content View */}
        <div className="app-main-layout">
          <Sidebar />
          <main className="app-view-container">
            <Routes>
              <Route path="/" element={<Navigate to="/inventory" replace />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
