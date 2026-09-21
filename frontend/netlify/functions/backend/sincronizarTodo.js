const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
require("dotenv").config();

const Producto = require("./models/productos");
const Inventario = require("./models/inventario");
const Categoria = require("./models/categorias");
const Marca = require("./models/marca");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Conectado a MongoDB. Iniciando sincronización total...");

    const productos = await Producto.find();
    console.log(`Encontrados ${productos.length} productos en la colección 'productos'.`);

    const categoriasBase = [
      "PANES",
      "REPOSTERIA",
      "PASABOCAS",
      "DESAYUNOS",
      "COMBOS",
      "BEBIDAS CALIENTES",
      "BEBIDAS FRÍAS",
      "GASEOSAS",
      "LÁCTEOS",
      "VARIOS"
    ];

    for (const cat of categoriasBase) {
      await Categoria.findOneAndUpdate(
        { nombre_categoria: new RegExp(`^${cat}$`, 'i') },
        { nombre_categoria: cat },
        { upsert: true }
      );
    }

    for (const prod of productos) {
      // 1. Sincronizar en colección Inventario
      await Inventario.findOneAndUpdate(
        { id_producto: prod._id },
        { id_producto: prod._id, cantidad: prod.stock || 0 },
        { upsert: true, returnDocument: 'after' }
      );

      // 2. Sincronizar en colección Categorías y asociar id_categoria en el producto
      if (prod.department && prod.department.trim()) {
        const catDoc = await Categoria.findOneAndUpdate(
          { nombre_categoria: new RegExp(`^${prod.department.trim()}$`, 'i') },
          { nombre_categoria: prod.department.trim().toUpperCase() },
          { upsert: true, returnDocument: 'after' }
        );

        if (catDoc && (!prod.id_categoria || prod.id_categoria.toString() !== catDoc._id.toString())) {
          prod.id_categoria = catDoc._id;
          prod.department = catDoc.nombre_categoria;
          await prod.save();
        }
      }

      // 3. Sincronizar en colección Marcas
      if (prod.brand && prod.brand.trim()) {
        await Marca.findOneAndUpdate(
          { nombre_marca: new RegExp(`^${prod.brand.trim()}$`, 'i') },
          { nombre_marca: prod.brand.trim() },
          { upsert: true }
        );
      }
    }

    const totalInventarios = await Inventario.countDocuments();
    const totalCategorias = await Categoria.countDocuments();
    const totalMarcas = await Marca.countDocuments();

    console.log(`✅ Sincronización exitosa:`);
    console.log(`   - Productos: ${productos.length}`);
    console.log(`   - Inventarios: ${totalInventarios}`);
    console.log(`   - Categorías: ${totalCategorias}`);
    console.log(`   - Marcas: ${totalMarcas}`);

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error en sincronización:", err);
    process.exit(1);
  });
