import React, { useState } from 'react';
import { useAuth, MODULE_DEFINITIONS, MOCK_USERS } from '../context/AuthContext';
import { IconRoles, IconLock } from '../assets/icons';
import './Roles.css';

const Roles = () => {
  const {
    currentUser,
    permissions,
    togglePermission,
    resetPermissions,
    switchRole
  } = useAuth();

  const [notification, setNotification] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    username: '',
    role: 'empleado',
    password: ''
  });

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleToggle = (roleKey, moduleId) => {
    if (roleKey === 'superadmin') {
      showToast('⚠️ El rol Super Administrador tiene permisos maestros fijos para garantizar el acceso al sistema.');
      return;
    }

    if (roleKey === 'admin' && moduleId === 'roles') {
      showToast('🔒 El módulo de gestión de roles es exclusivo del Super Administrador.');
      return;
    }

    togglePermission(roleKey, moduleId);
    showToast(`✅ Permiso actualizado para el rol ${roleKey.toUpperCase()}`);
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer los permisos de todos los roles a los valores predeterminados de fábrica?')) {
      resetPermissions();
      showToast('🔄 Matriz de permisos restablecida a los valores estándar de SmartBakery.');
    }
  };

  const handleCreateMockUser = (e) => {
    e.preventDefault();
    if (!newUserData.username.trim() || !newUserData.name.trim()) {
      alert('Por favor completa el nombre y usuario.');
      return;
    }
    showToast(`👤 Usuario @${newUserData.username} registrado provisionalmente con rol ${newUserData.role.toUpperCase()}`);
    setShowAddUserModal(false);
    setNewUserData({ name: '', username: '', role: 'empleado', password: '' });
  };

  return (
    <div className="roles-page-container">
      {/* Toast flotante de confirmación */}
      {notification && (
        <div className="roles-toast-notification">
          <span>{notification}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          1. HEADER Y ACCIONES PRINCIPALES
      ------------------------------------------------------------- */}
      <div className="roles-header-section">
        <div className="roles-title-area">
          <h1>
            <span className="roles-title-icon">
              <IconRoles size={28} color="var(--primary-teal)" />
            </span>
            Gestión de Roles y Permisos
          </h1>
          <p>
            Control de segmentación, matriz de seguridad y perfiles de acceso para la panadería
          </p>
        </div>

        <div className="roles-actions-bar">
          <button
            type="button"
            className="btn-roles-action"
            onClick={handleReset}
            title="Restablecer permisos por defecto"
          >
            🔄 Restablecer Estándar
          </button>

          <button
            type="button"
            className="btn-roles-action primary"
            onClick={() => setShowAddUserModal(true)}
          >
            ➕ Nuevo Usuario / Rol
          </button>
        </div>
      </div>

      {/* Tarjeta de estado de seguridad actual */}
      <div className="roles-superadmin-banner">
        <div className="superadmin-banner-icon">👑</div>
        <div className="superadmin-banner-info">
          <h3>Panel Maestro Exclusivo para Super Administrador</h3>
          <p>
            Como <strong>{currentUser?.name}</strong>, puedes ajustar qué módulos son visibles y accesibles para los 
            Administradores de tienda y los Empleados de mostrador. Los cambios se sincronizan en tiempo real.
          </p>
        </div>
        <div className="superadmin-badge-pill">Nivel 1 • Acceso Total</div>
      </div>

      {/* -------------------------------------------------------------
          2. MATRIZ INTERACTIVA DE PERMISOS POR ROL
      ------------------------------------------------------------- */}
      <div className="roles-card-panel">
        <div className="roles-panel-header">
          <div>
            <h2 className="roles-panel-title">🛡️ Matriz de Permisos por Módulo</h2>
            <span className="roles-panel-subtitle">
              Haz clic en los interruptores para conceder o revocar acceso a cada sección del sistema
            </span>
          </div>
        </div>

        <div className="roles-matrix-table-container">
          <table className="roles-matrix-table">
            <thead>
              <tr>
                <th style={{ minWidth: '240px' }}>Módulo del Sistema</th>
                <th style={{ textAlign: 'center', width: '220px' }}>
                  <div className="role-col-header superadmin">
                    <span>👑 SUPER ADMIN</span>
                    <small>Acceso total</small>
                  </div>
                </th>
                <th style={{ textAlign: 'center', width: '220px' }}>
                  <div className="role-col-header admin">
                    <span>🏪 ADMINISTRADOR</span>
                    <small>Tienda & Operaciones</small>
                  </div>
                </th>
                <th style={{ textAlign: 'center', width: '220px' }}>
                  <div className="role-col-header empleado">
                    <span>🥖 EMPLEADO</span>
                    <small>Mostrador & POS</small>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {MODULE_DEFINITIONS.map((module) => {
                const isSuperAdminAllowed = true;
                const isAdminAllowed = module.id === 'roles' ? false : Boolean(permissions.admin?.[module.id]);
                const isEmpleadoAllowed = Boolean(permissions.empleado?.[module.id]);

                return (
                  <tr key={module.id}>
                    <td>
                      <div className="module-info-cell">
                        <span className="module-cell-icon">{module.icon}</span>
                        <div>
                          <strong className="module-cell-title">{module.label}</strong>
                          <span className="module-cell-desc">{module.description}</span>
                          <span className="module-cell-path">Ruta: <code>{module.path}</code></span>
                        </div>
                      </div>
                    </td>

                    {/* Columna Super Admin */}
                    <td style={{ textAlign: 'center' }}>
                      <div className="perm-toggle-wrapper">
                        <span className="perm-lock-badge superadmin" title="Permiso maestro incondicional">
                          🔒 Siempre Activo
                        </span>
                      </div>
                    </td>

                    {/* Columna Administrador */}
                    <td style={{ textAlign: 'center' }}>
                      <div className="perm-toggle-wrapper">
                        {module.id === 'roles' ? (
                          <span className="perm-lock-badge disabled" title="Exclusivo del Super Administrador">
                            🚫 Restringido
                          </span>
                        ) : (
                          <label className="perm-switch">
                            <input
                              type="checkbox"
                              checked={isAdminAllowed}
                              onChange={() => handleToggle('admin', module.id)}
                            />
                            <span className="perm-slider round" />
                          </label>
                        )}
                        <span className={`perm-status-label ${isAdminAllowed ? 'active' : 'inactive'}`}>
                          {isAdminAllowed ? 'Habilitado' : 'Bloqueado'}
                        </span>
                      </div>
                    </td>

                    {/* Columna Empleado */}
                    <td style={{ textAlign: 'center' }}>
                      <div className="perm-toggle-wrapper">
                        {module.id === 'roles' ? (
                          <span className="perm-lock-badge disabled">
                            🚫 Restringido
                          </span>
                        ) : (
                          <label className="perm-switch">
                            <input
                              type="checkbox"
                              checked={isEmpleadoAllowed}
                              onChange={() => handleToggle('empleado', module.id)}
                            />
                            <span className="perm-slider round" />
                          </label>
                        )}
                        <span className={`perm-status-label ${isEmpleadoAllowed ? 'active' : 'inactive'}`}>
                          {isEmpleadoAllowed ? 'Habilitado' : 'Bloqueado'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. DIRECTORIO DE PERFILES Y CREDENCIALES CONFIGURADAS
      ------------------------------------------------------------- */}
      <div className="roles-card-panel" style={{ marginTop: '2rem' }}>
        <div className="roles-panel-header">
          <div>
            <h2 className="roles-panel-title">👥 Directorio de Cuentas y Credenciales de Prueba</h2>
            <span className="roles-panel-subtitle">
              Usuarios configurados para la autenticación en esta fase del proyecto
            </span>
          </div>
        </div>

        <div className="roles-profiles-grid">
          {Object.values(MOCK_USERS).map((user) => {
            const isCurrent = currentUser?.username === user.username;
            return (
              <div 
                key={user.id} 
                className={`role-profile-card ${isCurrent ? 'current' : ''}`}
                style={{ borderColor: isCurrent ? user.badgeColor : 'var(--border-divider)' }}
              >
                <div className="profile-card-top">
                  <div 
                    className="profile-avatar-box" 
                    style={{ background: user.badgeBg, color: user.badgeColor }}
                  >
                    {user.avatar}
                  </div>
                  <div className="profile-titles">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3>{user.name}</h3>
                      {isCurrent && (
                        <span className="tag-current-session">Tú (Sesión Actual)</span>
                      )}
                    </div>
                    <span className="profile-email">{user.email}</span>
                  </div>
                </div>

                <p className="profile-desc">{user.description}</p>

                <div className="profile-credentials-box">
                  <div className="credential-row">
                    <span>Usuario:</span>
                    <code>{user.username}</code>
                  </div>
                  <div className="credential-row">
                    <span>Contraseña:</span>
                    <code>{user.password}</code>
                  </div>
                  <div className="credential-row">
                    <span>Rol Asignado:</span>
                    <strong style={{ color: user.badgeColor }}>{user.roleShort}</strong>
                  </div>
                </div>

                <div className="profile-card-actions">
                  <button
                    type="button"
                    className="btn-switch-role"
                    style={{
                      background: isCurrent ? 'var(--bg-input)' : user.badgeBg,
                      color: isCurrent ? 'var(--text-muted)' : user.badgeColor,
                      cursor: isCurrent ? 'default' : 'pointer'
                    }}
                    onClick={() => {
                      if (!isCurrent) {
                        switchRole(user.role);
                        showToast(`🔄 Sesión cambiada al perfil ${user.roleLabel}`);
                      }
                    }}
                    disabled={isCurrent}
                  >
                    {isCurrent ? '✓ Sesión Activa' : `🧪 Cambiar a este rol`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. MODAL PARA CREAR NUEVO USUARIO / ASIGNAR ROL
      ------------------------------------------------------------- */}
      {showAddUserModal && (
        <div className="roles-modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="roles-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="roles-modal-header">
              <h3>➕ Asignar Nuevo Usuario a un Rol</h3>
              <button 
                type="button" 
                className="btn-modal-close" 
                onClick={() => setShowAddUserModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMockUser} className="roles-modal-form">
              <div className="modal-field-group">
                <label>Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos Panadero"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  required
                />
              </div>

              <div className="modal-field-group">
                <label>Nombre de Usuario (Login):</label>
                <input
                  type="text"
                  placeholder="Ej: carlos"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  required
                />
              </div>

              <div className="modal-field-group">
                <label>Rol Asignado:</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                >
                  <option value="empleado">🥖 Empleado / Cajero (Ventas + Reportes)</option>
                  <option value="admin">🏪 Administrador de Tienda (Acceso Integral)</option>
                  <option value="superadmin">👑 Super Administrador (Acceso Maestro)</option>
                </select>
              </div>

              <div className="modal-field-group">
                <label>Contraseña Provisional:</label>
                <input
                  type="password"
                  placeholder="Contraseña inicial"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                />
              </div>

              <div className="roles-modal-actions">
                <button
                  type="submit"
                  className="btn-roles-action primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Guardar Perfil
                </button>
                <button
                  type="button"
                  className="btn-roles-action"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
