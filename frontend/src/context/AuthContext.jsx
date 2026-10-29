import React, { createContext, useContext, useState, useEffect } from 'react';

// =========================================================================
// DEFINICIÓN DE ROLES, MÓDULOS Y USUARIOS DE PRUEBA (MOCK AUTH)
// =========================================================================

export const MOCK_USERS = {
  superadmin: {
    id: 'usr_superadmin',
    username: 'superadmin',
    password: 'superadmin',
    name: 'Super Administrador',
    email: 'superadmin@smartbakery.com',
    role: 'superadmin',
    roleLabel: 'Super Administrador',
    roleShort: 'SUPER ADMIN',
    badgeColor: '#7C3AED',
    badgeBg: 'rgba(124, 58, 237, 0.12)',
    avatar: '👑',
    description: 'Acceso total sin restricciones a toda la plataforma y gestión de roles.'
  },
  admin: {
    id: 'usr_admin',
    username: 'admin',
    password: 'admin',
    name: 'Administrador de Tienda',
    email: 'admin@smartbakery.com',
    role: 'admin',
    roleLabel: 'Administrador de Tienda',
    roleShort: 'ADMIN',
    badgeColor: '#0E7C86',
    badgeBg: 'rgba(14, 124, 134, 0.12)',
    avatar: '🏪',
    description: 'Gestión completa de inventario, ventas, personal, reportes y configuración.'
  },
  empleado: {
    id: 'usr_empleado',
    username: 'empleado',
    password: 'empleado',
    name: 'Empleado de Mostrador',
    email: 'empleado@smartbakery.com',
    role: 'empleado',
    roleLabel: 'Empleado / Cajero',
    roleShort: 'EMPLEADO',
    badgeColor: '#D97706',
    badgeBg: 'rgba(217, 119, 6, 0.12)',
    avatar: '🥖',
    description: 'Operación diaria del Punto de Venta (POS) y visualización de reportes.'
  }
};

export const MODULE_DEFINITIONS = [
  {
    id: 'inventory',
    label: 'Control de Inventario',
    path: '/inventory',
    icon: '📦',
    description: 'Gestión de catálogo, stock disponible, categorías y alertas de agotados'
  },
  {
    id: 'sales',
    label: 'Punto de Venta (POS)',
    path: '/sales',
    icon: '🛒',
    description: 'Facturación en mesas y clientes de paso, registro de cobros e impresión'
  },
  {
    id: 'employees',
    label: 'Gestión de Empleados',
    path: '/employees',
    icon: '👥',
    description: 'Administración de personal, cajeros, panaderos, turnos y comisiones'
  },
  {
    id: 'reports',
    label: 'Reportes y Métricas BI',
    path: '/reports',
    icon: '📊',
    description: 'Arqueo de caja, ventas diarias, horarios pico y auditoría de recibos'
  },
  {
    id: 'settings',
    label: 'Configuración General',
    path: '/settings',
    icon: '⚙️',
    description: 'Parámetros del negocio, datos fiscales, tickets e impresoras térmicas'
  },
  {
    id: 'roles',
    label: 'Gestión de Roles & Permisos',
    path: '/roles',
    icon: '🛡️',
    description: 'Ajuste de matriz de permisos por rol y control de accesos (Super Admin)',
    superAdminOnly: true
  }
];

export const DEFAULT_PERMISSIONS = {
  superadmin: {
    inventory: true,
    sales: true,
    employees: true,
    reports: true,
    settings: true,
    roles: true
  },
  admin: {
    inventory: true,
    sales: true,
    employees: true,
    reports: true,
    settings: true,
    roles: false // Exclusivo del Super Administrador
  },
  empleado: {
    inventory: false,
    sales: true,
    employees: false,
    reports: true,
    settings: false,
    roles: false
  }
};

