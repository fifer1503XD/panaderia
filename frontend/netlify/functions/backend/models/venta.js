// DISEÑO DE MODELOS: VENTA
const mongoose = require("mongoose");

// Creamos el esquema de Venta.
const ventaSchema = new mongoose.Schema({
    // Fecha y hora de la venta (objeto Date)
    fecha_hora: {
        type: Date,
        default: Date.now,
        required: true
    },

    // Fecha legible de la venta (ej: 17/09/2026)
    fecha_texto: {
        type: String,
        trim: true
    },

    // Hora exacta de la venta (ej: 07:54:24 PM)
    hora_texto: {
        type: String,
        trim: true
    },

    // Fecha y hora local completa (ej: 17/09/2026, 7:54:24 p. m.)
    fecha_hora_local: {
        type: String,
        trim: true
    },

    // Empleado que realizó la venta (opcional si no hay sesión activa)
    id_empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        required: false
    },

    // Método de pago (ObjectId referenciado)
    id_metodopago: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MetodoPago",
        required: false
    },

    // Nombre del método de pago utilizado (Efectivo, Transferencia, Tarjeta, etc.)
    metodo_pago_nombre: {
        type: String,
        trim: true,
        required: true
    },

    // Tipo de transferencia embebido en la colección (Nequi o Daviplata)
    tipo_transferencia: {
        type: String,
        trim: true,
        default: null
    },

    // Comprobante o referencia opcional para transferencias
    comprobante_transferencia: {
        type: String,
        trim: true,
        default: null
    },

    // Tipo de venta: 'mesa' o 'de_paso'
    tipo_venta: {
        type: String,
        enum: ['mesa', 'de_paso'],
        default: 'mesa'
    },

    // Identificador de la mesa o 'Cliente de Paso'
    mesa: {
        type: String,
        trim: true,
        default: 'Cliente de Paso'
    },

    // Efectivo entregado por el cliente (para pagos en efectivo)
    monto_recibido: {
        type: Number,
        default: 0
    },

    // Vueltas / Cambio entregado al cliente (para pagos en efectivo)
    vueltas: {
        type: Number,
        default: 0
    },

    // Lista de productos vendidos embebidos en el documento
    items: [
        {
            id_producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Producto"
            },
            nombre: {
                type: String,
                required: true
            },
            cantidad: {
                type: Number,
                required: true,
                min: 1
            },
            valor_unitario: {
                type: Number,
                required: true,
                min: 0
            },
            valor_total: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],

    // Valor total neto de la venta (sin impuestos agregados)
    total_venta: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    collection: 'ventas'
});

module.exports = mongoose.model("Venta", ventaSchema, "ventas");