import React from 'react';
import './Inventory.css';

const Employees = () => {
  const employees = [
    { id: 1, name: 'Mateo Sánchez', role: 'Maestro Panadero', shift: 'Mañana (05:00 - 13:00)', status: 'ACTIVO' },
    { id: 2, name: 'Laura Restrepo', role: 'Pastelera Principal', shift: 'Tarde (13:00 - 21:00)', status: 'ACTIVO' },
    { id: 3, name: 'Andrés Castro', role: 'Cajero / Barista', shift: 'Mañana (06:00 - 14:00)', status: 'ACTIVO' },
    { id: 4, name: 'Camila Ortiz', role: 'Auxiliar de Cocina', shift: 'Fin de Semana', status: 'VACACIONES' }
  ];

  return (
    <div className="inventory-page-wrapper">
      <div className="inventory-top-toolbar">
        <div className="search-capsule-container">
          <input
            type="text"
            className="search-capsule-input"
            placeholder="B U S C A R   E M P L E A D O"
            style={{ letterSpacing: '2px' }}
          />
        </div>
        <button className="btn-add-product">+ NUEVO EMPLEADO</button>
      </div>

      <div className="table-responsive-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th className="th-cell"><span className="pill-header">EMPLEADO</span></th>
              <th className="th-cell"><span className="pill-header">CARGO</span></th>
              <th className="th-cell"><span className="pill-header">TURNO</span></th>
              <th className="th-cell"><span className="pill-header">ESTADO</span></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="inventory-row">
                <td className="td-cell" style={{ fontWeight: '700', color: '#222' }}>{emp.name}</td>
                <td className="td-cell" style={{ color: 'var(--cat-panes)', fontWeight: '700' }}>{emp.role}</td>
                <td className="td-cell" style={{ color: '#666' }}>{emp.shift}</td>
                <td className="td-cell" style={{ textAlign: 'center' }}>
                  <span className={`status-tag ${emp.status === 'ACTIVO' ? 'status-activo' : 'status-bajo'}`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
