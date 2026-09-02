import React, { useState, useEffect } from 'react';
import { getProductImage } from '../assets/productImages';
import './Modals.css';

const CATEGORIES = [
  'PANES',
  'REPOSTERIA',
  'PASABOCAS',
  'DESAYUNOS',
  'BEBIDAS',
  'OTROS'
];

const ProductForm = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: '',
    department: 'PANES',
    price1: '',
    price2: '',
    price3: '',
    minStock: 5,
    stock: 10,
    imageUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        code: initialData.code || '',
        name: initialData.name || '',
        brand: initialData.brand || '',
        department: (initialData.department || initialData.category || 'PANES').toUpperCase(),
        price1: initialData.price1 ?? '',
        price2: initialData.price2 ?? '',
        price3: initialData.price3 ?? '',
        minStock: initialData.minStock ?? 5,
        stock: initialData.stock ?? 0,
        imageUrl: initialData.imageUrl || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price1: Number(formData.price1) || 0,
      price2: formData.price2 ? Number(formData.price2) : undefined,
      price3: formData.price3 ? Number(formData.price3) : undefined,
      minStock: Number(formData.minStock) || 5,
      stock: Number(formData.stock) || 0,
      department: formData.department.toUpperCase()
    });
    onClose();
  };

  const isEditing = !!initialData;
  const previewImg = formData.imageUrl || getProductImage(formData.name, formData.code);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="product-preview-badge">
              <img src={previewImg} alt="Preview" className="preview-img" />
              <div>
                <strong style={{ fontSize: '1rem', color: '#1E1E1E' }}>
                  {formData.name || 'Nombre del Producto'}
                </strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8E8E8E', fontWeight: '700' }}>
                    {formData.code || 'CÓDIGO'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: '700' }}>
                    • {formData.department}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-row-2">
                <div className="form-field">
                  <label>Código Único *</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Ej: CR001, RP002"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Categoría / Departamento *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Nombre del Producto *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej: Croissant de Mantequilla, Rollo de canela..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row-3">
                <div className="form-field">
                  <label>Precio Venta *</label>
                  <input
                    type="number"
                    name="price1"
                    placeholder="Ej: 3000"
                    value={formData.price1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Stock Inicial</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Ej: 10"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label>Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    name="minStock"
                    placeholder="Ej: 3"
                    value={formData.minStock}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>URL de Imagen (Opcional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-pill-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-pill-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
