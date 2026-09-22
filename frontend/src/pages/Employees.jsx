import React, { useState, useEffect, useMemo } from 'react';
import { EMPLOYEES_API_URL } from '../config/api';
import { IconSearch, IconEdit, IconTrash } from '../assets/icons';
import './Employees.css';

const ROLES_PREDEFINIDOS = [
  'Maestro Panadero',
  'Pastelera Principal',
  'Cajero / Barista',
  'Auxiliar de Cocina',
  'Hornero',
  'Repartidor',
  'Administrador de Turno',
  'Gerente de Tienda'
];

const TURNOS_PREDEFINIDOS = [
  'Mañana (05:00 - 13:00)',
  'Tarde (13:00 - 21:00)',
  'Noche (21:00 - 05:00)',
  'Rotativo',
  'Fin de Semana (06:00 - 18:00)'
];

const ESTADOS_DISPONIBLES = ['ACTIVO', 'INACTIVO', 'VACACIONES', 'SUSPENDIDO'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Estado de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Empleado seleccionado para editar o eliminar
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre_empleado: '',
    cargo: 'Maestro Panadero',
    usuario: '',
    passwordHash: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    turno: 'Mañana (05:00 - 13:00)',
    estado: 'ACTIVO',
    telefono_emergencia: ''
  });

  // Mostrar mensaje toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Cargar empleados desde MongoDB
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(EMPLOYEES_API_URL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setError(err.message || 'No se pudieron obtener los empleados de la base de datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Manejar cambios en inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Abrir Modal de Creación
  const openCreateModal = () => {
    setFormData({
      nombre_empleado: '',
      cargo: 'Maestro Panadero',
      usuario: '',
      passwordHash: '',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      turno: 'Mañana (05:00 - 13:00)',
      estado: 'ACTIVO',
      telefono_emergencia: ''
    });
    setIsCreateModalOpen(true);
  };

  // Abrir Modal de Edición
  const openEditModal = (emp) => {
    setSelectedEmployee(emp);
    
    // Formatear fecha para el input date (YYYY-MM-DD)
    let fechaFormateada = new Date().toISOString().split('T')[0];
    if (emp.fecha_ingreso || emp.FECHA_INGRESO) {
      try {
        fechaFormateada = new Date(emp.fecha_ingreso || emp.FECHA_INGRESO).toISOString().split('T')[0];
      } catch (e) {
        console.warn('Error parseando fecha:', e);
      }
    }

    setFormData({
      nombre_empleado: emp.nombre_empleado || '',
      cargo: emp.cargo || 'Maestro Panadero',
      usuario: emp.usuario || '',
      passwordHash: '', // Opcional al editar
      fecha_ingreso: fechaFormateada,
      turno: emp.turno || emp.TURNO || 'Mañana (05:00 - 13:00)',
      estado: emp.estado || emp.ESTADO || 'ACTIVO',
      telefono_emergencia: emp.telefono_emergencia || emp.contacto_emergencia || emp.telefono || ''
    });
    setIsEditModalOpen(true);
  };

  // Abrir Modal de Eliminación
  const openDeleteModal = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  // 2. Guardar Nuevo Empleado (POST a MongoDB)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre_empleado.trim() || !formData.cargo.trim() || !formData.usuario.trim() || !formData.telefono_emergencia.trim()) {
      showToast('Por favor completa los campos obligatorios (*)', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(EMPLOYEES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar empleado');
      }

      showToast(`Empleado ${result.nombre_empleado} registrado con éxito en MongoDB!`, 'success');
      setIsCreateModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error al guardar empleado:', err);
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Actualizar / Editar Empleado (PUT a MongoDB)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    if (!formData.nombre_empleado.trim() || !formData.cargo.trim() || !formData.usuario.trim() || !formData.telefono_emergencia.trim()) {
      showToast('Por favor completa los campos obligatorios (*)', 'error');
      return;
    }

    setIsSubmitting(true);
    const empId = selectedEmployee.id || selectedEmployee._id;

    try {
      const response = await fetch(`${EMPLOYEES_API_URL}/${empId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar empleado');
      }

      showToast(`Empleado ${result.nombre_empleado} actualizado exitosamente!`, 'success');
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Error al actualizar empleado:', err);
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Eliminar Empleado (DELETE a MongoDB)
  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);
    const empId = selectedEmployee.id || selectedEmployee._id;

    try {
      const response = await fetch(`${EMPLOYEES_API_URL}/${empId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Error al eliminar empleado');
      }

      showToast(`Empleado eliminado correctamente de la base de datos`, 'success');
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Error al eliminar empleado:', err);
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrado reactivo en frontend
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const nombre = (emp.nombre_empleado || '').toLowerCase();
      const cargo = (emp.cargo || '').toLowerCase();
      const usuario = (emp.usuario || '').toLowerCase();
      const turno = (emp.turno || emp.TURNO || '').toLowerCase();
      const estado = (emp.estado || emp.ESTADO || '').toUpperCase();

      const matchesSearch =
        nombre.includes(searchTerm.toLowerCase()) ||
        cargo.includes(searchTerm.toLowerCase()) ||
        usuario.includes(searchTerm.toLowerCase()) ||
        turno.includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'TODOS' || estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  // Formateador de fecha para tabla
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'No registrada';
    try {
      const date = new Date(fechaStr);
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="employees-page-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div className={`employees-alert-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close-btn" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* Toolbar Superior */}
      <div className="employees-top-toolbar">
        <div className="employees-toolbar-left">
          {/* Búsqueda */}
          <div className="search-capsule-container">
            <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
              <IconSearch size={18} color="#8E8E8E" />
            </span>
            <input
              type="text"
              className="search-capsule-input"
              placeholder="BUSCAR POR NOMBRE, CÉDULA O CARGO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                ×
              </button>
            )}
          </div>

          {/* Filtros rápidos por estado */}
          <div className="filter-tabs-group">
            {['TODOS', 'ACTIVO', 'INACTIVO', 'VACACIONES'].map((st) => (
              <button
                key={st}
                className={`filter-tab-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Nuevo Empleado */}
        <button className="btn-add-employee" onClick={openCreateModal}>
          <span>+</span>
          <span>NUEVO EMPLEADO</span>
        </button>
      </div>

      {/* Mensaje de error general si falló la conexión inicial */}
      {error && !loading && (
        <div className="employees-alert-toast error">
          <span>Error de conexión con MongoDB: {error}</span>
          <button className="modal-btn-cancel" onClick={fetchEmployees} style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem' }}>
            Reintentar
          </button>
        </div>
      )}

      {/* Estado de carga */}
      {loading ? (
        <div className="employees-loading-state">
          <div className="spinner"></div>
          <p style={{ color: '#667085', fontWeight: 600 }}>Cargando empleados desde MongoDB...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="employees-empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
          <h3 style={{ color: '#101828', fontWeight: 800, margin: '0 0 0.5rem 0' }}>No se encontraron empleados</h3>
          <p style={{ color: '#667085', margin: 0 }}>
            {searchTerm || statusFilter !== 'TODOS'
              ? 'Prueba ajustando los filtros de búsqueda.'
              : 'Empieza registrando tu primer empleado con el botón "+ NUEVO EMPLEADO".'}
          </p>
        </div>
      ) : (
        /* Tabla de Empleados */
        <div className="table-responsive-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th className="th-cell" style={{ width: '24%' }}><span className="pill-header">EMPLEADO</span></th>
                <th className="th-cell" style={{ width: '16%' }}><span className="pill-header">CARGO</span></th>
                <th className="th-cell" style={{ width: '18%' }}><span className="pill-header">TURNO</span></th>
                <th className="th-cell" style={{ width: '12%' }}><span className="pill-header">INGRESO</span></th>
                <th className="th-cell" style={{ width: '15%' }}><span className="pill-header">TEL. EMERGENCIA</span></th>
                <th className="th-cell" style={{ width: '10%', textAlign: 'center' }}><span className="pill-header">ESTADO</span></th>
                <th className="th-cell" style={{ width: '8%', textAlign: 'center' }}><span className="pill-header">ACCIONES</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const empId = emp.id || emp._id;
                const estado = (emp.estado || emp.ESTADO || 'ACTIVO').toUpperCase();
                const turno = emp.turno || emp.TURNO || 'Mañana';
                const fechaIngreso = emp.fecha_ingreso || emp.FECHA_INGRESO;
                const telefono = emp.telefono_emergencia || emp.contacto_emergencia || emp.telefono || 'Sin teléfono';
                const inicial = (emp.nombre_empleado || 'E').charAt(0).toUpperCase();

                return (
                  <tr key={empId} className="employees-row">
                    {/* Empleado (Nombre y Cédula) */}
                    <td className="td-cell">
                      <div className="employee-profile-cell">
                        <div className="employee-avatar-circle">{inicial}</div>
                        <div>
                          <div className="employee-name-title">{emp.nombre_empleado}</div>
                          <div className="employee-cedula-sub">
                            C.C: <strong>{emp.usuario}</strong>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cargo */}
                    <td className="td-cell">
                      <span className="employee-role-tag">{emp.cargo}</span>
                    </td>

                    {/* Turno */}
                    <td className="td-cell">
                      <span className="employee-shift-tag">
                        🕒 {turno}
                      </span>
                    </td>

                    {/* Fecha de Ingreso */}
                    <td className="td-cell">
                      <span className="employee-date-text">{formatFecha(fechaIngreso)}</span>
                    </td>

                    {/* Teléfono de Contacto de Emergencia */}
                    <td className="td-cell">
                      <span className="employee-phone-text">
                        <span className="phone-icon-pill">📞</span>
                        {telefono}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="td-cell" style={{ textAlign: 'center' }}>
                      <span className={`status-pill-badge ${estado}`}>
                        <span className="status-dot"></span>
                        {estado}
                      </span>
                    </td>

                    {/* Acciones (Editar y Eliminar) */}
                    <td className="td-cell" style={{ textAlign: 'center' }}>
                      <div className="employee-actions-group">
                        <button
                          className="emp-action-btn edit"
                          onClick={() => openEditModal(emp)}
                          title="Editar información del empleado"
                        >
                          <IconEdit size={16} color="#0284C7" />
                        </button>
                        <button
                          className="emp-action-btn delete"
                          onClick={() => openDeleteModal(emp)}
                          title="Eliminar empleado de la base de datos"
                        >
                          <IconTrash size={16} color="#DC2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================
          MODAL: CREAR NUEVO EMPLEADO
      ========================================================= */}
      {isCreateModalOpen && (
        <div className="employee-modal-overlay" onClick={() => !isSubmitting && setIsCreateModalOpen(false)}>
          <div className="employee-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <div className="modal-header-titles">
                <div className="modal-header-icon-box">➕</div>
                <div>
                  <h2 className="modal-title">Registrar Nuevo Empleado</h2>
                  <p className="modal-subtitle">Conexión directa con la base de datos MongoDB</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="employee-form-grid">
                {/* 1. Nombre Completo */}
                <div className="form-field-wrapper form-group-full">
                  <label className="form-field-label">
                    Nombre del Empleado <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_empleado"
                    className="form-field-input"
                    placeholder="Ej. Mateo Sánchez Gómez"
                    value={formData.nombre_empleado}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 2. Cédula / Usuario */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Cédula / Usuario <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="usuario"
                    className="form-field-input"
                    placeholder="Ej. 1013110341"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="form-field-hint">Número de identificación único</span>
                </div>

                {/* 3. Cargo */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Cargo / Puesto <span className="required-star">*</span>
                  </label>
                  <select
                    name="cargo"
                    className="form-field-select"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    required
                  >
                    {ROLES_PREDEFINIDOS.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Contraseña (passwordHash) */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Contraseña (passwordHash)
                  </label>
                  <input
                    type="password"
                    name="passwordHash"
                    className="form-field-input"
                    placeholder="Contraseña de acceso"
                    value={formData.passwordHash}
                    onChange={handleInputChange}
                  />
                  <span className="form-field-hint">Opcional para el ingreso al sistema</span>
                </div>

                {/* 5. Fecha de Ingreso */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Fecha de Ingreso <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha_ingreso"
                    className="form-field-input"
                    value={formData.fecha_ingreso}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 6. Turno */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Turno Asignado <span className="required-star">*</span>
                  </label>
                  <select
                    name="turno"
                    className="form-field-select"
                    value={formData.turno}
                    onChange={handleInputChange}
                    required
                  >
                    {TURNOS_PREDEFINIDOS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* 7. Estado */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Estado Laboral <span className="required-star">*</span>
                  </label>
                  <select
                    name="estado"
                    className="form-field-select"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                  >
                    {ESTADOS_DISPONIBLES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* 8. Teléfono Contacto de Emergencia */}
                <div className="form-field-wrapper form-group-full">
                  <label className="form-field-label">
                    Teléfono de Contacto de Emergencia <span className="required-star">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telefono_emergencia"
                    className="form-field-input"
                    placeholder="Ej. 3025682859"
                    value={formData.telefono_emergencia}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="form-field-hint">Número de contacto en caso de imprevistos o emergencias</span>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Registrar Empleado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: EDITAR INFORMACIÓN DE EMPLEADO (EDITABLE)
      ========================================================= */}
      {isEditModalOpen && selectedEmployee && (
        <div className="employee-modal-overlay" onClick={() => !isSubmitting && setIsEditModalOpen(false)}>
          <div className="employee-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <div className="modal-header-titles">
                <div className="modal-header-icon-box" style={{ background: '#FEF08A', color: '#854D0E' }}>✏️</div>
                <div>
                  <h2 className="modal-title">Editar Empleado</h2>
                  <p className="modal-subtitle">Modifica la información y actualiza en tiempo real en MongoDB</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="employee-form-grid">
                {/* 1. Nombre Completo */}
                <div className="form-field-wrapper form-group-full">
                  <label className="form-field-label">
                    Nombre del Empleado <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_empleado"
                    className="form-field-input"
                    value={formData.nombre_empleado}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 2. Cédula / Usuario */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Cédula / Usuario <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="usuario"
                    className="form-field-input"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="form-field-hint">Cédula del empleado</span>
                </div>

                {/* 3. Cargo */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Cargo / Puesto <span className="required-star">*</span>
                  </label>
                  <select
                    name="cargo"
                    className="form-field-select"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    required
                  >
                    {ROLES_PREDEFINIDOS.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Cambiar Contraseña (Opcional) */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="passwordHash"
                    className="form-field-input"
                    placeholder="Dejar vacío para mantener la actual"
                    value={formData.passwordHash}
                    onChange={handleInputChange}
                  />
                  <span className="form-field-hint">Solo llenar si deseas cambiar la contraseña</span>
                </div>

                {/* 5. Fecha de Ingreso */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Fecha de Ingreso <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha_ingreso"
                    className="form-field-input"
                    value={formData.fecha_ingreso}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 6. Turno */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Turno Asignado <span className="required-star">*</span>
                  </label>
                  <select
                    name="turno"
                    className="form-field-select"
                    value={formData.turno}
                    onChange={handleInputChange}
                    required
                  >
                    {TURNOS_PREDEFINIDOS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* 7. Estado */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Estado Laboral <span className="required-star">*</span>
                  </label>
                  <select
                    name="estado"
                    className="form-field-select"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                  >
                    {ESTADOS_DISPONIBLES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* 8. Teléfono Contacto de Emergencia */}
                <div className="form-field-wrapper form-group-full">
                  <label className="form-field-label">
                    Teléfono de Contacto de Emergencia <span className="required-star">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telefono_emergencia"
                    className="form-field-input"
                    placeholder="Ej. 3025682859"
                    value={formData.telefono_emergencia}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CONFIRMAR ELIMINACIÓN DE EMPLEADO
      ========================================================= */}
      {isDeleteModalOpen && selectedEmployee && (
        <div className="employee-modal-overlay" onClick={() => !isSubmitting && setIsDeleteModalOpen(false)}>
          <div className="employee-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-box">
              <div className="delete-confirm-icon">🗑️</div>
              <h3 className="delete-confirm-title">¿Eliminar Empleado?</h3>
              <p className="delete-confirm-text">
                ¿Estás seguro de que deseas eliminar a <strong>{selectedEmployee.nombre_empleado}</strong> (C.C: {selectedEmployee.usuario})?
                Esta acción borrará el registro de la base de datos de MongoDB.
              </p>
              <div className="modal-footer-actions" style={{ justifyContent: 'center', border: 'none', padding: 0 }}>
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="modal-btn-danger"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
