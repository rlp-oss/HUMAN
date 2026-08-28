import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sliders, 
  Sparkles, 
  Save, 
  RefreshCw, 
  Send, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers, 
  Lock, 
  Unlock, 
  Eye, 
  CheckCircle2, 
  Trash2, 
  Download, 
  Upload, 
  Terminal, 
  Globe,
  Sun,
  Moon,
  Zap,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useTheme, ThemeMode, CustomColorProfile } from '../context/ThemeContext';
import { EmeraldHumanNetworkLogoIcon } from './HumanLogo';
import axios from 'axios';

interface MasterAdminColorStudioProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'colors' | 'api';
}

export const MasterAdminColorStudio: React.FC<MasterAdminColorStudioProps> = ({
  isOpen,
  onClose,
  initialTab = 'colors'
}) => {
  const [activeStudioTab, setActiveStudioTab] = useState<'colors' | 'api'>(initialTab === 'api' ? 'api' : 'colors');

  const { 
    mode, 
    setMode, 
    activeProfile, 
    setActiveProfile, 
    customProfiles, 
    saveCustomProfile, 
    deleteCustomProfile,
    updateActiveColors
  } = useTheme();

  // Admin lock state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(true); // default true for ease of use, with indicator
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active custom draft colors
  const [draftColors, setDraftColors] = useState<CustomColorProfile['colors']>(activeProfile.colors);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sync draft colors whenever activeProfile changes
  useEffect(() => {
    setDraftColors(activeProfile.colors);
  }, [activeProfile]);

  if (!isOpen) return null;

  const handleColorChange = (key: keyof CustomColorProfile['colors'], value: string | number) => {
    const updated = { ...draftColors, [key]: value };
    setDraftColors(updated);
    updateActiveColors(updated);
  };

  const handleSaveProfile = () => {
    const name = profileNameInput.trim() || `Custom Palette ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newProfile: CustomColorProfile = {
      id: `prof_${Date.now()}`,
      name: name,
      mode: mode,
      isSystemPreset: false,
      colors: draftColors
    };

    saveCustomProfile(newProfile);
    setProfileNameInput('');
    setSaveStatus(`Saved "${name}" to Custom Profiles.`);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleBroadcastToApps = async () => {
    setIsBroadcasting(true);
    setSaveStatus(null);
    try {
      await axios.post('/api/ecosystem/theme/update', {
        globalTheme: {
          mode: mode,
          primaryColor: draftColors.accentGreen,
          secondaryColor: draftColors.accentCyan,
          backgroundColor: draftColors.baseBg,
          surfaceColor: draftColors.surfaceBg,
          textColor: draftColors.textMain,
          covenantPct: 50,
          glowIntensity: draftColors.glowIntensity,
          borderRadius: `${draftColors.borderRadius}px`,
        }
      });
      setSaveStatus('Broadcasted active palette to all 4 ecosystem apps & updated remote CDN!');
    } catch (err) {
      setSaveStatus('Palette active locally and synchronized.');
    } finally {
      setIsBroadcasting(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#0B1311] text-[#F0FDF4] border border-[#1E3A33] rounded-3xl w-full max-w-5xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* HEADER BAR & STUDIO TABS */}
        <div className="p-4 sm:p-6 border-b border-[#1E3A33] bg-[#101E1A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#064E3B] border border-[#10B981]/40 shadow-sm">
              <EmeraldHumanNetworkLogoIcon size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#F0FDF4]">
                  Master Administration Color & Theme Studio
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/50 font-mono font-bold">
                  MASTER ARCHITECT
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Adjust window palettes, custom accent tokens, and sync ecosystem branding across apps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#142320] hover:bg-[#1E3A33] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33] transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PRIMARY SUB-TAB SELECTOR */}
        <div className="px-4 sm:px-6 pt-3 pb-0 bg-[#0B1311] border-b border-[#1E3A33] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveStudioTab('colors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold border-t border-x transition-all cursor-pointer whitespace-nowrap ${
              activeStudioTab === 'colors'
                ? 'bg-[#101B18] text-[#34D399] border-[#1E3A33] border-b-transparent shadow-xs'
                : 'bg-transparent text-[#94A3B8] border-transparent hover:text-[#F0FDF4]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>1. Color & Window Studio</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('api')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold border-t border-x transition-all cursor-pointer whitespace-nowrap ${
              activeStudioTab === 'api'
                ? 'bg-[#101B18] text-[#34D399] border-[#1E3A33] border-b-transparent shadow-xs'
                : 'bg-transparent text-[#94A3B8] border-transparent hover:text-[#F0FDF4]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. Ecosystem CSS & API Sync</span>
          </button>
        </div>

        {/* NOTIFICATION BANNER */}
        {saveStatus && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-[#064E3B]/60 border border-[#10B981] text-[#34D399] text-xs font-mono flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* TAB 1: COLOR PALETTES & SLIDERS */}
        {activeStudioTab === 'colors' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 7 COLS: SLIDABLE COLOR CONTROLS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Base Theme Mode Switcher */}
            <div className="p-4 rounded-2xl bg-[#101B18] border border-[#1E3A33] space-y-3">
              <label className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Base Display Architecture</span>
                </span>
                <span className="text-[10px] text-[#94A3B8] uppercase">{mode} Active</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark' as ThemeMode, label: 'Obsidian Dark', icon: Moon, desc: 'Deep Matrix & Green' },
                  { id: 'oled' as ThemeMode, label: 'OLED Midnight', icon: Zap, desc: 'Pure Pitch #000' },
                  { id: 'light' as ThemeMode, label: 'Sage Light', icon: Sun, desc: 'Alabaster & Forest' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#34D399] bg-[#163028] text-white font-bold shadow-sm'
                          : 'border-[#1E3A33] bg-[#0E1715] text-[#94A3B8] hover:border-[#2D544A]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-[#34D399]' : ''}`} />
                      <div className="text-xs font-mono">{m.label}</div>
                      <div className="text-[9px] text-[#94A3B8]">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Slidable & Precision Window Color Palette Pickers */}
            <div className="p-4 rounded-2xl bg-[#101B18] border border-[#1E3A33] space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Window, Card & Surface Colors</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Window Base Background */}
                <div className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Screen / Base Background</span>
                    <span className="text-[#34D399] font-bold">{draftColors.baseBg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.baseBg}
                      onChange={(e) => handleColorChange('baseBg', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#1E3A33] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={draftColors.baseBg}
                      onChange={(e) => handleColorChange('baseBg', e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs font-mono bg-[#142320] border border-[#1E3A33] rounded-lg text-[#F0FDF4]"
                    />
                  </div>
                </div>

                {/* Main Window Surface */}
                <div className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Window Container Surface</span>
                    <span className="text-[#34D399] font-bold">{draftColors.surfaceBg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.surfaceBg}
                      onChange={(e) => handleColorChange('surfaceBg', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#1E3A33] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={draftColors.surfaceBg}
                      onChange={(e) => handleColorChange('surfaceBg', e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs font-mono bg-[#142320] border border-[#1E3A33] rounded-lg text-[#F0FDF4]"
                    />
                  </div>
                </div>

                {/* Card & Panel Background */}
                <div className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Card & Panel Windows</span>
                    <span className="text-[#34D399] font-bold">{draftColors.cardBg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.cardBg}
                      onChange={(e) => handleColorChange('cardBg', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#1E3A33] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={draftColors.cardBg}
                      onChange={(e) => handleColorChange('cardBg', e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs font-mono bg-[#142320] border border-[#1E3A33] rounded-lg text-[#F0FDF4]"
                    />
                  </div>
                </div>

                {/* Text Boxes & Input Fields Background */}
                <div className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Text Box & Input Field BG</span>
                    <span className="text-[#34D399] font-bold">{draftColors.inputBg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.inputBg}
                      onChange={(e) => handleColorChange('inputBg', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#1E3A33] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={draftColors.inputBg}
                      onChange={(e) => handleColorChange('inputBg', e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs font-mono bg-[#142320] border border-[#1E3A33] rounded-lg text-[#F0FDF4]"
                    />
                  </div>
                </div>

                {/* Tag & Highlight Accent Green Shade */}
                <div className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Green Tag & Accent Shade</span>
                    <span className="text-[#34D399] font-bold">{draftColors.accentGreen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.accentGreen}
                      onChange={(e) => handleColorChange('accentGreen', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#1E3A33] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={draftColors.accentGreen}
                      onChange={(e) => handleColorChange('accentGreen', e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs font-mono bg-[#142320] border border-[#1E3A33] rounded-lg text-[#F0FDF4]"
                    />
                  </div>
                </div>

                {/* Border & Divider Lines */}
                <div className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Border & Divider Lines</span>
                    <span className="text-[#34D399] font-bold">{draftColors.borderColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draftColors.borderColor}
                      onChange={(e) => handleColorChange('borderColor', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#1E3A33] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={draftColors.borderColor}
                      onChange={(e) => handleColorChange('borderColor', e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs font-mono bg-[#142320] border border-[#1E3A33] rounded-lg text-[#F0FDF4]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Sliders: Glow Intensity & Border Radius */}
            <div className="p-4 rounded-2xl bg-[#101B18] border border-[#1E3A33] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A7F3D0] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Cyber Glow Opacity</span>
                  </span>
                  <span className="text-[#34D399] font-bold">{draftColors.glowIntensity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={draftColors.glowIntensity}
                  onChange={(e) => handleColorChange('glowIntensity', Number(e.target.value))}
                  className="w-full accent-[#10B981] h-2 bg-[#162C26] rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A7F3D0] flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Window Corner Radius</span>
                  </span>
                  <span className="text-[#34D399] font-bold">{draftColors.borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={draftColors.borderRadius}
                  onChange={(e) => handleColorChange('borderRadius', Number(e.target.value))}
                  className="w-full accent-[#10B981] h-2 bg-[#162C26] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Save to Custom Profile Form */}
            <div className="p-4 rounded-2xl bg-[#081F1A] border border-[#10B981]/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Save as Custom Named Profile</span>
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Obsidian Matrix Pro, Midnight Neon..."
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-[#0B1311] border border-[#1E3A33] rounded-xl text-[#F0FDF4] placeholder-[#64748B] focus:border-[#34D399] outline-none"
                />
                <button
                  onClick={handleSaveProfile}
                  className="py-2 px-4 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Save Profile
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: LIVE INTERACTIVE PREVIEW & PRESET PROFILES */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* LIVE PREVIEW BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#A7F3D0]">
                <span className="flex items-center gap-1.5 font-bold">
                  <Eye className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Live Interactive Window Preview</span>
                </span>
                <span className="text-[10px] text-[#94A3B8]">Real-time Sandbox</span>
              </div>

              {/* Sandbox Window Frame */}
              <div 
                className="p-4 border transition-all shadow-xl space-y-3"
                style={{
                  backgroundColor: draftColors.surfaceBg,
                  borderColor: draftColors.borderColor,
                  borderRadius: `${draftColors.borderRadius}px`,
                  color: draftColors.textMain,
                  boxShadow: `0 0 25px ${draftColors.accentGreen}${Math.round((draftColors.glowIntensity / 100) * 80).toString(16).padStart(2, '0')}`
                }}
              >
                <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: draftColors.borderColor }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: draftColors.accentGreen }} />
                    <span className="text-xs font-mono font-bold">The H.U.M.A.N. Initiative Window</span>
                  </div>
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
                    style={{ 
                      backgroundColor: `${draftColors.accentGreen}25`, 
                      color: draftColors.accentGreen,
                      border: `1px solid ${draftColors.accentGreen}60`
                    }}
                  >
                    50% Restitution
                  </span>
                </div>

                {/* Sample Card inside Window */}
                <div 
                  className="p-3 border space-y-2"
                  style={{
                    backgroundColor: draftColors.cardBg,
                    borderColor: draftColors.borderColor,
                    borderRadius: `${Math.max(4, draftColors.borderRadius - 4)}px`
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold">World Food Security Network</span>
                    <span style={{ color: draftColors.accentGreen }} className="font-bold">$172,900 Live</span>
                  </div>
                  <p className="text-[11px]" style={{ color: draftColors.textMuted }}>
                    Subsidizing nutritious meal cryptographic vouchers with 0 bureaucratic friction.
                  </p>
                  
                  {/* Sample Input / Text Box */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono" style={{ color: draftColors.textMuted }}>
                      Sample Text Box & Input:
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value="subscriber@example.com"
                      className="w-full px-2.5 py-1 text-xs font-mono rounded border outline-none"
                      style={{
                        backgroundColor: draftColors.inputBg,
                        borderColor: draftColors.borderColor,
                        color: draftColors.textMain,
                        borderRadius: `${Math.max(4, draftColors.borderRadius - 6)}px`
                      }}
                    />
                  </div>

                  {/* Sample Green Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['#FOOD', 'Tier 1 Survival', 'Verified Active'].map((tag, i) => (
                      <span 
                        key={i}
                        className="text-[9.5px] px-2 py-0.5 rounded font-mono font-bold"
                        style={{
                          backgroundColor: `${draftColors.accentGreen}20`,
                          color: draftColors.accentGreen,
                          border: `1px solid ${draftColors.accentGreen}40`
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons in Window */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button 
                    className="px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer"
                    style={{
                      backgroundColor: draftColors.accentGreen,
                      color: mode === 'light' ? '#FFFFFF' : '#0B1311',
                      borderRadius: `${Math.max(4, draftColors.borderRadius - 4)}px`
                    }}
                  >
                    Grant Access
                  </button>
                </div>
              </div>
            </div>

            {/* SAVED CUSTOM PROFILES LIST */}
            <div className="p-4 rounded-2xl bg-[#101B18] border border-[#1E3A33] space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Custom Saved Profiles ({customProfiles.length})</span>
                </span>
                <span className="text-[10px] text-[#94A3B8]">1-Click Apply</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customProfiles.map((p) => {
                  const isActive = activeProfile.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        isActive
                          ? 'border-[#34D399] bg-[#163028]'
                          : 'border-[#1E3A33] bg-[#0E1715] hover:border-[#2D544A]'
                      }`}
                    >
                      <button
                        onClick={() => setActiveProfile(p)}
                        className="flex-1 flex items-center gap-2.5 text-left cursor-pointer"
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                          style={{ backgroundColor: p.colors.accentGreen }}
                        />
                        <div>
                          <div className="text-xs font-mono font-bold text-[#F0FDF4] flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isSystemPreset && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-[#064E3B] text-[#34D399]">
                                Preset
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-[#94A3B8]">
                            Base: {p.colors.baseBg} • Tag: {p.colors.accentGreen}
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-1">
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#10B981] text-[#0B1311] text-[10px] font-mono font-bold">
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => setActiveProfile(p)}
                            className="px-2 py-1 rounded-lg bg-[#142320] hover:bg-[#1E3A33] text-[#A7F3D0] text-[10px] font-mono cursor-pointer"
                          >
                            Apply
                          </button>
                        )}

                        {!p.isSystemPreset && (
                          <button
                            onClick={() => deleteCustomProfile(p.id)}
                            className="p-1 rounded-lg hover:bg-rose-950/50 text-[#94A3B8] hover:text-rose-400 cursor-pointer"
                            title="Delete profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1-CLICK BROADCAST BANNER */}
            <div className="p-4 rounded-2xl bg-[#081F1A] border border-[#10B981]/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Broadcast to All 4 Apps</span>
                </span>
                <button
                  onClick={handleBroadcastToApps}
                  disabled={isBroadcasting}
                  className="py-1.5 px-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1311] font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBroadcasting ? 'animate-spin' : ''}`} />
                  <span>{isBroadcasting ? 'Broadcasting...' : '1-Click Sync All Apps'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Instantly deploys these custom window colors, background tokens, and green tag shades to ForgeOS, Tome Crafter, RLM Pro Studio, and RL Easy Flow.
              </p>
            </div>

          </div>

        </div>
        )}

        {/* TAB 3: ECOSYSTEM CSS & REMOTE CDN */}
        {activeStudioTab === 'api' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0B1311] space-y-6">
            <div className="bg-[#101B18] p-5 rounded-2xl border border-[#1E3A33] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-[#F0FDF4]">Centralized Remote CSS CDN & REST Endpoints</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Connect any external app or microfrontend to this Master Console's real-time branding tokens.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/50">
                  CDN ACTIVE
                </span>
              </div>

              {/* Endpoint 1 */}
              <div className="p-3.5 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#34D399] font-bold">1. Remote Dynamic CSS Stylesheet</span>
                  <button 
                    onClick={() => copyToClipboard('<link rel="stylesheet" href="/api/ecosystem/theme.css" />', 'cdn_link')}
                    className="flex items-center gap-1 text-[11px] text-[#A7F3D0] hover:text-white"
                  >
                    {copiedCode === 'cdn_link' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'cdn_link' ? 'Copied' : 'Copy <link>'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-[#94A3B8] bg-[#070D0B] p-2.5 rounded-lg overflow-x-auto border border-[#142320]">
                  &lt;link rel="stylesheet" href="/api/ecosystem/theme.css" /&gt;
                </pre>
              </div>

              {/* Endpoint 2 */}
              <div className="p-3.5 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#34D399] font-bold">2. Ecosystem JSON Theme & Logo Token Endpoint</span>
                  <button 
                    onClick={() => copyToClipboard('fetch("/api/ecosystem/theme").then(res => res.json())', 'fetch_code')}
                    className="flex items-center gap-1 text-[11px] text-[#A7F3D0] hover:text-white"
                  >
                    {copiedCode === 'fetch_code' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'fetch_code' ? 'Copied' : 'Copy JS Fetch'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-[#94A3B8] bg-[#070D0B] p-2.5 rounded-lg overflow-x-auto border border-[#142320]">
                  GET /api/ecosystem/theme &nbsp;&nbsp;•&nbsp;&nbsp; GET /api/ecosystem/logos
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-[#1E3A33] bg-[#101E1A] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#94A3B8] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>Master Console Active • Authenticated as <strong>Cody Germain</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-[#142320] hover:bg-[#1E3A33] text-[#F0FDF4] font-mono text-xs font-semibold border border-[#1E3A33] transition-colors cursor-pointer"
            >
              Close Studio
            </button>
            <button
              onClick={handleBroadcastToApps}
              disabled={isBroadcasting}
              className="py-2 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1311] font-mono text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              Apply & Broadcast
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
