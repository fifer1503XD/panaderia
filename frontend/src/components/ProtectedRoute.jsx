import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, MODULE_DEFINITIONS } from '../context/AuthContext';
import { IconLock } from '../assets/icons';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { isAuthenticated, currentUser, hasPermission, getDefaultRoute, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si la ruta requiere un permiso específico y el usuario no lo tiene
  if (requiredPermission && !hasPermission(requiredPermission)) {
    const currentModule = MODULE_DEFINITIONS.find((m) => m.id === requiredPermission);
    const targetLabel = currentModule ? currentModule.label : requiredPermission;
    const defaultAllowedRoute = getDefaultRoute();

    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-divider)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Icono de Candado / Alerta */}
          <div 
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '22px',
              background: 'rgba(211, 47, 47, 0.12)',
              color: 'var(--status-alerta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 20px rgba(211, 47, 47, 0.15)'
            }}
          >
            <IconLock size={38} color="var(--status-alerta)" />
          </div>

          <span 
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--status-alerta)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0.4rem'
            }}
          >
            Acceso Restringido por Rol
          </span>

          <h2 
            style={{
              fontSize: '1.65rem',
              color: 'var(--text-dark)',
              fontWeight: 800,
              margin: '0 0 0.75rem 0',
              letterSpacing: '-0.5px'
            }}
          >
            No tienes permiso para ingresar
          </h2>

          <p 
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              margin: '0 0 1.5rem 0'
            }}
          >
            El módulo <strong style={{ color: 'var(--text-dark)' }}>{targetLabel}</strong> no está habilitado para tu nivel de acceso.
          </p>

          {/* Tarjeta con información del perfil actual */}
          <div 
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-divider)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: currentUser?.badgeBg || 'var(--pill-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
              >
                {currentUser?.avatar || '👤'}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-dark)' }}>
                  {currentUser?.name}
                </strong>
                <small style={{ color: 'var(--text-muted)' }}>@{currentUser?.username}</small>
              </div>
            </div>

            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: currentUser?.badgeColor || 'var(--primary-teal)',
                background: currentUser?.badgeBg || 'var(--pill-bg)',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px'
              }}
            >
              {currentUser?.roleShort}
            </span>
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', flexDirection: 'column' }}>
            <button
              type="button"
              onClick={() => navigate(defaultAllowedRoute, { replace: true })}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                background: 'var(--primary-teal)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 12px rgba(14, 124, 134, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              Ir a mis módulos autorizados →
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                border: '1px solid var(--border-divider)',
                transition: 'all 0.2s ease'
              }}
            >
              Iniciar sesión con otra cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Acceso autorizado
  return children;
};

export default ProtectedRoute;
