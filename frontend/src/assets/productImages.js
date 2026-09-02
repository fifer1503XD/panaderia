// SVGs y miniaturas de alta calidad para productos de panadería

export const PRODUCT_IMAGES = {
  croissant: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="cr-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCD34D"/>
          <stop offset="35%" stop-color="#F59E0B"/>
          <stop offset="70%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#92400E"/>
        </linearGradient>
        <radialGradient id="cr-shine" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#78350F" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <!-- Base crescent -->
        <path d="M18,65 C12,50 20,32 38,24 C55,16 75,22 86,40 C93,52 88,68 76,74 C62,80 32,80 18,65 Z" fill="url(#cr-body)"/>
        <!-- Segments -->
        <path d="M30,34 C42,26 58,26 70,36 C64,48 54,64 42,70 C32,62 26,48 30,34 Z" fill="#EA580C" opacity="0.35"/>
        <path d="M42,28 C54,24 66,28 74,40 C68,52 56,66 48,70 C40,62 38,44 42,28 Z" fill="#FBBF24" opacity="0.45"/>
        <!-- Flaky crust layers -->
        <path d="M24,56 C32,45 48,40 68,46 C62,56 46,68 34,68 C28,68 25,62 24,56 Z" fill="url(#cr-shine)"/>
        <path d="M28,48 C36,38 52,36 66,42" stroke="#78350F" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
        <path d="M35,58 C44,50 56,48 72,54" stroke="#78350F" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
        <path d="M44,66 C52,60 62,58 76,64" stroke="#78350F" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.3"/>
      </g>
    </svg>
  `)}`,

  cinnamonRoll: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <radialGradient id="roll-bg" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="40%" stop-color="#D97706"/>
          <stop offset="85%" stop-color="#92400E"/>
          <stop offset="100%" stop-color="#78350F"/>
        </radialGradient>
        <filter id="roll-sh" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#451A03" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#roll-sh)">
        <ellipse cx="50" cy="50" rx="40" ry="38" fill="url(#roll-bg)"/>
        <!-- Cinnamon spiral swirl -->
        <path d="M50,50 
                 C52,44 44,42 42,48 
                 C39,56 55,60 60,52 
                 C66,42 50,30 36,36 
                 C22,42 22,66 40,74 
                 C60,82 80,68 78,44 
                 C76,24 46,16 28,26" 
              fill="none" stroke="#451A03" stroke-width="5.5" stroke-linecap="round"/>
        <!-- White Sugar Glaze drops -->
        <path d="M45,46 C48,45 52,48 50,51 C48,53 43,50 45,46 Z" fill="#FFFBEB" opacity="0.9"/>
        <path d="M35,38 C42,34 50,36 46,42 C40,46 32,42 35,38 Z" fill="#FFFFFF" opacity="0.85"/>
        <path d="M56,58 C62,54 70,58 66,66 C60,70 54,64 56,58 Z" fill="#FFFFFF" opacity="0.9"/>
        <path d="M30,55 C34,52 38,58 35,64 C30,66 26,60 30,55 Z" fill="#FFFBEB" opacity="0.85"/>
      </g>
    </svg>
  `)}`,

  chocolateCake: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="choco-layer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#5B2E1E"/>
          <stop offset="50%" stop-color="#3D1D13"/>
          <stop offset="100%" stop-color="#261009"/>
        </linearGradient>
        <linearGradient id="cream-layer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7C3F2B"/>
          <stop offset="100%" stop-color="#552617"/>
        </linearGradient>
        <filter id="cake-sh" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1A0A05" flood-opacity="0.35"/>
        </filter>
      </defs>
      <g filter="url(#cake-sh)">
        <!-- Cake Slice Side -->
        <path d="M18,68 L58,82 L86,48 L46,34 Z" fill="url(#choco-layer)"/>
        <!-- Sponge Layers -->
        <path d="M18,60 L58,74 L86,40 L46,26 Z" fill="url(#cream-layer)" opacity="0.8"/>
        <path d="M18,52 L58,66 L86,32 L46,18 Z" fill="url(#choco-layer)"/>
        <!-- Cream fillings -->
        <path d="M18,60 L58,74" stroke="#FFF" stroke-width="2.5" opacity="0.4"/>
        <path d="M18,52 L58,66" stroke="#FFF" stroke-width="2.5" opacity="0.4"/>
        <!-- Chocolate Top Frosting -->
        <path d="M18,52 L46,18 L86,32 L58,66 Z" fill="#2E1209"/>
        <!-- Texture & Rosette on top -->
        <ellipse cx="62" cy="35" rx="10" ry="7" fill="#421C0E"/>
        <ellipse cx="62" cy="33" rx="7" ry="5" fill="#5C2714"/>
        <path d="M60,28 C64,25 66,32 62,35 C58,32 60,28 60,28 Z" fill="#88381D"/>
        <!-- Chocolate sprinkles -->
        <circle cx="35" cy="42" r="1.5" fill="#D97706" opacity="0.8"/>
        <circle cx="48" cy="46" r="1.5" fill="#D97706" opacity="0.8"/>
        <circle cx="70" cy="40" r="1.5" fill="#D97706" opacity="0.8"/>
      </g>
    </svg>
  `)}`,

  baguette: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="bag-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCD34D"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-30 50 50)">
        <rect x="15" y="40" width="70" height="20" rx="10" fill="url(#bag-grad)"/>
        <path d="M30,42 Q35,50 32,58 M45,42 Q50,50 47,58 M60,42 Q65,50 62,58 M75,42 Q80,50 77,58" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
      </g>
    </svg>
  `)}`,

  muffin: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="muf-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FBBF24"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#92400E"/>
        </linearGradient>
      </defs>
      <!-- Cup -->
      <polygon points="30,55 70,55 64,85 36,85" fill="#CBD5E1"/>
      <line x1="38" y1="55" x2="42" y2="85" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="50" y1="55" x2="50" y2="85" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="62" y1="55" x2="58" y2="85" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Dome -->
      <path d="M22,55 C20,40 35,25 50,25 C65,25 80,40 78,55 Z" fill="url(#muf-top)"/>
      <!-- Blueberries -->
      <circle cx="42" cy="38" r="4.5" fill="#4338CA"/>
      <circle cx="58" cy="42" r="4" fill="#3730A3"/>
      <circle cx="50" cy="50" r="3.5" fill="#4F46E5"/>
    </svg>
  `)}`,

  donut: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <radialGradient id="don-base" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="70%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#B45309"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill="url(#don-base)"/>
      <!-- Pink Glaze -->
      <path d="M50,15 C68,15 85,30 85,50 C85,60 80,68 74,72 C70,68 64,72 60,70 C54,74 48,70 44,74 C38,68 32,74 26,70 C18,64 15,58 15,50 C15,30 32,15 50,15 Z" fill="#EC4899"/>
      <!-- Center Hole -->
      <circle cx="50" cy="50" r="14" fill="#F8F9FA"/>
      <!-- Sprinkles -->
      <rect x="36" y="28" width="8" height="3" rx="1.5" fill="#FBBF24" transform="rotate(25 36 28)"/>
      <rect x="62" y="32" width="8" height="3" rx="1.5" fill="#3B82F6" transform="rotate(-30 62 32)"/>
      <rect x="68" y="52" width="8" height="3" rx="1.5" fill="#10B981" transform="rotate(45 68 52)"/>
      <rect x="30" y="55" width="8" height="3" rx="1.5" fill="#FFFFFF" transform="rotate(-15 30 55)"/>
    </svg>
  `)}`
};

export const getProductImage = (name = '', code = '') => {
  const query = (name + ' ' + code).toLowerCase();
  if (query.includes('croissant') || query.includes('cr001')) return PRODUCT_IMAGES.croissant;
  if (query.includes('canela') || query.includes('rollo') || query.includes('cr002')) return PRODUCT_IMAGES.cinnamonRoll;
  if (query.includes('torta') || query.includes('chocolate') || query.includes('pastel') || query.includes('rp001')) return PRODUCT_IMAGES.chocolateCake;
  if (query.includes('baguette') || query.includes('pan') || query.includes('frances')) return PRODUCT_IMAGES.baguette;
  if (query.includes('muffin') || query.includes('ponque') || query.includes('cupcake')) return PRODUCT_IMAGES.muffin;
  if (query.includes('dona') || query.includes('donut')) return PRODUCT_IMAGES.donut;
  return PRODUCT_IMAGES.croissant;
};
