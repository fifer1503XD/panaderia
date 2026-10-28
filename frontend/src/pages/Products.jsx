import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import { PRODUCTS_API_URL } from '../config/api';
import './Inventory.css';

const Products = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = PRODUCTS_API_URL;

  // Cargar productos del backend al montar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  // Guardar (crear o editar) producto en el backend
  const handleSaveProduct = (productData) => {
    if (productData.id) {
      // Es una edición: PUT
      fetch(`${API_URL}/${productData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al actualizar el producto');
          return res.json();
        })
        .then(updatedProd => {
          setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
        })
        .catch(err => console.error('Error al editar producto:', err));
    } else {
      // Es uno nuevo: POST
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al guardar el producto');
          return res.json();
        })
        .then(newProd => {
          setProducts(prev => [...prev, newProd]);
        })
        .catch(err => console.error('Error al crear producto:', err));
    }
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    return (
      (product.name || '').toLowerCase().includes(term) ||
      (product.code || '').toLowerCase().includes(term) ||
      (product.department || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="inventory-page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: 'var(--header-title)', margin: 0, fontWeight: 800 }}>Catálogo de Panadería</h2>
        <button className="btn-add-product" onClick={handleOpenCreate}>
          + Agregar Producto
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-divider)', boxShadow: 'var(--shadow-sm)' }}>
        {/* Buscador */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="search-capsule-container" style={{ maxWidth: '100%' }}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-capsule-input"
              placeholder="BUSCAR POR NOMBRE, CÓDIGO O DEPARTAMENTO..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No hay productos registrados. Haz clic en "+ Agregar Producto" para comenzar.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No se encontraron productos que coincidan con "{searchTerm}".
          </p>
        ) : (
          <div className="table-responsive-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-divider)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Código</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Nombre</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Departamento</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Precio Venta</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id || product._id} style={{ borderBottom: '1px solid var(--border-divider)', color: 'var(--text-dark)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>{product.code}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{product.name}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="category-tag cat-panes" style={{ fontSize: '0.8rem' }}>
                        {product.department || 'GENERAL'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--primary-teal)' }}>
                      ${product.price1}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button 
                        className="action-btn edit-action-btn"
                        style={{ display: 'inline-flex', padding: '0.4rem 0.8rem', width: 'auto', height: 'auto', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 700 }}
                        onClick={() => handleOpenEdit(product)}
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ProductForm 
          initialData={editingProduct}
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveProduct} 
        />
      )}
    </div>
  );
};

export default Products;
