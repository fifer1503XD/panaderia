import React from 'react';

const Sales = () => {
  return (
    <div className="page-container">
      <h1>Point of Sale (POS)</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ flex: 2, padding: '2rem' }}>
          <h3>Catálogo Rápido</h3>
          <p>Grilla de productos clickeables para agregar a la orden.</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '2rem' }}>
          <h3>Ticket Actual</h3>
          <p>Resumen de la venta y botón de cobrar.</p>
        </div>
      </div>
    </div>
  );
};

export default Sales;
