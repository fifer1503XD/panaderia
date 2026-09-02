import React from 'react';
import { useLocation } from 'react-router-dom';
import { TuttisLogo } from '../assets/icons';
import './Header.css';

const Header = () => {
  const location = useLocation();

  // Mapear rutas a títulos acordes
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case '/inventory':
        return { title: 'INVENTARIO', subtitle: 'Control de productos' };
      case '/sales':
        return { title: 'VENTAS', subtitle: 'Punto de Venta (POS)' };
      case '/clients':
        return { title: 'CLIENTES', subtitle: 'Gestión y fidelización' };
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
        <div className="logo-container">
          <TuttisLogo size={62} />
        </div>
        <div className="header-titles">
          <h1 className="header-main-title">{title}</h1>
          <span className="header-sub-title">{subtitle}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="smart-bakery-badge">
          <span>SmartBakery BI</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
