import React, { useState } from 'react';
import '../components/ProductForm.css'; // Reutilizamos los estilos del modal

const InventoryForm = ({ products, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId) {
      alert("Por favor selecciona un producto.");
      return;
    }
    
    onSave(formData.productId, parseInt(formData.quantity));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>Ajustar Inventario</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Producto</label>
            <select 
              name="productId" 
              value={formData.productId} 
              onChange={handleChange} 
              required
              style={{
                padding: '0.8rem',
                border: '1px solid rgba(124, 96, 70, 0.2)',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">-- Selecciona un producto --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name} (Stock actual: {p.stock || 0})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Cantidad a Sumar (puedes usar negativos para restar)</label>
            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar Inventario</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
