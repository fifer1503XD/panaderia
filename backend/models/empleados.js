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

    // Cargo o rol del empleado (Maestro Panadero, Pastelera, Cajero / Barista, Auxiliar de Cocina, etc.)
    cargo: {
      type: String,
      required: [true, 'El cargo del empleado es obligatorio'],
      trim: true
    },

    // Identificación / Cédula del empleado (usado como usuario único)
    usuario: {
      type: String,
      required: [true, 'El usuario (cédula) es obligatorio'],
      unique: true,
      trim: true
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

    // Turno asignado (Mañana, Tarde, Noche, Rotativo, Fin de Semana)
    turno: {
      type: String,
      required: [true, 'El turno es obligatorio'],
      trim: true,
      default: 'Mañana (05:00 - 13:00)'
    },

    // Estado laboral del empleado
    estado: {
      type: String,
      required: [true, 'El estado es obligatorio'],
      trim: true,
      enum: ['ACTIVO', 'INACTIVO', 'VACACIONES', 'SUSPENDIDO'],
      default: 'ACTIVO'
    },

    // Número de teléfono de contacto de emergencia
    telefono_emergencia: {
      type: String,
      required: [true, 'El número de contacto de emergencia es obligatorio'],
      trim: true
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
    // Alias para compatibilidad con mayúsculas si se requiere
    returnedObject.FECHA_INGRESO = returnedObject.fecha_ingreso;
    returnedObject.TURNO = returnedObject.turno;
    returnedObject.ESTADO = returnedObject.estado;
  }
});

module.exports = mongoose.model('Empleado', empleadoSchema);