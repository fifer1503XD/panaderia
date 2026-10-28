import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ compact = false, showLabel = true }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${compact ? 'is-compact' : ''}`}
      onClick={toggleTheme}
      title={isDark ? 'Cambiar a Modo Claro' : 'Activar Modo Oscuro (Descanso Visual)'}
      aria-label="Alternar modo de pantalla"
    >
      <div className="theme-toggle-pill-track">
        <span className="theme-icon sun-icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.25"/>
            <line x1="12" y1="1.5" x2="12" y2="3.5"/>
            <line x1="12" y1="20.5" x2="12" y2="22.5"/>
            <line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/>
            <line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/>
            <line x1="1.5" y1="12" x2="3.5" y2="12"/>
            <line x1="20.5" y1="12" x2="22.5" y2="12"/>
            <line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/>
            <line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/>
          </svg>
        </span>
        <span className="theme-icon moon-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.3"/>
          </svg>
        </span>
        <span className="theme-toggle-thumb" />
      </div>

      {showLabel && !compact && (
        <span className="theme-toggle-text">
          {isDark ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
