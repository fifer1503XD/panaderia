import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Products from './pages/Products';
import Roles from './pages/Roles';
import './App.css';

// Redirección inicial inteligente según los permisos del usuario activo
const RootRedirect = () => {
  const { isAuthenticated, getDefaultRoute } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDefaultRoute()} replace />;
};

// Layout principal que contiene Header, Sidebar y contenedor de vistas
const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-root-container">
      {/* Header superior con información del rol activo */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Cuerpo principal: Sidebar + Vista activa */}
      <div className="app-main-layout">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          onCloseMobile={setIsMobileMenuOpen} 
        />
        <main className="app-view-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* 1. RUTA PÚBLICA: Login con selector de roles de prueba */}
            <Route path="/login" element={<Login />} />

            {/* 2. RUTAS PROTEGIDAS DENTRO DEL LAYOUT DE LA APLICACIÓN */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<RootRedirect />} />

              {/* Inventario: Super Admin y Administrador de Tienda */}
              <Route 
                path="/inventory" 
                element={
                  <ProtectedRoute requiredPermission="inventory">
                    <Inventory />
                  </ProtectedRoute>
                } 
              />

              {/* Ventas (POS): Super Admin, Administrador y Empleado */}
              <Route 
                path="/sales" 
                element={
                  <ProtectedRoute requiredPermission="sales">
                    <Sales />
                  </ProtectedRoute>
                } 
              />

              {/* Empleados: Super Admin y Administrador de Tienda */}
              <Route 
                path="/employees" 
                element={
                  <ProtectedRoute requiredPermission="employees">
                    <Employees />
                  </ProtectedRoute>
                } 
              />

              {/* Reportes: Super Admin, Administrador y Empleado */}
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute requiredPermission="reports">
                    <Reports />
                  </ProtectedRoute>
                } 
              />

              {/* Configuración: Super Admin y Administrador de Tienda */}
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredPermission="settings">
                    <Settings />
                  </ProtectedRoute>
                } 
              />

              {/* Productos: Super Admin y Administrador de Tienda */}
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute requiredPermission="inventory">
                    <Products />
                  </ProtectedRoute>
                } 
              />

              {/* NUEVO MENÚ EXCLUSIVO: Gestión de Roles y Permisos (Solo Super Admin) */}
              <Route 
                path="/roles" 
                element={
                  <ProtectedRoute requiredPermission="roles">
                    <Roles />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Redirección ante cualquier ruta no coincidente */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
