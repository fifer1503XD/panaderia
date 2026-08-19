import React, { useState, useEffect } from 'react';
import InventoryForm from '../components/InventoryForm';

const Inventory = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [products, setProducts] = useState([]);

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

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Inventory Control</h1>
        <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
          + Ajustar Inventario
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', overflowX: 'auto' }}>
        {products.length === 0 ? (
          <p>Aún no hay productos. Ve a la pestaña de "Products" para agregar tu catálogo primero.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(124, 96, 70, 0.2)' }}>
                <th style={{ padding: '1rem' }}>Código</th>
                <th style={{ padding: '1rem' }}>Nombre del Producto</th>
                <th style={{ padding: '1rem' }}>Departamento</th>
                <th style={{ padding: '1rem' }}>Stock Actual</th>
                <th style={{ padding: '1rem' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = product.stock || 0;
                let statusText = "🟢 Óptimo";
                let statusColor = "var(--success)";
                if (stock <= 0) {
                  statusText = "🔴 Agotado";
                  statusColor = "var(--danger)";
                } else if (stock <= 5) {
                  statusText = "🟠 Stock Bajo";
                  statusColor = "var(--warning)";
                }

                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(124, 96, 70, 0.1)' }}>
                    <td style={{ padding: '1rem' }}>{product.code}</td>
                    <td style={{ padding: '1rem' }}>{product.name}</td>
                    <td style={{ padding: '1rem' }}>{product.department}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{stock}</td>
                    <td style={{ padding: '1rem', color: statusColor, fontWeight: '600' }}>{statusText}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isFormOpen && (
        <InventoryForm 
          products={products}
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveInventory} 
        />
      )}
    </div>
  );
};

export default Inventory;
