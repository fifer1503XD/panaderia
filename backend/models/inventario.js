// DISEÑO DE MODELOS: INVENTARIO

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema de Inventario.
// Aquí definimos los datos que tendrá cada registro de inventario.
const inventarioSchema = new mongoose.Schema({

    // Identifica el producto al que pertenece este registro de inventario.
    id_producto: {

        // Utilizamos ObjectId porque MongoDB utiliza este tipo
        // de identificador para relacionar documentos.
        type: mongoose.Schema.Types.ObjectId,

        // "ref" indica que este campo se relaciona
        // con el modelo Producto.
        ref: "Producto",

        // Este campo es obligatorio.
        required: true

    },

    // Indica la cantidad disponible de ese producto
    // dentro del inventario.
    cantidad: {

        // La cantidad será un número.
        type: Number,

        // Este campo es obligatorio.
        required: true,

        // La cantidad mínima permitida es 0.
        // Permite que un producto tenga inventario agotado.
        min: 0

    }

});

// Exportamos el modelo "Inventario" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("Inventario", inventarioSchema);