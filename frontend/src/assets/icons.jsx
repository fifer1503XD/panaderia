import React from 'react';

// Tuttis Brand Logo
export const TuttisLogo = ({ size = 68, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Teal Circle with subtle glow */}
    <circle cx="50" cy="50" r="46" fill="#2DA5A3" />
    <circle cx="50" cy="50" r="43" stroke="#F1846A" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="40" stroke="#FFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
    
    {/* Wheat ear leaves in coral/gold at bottom left */}
    <g transform="translate(14, 60) rotate(-40) scale(0.65)">
      <path d="M10,25 C10,12 25,0 40,0 C30,15 20,25 10,25 Z" fill="#F49A70"/>
      <path d="M22,18 C28,8 40,3 52,5 C42,16 32,22 22,18 Z" fill="#E87652"/>
      <path d="M4,34 C12,24 24,20 36,24 C26,34 16,38 4,34 Z" fill="#F5B291"/>
      <path d="M15,2 M25,12 M35,22" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6"/>
    </g>

    {/* Tuttis cursive script text */}
    <g transform="translate(18, 26)">
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="'Playfair Display', 'Brush Script MT', cursive, Georgia, serif"
        fontStyle="italic"
        fontWeight="800"
        fontSize="27"
        letterSpacing="0.5"
        style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.25))" }}
      >
        Tuttis
      </text>
    </g>
  </svg>
);

// Admin Avatar
export const AdminAvatar = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="2"/>
    {/* Head & Hair */}
    <circle cx="20" cy="16" r="9" fill="#F87171"/>
    <circle cx="20" cy="17" r="7" fill="#FDE68A"/>
    {/* Hair curls */}
    <path d="M13,16 C13,10 18,8 24,9 C27,10 27,14 27,15 C25,12 21,12 18,14 C15,16 14,19 13,16 Z" fill="#78350F"/>
    {/* Eyes & Smile */}
    <circle cx="17.5" cy="16.5" r="1" fill="#451A03"/>
    <circle cx="22.5" cy="16.5" r="1" fill="#451A03"/>
    <path d="M18.5,19 Q20,21 21.5,19" stroke="#451A03" strokeWidth="1" strokeLinecap="round" fill="none"/>
    {/* Baker / Chef Apron & Shirt */}
    <path d="M10,36 C10,27 15,25 20,25 C25,25 30,27 30,36 Z" fill="#0E7C86"/>
    <path d="M16,25 L24,25 L22,34 L18,34 Z" fill="#FFFFFF"/>
    <path d="M19,27 L21,27" stroke="#0E7C86" strokeWidth="1"/>
  </svg>
);

// Sidebar: Croissant Icon (Inventario)
export const IconCroissant = ({ size = 26, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.5 13.5c1-1.5 1.5-3.5 1-5.5-1-3-4-4.5-8-4-4 .5-7 2.5-8.5 5.5-1 2-.5 4.5.5 6 1.5 2 4 3 7 3s5.5-1 8-5z" />
    <path d="M8 8.5c1.5 2 2.5 5 2.5 7.5" />
    <path d="M13.5 8c.5 2.5 0 5.5-1 8" />
    <path d="M5.5 11c1 1.5 1.5 3 1.5 4.5" />
  </svg>
);

// Sidebar: Ventas / Coins Icon
export const IconVentas = ({ size = 26, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="9" cy="7" rx="6" ry="3"/>
    <path d="M3 7v4c0 1.66 2.69 3 6 3s6-1.34 6-3V7"/>
    <path d="M3 11v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4"/>
    <path d="M14.5 10.5c2.3.4 4.5 1.4 4.5 2.5v4c0 1.66-2.69 3-6 3-1.2 0-2.3-.2-3.2-.6"/>
    <circle cx="9" cy="7" r="1.5" fill={color} opacity="0.4"/>
  </svg>
);

// Sidebar: Clientes / Loyalty Icon (Hand with stars)
export const IconClientes = ({ size = 26, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.5.5 2.5 1.5 2.5 2.5 0 2-3.5 3.5-7.5 3.5-3 0-5.5-.8-7-2l-3-1c-.5-.2-.7-.7-.5-1.2.2-.4.7-.6 1.2-.5l2.8.9c1 .3 2.5.8 4.5.8 3 0 5-1 5-2 0-.6-.5-1.2-1.5-1.5"/>
    <path d="M5 8l1.5-2.5L9 6 7.5 8.5z" strokeWidth="1.2"/>
    <path d="M12 4l1.5-2.5L16 2l-1.5 2.5z" strokeWidth="1.2"/>
    <path d="M18 7l1.5-2.5L22 5l-1.5 2.5z" strokeWidth="1.2"/>
  </svg>
);

// Sidebar: Empleados / Team Icon
export const IconEmpleados = ({ size = 26, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// Sidebar: Reportes / Analytics Icon
export const IconReportes = ({ size = 26, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="M7 16l4-6 4 3 5-7"/>
    <rect x="6" y="14" width="2" height="4" rx="0.5" fill={color} opacity="0.3"/>
    <rect x="11" y="11" width="2" height="7" rx="0.5" fill={color} opacity="0.3"/>
    <rect x="16" y="7" width="2" height="11" rx="0.5" fill={color} opacity="0.3"/>
  </svg>
);

// Sidebar: Configuración / Tools Icon
export const IconConfiguracion = ({ size = 26, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="18" rx="2"/>
    <circle cx="6.5" cy="18" r="1" fill={color}/>
    <path d="M15 6a3 3 0 0 0-3 3v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V9a3 3 0 0 0-3-3z"/>
    <path d="M15 11v6"/>
    <path d="M12 17h6"/>
  </svg>
);

// Search Magnifying Glass Icon
export const IconSearch = ({ size = 22, color = "#8E8E8E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10.5" cy="10.5" r="7.5"/>
    <line x1="16" y1="16" x2="21.5" y2="21.5"/>
  </svg>
);

// Filter Sliders Icon
export const IconFilter = ({ size = 22, color = "#8E8E8E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <circle cx="9" cy="6" r="2.5" fill="#FFF" stroke={color} strokeWidth="2"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <circle cx="15" cy="12" r="2.5" fill="#FFF" stroke={color} strokeWidth="2"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="8" cy="18" r="2.5" fill="#FFF" stroke={color} strokeWidth="2"/>
  </svg>
);

// Edit Pencil Icon
export const IconEdit = ({ size = 18, color = "#168D8A" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

// Trash Can Delete Icon
export const IconTrash = ({ size = 18, color = "#D32F2F" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

// Chevron Down Icon
export const IconChevronDown = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
