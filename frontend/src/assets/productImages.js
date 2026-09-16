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
  `)}`,

  hotDrink: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="cup-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="50%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <radialGradient id="coffee-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#92400E"/>
          <stop offset="70%" stop-color="#78350F"/>
          <stop offset="100%" stop-color="#451A03"/>
        </radialGradient>
      </defs>
      <!-- Steam -->
      <path d="M40,22 Q36,14 42,8" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M50,20 Q46,10 52,5" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M60,22 Q56,14 62,8" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
      <!-- Saucer -->
      <ellipse cx="50" cy="85" rx="38" ry="8" fill="#CBD5E1"/>
      <ellipse cx="50" cy="83" rx="34" ry="6" fill="#F1F5F9"/>
      <!-- Cup Handle -->
      <path d="M68,42 C82,42 84,68 68,68" stroke="url(#cup-grad)" stroke-width="6" stroke-linecap="round" fill="none"/>
      <!-- Cup Body -->
      <path d="M22,35 L28,75 C30,82 70,82 72,75 L78,35 Z" fill="url(#cup-grad)"/>
      <!-- Cup Rim & Coffee Surface -->
      <ellipse cx="50" cy="35" rx="28" ry="9" fill="#E2E8F0"/>
      <ellipse cx="50" cy="35" rx="25" ry="7" fill="url(#coffee-grad)"/>
      <!-- Latte Art Heart -->
      <path d="M50,38 C46,32 40,34 44,38 C47,40 50,42 50,42 C50,42 53,40 56,38 C60,34 54,32 50,38 Z" fill="#FEF3C7" opacity="0.9"/>
    </svg>
  `)}`,

  coldDrink: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="juice-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="50%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#0369A1"/>
        </linearGradient>
      </defs>
      <!-- Straw -->
      <path d="M55,10 L45,35 L42,75" stroke="#EC4899" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Glass Cup -->
      <path d="M25,28 L32,85 C33,88 67,88 68,85 L75,28 Z" fill="#E0F2FE" opacity="0.5" stroke="#BAE6FD" stroke-width="2"/>
      <!-- Liquid Fill -->
      <path d="M28,40 L33,82 C34,85 66,85 67,82 L72,40 Z" fill="url(#juice-grad)" opacity="0.9"/>
      <!-- Ice Cubes -->
      <rect x="38" y="46" width="11" height="11" rx="2" fill="#FFFFFF" opacity="0.65"/>
      <rect x="52" y="54" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.6"/>
      <!-- Lemon Slice on Rim -->
      <circle cx="30" cy="28" r="10" fill="#FBBF24"/>
      <circle cx="30" cy="28" r="8" fill="#FDE68A"/>
    </svg>
  `)}`,

  gaseosa: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="can-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#991B1B"/>
          <stop offset="25%" stop-color="#DC2626"/>
          <stop offset="60%" stop-color="#EF4444"/>
          <stop offset="100%" stop-color="#7F1D1D"/>
        </linearGradient>
        <linearGradient id="metal-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#94A3B8"/>
          <stop offset="50%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
      </defs>
      <!-- Can Shadow -->
      <ellipse cx="50" cy="88" rx="22" ry="5" fill="#000" opacity="0.2"/>
      <!-- Can Body -->
      <rect x="32" y="25" width="36" height="58" rx="6" fill="url(#can-body)"/>
      <!-- Top Metal Rim -->
      <ellipse cx="50" cy="25" rx="18" ry="5" fill="url(#metal-top)"/>
      <ellipse cx="50" cy="24" rx="14" ry="3.5" fill="#CBD5E1"/>
      <circle cx="50" cy="24" r="2.5" fill="#475569"/>
      <!-- Bottom Rim -->
      <ellipse cx="50" cy="83" rx="18" ry="4" fill="url(#metal-top)"/>
      <!-- Wave / Soda Label Wave -->
      <path d="M32,48 Q42,60 50,48 T68,54 L68,64 Q58,54 50,64 T32,58 Z" fill="#FFFFFF" opacity="0.9"/>
      <circle cx="42" cy="40" r="1.5" fill="#FFF" opacity="0.7"/>
      <circle cx="58" cy="70" r="2" fill="#FFF" opacity="0.7"/>
    </svg>
  `)}`,

  lacteos: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="bottle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#DBEAFE"/>
          <stop offset="40%" stop-color="#FFFFFF"/>
          <stop offset="80%" stop-color="#EFF6FF"/>
          <stop offset="100%" stop-color="#BFDBFE"/>
        </linearGradient>
      </defs>
      <!-- Bottle Shadow -->
      <ellipse cx="50" cy="88" rx="20" ry="4" fill="#000" opacity="0.18"/>
      <!-- Bottle Body -->
      <path d="M42,24 L42,32 C34,38 32,45 32,54 L32,82 C32,86 68,86 68,82 L68,54 C68,45 66,38 58,32 L58,24 Z" fill="url(#bottle-grad)" stroke="#93C5FD" stroke-width="1.5"/>
      <!-- Cap -->
      <rect x="40" y="16" width="20" height="8" rx="3" fill="#2563EB"/>
      <!-- Blue Dairy Label -->
      <rect x="33" y="52" width="34" height="22" rx="4" fill="#3B82F6"/>
      <!-- Cow / Drop icon on label -->
      <ellipse cx="50" cy="63" rx="6" ry="6" fill="#FFFFFF"/>
      <path d="M50,58 Q46,65 50,68 Q54,65 50,58 Z" fill="#2563EB"/>
    </svg>
  `)}`,

  pasabocas: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <radialGradient id="empanada-grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="50%" stop-color="#EAB308"/>
          <stop offset="85%" stop-color="#CA8A04"/>
          <stop offset="100%" stop-color="#854D0E"/>
        </radialGradient>
      </defs>
      <!-- Empanada crescent -->
      <path d="M18,65 C18,32 50,18 78,35 C88,43 90,60 80,70 C56,76 32,74 18,65 Z" fill="url(#empanada-grad)"/>
      <!-- Crimped edge pattern (repulgue) -->
      <path d="M18,65 Q25,58 26,67 Q34,60 36,69 Q44,62 46,71 Q54,64 56,72 Q64,65 67,72 Q74,66 80,70" stroke="#713F12" stroke-width="2.5" fill="none" opacity="0.5"/>
      <!-- Golden bake dots -->
      <circle cx="45" cy="42" r="1.5" fill="#713F12" opacity="0.4"/>
      <circle cx="60" cy="46" r="2" fill="#713F12" opacity="0.4"/>
      <circle cx="36" cy="52" r="1.5" fill="#713F12" opacity="0.4"/>
    </svg>
  `)}`,

  desayunos: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <radialGradient id="plate-grad" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="80%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </radialGradient>
      </defs>
      <!-- Plate -->
      <ellipse cx="50" cy="52" rx="42" ry="36" fill="url(#plate-grad)" stroke="#94A3B8" stroke-width="1.5"/>
      <ellipse cx="50" cy="52" rx="32" ry="26" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
      <!-- Fried Egg White -->
      <path d="M32,48 C30,40 40,32 50,34 C58,35 64,42 62,50 C60,58 50,62 40,60 C32,58 33,52 32,48 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <!-- Egg Yolk -->
      <circle cx="46" cy="46" r="8" fill="#F59E0B"/>
      <circle cx="44" cy="44" r="2.5" fill="#FEF3C7"/>
      <!-- Bacon / Sausage strips -->
      <path d="M56,38 Q64,42 70,36" stroke="#991B1B" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M54,46 Q62,50 68,44" stroke="#B91C1C" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>
  `)}`,

  combos: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="combo-box" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A855F7"/>
          <stop offset="100%" stop-color="#6B21A8"/>
        </linearGradient>
      </defs>
      <!-- Combo Box -->
      <rect x="22" y="38" width="56" height="46" rx="8" fill="url(#combo-box)"/>
      <path d="M22,50 L78,50" stroke="#C084FC" stroke-width="2"/>
      <!-- Croissant & Drink inside -->
      <!-- Cup sticking out -->
      <rect x="52" y="18" width="18" height="26" rx="3" fill="#0284C7"/>
      <path d="M60,10 L60,20" stroke="#EC4899" stroke-width="3" stroke-linecap="round"/>
      <!-- Croissant sticking out -->
      <path d="M28,34 C26,24 38,18 46,24 C50,28 48,36 42,38 Z" fill="#F59E0B"/>
      <!-- Star badge -->
      <circle cx="50" cy="64" r="10" fill="#FBBF24"/>
      <path d="M50,57 L52,62 L57,62 L53,65 L55,70 L50,67 L45,70 L47,65 L43,62 L48,62 Z" fill="#78350F"/>
    </svg>
  `)}`,

  varios: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="bag-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D4A373"/>
          <stop offset="100%" stop-color="#A9714B"/>
        </linearGradient>
      </defs>
      <!-- Bakery Paper Bag -->
      <path d="M26,35 L30,84 C30,86 70,86 70,84 L74,35 Z" fill="url(#bag-body)"/>
      <!-- Fold lines -->
      <polygon points="26,35 34,42 66,42 74,35 68,32 32,32" fill="#BA8255"/>
      <!-- Handles / wheat stamp -->
      <circle cx="50" cy="58" r="12" fill="#EAD7C5" opacity="0.9"/>
      <path d="M50,50 L50,66 M46,54 L50,58 L54,54 M46,60 L50,64 L54,60" stroke="#8A5832" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `)}`
};

