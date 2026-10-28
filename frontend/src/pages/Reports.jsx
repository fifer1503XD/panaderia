import React from 'react';
import './Inventory.css';

const Reports = () => {
  return (
    <div className="inventory-page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>VENTAS HOY</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-teal)', margin: '0.5rem 0 0.2rem 0' }}>$485.000</h2>
          <small style={{ color: 'var(--status-activo)', fontWeight: '700' }}>↑ +14% vs ayer</small>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>PRODUCTO MÁS VENDIDO</span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--header-title)', margin: '0.5rem 0 0.2rem 0' }}>Croissant (84 u)</h2>
          <small style={{ color: 'var(--cat-panes)', fontWeight: '700' }}>Categoría: Panes</small>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>ALERTAS DE STOCK</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--status-alerta)', margin: '0.5rem 0 0.2rem 0' }}>2 Productos</h2>
          <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Rollo de canela, Muffin</small>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-dark)' }}>📊 Rendimiento Semanal por Categoría</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--cat-panes)' }}>PANES (58%)</span>
              <span style={{ color: 'var(--text-dark)' }}>$1.850.000</span>
            </div>
            <div style={{ height: '12px', background: 'var(--bg-input)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '58%', height: '100%', background: 'var(--cat-panes)', borderRadius: '6px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--cat-reposteria)' }}>REPOSTERÍA (32%)</span>
              <span style={{ color: 'var(--text-dark)' }}>$1.020.000</span>
            </div>
            <div style={{ height: '12px', background: 'var(--bg-input)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '32%', height: '100%', background: 'var(--cat-reposteria)', borderRadius: '6px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--cat-pasabocas)' }}>PASABOCAS (10%)</span>
              <span style={{ color: 'var(--text-dark)' }}>$320.000</span>
            </div>
            <div style={{ height: '12px', background: 'var(--bg-input)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', background: 'var(--cat-pasabocas)', borderRadius: '6px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
