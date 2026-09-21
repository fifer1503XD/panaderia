// Importamos Mongoose para poder conectarnos a MongoDB.
const mongoose = require("mongoose");

// Cargamos las variables de entorno que están guardadas en el archivo .env.
require("dotenv").config();

// Importamos el modelo MetodoPago que creamos anteriormente.
const MetodoPago = require("./models/metodo_pago");

// Creamos una función asíncrona para realizar
// el proceso de conexión e inserción de los métodos de pago.
async function insertarMetodosPago() {

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
        // está utilizando para guardar los métodos de pago.
        console.log(
            "Colección que está usando Mongoose:",
            MetodoPago.collection.name
        );

        // Creamos un arreglo con los métodos de pago
        // que queremos guardar en la base de datos.
        const metodosPago = [

            {
                // Primer método de pago.
                metodo_pago: "Efectivo"
            },

            {
                // Segundo método de pago.
                metodo_pago: "Tarjeta crédito/débito"
            },

            {
                // Tercer método de pago.
                metodo_pago: "Transferencia"
            },

            {
                // Cuarto método de pago.
                metodo_pago: "Bolsillo virtual"
            }
        ];

        // Evita duplicados si ejecutamos nuevamente el archivo.
        // Primero elimina los métodos de pago que ya existan.
        await MetodoPago.deleteMany({});

        // Inserta nuevamente los métodos de pago
        // definidos en el arreglo.
        const resultado = await MetodoPago.insertMany(metodosPago);

        // Muestra en la consola la cantidad de métodos de pago
        // que fueron insertados correctamente.
        console.log("Cantidad de métodos de pago insertados:", resultado.length);

        // Busca todos los métodos de pago que actualmente existen
        // en la colección de MongoDB.
        const metodosGuardados = await MetodoPago.find();

        // Muestra un mensaje antes de mostrar
        // los métodos de pago encontrados.
        console.log("Métodos de pago existentes:");

        // Muestra en la consola los métodos de pago guardados.
        console.log(metodosGuardados);

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

// Ejecutamos la función insertarMetodosPago()
// para iniciar todo el proceso.
insertarMetodosPago();