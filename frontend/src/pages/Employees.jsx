import React, { useState, useEffect, useMemo } from 'react';
import { EMPLOYEES_API_URL } from '../config/api';
import { IconSearch, IconEdit, IconTrash } from '../assets/icons';
import './Employees.css';

const ROLES_PREDEFINIDOS = [
  'Cajera',
  'Servicio al Cliente',
  'Cocinera',
  'Panadero',
  'Pastelero',
  'Administrador',
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
  'Mañana (06:00 - 14:00)',
  'Tarde (13:00 - 21:00)',
  'Completa',
  'Media (09:00 - 17:00)'
];

const ESTADOS_DISPONIBLES = ['ACTIVO', 'INACTIVO', 'VACACIONES', 'SUSPENDIDO'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Paginación (5 empleados por página)
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Reiniciar a la página 1 cuando cambia la búsqueda o el filtro de estado
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
    cargo: 'Cajera',
    usuario: '',
    cedula: '',
    fecha_nacimiento: '',
    rh: '',
    celular: '',
    direccion: '',
    contacto_emergencia: '',
    eps: '',
    passwordHash: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    turno: 'Mañana (06:00 - 14:00)',
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
      cargo: 'Cajera',
      usuario: '',
      cedula: '',
      fecha_nacimiento: '',
      rh: '',
      celular: '',
      direccion: '',
      contacto_emergencia: '',
      eps: '',
      passwordHash: '',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      turno: 'Mañana (06:00 - 14:00)',
      estado: 'ACTIVO',
      telefono_emergencia: ''
    });
    setIsCreateModalOpen(true);
  };

  // Abrir Modal de Edición
  const openEditModal = (emp) => {
    setSelectedEmployee(emp);
    
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
      cargo: emp.cargo || 'Cajera',
      usuario: emp.usuario || emp.cedula || '',
      cedula: emp.cedula || emp.usuario || '',
      fecha_nacimiento: emp.fecha_nacimiento || '',
      rh: emp.rh || '',
      celular: emp.celular || emp.telefono || '',
      direccion: emp.direccion || '',
      contacto_emergencia: emp.contacto_emergencia || emp.telefono_emergencia || '',
      eps: emp.eps || '',
      passwordHash: '',
      fecha_ingreso: fechaFormateada,
      turno: emp.turno || emp.TURNO || 'Mañana (06:00 - 14:00)',
      estado: emp.estado || emp.ESTADO || 'ACTIVO',
      telefono_emergencia: emp.telefono_emergencia || emp.contacto_emergencia || ''
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
    if (!formData.nombre_empleado.trim() || !formData.cargo.trim()) {
      showToast('Por favor completa el nombre y cargo del empleado', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        usuario: formData.cedula.trim() || formData.usuario.trim() || `EMP-${Date.now()}`,
        telefono_emergencia: formData.contacto_emergencia.trim() || formData.celular.trim() || 'No registrado'
      };

      const response = await fetch(EMPLOYEES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al guardar empleado en MongoDB');
      }

      const nuevoGuardado = await response.json();
      setEmployees((prev) => [nuevoGuardado, ...prev]);
      showToast('¡Empleado registrado exitosamente en la base de datos!');
      setIsCreateModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Editar Empleado (PUT a MongoDB)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre_empleado.trim() || !formData.cargo.trim()) {
      showToast('El nombre y el cargo son obligatorios', 'error');
      return;
    }

    setIsSubmitting(true);
    const empId = selectedEmployee.id || selectedEmployee._id;

    try {
      const payload = {
        ...formData,
        usuario: formData.cedula.trim() || formData.usuario.trim() || selectedEmployee.usuario,
        telefono_emergencia: formData.contacto_emergencia.trim() || formData.celular.trim() || selectedEmployee.telefono_emergencia
      };

      const response = await fetch(`${EMPLOYEES_API_URL}/${empId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al actualizar empleado en MongoDB');
      }

      const empleadoActualizado = await response.json();
      setEmployees((prev) =>
        prev.map((emp) =>
          (emp.id || emp._id) === empId ? empleadoActualizado : emp
        )
      );
      showToast('Información del empleado actualizada correctamente');
      setIsEditModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Eliminar Empleado (DELETE en MongoDB)
  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);
    const empId = selectedEmployee.id || selectedEmployee._id;

    try {
      const response = await fetch(`${EMPLOYEES_API_URL}/${empId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al eliminar empleado de MongoDB');
      }

      setEmployees((prev) => prev.filter((emp) => (emp.id || emp._id) !== empId));
      showToast(`Empleado "${selectedEmployee.nombre_empleado}" eliminado`);
      setIsDeleteModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrado reactivo en memoria
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const nombre = (emp.nombre_empleado || '').toLowerCase();
      const cargo = (emp.cargo || '').toLowerCase();
      const usuario = (emp.usuario || '').toLowerCase();
      const cedula = (emp.cedula || '').toLowerCase();
      const celular = (emp.celular || emp.telefono || '').toLowerCase();
      const eps = (emp.eps || '').toLowerCase();
      const direccion = (emp.direccion || '').toLowerCase();
      const estado = (emp.estado || emp.ESTADO || 'ACTIVO').toUpperCase();

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        nombre.includes(term) ||
        cargo.includes(term) ||
        usuario.includes(term) ||
        cedula.includes(term) ||
        celular.includes(term) ||
        eps.includes(term) ||
        direccion.includes(term);

      const matchesStatus =
        statusFilter === 'TODOS' || estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  // Cálculo de Paginación (5 por página)
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, validCurrentPage, ITEMS_PER_PAGE]);

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
              <IconSearch size={18} color="var(--text-muted)" />
            </span>
            <input
              type="text"
              className="search-capsule-input"
              placeholder="BUSCAR POR NOMBRE, CÉDULA, CARGO O EPS..."
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
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cargando empleados desde MongoDB...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="employees-empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
          <h3 style={{ color: 'var(--text-dark)', fontWeight: 800, margin: '0 0 0.5rem 0' }}>No se encontraron empleados</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {searchTerm || statusFilter !== 'TODOS'
              ? 'Prueba ajustando los filtros de búsqueda.'
              : 'Empieza registrando tu primer empleado con el botón "+ NUEVO EMPLEADO".'}
          </p>
        </div>
      ) : (
        /* Tabla de Empleados y Paginación */
        <>
          <div className="table-responsive-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th className="th-cell" style={{ minWidth: '220px' }}><span className="pill-header">EMPLEADO</span></th>
                <th className="th-cell" style={{ minWidth: '170px' }}><span className="pill-header">CARGO & EPS</span></th>
                <th className="th-cell" style={{ minWidth: '180px' }}><span className="pill-header">CONTACTO DIRECTO</span></th>
                <th className="th-cell" style={{ minWidth: '200px' }}><span className="pill-header">CONTACTO EMERGENCIA</span></th>
                <th className="th-cell" style={{ minWidth: '160px' }}><span className="pill-header">TURNO & INGRESO</span></th>
                <th className="th-cell" style={{ width: '100px', textAlign: 'center' }}><span className="pill-header">ESTADO</span></th>
                <th className="th-cell" style={{ width: '90px', textAlign: 'center' }}><span className="pill-header">ACCIONES</span></th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => {
                const empId = emp.id || emp._id;
                const estado = (emp.estado || emp.ESTADO || 'ACTIVO').toUpperCase();
                const turno = emp.turno || emp.TURNO || 'Mañana';
                const fechaIngreso = emp.fecha_ingreso || emp.FECHA_INGRESO;
                const docIdentidad = emp.cedula || emp.usuario || 'Por asignar';
                const inicial = (emp.nombre_empleado || 'E').charAt(0).toUpperCase();

                return (
                  <tr key={empId} className="employees-row">
                    {/* Empleado (Nombre, Cédula, RH y Nacimiento) */}
                    <td className="td-cell">
                      <div className="employee-profile-cell">
                        <div className="employee-avatar-circle">{inicial}</div>
                        <div>
                          <div className="employee-name-title">
                            {emp.nombre_empleado}
                            {emp.rh && <span className="emp-rh-badge">{emp.rh}</span>}
                          </div>
                          <div className="employee-cedula-sub">
                            Doc: <strong>{docIdentidad}</strong>
                          </div>
                          {emp.fecha_nacimiento && (
                            <span className="emp-birth-text">🎂 Nac: {emp.fecha_nacimiento}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cargo y EPS */}
                    <td className="td-cell">
                      <div>
                        <span className="employee-role-tag">{emp.cargo}</span>
                      </div>
                      {emp.eps && (
                        <div>
                          <span className="emp-eps-badge">🏥 {emp.eps}</span>
                        </div>
                      )}
                    </td>

                    {/* Contacto Directo: Celular y Dirección */}
                    <td className="td-cell">
                      {emp.celular ? (
                        <div className="employee-phone-text">
                          <span className="phone-icon-pill">📱</span>
                          <strong>{emp.celular}</strong>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Sin celular</span>
                      )}
                      {emp.direccion && (
                        <div className="emp-info-subtext" title={emp.direccion}>
                          📍 {emp.direccion}
                        </div>
                      )}
                    </td>

                    {/* Contacto de Emergencia */}
                    <td className="td-cell">
                      <span className="employee-phone-text">
                        <span className="phone-icon-pill">🆘</span>
                        {emp.contacto_emergencia || emp.telefono_emergencia || 'No registrado'}
                      </span>
                    </td>

                    {/* Turno e Ingreso */}
                    <td className="td-cell">
                      <div className="employee-shift-tag">
                        🕒 {turno}
                      </div>
                      <div className="emp-info-subtext">
                        📅 {formatFecha(fechaIngreso)}
                      </div>
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
                          <IconEdit size={16} color="var(--primary-teal)" />
                        </button>
                        <button
                          className="emp-action-btn delete"
                          onClick={() => openDeleteModal(emp)}
                          title="Eliminar empleado de la base de datos"
                        >
                          <IconTrash size={16} color="var(--status-alerta)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Barra de Paginación (5 empleados por página) */}
        <div className="employees-pagination-container">
          <div className="pagination-count-badge">
            Mostrando <strong>{Math.min((validCurrentPage - 1) * ITEMS_PER_PAGE + 1, filteredEmployees.length)}</strong> a <strong>{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredEmployees.length)}</strong> de <strong>{filteredEmployees.length}</strong> empleados
          </div>

          {totalPages > 1 && (
            <div className="pagination-action-controls">
              <button
                type="button"
                className="pagination-nav-btn prev"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={validCurrentPage <= 1}
                title="Página anterior"
              >
                ◀ Anterior
              </button>

              <div className="pagination-numbers-cluster">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-number-btn ${pageNum === validCurrentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="pagination-nav-btn next"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={validCurrentPage >= totalPages}
                title="Página siguiente"
              >
                Siguiente ▶
              </button>
            </div>
          )}
        </div>
      </>
    )}

      {/* =========================================================
          MODAL: CREAR NUEVO EMPLEADO
      ========================================================= */}
      {isCreateModalOpen && (
        <div className="employee-modal-overlay" onClick={() => !isSubmitting && setIsCreateModalOpen(false)}>
          <div className="employee-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <div className="modal-header-titles">
                <div className="modal-header-icon-box">+</div>
                <div>
                  <h2 className="modal-title">Registrar Nuevo Empleado</h2>
                  <p className="modal-subtitle">Ingresa la información personal y laboral</p>
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
                    placeholder="Ej. MARIOLY ESTHER HERRERA GUTIERREZ"
                    value={formData.nombre_empleado}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 2. Cédula */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Cédula / Documento
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    className="form-field-input"
                    placeholder="Ej. 1000271559 CC o Permiso"
                    value={formData.cedula}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 3. Fecha de Nacimiento */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="text"
                    name="fecha_nacimiento"
                    className="form-field-input"
                    placeholder="DD/MM/AAAA (Ej. 14/08/1979)"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 4. Grupo Sanguíneo RH */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Factor RH
                  </label>
                  <input
                    type="text"
                    name="rh"
                    className="form-field-input"
                    placeholder="Ej. O+, A+, etc."
                    value={formData.rh}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 5. Cargo */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Cargo / Rol <span className="required-star">*</span>
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

                {/* 6. EPS */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    EPS
                  </label>
                  <input
                    type="text"
                    name="eps"
                    className="form-field-input"
                    placeholder="Ej. SANITAS, CAPITAL SALUD"
                    value={formData.eps}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 7. Celular Personal */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Celular Personal
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    className="form-field-input"
                    placeholder="Ej. 3213688171"
                    value={formData.celular}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 8. Dirección */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Dirección Residencial
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-field-input"
                    placeholder="Ej. CALLE 74 65B 37"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 9. Contacto de Emergencia */}
                <div className="form-field-wrapper form-group-full">
                  <label className="form-field-label">
                    Contacto de Emergencia (Nombre, Parentesco y Teléfono)
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia"
                    className="form-field-input"
                    placeholder="Ej. LUIS CARDENAZ ESPOSO- 3194254498"
                    value={formData.contacto_emergencia}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 10. Turno */}
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

                {/* 11. Fecha de Ingreso */}
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

                {/* 12. Estado */}
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
          MODAL: EDITAR INFORMACIÓN DE EMPLEADO
      ========================================================= */}
      {isEditModalOpen && selectedEmployee && (
        <div className="employee-modal-overlay" onClick={() => !isSubmitting && setIsEditModalOpen(false)}>
          <div className="employee-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <div className="modal-header-titles">
                <div className="modal-header-icon-box" style={{ background: '#FEF08A', color: '#854D0E' }}>✏️</div>
                <div>
                  <h2 className="modal-title">Editar Empleado</h2>
                  <p className="modal-subtitle">Modifica la información y actualiza en MongoDB</p>
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

                {/* 2. Cédula */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Cédula / Documento
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    className="form-field-input"
                    value={formData.cedula}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 3. Fecha de Nacimiento */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="text"
                    name="fecha_nacimiento"
                    className="form-field-input"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 4. Grupo Sanguíneo RH */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Factor RH
                  </label>
                  <input
                    type="text"
                    name="rh"
                    className="form-field-input"
                    value={formData.rh}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 5. Cargo */}
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

                {/* 6. EPS */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    EPS
                  </label>
                  <input
                    type="text"
                    name="eps"
                    className="form-field-input"
                    value={formData.eps}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 7. Celular */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Celular Personal
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    className="form-field-input"
                    value={formData.celular}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 8. Dirección */}
                <div className="form-field-wrapper">
                  <label className="form-field-label">
                    Dirección Residencial
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-field-input"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 9. Contacto de Emergencia */}
                <div className="form-field-wrapper form-group-full">
                  <label className="form-field-label">
                    Contacto de Emergencia (Nombre, Parentesco y Teléfono)
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia"
                    className="form-field-input"
                    value={formData.contacto_emergencia}
                    onChange={handleInputChange}
                  />
                </div>

                {/* 10. Turno */}
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

                {/* 11. Fecha de Ingreso */}
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

                {/* 12. Estado */}
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
                  {isSubmitting ? 'Actualizando...' : 'Guardar Cambios'}
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
              <div className="delete-confirm-icon">⚠️</div>
              <h3 className="delete-confirm-title">¿Eliminar empleado?</h3>
              <p className="delete-confirm-text">
                Estás a punto de eliminar a <strong>{selectedEmployee.nombre_empleado}</strong> ({selectedEmployee.cargo}).
                Esta acción no se puede deshacer.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
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
