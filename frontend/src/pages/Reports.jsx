import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { REPORTS_API_URL } from '../config/api';
import './Reports.css';

// Formateador de fecha local en formato YYYY-MM-DD para evitar desfases de UTC
const getLocalDateString = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Formateador de moneda colombiana (COP)
const formatCOP = (num) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(num || 0);
};

const Reports = () => {
  // Estado de navegación entre pestañas de reportes
  const [activeTab, setActiveTab] = useState('summary');

  // Filtros (por defecto carga las ventas de 'Hoy')
  const todayInitial = getLocalDateString();
  const [datePreset, setDatePreset] = useState('today');
  const [startDate, setStartDate] = useState(todayInitial);
  const [endDate, setEndDate] = useState(todayInitial);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');

  // Estado de datos
  const [analytics, setAnalytics] = useState(null);
  const [inventoryValuation, setInventoryValuation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de interfaz auxiliar
  const [searchTerm, setSearchTerm] = useState('');
  const [productViewMode, setProductViewMode] = useState('qty'); // 'qty' | 'revenue'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Carga de datos principales desde la API de MongoDB
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (paymentMethodFilter && paymentMethodFilter !== 'ALL') queryParams.append('paymentMethod', paymentMethodFilter);
      if (channelFilter && channelFilter !== 'ALL') queryParams.append('channel', channelFilter);

      const analyticsUrl = `${REPORTS_API_URL}/analytics?${queryParams.toString()}`;
      const inventoryUrl = `${REPORTS_API_URL}/inventory-valuation`;

      const [resAnalytics, resInventory] = await Promise.all([
        fetch(analyticsUrl),
        fetch(inventoryUrl)
      ]);

      if (!resAnalytics.ok) throw new Error('Error al cargar datos analíticos de ventas');
      if (!resInventory.ok) throw new Error('Error al cargar valorización de inventario');

      const dataAnalytics = await resAnalytics.json();
      const dataInventory = await resInventory.json();

      setAnalytics(dataAnalytics);
      setInventoryValuation(dataInventory);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, paymentMethodFilter, channelFilter]);

  // Ejecutar carga inicial y ante cambios de filtros
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Manejador de botones rápidos de período
  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    const now = new Date();
    const todayStr = getLocalDateString(now);

    if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yStr = getLocalDateString(yesterday);
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === 'week') {
      const pastWeek = new Date(now);
      pastWeek.setDate(now.getDate() - 7);
      setStartDate(getLocalDateString(pastWeek));
      setEndDate(todayStr);
    } else if (preset === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(getLocalDateString(firstDay));
      setEndDate(todayStr);
    } else if (preset === 'custom') {
      // Mantiene el rango activo para edición libre
    }
  };

  // Descarga de archivo CSV para Excel
  const handleExportCSV = () => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    window.open(`${REPORTS_API_URL}/export-csv?${queryParams.toString()}`, '_blank');
  };

  // Imprimir reporte o guardar como PDF
  const handlePrint = () => {
    window.print();
  };

  // Filtrado reactivo de recibos para la pestaña de auditoría
  const filteredReceipts = useMemo(() => {
    if (!analytics || !analytics.recentReceipts) return [];
    if (!searchTerm.trim()) return analytics.recentReceipts;
    const term = searchTerm.toLowerCase();
    return analytics.recentReceipts.filter(r => 
      r.receiptNumber.toLowerCase().includes(term) ||
      r.customer.toLowerCase().includes(term) ||
      r.paymentMethod.toLowerCase().includes(term) ||
      r.channel.toLowerCase().includes(term)
    );
  }, [analytics, searchTerm]);

  // Máximo para escala de gráficos
  const maxDayTotal = useMemo(() => {
    if (!analytics?.dailyTimeline?.length) return 1;
    return Math.max(...analytics.dailyTimeline.map(d => d.total), 1);
  }, [analytics]);

  const maxHourTotal = useMemo(() => {
    if (!analytics?.hourlySales?.hours?.length) return 1;
    return Math.max(...analytics.hourlySales.hours.map(h => h.total), 1);
  }, [analytics]);

  return (
    <div className="reports-page-container">
      {/* -------------------------------------------------------------
          1. HEADER PRINCIPAL Y ACCIONES
      ------------------------------------------------------------- */}
      <div className="reports-header-section">
        <div className="reports-title-area">
          <h1>📊 Informes & Analítica de Negocio</h1>
          <p>Métricas en tiempo real, arqueo de caja, rendimiento de productos y control de existencias en MongoDB</p>
        </div>

        <div className="reports-action-bar">
          <button 
            type="button" 
            className="btn-report-action" 
            onClick={fetchReportData} 
            disabled={loading}
            title="Actualizar datos desde MongoDB"
          >
            <span style={{ display: 'inline-block', transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform 0.8s ease' }}>
              🔄
            </span>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>

          <button 
            type="button" 
            className="btn-report-action" 
            onClick={handleExportCSV}
            title="Descargar datos en formato Excel (CSV)"
          >
            📥 Exportar Excel
          </button>

          <button 
            type="button" 
            className="btn-report-action primary" 
            onClick={handlePrint}
            title="Imprimir o guardar reporte en PDF"
          >
            🖨️ Imprimir / PDF
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. PANEL DE FILTROS (PRESETS Y RANGO DINÁMICO)
      ------------------------------------------------------------- */}
      <div className="reports-filter-panel">
        <div className="filter-presets-row">
          <span className="filter-preset-label">Período:</span>
          <button 
            type="button" 
            className={`filter-preset-pill ${datePreset === 'today' ? 'active' : ''}`}
            onClick={() => handlePresetChange('today')}
          >
            ☀️ Hoy
          </button>
          <button 
            type="button" 
            className={`filter-preset-pill ${datePreset === 'yesterday' ? 'active' : ''}`}
            onClick={() => handlePresetChange('yesterday')}
          >
            ⏪ Ayer
          </button>
          <button 
            type="button" 
            className={`filter-preset-pill ${datePreset === 'week' ? 'active' : ''}`}
            onClick={() => handlePresetChange('week')}
          >
            📈 Últimos 7 Días
          </button>
          <button 
            type="button" 
            className={`filter-preset-pill ${datePreset === 'month' ? 'active' : ''}`}
            onClick={() => handlePresetChange('month')}
          >
            🗓️ Este Mes
          </button>
          <button 
            type="button" 
            className={`filter-preset-pill ${datePreset === 'custom' ? 'active' : ''}`}
            onClick={() => handlePresetChange('custom')}
          >
            ⚙️ Personalizado
          </button>
        </div>

        {/* Fila de filtros personalizados y selects */}
        <div className="filter-custom-row">
          <div className="filter-field-group">
            <span className="filter-field-label">Desde:</span>
            <input 
              type="date" 
              className="filter-date-input"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset('custom');
              }}
            />
          </div>

          <div className="filter-field-group">
            <span className="filter-field-label">Hasta:</span>
            <input 
              type="date" 
              className="filter-date-input"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset('custom');
              }}
            />
          </div>

          <div className="filter-field-group">
            <span className="filter-field-label">Método de Pago:</span>
            <select 
              className="filter-select"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="ALL">Todos los métodos</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia (Nequi / Daviplata)</option>
              <option value="Bolsillo virtual">Bolsillo virtual</option>
              <option value="Tarjeta crédito/débito">Tarjeta Débito / Crédito</option>
            </select>
          </div>

          <div className="filter-field-group">
            <span className="filter-field-label">Canal:</span>
            <select 
              className="filter-select"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="ALL">Todos los canales</option>
              <option value="mesa">Consumo en Mesa</option>
              <option value="de_paso">Para Llevar (Cliente de Paso)</option>
            </select>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. TARJETAS DE KPIS EJECUTIVOS
      ------------------------------------------------------------- */}
      {analytics && (
        <div className="reports-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Ingresos Totales</span>
              <div className="kpi-icon-badge" style={{ background: 'rgba(14, 124, 134, 0.12)', color: 'var(--primary-teal)' }}>
                💰
              </div>
            </div>
            <div className="kpi-value accent-teal">{formatCOP(analytics.summary.totalRevenue)}</div>
            <div className="kpi-subtext positive">
              <span>↑ Facturado en {analytics.summary.totalSalesCount} transacciones</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Ticket Promedio</span>
              <div className="kpi-icon-badge" style={{ background: 'rgba(217, 119, 6, 0.12)', color: 'var(--cat-pasabocas)' }}>
                🧾
              </div>
            </div>
            <div className="kpi-value">{formatCOP(analytics.summary.averageTicket)}</div>
            <div className="kpi-subtext">
              <span>{analytics.summary.totalItemsSold} unidades vendidas</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Tickets Cobrados</span>
              <div className="kpi-icon-badge" style={{ background: 'rgba(22, 143, 131, 0.12)', color: 'var(--status-activo)' }}>
                🛒
              </div>
            </div>
            <div className="kpi-value" style={{ color: 'var(--status-activo)' }}>
              {analytics.summary.totalSalesCount}
            </div>
            <div className="kpi-subtext positive">
              <span>{analytics.summary.totalItemsSold} productos despachados</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Hora Pico de Ventas</span>
              <div className="kpi-icon-badge" style={{ background: 'rgba(234, 88, 12, 0.12)', color: 'var(--cat-desayunos)' }}>
                ⏰
              </div>
            </div>
            <div className="kpi-value">
              {analytics.hourlySales.peakHour?.displayLabel || 'N/A'}
            </div>
            <div className="kpi-subtext">
              <span>{analytics.hourlySales.peakHour?.count || 0} tickets ({formatCOP(analytics.hourlySales.peakHour?.total || 0)})</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Alertas de Stock</span>
              <div className="kpi-icon-badge" style={{ background: 'rgba(211, 47, 47, 0.12)', color: 'var(--status-alerta)' }}>
                🚨
              </div>
            </div>
            <div className="kpi-value" style={{ color: inventoryValuation?.criticalStockCount > 0 ? 'var(--status-alerta)' : 'var(--text-dark)' }}>
              {inventoryValuation?.criticalStockCount || 0}
            </div>
            <div className="kpi-subtext alert">
              <span>{inventoryValuation?.criticalStockCount > 0 ? 'Requieren producción o compra' : 'Stock en niveles óptimos'}</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          4. PESTAÑAS DE NAVEGACIÓN ENTRE SUB-REPORTES
      ------------------------------------------------------------- */}
      <div className="reports-nav-tabs">
        <button 
          type="button" 
          className={`report-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <span>📊 Resumen & Ventas</span>
        </button>

        <button 
          type="button" 
          className={`report-tab-btn ${activeTab === 'cash' ? 'active' : ''}`}
          onClick={() => setActiveTab('cash')}
        >
          <span>💵 Cierre de Caja & Arqueo</span>
          {analytics?.cashClosing && (
            <span className="tab-badge">{analytics.cashClosing.byPaymentMethod.length} métodos</span>
          )}
        </button>

        <button 
          type="button" 
          className={`report-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <span>🥐 Productos & Categorías</span>
        </button>

        <button 
          type="button" 
          className={`report-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <span>📦 Inventario & Stock Crítico</span>
          {inventoryValuation && (
            <span className="tab-badge">{inventoryValuation.criticalStockCount} alertas</span>
          )}
        </button>

        <button 
          type="button" 
          className={`report-tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <span>👥 Personal & Turnos</span>
        </button>

        <button 
          type="button" 
          className={`report-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <span>🧾 Auditoría de Recibos</span>
          {analytics && (
            <span className="tab-badge">{analytics.summary.totalSalesCount}</span>
          )}
        </button>
      </div>

      {/* Mensaje de error si la conexión falló */}
      {error && (
        <div style={{ background: 'var(--status-alerta-bg)', color: 'var(--status-alerta)', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ⚠️ {error}. Asegúrate de que el backend esté ejecutándose en local o revisa la conexión con MongoDB.
        </div>
      )}

      {/* Mensaje de carga */}
      {loading && !analytics && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⏳</div>
          <h3>Consultando datos y analítica en MongoDB...</h3>
        </div>
      )}

      {/* -------------------------------------------------------------
          PESTAÑA 1: RESUMEN GENERAL & VENTAS
      ------------------------------------------------------------- */}
      {activeTab === 'summary' && analytics && (
        <div>
          {/* Línea de tiempo diaria y Horas Pico */}
          <div className="reports-grid-two-col">
            <div className="report-card-panel">
              <div className="card-panel-header">
                <div>
                  <h3 className="card-panel-title">📈 Tendencia de Ventas Diarias</h3>
                  <span className="card-panel-subtitle">Ingresos facturados por fecha en el período</span>
                </div>
              </div>

              {analytics.dailyTimeline.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No hay ventas registradas en el rango de fechas seleccionado.</p>
              ) : (
                <div className="timeline-chart-container">
                  {analytics.dailyTimeline.map((item, idx) => {
                    const heightPercent = Math.max(6, Math.round((item.total / maxDayTotal) * 100));
                    return (
                      <div key={idx} className="timeline-bar-column">
                        <span className="timeline-bar-value">{formatCOP(item.total)}</span>
                        <div className="timeline-bar-track">
                          <div className="timeline-bar-fill" style={{ height: `${heightPercent}%` }} />
                        </div>
                        <span className="timeline-bar-label">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="report-card-panel">
              <div className="card-panel-header">
                <div>
                  <h3 className="card-panel-title">⏰ Curva Horaria & Horas Pico</h3>
                  <span className="card-panel-subtitle">Horas de mayor demanda para programar horneadas</span>
                </div>
                {analytics.hourlySales.peakHour?.count > 0 && (
                  <span className="tag-badge de-paso" style={{ fontSize: '0.78rem' }}>
                    🔥 Pico: {analytics.hourlySales.peakHour.displayLabel}
                  </span>
                )}
              </div>

              <div className="hourly-bars-grid">
                {analytics.hourlySales.hours.map((h, idx) => {
                  const isPeak = analytics.hourlySales.peakHour && h.hour === analytics.hourlySales.peakHour.hour;
                  const heightPercent = h.total > 0 ? Math.max(8, Math.round((h.total / maxHourTotal) * 100)) : 0;
                  return (
                    <div 
                      key={idx} 
                      className="hourly-col"
                      title={`${h.displayLabel}: ${formatCOP(h.total)} (${h.count} ventas)`}
                    >
                      <div className="hourly-track">
                        <div 
                          className={`hourly-fill ${isPeak ? 'peak' : ''}`} 
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="hourly-label">
                        {h.hour % 3 === 0 ? h.hour : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>00:00 (Madrugada)</span>
                <span>12:00 (Mediodía)</span>
                <span>23:00 (Cierre)</span>
              </div>
            </div>
          </div>

          {/* Canales de Venta (Mesas vs Paso) y Rendimiento por Mesa */}
          <div className="reports-grid-two-col">
            <div className="report-card-panel">
              <div className="card-panel-header">
                <h3 className="card-panel-title">🍽️ Consumo en Mesa vs Para Llevar</h3>
              </div>

              <div className="channel-stat-cards-wrapper">
                <div className="channel-stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary-teal)' }}>EN MESAS</span>
                    <span style={{ fontWeight: 800 }}>{analytics.channelDistribution.mesaPercentage}%</span>
                  </div>
                  <h3 style={{ margin: '0.2rem 0', fontSize: '1.4rem', color: 'var(--text-dark)' }}>{formatCOP(analytics.channelDistribution.mesaSalesTotal)}</h3>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{analytics.channelDistribution.mesaSalesCount} tickets atendidos</small>
                </div>

                <div className="channel-stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--cat-pasabocas)' }}>PARA LLEVAR</span>
                    <span style={{ fontWeight: 800 }}>{analytics.channelDistribution.dePasoPercentage}%</span>
                  </div>
                  <h3 style={{ margin: '0.2rem 0', fontSize: '1.4rem', color: 'var(--text-dark)' }}>{formatCOP(analytics.channelDistribution.dePasoSalesTotal)}</h3>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{analytics.channelDistribution.dePasoSalesCount} clientes de paso</small>
                </div>
              </div>

              {/* Barra de proporción visual */}
              <div style={{ width: '100%', height: '14px', borderRadius: '7px', background: 'var(--bg-input)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${analytics.channelDistribution.mesaPercentage}%`, background: 'var(--primary-teal)', transition: 'width 0.4s ease' }} />
                <div style={{ width: `${analytics.channelDistribution.dePasoPercentage}%`, background: 'var(--cat-pasabocas)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div className="report-card-panel">
              <div className="card-panel-header">
                <h3 className="card-panel-title">🏆 Rotación y Ventas por Mesa</h3>
                <span className="card-panel-subtitle">Mesas más productivas</span>
              </div>

              {analytics.channelDistribution.byTable.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '1.5rem', textAlign: 'center' }}>No hay ventas en mesas registradas en este período.</p>
              ) : (
                <div className="reports-table-container">
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>Mesa</th>
                        <th style={{ textAlign: 'center' }}>Tickets</th>
                        <th style={{ textAlign: 'right' }}>Total Facturado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.channelDistribution.byTable.map((t, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 700 }}>
                            <span className="tag-badge mesa">🪑 {t.name}</span>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{t.count} pedidos</td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-teal)' }}>{formatCOP(t.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          PESTAÑA 2: CIERRE DE CAJA & ARQUEO
      ------------------------------------------------------------- */}
      {activeTab === 'cash' && analytics?.cashClosing && (
        <div>
          {/* Cajas de Arqueo Físico */}
          <div className="cash-closing-grid">
            <div className="cash-stat-box">
              <div className="cash-stat-icon">💵</div>
              <div className="cash-stat-info">
                <h4>Efectivo Neto en Caja</h4>
                <div className="amount" style={{ color: 'var(--primary-teal)' }}>
                  {formatCOP(analytics.cashClosing.netCash)}
                </div>
                <div className="desc">Total disponible a entregar en caja</div>
              </div>
            </div>

            <div className="cash-stat-box">
              <div className="cash-stat-icon" style={{ background: 'rgba(22, 143, 131, 0.12)', color: 'var(--status-activo)' }}>📥</div>
              <div className="cash-stat-info">
                <h4>Total Efectivo Recibido</h4>
                <div className="amount">
                  {formatCOP(analytics.cashClosing.totalCashReceived)}
                </div>
                <div className="desc">Pagos recibidos de clientes en billete/moneda</div>
              </div>
            </div>

            <div className="cash-stat-box">
              <div className="cash-stat-icon" style={{ background: 'rgba(211, 47, 47, 0.12)', color: 'var(--status-alerta)' }}>📤</div>
              <div className="cash-stat-info">
                <h4>Cambio / Vueltas Entregadas</h4>
                <div className="amount" style={{ color: 'var(--status-alerta)' }}>
                  {formatCOP(analytics.cashClosing.totalCashChange)}
                </div>
                <div className="desc">Vueltas retornadas a clientes</div>
              </div>
            </div>

            <div className="cash-stat-box">
              <div className="cash-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>📱</div>
              <div className="cash-stat-info">
                <h4>Transferencias (Nequi / Bancos)</h4>
                <div className="amount" style={{ color: '#7C3AED' }}>
                  {formatCOP(analytics.cashClosing.transferSalesTotal + analytics.cashClosing.virtualWalletTotal)}
                </div>
                <div className="desc">Ingresos recibidos en cuentas digitales</div>
              </div>
            </div>
          </div>

          <div className="reports-grid-two-col">
            {/* Desglose por Método de Pago */}
            <div className="report-card-panel">
              <div className="card-panel-header">
                <h3 className="card-panel-title">💳 Desglose por Método de Pago</h3>
                <span className="card-panel-subtitle">Total: {formatCOP(analytics.summary.totalRevenue)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {analytics.cashClosing.byPaymentMethod.map((pm, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-dark)' }}>{pm.name} ({pm.count} ventas)</span>
                      <span style={{ color: 'var(--primary-teal)' }}>{formatCOP(pm.total)} <small style={{ color: 'var(--text-muted)' }}>({pm.percentage}%)</small></span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'var(--bg-input)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${pm.percentage}%`, 
                          height: '100%', 
                          background: pm.name.toLowerCase().includes('efectivo') ? 'var(--status-activo)' :
                                      pm.name.toLowerCase().includes('transferencia') ? '#7C3AED' :
                                      pm.name.toLowerCase().includes('bolsillo') ? '#0284C7' : 'var(--cat-pasabocas)',
                          borderRadius: '6px',
                          transition: 'width 0.4s ease'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Rango de Recibos para Auditoría de Caja */}
              <div className="audit-consecutives-box">
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Auditoría de Consecutivos del Cierre
                </h4>
                <div className="audit-consecutives-row">
                  <span>Primer Recibo: <strong style={{ color: 'var(--primary-teal)' }}>#{analytics.cashClosing.firstReceipt}</strong></span>
                  <span>Último Recibo: <strong style={{ color: 'var(--primary-teal)' }}>#{analytics.cashClosing.lastReceipt}</strong></span>
                  <span>Tickets Emitidos: <strong>{analytics.cashClosing.receiptCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Listado de Transferencias para Cruce Bancario */}
            <div className="report-card-panel">
              <div className="card-panel-header">
                <h3 className="card-panel-title">📱 Soporte de Transferencias para Conciliación</h3>
                <span className="card-panel-subtitle">{analytics.cashClosing.transfersDetail.length} registros</span>
              </div>

              {analytics.cashClosing.transfersDetail.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No se registraron transferencias en este período.</p>
              ) : (
                <div className="reports-table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>Recibo</th>
                        <th>Cliente</th>
                        <th>Canal</th>
                        <th>Comprobante</th>
                        <th style={{ textAlign: 'right' }}>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.cashClosing.transfersDetail.map((t, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 800 }}>#{t.recibo}</td>
                          <td>{t.cliente}</td>
                          <td><span className="tag-badge transferencia">{t.tipo}</span></td>
                          <td><code style={{ fontSize: '0.8rem', background: 'var(--bg-input)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{t.comprobante}</code></td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-teal)' }}>{formatCOP(t.monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          PESTAÑA 3: PRODUCTOS & RENTABILIDAD
      ------------------------------------------------------------- */}
      {activeTab === 'products' && analytics && (
        <div>
          {/* Top 10 Productos y Categorías */}
          <div className="reports-grid-two-col">
            <div className="report-card-panel">
              <div className="card-panel-header">
                <div>
                  <h3 className="card-panel-title">⭐ Top 10 Productos Más Vendidos</h3>
                  <span className="card-panel-subtitle">Ranking de popularidad en vitrina</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    type="button" 
                    className={`filter-preset-pill ${productViewMode === 'qty' ? 'active' : ''}`}
                    onClick={() => setProductViewMode('qty')}
                  >
                    Por Cantidad
                  </button>
                  <button 
                    type="button" 
                    className={`filter-preset-pill ${productViewMode === 'revenue' ? 'active' : ''}`}
                    onClick={() => setProductViewMode('revenue')}
                  >
                    Por Ingresos
                  </button>
                </div>
              </div>

              <div className="reports-table-container">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th style={{ textAlign: 'center' }}>Unidades</th>
                      <th style={{ textAlign: 'right' }}>Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(productViewMode === 'qty' ? analytics.topProducts.byQuantity : analytics.topProducts.byRevenue).map((p, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, color: idx < 3 ? 'var(--primary-teal)' : 'var(--text-muted)' }}>
                          {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{p.name}</td>
                        <td>
                          <span className="tag-badge mesa" style={{ fontSize: '0.72rem' }}>{p.category}</span>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 800 }}>{p.quantity} u</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-teal)' }}>{formatCOP(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rendimiento por Categoría / Departamento */}
            <div className="report-card-panel">
              <div className="card-panel-header">
                <h3 className="card-panel-title">📊 Ventas por Categoría / Departamento</h3>
                <span className="card-panel-subtitle">Distribución porcentual de ingresos</span>
              </div>

              <div>
                {analytics.categoriesList.map((cat, idx) => {
                  const colors = [
                    'var(--cat-panes)',
                    'var(--cat-reposteria)',
                    'var(--cat-bebidas-calientes)',
                    'var(--cat-bebidas-frias)',
                    'var(--cat-pasabocas)',
                    'var(--cat-gaseosas)',
                    'var(--cat-lacteos)'
                  ];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={idx} className="category-stat-row">
                      <div className="category-stat-header">
                        <span className="category-name-badge">
                          <span className="category-dot" style={{ backgroundColor: barColor }} />
                          <strong style={{ color: 'var(--text-dark)' }}>{cat.category}</strong>
                          <small style={{ color: 'var(--text-muted)' }}>({cat.quantity} u)</small>
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>
                          {formatCOP(cat.total)} <small style={{ color: barColor }}>({cat.percentage}%)</small>
                        </span>
                      </div>
                      <div className="category-progress-track">
                        <div 
                          className="category-progress-fill" 
                          style={{ width: `${cat.percentage}%`, backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sección de Baja Rotación (Pan Frío / Huesos) */}
          <div className="report-card-panel" style={{ marginTop: '1.5rem' }}>
            <div className="card-panel-header">
              <div>
                <h3 className="card-panel-title">❄️ Productos de Baja Rotación ("Pan Frío / Huesos")</h3>
                <span className="card-panel-subtitle">Sin venta o salida mínima en el período para ajustar producción</span>
              </div>
              <span className="tag-badge stock-alert">Atención Requerida</span>
            </div>

            {analytics.lowRotationProducts.length === 0 ? (
              <p style={{ color: 'var(--status-activo)', padding: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
                ✅ ¡Excelente rotación! Todos los productos del catálogo han tenido salida en este período.
              </p>
            ) : (
              <div className="reports-table-container">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Departamento</th>
                      <th style={{ textAlign: 'center' }}>Stock Actual</th>
                      <th style={{ textAlign: 'center' }}>Ventas en Período</th>
                      <th>Acción Sugerida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.lowRotationProducts.map((p, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{p.name}</td>
                        <td><span className="tag-badge mesa" style={{ fontSize: '0.72rem' }}>{p.department}</span></td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{p.stock} u</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--status-alerta)' }}>
                          {p.quantitySold} u
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--cat-pasabocas)', fontWeight: 700 }}>
                            {p.stock > 10 ? '⚡ Promocionar / Combo' : '📉 Ajustar masa/producción'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          PESTAÑA 4: INVENTARIO & STOCK CRÍTICO
      ------------------------------------------------------------- */}
      {activeTab === 'inventory' && inventoryValuation && (
        <div>
          {/* Tarjetas de Inventario */}
          <div className="cash-closing-grid">
            <div className="cash-stat-box">
              <div className="cash-stat-icon">📦</div>
              <div className="cash-stat-info">
                <h4>Unidades Totales en Existencia</h4>
                <div className="amount" style={{ color: 'var(--primary-teal)' }}>
                  {inventoryValuation.totalStockUnits.toLocaleString('es-CO')} u
                </div>
                <div className="desc">Total físico disponible en bodega y vitrinas</div>
              </div>
            </div>

            <div className="cash-stat-box">
              <div className="cash-stat-icon" style={{ background: 'rgba(22, 143, 131, 0.12)', color: 'var(--status-activo)' }}>💎</div>
              <div className="cash-stat-info">
                <h4>Valor Total a Precio de Venta</h4>
                <div className="amount" style={{ color: 'var(--status-activo)' }}>
                  {formatCOP(inventoryValuation.inventorySaleValue)}
                </div>
                <div className="desc">Valor comercial proyectado del inventario</div>
              </div>
            </div>

            <div className="cash-stat-box">
              <div className="cash-stat-icon" style={{ background: 'rgba(14, 124, 134, 0.12)', color: 'var(--primary-teal)' }}>📋</div>
              <div className="cash-stat-info">
                <h4>Referencias en Catálogo</h4>
                <div className="amount">
                  {inventoryValuation.catalogCount} refs
                </div>
                <div className="desc">Productos activos en la panadería</div>
              </div>
            </div>

            <div className="cash-stat-box">
              <div className="cash-stat-icon" style={{ background: 'rgba(211, 47, 47, 0.12)', color: 'var(--status-alerta)' }}>🚨</div>
              <div className="cash-stat-info">
                <h4>Alertas de Stock Crítico</h4>
                <div className="amount" style={{ color: inventoryValuation.criticalStockCount > 0 ? 'var(--status-alerta)' : 'var(--text-dark)' }}>
                  {inventoryValuation.criticalStockCount}
                </div>
                <div className="desc">Productos por debajo del stock mínimo</div>
              </div>
            </div>
          </div>

          <div className="reports-grid-two-col">
            {/* Alertas de Stock Crítico */}
            <div className="report-card-panel">
              <div className="card-panel-header">
                <div>
                  <h3 className="card-panel-title">🚨 Productos en Alerta de Stock Crítico</h3>
                  <span className="card-panel-subtitle">Existencias menores o iguales al stock mínimo</span>
                </div>
                <span className="tag-badge stock-alert">{inventoryValuation.criticalStockCount} alertas</span>
              </div>

              {inventoryValuation.criticalStockProducts.length === 0 ? (
                <p style={{ color: 'var(--status-activo)', padding: '2rem', textAlign: 'center', fontWeight: 700 }}>
                  ✅ ¡Inventario óptimo! Ningún producto está por debajo de su umbral mínimo de seguridad.
                </p>
              ) : (
                <div className="reports-table-container">
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Departamento</th>
                        <th style={{ textAlign: 'center' }}>Stock</th>
                        <th style={{ textAlign: 'center' }}>Mínimo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryValuation.criticalStockProducts.map((p, idx) => (
                        <tr key={idx}>
                          <td><code>{p.code}</code></td>
                          <td style={{ fontWeight: 700 }}>{p.name}</td>
                          <td><span className="tag-badge mesa" style={{ fontSize: '0.72rem' }}>{p.department}</span></td>
                          <td style={{ textAlign: 'center', fontWeight: 800, color: p.isOut ? 'var(--status-agotado)' : 'var(--status-alerta)' }}>
                            {p.stock} u
                          </td>
                          <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{p.minStock} u</td>
                          <td>
                            {p.isOut ? (
                              <span className="tag-badge stock-alert" style={{ background: 'var(--status-agotado-bg)', color: 'var(--status-agotado)' }}>
                                ❌ Agotado
                              </span>
                            ) : (
                              <span className="tag-badge stock-alert">
                                ⚠️ Stock Bajo
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Valorización por Departamento */}
            <div className="report-card-panel">
              <div className="card-panel-header">
                <h3 className="card-panel-title">🏢 Valorización por Departamento</h3>
                <span className="card-panel-subtitle">Distribución del valor del stock en bodega</span>
              </div>

              <div className="reports-table-container">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Departamento</th>
                      <th style={{ textAlign: 'center' }}>Productos</th>
                      <th style={{ textAlign: 'center' }}>Unidades</th>
                      <th style={{ textAlign: 'right' }}>Valor Venta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryValuation.departmentValuation.map((d, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{d.department}</td>
                        <td style={{ textAlign: 'center' }}>{d.count} refs</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{d.stock} u</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-teal)' }}>{formatCOP(d.saleValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          PESTAÑA 5: PERSONAL & TURNOS
      ------------------------------------------------------------- */}
      {activeTab === 'employees' && analytics?.employeePerformance && (
        <div className="report-card-panel">
          <div className="card-panel-header">
            <div>
              <h3 className="card-panel-title">👥 Rendimiento por Empleado / Cajero</h3>
              <span className="card-panel-subtitle">Facturación, volumen de pedidos y ticket promedio por persona</span>
            </div>
            <span className="tag-badge mesa">{analytics.employeePerformance.length} miembros activos</span>
          </div>

          {analytics.employeePerformance.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No hay datos de empleados en el período seleccionado.</p>
          ) : (
            <div className="reports-table-container">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Cargo</th>
                    <th>Turno Asignado</th>
                    <th style={{ textAlign: 'center' }}>Ventas Atendidas</th>
                    <th style={{ textAlign: 'center' }}>Ticket Promedio</th>
                    <th style={{ textAlign: 'right' }}>Total Facturado</th>
                    <th style={{ textAlign: 'right' }}>% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.employeePerformance.map((emp, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                        <span style={{ marginRight: '0.4rem' }}>👤</span>
                        {emp.name}
                      </td>
                      <td><span className="tag-badge mesa">{emp.role}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>{emp.shift}</td>
                      <td style={{ textAlign: 'center', fontWeight: 800 }}>{emp.salesCount} tickets</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{formatCOP(emp.averageTicket)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-teal)', fontSize: '1rem' }}>
                        {formatCOP(emp.totalRevenue)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {emp.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          PESTAÑA 6: AUDITORÍA DE RECIBOS & BUSCADOR
      ------------------------------------------------------------- */}
      {activeTab === 'audit' && analytics && (
        <div className="report-card-panel">
          <div className="card-panel-header audit-header-panel">
            <div>
              <h3 className="card-panel-title">🧾 Auditoría y Trazabilidad de Recibos</h3>
              <span className="card-panel-subtitle">Consulta de tickets emitidos con búsqueda en tiempo real</span>
            </div>

            {/* Buscador de recibos */}
            <div className="receipt-search-wrapper">
              <input 
                type="text" 
                className="filter-date-input" 
                style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '9999px', boxSizing: 'border-box' }}
                placeholder="🔍 Buscar recibo, cliente, mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Recibo No.</th>
                  <th>Fecha y Hora</th>
                  <th>Cliente</th>
                  <th>Canal / Mesa</th>
                  <th>Método de Pago</th>
                  <th style={{ textAlign: 'center' }}>Items</th>
                  <th style={{ textAlign: 'right' }}>Total (COP)</th>
                  <th style={{ textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary-teal)' }}>#{r.receiptNumber}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.date}</td>
                    <td style={{ fontWeight: 600 }}>{r.customer}</td>
                    <td>
                      <span className={`tag-badge ${r.channel.includes('Mesa') ? 'mesa' : 'de-paso'}`}>
                        {r.channel}
                      </span>
                    </td>
                    <td>
                      <span className={`tag-badge ${
                        r.paymentMethod.toLowerCase().includes('efectivo') ? 'efectivo' :
                        r.paymentMethod.toLowerCase().includes('transferencia') ? 'transferencia' :
                        r.paymentMethod.toLowerCase().includes('bolsillo') ? 'bolsillo' : 'tarjeta'
                      }`}>
                        {r.paymentMethod}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.itemCount}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                      {formatCOP(r.total)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        type="button" 
                        className="btn-report-action"
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                        onClick={() => setSelectedReceipt(r)}
                      >
                        👁️ Ver Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL DE RECIBO / TICKET FISCAL PARA REIMPRESIÓN O AUDITORÍA
      ------------------------------------------------------------- */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="receipt-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header">
              <h2>PANADERÍA SMARTBAKERY</h2>
              <p style={{ margin: '0.2rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tuttis Gourmet S.A.S - NIT: 901.458.789-2</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calle 127 # 19-45, Bogotá, Colombia</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div className="receipt-meta-row">
                <span>RECIBO DE VENTA:</span>
                <strong>#{selectedReceipt.receiptNumber}</strong>
              </div>
              <div className="receipt-meta-row">
                <span>FECHA Y HORA:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="receipt-meta-row">
                <span>CLIENTE:</span>
                <span>{selectedReceipt.customer} ({selectedReceipt.nit})</span>
              </div>
              <div className="receipt-meta-row">
                <span>UBICACIÓN:</span>
                <span>{selectedReceipt.channel}</span>
              </div>
              <div className="receipt-meta-row">
                <span>PAGO:</span>
                <span>{selectedReceipt.paymentMethod} {selectedReceipt.transferType ? `(${selectedReceipt.transferType})` : ''}</span>
              </div>
              {selectedReceipt.transferVoucher && (
                <div className="receipt-meta-row">
                  <span>COMPROBANTE:</span>
                  <code>{selectedReceipt.transferVoucher}</code>
                </div>
              )}
            </div>

            <div className="receipt-items-list">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                <span>Cant. Descripción</span>
                <span>Subtotal</span>
              </div>

              {selectedReceipt.items && selectedReceipt.items.map((it, idx) => (
                <div key={idx} className="receipt-item-row">
                  <span>{it.cantidad || 1}x {it.nombre}</span>
                  <span style={{ fontWeight: 700 }}>{formatCOP(it.valor_total || (it.cantidad * it.valor_unitario))}</span>
                </div>
              ))}
            </div>

            <div className="receipt-total-row">
              <span>TOTAL PAGADO:</span>
              <span style={{ color: 'var(--primary-teal)' }}>{formatCOP(selectedReceipt.total)}</span>
            </div>

            <div className="receipt-modal-actions">
              <button 
                type="button" 
                className="btn-report-action primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => window.print()}
              >
                🖨️ Imprimir Ticket
              </button>
              <button 
                type="button" 
                className="btn-report-action" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setSelectedReceipt(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
