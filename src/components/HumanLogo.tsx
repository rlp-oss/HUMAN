import React, { useState, useEffect } from 'react';

export type SupportedLogoVariant = 
  | 'human-master'
  | 'emerald-cyber'
  | 'tome-crafter'
  | 'rlm-pro-studio'
  | 'forgeos'
  | 'rl-easy-flow'
  | 'custom';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  variant?: SupportedLogoVariant;
  showText?: boolean;
  animated?: boolean;
  customLogoUrl?: string;
  customAppName?: string;
  colorTheme?: 'emerald-neon' | 'natural-olive' | 'warm-clay' | 'dark-slate';
}

/**
 * Emerald / Cyber H.U.M.A.N. Network Vector Icon
 * Matches the turquoise / emerald human artistry network neural circuit aesthetic
 */
export const EmeraldHumanNetworkLogoIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className = '' 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`relative z-10 transition-transform duration-300 ${className}`}
    >
      <defs>
        <radialGradient id="cyberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#064E3B" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="neonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="cyanMint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>

      {/* Dark Cyber Canvas Base */}
      <rect x="6" y="6" width="108" height="108" rx="24" fill="url(#cyberGlow)" stroke="#10B981" strokeWidth="2.5" />

      {/* Outer Hexagonal Geometric Constellation */}
      <polygon 
        points="60,18 96,38 96,82 60,102 24,82 24,38" 
        stroke="url(#neonEmerald)" 
        strokeWidth="1.8" 
        strokeDasharray="4 3" 
        opacity="0.85" 
      />

      {/* Outer Constellation Node Points */}
      <circle cx="60" cy="18" r="3.5" fill="#34D399" />
      <circle cx="96" cy="38" r="3.5" fill="#34D399" />
      <circle cx="96" cy="82" r="3.5" fill="#34D399" />
      <circle cx="60" cy="102" r="3.5" fill="#34D399" />
      <circle cx="24" cy="82" r="3.5" fill="#34D399" />
      <circle cx="24" cy="38" r="3.5" fill="#34D399" />

      {/* Radiating Neural Connections to Center */}
      <line x1="60" y1="18" x2="60" y2="35" stroke="#34D399" strokeWidth="1.5" />
      <line x1="96" y1="38" x2="78" y2="48" stroke="#34D399" strokeWidth="1.5" />
      <line x1="96" y1="82" x2="78" y2="72" stroke="#34D399" strokeWidth="1.5" />
      <line x1="60" y1="102" x2="60" y2="85" stroke="#34D399" strokeWidth="1.5" />
      <line x1="24" y1="82" x2="42" y2="72" stroke="#34D399" strokeWidth="1.5" />
      <line x1="24" y1="38" x2="42" y2="48" stroke="#34D399" strokeWidth="1.5" />

      {/* Human Silhouette & Fingerprint Provenance Core */}
      {/* Head */}
      <circle cx="60" cy="42" r="9" stroke="url(#cyanMint)" strokeWidth="2.4" fill="#047857" fillOpacity="0.4" />
      
      {/* Shoulders & Heart Arcs */}
      <path 
        d="M40 76 C40 60 48 54 60 54 C72 54 80 60 80 76" 
        stroke="url(#cyanMint)" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Fingerprint Provenance Whorls in Center */}
      <path d="M52 64 C52 59 55 57 60 57 C65 57 68 59 68 64" stroke="#A7F3D0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M47 70 C47 62 52 60 60 60 C68 60 73 62 73 70" stroke="#34D399" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="60" cy="65" r="2" fill="#67E8F9" />

      {/* Subtext Accent: HUMAN */}
      <text 
        x="60" 
        y="96" 
        textAnchor="middle" 
        fill="#A7F3D0" 
        fontSize="11" 
        fontWeight="800" 
        fontFamily="monospace" 
        letterSpacing="2.5"
      >
        HUMAN
      </text>
    </svg>
  );
};

