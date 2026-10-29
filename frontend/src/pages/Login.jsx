import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TuttisLogo, IconLock } from '../assets/icons';
import smartBakeryLogo from '../assets/smart-bakery-logo.png';
import ThemeToggle from '../components/ThemeToggle';
import './Login.css';

const Login = () => {
  const { login, getDefaultRoute, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  // Si ya está autenticado, redirigir al módulo principal
  React.useEffect(() => {
    if (isAuthenticated) {
      const target = location.state?.from?.pathname || getDefaultRoute();
      navigate(target, { replace: true });
    }
  }, [isAuthenticated]);

  // Selección rápida de credenciales de demostración
  const handleQuickPreset = (roleUser, rolePass, presetKey) => {
    setUsername(roleUser);
    setPassword(rolePass);
    setActivePreset(presetKey);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Por favor ingresa tu usuario o correo electrónico.');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);

    // Simular pequeña latencia de autenticación para suavidad visual
    setTimeout(() => {
      const result = login(username, password);

      if (result.success) {
        const fromRoute = location.state?.from?.pathname;
        const targetRoute = fromRoute && fromRoute !== '/login' ? fromRoute : getDefaultRoute(result.user.role);
        navigate(targetRoute, { replace: true });
      } else {
        setError(result.message || 'Credenciales inválidas.');
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div className="login-page-container">
      {/* Botón flotante superior para cambio de tema (Claro / Descanso Visual) */}
      <div className="login-top-bar">
        <div className="login-brand-meta">
          <span className="login-version-tag">SmartBakery BI • v2.4</span>
        </div>
        <div className="login-theme-action">
          <ThemeToggle />
        </div>
      </div>

      <div className="login-main-wrapper">
        {/* Tarjeta Principal de Login */}
        <div className="login-card">
          {/* Encabezado con logotipos combinados Tuttis + SmartBakery */}
          <div className="login-card-header">
            <div className="login-logos-row">
              <div className="login-tuttis-badge">
                <TuttisLogo size={52} />
              </div>
              <div className="login-logo-separator" />
              <img 
                src={smartBakeryLogo} 
                alt="SmartBakery BI" 
                className="login-smartbakery-img"
              />
            </div>
            
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">
              Ingresa al sistema de panadería para acceder a tus módulos autorizados
            </p>
          </div>

          {/* Accesos Rápidos para Pruebas (Roles) */}
          <div className="login-presets-box">
            <span className="login-presets-title">⚡ Ingreso rápido de prueba:</span>
            <div className="login-presets-row">
              <button
                type="button"
                className={`login-preset-pill ${activePreset === 'superadmin' ? 'active superadmin' : ''}`}
                onClick={() => handleQuickPreset('superadmin', 'superadmin', 'superadmin')}
              >
                👑 Superadmin
              </button>

              <button
                type="button"
                className={`login-preset-pill ${activePreset === 'admin' ? 'active admin' : ''}`}
                onClick={() => handleQuickPreset('admin', 'admin', 'admin')}
              >
                🏪 Administrador
              </button>

              <button
                type="button"
                className={`login-preset-pill ${activePreset === 'empleado' ? 'active empleado' : ''}`}
                onClick={() => handleQuickPreset('empleado', 'empleado', 'empleado')}
              >
                🥖 Empleado
              </button>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="login-error-alert" role="alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Formulario de Login */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field-group">
              <label htmlFor="login-username" className="login-label">
                Usuario o Correo
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">👤</span>
                <input
                  id="login-username"
                  type="text"
                  className="login-input"
                  placeholder="superadmin, admin o empleado"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="login-field-group">
              <label htmlFor="login-password" className="login-label">
                Contraseña
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <IconLock size={18} color="var(--text-muted)" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Contraseña del sistema"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner-content">
                  <span className="login-spinner" />
                  Verificando credenciales...
                </span>
              ) : (
                'Ingresar al Sistema →'
              )}
            </button>
          </form>

          {/* Resumen de permisos por rol */}
          <div className="login-roles-guide">
            <div className="roles-guide-header">
              <span>Niveles de Acceso y Segmentación</span>
            </div>
            <div className="roles-guide-list">
              <div className="roles-guide-item">
                <div className="guide-role-badge superadmin">👑 Super Admin</div>
                <div className="guide-role-desc">Acceso total a todo + <strong>Nuevo Menú de Roles</strong></div>
              </div>
              <div className="roles-guide-item">
                <div className="guide-role-badge admin">🏪 Administrador</div>
                <div className="guide-role-desc">Inventario, Ventas, Empleados, Reportes y Configuración</div>
              </div>
              <div className="roles-guide-item">
                <div className="guide-role-badge empleado">🥖 Empleado</div>
                <div className="guide-role-desc">Acceso enfocado a <strong>Ventas (POS)</strong> y <strong>Reportes</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer legal discreto */}
        <div className="login-footer-meta">
          <span>Tuttis Gourmet S.A.S • SmartBakery Business Intelligence</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
