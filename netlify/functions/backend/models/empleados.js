// DISEÑO DE MODELOS: EMPLEADOS

// Importamos Mongoose para poder crear el esquema y el modelo.
const mongoose = require("mongoose");

// Creamos el esquema de Empleado.
// Aquí definimos los datos que tendrá cada empleado
// dentro de la colección.
const empleadoSchema = new mongoose.Schema({

    // Guarda el nombre completo del empleado.
    nombre_empleado: {

        // El dato será de tipo texto.
        type: String,

        // Este campo es obligatorio.
        required: true,

        // Elimina espacios innecesarios al inicio y al final del texto.
        trim: true

    },

    // Guarda el nombre de usuario que utilizará el empleado
    // para ingresar al sistema.
    usuario: {

        // El dato será de tipo texto.
        type: String,

        // Este campo es obligatorio.
        required: true,

        // No permite que existan dos empleados
        // con el mismo nombre de usuario.
        unique: true,

        // Elimina espacios innecesarios al inicio y al final del texto.
        trim: true

    },

    // Guarda la contraseña del empleado de forma segura,
    // utilizando un valor cifrado o hash en lugar de guardar
    // la contraseña directamente.
    passwordHash: {

        // El dato será de tipo texto.
        type: String,

        // Este campo es obligatorio.
        required: true

    },

    // Guarda la fecha en la que el empleado ingresó
    // a trabajar en la empresa.
    fecha_ingreso: {

        // El dato será de tipo fecha.
        type: Date,

        // Este campo es obligatorio.
        required: true

    },

    // Guarda el número de teléfono del empleado.
    telefono: {

        // Se utiliza String porque los teléfonos pueden
        // contener ceros iniciales, espacios o símbolos.
        type: String,

        // Este campo es obligatorio.
        required: true,

        // Elimina espacios innecesarios al inicio y al final del texto.
        trim: true

    },

    // Guarda la dirección del empleado.
    direccion: {

        // El dato será de tipo texto.
        type: String,

        // Este campo es obligatorio.
        required: true,

        // Elimina espacios innecesarios al inicio y al final del texto.
        trim: true

    }

});

// Exportamos el modelo "Empleado" para poder utilizarlo
// desde otros archivos de nuestro proyecto.
module.exports = mongoose.model("Empleado", empleadoSchema);