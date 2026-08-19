import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Crearemos esto a continuación para los estilos de las tarjetas

const Dashboard = () => {
  const [todayStats, setTodayStats] = useState({
    totalSalesCount: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Cargar historial de ventas
    const salesHistory = JSON.parse(localStorage.getItem('bakery_sales_history') || '[]');
    
    // Obtener la fecha de hoy en formato local para comparar (YYYY-MM-DD)
    const todayString = new Date().toLocaleDateString();

    // Filtrar solo las ventas de hoy
    const todaysSales = salesHistory.filter(sale => {
      const saleDateString = new Date(sale.date).toLocaleDateString();
      return saleDateString === todayString;
    });

    // Calcular totales
    const revenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0);

    setTodayStats({
      totalSalesCount: todaysSales.length,
      totalRevenue: revenue
    });
  }, []);

  return (
    <div className="page-container">
      <h1>Dashboard Principal</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Resumen de actividad de hoy</p>
      
      <div className="dashboard-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(52, 168, 83, 0.1)', color: 'var(--success)' }}>
            📊
          </div>
          <div className="stat-content">
            <h3>Ventas Realizadas</h3>
            <div className="stat-value">{todayStats.totalSalesCount}</div>
            <p className="stat-desc">Tickets cobrados hoy</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(230, 138, 30, 0.1)', color: 'var(--accent-color)' }}>
            💰
          </div>
          <div className="stat-content">
            <h3>Ingresos del Día</h3>
            <div className="stat-value">${todayStats.totalRevenue.toFixed(2)}</div>
            <p className="stat-desc">Total facturado hoy (inc. IVA)</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
