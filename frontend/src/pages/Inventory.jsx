import React, { useState, useEffect } from 'react';
import InventoryForm from '../components/InventoryForm';

const Inventory = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:3000/api/products';

  // Cargar productos y stock del backend al montar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error al cargar productos para inventario:', err));
  }, []);

  // Actualizar el inventario de un producto en el backend
  const handleSaveInventory = (productId, quantityToAdd) => {
    const product = products.find(p => p.id.toString() === productId.toString());
    if (!product) return;

    const currentStock = product.stock ? parseInt(product.stock) : 0;
    const newStock = currentStock + quantityToAdd;

    fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar el stock en el backend');
        return res.json();
      })
      .then(updatedProd => {
        setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
      })
      .catch(err => console.error('Error al guardar inventario:', err));
  };

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.code.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Inventory Control</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', overflowX: 'auto' }}>
        
        {/* Buscador */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="🔍 Buscar producto en inventario..." 
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
          <p>Aún no hay productos. Ve a la pestaña de "Products" para agregar tu catálogo primero.</p>
        ) : filteredProducts.length === 0 ? (
          <p>No se encontraron productos que coincidan con "{searchTerm}".</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(124, 96, 70, 0.2)' }}>
                <th style={{ padding: '1rem' }}>Código</th>
                <th style={{ padding: '1rem' }}>Nombre del Producto</th>
                <th style={{ padding: '1rem' }}>Stock Mínimo</th>
                <th style={{ padding: '1rem' }}>Stock Actual</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = product.stock || 0;
                const minStockLimit = product.minStock ? parseInt(product.minStock) : 5; // Default 5 si no se guardó
                
                let statusText = "🟢 Óptimo";
                let statusColor = "var(--success)";
                
                if (stock <= 0) {
                  statusText = "🔴 Agotado";
                  statusColor = "var(--danger)";
                } else if (stock <= minStockLimit) {
                  statusText = "🟠 Stock Bajo";
                  statusColor = "var(--warning)";
                }

                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(124, 96, 70, 0.1)' }}>
                    <td style={{ padding: '1rem' }}>{product.code}</td>
                    <td style={{ padding: '1rem' }}>{product.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{minStockLimit}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{stock}</td>
                    <td style={{ padding: '1rem', color: statusColor, fontWeight: '600' }}>{statusText}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => setSelectedProduct(product)}
                      >
                        ✏️ Ajustar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedProduct && (
        <InventoryForm 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)} 
          onSave={handleSaveInventory} 
        />
      )}
    </div>
  );
};

export default Inventory;
