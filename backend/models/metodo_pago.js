// DISEÑO DE MODELOS: METODO_PAGO

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema de MetodoPago.
// Aquí definimos los datos que tendrá cada método de pago.
const metodoPagoSchema = new mongoose.Schema({

    // Guarda el nombre del método de pago utilizado.
    metodo_pago: {

        // El dato será de tipo texto.
        type: String,

        // Este campo es obligatorio.
        required: true,

        // Elimina espacios innecesarios al inicio y al final del texto.
        trim: true

    }

});

// Exportamos el modelo "MetodoPago" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("MetodoPago", metodoPagoSchema);