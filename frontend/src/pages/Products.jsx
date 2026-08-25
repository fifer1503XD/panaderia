import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:3000/api/products';

  // Cargar productos del backend al montar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
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
      product.name.toLowerCase().includes(term) ||
      product.code.toLowerCase().includes(term) ||
      product.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products Management</h1>
        <button className="btn-primary" onClick={handleOpenCreate}>
          + Agregar Producto
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', overflowX: 'auto' }}>
        
        {/* Buscador */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="🔍 Buscar por nombre, código o departamento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.8rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid rgba(124, 96, 70, 0.2)',
              fontSize: '1rem',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {products.length === 0 ? (
          <p>No hay productos registrados. Haz clic en "Agregar Producto" para comenzar.</p>
        ) : filteredProducts.length === 0 ? (
          <p>No se encontraron productos que coincidan con "{searchTerm}".</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(124, 96, 70, 0.2)' }}>
                <th style={{ padding: '1rem' }}>Código</th>
                <th style={{ padding: '1rem' }}>Nombre</th>
                <th style={{ padding: '1rem' }}>Departamento</th>
                <th style={{ padding: '1rem' }}>Precio 1</th>
                <th style={{ padding: '1rem' }}>Precio 2</th>
                <th style={{ padding: '1rem' }}>Precio 3</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid rgba(124, 96, 70, 0.1)' }}>
                  <td style={{ padding: '1rem' }}>{product.code}</td>
                  <td style={{ padding: '1rem' }}>{product.name}</td>
                  <td style={{ padding: '1rem' }}>{product.department}</td>
                  <td style={{ padding: '1rem' }}>${product.price1}</td>
                  <td style={{ padding: '1rem' }}>${product.price2 || '-'}</td>
                  <td style={{ padding: '1rem' }}>${product.price3 || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => handleOpenEdit(product)}
                    >
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
