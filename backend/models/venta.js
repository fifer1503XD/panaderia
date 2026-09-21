// DISEÑO DE MODELOS: VENTA
const mongoose = require("mongoose");

const itemVentaSchema = new mongoose.Schema({
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
}, { _id: false });

const ventaSchema = new mongoose.Schema({
    // Guarda la fecha y hora en la que se realizó la venta.
    fecha_hora: {
        type: Date,
        required: true,
        default: Date.now
    },
    fecha_texto: {
        type: String
    },
    hora_texto: {
        type: String
    },
    fecha_hora_local: {
        type: String
    },
    // Identifica al empleado que realizó la venta (opcional).
    id_empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        required: false
    },
    // Identifica el método de pago utilizado en la venta (opcional).
    id_metodopago: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MetodoPago",
        required: false
    },
    metodo_pago_nombre: {
        type: String,
        default: "Efectivo"
    },
    tipo_transferencia: {
        type: String
    },
    comprobante_transferencia: {
        type: String
    },
    tipo_venta: {
        type: String,
        default: "mesa"
    },
    mesa: {
        type: String,
        default: "Cliente de Paso"
    },
    monto_recibido: {
        type: Number,
        default: 0
    },
    vueltas: {
        type: Number,
        default: 0
    },
    items: [itemVentaSchema],
    // Guarda el valor total de la venta.
    total_venta: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Venta", ventaSchema);