/**
 * Natural Olive / Warm Terracotta Official Brand Vector
 */
export const MasterHumanBrandLogoIcon: React.FC<{ size?: number; className?: string; colorTheme?: string }> = ({ 
  size = 40, 
  className = '',
  colorTheme = 'natural-olive'
}) => {
  const isNeon = colorTheme === 'emerald-neon';
  const olive = isNeon ? '#34D399' : '#5A5A40';
  const clay = isNeon ? '#10B981' : '#D67D5C';
  const mint = isNeon ? '#6EE7B7' : '#3D6E50';
  const charcoal = '#2D2926';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`relative z-10 transition-transform duration-300 ${className}`}
    >
      {/* Brand Shield & Organic Nodes */}
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#FAF8F5" stroke={olive} strokeWidth="3" />
      
      {/* Outer Hexagon Nodes */}
      <polygon 
        points="50,16 80,33 80,67 50,84 20,67 20,33" 
        stroke={olive} 
        strokeWidth="2.4" 
        strokeDasharray="3 3"
        opacity="0.8"
      />
      
      {/* Connection Nodes */}
      <circle cx="50" cy="16" r="3.8" fill={clay} />
      <circle cx="80" cy="33" r="3.8" fill={clay} />
      <circle cx="80" cy="67" r="3.8" fill={clay} />
      <circle cx="50" cy="84" r="3.8" fill={clay} />
      <circle cx="20" cy="67" r="3.8" fill={clay} />
      <circle cx="20" cy="33" r="3.8" fill={clay} />

      {/* Internal Circuity */}
      <line x1="50" y1="16" x2="50" y2="30" stroke={olive} strokeWidth="2" />
      <line x1="80" y1="33" x2="68" y2="42" stroke={olive} strokeWidth="2" />
      <line x1="80" y1="67" x2="68" y2="58" stroke={olive} strokeWidth="2" />
      <line x1="50" y1="84" x2="50" y2="70" stroke={olive} strokeWidth="2" />
      <line x1="20" y1="67" x2="32" y2="58" stroke={olive} strokeWidth="2" />
      <line x1="20" y1="33" x2="32" y2="42" stroke={olive} strokeWidth="2" />

      {/* Central Human Fingerprint & Provenance Arcs */}
      <path d="M50 32 C38 32 30 40 30 50 C30 62 38 68 50 68" stroke={charcoal} strokeWidth="2.8" strokeLinecap="round" opacity="0.95" />
      <path d="M50 38 C42 38 36 44 36 50 C36 57 42 62 50 62" stroke={clay} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M50 44 C45 44 42 47 42 50 C42 54 45 56 50 56" stroke={mint} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="2" fill={charcoal} />
      <path d="M50 32 C62 32 70 40 70 50 C70 58 65 64 58 67" stroke={charcoal} strokeWidth="2.8" strokeLinecap="round" opacity="0.95" />
      <path d="M50 38 C58 38 64 44 64 50 C64 56 60 60 55 61" stroke={clay} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
};

