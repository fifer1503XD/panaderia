// MODELO DE MONGOOSE: EMPLEADOS (SmartBakery)
const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema(
  {
    // Nombre completo del empleado
    nombre_empleado: {
      type: String,
      required: [true, 'El nombre del empleado es obligatorio'],
      trim: true
    },

    // Cargo o rol del empleado (Cajera, Panadero, Pastelero, Cocinera, Administrador, etc.)
    cargo: {
      type: String,
      required: [true, 'El cargo del empleado es obligatorio'],
      trim: true
    },

    // Identificación / Cédula del empleado (usado como usuario único)
    usuario: {
      type: String,
      trim: true,
      sparse: true
    },

    // Cédula o Documento de Identidad oficial
    cedula: {
      type: String,
      trim: true,
      default: ''
    },

    // Fecha de Nacimiento
    fecha_nacimiento: {
      type: String,
      trim: true,
      default: ''
    },

    // Grupo sanguíneo y factor RH (ej: O+, A+, etc.)
    rh: {
      type: String,
      trim: true,
      default: ''
    },

    // Celular / Teléfono de contacto directo
    celular: {
      type: String,
      trim: true,
      default: ''
    },

    // Dirección residencial
    direccion: {
      type: String,
      trim: true,
      default: ''
    },

    // Información de Contacto de Emergencia (Nombre, Parentesco y Teléfono)
    contacto_emergencia: {
      type: String,
      trim: true,
      default: ''
    },

    // Entidad Promotora de Salud (EPS: Sanitas, Capital Salud, Compensar, etc.)
    eps: {
      type: String,
      trim: true,
      default: ''
    },

    // Contraseña cifrada o hash de autenticación
    passwordHash: {
      type: String,
      default: ''
    },

    // Fecha en la que el empleado ingresó a la empresa
    fecha_ingreso: {
      type: Date,
      default: Date.now
    },

    // Turno asignado (Mañana (06:00 - 14:00), Tarde (13:00 - 21:00), Completa, Media (09:00 - 17:00))
    turno: {
      type: String,
      trim: true,
      default: 'Mañana (06:00 - 14:00)'
    },

    // Estado laboral del empleado
    estado: {
      type: String,
      trim: true,
      enum: ['ACTIVO', 'INACTIVO', 'VACACIONES', 'SUSPENDIDO'],
      default: 'ACTIVO'
    },

    // Número de teléfono de contacto de emergencia
    telefono_emergencia: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Formateador para serializar a JSON con id como string
empleadoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.FECHA_INGRESO = returnedObject.fecha_ingreso;
    returnedObject.TURNO = returnedObject.turno;
    returnedObject.ESTADO = returnedObject.estado;
  }
});

module.exports = mongoose.model('Empleado', empleadoSchema);