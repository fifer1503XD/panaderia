// Importamos el módulo DNS de Node.js para configurar
// los servidores que se utilizarán para resolver direcciones.
const dns = require("dns");

// Configuramos servidores DNS públicos para ayudar
// a resolver la dirección de MongoDB.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Importamos Express para crear el servidor de nuestra aplicación.
const express = require("express");

// Importamos Mongoose para conectar nuestra aplicación
// con la base de datos MongoDB.
const mongoose = require("mongoose");

// Cargamos las variables de entorno que están guardadas
// en el archivo .env.
require("dotenv").config();

// Creamos la aplicación utilizando Express.
const app = express();

// Permitimos que Express pueda recibir y procesar
// información enviada en formato JSON.
app.use(express.json());

// Nos conectamos a MongoDB utilizando la dirección
// almacenada en la variable MONGODB_URI del archivo .env.
mongoose.connect(process.env.MONGODB_URI)

    // Si la conexión con MongoDB es exitosa,
    // ejecutamos este bloque.
    .then(() => {

        // Mostramos un mensaje para confirmar
        // que MongoDB está conectado correctamente.
        console.log("MongoDB conectado correctamente");

        // Iniciamos el servidor Express utilizando
        // el puerto definido en el archivo .env.
        app.listen(process.env.PORT, () => {

            // Mostramos en la consola el puerto
            // en el que está funcionando el servidor.
            console.log(`Servidor ejecutándose en el puerto ${process.env.PORT}`);
        });
    })

    // Si ocurre un error al conectarse con MongoDB,
    // lo capturamos y lo mostramos en la consola.
    .catch((error) => {

        console.error("Error al conectar con MongoDB:", error);
    });