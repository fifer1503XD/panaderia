const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Venta = require('../models/venta');
const Producto = require('../models/productos');
const Empleado = require('../models/empleados');
const Inventario = require('../models/inventario');

// Helper para parsear fechas de filtro considerando la zona horaria de Colombia (UTC-5)
function parseDateRange(startDateStr, endDateStr) {
  let dateQuery = {};

  const parseDayStart = (str) => {
    if (!str) return null;
    const parts = str.split('-').map(Number);
    if (parts.length === 3) {
      // 00:00:00 hora local en Colombia (UTC-5) -> 05:00:00 UTC del mismo día
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 5, 0, 0, 0));
    }
    const d = new Date(str);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const parseDayEnd = (str) => {
    if (!str) return null;
    const parts = str.split('-').map(Number);
    if (parts.length === 3) {
      // 23:59:59.999 hora local en Colombia (UTC-5) -> 04:59:59.999 UTC del día siguiente
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + 1, 4, 59, 59, 999));
    }
    const d = new Date(str);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const start = parseDayStart(startDateStr);
  const end = parseDayEnd(endDateStr);

  const orConditions = [];

  if (start && end) {
    orConditions.push({ fecha_hora: { $gte: start, $lte: end } });
    orConditions.push({ createdAt: { $gte: start, $lte: end } });
  } else if (start) {
    orConditions.push({ fecha_hora: { $gte: start } });
    orConditions.push({ createdAt: { $gte: start } });
  } else if (end) {
    orConditions.push({ fecha_hora: { $lte: end } });
    orConditions.push({ createdAt: { $lte: end } });
  }

  // Si startDate y endDate corresponden al mismo día, incluir coincidencia directa con fecha_texto
  if (startDateStr && endDateStr && startDateStr === endDateStr) {
    const parts = startDateStr.split('-');
    if (parts.length === 3) {
      const dd = parts[2].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      const yyyy = parts[0];
      orConditions.push({ fecha_texto: `${dd}/${mm}/${yyyy}` });
    }
  }

  if (orConditions.length > 0) {
    dateQuery = { $or: orConditions };
  }

  return dateQuery;
}

