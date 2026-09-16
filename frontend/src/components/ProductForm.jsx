import React, { useState, useEffect } from 'react';
import { getCategoryImage } from '../assets/productImages';
import './Modals.css';

export const DEFAULT_CATEGORIES = [
  { _id: 'cat-panes', nombre_categoria: 'PANES' },
  { _id: 'cat-reposteria', nombre_categoria: 'REPOSTERIA' },
  { _id: 'cat-pasabocas', nombre_categoria: 'PASABOCAS' },
  { _id: 'cat-desayunos', nombre_categoria: 'DESAYUNOS' },
  { _id: 'cat-combos', nombre_categoria: 'COMBOS' },
  { _id: 'cat-bebidas-calientes', nombre_categoria: 'BEBIDAS CALIENTES' },
  { _id: 'cat-bebidas-frias', nombre_categoria: 'BEBIDAS FRÍAS' },
  { _id: 'cat-gaseosas', nombre_categoria: 'GASEOSAS' },
  { _id: 'cat-lacteos', nombre_categoria: 'LÁCTEOS' },
  { _id: 'cat-varios', nombre_categoria: 'VARIOS' }
];

export const CATEGORIES = DEFAULT_CATEGORIES.map(c => c.nombre_categoria);

const ProductForm = ({ initialData, categories = [], onClose, onSave }) => {
  const categoryList = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: '',
    id_categoria: categoryList[0]?._id || '',
    price1: '',
    price2: '',
    price3: '',
    minStock: 5,
    stock: 10
  });

  useEffect(() => {
    if (initialData) {
      const initialCatId = initialData.id_categoria?._id || initialData.id_categoria;
      const matchedCat = categoryList.find(
        (c) => c._id === initialCatId || c.nombre_categoria?.toUpperCase() === (initialData.department || initialData.category || '').toUpperCase()
      );

      setFormData({
        id: initialData.id,
        code: initialData.code || '',
        name: initialData.name || '',
        brand: initialData.brand || '',
        id_categoria: matchedCat?._id || categoryList[0]?._id || '',
        price1: initialData.price1 ?? '',
        price2: initialData.price2 ?? '',
        price3: initialData.price3 ?? '',
        minStock: initialData.minStock ?? 5,
        stock: initialData.stock ?? 0
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id_categoria: prev.id_categoria || categoryList[0]?._id || ''
      }));
    }
  }, [initialData, categoryList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedCategory = categoryList.find((c) => c._id === formData.id_categoria) || categoryList[0];
  const selectedDepartment = selectedCategory ? selectedCategory.nombre_categoria : 'PANES';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id_categoria: formData.id_categoria,
      department: selectedDepartment,
      price1: Number(formData.price1) || 0,
      price2: formData.price2 ? Number(formData.price2) : undefined,
      price3: formData.price3 ? Number(formData.price3) : undefined,
      minStock: Number(formData.minStock) || 5,
      stock: Number(formData.stock) || 0
    });
    onClose();
  };

  const isEditing = !!initialData;
  const previewImg = getCategoryImage(selectedDepartment);

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
              <img src={previewImg} alt={selectedDepartment} className="preview-img" />
              <div>
                <strong style={{ fontSize: '1rem', color: '#1E1E1E' }}>
                  {formData.name || 'Nombre del Producto'}
                </strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8E8E8E', fontWeight: '700' }}>
                    {formData.code || 'CÓDIGO'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: '700' }}>
                    • {selectedDepartment}
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
                    min="0"
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
                    min="0"
                  />
                </div>
                <div className="form-field">
                  <label>Stock Mínimo</label>
                  <input
                    type="number"
                    name="minStock"
                    placeholder="Ej: 3"
                    value={formData.minStock}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
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
