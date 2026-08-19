import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar productos del LocalStorage al montar
  useEffect(() => {
    const savedProducts = localStorage.getItem('bakery_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Guardar (crear o editar) producto
  const handleSaveProduct = (productData) => {
    let updatedProducts;
    
    if (productData.id) {
      // Es una edición: buscamos el producto por id y lo reemplazamos
      updatedProducts = products.map(p => p.id === productData.id ? productData : p);
    } else {
      // Es uno nuevo: le asignamos un id
      updatedProducts = [...products, { ...productData, id: Date.now() }];
    }

    setProducts(updatedProducts);
    localStorage.setItem('bakery_products', JSON.stringify(updatedProducts));
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