// 1. ENDPOINT PRINCIPAL: Analíticas Consolidadas de Ventas y Rendimiento
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, paymentMethod, channel } = req.query;

    // Construcción de filtros dinámicos
    const queryConditions = [];

    // Filtro por fecha
    const dateQuery = parseDateRange(startDate, endDate);
    if (Object.keys(dateQuery).length > 0) {
      queryConditions.push(dateQuery);
    }

    // Filtro por método de pago
    if (paymentMethod && paymentMethod !== 'ALL') {
      queryConditions.push({
        metodo_pago_nombre: new RegExp(`^${paymentMethod.trim()}$`, 'i')
      });
    }

    // Filtro por canal (mesa o de_paso)
    if (channel && channel !== 'ALL') {
      queryConditions.push({ tipo_venta: channel });
    }

    const finalQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};

    // Obtener todas las ventas coincidentes ordenadas por fecha ascendente
    const ventas = await Venta.find(finalQuery)
      .populate('id_empleado', 'nombre_empleado cargo turno')
      .sort({ fecha_hora: 1, createdAt: 1 })
      .lean();

    // Obtener catálogo de productos para cálculo de costos y baja rotación
    const productos = await Producto.find().lean();
    const productMap = new Map();
    productos.forEach(p => {
      productMap.set(p._id.toString(), p);
      if (p.code) productMap.set(p.code, p);
    });

    // Catálogo de empleados para asociar ventas sin asignar
    const empleados = await Empleado.find().lean();
    const employeeMap = new Map();
    empleados.forEach(e => {
      employeeMap.set(e._id.toString(), e);
    });

    // Variables de acumulación
    let totalRevenue = 0;
    let totalItemsSold = 0;
    let totalCostEstimate = 0;

    // Variables de Cierre de Caja
    let totalCashReceived = 0;
    let totalCashChange = 0;
    let netCash = 0;
    let cashSalesTotal = 0;
    let transferSalesTotal = 0;
    let cardSalesTotal = 0;
    let virtualWalletTotal = 0;

    const paymentMethodStats = {};
    const transfersDetail = [];
    let firstReceipt = null;
    let lastReceipt = null;

    // Variables de Canales y Mesas
    let mesaSalesTotal = 0;
    let dePasoSalesTotal = 0;
    let mesaSalesCount = 0;
    let dePasoSalesCount = 0;
    const tableStats = {};

    // Variables de Horas Pico (0 a 23)
    const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${String(i).padStart(2, '0')}:00`,
      displayLabel: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
      count: 0,
      total: 0
    }));

    // Variables de Línea de Tiempo (por día)
    const dailyStatsMap = new Map();

    // Variables de Productos y Categorías
    const productSalesMap = new Map();
    const categorySalesMap = new Map();

    // Variables de Rendimiento por Empleado
    const employeeSalesMap = new Map();

    ventas.forEach(v => {
      const saleTotal = Number(v.total_venta || 0);
      totalRevenue += saleTotal;

      // Numeración de recibos
      if (typeof v.numero_recibo === 'number') {
        if (firstReceipt === null || v.numero_recibo < firstReceipt) firstReceipt = v.numero_recibo;
        if (lastReceipt === null || v.numero_recibo > lastReceipt) lastReceipt = v.numero_recibo;
      }

      // 1. Métodos de Pago y Cierre de Caja
      const pmName = v.metodo_pago_nombre || 'Efectivo';
      if (!paymentMethodStats[pmName]) {
        paymentMethodStats[pmName] = { count: 0, total: 0 };
      }
      paymentMethodStats[pmName].count += 1;
      paymentMethodStats[pmName].total += saleTotal;

      const isEfectivo = pmName.toLowerCase().includes('efectivo');
      const isTransferencia = pmName.toLowerCase().includes('transferencia');
      const isTarjeta = pmName.toLowerCase().includes('tarjeta');
      const isBolsillo = pmName.toLowerCase().includes('bolsillo');

      if (isEfectivo) {
        cashSalesTotal += saleTotal;
        const recibido = Number(v.monto_recibido || saleTotal);
        const vueltas = Number(v.vueltas || (recibido > saleTotal ? recibido - saleTotal : 0));
        totalCashReceived += recibido;
        totalCashChange += vueltas;
        netCash += (recibido - vueltas);
      } else if (isTransferencia) {
        transferSalesTotal += saleTotal;
        transfersDetail.push({
          recibo: v.numero_recibo || 'S/N',
          fecha: v.fecha_hora_local || v.fecha_texto || new Date(v.fecha_hora || v.createdAt).toLocaleString('es-CO'),
          cliente: v.cliente_nombre || 'Cliente General',
          tipo: v.tipo_transferencia || 'Transferencia',
          comprobante: v.comprobante_transferencia || 'Sin soporte',
          monto: saleTotal
        });
      } else if (isTarjeta) {
        cardSalesTotal += saleTotal;
      } else if (isBolsillo) {
        virtualWalletTotal += saleTotal;
      }

      // 2. Canales (Mesa vs De Paso)
      const isMesa = v.tipo_venta === 'mesa';
      if (isMesa) {
        mesaSalesTotal += saleTotal;
        mesaSalesCount += 1;
        const tableName = v.mesa && v.mesa.trim() !== '' ? v.mesa.trim() : 'Mesa sin especificar';
        if (!tableStats[tableName]) {
          tableStats[tableName] = { name: tableName, count: 0, total: 0 };
        }
        tableStats[tableName].count += 1;
        tableStats[tableName].total += saleTotal;
      } else {
        dePasoSalesTotal += saleTotal;
        dePasoSalesCount += 1;
      }

      // 3. Distribución Horaria y Horas Pico
      const saleDate = new Date(v.fecha_hora || v.createdAt);
      // Usar hora local de Colombia (America/Bogota UTC-5)
      let hourCol = 0;
      try {
        const hourStr = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: 'numeric', hour12: false }).format(saleDate);
        hourCol = parseInt(hourStr, 10);
        if (isNaN(hourCol) || hourCol < 0 || hourCol >= 24) hourCol = 0;
      } catch (e) {
        hourCol = (saleDate.getUTCHours() - 5 + 24) % 24;
      }

      if (hourlyStats[hourCol]) {
        hourlyStats[hourCol].count += 1;
        hourlyStats[hourCol].total += saleTotal;
      }

      // 4. Línea de tiempo diaria
      let dayKey;
      if (v.fecha_texto && v.fecha_texto.includes('/')) {
        const parts = v.fecha_texto.split('/');
        dayKey = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      } else {
        try {
          dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(saleDate);
        } catch (e) {
          dayKey = saleDate.toISOString().split('T')[0];
        }
      }

      if (!dailyStatsMap.has(dayKey)) {
        const dateOptions = { month: 'short', day: 'numeric', timeZone: 'America/Bogota' };
        const label = saleDate.toLocaleDateString('es-CO', dateOptions);
        dailyStatsMap.set(dayKey, { date: dayKey, label, total: 0, count: 0 });
      }
      const dayObj = dailyStatsMap.get(dayKey);
      dayObj.total += saleTotal;
      dayObj.count += 1;

      // 5. Items, Productos, Categorías y Costos
      if (Array.isArray(v.items)) {
        v.items.forEach(item => {
          const qty = Number(item.cantidad || 1);
          const itemTotal = Number(item.valor_total || (qty * (item.valor_unitario || 0)));
          totalItemsSold += qty;

          // Cruce con producto en catálogo
          const prodId = item.id_producto ? item.id_producto.toString() : null;
          const prodDoc = prodId ? productMap.get(prodId) : null;
          const prodName = (prodDoc ? prodDoc.name : item.nombre) || 'Producto sin nombre';
          const prodCategory = (prodDoc ? prodDoc.department : null) || 'VARIOS';
          const unitCost = prodDoc ? Number(prodDoc.cost || prodDoc.precio_neto || (item.valor_unitario * 0.45)) : (item.valor_unitario * 0.45);
          
          totalCostEstimate += (unitCost * qty);

          // Acumulador de Producto
          if (!productSalesMap.has(prodName)) {
            productSalesMap.set(prodName, {
              name: prodName,
              category: prodCategory,
              quantity: 0,
              revenue: 0,
              cost: 0,
              profit: 0
            });
          }
          const pStat = productSalesMap.get(prodName);
          pStat.quantity += qty;
          pStat.revenue += itemTotal;
          pStat.cost += (unitCost * qty);
          pStat.profit += (itemTotal - (unitCost * qty));

          // Acumulador de Categoría
          if (!categorySalesMap.has(prodCategory)) {
            categorySalesMap.set(prodCategory, {
              category: prodCategory,
              quantity: 0,
              total: 0
            });
          }
          const cStat = categorySalesMap.get(prodCategory);
          cStat.quantity += qty;
          cStat.total += itemTotal;
        });
      }

      // 6. Rendimiento por Empleado
      let empName = 'Caja Principal';
      let empRole = 'Cajero / Atención';
      let empShift = 'Rotativo';

      if (v.id_empleado) {
        if (typeof v.id_empleado === 'object' && v.id_empleado.nombre_empleado) {
          empName = v.id_empleado.nombre_empleado;
          empRole = v.id_empleado.cargo || 'Cajero';
          empShift = v.id_empleado.turno || 'General';
        } else if (employeeMap.has(v.id_empleado.toString())) {
          const emp = employeeMap.get(v.id_empleado.toString());
          empName = emp.nombre_empleado;
          empRole = emp.cargo || 'Cajero';
          empShift = emp.turno || 'General';
        }
      }

      if (!employeeSalesMap.has(empName)) {
        employeeSalesMap.set(empName, {
          name: empName,
          role: empRole,
          shift: empShift,
          salesCount: 0,
          totalRevenue: 0
        });
      }
      const eStat = employeeSalesMap.get(empName);
      eStat.salesCount += 1;
      eStat.totalRevenue += saleTotal;
    });

    const totalSalesCount = ventas.length;
    const averageTicket = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0;
    const grossProfit = Math.max(0, totalRevenue - totalCostEstimate);
    const profitMargin = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;

    // Identificar hora pico
    let peakHour = null;
    let maxHourlyRevenue = -1;
    hourlyStats.forEach(h => {
      if (h.total > maxHourlyRevenue && h.count > 0) {
        maxHourlyRevenue = h.total;
        peakHour = h;
      }
    });

    // Formatear Métodos de Pago
    const paymentMethodsList = Object.keys(paymentMethodStats).map(name => {
      const stat = paymentMethodStats[name];
      return {
        name,
        count: stat.count,
        total: stat.total,
        percentage: totalRevenue > 0 ? Number(((stat.total / totalRevenue) * 100).toFixed(1)) : 0
      };
    }).sort((a, b) => b.total - a.total);

    // Formatear Mesas
    const tablesList = Object.values(tableStats).sort((a, b) => b.total - a.total);

    // Formatear Top Productos (por cantidad y por ingresos)
    const allProductsSold = Array.from(productSalesMap.values());
    const topProductsByQty = [...allProductsSold].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
    const topProductsByRevenue = [...allProductsSold].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    // Formatear Categorías con porcentajes
    const categoriesList = Array.from(categorySalesMap.values()).map(c => ({
      ...c,
      percentage: totalRevenue > 0 ? Number(((c.total / totalRevenue) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.total - a.total);

    // Productos de baja rotación (productos en inventario con 0 o pocas ventas en el período)
    const lowRotationProducts = productos
      .map(p => {
        const soldStat = productSalesMap.get(p.name);
        const qtySold = soldStat ? soldStat.quantity : 0;
        return {
          id: p._id,
          code: p.code,
          name: p.name,
          department: p.department || 'VARIOS',
          stock: p.stock,
          minStock: p.minStock,
          price1: p.price1,
          quantitySold: qtySold
        };
      })
      .filter(p => p.quantitySold <= 1)
      .sort((a, b) => a.quantitySold - b.quantitySold)
      .slice(0, 8);

    // Timeline ordenado por fecha
    const dailyTimeline = Array.from(dailyStatsMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Rendimiento por empleado
    const employeePerformance = Array.from(employeeSalesMap.values())
      .map(e => ({
        ...e,
        averageTicket: e.salesCount > 0 ? Math.round(e.totalRevenue / e.salesCount) : 0,
        percentage: totalRevenue > 0 ? Number(((e.totalRevenue / totalRevenue) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Últimos 15 recibos para auditoría
    const recentReceipts = ventas.slice(-15).reverse().map(v => ({
      id: v._id,
      receiptNumber: v.numero_recibo ? String(v.numero_recibo).padStart(4, '0') : 'S/N',
      date: v.fecha_hora_local || v.fecha_texto || new Date(v.fecha_hora || v.createdAt).toLocaleString('es-CO'),
      rawDate: v.fecha_hora || v.createdAt,
      customer: v.cliente_nombre || 'Cliente General',
      nit: v.cliente_nit || 'Consumidor Final',
      channel: v.tipo_venta === 'mesa' ? (v.mesa || 'Mesa') : 'Cliente de Paso',
      paymentMethod: v.metodo_pago_nombre || 'Efectivo',
      transferType: v.tipo_transferencia,
      transferVoucher: v.comprobante_transferencia,
      itemCount: Array.isArray(v.items) ? v.items.reduce((s, it) => s + (it.cantidad || 1), 0) : 0,
      items: v.items || [],
      total: Number(v.total_venta || 0)
    }));

    res.json({
      summary: {
        totalRevenue,
        totalSalesCount,
        averageTicket,
        totalItemsSold,
        totalCostEstimate,
        grossProfit,
        profitMargin
      },
      cashClosing: {
        totalCashReceived,
        totalCashChange,
        netCash,
        cashSalesTotal,
        transferSalesTotal,
        cardSalesTotal,
        virtualWalletTotal,
        byPaymentMethod: paymentMethodsList,
        transfersDetail,
        firstReceipt: firstReceipt ? String(firstReceipt).padStart(4, '0') : '0001',
        lastReceipt: lastReceipt ? String(lastReceipt).padStart(4, '0') : '0001',
        receiptCount: totalSalesCount
      },
      channelDistribution: {
        mesaSalesTotal,
        dePasoSalesTotal,
        mesaSalesCount,
        dePasoSalesCount,
        mesaPercentage: totalRevenue > 0 ? Number(((mesaSalesTotal / totalRevenue) * 100).toFixed(1)) : 0,
        dePasoPercentage: totalRevenue > 0 ? Number(((dePasoSalesTotal / totalRevenue) * 100).toFixed(1)) : 0,
        byTable: tablesList
      },
      hourlySales: {
        hours: hourlyStats,
        peakHour: peakHour || { label: 'N/A', displayLabel: 'N/A', total: 0, count: 0 }
      },
      dailyTimeline,
      topProducts: {
        byQuantity: topProductsByQty,
        byRevenue: topProductsByRevenue
      },
      categoriesList,
      lowRotationProducts,
      employeePerformance,
      recentReceipts
    });

  } catch (error) {
    console.error('Error generando analíticas de reportes:', error);
    res.status(500).json({ message: error.message });
  }
});

// 2. ENDPOINT: Valorización de Inventario y Stock Crítico
router.get('/inventory-valuation', async (req, res) => {
  try {
    const productos = await Producto.find().lean();
    
    let totalStockUnits = 0;
    let inventoryCostValue = 0;
    let inventorySaleValue = 0;
    const criticalStockProducts = [];
    const departmentValuation = {};

    productos.forEach(p => {
      const stock = Number(p.stock || 0);
      const minStock = Number(p.minStock || 5);
      const unitCost = Number(p.cost || p.precio_neto || 0);
      const unitSale = Number(p.price1 || 0);
      const dept = p.department || 'VARIOS';

      totalStockUnits += stock;
      inventoryCostValue += (stock * unitCost);
      inventorySaleValue += (stock * unitSale);

      if (!departmentValuation[dept]) {
        departmentValuation[dept] = { department: dept, count: 0, stock: 0, costValue: 0, saleValue: 0 };
      }
      departmentValuation[dept].count += 1;
      departmentValuation[dept].stock += stock;
      departmentValuation[dept].costValue += (stock * unitCost);
      departmentValuation[dept].saleValue += (stock * unitSale);

      if (stock <= minStock) {
        criticalStockProducts.push({
          id: p._id,
          code: p.code,
          name: p.name,
          department: dept,
          stock,
          minStock,
          isOut: stock === 0,
          unitCost,
          unitSale
        });
      }
    });

    criticalStockProducts.sort((a, b) => a.stock - b.stock);

    const potentialProfit = Math.max(0, inventorySaleValue - inventoryCostValue);
    const potentialMargin = inventorySaleValue > 0 ? Number(((potentialProfit / inventorySaleValue) * 100).toFixed(1)) : 0;

    res.json({
      catalogCount: productos.length,
      totalStockUnits,
      inventoryCostValue,
      inventorySaleValue,
      potentialProfit,
      potentialMargin,
      criticalStockCount: criticalStockProducts.length,
      criticalStockProducts,
      departmentValuation: Object.values(departmentValuation).sort((a, b) => b.saleValue - a.saleValue)
    });

  } catch (error) {
    console.error('Error calculando valorización de inventario:', error);
    res.status(500).json({ message: error.message });
  }
});

// 3. ENDPOINT: Exportación a CSV compatible con Microsoft Excel (UTF-8 con BOM)
router.get('/export-csv', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateQuery = parseDateRange(startDate, endDate);
    const finalQuery = Object.keys(dateQuery).length > 0 ? dateQuery : {};

    const ventas = await Venta.find(finalQuery)
      .sort({ numero_recibo: 1, fecha_hora: 1 })
      .lean();

    // Encabezados del CSV en español
    const headers = [
      'Recibo No.',
      'Fecha y Hora',
      'Cliente',
      'NIT / Documento',
      'Canal / Mesa',
      'Metodo de Pago',
      'Tipo Transferencia',
      'No. Comprobante',
      'Productos (Cantidad x Item)',
      'Total Venta (COP)'
    ];

    const rows = ventas.map(v => {
      const itemsText = Array.isArray(v.items)
        ? v.items.map(it => `${it.cantidad || 1}x ${it.nombre || 'Item'} ($${it.valor_unitario || 0})`).join(' | ')
        : '';

      return [
        v.numero_recibo ? String(v.numero_recibo).padStart(4, '0') : 'S/N',
        `"${v.fecha_hora_local || v.fecha_texto || ''}"`,
        `"${(v.cliente_nombre || 'Cliente General').replace(/"/g, '""')}"`,
        `"${v.cliente_nit || 'Consumidor Final'}"`,
        `"${v.tipo_venta === 'mesa' ? (v.mesa || 'Mesa') : 'Cliente de Paso'}"`,
        `"${v.metodo_pago_nombre || 'Efectivo'}"`,
        `"${v.tipo_transferencia || ''}"`,
        `"${v.comprobante_transferencia || ''}"`,
        `"${itemsText.replace(/"/g, '""')}"`,
        Number(v.total_venta || 0)
      ].join(';');
    });

    // Byte Order Mark (BOM) para que Excel abra UTF-8 con tildes y caracteres latinos correctamente
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_Ventas_SmartBakery_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csvContent);

  } catch (error) {
    console.error('Error al exportar CSV:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
