import React from 'react';
import './Inventory.css';

const Clients = () => {
  const clients = [
    { id: 1, name: 'María Gómez', email: 'maria.g@gmail.com', phone: '310 456 7890', points: 1450, tier: 'ORO' },
    { id: 2, name: 'Carlos Rodríguez', email: 'carlos.r@hotmail.com', phone: '320 123 4567', points: 890, tier: 'PLATA' },
    { id: 3, name: 'Ana Sofía Silva', email: 'ana.silva@yahoo.com', phone: '300 987 6543', points: 2300, tier: 'PLATINO' },
    { id: 4, name: 'Juan Pablo Morales', email: 'jpmorales@gmail.com', phone: '315 678 1234', points: 420, tier: 'BRONCE' }
  ];

  return (
    <div className="inventory-page-wrapper">
      <div className="inventory-top-toolbar">
        <div className="search-capsule-container">
          <input
            type="text"
            className="search-capsule-input"
            placeholder="B U S C A R   C L I E N T E"
            style={{ letterSpacing: '2px' }}
          />
        </div>
        <button className="btn-add-product">+ NUEVO CLIENTE</button>
      </div>

      <div className="table-responsive-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th className="th-cell"><span className="pill-header">CLIENTE</span></th>
              <th className="th-cell"><span className="pill-header">CORREO</span></th>
              <th className="th-cell"><span className="pill-header">TELÉFONO</span></th>
              <th className="th-cell"><span className="pill-header">PUNTOS</span></th>
              <th className="th-cell"><span className="pill-header">NIVEL</span></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="inventory-row">
                <td className="td-cell" style={{ fontWeight: '700', color: '#222' }}>{c.name}</td>
                <td className="td-cell" style={{ color: '#666' }}>{c.email}</td>
                <td className="td-cell" style={{ color: '#666' }}>{c.phone}</td>
                <td className="td-cell" style={{ textAlign: 'center', fontWeight: '800', color: 'var(--primary-teal)' }}>{c.points} pts</td>
                <td className="td-cell" style={{ textAlign: 'center' }}>
                  <span className="status-tag status-activo">{c.tier}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
