// Importamos Mongoose para poder conectarnos a MongoDB.
const mongoose = require("mongoose");

// Cargamos las variables de entorno que están guardadas en el archivo .env.
require("dotenv").config();

// Importamos el modelo Marca que creamos anteriormente.
const Marca = require("./models/marca");

// Creamos una función asíncrona para realizar
// el proceso de conexión e inserción de las marcas.
async function insertarMarcas() {

    // Iniciamos un bloque try para controlar posibles errores.
    try {

        // Nos conectamos a MongoDB utilizando la dirección
        // almacenada en la variable MONGODB_URI del archivo .env.
        await mongoose.connect(process.env.MONGODB_URI);

        // Mostramos un mensaje para confirmar que MongoDB está conectado.
        console.log("MongoDB conectado correctamente");

        // Mostramos el nombre de la base de datos
        // a la que estamos conectados actualmente.
        console.log("Base de datos actual:", mongoose.connection.name);

        // Mostramos el nombre de la colección que Mongoose
        // está utilizando para guardar las marcas.
        console.log("Colección que está usando Mongoose:", Marca.collection.name);

        // Creamos un arreglo con las marcas
        // que queremos guardar en la base de datos.
        const marcas = [

            {
                // Primera marca.
                nombre_marca: "Coca Cola"

            },

            {
                // Segunda marca.
                nombre_marca: "Postobón"

            },

            {
                // Tercera marca.
                nombre_marca: "Bavaria"

            },

            {
                // Cuarta marca.
                nombre_marca: "Colanta"

            },

            {
                // Quinta marca.
                nombre_marca: "Alquería"

            },

            {
                // Sexta marca.
                nombre_marca: "Levapan"

            }

        ];

        // Elimina las marcas anteriores para evitar duplicados.
        await Marca.deleteMany({});

        // Inserta nuevamente las 6 marcas.
        const resultado = await Marca.insertMany(marcas);

        // Muestra en la consola cuántas marcas fueron insertadas.
        console.log("Cantidad insertada:", resultado.length);

        // Busca todas las marcas que actualmente existen
        // en la colección de MongoDB.
        const marcasGuardadas = await Marca.find();

        // Muestra un mensaje antes de mostrar
        // las marcas encontradas.
        console.log("Marcas que existen actualmente:");

        // Muestra en la consola las marcas guardadas.
        console.log(marcasGuardadas);

        // Cerramos la conexión con MongoDB después de terminar
        // todo el proceso.
        await mongoose.connection.close();

        // Mostramos un mensaje para confirmar
        // que la conexión fue cerrada.
        console.log("Conexión cerrada");

    // Si ocurre algún error durante el proceso,
    // lo capturamos y lo mostramos en la consola.
    } catch (error) {

        console.error("ERROR:", error);

    }
}

// Ejecutamos la función insertarMarcas()
// para iniciar todo el proceso.
insertarMarcas();