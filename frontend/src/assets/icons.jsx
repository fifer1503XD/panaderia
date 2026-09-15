import tuttisLogoImg from './logo.png';
import iconInventarioImg from './icons/icon-inventario.png';
import iconVentasImg from './icons/icon-ventas.png';
import iconClientesImg from './icons/icon-clientes.png';
import iconEmpleadosImg from './icons/icon-empleados.png';
import iconReportesImg from './icons/icon-reportes.png';

// Tuttis Brand Logo
export const TuttisLogo = ({ size = 68, className = "" }) => (
  <img
    src={tuttisLogoImg}
    alt="Tuttis"
    width={size}
    height={size}
    className={`tuttis-brand-logo ${className}`}
    style={{ objectFit: 'contain', display: 'inline-block' }}
  />
);

// Generic dynamic color mask icon component
export const MaskIcon = ({ src, size = 26, color = "currentColor", className = "", alt = "" }) => (
  <span
    className={`area-icon-mask ${className}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      display: 'inline-block',
      backgroundColor: color === 'currentColor' ? 'currentColor' : color,
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      flexShrink: 0,
      verticalAlign: 'middle',
    }}
    aria-label={alt}
  />
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
export const IconCroissant = ({ size = 26, color = "currentColor", className = "" }) => (
  <MaskIcon src={iconInventarioImg} size={size} color={color} className={className} alt="Inventario" />
);

// Sidebar: Ventas / Coins Icon (Ventas)
export const IconVentas = ({ size = 26, color = "currentColor", className = "" }) => (
  <MaskIcon src={iconVentasImg} size={size} color={color} className={className} alt="Ventas" />
);

// Sidebar: Clientes / Stars Icon (Clientes)
export const IconClientes = ({ size = 26, color = "currentColor", className = "" }) => (
  <MaskIcon src={iconClientesImg} size={size} color={color} className={className} alt="Clientes" />
);

// Sidebar: Empleados / Team Icon (Empleados)
export const IconEmpleados = ({ size = 26, color = "currentColor", className = "" }) => (
  <MaskIcon src={iconEmpleadosImg} size={size} color={color} className={className} alt="Empleados" />
);

// Sidebar: Reportes / Analytics Bar Chart Icon (Reportes)
export const IconReportes = ({ size = 26, color = "currentColor", className = "" }) => (
  <MaskIcon src={iconReportesImg} size={size} color={color} className={className} alt="Reportes" />
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