export const getProductImage = (name = '', code = '', department = '') => {
  const query = (name + ' ' + code + ' ' + department).toLowerCase();

  // 1. Check specific bakery products
  if (query.includes('croissant') || query.includes('cr001')) return PRODUCT_IMAGES.croissant;
  if (query.includes('canela') || query.includes('rollo') || query.includes('cr002')) return PRODUCT_IMAGES.cinnamonRoll;
  if (query.includes('torta') || query.includes('chocolate') || query.includes('pastel') || query.includes('rp001')) return PRODUCT_IMAGES.chocolateCake;
  if (query.includes('baguette') || query.includes('pan ') || query.includes('frances')) return PRODUCT_IMAGES.baguette;
  if (query.includes('muffin') || query.includes('ponque') || query.includes('cupcake')) return PRODUCT_IMAGES.muffin;
  if (query.includes('dona') || query.includes('donut')) return PRODUCT_IMAGES.donut;

  // 2. Check beverages & sodas
  if (query.includes('caliente') || query.includes('cafe') || query.includes('tinto') || query.includes('capuchino') || query.includes('aromatica') || query.includes('te')) {
    return PRODUCT_IMAGES.hotDrink;
  }
  if (query.includes('gaseosa') || query.includes('coca') || query.includes('pepsi') || query.includes('quatro') || query.includes('sprite') || query.includes('soda')) {
    return PRODUCT_IMAGES.gaseosa;
  }
  if (query.includes('fria') || query.includes('fría') || query.includes('jugo') || query.includes('smoothie') || query.includes('granizado') || query.includes('agua')) {
    return PRODUCT_IMAGES.coldDrink;
  }

  // 3. Check dairy (lácteos)
  if (query.includes('lacteo') || query.includes('lácteo') || query.includes('leche') || query.includes('yogur') || query.includes('queso') || query.includes('kumis')) {
    return PRODUCT_IMAGES.lacteos;
  }

  // 4. Check pasabocas
  if (query.includes('pasaboca') || query.includes('empanada') || query.includes('pandebono') || query.includes('buñuelo') || query.includes('dedito') || query.includes('pastel gloria')) {
    return PRODUCT_IMAGES.pasabocas;
  }

  // 5. Check breakfasts (desayunos)
  if (query.includes('desayun') || query.includes('huevo') || query.includes('calentado') || query.includes('waffle')) {
    return PRODUCT_IMAGES.desayunos;
  }

  // 6. Check combos
  if (query.includes('combo') || query.includes('promocion') || query.includes('paquete')) {
    return PRODUCT_IMAGES.combos;
  }

  // 7. Check by category name
  const dept = (department || '').toUpperCase();
  if (dept.includes('PAN')) return PRODUCT_IMAGES.croissant;
  if (dept.includes('REPOST')) return PRODUCT_IMAGES.chocolateCake;
  if (dept.includes('PASA')) return PRODUCT_IMAGES.pasabocas;
  if (dept.includes('DESAYUN')) return PRODUCT_IMAGES.desayunos;
  if (dept.includes('COMBO')) return PRODUCT_IMAGES.combos;
  if (dept.includes('CALIENTE')) return PRODUCT_IMAGES.hotDrink;
  if (dept.includes('FRIA') || dept.includes('FRÍA')) return PRODUCT_IMAGES.coldDrink;
  if (dept.includes('GASEOSA')) return PRODUCT_IMAGES.gaseosa;
  if (dept.includes('LACTEO') || dept.includes('LÁCTEO')) return PRODUCT_IMAGES.lacteos;
  if (dept.includes('VARIO')) return PRODUCT_IMAGES.varios;

  return PRODUCT_IMAGES.croissant;
};
