// DISEÑO DE MODELOS: DETALLE_VENTA

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema de DetalleVenta.
// Este esquema define la información que tendrá cada producto
// que hace parte de una venta.
const detalleVentaSchema = new mongoose.Schema({

    // Identifica a qué venta pertenece este detalle.
    id_venta: {

        // Utilizamos ObjectId porque es el tipo de identificador
        // que MongoDB utiliza para relacionar documentos.
        type: mongoose.Schema.Types.ObjectId,

        // "ref" indica con qué modelo se relaciona este campo.
        // En este caso, se relaciona con el modelo Venta.
        ref: "Venta",

        // Este campo es obligatorio.
        required: true

    },

    // Identifica qué producto hace parte de la venta.
    id_producto: {

        // Utilizamos ObjectId para almacenar el identificador
        // del producto relacionado.
        type: mongoose.Schema.Types.ObjectId,

        // "ref" indica que este campo se relaciona
        // con el modelo Producto.
        ref: "Producto",

        // Este campo es obligatorio.
        required: true

    },

    // Indica cuántas unidades del producto se vendieron.
    cantidad: {

        // La cantidad será un número.
        type: Number,

        // Este campo es obligatorio.
        required: true,

        // La cantidad mínima permitida es 1.
        // No se puede registrar una cantidad de 0 o negativa.
        min: 1

    },

    // Guarda el precio de una unidad del producto
    // en el momento en que se realizó la venta.
    valor_unitario: {

        // El valor será un número.
        type: Number,

        // Este campo es obligatorio.
        required: true,

        // El valor mínimo permitido es 0.
        min: 0

    },

    // Guarda el valor total de ese detalle de venta.
    // Por ejemplo: cantidad × valor_unitario.
    valor_total: {

        // El valor será un número.
        type: Number,

        // Este campo es obligatorio.
        required: true,

        // El valor mínimo permitido es 0.
        min: 0

    }

});

// Exportamos el modelo "DetalleVenta" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("DetalleVenta", detalleVentaSchema);