import React, { useState, useEffect } from 'react';
import './Sales.css';

const initialTables = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  status: 'libre',
  order: [] // { product, quantity, price }
}));

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(1);

  // Cargar productos y mesas al montar
  useEffect(() => {
    const savedProducts = localStorage.getItem('bakery_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));

    const savedTables = localStorage.getItem('bakery_tables');
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    } else {
      setTables(initialTables);
      localStorage.setItem('bakery_tables', JSON.stringify(initialTables));
    }
  }, []);

  const selectedTable = tables.find(t => t.id === selectedTableId) || tables[0];

  const handleTableClick = (id) => {
    setSelectedTableId(id);
  };

  const addProductToOrder = (product) => {
    // Si la mesa está libre, la pasamos a ocupada automáticamente
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        // Verificar si hay stock
        const currentStock = product.stock || 0;
        const inOrder = table.order.find(item => item.product.id === product.id)?.quantity || 0;
        
        if (currentStock - inOrder <= 0) {
          alert(`¡Stock agotado para ${product.name}!`);
          return table;
        }

        const newOrder = [...table.order];
        const existingItemIndex = newOrder.findIndex(item => item.product.id === product.id);

        if (existingItemIndex >= 0) {
          newOrder[existingItemIndex].quantity += 1;
        } else {
          newOrder.push({ product, quantity: 1, price: product.price1 });
        }

        return {
          ...table,
          status: 'ocupada',
          order: newOrder
        };
      }
      return table;
    });

    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));
  };

  const removeItem = (productId) => {
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        const newOrder = table.order.filter(item => item.product.id !== productId);
        return {
          ...table,
          status: newOrder.length === 0 ? 'libre' : 'ocupada',
          order: newOrder
        };
      }
      return table;
    });
    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));
  };

  const handleCheckout = () => {
    if (!selectedTable || selectedTable.order.length === 0) return;

    // Calcular totales de la orden actual para guardar el historial
    const subtotalActual = selectedTable.order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxActual = subtotalActual * 0.16;
    const totalActual = subtotalActual + taxActual;

    // 1. Guardar en Historial de Ventas
    const newSaleRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      tableId: selectedTableId,
      items: selectedTable.order,
      total: totalActual
    };

    const existingSales = JSON.parse(localStorage.getItem('bakery_sales_history') || '[]');
    localStorage.setItem('bakery_sales_history', JSON.stringify([...existingSales, newSaleRecord]));

    // 2. Descontar inventario
    let updatedProducts = [...products];
    
    selectedTable.order.forEach(orderItem => {
      const prodIndex = updatedProducts.findIndex(p => p.id === orderItem.product.id);
      if (prodIndex >= 0) {
        const currentStock = updatedProducts[prodIndex].stock || 0;
        updatedProducts[prodIndex].stock = currentStock - orderItem.quantity;
      }
    });

    setProducts(updatedProducts);
    localStorage.setItem('bakery_products', JSON.stringify(updatedProducts));

    // 3. Liberar mesa
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        return { ...table, status: 'libre', order: [] };
      }
      return table;
    });
    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));

    alert(`¡Factura de Mesa ${selectedTableId} cobrada con éxito por $${totalActual.toFixed(2)}!`);
  };

  const cancelOrder = () => {
    if (!window.confirm("¿Seguro que deseas cancelar esta orden y liberar la mesa?")) return;
    
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        return { ...table, status: 'libre', order: [] };
      }
      return table;
    });
    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));
  };

  // Cálculos de ticket
  const subtotal = selectedTable?.order.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.16; // 16% IVA de ejemplo
  const total = subtotal + tax;

  return (
    <div className="page-container pos-layout">
      
      {/* Panel Izquierdo: Mesas y Productos */}
      <div className="pos-left">
        <div className="tables-header">
          <h2>Mesas</h2>
        </div>
        <div className="tables-container">
          {tables.map(table => (
            <button 
              key={table.id}
              className={`table-btn ${table.status} ${selectedTableId === table.id ? 'selected' : ''}`}
              onClick={() => handleTableClick(table.id)}
            >
              Mesa {table.id}
              <span>{table.status}</span>
            </button>
          ))}
        </div>

        <div className="products-header">
          <h2>Catálogo (Mesa {selectedTableId})</h2>
        </div>
        <div className="products-grid">
          {products.filter(p => p.price1).map(product => (
            <button 
              key={product.id} 
              className="product-card"
              onClick={() => addProductToOrder(product)}
            >
              <div className="p-name">{product.name}</div>
              <div className="p-price">${product.price1}</div>
              <div className="p-stock">Stock: {product.stock || 0}</div>
            </button>
          ))}
          {products.length === 0 && <p style={{ gridColumn: '1 / -1' }}>No hay productos con precio configurado.</p>}
        </div>
      </div>

      {/* Panel Derecho: Ticket actual */}
      <div className="pos-right glass-panel">
        <div className="ticket-header">
          <h3>Factura Actual</h3>
          <p>Mesa {selectedTableId}</p>
        </div>
        
        <div className="ticket-items">
          {selectedTable?.order.length === 0 ? (
            <p className="empty-cart">La mesa está libre. Selecciona productos para abrir factura.</p>
          ) : (
            selectedTable?.order.map((item, idx) => (
              <div key={idx} className="ticket-item">
                <div className="item-info">
                  <span className="item-qty">{item.quantity}x</span>
                  <span className="item-name">{item.product.name}</span>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                  <button className="remove-btn" onClick={() => removeItem(item.product.id)}>×</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="ticket-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Impuestos (16%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="ticket-actions">
          <button 
            className="btn-secondary" 
            disabled={selectedTable?.order.length === 0}
            onClick={cancelOrder}
          >
            Cancelar
          </button>
          <button 
            className="btn-primary" 
            disabled={selectedTable?.order.length === 0}
            onClick={handleCheckout}
          >
            Cobrar Factura
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
