// DISEÑO DE MODELOS: CATEGORÍAS

// Su función es decirle a Mongoose:
// "Cuando trabajemos con una Categoría, tendrá un campo llamado nombre_categoria."

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema (Schema) de la colección Categorías.
// Aquí definimos cómo estará estructurado cada documento.
const categoriaSchema = new mongoose.Schema({

    // Campo que almacenará el nombre de la categoría.
    nombre_categoria: {

        // El dato será de tipo texto.
        type: String,

        // Indica que este campo es obligatorio.
        required: true,

        // Elimina espacios innecesarios al inicio y al final del texto.
        trim: true

    }

});

// Exportamos el modelo "Categoria" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("Categoria", categoriaSchema);