import React, { useState } from 'react';
import '../components/ProductForm.css';

const InventoryForm = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product.id, parseInt(quantity));
    onClose();
  };

  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>Ajustar Inventario</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Producto Seleccionado</label>
            <div style={{ padding: '0.8rem', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '8px', fontWeight: '500' }}>
              {product.code} - {product.name}
            </div>
            <small style={{ color: 'var(--text-secondary)' }}>Stock actual: {product.stock || 0}</small>
          </div>
          
          <div className="form-group">
            <label>Cantidad a Sumar (usa - para restar)</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              required 
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
