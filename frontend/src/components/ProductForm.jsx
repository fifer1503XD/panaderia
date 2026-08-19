import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: '',
    department: '',
    price1: '',
    price2: '',
    price3: '',
    minStock: 5 // Valor por defecto
  });

  // Si nos pasan initialData, significa que estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isEditing = !!initialData;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>{isEditing ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Código</label>
              <input type="text" name="code" value={formData.code} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Stock Mínimo (Alerta)</label>
              <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marca</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Departamento</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio 1 (General)</label>
              <input type="number" step="0.01" name="price1" value={formData.price1} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Precio 2 (Mayoreo)</label>
              <input type="number" step="0.01" name="price2" value={formData.price2} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Precio 3 (Especial)</label>
              <input type="number" step="0.01" name="price3" value={formData.price3} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">{isEditing ? "Actualizar Producto" : "Guardar Producto"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