export const TomeCrafterLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="8" width="84" height="84" rx="20" fill="#FAF8F5" stroke="#5A5A40" strokeWidth="2.5" />
    <path d="M50 78 C35 71 22 74 15 80 L15 26 C22 20 35 17 50 24 C65 17 78 20 85 26 L85 80 C78 74 65 71 50 78 Z" stroke="#5A5A40" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    <line x1="50" y1="24" x2="50" y2="78" stroke="#D67D5C" strokeWidth="2.5" />
    <path d="M25 34 L33 34 L40 41 L40 60" stroke="#5A5A40" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="25" cy="34" r="2.2" fill="#D67D5C" />
    <path d="M75 34 L67 34 L60 41 L60 60" stroke="#5A5A40" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="75" cy="34" r="2.2" fill="#D67D5C" />
    <path d="M50 40 C44 40 40 44 40 50 C40 56 44 60 50 60" stroke="#D67D5C" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M50 40 C56 40 60 44 60 50 C60 56 56 60 50 60" stroke="#D67D5C" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const RlmProStudioLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="8" width="84" height="84" rx="20" fill="#FAF8F5" stroke="#5A5A40" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="34" stroke="#5A5A40" strokeWidth="2.2" fill="none" opacity="0.85" />
    <path d="M50 20 C55 20 60 23 64 24 C70 26 75 32 77 38 C79 43 76 49 78 55 C80 61 77 67 73 71 C69 75 62 77 56 79 C51 80 45 78 40 79 C34 79 28 74 25 69 C22 64 23 58 22 52 C21 46 19 40 22 35 C25 29 31 25 37 23 C42 21 46 20 50 20 Z" stroke="#D67D5C" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="50" cy="26" r="2.5" fill="#3D6E50" />
    <circle cx="74" cy="50" r="2.5" fill="#3D6E50" />
    <circle cx="50" cy="74" r="2.5" fill="#3D6E50" />
    <circle cx="26" cy="50" r="2.5" fill="#3D6E50" />
    <path d="M50 36 C42 36 37 42 37 50 C37 58 42 64 50 64" stroke="#5A5A40" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M50 42 C45 42 42 46 42 50 C42 54 45 58 50 58" stroke="#D67D5C" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M50 36 C58 36 63 42 63 50 C63 58 58 64 50 64" stroke="#5A5A40" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const ForgeOsLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="8" width="84" height="84" rx="20" fill="#FAF8F5" stroke="#5A5A40" strokeWidth="2.5" />
    <path d="M45 16 L55 16 L57 22 L64 25 L69 20 L77 28 L73 33 L76 40 L82 42 L82 52 L76 54 L73 61 L77 66 L69 74 L64 69 L57 72 L55 78 L45 78 L43 72 L36 69 L31 74 L23 66 L27 61 L24 54 L18 52 L18 42 L24 40 L27 33 L23 28 L31 20 L36 25 L43 22 Z" stroke="#5A5A40" strokeWidth="2" strokeLinejoin="round" fill="none" />
    <rect x="42" y="42" width="16" height="16" rx="3" stroke="#D67D5C" strokeWidth="2" fill="#FAF0EC" />
    <circle cx="50" cy="50" r="3" fill="#3D6E50" />
    <path d="M50 30 C42 30 38 34 38 38" stroke="#5A5A40" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 70 C42 70 38 66 38 62" stroke="#5A5A40" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RlEasyFlowLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="8" width="84" height="84" rx="20" fill="#FAF8F5" stroke="#5A5A40" strokeWidth="2.5" />
    <path d="M30 22 C44 15 68 22 78 38 C86 51 82 72 69 79 C54 86 28 82 19 67 C12 54 17 29 30 22 Z" stroke="#5A5A40" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="26" r="3.5" fill="#D67D5C" />
    <circle cx="75" cy="38" r="3.5" fill="#D67D5C" />
    <circle cx="68" cy="74" r="3.5" fill="#D67D5C" />
    <circle cx="21" cy="65" r="3.5" fill="#D67D5C" />
    <path d="M50 38 C43 38 38 43 38 50 C38 57 43 62 50 62" stroke="#5A5A40" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="50" cy="50" r="2.5" fill="#3D6E50" />
    <path d="M50 38 C57 38 62 43 62 50 C62 57 57 62 50 62" stroke="#5A5A40" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const MasterHumanBadgeIcon = MasterHumanBrandLogoIcon;

/**
 * Dedicated Component for the Overarching The H.U.M.A.N. Initiative Branding
 * NEVER overridden by individual app selection (Tome Crafter, RLM Pro, etc.)
 */
