const express = require('express');
const router = express.Router();
const MetodoPago = require('../models/metodo_pago');

// 1. Obtener todos los métodos de pago de MongoDB
router.get('/', async (req, res) => {
  try {
    const metodos = await MetodoPago.find().sort({ metodo_pago: 1 });
    res.json(metodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Obtener un método de pago por ID
router.get('/:id', async (req, res) => {
  try {
    const metodo = await MetodoPago.findById(req.params.id);
    if (!metodo) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }
    res.json(metodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Crear un nuevo método de pago
router.post('/', async (req, res) => {
  try {
    const { metodo_pago } = req.body;
    if (!metodo_pago) {
      return res.status(400).json({ message: 'El nombre del método de pago es obligatorio' });
    }
    const nuevoMetodo = new MetodoPago({ metodo_pago: metodo_pago.trim() });
    await nuevoMetodo.save();
    res.status(201).json(nuevoMetodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
