import React, { useState, useEffect } from 'react';
import InventoryForm from '../components/InventoryForm';

const Inventory = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar productos y stock del LocalStorage al montar
  useEffect(() => {
    const savedProducts = localStorage.getItem('bakery_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Actualizar el inventario de un producto
  const handleSaveInventory = (productId, quantityToAdd) => {
    const updatedProducts = products.map(product => {
      if (product.id.toString() === productId.toString()) {
        const currentStock = product.stock ? parseInt(product.stock) : 0;
        return { ...product, stock: currentStock + quantityToAdd };
      }
      return product;
    });

    setProducts(updatedProducts);
    localStorage.setItem('bakery_products', JSON.stringify(updatedProducts));
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
