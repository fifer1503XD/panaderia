import React, { useState, useEffect } from 'react';
import { getCategoryImage } from '../assets/productImages';
import { DEFAULT_CATEGORIES } from './ProductForm';
import './Modals.css';

const InventoryForm = ({ product, categories = [], onClose, onSave }) => {
  const categoryList = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    id_categoria: categoryList[0]?._id || ''
  });

  const [adjustmentType, setAdjustmentType] = useState('add'); // 'add' | 'set'
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (product) {
      const initialCatId = product.id_categoria?._id || product.id_categoria;
      const matchedCat = categoryList.find(
        (c) => c._id === initialCatId || c.nombre_categoria?.toUpperCase() === (product.department || '').toUpperCase()
      );

      setFormData({
        code: product.code || '',
        name: product.name || '',
        id_categoria: matchedCat?._id || categoryList[0]?._id || ''
      });
      setQuantity('');
    }
  }, [product, categoryList]);

  if (!product) return null;

  const currentStock = Number(product.stock) || 0;
  const selectedCategory = categoryList.find((c) => c._id === formData.id_categoria) || categoryList[0];
  const selectedDepartment = selectedCategory ? selectedCategory.nombre_categoria : (product.department || 'PANES');
  const previewImg = getCategoryImage(selectedDepartment);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateFinalStock = () => {
    if (quantity === '' || isNaN(parseInt(quantity, 10))) {
      return currentStock;
    }
    const val = parseInt(quantity, 10);
    if (adjustmentType === 'add') {
      return Math.max(0, currentStock + val);
    }
    return Math.max(0, val);
  };

  const finalStock = calculateFinalStock();
  const hasStockChange = quantity !== '' && !isNaN(parseInt(quantity, 10));

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      code: formData.code.trim() || product.code,
      name: formData.name.trim() || product.name,
      id_categoria: formData.id_categoria,
      department: selectedDepartment,
      stock: finalStock
    };

    onSave(product.id, updatedData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajustar Producto e Inventario</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Live Preview Card */}
            <div className="product-preview-badge">
              <img src={previewImg} alt={selectedDepartment} className="preview-img" />
              <div>
                <strong style={{ fontSize: '1rem', color: '#1E1E1E', display: 'block' }}>
                  {formData.name || product.name}
                </strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8E8E8E', fontWeight: '700' }}>
                    {formData.code || product.code}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: '700' }}>
                    • {selectedDepartment}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: '1rem' }}>
              {/* Row 1: Código & Categoría */}
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
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={handleChange}
                    required
                  >
                    {categoryList.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Nombre del Producto */}
              <div className="form-field">
                <label>Nombre del Producto *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej: Croissant de Mantequilla"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Stock Actual display */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#F8F9FA', borderRadius: '10px', border: '1px solid var(--border-divider)' }}>
                <span style={{ color: '#555', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Actual:</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--primary-teal)' }}>{currentStock} unidades</strong>
              </div>

              {/* Tipo de Ajuste */}
              <div className="form-field">
                <label>Tipo de Ajuste de Stock</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn-pill-cancel ${adjustmentType === 'add' ? 'btn-pill-submit' : ''}`}
                    style={{ borderRadius: '8px', padding: '0.65rem' }}
                    onClick={() => setAdjustmentType('add')}
                  >
                    ➕ Sumar / Restar
                  </button>
                  <button
                    type="button"
                    className={`btn-pill-cancel ${adjustmentType === 'set' ? 'btn-pill-submit' : ''}`}
                    style={{ borderRadius: '8px', padding: '0.65rem' }}
                    onClick={() => setAdjustmentType('set')}
                  >
                    🎯 Fijar Stock Exacto
                  </button>
                </div>
              </div>

              {/* Cantidad Input */}
              <div className="form-field">
                <label>
                  {adjustmentType === 'add'
                    ? 'Cantidad a sumar o restar (Opcional)'
                    : 'Nuevo stock total (Opcional)'}
                </label>
                <input
                  type="number"
                  placeholder={adjustmentType === 'add' ? 'Ej: 10 o -5 (dejar vacío si no cambia)' : 'Ej: 25 (dejar vacío si no cambia)'}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Result Preview */}
              {hasStockChange && (
                <div style={{ fontSize: '0.85rem', color: '#666', background: '#E6F7F5', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #BCEBE6' }}>
                  El nuevo stock resultante será:{' '}
                  <strong style={{ color: 'var(--status-activo)', fontSize: '0.95rem' }}>
                    {finalStock} unidades
                  </strong>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-pill-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-pill-submit">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
