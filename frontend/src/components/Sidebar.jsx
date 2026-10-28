import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  IconCroissant,
  IconVentas,
  IconEmpleados,
  IconReportes,
  IconConfiguracion,
  AdminAvatar,
  IconChevronDown
} from '../assets/icons';
import ThemeToggle from './ThemeToggle';
import smartBakeryLogo from '../assets/smart-bakery-logo.png';
import './Sidebar.css';

const Sidebar = ({ isMobileOpen = false, onCloseMobile = () => {} }) => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('smartbakery_role') || 'ADMIN';
  });
  const footerRef = useRef(null);
  const location = useLocation();

  // Cerrar el drawer en cambio de ruta
  useEffect(() => {
    onCloseMobile();
    setShowAdminMenu(false);
  }, [location.pathname]);

  // Cerrar menú al hacer clic fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (footerRef.current && !footerRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };
    if (showAdminMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdminMenu]);

  // Alternar entre perfil Administrador y Empleado
  const handleToggleRole = () => {
    const nextRole = currentRole === 'ADMIN' ? 'EMPLEADO' : 'ADMIN';
    setCurrentRole(nextRole);
    localStorage.setItem('smartbakery_role', nextRole);
    setShowAdminMenu(false);
  };

  // Cerrar sesión
  const handleLogout = () => {
    setShowAdminMenu(false);
    setCurrentRole('ADMIN');
    localStorage.removeItem('smartbakery_role');
  };

  const menuItems = [
    { path: '/inventory', label: 'INVENTARIO', icon: IconCroissant },
    { path: '/sales', label: 'VENTAS', icon: IconVentas },
    { path: '/employees', label: 'EMPLEADOS', icon: IconEmpleados },
    { path: '/reports', label: 'REPORTES', icon: IconReportes },
    { path: '/settings', label: 'CONFIGURACIÓN', icon: IconConfiguracion },
  ];

  return (
    <>
      {/* =========================================================
          1. SIDEBAR DE ESCRITORIO TRADICIONAL (Visible en > 768px)
          ========================================================= */}
      <aside className="sidebar-container">
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="sidebar-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="sidebar-icon-wrapper">
                      <Icon size={24} />
                    </span>
                    <span className="sidebar-label">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User / Admin Pill Profile at Bottom */}
        <div className="sidebar-footer" ref={footerRef}>
          <div 
            className="admin-profile-pill"
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            role="button"
            tabIndex={0}
          >
            <div className="admin-avatar-box">
              <AdminAvatar size={34} />
            </div>
            <span className="admin-text">{currentRole}</span>
            <span className="admin-chevron">
              <IconChevronDown size={14} />
            </span>
          </div>

          {showAdminMenu && (
            <div className="admin-dropdown-menu">
              <div className="dropdown-header">
                <strong>{currentRole === 'ADMIN' ? 'Administrador' : 'Empleado'}</strong>
                <small>{currentRole === 'ADMIN' ? 'admin@smartbakery.com' : 'empleado@smartbakery.com'}</small>
              </div>
              <hr />
              <div className="dropdown-theme-row">
                <span className="dropdown-theme-title">Aspecto</span>
                <ThemeToggle compact showLabel={false} />
              </div>
              <hr />
              <button 
                type="button" 
                className="dropdown-item" 
                onClick={handleToggleRole}
              >
                {currentRole === 'ADMIN' ? '🔄 Cambiar al perfil empleado' : '🔄 Cambiar al perfil administrador'}
              </button>
              <button 
                type="button" 
                className="dropdown-item danger" 
                onClick={handleLogout}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================
          2. NAVEGACIÓN INFERIOR PARA CELULARES (Bottom Nav Bar)
          Diseñada para uso con 1 solo pulgar en smartphones
          ========================================================= */}
      <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
        <NavLink 
          to="/inventory" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="mobile-nav-icon"><IconCroissant size={22} /></span>
          <span className="mobile-nav-label">Inventario</span>
        </NavLink>

        <NavLink 
          to="/sales" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="mobile-nav-icon"><IconVentas size={22} /></span>
          <span className="mobile-nav-label">Ventas</span>
        </NavLink>

        <NavLink 
          to="/employees" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="mobile-nav-icon"><IconEmpleados size={22} /></span>
          <span className="mobile-nav-label">Empleados</span>
        </NavLink>

        <NavLink 
          to="/reports" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="mobile-nav-icon"><IconReportes size={22} /></span>
          <span className="mobile-nav-label">Reportes</span>
        </NavLink>

        <button 
          type="button" 
          className={`mobile-nav-item ${isMobileOpen ? 'active' : ''}`}
          onClick={() => onCloseMobile(!isMobileOpen)}
          aria-label="Abrir opciones adicionales"
        >
          <span className="mobile-nav-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span className="mobile-nav-label">Más</span>
        </button>
      </nav>

      {/* =========================================================
          3. DRAWER / MENÚ DESLIZABLE LATERAL PARA CELULARES
          ========================================================= */}
      {isMobileOpen && (
        <div className="mobile-drawer-overlay" onClick={() => onCloseMobile(false)}>
          <div 
            className="mobile-drawer-sheet" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-user">
                <AdminAvatar size={40} />
                <div className="mobile-drawer-user-info">
                  <strong>{currentRole === 'ADMIN' ? 'Administrador' : 'Empleado'}</strong>
                  <span>{currentRole === 'ADMIN' ? 'admin@smartbakery.com' : 'empleado@smartbakery.com'}</span>
                </div>
              </div>
              <button 
                type="button" 
                className="mobile-drawer-close"
                onClick={() => onCloseMobile(false)}
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>

            <div className="mobile-drawer-theme-box">
              <span className="drawer-theme-label">🌙 Modo Descanso Visual</span>
              <ThemeToggle />
            </div>

            <div className="mobile-drawer-content">
              <div className="drawer-section-title">MÓDULOS DEL SISTEMA</div>
              <ul className="drawer-links-list">
                <li>
                  <NavLink to="/inventory" className="drawer-link" onClick={() => onCloseMobile(false)}>
                    <IconCroissant size={22} />
                    <span>Control de Inventario</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/sales" className="drawer-link" onClick={() => onCloseMobile(false)}>
                    <IconVentas size={22} />
                    <span>Punto de Venta (POS)</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/employees" className="drawer-link" onClick={() => onCloseMobile(false)}>
                    <IconEmpleados size={22} />
                    <span>Gestión de Empleados</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/reports" className="drawer-link" onClick={() => onCloseMobile(false)}>
                    <IconReportes size={22} />
                    <span>Reportes y Métricas</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/settings" className="drawer-link" onClick={() => onCloseMobile(false)}>
                    <IconConfiguracion size={22} />
                    <span>Configuración General</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="mobile-drawer-footer">
              <button 
                type="button" 
                className="drawer-role-btn"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-divider)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-dark)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => {
                  handleToggleRole();
                  onCloseMobile(false);
                }}
              >
                {currentRole === 'ADMIN' ? '🔄 Cambiar al perfil empleado' : '🔄 Cambiar al perfil administrador'}
              </button>
              <button 
                type="button" 
                className="drawer-logout-btn"
                onClick={() => {
                  handleLogout();
                  onCloseMobile(false);
                }}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
