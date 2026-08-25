// DISEÑO DE MODELOS: VENTA

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema de Venta.
// Aquí definimos los datos que tendrá cada registro de venta.
const ventaSchema = new mongoose.Schema({

    // Guarda la fecha y hora en la que se realizó la venta.
    fecha_hora: {

        // El dato será de tipo fecha.
        type: Date,

        // Este campo es obligatorio.
        required: true

    },

    // Identifica al empleado que realizó la venta.
    id_empleado: {

        // Utilizamos ObjectId para relacionar la venta
        // con un documento de la colección de empleados.
        type: mongoose.Schema.Types.ObjectId,

        // "ref" indica que este campo se relaciona
        // con el modelo Empleado.
        ref: "Empleado",

        // Este campo es obligatorio.
        required: true

    },

    // Identifica el método de pago utilizado en la venta.
    id_metodopago: {

        // Utilizamos ObjectId para relacionar la venta
        // con un documento de la colección de métodos de pago.
        type: mongoose.Schema.Types.ObjectId,

        // "ref" indica que este campo se relaciona
        // con el modelo MetodoPago.
        ref: "MetodoPago",

        // Este campo es obligatorio.
        required: true

    },

    // Guarda el valor total de la venta.
    total_venta: {

        // El valor será de tipo numérico.
        type: Number,

        // Este campo es obligatorio.
        required: true,

        // El valor mínimo permitido es 0.
        // No permite registrar una venta con un valor negativo.
        min: 0

    }

});

// Exportamos el modelo "Venta" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("Venta", ventaSchema);