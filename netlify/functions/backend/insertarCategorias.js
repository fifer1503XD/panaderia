const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Importamos Mongoose para poder conectarnos a MongoDB.
const mongoose = require("mongoose");

// Cargamos las variables de entorno que están guardadas en el archivo .env.
require("dotenv").config();

// Importamos el modelo Categoria que creamos anteriormente.
const Categoria = require("./models/categorias");

const categoriasReales = [
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

// Nos conectamos a MongoDB utilizando la dirección
// almacenada en la variable MONGODB_URI del archivo .env.
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB conectado correctamente");

    for (const catName of categoriasReales) {
      await Categoria.findOneAndUpdate(
        { nombre_categoria: new RegExp(`^${catName}$`, "i") },
        { nombre_categoria: catName },
        { upsert: true, returnDocument: 'after' }
      );
    }

    console.log("✅ 10 Categorías reales insertadas/actualizadas correctamente en MongoDB");
    await mongoose.connection.close();
    console.log("Conexión cerrada");
  })

    // Si ocurre algún error durante la conexión o inserción,
    // lo mostramos en la consola.
    .catch((error) => {
        console.error("Error:", error);
    });