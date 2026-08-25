// DISEÑO DE MODELOS: MARCA

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema de Marca.
// Aquí definimos los datos que tendrá cada registro de marca.
const marcaSchema = new mongoose.Schema({

    // Guarda el nombre de la marca del producto.
    nombre_marca: {

        // El dato será de tipo texto.
        type: String,

        // Este campo es obligatorio.
        required: true,

        // Elimina espacios innecesarios al inicio y al final del texto.
        trim: true

    }

});

// Exportamos el modelo "Marca" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("Marca", marcaSchema);