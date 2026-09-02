import React, { useState } from 'react';
import { getProductImage } from '../assets/productImages';
import './Modals.css';

const InventoryForm = ({ product, onClose, onSave }) => {
  const [adjustmentType, setAdjustmentType] = useState('add'); // 'add' | 'set'
  const [quantity, setQuantity] = useState('');

  if (!product) return null;

  const currentStock = Number(product.stock) || 0;
  const imageSrc = product.imageUrl || getProductImage(product.name, product.code);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(quantity, 10);
    if (isNaN(val)) return;

    let finalNewStock = currentStock;
    if (adjustmentType === 'add') {
      finalNewStock = Math.max(0, currentStock + val);
    } else {
      finalNewStock = Math.max(0, val);
    }

    onSave(product.id, finalNewStock);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajustar Inventario</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="product-preview-badge">
              <img src={imageSrc} alt={product.name} className="preview-img" />
              <div>
                <strong style={{ fontSize: '1.05rem', color: '#1E1E1E', display: 'block' }}>{product.name}</strong>
                <span style={{ fontSize: '0.85rem', color: '#8E8E8E', fontWeight: '600' }}>CÓDIGO: {product.code}</span>
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#F8F9FA', borderRadius: '10px' }}>
                <span style={{ color: '#555', fontWeight: '600' }}>Stock Actual:</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-teal)' }}>{currentStock} unidades</strong>
              </div>

              <div className="form-field">
                <label>Tipo de Ajuste</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn-pill-cancel ${adjustmentType === 'add' ? 'btn-pill-submit' : ''}`}
                    style={{ borderRadius: '8px', padding: '0.6rem' }}
                    onClick={() => setAdjustmentType('add')}
                  >
                    ➕ Sumar / Restar
                  </button>
                  <button
                    type="button"
                    className={`btn-pill-cancel ${adjustmentType === 'set' ? 'btn-pill-submit' : ''}`}
                    style={{ borderRadius: '8px', padding: '0.6rem' }}
                    onClick={() => setAdjustmentType('set')}
                  >
                    🎯 Fijar Stock Exacto
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label>
                  {adjustmentType === 'add' 
                    ? 'Cantidad a sumar (o valor negativo para restar)' 
                    : 'Nuevo stock total'}
                </label>
                <input
                  type="number"
                  placeholder={adjustmentType === 'add' ? 'Ej: 10 o -5' : 'Ej: 25'}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {quantity !== '' && !isNaN(parseInt(quantity, 10)) && (
                <div style={{ fontSize: '0.85rem', color: '#666', background: '#E6F7F5', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                  El nuevo stock resultante será:{' '}
                  <strong style={{ color: 'var(--status-activo)' }}>
                    {adjustmentType === 'add' 
                      ? Math.max(0, currentStock + parseInt(quantity, 10))
                      : Math.max(0, parseInt(quantity, 10))} unidades
                  </strong>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-pill-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-pill-submit">Guardar Existencias</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
