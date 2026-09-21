// DISEÑO DE MODELO: PRODUCTOS
// Adaptado al formulario de productos del frontend

const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    // Código del producto (único y obligatorio)
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Nombre del producto (obligatorio)
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Marca del producto (opcional)
    brand: {
        type: String,
        trim: true
    },
    // Referencia a la categoría en la colección Categorías
    id_categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    // Departamento / Nombre de la categoría
    department: {
        type: String,
        trim: true
    },
    // Precio 1: General (obligatorio)
    price1: {
        type: Number,
        required: true,
        min: 0
    },
    // Precio 2: Mayoreo (opcional)
    price2: {
        type: Number,
        min: 0
    },
    // Precio 3: Especial (opcional)
    price3: {
        type: Number,
        min: 0
    },
    // Stock mínimo de alerta (obligatorio, por defecto 5)
    minStock: {
        type: Number,
        required: true,
        default: 5,
        min: 0
    },
    // Stock actual (obligatorio, por defecto 0)
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true // Añade campos createdAt y updatedAt automáticamente
});

// Exportamos el modelo "Producto"
module.exports = mongoose.model("Producto", productoSchema);