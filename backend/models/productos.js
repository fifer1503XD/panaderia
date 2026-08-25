// DISEÑO DE MODELO: PRODUCTOS

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema de Producto.
// Aquí definimos los datos que tendrá cada producto
// dentro de la colección.
const productoSchema = new mongoose.Schema({

    // Guarda el nombre del producto.
    nombre_producto: {

        // El dato será de tipo texto.
        type: String,

        // Este campo es obligatorio.
        required: true

    },

    // Identifica la marca a la que pertenece el producto.
    id_marca: {

        // Utilizamos ObjectId para relacionar el producto
        // con un documento de la colección de marcas.
        type: mongoose.Schema.Types.ObjectId,

        // "ref" indica que este campo se relaciona
        // con el modelo Marca.
        ref: "Marca",

        // Este campo es obligatorio.
        required: true

    },

    // Identifica la categoría a la que pertenece el producto.
    id_categoria: {

        // Utilizamos ObjectId para relacionar el producto
        // con un documento de la colección de categorías.
        type: mongoose.Schema.Types.ObjectId,

        // "ref" indica que este campo se relaciona
        // con el modelo Categoria.
        ref: "Categoria",

        // Este campo es obligatorio.
        required: true

    },

    // Guarda el valor que costó comprar el producto.
    valor_compra: {

        // El valor será de tipo numérico.
        type: Number,

        // Este campo es obligatorio.
        required: true

    },

    // Guarda el valor al que se venderá el producto al cliente.
    valor_venta: {

        // El valor será de tipo numérico.
        type: Number,

        // Este campo es obligatorio.
        required: true

    },

    // Indica la cantidad mínima de unidades que debe existir
    // antes de considerar que es necesario reponer el producto.
    stock_minimo: {

        // La cantidad será de tipo numérico.
        type: Number,

        // Este campo es obligatorio.
        required: true

    }

});

// Exportamos el modelo "Producto" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("Producto", productoSchema);