import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Products from './pages/Products';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-root-container">
          {/* Top Header Banner matching the Tuttis design */}
          <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          {/* Body Layout: Left Sidebar + Main Content View */}
          <div className="app-main-layout">
            <Sidebar 
              isMobileOpen={isMobileMenuOpen} 
              onCloseMobile={setIsMobileMenuOpen} 
            />
            <main className="app-view-container">
              <Routes>
                <Route path="/" element={<Navigate to="/inventory" replace />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/products" element={<Products />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
