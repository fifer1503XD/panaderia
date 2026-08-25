// Importamos Mongoose para poder conectarnos a MongoDB.
const mongoose = require("mongoose");

// Cargamos las variables de entorno que están guardadas en el archivo .env.
require("dotenv").config();

// Importamos el modelo Categoria que creamos anteriormente.
const Categoria = require("./models/categorias");

// Nos conectamos a MongoDB utilizando la dirección
// almacenada en la variable MONGODB_URI del archivo .env.
mongoose.connect(process.env.MONGODB_URI)

    // Si la conexión es exitosa, ejecutamos este bloque.
    .then(async () => {

        // Mostramos un mensaje para confirmar que MongoDB está conectado.
        console.log("MongoDB conectado correctamente");

        // Creamos un arreglo con las categorías
        // que queremos guardar en la base de datos.
        const categorias = [
            {
                // Primera categoría.
                nombre_categoria: "Panes"
            },
            {
                // Segunda categoría.
                nombre_categoria: "Repostería y tortas"
            },
            {
                // Tercera categoría.
                nombre_categoria: "Pasabocas y horneados"
            },
            {
                // Cuarta categoría.
                nombre_categoria: "Desayunos"
            },
            {
                // Quinta categoría.
                nombre_categoria: "Combos"
            },
            {
                // Sexta categoría.
                nombre_categoria: "Bebidas calientes"
            },
            {
                // Séptima categoría.
                nombre_categoria: "Bebidas frías"
            },
            {
                // Octava categoría.
                nombre_categoria: "Gaseosas"
            },
            {
                // Novena categoría.
                nombre_categoria: "Lácteos"
            }
        ];

        // Insertamos todas las categorías del arreglo
        // en la colección correspondiente de MongoDB.
        await Categoria.insertMany(categorias);

        // Mostramos un mensaje para confirmar
        // que las categorías fueron guardadas correctamente.
        console.log("Categorías insertadas correctamente");

        // Cerramos la conexión con MongoDB después de terminar
        // la inserción de los datos.
        await mongoose.connection.close();

        // Mostramos un mensaje para confirmar
        // que la conexión fue cerrada.
        console.log("Conexión cerrada");
    })

    // Si ocurre algún error durante la conexión o inserción,
    // lo mostramos en la consola.
    .catch((error) => {
        console.error("Error:", error);
    });