export const HumanInitiativeLogo: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  showText?: boolean;
  animated?: boolean;
  colorTheme?: 'emerald-neon' | 'natural-olive' | 'warm-clay' | 'dark-slate';
}> = ({
  size = 'md',
  showText = true,
  animated = false,
  colorTheme = 'natural-olive'
}) => {
  const [initiativeUploadedLogo, setInitiativeUploadedLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('human_initiative_official_logo') || localStorage.getItem('human_protocol_official_logo');
    }
    return null;
  });

  const [initiativePreset, setInitiativePreset] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('human_initiative_preset') || localStorage.getItem('human_protocol_preset') || 'emerald-cyber';
    }
    return 'emerald-cyber';
  });

  useEffect(() => {
    const handleStorage = () => {
      if (typeof window !== 'undefined') {
        setInitiativeUploadedLogo(localStorage.getItem('human_initiative_official_logo') || localStorage.getItem('human_protocol_official_logo'));
        setInitiativePreset(localStorage.getItem('human_initiative_preset') || localStorage.getItem('human_protocol_preset') || 'emerald-cyber');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const sizeMap: Record<string, { icon: number; text: string; sub: string }> = {
    xs: { icon: 20, text: 'text-xs', sub: 'text-[8px]' },
    sm: { icon: 28, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 70, text: 'text-3xl', sub: 'text-sm' },
    '2xl': { icon: 92, text: 'text-4xl', sub: 'text-base' },
  };

  const current = typeof size === 'number'
    ? { icon: size, text: size <= 24 ? 'text-xs' : size <= 36 ? 'text-sm' : 'text-lg', sub: size <= 24 ? 'text-[8px]' : 'text-[10px]' }
    : (sizeMap[size] || sizeMap.md);

  const renderIcon = () => {
    if (initiativeUploadedLogo) {
      return (
        <div 
          className="rounded-xl overflow-hidden bg-white border border-[#DCD5CA] shadow-xs flex items-center justify-center p-0.5"
          style={{ width: current.icon, height: current.icon }}
        >
          <img 
            src={initiativeUploadedLogo} 
            alt="The H.U.M.A.N. Initiative" 
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    if (initiativePreset === 'emerald-cyber') {
      return <EmeraldHumanNetworkLogoIcon size={current.icon} />;
    }

    return <MasterHumanBrandLogoIcon size={current.icon} colorTheme={colorTheme} />;
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${animated ? 'animate-pulse' : ''}`}>
        <div 
          className="absolute inset-0 rounded-xl blur-xs opacity-25 bg-[#5A5A40]/20"
          style={{ width: current.icon, height: current.icon }}
        />
        {renderIcon()}
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-[#2D2926]">
            <span className={`${current.text} font-bold text-[#2D2926] tracking-tight`}>
              The H.U.M.A.N.
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]">
              Initiative
            </span>
          </div>
          <span className={`${current.sub} font-mono tracking-wider uppercase text-[#6A655C] -mt-0.5 truncate max-w-[280px]`}>
            Powering Ethical AI apps, And Paying the People
          </span>
        </div>
      )}
    </div>
  );
};

export const HumanProtocolLogo = HumanInitiativeLogo;

/**
 * Universal Logo Component
 * If variant is 'human-master' or not provided, renders The H.U.M.A.N. Initiative branding.
 * If variant is an app preset ('tome-crafter', 'rlm-pro-studio', etc.), renders that app's emblem & title!
 */
export const HumanLogo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'human-master',
  showText = true, 
  animated = false,
  customLogoUrl,
  customAppName,
  colorTheme = 'natural-olive'
}) => {
  const [appCustomLogos, setAppCustomLogos] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_custom_app_logos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {};
  });

  useEffect(() => {
    const handleStorage = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('human_custom_app_logos');
        if (saved) {
          try {
            setAppCustomLogos(JSON.parse(saved));
          } catch (e) {}
        } else {
          setAppCustomLogos({});
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // If this is the master header logo, delegate directly to HumanInitiativeLogo!
  if (variant === 'human-master' && !customAppName && !customLogoUrl && !appCustomLogos['human-master']) {
    return (
      <HumanInitiativeLogo 
        size={size} 
        showText={showText} 
        animated={animated} 
        colorTheme={colorTheme} 
      />
    );
  }

  const sizeMap: Record<string, { icon: number; text: string; sub: string }> = {
    xs: { icon: 20, text: 'text-xs', sub: 'text-[8px]' },
    sm: { icon: 28, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 70, text: 'text-3xl', sub: 'text-sm' },
    '2xl': { icon: 92, text: 'text-4xl', sub: 'text-base' },
  };

  const current = typeof size === 'number'
    ? { icon: size, text: size <= 24 ? 'text-xs' : size <= 36 ? 'text-sm' : 'text-lg', sub: size <= 24 ? 'text-[8px]' : 'text-[10px]' }
    : (sizeMap[size] || sizeMap.md);

  // Resolve custom logo: priority 1: explicitly passed prop, priority 2: app-specific custom logo
  const resolvedLogoUrl = customLogoUrl || appCustomLogos[variant] || (variant === 'human-master' ? appCustomLogos['human-master'] : undefined);

  const renderIcon = () => {
    // Custom app logo passed directly or from ecosystem storage
    if (resolvedLogoUrl) {
      return (
        <div 
          className="rounded-xl overflow-hidden bg-white/90 border border-[#1E3A33]/40 shadow-xs flex items-center justify-center p-0.5"
          style={{ width: current.icon, height: current.icon }}
        >
          <img 
            src={resolvedLogoUrl} 
            alt={customAppName || 'App Logo'} 
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    switch (variant) {
      case 'emerald-cyber':
        return <EmeraldHumanNetworkLogoIcon size={current.icon} />;
      case 'tome-crafter':
        return <TomeCrafterLogoIcon size={current.icon} />;
      case 'rlm-pro-studio':
        return <RlmProStudioLogoIcon size={current.icon} />;
      case 'forgeos':
        return <ForgeOsLogoIcon size={current.icon} />;
      case 'rl-easy-flow':
        return <RlEasyFlowLogoIcon size={current.icon} />;
      case 'human-master':
      default:
        return <MasterHumanBrandLogoIcon size={current.icon} colorTheme={colorTheme} />;
    }
  };

  const getTitle = () => {
    if (customAppName) return customAppName;
    switch (variant) {
      case 'tome-crafter':
        return 'Tome Crafter';
      case 'rlm-pro-studio':
        return 'RLM Pro Studio';
      case 'forgeos':
        return 'ForgeOS';
      case 'rl-easy-flow':
        return 'RL Easy Flow';
      case 'emerald-cyber':
      case 'human-master':
      default:
        return 'H.U.M.A.N.';
    }
  };

  const getSubtitle = () => {
    switch (variant) {
      case 'tome-crafter':
        return 'Books & Literature • 40% Fund';
      case 'rlm-pro-studio':
        return 'Music & Audio Stems • 40% Fund';
      case 'forgeos':
        return 'Cleanroom Code AST • 40% Fund';
      case 'rl-easy-flow':
        return 'Video Frame Provenance • 40% Fund';
      case 'emerald-cyber':
      case 'human-master':
      default:
        return 'Powering Ethical AI apps, And Paying the People';
    }
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${animated ? 'animate-pulse' : ''}`}>
        <div 
          className="absolute inset-0 rounded-xl blur-xs opacity-25 bg-[#5A5A40]/20"
          style={{ width: current.icon, height: current.icon }}
        />
        {renderIcon()}
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-[#2D2926]">
            <span className={`${current.text} font-bold text-[#2D2926] truncate`}>
              {getTitle()}
            </span>
          </div>
          <span className={`${current.sub} font-mono tracking-wider uppercase text-[#6A655C] -mt-0.5 truncate max-w-[260px]`}>
            {getSubtitle()}
          </span>
        </div>
      )}
    </div>
  );
};
