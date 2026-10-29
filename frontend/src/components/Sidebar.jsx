import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  IconCroissant,
  IconVentas,
  IconEmpleados,
  IconReportes,
  IconConfiguracion,
  IconRoles,
  AdminAvatar,
  IconChevronDown
} from '../assets/icons';
import ThemeToggle from './ThemeToggle';
import { useAuth, MOCK_USERS } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isMobileOpen = false, onCloseMobile = () => {} }) => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { currentUser, role, hasPermission, logout, switchRole } = useAuth();
  const footerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Cerrar drawer y menú en cambio de ruta
  useEffect(() => {
    onCloseMobile(false);
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

  // Manejar cierre de sesión
  const handleLogout = () => {
    setShowAdminMenu(false);
    logout();
    navigate('/login');
  };

  // Definición completa de módulos
  const allMenuItems = [
    { path: '/inventory', label: 'INVENTARIO', icon: IconCroissant, permission: 'inventory' },
    { path: '/sales', label: 'VENTAS', icon: IconVentas, permission: 'sales' },
    { path: '/employees', label: 'EMPLEADOS', icon: IconEmpleados, permission: 'employees' },
    { path: '/reports', label: 'REPORTES', icon: IconReportes, permission: 'reports' },
    { path: '/settings', label: 'CONFIGURACIÓN', icon: IconConfiguracion, permission: 'settings' },
    { path: '/roles', label: 'ROLES & PERMISOS', icon: IconRoles, permission: 'roles' },
  ];

  // Filtrar módulos estrictamente según los permisos del rol activo
  const visibleMenuItems = allMenuItems.filter((item) => hasPermission(item.permission));

  // Ítems para la barra inferior en móvil (máximo 4 más el botón "Más")
  const mobileNavItems = visibleMenuItems.slice(0, 4);

  return (
    <>
      {/* =========================================================
          1. SIDEBAR DE ESCRITORIO TRADICIONAL (Visible en > 768px)
          ========================================================= */}
      <aside className="sidebar-container">
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {visibleMenuItems.map((item) => {
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

        {/* User / Role Pill Profile at Bottom */}
        <div className="sidebar-footer" ref={footerRef}>
          <div 
            className="admin-profile-pill"
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            role="button"
            tabIndex={0}
          >
            <div 
              className="admin-avatar-box" 
              style={{ background: currentUser?.badgeBg || 'var(--pill-bg)' }}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>
                {currentUser?.avatar || '👤'}
              </span>
            </div>
            <span className="admin-text">
              {currentUser?.roleShort || 'USUARIO'}
            </span>
            <span className="admin-chevron">
              <IconChevronDown size={14} />
            </span>
          </div>

          {showAdminMenu && (
            <div className="admin-dropdown-menu">
              <div className="dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <strong>{currentUser?.name || 'Usuario'}</strong>
                  <span 
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: currentUser?.badgeColor || 'var(--primary-teal)',
                      background: currentUser?.badgeBg || 'var(--pill-bg)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px'
                    }}
                  >
                    {currentUser?.roleShort}
                  </span>
                </div>
                <small>{currentUser?.email || 'usuario@smartbakery.com'}</small>
              </div>
              <hr />
              <div className="dropdown-theme-row">
                <span className="dropdown-theme-title">Aspecto</span>
                <ThemeToggle compact showLabel={false} />
              </div>
              <hr />
              
              {currentUser?.role === 'superadmin' && (
                <>
                  <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Simular Perfil (Super Admin):
                  </div>

                  {Object.values(MOCK_USERS).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      className={`dropdown-item ${currentUser?.role === u.role ? 'active-role' : ''}`}
                      onClick={() => {
                        switchRole(u.role);
                        setShowAdminMenu(false);
                      }}
                      style={{
                        fontWeight: currentUser?.role === u.role ? 800 : 600,
                        color: currentUser?.role === u.role ? u.badgeColor : 'var(--text-dark)'
                      }}
                    >
                      {u.avatar} {u.roleLabel} {currentUser?.role === u.role ? '✓' : ''}
                    </button>
                  ))}
                  <hr />
                </>
              )}
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
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="mobile-nav-icon"><Icon size={22} /></span>
              <span className="mobile-nav-label">
                {item.label === 'CONFIGURACIÓN' ? 'Ajustes' :
                 item.label === 'ROLES & PERMISOS' ? 'Roles' :
                 item.label.charAt(0) + item.label.slice(1).toLowerCase()}
              </span>
            </NavLink>
          );
        })}

        {/* Botón "Más" para abrir el cajón lateral con opciones adicionales */}
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
                <div 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: currentUser?.badgeBg || 'var(--pill-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}
                >
                  {currentUser?.avatar || '👤'}
                </div>
                <div className="mobile-drawer-user-info">
                  <strong>{currentUser?.name || 'Usuario'}</strong>
                  <span style={{ color: currentUser?.badgeColor || 'var(--primary-teal)', fontWeight: 700 }}>
                    {currentUser?.roleLabel}
                  </span>
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
              <div className="drawer-section-title">MÓDULOS AUTORIZADOS</div>
              <ul className="drawer-links-list">
                {visibleMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink 
                        to={item.path} 
                        className="drawer-link" 
                        onClick={() => onCloseMobile(false)}
                      >
                        <Icon size={22} />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mobile-drawer-footer">
              {currentUser?.role === 'superadmin' && (
                <>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Simular Perfil (Super Admin):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {Object.values(MOCK_USERS).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        style={{
                          padding: '0.5rem 0.25rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-divider)',
                          background: currentUser?.role === u.role ? u.badgeBg : 'var(--bg-input)',
                          color: currentUser?.role === u.role ? u.badgeColor : 'var(--text-dark)',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          switchRole(u.role);
                          onCloseMobile(false);
                        }}
                      >
                        {u.avatar} {u.roleShort}
                      </button>
                    ))}
                  </div>
                </>
              )}

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
