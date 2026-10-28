const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
require("dotenv").config();

const Empleado = require("./models/empleados");

const listaNuevosEmpleados = [
  {
    nombre_empleado: "MARIOLY ESTHER HERRERA GUTIERREZ",
    cedula: "4671248 PERMISO COLOMBIANO",
    usuario: "4671248 PERMISO COLOMBIANO",
    fecha_nacimiento: "14/08/1979",
    rh: "",
    celular: "3213688171",
    direccion: "CALLE 74 65B 37",
    contacto_emergencia: "LUIS CARDENAZ ESPOSO- 3194254498",
    telefono_emergencia: "3194254498",
    eps: "CAPITAL SALUD",
    cargo: "Cajera",
    fecha_ingreso: new Date(2026, 2, 8), // 8 de marzo de 2026
    turno: "Mañana (06:00 - 14:00)",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "LINA MARIA BRUN BECERRA",
    cedula: "1000271559 CC",
    usuario: "1000271559 CC",
    fecha_nacimiento: "10/09/2003",
    rh: "A+",
    celular: "3134866822",
    direccion: "CALLE 74A 65 40",
    contacto_emergencia: "ANA BECERRA- MAMA- 3143654747",
    telefono_emergencia: "3143654747",
    eps: "SANITAS",
    cargo: "Servicio al Cliente",
    fecha_ingreso: new Date(2026, 2, 8),
    turno: "Mañana (06:00 - 14:00)",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "NORIS ISABEL MENDOZA CARRASEDO",
    cedula: "Por asignar",
    usuario: "NORIS-MENDOZA-3012389917",
    fecha_nacimiento: "",
    rh: "",
    celular: "3012389917",
    direccion: "CARRERA 67A",
    contacto_emergencia: "3012389917",
    telefono_emergencia: "3012389917",
    eps: "CAPITAL SALUD",
    cargo: "Cocinera",
    fecha_ingreso: new Date(2026, 2, 8),
    turno: "Mañana (06:00 - 14:00)",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "ROSA HELENA MEDINA ROJAS",
    cedula: "1004208358 CC",
    usuario: "1004208358 CC",
    fecha_nacimiento: "07/10/1989",
    rh: "O+",
    celular: "3202185691",
    direccion: "CALLE 74A 63 51",
    contacto_emergencia: "JOSE MAMIAN- ESPOSO- 3132860638",
    telefono_emergencia: "3132860638",
    eps: "SANITAS",
    cargo: "Cajera",
    fecha_ingreso: new Date(2026, 2, 8),
    turno: "Tarde (13:00 - 21:00)",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "EIGER OCTAVIO AGUIRRE MUÑOZ",
    cedula: "72195125",
    usuario: "72195125",
    fecha_nacimiento: "12/09/1973",
    rh: "",
    celular: "3203908446",
    direccion: "CARRE 69K 67 41",
    contacto_emergencia: "NORIS ESPOSA",
    telefono_emergencia: "3203908446",
    eps: "COMPENSAR",
    cargo: "Panadero",
    fecha_ingreso: new Date(2026, 2, 8),
    turno: "Mañana (06:00 - 14:00)",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "CAMILO FERRO",
    cedula: "Por asignar",
    usuario: "CAMILO-FERRO-PASTELERO",
    fecha_nacimiento: "",
    rh: "",
    celular: "",
    direccion: "CALLE 75A 64 74",
    contacto_emergencia: "Por registrar",
    telefono_emergencia: "Por registrar",
    eps: "",
    cargo: "Pastelero",
    fecha_ingreso: new Date(2026, 2, 8),
    turno: "Mañana (06:00 - 14:00)",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "HUGO RAMIREZ",
    cedula: "79470166",
    usuario: "79470166",
    fecha_nacimiento: "",
    rh: "",
    celular: "3013991647",
    direccion: "CALLE 12 SUR 56 70",
    contacto_emergencia: "MAYERLING BOLIVAR",
    telefono_emergencia: "3013991647",
    eps: "SANITAS",
    cargo: "Administrador",
    fecha_ingreso: new Date(2026, 2, 9),
    turno: "Completa",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "MAYERLING BOLIVAR",
    cedula: "51995983",
    usuario: "51995983",
    fecha_nacimiento: "",
    rh: "",
    celular: "3132471845",
    direccion: "CALLE 12 SUR 56 70",
    contacto_emergencia: "LORENA RAMIREZ",
    telefono_emergencia: "3132471845",
    eps: "SANITAS",
    cargo: "Administrador",
    fecha_ingreso: new Date(2026, 2, 10),
    turno: "Completa",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "LORENA RAMIREZ",
    cedula: "1022251399",
    usuario: "1022251399",
    fecha_nacimiento: "",
    rh: "",
    celular: "3132911645",
    direccion: "CALLE 12 SUR 56 70",
    contacto_emergencia: "LORENA RAMIREZ",
    telefono_emergencia: "3132911645",
    eps: "SANITAS",
    cargo: "Administrador",
    fecha_ingreso: new Date(2026, 2, 11),
    turno: "Completa",
    estado: "ACTIVO"
  },
  {
    nombre_empleado: "VALENTINA RAMIREZ",
    cedula: "10134536",
    usuario: "10134536",
    fecha_nacimiento: "",
    rh: "",
    celular: "3132111939",
    direccion: "CALLE 12 SUR 56 70",
    contacto_emergencia: "LORENA RAMIREZ",
    telefono_emergencia: "3132111939",
    eps: "SANITAS",
    cargo: "Administrador",
    fecha_ingreso: new Date(2026, 2, 12),
    turno: "Completa",
    estado: "ACTIVO"
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Conectado a MongoDB Atlas. Cargando los 10 empleados...");

    for (const empData of listaNuevosEmpleados) {
      // Upsert buscando por nombre_empleado o por usuario
      const query = {
        $or: [
          { nombre_empleado: empData.nombre_empleado },
          ...(empData.cedula && empData.cedula !== 'Por asignar' ? [{ cedula: empData.cedula }, { usuario: empData.cedula }] : []),
          { usuario: empData.usuario }
        ]
      };

      const resultado = await Empleado.findOneAndUpdate(
        query,
        { $set: empData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`✅ Empleado guardado/actualizado: ${resultado.nombre_empleado} (${resultado.cargo}) - Cédula: ${resultado.cedula || resultado.usuario}`);
    }

    const total = await Empleado.countDocuments();
    console.log(`\n🎉 Proceso completado exitosamente. Total de empleados en MongoDB: ${total}`);

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error al cargar empleados:", err);
    process.exit(1);
  });
