const express = require('express');
const router = express.Router();
const Inventario = require('../models/inventario');
const Producto = require('../models/productos');

// Obtener inventario consolidado con detalles del producto
router.get('/', async (req, res) => {
  try {
    const inventario = await Inventario.find().populate('id_producto');
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar cantidad de inventario por id de producto o id de inventario
router.put('/:productId', async (req, res) => {
  const { cantidad } = req.body;
  const { productId } = req.params;

  try {
    const qty = Math.max(0, Number(cantidad) || 0);

    // 1. Actualizar en colección Inventario
    const inv = await Inventario.findOneAndUpdate(
      { id_producto: productId },
      { id_producto: productId, cantidad: qty },
      { upsert: true, returnDocument: 'after' }
    );

    // 2. Actualizar en colección Producto
    await Producto.findByIdAndUpdate(productId, { stock: qty });

    res.json({ message: 'Inventario actualizado correctamente', inventario: inv });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
