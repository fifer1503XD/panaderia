import React from 'react';
import { useLocation } from 'react-router-dom';
import { TuttisLogo } from '../assets/icons';
import smartBakeryLogo from '../assets/smart-bakery-logo.png';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = ({ onOpenMobileMenu }) => {
  const location = useLocation();

  // Mapear rutas a títulos acordes
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case '/inventory':
        return { title: 'INVENTARIO', subtitle: 'Control de productos' };
      case '/sales':
        return { title: 'VENTAS', subtitle: 'Punto de Venta (POS)' };
      case '/employees':
        return { title: 'EMPLEADOS', subtitle: 'Control de personal' };
      case '/reports':
        return { title: 'REPORTES', subtitle: 'Métricas y estadísticas' };
      case '/settings':
        return { title: 'CONFIGURACIÓN', subtitle: 'Ajustes del sistema' };
      case '/products':
        return { title: 'PRODUCTOS', subtitle: 'Catálogo de panadería' };
      default:
        return { title: 'INVENTARIO', subtitle: 'Control de productos' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="tuttis-header">
      <div className="header-left">
        {/* Botón hamburguesa visible solo en dispositivos móviles */}
        <button 
          className="mobile-menu-trigger" 
          onClick={onOpenMobileMenu}
          aria-label="Abrir menú de navegación lateral"
          type="button"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3.5" y1="6" x2="20.5" y2="6"/>
            <line x1="3.5" y1="12" x2="20.5" y2="12"/>
            <line x1="3.5" y1="18" x2="20.5" y2="18"/>
          </svg>
        </button>

        <div className="logo-container">
          <TuttisLogo size={58} />
        </div>
        <div className="header-titles">
          <h1 className="header-main-title">{title}</h1>
          <span className="header-sub-title">{subtitle}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Toggle de Modo Oscuro con tonos opacos para descanso visual */}
        <div className="header-theme-wrapper">
          <ThemeToggle />
        </div>

        {/* Logo oficial del sistema POS SmartBakery BI */}
        <div className="smart-bakery-logo-badge" title="SmartBakery BI - Sistema POS">
          <img 
            src={smartBakeryLogo} 
            alt="SmartBakery BI" 
            className="smart-bakery-brand-logo"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
