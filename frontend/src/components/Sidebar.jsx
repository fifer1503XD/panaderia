import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconCroissant,
  IconVentas,
  IconClientes,
  IconEmpleados,
  IconReportes,
  IconConfiguracion,
  AdminAvatar,
  IconChevronDown
} from '../assets/icons';
import './Sidebar.css';

const Sidebar = () => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const menuItems = [
    { path: '/inventory', label: 'INVENTARIO', icon: IconCroissant },
    { path: '/sales', label: 'VENTAS', icon: IconVentas },
    { path: '/clients', label: 'CLIENTES', icon: IconClientes },
    { path: '/employees', label: 'EMPLEADOS', icon: IconEmpleados },
    { path: '/reports', label: 'REPORTES', icon: IconReportes },
    { path: '/settings', label: 'CONFIGURACIÓN', icon: IconConfiguracion },
  ];

  return (
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
                    <Icon size={25} />
                  </span>
                  <span className="sidebar-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User / Admin Pill Profile at Bottom */}
      <div className="sidebar-footer">
        <div 
          className="admin-profile-pill"
          onClick={() => setShowAdminMenu(!showAdminMenu)}
          role="button"
          tabIndex={0}
        >
          <div className="admin-avatar-box">
            <AdminAvatar size={34} />
          </div>
          <span className="admin-text">ADMIN</span>
          <span className="admin-chevron">
            <IconChevronDown size={14} />
          </span>
        </div>

        {showAdminMenu && (
          <div className="admin-dropdown-menu">
            <div className="dropdown-header">
              <strong>Administrador</strong>
              <small>admin@smartbakery.com</small>
            </div>
            <hr />
            <button className="dropdown-item" onClick={() => alert('Sesión activa: Administrador Principal')}>
              👤 Perfil
            </button>
            <button className="dropdown-item" onClick={() => alert('Modo Sucursal: Principal - Horno Central')}>
              🏬 Sucursal
            </button>
            <hr />
            <button className="dropdown-item danger" onClick={() => setShowAdminMenu(false)}>
              🚪 Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
