const express = require('express');
const router = express.Router();
const Categoria = require('../models/categorias');

// 1. Obtener todas las categorías de MongoDB
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombre_categoria: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Crear una nueva categoría
router.post('/', async (req, res) => {
  try {
    const { nombre_categoria } = req.body;
    if (!nombre_categoria) {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
    }
    const nuevaCategoria = new Categoria({ nombre_categoria: nombre_categoria.toUpperCase().trim() });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
