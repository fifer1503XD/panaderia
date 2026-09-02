import React from 'react';
import './Inventory.css';

const Reports = () => {
  return (
    <div className="inventory-page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.85rem', color: '#8E8E8E', fontWeight: '800', letterSpacing: '1px' }}>VENTAS HOY</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-teal)', margin: '0.5rem 0 0.2rem 0' }}>$485.000</h2>
          <small style={{ color: 'var(--status-activo)', fontWeight: '700' }}>↑ +14% vs ayer</small>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.85rem', color: '#8E8E8E', fontWeight: '800', letterSpacing: '1px' }}>PRODUCTO MÁS VENDIDO</span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--header-title)', margin: '0.5rem 0 0.2rem 0' }}>Croissant (84 u)</h2>
          <small style={{ color: 'var(--cat-panes)', fontWeight: '700' }}>Categoría: Panes</small>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.85rem', color: '#8E8E8E', fontWeight: '800', letterSpacing: '1px' }}>ALERTAS DE STOCK</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--status-alerta)', margin: '0.5rem 0 0.2rem 0' }}>2 Productos</h2>
          <small style={{ color: '#666', fontWeight: '600' }}>Rollo de canela, Muffin</small>
        </div>
      </div>

      <div style={{ background: '#FFF', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-divider)' }}>
        <h3 style={{ marginBottom: '1rem', color: '#222' }}>📊 Rendimiento Semanal por Categoría</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--cat-panes)' }}>PANES (58%)</span>
              <span>$1.850.000</span>
            </div>
            <div style={{ height: '12px', background: '#F0F0F0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '58%', height: '100%', background: 'var(--cat-panes)', borderRadius: '6px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--cat-reposteria)' }}>REPOSTERÍA (32%)</span>
              <span>$1.020.000</span>
            </div>
            <div style={{ height: '12px', background: '#F0F0F0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '32%', height: '100%', background: 'var(--cat-reposteria)', borderRadius: '6px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontWeight: '700' }}>
              <span style={{ color: 'var(--cat-pasabocas)' }}>PASABOCAS (10%)</span>
              <span>$320.000</span>
            </div>
            <div style={{ height: '12px', background: '#F0F0F0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', background: 'var(--cat-pasabocas)', borderRadius: '6px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
