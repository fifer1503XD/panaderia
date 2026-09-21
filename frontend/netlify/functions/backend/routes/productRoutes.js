const express = require('express');
const router = express.Router();
const Producto = require('../models/productos');
const Inventario = require('../models/inventario');
const Categoria = require('../models/categorias');
const Marca = require('../models/marca');

// Helper para sincronizar la colección Inventario con el stock del producto
async function syncInventario(productId, stockQuantity) {
  try {
    await Inventario.findOneAndUpdate(
      { id_producto: productId },
      { id_producto: productId, cantidad: Math.max(0, Number(stockQuantity) || 0) },
      { upsert: true, returnDocument: 'after' }
    );
  } catch (err) {
    console.error('Error sincronizando colección Inventario:', err.message);
  }
}

// Helper para sincronizar Categoría y Marca si no existen
async function syncCategoriaYMarca(department, brand) {
  try {
    if (department && department.trim()) {
      await Categoria.findOneAndUpdate(
        { nombre_categoria: new RegExp(`^${department.trim()}$`, 'i') },
        { nombre_categoria: department.trim() },
        { upsert: true }
      );
    }
    if (brand && brand.trim()) {
      await Marca.findOneAndUpdate(
        { nombre_marca: new RegExp(`^${brand.trim()}$`, 'i') },
        { nombre_marca: brand.trim() },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error('Error sincronizando Categoría o Marca:', err.message);
  }
}

// 1. Obtener todos los productos (con stock sincronizado e id_categoria poblada)
router.get('/', async (req, res) => {
  try {
    const products = await Producto.find().populate('id_categoria');
    
    // Obtenemos todos los registros de inventario para asegurar consistencia
    const inventarios = await Inventario.find();
    const inventarioMap = new Map();
    inventarios.forEach(inv => {
      if (inv.id_producto) {
        inventarioMap.set(inv.id_producto.toString(), inv.cantidad);
      }
    });

    const productsWithId = products.map(p => {
      const obj = p.toObject();
      obj.id = obj._id.toString();
      
      // Si id_categoria vino poblada como objeto, normalizamos
      if (obj.id_categoria && typeof obj.id_categoria === 'object') {
        if (!obj.department && obj.id_categoria.nombre_categoria) {
          obj.department = obj.id_categoria.nombre_categoria;
        }
        obj.id_categoria = obj.id_categoria._id.toString();
      }

      // Si existe un registro en la colección Inventario, lo usamos; si no, el del producto
      if (inventarioMap.has(obj.id)) {
        obj.stock = inventarioMap.get(obj.id);
      }
      return obj;
    });

    res.json(productsWithId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Crear un producto y registrar en colecciones Productos, Inventario y Categorías
router.post('/', async (req, res) => {
  const { code, name, brand, id_categoria, department, price1, price2, price3, minStock, stock } = req.body;
  
  const initialStock = stock !== undefined ? Number(stock) : 0;
  let resolvedDepartment = department || 'PANES';
  let resolvedIdCategoria = id_categoria;

  // Si envían id_categoria, consultamos la colección Categorías para obtener su nombre oficial
  if (id_categoria) {
    try {
      const catDoc = await Categoria.findById(id_categoria);
      if (catDoc) {
        resolvedDepartment = catDoc.nombre_categoria;
        resolvedIdCategoria = catDoc._id;
      }
    } catch (e) {
      console.warn('No se pudo encontrar categoría por id_categoria:', id_categoria);
    }
  } else if (department) {
    // Si envían solo department, buscamos el id de la categoría en Mongo
    try {
      const catDoc = await Categoria.findOne({ nombre_categoria: new RegExp(`^${department.trim()}$`, 'i') });
      if (catDoc) {
        resolvedIdCategoria = catDoc._id;
        resolvedDepartment = catDoc.nombre_categoria;
      }
    } catch (e) {
      console.warn('No se pudo encontrar categoría por nombre:', department);
    }
  }

  const product = new Producto({
    code,
    name,
    brand,
    id_categoria: resolvedIdCategoria,
    department: resolvedDepartment,
    price1: Number(price1) || 0,
    price2: price2 ? Number(price2) : undefined,
    price3: price3 ? Number(price3) : undefined,
    minStock: minStock !== undefined ? Number(minStock) : 5,
    stock: initialStock
  });

  try {
    const newProduct = await product.save();
    const obj = newProduct.toObject();
    obj.id = obj._id.toString();
    if (obj.id_categoria) obj.id_categoria = obj.id_categoria.toString();

    // Sincronizar en la colección Inventario
    await syncInventario(newProduct._id, initialStock);

    // Sincronizar en colecciones Categoría y Marca
    await syncCategoriaYMarca(resolvedDepartment, brand);

    res.status(201).json(obj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. Actualizar un producto o su stock (sincroniza Productos e Inventario)
router.put('/:id', async (req, res) => {
  try {
    const { code, name, brand, id_categoria, department, price1, price2, price3, minStock, stock } = req.body;
    const product = await Producto.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (code !== undefined) product.code = code;
    if (name !== undefined) product.name = name;
    if (brand !== undefined) product.brand = brand;
    
    // Si se envía id_categoria, actualizamos id_categoria y department desde la colección Categorias
    if (id_categoria !== undefined) {
      product.id_categoria = id_categoria;
      try {
        const catDoc = await Categoria.findById(id_categoria);
        if (catDoc) {
          product.department = catDoc.nombre_categoria;
        }
      } catch (e) {
        console.warn('Error resolviendo nombre_categoria por id:', id_categoria);
      }
    } else if (department !== undefined) {
      product.department = department;
      try {
        const catDoc = await Categoria.findOne({ nombre_categoria: new RegExp(`^${department.trim()}$`, 'i') });
        if (catDoc) {
          product.id_categoria = catDoc._id;
        }
      } catch (e) {
        console.warn('Error resolviendo id de categoria por nombre:', department);
      }
    }

    if (price1 !== undefined) product.price1 = Number(price1);
    if (price2 !== undefined) product.price2 = price2 ? Number(price2) : undefined;
    if (price3 !== undefined) product.price3 = price3 ? Number(price3) : undefined;
    if (minStock !== undefined) product.minStock = Number(minStock);
    if (stock !== undefined) product.stock = Math.max(0, Number(stock));

    const updatedProduct = await product.save();
    const obj = updatedProduct.toObject();
    obj.id = obj._id.toString();
    if (obj.id_categoria) obj.id_categoria = obj.id_categoria.toString();

    // Sincronizar en la colección Inventario
    if (stock !== undefined) {
      await syncInventario(updatedProduct._id, stock);
    }

    // Sincronizar categoría/marca si fueron modificadas
    if (product.department || brand) {
      await syncCategoriaYMarca(product.department, brand);
    }

    res.json(obj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. Eliminar producto y remover su registro de la colección Inventario
router.delete('/:id', async (req, res) => {
  try {
    const product = await Producto.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar de colección productos
    await product.deleteOne();

    // Eliminar de colección inventario
    await Inventario.deleteMany({ id_producto: req.params.id });

    res.json({ message: 'Producto e inventario eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
