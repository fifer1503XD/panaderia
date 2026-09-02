import React, { useState } from 'react';
import './Inventory.css';

const Settings = () => {
  const [storeName, setStoreName] = useState('Panadería & Pastelería Tuttis');
  const [currency, setCurrency] = useState('COP ($)');
  const [taxRate, setTaxRate] = useState(19);

  return (
    <div className="inventory-page-wrapper">
      <div style={{ maxWidth: '640px', background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-divider)' }}>
        <h2 style={{ color: 'var(--header-title)', marginBottom: '1.5rem', fontWeight: '800' }}>Configuración del Negocio</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); alert('¡Configuraciones guardadas correctamente!'); }} className="form-grid">
          <div className="form-field">
            <label>Nombre del Establecimiento</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
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
              <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-add-product">
              Guardar Ajustes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
