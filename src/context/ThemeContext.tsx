import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateUniversalToken, subscribeToUniversalTokenSync } from '../services/crossTabSyncService';

export type ThemeMode = 'light' | 'dark' | 'oled';
export type AccentPalette = 'emerald-cyber' | 'cyan-mint' | 'warm-clay' | 'forest-sage';

export interface CustomColorProfile {
  id: string;
  name: string;
  mode: ThemeMode;
  isSystemPreset?: boolean;
  colors: {
    baseBg: string;        // Overall screen background (e.g. #0B1311, #000000, #F9F7F2)
    surfaceBg: string;     // Main window container surface (e.g. #101B18, #070D0B, #FFFFFF)
    cardBg: string;        // Card & panels inside windows (e.g. #142320, #0A1412, #FAF8F5)
    inputBg: string;       // Text boxes & input fields (e.g. #08100E, #050B09, #FFFFFF)
    borderColor: string;   // Borders & dividers (e.g. #1E3A33, #1A362F, #E5E0D8)
    accentGreen: string;   // Green tag & restitution shade (e.g. #10B981, #34D399, #059669)
    accentCyan: string;    // Cyan circuit highlight (e.g. #67E8F9)
    textMain: string;      // Main heading & text (e.g. #F0FDF4, #FFFFFF, #2D2926)
    textMuted: string;     // Secondary muted text (e.g. #94A3B8, #A1A1AA, #6A655C)
    glowIntensity: number; // 0 to 100
    borderRadius: number;  // 0 to 24px
  };
}

