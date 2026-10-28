const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');

const Producto = require('./models/productos');
const Inventario = require('./models/inventario');
const Categoria = require('./models/categorias');

const ITEMS_VARIOS = [
  {
    code: 'VR001',
    categoria: 'VARIOS',
    name: 'HUEVOS AAA',
    cost: 450,
    price1: 700,
    stock: 10
  },
  {
    code: 'VR002',
    categoria: 'VARIOS',
    name: 'HUEVOS AAA CUBETA',
    cost: 14000,
    price1: 19000,
    stock: 10
  },
  {
    code: 'VR003',
    categoria: 'VARIOS',
    name: 'SALCHICHASX3',
    cost: 4400,
    price1: 6200,
    stock: 10
  },
  {
    code: 'VR004',
    categoria: 'VARIOS',
    name: 'SALCHICHASX5',
    cost: 5900,
    price1: 7800,
    stock: 10
  },
  {
    code: 'VR005',
    categoria: 'VARIOS',
    name: 'PASTILLA CHOCOLATE',
    cost: 900,
    price1: 1500,
    stock: 10
  },
  {
    code: 'VR006',
    categoria: 'VARIOS',
    name: 'VELA',
    cost: 2500,
    price1: 2500,
    stock: 10
  },
  {
    code: 'VR007',
    categoria: 'VARIOS',
    name: 'VELA NUMERO',
    cost: 1800,
    price1: 3000,
    stock: 10
  },
  {
    code: 'VR008',
    categoria: 'VARIOS',
    name: 'VELA VOLCAN',
    cost: 2700,
    price1: 4500,
    stock: 10
  },
  {
    code: 'VR009',
    categoria: 'VARIOS',
    name: 'TOPPING',
    cost: 1800,
    price1: 3000,
    stock: 10
  },
  {
    code: 'VR010',
    categoria: 'VARIOS',
    name: 'TOPPING GLOBO',
    cost: 3000,
    price1: 5000,
    stock: 10
  },
  {
    code: 'VR011',
    categoria: 'VARIOS',
    name: 'EMPAQUE ADICIONAL',
    cost: 500,
    price1: 1000,
    stock: 10
  },
  {
    code: 'VR012',
    categoria: 'VARIOS',
    name: 'MASATO',
    cost: 500,
    price1: 2000,
    stock: 10
  },
  {
    code: 'VR013',
    categoria: 'VARIOS',
    name: 'ADICION ESPECIAL',
    cost: 0,
    price1: 300,
    stock: 10
  }
];

async function run() {
  try {
    console.log('Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'SmartBakery_BI' });
    console.log('MongoDB conectado exitosamente.');

    // 1. Obtener o crear la categoría VARIOS
    let catVarios = await Categoria.findOne({ nombre_categoria: new RegExp('^VARIOS$', 'i') });
    if (!catVarios) {
      catVarios = await Categoria.create({ nombre_categoria: 'VARIOS' });
      console.log('Categoría VARIOS creada con id:', catVarios._id);
    } else {
      console.log('Categoría VARIOS encontrada:', catVarios._id);
    }

    // 2. Procesar cada producto
    for (const item of ITEMS_VARIOS) {
      const updateData = {
        code: item.code,
        name: item.name,
        department: 'VARIOS',
        id_categoria: catVarios._id,
        cost: item.cost,
        precio_neto: item.cost,
        price1: item.price1,
        minStock: 5,
        stock: item.stock
      };

      const prod = await Producto.findOneAndUpdate(
        { code: item.code },
        { $set: updateData },
        { upsert: true, returnDocument: 'after' }
      );

      // Sincronizar colección Inventario
      await Inventario.findOneAndUpdate(
        { id_producto: prod._id },
        { $set: { id_producto: prod._id, cantidad: item.stock } },
        { upsert: true, returnDocument: 'after' }
      );

      console.log(`✓ [${prod.code}] ${prod.name} | Costo: $${item.cost} | Venta: $${item.price1} | Stock: ${item.stock}`);
    }

    const totalProductos = await Producto.countDocuments();
    const totalInventario = await Inventario.countDocuments();
    console.log(`\n¡Listo! Total productos en colección 'productos': ${totalProductos}`);
    console.log(`Total registros en colección 'inventario': ${totalInventario}`);

  } catch (error) {
    console.error('Error durante la actualización:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB.');
  }
}

run();
