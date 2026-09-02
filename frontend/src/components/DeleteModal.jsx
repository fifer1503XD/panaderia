import React from 'react';
import './Modals.css';

const DeleteModal = ({ product, onClose, onConfirm }) => {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--status-alerta)' }}>Eliminar Producto</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🗑️</div>
          <p style={{ fontSize: '1rem', color: '#333', marginBottom: '0.5rem' }}>
            ¿Estás seguro de que deseas eliminar este producto del inventario?
          </p>
          <div style={{ padding: '0.6rem 1rem', background: '#FFF5F5', borderRadius: '8px', border: '1px solid #FED7D7', display: 'inline-block' }}>
            <strong style={{ color: '#C53030' }}>{product.name}</strong> ({product.code})
          </div>
          <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.8rem' }}>
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn-pill-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn-pill-danger" 
            onClick={() => {
              onConfirm(product.id);
              onClose();
            }}
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