// =========================================================================
// AUTH CONTEXT & PROVIDER
// =========================================================
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Usuario autenticado actual
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('smartbakery_auth_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Error al recuperar sesión previa:', e);
    }
    // Por defecto iniciamos con null para forzar login o pre-autenticado según necesidad
    return null;
  });

  // Matriz de permisos personalizable por rol
  const [permissions, setPermissions] = useState(() => {
    try {
      const savedPerms = localStorage.getItem('smartbakery_role_permissions');
      if (savedPerms) {
        return JSON.parse(savedPerms);
      }
    } catch (e) {
      console.error('Error al leer permisos guardados:', e);
    }
    return DEFAULT_PERMISSIONS;
  });

  // Guardar cambios de permisos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartbakery_role_permissions', JSON.stringify(permissions));
    } catch (e) {
      console.error('Error al guardar permisos en localStorage:', e);
    }
  }, [permissions]);

  // Guardar usuario en localStorage al cambiar de sesión
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('smartbakery_auth_user', JSON.stringify(currentUser));
        localStorage.setItem('smartbakery_role', currentUser.role.toUpperCase());
      } else {
        localStorage.removeItem('smartbakery_auth_user');
        localStorage.removeItem('smartbakery_role');
      }
    } catch (e) {
      console.error('Error al guardar usuario en localStorage:', e);
    }
  }, [currentUser]);

  // Iniciar sesión
  const login = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const targetUser = MOCK_USERS[cleanUser];

    if (!targetUser) {
      return {
        success: false,
        message: 'El usuario ingresado no existe en el sistema.'
      };
    }

    if (targetUser.password !== cleanPass) {
      return {
        success: false,
        message: 'Contraseña incorrecta. Verifica tus credenciales.'
      };
    }

    const sessionData = {
      id: targetUser.id,
      username: targetUser.username,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      roleLabel: targetUser.roleLabel,
      roleShort: targetUser.roleShort,
      badgeColor: targetUser.badgeColor,
      badgeBg: targetUser.badgeBg,
      avatar: targetUser.avatar,
      loginTimestamp: new Date().toISOString()
    };

    setCurrentUser(sessionData);
    return {
      success: true,
      user: sessionData
    };
  };

  // Cerrar sesión
  const logout = () => {
    setCurrentUser(null);
  };

  // Alternar o cambiar rápidamente de rol (útil para pruebas)
  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      const u = MOCK_USERS[roleKey];
      const sessionData = {
        id: u.id,
        username: u.username,
        name: u.name,
        email: u.email,
        role: u.role,
        roleLabel: u.roleLabel,
        roleShort: u.roleShort,
        badgeColor: u.badgeColor,
        badgeBg: u.badgeBg,
        avatar: u.avatar,
        loginTimestamp: new Date().toISOString()
      };
      setCurrentUser(sessionData);
    }
  };

  // Validar si el usuario actual tiene acceso a un módulo específico
  const hasPermission = (moduleId) => {
    if (!currentUser) return false;
    const role = currentUser.role;

    // Super Admin siempre tiene acceso a todo de forma incondicional
    if (role === 'superadmin') return true;

    // Módulo de roles es estrictamente para superadmin
    if (moduleId === 'roles') return false;

    // Consultar matriz activa de permisos
    const rolePerms = permissions[role];
    if (!rolePerms) return false;

    return Boolean(rolePerms[moduleId]);
  };

  // Actualizar un permiso específico en la matriz (usado por el Super Admin)
  const togglePermission = (roleKey, moduleId) => {
    if (roleKey === 'superadmin' && moduleId === 'roles') {
      // El superadmin nunca puede quitarse a sí mismo el acceso a roles
      return;
    }

    setPermissions((prev) => {
      const currentRolePerms = prev[roleKey] || {};
      const currentVal = Boolean(currentRolePerms[moduleId]);
      return {
        ...prev,
        [roleKey]: {
          ...currentRolePerms,
          [moduleId]: !currentVal
        }
      };
    });
  };

  // Restablecer permisos a los valores de fábrica
  const resetPermissions = () => {
    setPermissions(DEFAULT_PERMISSIONS);
  };

  // Obtener ruta inicial recomendada según los permisos del usuario
  const getDefaultRoute = (role = currentUser?.role) => {
    if (!role) return '/login';
    const rolePerms = permissions[role] || {};

    if (rolePerms.inventory) return '/inventory';
    if (rolePerms.sales) return '/sales';
    if (rolePerms.reports) return '/reports';
    if (rolePerms.employees) return '/employees';
    if (rolePerms.settings) return '/settings';
    if (rolePerms.roles) return '/roles';
    return '/sales';
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        role: currentUser?.role || null,
        permissions,
        login,
        logout,
        switchRole,
        hasPermission,
        togglePermission,
        resetPermissions,
        getDefaultRoute
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
