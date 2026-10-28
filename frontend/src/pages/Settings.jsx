import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import './Inventory.css';

const Settings = () => {
  const [storeName, setStoreName] = useState('Panadería & Pastelería Tuttis');
  const [currency, setCurrency] = useState('COP ($)');
  const [taxRate, setTaxRate] = useState(19);
  const { isDark } = useTheme();

  return (
    <div className="inventory-page-wrapper">
      <div style={{ 
        maxWidth: '680px', 
        width: '100%',
        background: 'var(--bg-card)', 
        padding: '2.2rem 1.8rem', 
        borderRadius: '16px', 
        border: '1px solid var(--border-divider)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h2 style={{ color: 'var(--header-title)', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.4rem' }}>
          Configuración del Negocio
        </h2>

        {/* Sección de Apariencia / Descanso Visual */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '1.1rem 1.25rem',
          background: 'var(--bg-card-subtle)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.8rem',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
              Modo Descanso Visual (Oscuro Mate)
            </strong>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Tonos opacos optimizados para no cansar la vista durante jornadas de trabajo.
            </small>
          </div>
          <ThemeToggle />
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); alert('¡Configuraciones guardadas correctamente!'); }} className="form-grid">
          <div className="form-field">
            <label>Nombre del Establecimiento</label>
            <input 
              type="text" 
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)} 
            />
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label>Moneda del Sistema</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="COP ($)">Peso Colombiano (COP $)</option>
                <option value="USD ($)">Dólar (USD $)</option>
                <option value="EUR (€)">Euro (EUR €)</option>
                <option value="MXN ($)">Peso Mexicano (MXN $)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Impuesto / IVA (%)</label>
              <input 
                type="number" 
                value={taxRate} 
                onChange={(e) => setTaxRate(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-add-product" style={{ width: 'auto', minWidth: '160px' }}>
              Guardar Ajustes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
