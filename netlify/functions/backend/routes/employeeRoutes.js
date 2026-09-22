const express = require('express');
const router = express.Router();
const Empleado = require('../models/empleados');

// 1. Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.find().sort({ createdAt: -1 });
    const result = empleados.map((emp) => {
      const obj = emp.toObject();
      obj.id = obj._id.toString();
      obj.FECHA_INGRESO = obj.fecha_ingreso;
      obj.TURNO = obj.turno;
      obj.ESTADO = obj.estado;
      return obj;
    });
    res.json(result);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ message: 'Error al consultar empleados', error: error.message });
  }
});

// 2. Obtener un empleado por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findById(id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    const obj = empleado.toObject();
    obj.id = obj._id.toString();
    obj.FECHA_INGRESO = obj.fecha_ingreso;
    obj.TURNO = obj.turno;
    obj.ESTADO = obj.estado;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar empleado', error: error.message });
  }
});

// 3. Crear un nuevo empleado
router.post('/', async (req, res) => {
  try {
    const {
      nombre_empleado,
      cargo,
      usuario,
      passwordHash,
      fecha_ingreso,
      FECHA_INGRESO,
      turno,
      TURNO,
      estado,
      ESTADO,
      telefono_emergencia,
      contacto_emergencia,
      telefono
    } = req.body;

    // Validar campos obligatorios
    if (!nombre_empleado || !cargo || !usuario) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios: nombre_empleado, cargo y usuario (cédula) son requeridos'
      });
    }

    const cedulaLimpia = String(usuario).trim();

    // Verificar si ya existe un empleado con la misma cédula / usuario
    const existente = await Empleado.findOne({ usuario: cedulaLimpia });
    if (existente) {
      return res.status(400).json({
        message: `Ya existe un empleado registrado con la cédula / usuario ${cedulaLimpia}`
      });
    }

    const nuevoEmpleado = new Empleado({
      nombre_empleado: String(nombre_empleado).trim(),
      cargo: String(cargo).trim(),
      usuario: cedulaLimpia,
      passwordHash: passwordHash ? String(passwordHash).trim() : '',
      fecha_ingreso: fecha_ingreso || FECHA_INGRESO || new Date(),
      turno: (turno || TURNO || 'Mañana (05:00 - 13:00)').trim(),
      estado: (estado || ESTADO || 'ACTIVO').trim().toUpperCase(),
      telefono_emergencia: String(telefono_emergencia || contacto_emergencia || telefono || '').trim()
    });

    const guardado = await nuevoEmpleado.save();
    const obj = guardado.toObject();
    obj.id = obj._id.toString();
    obj.FECHA_INGRESO = obj.fecha_ingreso;
    obj.TURNO = obj.turno;
    obj.ESTADO = obj.estado;

    res.status(201).json(obj);
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    res.status(400).json({ message: 'Error al crear empleado', error: error.message });
  }
});

// 4. Actualizar / Editar un empleado existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_empleado,
      cargo,
      usuario,
      passwordHash,
      fecha_ingreso,
      FECHA_INGRESO,
      turno,
      TURNO,
      estado,
      ESTADO,
      telefono_emergencia,
      contacto_emergencia,
      telefono
    } = req.body;

    const empleado = await Empleado.findById(id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado para actualizar' });
    }

    // Si se modifica la cédula/usuario, verificar que no esté ocupada por otro empleado
    if (usuario !== undefined && usuario.trim() !== empleado.usuario) {
      const cedulaEnUso = await Empleado.findOne({
        usuario: usuario.trim(),
        _id: { $ne: empleado._id }
      });
      if (cedulaEnUso) {
        return res.status(400).json({
          message: `La cédula / usuario ${usuario.trim()} ya pertenece a otro empleado`
        });
      }
      empleado.usuario = usuario.trim();
    }

    if (nombre_empleado !== undefined) empleado.nombre_empleado = String(nombre_empleado).trim();
    if (cargo !== undefined) empleado.cargo = String(cargo).trim();
    if (passwordHash !== undefined && String(passwordHash).trim() !== '') {
      empleado.passwordHash = String(passwordHash).trim();
    }

    const finalFecha = fecha_ingreso || FECHA_INGRESO;
    if (finalFecha !== undefined) empleado.fecha_ingreso = new Date(finalFecha);

    const finalTurno = turno || TURNO;
    if (finalTurno !== undefined) empleado.turno = String(finalTurno).trim();

    const finalEstado = estado || ESTADO;
    if (finalEstado !== undefined) empleado.estado = String(finalEstado).trim().toUpperCase();

    const finalTelefono = telefono_emergencia || contacto_emergencia || telefono;
    if (finalTelefono !== undefined) empleado.telefono_emergencia = String(finalTelefono).trim();

    const actualizado = await empleado.save();
    const obj = actualizado.toObject();
    obj.id = obj._id.toString();
    obj.FECHA_INGRESO = obj.fecha_ingreso;
    obj.TURNO = obj.turno;
    obj.ESTADO = obj.estado;

    res.json(obj);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(400).json({ message: 'Error al actualizar empleado', error: error.message });
  }
});

// 5. Eliminar un empleado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByIdAndDelete(id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado para eliminar' });
    }
    res.json({ message: 'Empleado eliminado correctamente', id });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ message: 'Error al eliminar empleado', error: error.message });
  }
});

module.exports = router;