export const SYSTEM_PRESET_PROFILES: CustomColorProfile[] = [
  {
    id: 'preset_obsidian_emerald',
    name: 'Obsidian Matrix & Glowing Emerald',
    mode: 'dark',
    isSystemPreset: true,
    colors: {
      baseBg: '#0B1311',
      surfaceBg: '#101B18',
      cardBg: '#142320',
      inputBg: '#08100E',
      borderColor: '#1E3A33',
      accentGreen: '#10B981',
      accentCyan: '#67E8F9',
      textMain: '#F0FDF4',
      textMuted: '#94A3B8',
      glowIntensity: 80,
      borderRadius: 14
    }
  },
  {
    id: 'preset_oled_midnight',
    name: 'OLED Pure Midnight & Neon Mint',
    mode: 'oled',
    isSystemPreset: true,
    colors: {
      baseBg: '#000000',
      surfaceBg: '#070D0B',
      cardBg: '#0A1412',
      inputBg: '#040706',
      borderColor: '#1A362F',
      accentGreen: '#34D399',
      accentCyan: '#22D3EE',
      textMain: '#FFFFFF',
      textMuted: '#A1A1AA',
      glowIntensity: 95,
      borderRadius: 12
    }
  },
  {
    id: 'preset_sage_alabaster',
    name: 'Sage Alabaster & Forest Green',
    mode: 'light',
    isSystemPreset: true,
    colors: {
      baseBg: '#F9F7F2',
      surfaceBg: '#FFFFFF',
      cardBg: '#FAF8F5',
      inputBg: '#FFFFFF',
      borderColor: '#E5E0D8',
      accentGreen: '#059669',
      accentCyan: '#0891B2',
      textMain: '#2D2926',
      textMuted: '#6A655C',
      glowIntensity: 40,
      borderRadius: 12
    }
  },
  {
    id: 'preset_stealth_carbon',
    name: 'Stealth Carbon & Cyber Lime',
    mode: 'dark',
    isSystemPreset: true,
    colors: {
      baseBg: '#0D0F12',
      surfaceBg: '#13171D',
      cardBg: '#1A2029',
      inputBg: '#0E1217',
      borderColor: '#243040',
      accentGreen: '#22C55E',
      accentCyan: '#38BDF8',
      textMain: '#F8FAFC',
      textMuted: '#94A3B8',
      glowIntensity: 70,
      borderRadius: 10
    }
  }
];

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  accent: AccentPalette;
  setAccent: (accent: AccentPalette) => void;
  glowIntensity: number; // 0 to 100
  setGlowIntensity: (val: number) => void;
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (open: boolean) => void;
  toggleSideMenu: () => void;
  isTaskbarPinned: boolean;
  setIsTaskbarPinned: (pinned: boolean) => void;
  // Custom Color Studio Profiles
  activeProfile: CustomColorProfile;
  setActiveProfile: (profile: CustomColorProfile) => void;
  customProfiles: CustomColorProfile[];
  saveCustomProfile: (profile: CustomColorProfile) => void;
  deleteCustomProfile: (id: string) => void;
  updateActiveColors: (colors: CustomColorProfile['colors']) => void;
  // Master Logo Ecosystem Storage
  customAppLogos: Record<string, string>;
  setAppLogo: (appId: string, logoDataUrl: string | null) => void;
  setAllAppLogos: (logoDataUrl: string | null, targetAppIds?: string[]) => void;
  getAppLogo: (appId: string) => string | null;
  resetAppLogos: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_app_theme_mode');
      if (saved === 'dark' || saved === 'light' || saved === 'oled') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'dark';
  });

  const [accent, setAccentState] = useState<AccentPalette>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_app_theme_accent');
      if (saved === 'emerald-cyber' || saved === 'cyan-mint' || saved === 'warm-clay' || saved === 'forest-sage') {
        return saved;
      }
    }
    return 'emerald-cyber';
  });

  const [glowIntensity, setGlowIntensityState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_app_glow_intensity');
      if (saved) return Number(saved);
    }
    return 75;
  });

  const [customProfiles, setCustomProfiles] = useState<CustomColorProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_custom_color_profiles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          // fallback
        }
      }
    }
    return SYSTEM_PRESET_PROFILES;
  });

  const [activeProfile, setActiveProfileState] = useState<CustomColorProfile>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('human_active_profile_id');
      if (savedId) {
        const found = customProfiles.find(p => p.id === savedId);
        if (found) return found;
      }
    }
    return SYSTEM_PRESET_PROFILES[0];
  });

  const [customAppLogos, setCustomAppLogos] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_custom_app_logos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
      // Also check official initiative logo
      const initiativeLogo = localStorage.getItem('human_initiative_official_logo') || localStorage.getItem('human_protocol_official_logo');
      if (initiativeLogo) {
        return { 'human-master': initiativeLogo };
      }
    }
    return {};
  });

  const setAppLogo = (appId: string, logoDataUrl: string | null) => {
    setCustomAppLogos(prev => {
      const updated = { ...prev };
      if (logoDataUrl) {
        updated[appId] = logoDataUrl;
        if (appId === 'human-master') {
          localStorage.setItem('human_initiative_official_logo', logoDataUrl);
        }
      } else {
        delete updated[appId];
        if (appId === 'human-master') {
          localStorage.removeItem('human_initiative_official_logo');
          localStorage.removeItem('human_protocol_official_logo');
        }
      }
      localStorage.setItem('human_custom_app_logos', JSON.stringify(updated));
      return updated;
    });
  };

  const setAllAppLogos = (logoDataUrl: string | null, targetAppIds?: string[]) => {
    const defaultApps = ['forgeos', 'tome-crafter', 'rlm-pro-studio', 'rl-easy-flow', 'human-master'];
    const targets = targetAppIds && targetAppIds.length > 0 ? targetAppIds : defaultApps;

    setCustomAppLogos(prev => {
      const updated = { ...prev };
      targets.forEach(id => {
        if (logoDataUrl) {
          updated[id] = logoDataUrl;
        } else {
          delete updated[id];
        }
      });
      if (targets.includes('human-master')) {
        if (logoDataUrl) {
          localStorage.setItem('human_initiative_official_logo', logoDataUrl);
        } else {
          localStorage.removeItem('human_initiative_official_logo');
          localStorage.removeItem('human_protocol_official_logo');
        }
      }
      localStorage.setItem('human_custom_app_logos', JSON.stringify(updated));
      return updated;
    });
  };

  const getAppLogo = (appId: string): string | null => {
    return customAppLogos[appId] || null;
  };

  const resetAppLogos = () => {
    setCustomAppLogos({});
    localStorage.removeItem('human_custom_app_logos');
    localStorage.removeItem('human_initiative_official_logo');
    localStorage.removeItem('human_protocol_official_logo');
  };

  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_side_menu_open');
      return saved === 'true';
    }
    return false;
  });

  const [isTaskbarPinned, setIsTaskbarPinned] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_taskbar_pinned');
      return saved !== 'false';
    }
    return true;
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    updateUniversalToken('human_app_theme_mode', newMode);
    
    // Pick suitable preset matching new mode if current doesn't match
    const matchingPreset = customProfiles.find(p => p.mode === newMode) || (
      newMode === 'light' ? SYSTEM_PRESET_PROFILES[2] : newMode === 'oled' ? SYSTEM_PRESET_PROFILES[1] : SYSTEM_PRESET_PROFILES[0]
    );
    if (matchingPreset) {
      setActiveProfileState(matchingPreset);
      updateUniversalToken('human_active_profile_id', matchingPreset.id);
    }
  };

  const toggleMode = () => {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : mode === 'light' ? 'oled' : 'dark';
    setMode(nextMode);
  };

  const setAccent = (newAccent: AccentPalette) => {
    setAccentState(newAccent);
    localStorage.setItem('human_app_theme_accent', newAccent);
  };

  const setGlowIntensity = (val: number) => {
    setGlowIntensityState(val);
    localStorage.setItem('human_app_glow_intensity', val.toString());
  };

  const setActiveProfile = (profile: CustomColorProfile) => {
    setActiveProfileState(profile);
    setModeState(profile.mode);
    setGlowIntensityState(profile.colors.glowIntensity);
    localStorage.setItem('human_active_profile_id', profile.id);
    localStorage.setItem('human_app_theme_mode', profile.mode);
  };

  const saveCustomProfile = (profile: CustomColorProfile) => {
    setCustomProfiles(prev => {
      const filtered = prev.filter(p => p.id !== profile.id);
      const updated = [profile, ...filtered];
      localStorage.setItem('human_custom_color_profiles', JSON.stringify(updated));
      return updated;
    });
    setActiveProfile(profile);
  };

  const deleteCustomProfile = (id: string) => {
    setCustomProfiles(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('human_custom_color_profiles', JSON.stringify(updated));
      return updated;
    });
    if (activeProfile.id === id) {
      setActiveProfile(SYSTEM_PRESET_PROFILES[0]);
    }
  };

  const updateActiveColors = (colors: CustomColorProfile['colors']) => {
    const updated = {
      ...activeProfile,
      colors: colors
    };
    setActiveProfileState(updated);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(prev => {
      const next = !prev;
      localStorage.setItem('human_side_menu_open', next.toString());
      return next;
    });
  };

  // Cross-tab broadcast receiver
  useEffect(() => {
    const unsubscribe = subscribeToUniversalTokenSync((data) => {
      if (data.key === 'human_app_theme_mode' && (data.value === 'dark' || data.value === 'light' || data.value === 'oled')) {
        setModeState(data.value);
      } else if (data.key === 'human_active_profile_id') {
        const found = customProfiles.find(p => p.id === data.value);
        if (found) setActiveProfileState(found);
      } else if (data.key === 'human_custom_app_logos') {
        setCustomAppLogos(data.value || {});
      }
    });
    return () => unsubscribe();
  }, [customProfiles]);

  // Sync with HTML root classes and dynamic CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-accent', accent);
    
    if (mode === 'dark' || mode === 'oled') {
      root.classList.add('dark');
      if (mode === 'oled') {
        root.classList.add('oled-theme');
      } else {
        root.classList.remove('oled-theme');
      }
    } else {
      root.classList.remove('dark');
      root.classList.remove('oled-theme');
    }

    // Set Live CSS Variables from active profile
    const c = activeProfile.colors;
    root.style.setProperty('--color-bg-base', c.baseBg);
    root.style.setProperty('--color-bg-surface', c.surfaceBg);
    root.style.setProperty('--color-bg-card', c.cardBg);
    root.style.setProperty('--color-bg-input', c.inputBg);
    root.style.setProperty('--color-border', c.borderColor);
    root.style.setProperty('--color-border-subtle', `${c.borderColor}80`);
    root.style.setProperty('--color-accent-emerald', c.accentGreen);
    root.style.setProperty('--color-accent-cyan', c.accentCyan);
    root.style.setProperty('--color-text-main', c.textMain);
    root.style.setProperty('--color-text-muted', c.textMuted);
    root.style.setProperty('--glow-opacity', (c.glowIntensity / 100).toString());
    root.style.setProperty('--window-radius', `${c.borderRadius}px`);
  }, [mode, accent, glowIntensity, activeProfile]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        accent,
        setAccent,
        glowIntensity,
        setGlowIntensity,
        isSideMenuOpen,
        setIsSideMenuOpen: (open) => {
          setIsSideMenuOpen(open);
          localStorage.setItem('human_side_menu_open', open.toString());
        },
        toggleSideMenu,
        isTaskbarPinned,
        setIsTaskbarPinned: (pinned) => {
          setIsTaskbarPinned(pinned);
          localStorage.setItem('human_taskbar_pinned', pinned.toString());
        },
        activeProfile,
        setActiveProfile,
        customProfiles,
        saveCustomProfile,
        deleteCustomProfile,
        updateActiveColors,
        customAppLogos,
        setAppLogo,
        setAllAppLogos,
        getAppLogo,
        resetAppLogos
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

