const express = require('express');
const router = express.Router();
const Venta = require('../models/venta');
const Producto = require('../models/productos');
const Inventario = require('../models/inventario');
const MetodoPago = require('../models/metodo_pago');

// 1. Obtener todas las ventas registradas
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha_hora: -1 }).limit(100);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Registrar una nueva venta
router.post('/', async (req, res) => {
  try {
    const {
      metodo_pago_nombre,
      tipo_transferencia,
      comprobante_transferencia,
      tipo_venta,
      mesa,
      monto_recibido,
      vueltas,
      items,
      total_venta,
      id_empleado,
      id_metodopago
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'La venta debe contener al menos un producto' });
    }

    // Buscar método de pago por nombre si no viene id_metodopago
    let metodopagoId = id_metodopago;
    if (!metodopagoId && metodo_pago_nombre) {
      try {
        const mpDoc = await MetodoPago.findOne({
          metodo_pago: new RegExp(`^${metodo_pago_nombre.trim()}$`, 'i')
        });
        if (mpDoc) {
          metodopagoId = mpDoc._id;
        }
      } catch (e) {
        // Ignored
      }
    }

    // Formatear items para el documento
    const itemsFormatted = items.map(item => ({
      id_producto: item.product?._id || item.product?.id || null,
      nombre: item.product?.name || item.nombre || 'Producto',
      cantidad: Number(item.quantity || item.cantidad || 1),
      valor_unitario: Number(item.price || item.valor_unitario || 0),
      valor_total: Number(item.price || item.valor_unitario || 0) * Number(item.quantity || item.cantidad || 1)
    }));

    // Obtener la fecha y hora real de la venta
    const fechaReal = req.body.fecha_hora ? new Date(req.body.fecha_hora) : new Date();
    const fechaTexto = fechaReal.toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const horaTexto = fechaReal.toLocaleTimeString('es-CO', {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const fechaHoraLocal = `${fechaTexto} ${horaTexto}`;

    // Crear y guardar la venta en MongoDB
    const nuevaVenta = new Venta({
      fecha_hora: fechaReal,
      fecha_texto: fechaTexto,
      hora_texto: horaTexto,
      fecha_hora_local: fechaHoraLocal,
      id_empleado: id_empleado || undefined,
      id_metodopago: metodopagoId || undefined,
      metodo_pago_nombre: metodo_pago_nombre || 'Efectivo',
      tipo_transferencia: tipo_transferencia || null,
      comprobante_transferencia: comprobante_transferencia || null,
      tipo_venta: tipo_venta || 'mesa',
      mesa: mesa || 'Cliente de Paso',
      monto_recibido: Number(monto_recibido || 0),
      vueltas: Number(vueltas || 0),
      items: itemsFormatted,
      total_venta: Number(total_venta || 0)
    });

    const ventaGuardada = await nuevaVenta.save();

    // Descontar inventario en Producto e Inventario
    for (const item of itemsFormatted) {
      if (item.id_producto) {
        try {
          const prod = await Producto.findById(item.id_producto);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - item.cantidad);
            await prod.save();

            // Sincronizar también con la colección inventario
            await Inventario.findOneAndUpdate(
              { id_producto: prod._id },
              { id_producto: prod._id, cantidad: prod.stock },
              { upsert: true }
            );
          }
        } catch (errProd) {
          console.warn(`No se pudo actualizar stock para producto ${item.id_producto}:`, errProd.message);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Venta registrada exitosamente',
      venta: ventaGuardada
    });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
