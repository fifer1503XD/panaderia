const express = require('express');
const router = express.Router();
const Producto = require('../models/productos');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Producto.find();
    // Mapear _id a id para compatibilidad con el frontend
    const productsWithId = products.map(p => {
      const obj = p.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
    res.json(productsWithId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un producto
router.post('/', async (req, res) => {
  const { code, name, brand, department, price1, price2, price3, minStock, stock } = req.body;
  const product = new Producto({
    code,
    name,
    brand,
    department,
    price1: Number(price1),
    price2: price2 ? Number(price2) : undefined,
    price3: price3 ? Number(price3) : undefined,
    minStock: minStock ? Number(minStock) : 5,
    stock: stock ? Number(stock) : 0
  });

  try {
    const newProduct = await product.save();
    const obj = newProduct.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un producto (por ID)
router.put('/:id', async (req, res) => {
  try {
    const { code, name, brand, department, price1, price2, price3, minStock, stock } = req.body;
    const product = await Producto.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (code !== undefined) product.code = code;
    if (name !== undefined) product.name = name;
    if (brand !== undefined) product.brand = brand;
    if (department !== undefined) product.department = department;
    if (price1 !== undefined) product.price1 = Number(price1);
    if (price2 !== undefined) product.price2 = price2 ? Number(price2) : undefined;
    if (price3 !== undefined) product.price3 = price3 ? Number(price3) : undefined;
    if (minStock !== undefined) product.minStock = Number(minStock);
    if (stock !== undefined) product.stock = Number(stock);

    const updatedProduct = await product.save();
    const obj = updatedProduct.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Producto.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await product.deleteOne();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
