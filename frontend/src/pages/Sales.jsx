import React, { useState, useEffect } from 'react';
import { PRODUCTS_API_URL, PAYMENT_METHODS_API_URL, SALES_API_URL } from '../config/api';
import './Sales.css';

// Formato de moneda con punto de mil colombiano (ej: $15.000, $4.200)
export const formatPrice = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '$0';
  const num = Number(val);
  return '$' + num.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

const defaultTables = [
  { id: 'paso', name: 'Cliente de Paso', isPaso: true, status: 'libre', order: [] },
  { id: 1, name: 'Mesa 1', status: 'libre', order: [] },
  { id: 2, name: 'Mesa 2', status: 'libre', order: [] },
  { id: 3, name: 'Mesa 3', status: 'libre', order: [] },
  { id: 4, name: 'Mesa 4', status: 'libre', order: [] },
  { id: 5, name: 'Mesa 5', status: 'libre', order: [] },
];

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState('paso');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo');
  
  // Edición de precio
  const [editingPriceProductId, setEditingPriceProductId] = useState(null);
  const [tempPriceValue, setTempPriceValue] = useState('');

  // Modal de Efectivo
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [cashAmountGiven, setCashAmountGiven] = useState('');

  // Modal de Transferencia / Bolsillo Virtual
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState('Nequi');
  const [transferVoucher, setTransferVoucher] = useState('');

  // Notificación de éxito
  const [successReceipt, setSuccessReceipt] = useState(null);

  // Modal y Datos de Impresión de Recibo
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printClientName, setPrintClientName] = useState('Cliente General');
  const [printClientNit, setPrintClientNit] = useState('Consumidor Final');
  const [printReceiptNumber, setPrintReceiptNumber] = useState('0001');
  const [printReceiptData, setPrintReceiptData] = useState(null);

  // Cargar productos, mesas y medios de pago al montar
  useEffect(() => {
    // 1. Cargar productos
    fetch(PRODUCTS_API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => console.error('Error al cargar productos en ventas:', err));

    // 2. Cargar mesas desde localStorage asegurando cliente de paso
    const savedTables = localStorage.getItem('bakery_tables');
    if (savedTables) {
      try {
        let parsed = JSON.parse(savedTables);
        const hasPaso = parsed.some(t => t.id === 'paso' || t.isPaso);
        if (!hasPaso) {
          parsed = [{ id: 'paso', name: 'Cliente de Paso', isPaso: true, status: 'libre', order: [] }, ...parsed];
        }
        setTables(parsed);
      } catch (e) {
        setTables(defaultTables);
        localStorage.setItem('bakery_tables', JSON.stringify(defaultTables));
      }
    } else {
      setTables(defaultTables);
      localStorage.setItem('bakery_tables', JSON.stringify(defaultTables));
    }

    // 3. Cargar medios de pago desde MongoDB (colección metodopagos)
    fetch(PAYMENT_METHODS_API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPaymentMethods(data);
          setSelectedPaymentMethod(data[0].metodo_pago || 'Efectivo');
        } else {
          const defaults = [
            { _id: '1', metodo_pago: 'Efectivo' },
            { _id: '2', metodo_pago: 'Tarjeta crédito/débito' },
            { _id: '3', metodo_pago: 'Transferencia' },
            { _id: '4', metodo_pago: 'Bolsillo virtual' }
          ];
          setPaymentMethods(defaults);
          setSelectedPaymentMethod('Efectivo');
        }
      })
      .catch(err => {
        console.error('Error al cargar métodos de pago desde Mongo:', err);
        const defaults = [
          { _id: '1', metodo_pago: 'Efectivo' },
          { _id: '2', metodo_pago: 'Tarjeta crédito/débito' },
          { _id: '3', metodo_pago: 'Transferencia' },
          { _id: '4', metodo_pago: 'Bolsillo virtual' }
        ];
        setPaymentMethods(defaults);
        setSelectedPaymentMethod('Efectivo');
      });
  }, []);

  const selectedTable = tables.find(t => t.id === selectedTableId) || tables[0] || defaultTables[0];
  const isPasoActive = selectedTable?.id === 'paso' || selectedTable?.isPaso;

  const handleTableClick = (id) => {
    setSelectedTableId(id);
    setEditingPriceProductId(null);
  };

  const addProductToOrder = (product) => {
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
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

  // Modificar cantidad (+1 o -1)
  const updateItemQuantity = (productId, delta) => {
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        let orderAfterUpdate = [];
        
        for (const item of table.order) {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            
            if (delta > 0) {
              const currentStock = item.product.stock || 0;
              if (nextQty > currentStock) {
                alert(`¡Stock insuficiente para ${item.product.name}! Stock disponible: ${currentStock}`);
                orderAfterUpdate.push(item);
                continue;
              }
            }

            if (nextQty > 0) {
              orderAfterUpdate.push({ ...item, quantity: nextQty });
            }
          } else {
            orderAfterUpdate.push(item);
          }
        }

        return {
          ...table,
          status: orderAfterUpdate.length === 0 ? 'libre' : 'ocupada',
          order: orderAfterUpdate
        };
      }
      return table;
    });

    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));
  };

  // Modificar precio de venta unitario
  const handleStartEditPrice = (item) => {
    setEditingPriceProductId(item.product.id);
    setTempPriceValue(item.price.toString());
  };

  const handleSavePrice = (productId) => {
    const parsedPrice = parseFloat(tempPriceValue);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert('Por favor ingresa un precio válido mayor o igual a 0');
      return;
    }

    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        const newOrder = table.order.map(item => {
          if (item.product.id === productId) {
            return { ...item, price: parsedPrice };
          }
          return item;
        });

        return {
          ...table,
          order: newOrder
        };
      }
      return table;
    });

    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));
    setEditingPriceProductId(null);
  };

  const handleCancelEditPrice = () => {
    setEditingPriceProductId(null);
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
    if (editingPriceProductId === productId) {
      setEditingPriceProductId(null);
    }
  };

  // Cálculos de ticket: SIN IMPUESTO (valor neto con punto de mil)
  const totalNeto = selectedTable?.order.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const totalItemsCount = selectedTable?.order.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Obtener número consecutivo de recibo (independiente del ID de venta)
  const fetchNextReceiptNumber = async () => {
    let nextNum = 1;
    try {
      const res = await fetch(`${SALES_API_URL}/next-receipt-number`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.nextReceiptNumber === 'number') {
          nextNum = data.nextReceiptNumber;
        }
      }
    } catch (e) {
      console.warn('Fallback al contador local:', e);
    }
    const localCounter = parseInt(localStorage.getItem('bakery_receipt_counter') || '0', 10);
    const finalNum = Math.max(nextNum, localCounter + 1);
    return finalNum;
  };

  // Formato de fecha y hora actual en tiempo real para impresión
  const getFormattedCurrentDateTime = () => {
    const now = new Date();
    const fechaTexto = now.toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const horaTexto = now.toLocaleTimeString('es-CO', {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return `${fechaTexto}, ${horaTexto}`;
  };

  // Abrir Modal de Impresión
  const handleOpenPrintModal = async (customSaleData = null) => {
    // Si viene desde una venta ya finalizada
    if (customSaleData) {
      setPrintReceiptData(customSaleData);
      setPrintReceiptNumber(String(customSaleData.numero_recibo || 1).padStart(4, '0'));
      setPrintClientName(customSaleData.cliente_nombre || 'Cliente General');
      setPrintClientNit(customSaleData.cliente_nit || 'Consumidor Final');
      setIsPrintModalOpen(true);
      return;
    }

    // Si viene desde el recibo activo actual
    if (!selectedTable || selectedTable.order.length === 0) {
      alert('No hay productos en el recibo para imprimir.');
      return;
    }

    const nextNum = await fetchNextReceiptNumber();
    const formattedNum = String(nextNum).padStart(4, '0');
    setPrintReceiptNumber(formattedNum);
    setPrintClientName('Cliente General');
    setPrintClientNit('Consumidor Final');

    const currentDateTime = getFormattedCurrentDateTime();
    const mesaName = isPasoActive ? 'Cliente de Paso' : `Mesa ${selectedTableId}`;

    setPrintReceiptData({
      numero_recibo: nextNum,
      numero_recibo_formato: formattedNum,
      fecha_hora_impresion: currentDateTime,
      mesa: mesaName,
      items: selectedTable.order,
      total: totalNeto,
      metodo: selectedPaymentMethod,
      cliente_nombre: 'Cliente General',
      cliente_nit: 'Consumidor Final'
    });

    setIsPrintModalOpen(true);
  };

  // Confirmar y Ejecutar Impresión (window.print)
  const handleConfirmPrint = () => {
    const currentDateTime = getFormattedCurrentDateTime();
    const currentNumInt = parseInt(printReceiptNumber, 10) || 1;

    // Actualizar datos del recibo listos para imprimir
    const finalReceipt = {
      ...(printReceiptData || {}),
      numero_recibo: currentNumInt,
      numero_recibo_formato: String(currentNumInt).padStart(4, '0'),
      fecha_hora_impresion: currentDateTime,
      cliente_nombre: printClientName.trim() || 'Cliente General',
      cliente_nit: printClientNit.trim() || 'Consumidor Final',
      items: printReceiptData?.items || selectedTable.order,
      total: printReceiptData?.total !== undefined ? printReceiptData.total : totalNeto,
      metodo: printReceiptData?.metodo || selectedPaymentMethod,
      mesa: printReceiptData?.mesa || (isPasoActive ? 'Cliente de Paso' : `Mesa ${selectedTableId}`)
    };

    setPrintReceiptData(finalReceipt);

    // Incrementar y guardar en localStorage para mantener el serial consecutivo
    localStorage.setItem('bakery_receipt_counter', currentNumInt.toString());

    // Ejecutar impresión
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Manejo del clic en "Cobrar Recibo"
  const handleCheckoutClick = () => {
    if (!selectedTable || selectedTable.order.length === 0) return;

    const methodLower = selectedPaymentMethod.toLowerCase();

    // 1. Efectivo -> Modal de vueltas
    if (methodLower.includes('efectivo')) {
      setCashAmountGiven(totalNeto.toString());
      setIsCashModalOpen(true);
    } 
    // 2. Transferencia O Bolsillo Virtual -> Modal de Nequi / Daviplata
    else if (methodLower.includes('transferencia') || methodLower.includes('bolsillo')) {
      setTransferType('Nequi');
      setTransferVoucher('');
      setIsTransferModalOpen(true);
    } 
    // 3. Otros medios (Tarjeta, etc.) -> Cobro directo
    else {
      processSale({
        metodo_pago_nombre: selectedPaymentMethod,
        monto_recibido: totalNeto,
        vueltas: 0
      });
    }
  };

  // Ejecutar venta y persistir en MongoDB y Backend con fecha y hora real
  const processSale = async (paymentDetails) => {
    if (!selectedTable || selectedTable.order.length === 0) return;

    const nextReciboNum = await fetchNextReceiptNumber();
    const formattedRecibo = String(nextReciboNum).padStart(4, '0');

    const now = new Date();
    const fechaTexto = now.toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const horaTexto = now.toLocaleTimeString('es-CO', {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const fechaHoraLocal = `${fechaTexto} ${horaTexto}`;

    const mesaName = isPasoActive ? 'Cliente de Paso' : `Mesa ${selectedTableId}`;
    const salePayload = {
      numero_recibo: nextReciboNum,
      cliente_nombre: printClientName.trim() || 'Cliente General',
      cliente_nit: printClientNit.trim() || 'Consumidor Final',
      fecha_hora: now.toISOString(),
      fecha_texto: fechaTexto,
      hora_texto: horaTexto,
      fecha_hora_local: fechaHoraLocal,
      tipo_venta: isPasoActive ? 'de_paso' : 'mesa',
      mesa: mesaName,
      metodo_pago_nombre: paymentDetails.metodo_pago_nombre || selectedPaymentMethod || 'Efectivo',
      tipo_transferencia: paymentDetails.tipo_transferencia || null,
      comprobante_transferencia: paymentDetails.comprobante_transferencia || null,
      monto_recibido: Number(paymentDetails.monto_recibido || totalNeto),
      vueltas: Number(paymentDetails.vueltas || 0),
      items: selectedTable.order,
      total_venta: totalNeto
    };

    try {
      // 1. Enviar venta a MongoDB (colección ventas con hora y fecha real)
      const res = await fetch(SALES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salePayload)
      });
      const data = await res.json();
      console.log('Venta guardada en Mongo:', data);
      if (data && data.numero_recibo) {
        localStorage.setItem('bakery_receipt_counter', data.numero_recibo.toString());
      }
    } catch (err) {
      console.error('Error al guardar venta en Mongo:', err);
      localStorage.setItem('bakery_receipt_counter', nextReciboNum.toString());
    }

    // 2. Guardar en Historial local
    const localSaleRecord = {
      id: Date.now(),
      ...salePayload
    };
    const existingSales = JSON.parse(localStorage.getItem('bakery_sales_history') || '[]');
    localStorage.setItem('bakery_sales_history', JSON.stringify([...existingSales, localSaleRecord]));

    // 3. Actualizar inventario local
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const itemSold = selectedTable.order.find(it => it.product.id === prod.id);
        if (itemSold) {
          const newStock = Math.max(0, (prod.stock || 0) - itemSold.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });
    });

    // 4. Liberar mesa o limpiar cliente de paso
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        return { ...table, status: 'libre', order: [] };
      }
      return table;
    });
    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));

    // Cerrar modales
    setIsCashModalOpen(false);
    setIsTransferModalOpen(false);
    setEditingPriceProductId(null);

    // Guardar recibo generado para poder imprimirlo inmediatamente
    const successData = {
      numero_recibo: nextReciboNum,
      numero_recibo_formato: formattedRecibo,
      mesa: mesaName,
      total: totalNeto,
      metodo: salePayload.metodo_pago_nombre,
      tipo_transferencia: salePayload.tipo_transferencia,
      monto_recibido: salePayload.monto_recibido,
      vueltas: salePayload.vueltas,
      fecha_hora_local: fechaHoraLocal,
      fecha_hora_impresion: fechaHoraLocal,
      cliente_nombre: salePayload.cliente_nombre,
      cliente_nit: salePayload.cliente_nit,
      items: salePayload.items
    };

    setPrintReceiptData(successData);
    setSuccessReceipt(successData);
  };

  const cancelOrder = () => {
    const label = isPasoActive ? "la orden del cliente de paso" : `la orden de la Mesa ${selectedTableId}`;
    if (!window.confirm(`¿Seguro que deseas cancelar ${label}?`)) return;
    
    const updatedTables = tables.map(table => {
      if (table.id === selectedTableId) {
        return { ...table, status: 'libre', order: [] };
      }
      return table;
    });
    setTables(updatedTables);
    localStorage.setItem('bakery_tables', JSON.stringify(updatedTables));
    setEditingPriceProductId(null);
  };

  // Cálculo de vueltas en tiempo real para modal de Efectivo
  const numericCashGiven = parseFloat(cashAmountGiven) || 0;
  const cashChange = numericCashGiven - totalNeto;
  const isCashSufficient = cashChange >= 0;

  // Sugerencias de montos de billetes colombianos con punto de mil
  const getCashSuggestions = (total) => {
    const suggestions = [total];
    const denominations = [5000, 10000, 20000, 50000, 100000];
    denominations.forEach(den => {
      if (den > total && !suggestions.includes(den)) {
        suggestions.push(den);
      }
    });
    if (total > 100000) {
      const next50 = Math.ceil(total / 50000) * 50000;
      if (!suggestions.includes(next50)) suggestions.push(next50);
    }
    return suggestions.slice(0, 4);
  };

  const isBolsilloActive = selectedPaymentMethod.toLowerCase().includes('bolsillo');

  // Datos para renderizar el recibo activo (preview e impresión)
  const activeReceiptItems = printReceiptData?.items || selectedTable?.order || [];
  const activeReceiptTotal = printReceiptData?.total !== undefined ? printReceiptData.total : totalNeto;
  const activeReceiptMesa = printReceiptData?.mesa || (isPasoActive ? 'Cliente de Paso' : `Mesa ${selectedTableId}`);
  const activeReceiptMethod = printReceiptData?.metodo || selectedPaymentMethod;
  const activeReceiptDate = printReceiptData?.fecha_hora_impresion || getFormattedCurrentDateTime();

  return (
    <div className="page-container pos-layout">
      
      {/* Panel Izquierdo: Cliente de Paso + Mesas + Catálogo */}
      <div className="pos-left">
        <div className="tables-header">
          <h2>Atención & Mesas</h2>
        </div>

        {/* Barra superior de mesas incluyendo Cliente de Paso */}
        <div className="tables-container">
          {/* Botón especial: Cliente de Paso */}
          <button 
            className={`table-btn paso-btn ${selectedTableId === 'paso' ? 'selected' : ''} ${tables.find(t => t.id === 'paso')?.order.length > 0 ? 'ocupada' : 'libre'}`}
            onClick={() => handleTableClick('paso')}
          >
            <div className="paso-icon-title">
              <span className="paso-emoji">🚶</span>
              <span>De Paso</span>
            </div>
            <span className="paso-badge">
              {tables.find(t => t.id === 'paso')?.order.length > 0 ? 'Con Pedido' : 'Mostrador'}
            </span>
          </button>

          {/* Mesas de Salón (1..5) */}
          {tables.filter(t => t.id !== 'paso' && !t.isPaso).map(table => (
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
          <h2>Catálogo ({isPasoActive ? 'Cliente de Paso' : `Mesa ${selectedTableId}`})</h2>
        </div>
        <div className="products-grid">
          {products.filter(p => p.price1).map(product => (
            <button 
              key={product.id || product._id} 
              className="product-card"
              onClick={() => addProductToOrder(product)}
            >
              <div className="p-name">{product.name}</div>
              <div className="p-price">{formatPrice(product.price1)}</div>
              <div className="p-stock">Stock: {product.stock || 0}</div>
            </button>
          ))}
          {products.length === 0 && <p style={{ gridColumn: '1 / -1' }}>No hay productos con precio configurado.</p>}
        </div>
      </div>

      {/* Panel Derecho: Recibo de Venta */}
      <div className="pos-right receipt-panel">
        <div className="ticket-header receipt-header">
          <div className="receipt-title-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h3>Recibo de Venta</h3>
          </div>
          
          <span className={`table-badge-indicator ${isPasoActive ? 'paso-indicator' : ''}`}>
            {isPasoActive ? '🚶 CLIENTE DE PASO (MOSTRADOR)' : `MESA ${selectedTableId} • ${selectedTable?.status.toUpperCase()}`}
          </span>
        </div>
        
        <div className="ticket-items">
          {selectedTable?.order.length === 0 ? (
            <div className="empty-cart-container">
              <div className="empty-cart-icon">🛒</div>
              <p className="empty-cart">
                {isPasoActive 
                  ? 'No hay productos seleccionados. Agrega del catálogo para atender al cliente de paso.'
                  : 'La mesa está libre. Selecciona productos del catálogo para abrir el recibo.'}
              </p>
            </div>
          ) : (
            selectedTable?.order.map((item, idx) => (
              <div key={idx} className="ticket-item receipt-item-card">
                <div className="item-main-row">
                  {/* Controles de Cantidad (+ / -) */}
                  <div className="qty-controls">
                    <button 
                      className="qty-btn dec-btn" 
                      title="Disminuir cantidad"
                      onClick={() => updateItemQuantity(item.product.id || item.product._id, -1)}
                    >
                      −
                    </button>
                    <span className="item-qty-badge">{item.quantity}</span>
                    <button 
                      className="qty-btn inc-btn" 
                      title="Aumentar cantidad"
                      onClick={() => updateItemQuantity(item.product.id || item.product._id, 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Nombre y precio unitario editable */}
                  <div className="item-details">
                    <div className="item-name">{item.product.name}</div>
                    <div className="item-unit-price-container">
                      {editingPriceProductId === (item.product.id || item.product._id) ? (
                        <div className="price-edit-form">
                          <span className="price-prefix">$</span>
                          <input 
                            type="number"
                            step="any"
                            min="0"
                            className="price-edit-input"
                            value={tempPriceValue}
                            onChange={(e) => setTempPriceValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSavePrice(item.product.id || item.product._id);
                              if (e.key === 'Escape') handleCancelEditPrice();
                            }}
                            autoFocus
                          />
                          <button 
                            className="price-save-btn" 
                            title="Guardar precio"
                            onClick={() => handleSavePrice(item.product.id || item.product._id)}
                          >
                            ✓
                          </button>
                          <button 
                            className="price-cancel-btn" 
                            title="Cancelar"
                            onClick={handleCancelEditPrice}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="unit-price-badge" 
                          title="Clic para editar precio de venta"
                          onClick={() => handleStartEditPrice(item)}
                        >
                          <span>Unitario: {formatPrice(item.price)}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="edit-icon">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subtotal neto del producto con punto de mil y botón eliminar */}
                  <div className="item-subtotal-actions">
                    <span className="item-row-total">{formatPrice(item.price * item.quantity)}</span>
                    <button 
                      className="remove-btn" 
                      title="Eliminar producto"
                      onClick={() => removeItem(item.product.id || item.product._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sección de Selección de Medio de Pago */}
        <div className="payment-method-section">
          <label className="payment-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Medio de Pago:
          </label>
          <div className="payment-options-grid">
            {paymentMethods.map(method => {
              const name = method.metodo_pago;
              const isSelected = selectedPaymentMethod === name;
              return (
                <button
                  key={method._id || name}
                  type="button"
                  className={`payment-method-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPaymentMethod(name)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumen del Recibo: EXCLUSIVAMENTE VALOR NETO con punto de mil */}
        <div className="ticket-summary receipt-summary-card">
          <div className="summary-row">
            <span>Total Artículos</span>
            <span>{totalItemsCount} unds</span>
          </div>
          <div className="summary-row total">
            <span>Total a Pagar (Neto)</span>
            <span>{formatPrice(totalNeto)}</span>
          </div>
        </div>

        {/* Botones de Acción: Cancelar, Imprimir Recibo y Cobrar Recibo */}
        <div className="ticket-actions receipt-actions">
          <button 
            className="btn-cancel-receipt" 
            disabled={selectedTable?.order.length === 0}
            onClick={cancelOrder}
            title="Cancelar y vaciar la orden actual"
          >
            Cancelar
          </button>
          <button 
            className="btn-print-receipt"
            disabled={selectedTable?.order.length === 0}
            onClick={() => handleOpenPrintModal()}
            title="Ingresar cliente y dar orden de imprimir recibo"
          >
            <span className="print-btn-icon">🖨️</span>
            <span>Imprimir Recibo</span>
          </button>
          <button 
            className="btn-checkout-receipt" 
            disabled={selectedTable?.order.length === 0}
            onClick={handleCheckoutClick}
            title="Proceder al cobro del pedido"
          >
            Cobrar Recibo
          </button>
        </div>
      </div>

      {/* ===================================================
          MODAL 1: COBRO EN EFECTIVO Y CÁLCULO DE VUELTAS
          =================================================== */}
      {isCashModalOpen && (
        <div className="modal-backdrop-sales" onClick={() => setIsCashModalOpen(false)}>
          <div className="modal-content-sales cash-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-sales-header">
              <div className="modal-sales-title">
                <span className="modal-sales-icon">💵</span>
                <h3>Cobro en Efectivo</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsCashModalOpen(false)}>✕</button>
            </div>

            <div className="modal-sales-body">
              <div className="cash-summary-banner">
                <span className="cash-summary-label">Total a Pagar</span>
                <span className="cash-summary-amount">{formatPrice(totalNeto)}</span>
              </div>

              <div className="cash-input-group">
                <label>¿Con cuánto efectivo paga el cliente?</label>
                <div className="cash-input-wrapper">
                  <span className="cash-currency-symbol">$</span>
                  <input 
                    type="number"
                    step="any"
                    className="cash-input-field"
                    placeholder="0"
                    value={cashAmountGiven}
                    onChange={e => setCashAmountGiven(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {/* Sugerencias Rápidas de Billetes con punto de mil */}
              <div className="cash-suggestions-row">
                <span className="suggestions-label">Sugerencias:</span>
                <div className="suggestions-buttons">
                  {getCashSuggestions(totalNeto).map((sug, i) => (
                    <button 
                      key={i}
                      type="button"
                      className="cash-sug-btn"
                      onClick={() => setCashAmountGiven(sug.toString())}
                    >
                      {sug === totalNeto ? 'Exacto' : formatPrice(sug)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resultado de Vueltas / Faltante con punto de mil */}
              <div className={`cash-change-box ${isCashSufficient ? 'success' : 'danger'}`}>
                {isCashSufficient ? (
                  <>
                    <div className="change-title">Vueltas / Cambio a Entregar:</div>
                    <div className="change-amount">{formatPrice(cashChange)}</div>
                  </>
                ) : (
                  <>
                    <div className="change-title alert">Efectivo insuficiente:</div>
                    <div className="change-amount alert">Faltan {formatPrice(Math.abs(cashChange))}</div>
                  </>
                )}
              </div>
            </div>

            <div className="modal-sales-footer">
              <button 
                className="modal-btn-cancel" 
                onClick={() => setIsCashModalOpen(false)}
              >
                Volver
              </button>
              <button 
                className="modal-btn-confirm cash-confirm-btn"
                disabled={!isCashSufficient}
                onClick={() => processSale({
                  metodo_pago_nombre: 'Efectivo',
                  monto_recibido: numericCashGiven,
                  vueltas: cashChange
                })}
              >
                Confirmar Cobro ({formatPrice(totalNeto)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL 2: TRANSFERENCIA / BOLSILLO VIRTUAL (NEQUI / DAVIPLATA)
          =================================================== */}
      {isTransferModalOpen && (
        <div className="modal-backdrop-sales" onClick={() => setIsTransferModalOpen(false)}>
          <div className="modal-content-sales transfer-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-sales-header">
              <div className="modal-sales-title">
                <span className="modal-sales-icon">{isBolsilloActive ? '👛' : '📲'}</span>
                <h3>{isBolsilloActive ? 'Pago con Bolsillo Virtual' : 'Pago por Transferencia'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsTransferModalOpen(false)}>✕</button>
            </div>

            <div className="modal-sales-body">
              <div className="transfer-summary-banner">
                <span className="transfer-summary-label">Total a Pagar</span>
                <span className="transfer-summary-amount">{formatPrice(totalNeto)}</span>
              </div>

              <div className="transfer-selector-group">
                <label className="transfer-selector-label">
                  {isBolsilloActive 
                    ? 'Selecciona la billetera o bolsillo virtual:' 
                    : 'Selecciona el tipo de transferencia:'}
                </label>
                <div className="transfer-options-container">
                  {/* Opción Nequi */}
                  <button 
                    type="button"
                    className={`transfer-card-option nequi ${transferType === 'Nequi' ? 'selected' : ''}`}
                    onClick={() => setTransferType('Nequi')}
                  >
                    <div className="transfer-card-badge">🟣 Nequi</div>
                    <div className="transfer-card-desc">Transferencia / Billetera Nequi</div>
                  </button>

                  {/* Opción Daviplata */}
                  <button 
                    type="button"
                    className={`transfer-card-option daviplata ${transferType === 'Daviplata' ? 'selected' : ''}`}
                    onClick={() => setTransferType('Daviplata')}
                  >
                    <div className="transfer-card-badge">🔴 Daviplata</div>
                    <div className="transfer-card-desc">Transferencia / Billetera Daviplata</div>
                  </button>
                </div>
              </div>

              <div className="transfer-voucher-input-group">
                <label>N° Comprobante / Referencia (Opcional):</label>
                <input 
                  type="text"
                  className="transfer-voucher-field"
                  placeholder="Ej: M12345678"
                  value={transferVoucher}
                  onChange={e => setTransferVoucher(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-sales-footer">
              <button 
                className="modal-btn-cancel" 
                onClick={() => setIsTransferModalOpen(false)}
              >
                Volver
              </button>
              <button 
                className="modal-btn-confirm transfer-confirm-btn"
                onClick={() => processSale({
                  metodo_pago_nombre: selectedPaymentMethod,
                  tipo_transferencia: transferType,
                  comprobante_transferencia: transferVoucher
                })}
              >
                Confirmar Pago con {transferType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL 3: RECIBO DE CONFIRMACIÓN / ÉXITO CON FECHA Y HORA REAL
          =================================================== */}
      {successReceipt && (
        <div className="modal-backdrop-sales" onClick={() => setSuccessReceipt(null)}>
          <div className="modal-content-sales success-modal" onClick={e => e.stopPropagation()}>
            <div className="success-icon-badge">✅</div>
            <h3>¡Venta Registrada Exitosamente!</h3>
            <p className="success-subtitle">{successReceipt.mesa}</p>

            <div className="success-details-card">
              <div className="success-row">
                <span>Recibo N°:</span>
                <strong style={{ color: 'var(--primary-teal)', fontWeight: '800' }}>
                  #{String(successReceipt.numero_recibo || '0001').padStart(4, '0')}
                </strong>
              </div>
              <div className="success-row">
                <span>Fecha y Hora:</span>
                <strong style={{ color: '#2D3142' }}>{successReceipt.fecha_hora_local}</strong>
              </div>
              <div className="success-row">
                <span>Total Cobrado:</span>
                <strong style={{ color: 'var(--primary-teal)', fontSize: '1.1rem' }}>{formatPrice(successReceipt.total)}</strong>
              </div>
              <div className="success-row">
                <span>Medio de Pago:</span>
                <span>{successReceipt.metodo}</span>
              </div>
              {successReceipt.tipo_transferencia && (
                <div className="success-row highlight">
                  <span>Billetera / Tipo:</span>
                  <strong>{successReceipt.tipo_transferencia}</strong>
                </div>
              )}
              {successReceipt.vueltas > 0 && (
                <div className="success-row change-highlight">
                  <span>Vueltas Entregadas:</span>
                  <strong>{formatPrice(successReceipt.vueltas)}</strong>
                </div>
              )}
            </div>

            <div className="success-modal-actions">
              <button 
                className="success-print-btn"
                onClick={() => handleOpenPrintModal(successReceipt)}
              >
                🖨️ Imprimir Recibo de Venta
              </button>
              <button 
                className="success-close-btn"
                onClick={() => setSuccessReceipt(null)}
              >
                Aceptar y Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL 4: INGRESO DE CLIENTE & ORDEN DE IMPRESIÓN DEL RECIBO
          =================================================== */}
      {isPrintModalOpen && (
        <div className="modal-backdrop-sales" onClick={() => setIsPrintModalOpen(false)}>
          <div className="modal-content-sales print-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-sales-header">
              <div className="modal-sales-title">
                <span className="modal-sales-icon">🖨️</span>
                <h3>Imprimir Recibo de Venta</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsPrintModalOpen(false)}>✕</button>
            </div>

            <div className="modal-sales-body print-modal-layout">
              {/* Formulario de Datos del Cliente */}
              <div className="print-client-form-card">
                <div className="print-form-title">
                  <span className="title-icon">👤</span>
                  <h4>Datos para el Recibo</h4>
                </div>
                
                <div className="print-input-group">
                  <label htmlFor="client-name-input">Nombre del Cliente:</label>
                  <input 
                    id="client-name-input"
                    type="text"
                    className="print-input-field"
                    placeholder="Ej: Juan Pérez o Cliente General"
                    value={printClientName}
                    onChange={(e) => setPrintClientName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="print-input-group">
                  <label htmlFor="client-nit-input">NIT / C.C. del Cliente:</label>
                  <input 
                    id="client-nit-input"
                    type="text"
                    className="print-input-field"
                    placeholder="Ej: 1013110341 o 222222222222"
                    value={printClientNit}
                    onChange={(e) => setPrintClientNit(e.target.value)}
                  />
                </div>

                <div className="print-quick-tags">
                  <span className="quick-tags-label">Opciones rápidas:</span>
                  <div className="quick-tags-buttons">
                    <button 
                      type="button" 
                      className="quick-tag-btn"
                      onClick={() => { setPrintClientName('Cliente General'); setPrintClientNit('Consumidor Final'); }}
                    >
                      Consumidor Final
                    </button>
                    <button 
                      type="button" 
                      className="quick-tag-btn"
                      onClick={() => { setPrintClientName(''); setPrintClientNit(''); }}
                    >
                      Limpiar Campos
                    </button>
                  </div>
                </div>

                <div className="print-serial-badge">
                  <span>Serial Consecutivo:</span>
                  <strong>Recibo N° {printReceiptNumber}</strong>
                </div>
              </div>

              {/* Vista Previa Realista de la Tirilla de Venta */}
              <div className="print-ticket-preview-wrapper">
                <div className="print-preview-label">Vista Previa de Tirilla (80mm):</div>
                <div className="thermal-ticket-paper">
                  {/* Encabezado requerido */}
                  <div className="ticket-center-header">
                    <div className="ticket-business-name">Tuttis Bakery Cofee</div>
                    <div className="ticket-business-info">NIT: 1013110341-7</div>
                    <div className="ticket-business-info">Calle 75a #64-74</div>
                    <div className="ticket-business-info">Contacto: 3025682859</div>
                  </div>

                  <div className="ticket-dashed-separator"></div>

                  {/* Metadatos del Recibo */}
                  <div className="ticket-meta-info">
                    <div className="ticket-meta-row">
                      <span className="meta-k">Fecha:</span>
                      <span className="meta-v">{activeReceiptDate}</span>
                    </div>
                    <div className="ticket-meta-row">
                      <span className="meta-k">Recibo N°:</span>
                      <span className="meta-v serial-highlight">{printReceiptNumber}</span>
                    </div>
                    <div className="ticket-meta-row">
                      <span className="meta-k">Atención:</span>
                      <span className="meta-v">{activeReceiptMesa}</span>
                    </div>
                    <div className="ticket-meta-row">
                      <span className="meta-k">Cliente:</span>
                      <span className="meta-v">{printClientName.trim() || 'Cliente General'}</span>
                    </div>
                    <div className="ticket-meta-row">
                      <span className="meta-k">NIT:</span>
                      <span className="meta-v">{printClientNit.trim() || 'Consumidor Final'}</span>
                    </div>
                  </div>

                  <div className="ticket-dashed-separator"></div>

                  {/* Listado de Productos: Cantidad, Descripción, Valor Unitario y Total */}
                  <div className="ticket-products-table">
                    <div className="ticket-table-head">
                      <span className="th-qty">Cant.</span>
                      <span className="th-desc">Descripción Producto</span>
                      <span className="th-unit">P.Unit</span>
                      <span className="th-total">Total</span>
                    </div>
                    <div className="ticket-dashed-separator thin"></div>
                    <div className="ticket-table-body">
                      {activeReceiptItems.map((item, idx) => {
                        const unitVal = item.price || item.valor_unitario || 0;
                        const lineTotal = unitVal * item.quantity;
                        const pName = item.product?.name || item.nombre || 'Producto';
                        return (
                          <div key={idx} className="ticket-table-row">
                            <span className="td-qty">{item.quantity}</span>
                            <span className="td-desc">{pName}</span>
                            <span className="td-unit">{formatPrice(unitVal)}</span>
                            <span className="td-total">{formatPrice(lineTotal)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="ticket-dashed-separator"></div>

                  {/* Total Venta */}
                  <div className="ticket-totals-section">
                    <div className="ticket-total-main-row">
                      <span>Total venta:</span>
                      <span className="ticket-total-value">{formatPrice(activeReceiptTotal)}</span>
                    </div>
                    <div className="ticket-payment-method-row">
                      <span>Medio de Pago:</span>
                      <span>{activeReceiptMethod}</span>
                    </div>
                    {printReceiptData?.vueltas > 0 && (
                      <div className="ticket-payment-method-row">
                        <span>Vueltas:</span>
                        <span>{formatPrice(printReceiptData.vueltas)}</span>
                      </div>
                    )}
                  </div>

                  <div className="ticket-dashed-separator"></div>

                  {/* Pie de página del recibo */}
                  <div className="ticket-footer-text">
                    <div>*** ¡Gracias por su compra! ***</div>
                    <div>Esperamos verle pronto de nuevo</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-sales-footer">
              <button 
                className="modal-btn-cancel" 
                onClick={() => setIsPrintModalOpen(false)}
              >
                Cerrar
              </button>
              <button 
                className="modal-btn-confirm print-confirm-btn"
                onClick={handleConfirmPrint}
              >
                <span className="print-confirm-icon">🖨️</span>
                Confirmar e Imprimir Recibo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          CONTENEDOR EXCLUSIVO PARA IMPRESIÓN (@media print)
          =================================================== */}
      <div id="printable-receipt" className="printable-receipt-area">
        <div className="printable-ticket-content">
          <div className="ticket-center-header">
            <div className="ticket-business-name">Tuttis Bakery Cofee</div>
            <div className="ticket-business-info">NIT: 1013110341-7</div>
            <div className="ticket-business-info">Calle 75a #64-74</div>
            <div className="ticket-business-info">Contacto: 3025682859</div>
          </div>

          <div className="ticket-dashed-separator"></div>

          <div className="ticket-meta-info">
            <div className="ticket-meta-row">
              <span className="meta-k">Fecha:</span>
              <span className="meta-v">{activeReceiptDate}</span>
            </div>
            <div className="ticket-meta-row">
              <span className="meta-k">Recibo N°:</span>
              <span className="meta-v serial-highlight">{printReceiptNumber}</span>
            </div>
            <div className="ticket-meta-row">
              <span className="meta-k">Atención:</span>
              <span className="meta-v">{activeReceiptMesa}</span>
            </div>
            <div className="ticket-meta-row">
              <span className="meta-k">Cliente:</span>
              <span className="meta-v">{printClientName.trim() || 'Cliente General'}</span>
            </div>
            <div className="ticket-meta-row">
              <span className="meta-k">NIT:</span>
              <span className="meta-v">{printClientNit.trim() || 'Consumidor Final'}</span>
            </div>
          </div>

          <div className="ticket-dashed-separator"></div>

          <div className="ticket-products-table">
            <div className="ticket-table-head">
              <span className="th-qty">Cant.</span>
              <span className="th-desc">Descripción Producto</span>
              <span className="th-unit">P.Unit</span>
              <span className="th-total">Total</span>
            </div>
            <div className="ticket-dashed-separator thin"></div>
            <div className="ticket-table-body">
              {activeReceiptItems.map((item, idx) => {
                const unitVal = item.price || item.valor_unitario || 0;
                const lineTotal = unitVal * item.quantity;
                const pName = item.product?.name || item.nombre || 'Producto';
                return (
                  <div key={idx} className="ticket-table-row">
                    <span className="td-qty">{item.quantity}</span>
                    <span className="td-desc">{pName}</span>
                    <span className="td-unit">{formatPrice(unitVal)}</span>
                    <span className="td-total">{formatPrice(lineTotal)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ticket-dashed-separator"></div>

          <div className="ticket-totals-section">
            <div className="ticket-total-main-row">
              <span>Total venta:</span>
              <span className="ticket-total-value">{formatPrice(activeReceiptTotal)}</span>
            </div>
            <div className="ticket-payment-method-row">
              <span>Medio de Pago:</span>
              <span>{activeReceiptMethod}</span>
            </div>
            {printReceiptData?.vueltas > 0 && (
              <div className="ticket-payment-method-row">
                <span>Vueltas:</span>
                <span>{formatPrice(printReceiptData.vueltas)}</span>
              </div>
            )}
          </div>

          <div className="ticket-dashed-separator"></div>

          <div className="ticket-footer-text">
            <div>*** ¡Gracias por su compra! ***</div>
            <div>Esperamos verle pronto de nuevo</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sales;
