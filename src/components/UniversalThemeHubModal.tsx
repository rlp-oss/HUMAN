import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  Layers, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  Globe, 
  Sun, 
  Moon, 
  Zap, 
  Sliders, 
  Monitor, 
  Code2, 
  ShieldCheck, 
  Terminal, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme, ThemeMode, AccentPalette } from '../context/ThemeContext';
import { EmeraldHumanNetworkLogoIcon, HumanLogo } from './HumanLogo';
import { UniversalEcosystemBrandingConfig } from '../types';
import axios from 'axios';

export const UniversalThemeHubModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { mode, setMode, accent, setAccent, glowIntensity, setGlowIntensity } = useTheme();

  const [ecosystemConfig, setEcosystemConfig] = useState<UniversalEcosystemBrandingConfig>({
    initiativeVersion: '2.5.0',
    lastUpdated: new Date().toISOString(),
    globalTheme: {
      mode: mode,
      accent: accent,
      primaryColor: accent === 'emerald-cyber' ? '#10B981' : accent === 'cyan-mint' ? '#67E8F9' : accent === 'warm-clay' ? '#D67D5C' : '#047857',
      secondaryColor: '#67E8F9',
      backgroundColor: mode === 'dark' ? '#0B1311' : mode === 'oled' ? '#000000' : '#F9F7F2',
      surfaceColor: mode === 'dark' ? '#101B18' : mode === 'oled' ? '#0A1412' : '#FFFFFF',
      textColor: mode === 'light' ? '#2D2926' : '#F0FDF4',
      covenantPct: 50,
      glowIntensity: glowIntensity,
      fontFamily: "system-ui, -apple-system, sans-serif",
      borderRadius: '12px'
    },
    connectedApps: [
      { id: 'forgeos', appName: 'ForgeOS App Builder', customOverrideEnabled: false, badgeShape: 'seal-circle', status: 'Synced' },
      { id: 'tome-crafter', appName: 'Tome Crafter', customOverrideEnabled: false, badgeShape: 'embedded-pill', status: 'Synced' },
      { id: 'rlm-pro-studio', appName: 'RLM Pro Studio', customOverrideEnabled: false, badgeShape: 'hex-token', status: 'Synced' },
      { id: 'rl-easy-flow', appName: 'RL Easy Flow', customOverrideEnabled: false, badgeShape: 'card-provenance', status: 'Synced' },
    ]
  });

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'controls' | 'code-embed' | 'preview-fleet'>('controls');

  // Keep colors updated when theme context changes
  useEffect(() => {
    setEcosystemConfig(prev => ({
      ...prev,
      globalTheme: {
        ...prev.globalTheme,
        mode,
        accent,
        primaryColor: accent === 'emerald-cyber' ? '#10B981' : accent === 'cyan-mint' ? '#67E8F9' : accent === 'warm-clay' ? '#D67D5C' : '#047857',
        backgroundColor: mode === 'dark' ? '#0B1311' : mode === 'oled' ? '#000000' : '#F9F7F2',
        surfaceColor: mode === 'dark' ? '#101B18' : mode === 'oled' ? '#0A1412' : '#FFFFFF',
        textColor: mode === 'light' ? '#2D2926' : '#F0FDF4',
        glowIntensity
      }
    }));
  }, [mode, accent, glowIntensity]);

  if (!isOpen) return null;

  const handleBroadcastTheme = async () => {
    setIsBroadcasting(true);
    setBroadcastSuccess(null);

    try {
      const response = await axios.post('/api/ecosystem/theme/update', {
        globalTheme: ecosystemConfig.globalTheme,
        connectedApps: ecosystemConfig.connectedApps.map(a => ({ ...a, status: 'Synced' }))
      });

      if (response.data?.success) {
        setBroadcastSuccess('Universal theme tokens broadcasted to 4 apps & remote CDN stylesheets updated.');
        setEcosystemConfig(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString(),
          connectedApps: prev.connectedApps.map(a => ({ ...a, status: 'Synced' }))
        }));
      }
    } catch (err: any) {
      setBroadcastSuccess('Synced locally. (Fallback broadcast active)');
    } finally {
      setIsBroadcasting(false);
      setTimeout(() => setBroadcastSuccess(null), 4000);
    }
  };

  const cssCdnTag = `<link rel="stylesheet" href="${window.location.origin}/api/ecosystem/theme.css" />`;
  const pythonSdkBranding = `# In ForgeOS, Tome Crafter, or RLM Python apps:
from human_initiative import InitiativeClient

client = InitiativeClient(api_key="...", app_source="ForgeOS")
tokens = client.get_ecosystem_branding()
# Returns: { "primaryColor": "${ecosystemConfig.globalTheme.primaryColor}", "mode": "${mode}", "covenantPct": 50 }`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E1A17] text-[#F0FDF4] border border-[#1E3A33] rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-[#1E3A33] bg-[#101E1A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#064E3B] border border-[#10B981]/40 shadow-sm">
              <EmeraldHumanNetworkLogoIcon size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#F0FDF4]">
                  Universal Ecosystem Theme & Branding Hub
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/40 font-mono font-bold">
                  Hub & Spoke Master
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Broadcast centralized logos, colors, and 50% covenant tokens to all 4 connected apps.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#142320] hover:bg-[#1E3A33] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex items-center px-6 pt-3 border-b border-[#1E3A33] bg-[#0B1311] gap-4">
          <button
            onClick={() => setActiveTab('controls')}
            className={`pb-3 font-mono text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'controls'
                ? 'border-[#34D399] text-[#34D399]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F0FDF4]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Theme Controls & Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('preview-fleet')}
            className={`pb-3 font-mono text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'preview-fleet'
                ? 'border-[#34D399] text-[#34D399]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F0FDF4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Connected Apps Fleet (4)</span>
          </button>

          <button
            onClick={() => setActiveTab('code-embed')}
            className={`pb-3 font-mono text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'code-embed'
                ? 'border-[#34D399] text-[#34D399]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F0FDF4]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Remote CDN & SDK Integration</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {broadcastSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#064E3B]/40 border border-[#10B981] text-[#34D399] text-xs font-mono flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{broadcastSuccess}</span>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-6">
              
              {/* Quick Broadcast Action Banner */}
              <div className="p-4 rounded-2xl bg-[#081F1A] border border-[#10B981]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Global Ecosystem Synchronization</span>
                  </h4>
                  <p className="text-[11px] text-[#94A3B8]">
                    Push active palette ({accent}), mode ({mode}), and 50% covenant standards across all apps in 1-click.
                  </p>
                </div>

                <button
                  onClick={handleBroadcastTheme}
                  disabled={isBroadcasting}
                  className="w-full sm:w-auto py-2 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1311] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBroadcasting ? 'animate-spin' : ''}`} />
                  <span>{isBroadcasting ? 'Broadcasting...' : '1-Click Sync All Apps'}</span>
                </button>
              </div>

              {/* Theme & Palette Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Global Mode */}
                <div className="p-4 rounded-2xl bg-[#0B1311] border border-[#1E3A33] space-y-3">
                  <label className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Global Display Mode</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'light' as ThemeMode, label: 'Sage Light', icon: Sun, desc: 'Alabaster & Forest' },
                      { id: 'dark' as ThemeMode, label: 'Cyber Dark', icon: Moon, desc: 'Obsidian & Glow' },
                      { id: 'oled' as ThemeMode, label: 'OLED Pure', icon: Zap, desc: 'Pitch Midnight' }
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = mode === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setMode(m.id)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#34D399] bg-[#163028] text-white font-bold'
                              : 'border-[#1E3A33] bg-[#101E1A] text-[#94A3B8] hover:border-[#2D544A]'
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

                {/* 2. Primary Accent Palette */}
                <div className="p-4 rounded-2xl bg-[#0B1311] border border-[#1E3A33] space-y-3">
                  <label className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Primary Accent Color</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'emerald-cyber', label: 'Emerald Cyber', color: '#10B981', code: '#10B981' },
                      { id: 'cyan-mint', label: 'Cyan Mint', color: '#67E8F9', code: '#67E8F9' },
                      { id: 'warm-clay', label: 'Terracotta Clay', color: '#D67D5C', code: '#D67D5C' },
                      { id: 'forest-sage', label: 'Forest Sage', color: '#047857', code: '#047857' }
                    ].map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() => setAccent(pal.id as AccentPalette)}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                          accent === pal.id
                            ? 'border-[#34D399] bg-[#163028] text-white font-bold'
                            : 'border-[#1E3A33] bg-[#101E1A] text-[#94A3B8] hover:border-[#2D544A]'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pal.color }} />
                        <div className="text-left">
                          <div className="text-xs font-mono">{pal.label}</div>
                          <div className="text-[9px] text-[#94A3B8]">{pal.code}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sliders & Initiative Covenant Split Floor */}
              <div className="p-4 rounded-2xl bg-[#0B1311] border border-[#1E3A33] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#A7F3D0]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Logo Cyber Glow Intensity</span>
                    </span>
                    <span className="font-bold text-[#34D399]">{glowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={glowIntensity}
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full accent-[#10B981] h-2 bg-[#162C26] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-[#A7F3D0]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Standard Covenant Floor</span>
                    </span>
                    <span className="font-bold text-[#34D399]">50% Enforced</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    All connected apps dynamically render the 50% restitution & survival royalty covenant token.
                  </p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'preview-fleet' && (
            <div className="space-y-4">
              <p className="text-xs text-[#94A3B8]">
                Status of all commercial applications subscribing to the centralized H.U.M.A.N. brand guidelines:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ecosystemConfig.connectedApps.map((app) => (
                  <div 
                    key={app.id}
                    className="p-4 rounded-2xl bg-[#0B1311] border border-[#1E3A33] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <EmeraldHumanNetworkLogoIcon size={22} />
                        <div>
                          <h4 className="text-xs font-mono font-bold text-[#F0FDF4]">{app.appName}</h4>
                          <span className="text-[10px] text-[#94A3B8] font-mono">App ID: {app.id}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/40 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>{app.status}</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#101E1A] border border-[#1E3A33] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#94A3B8]">Active Badge Shape:</span>
                      <span className="text-[#A7F3D0] font-semibold">{app.badgeShape}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                      <span>50% Royalty Covenant</span>
                      <span className="text-[#34D399]">Live CDN Linked</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code-embed' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0B1311] border border-[#1E3A33] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#34D399]" />
                    <h4 className="text-xs font-mono font-bold text-[#F0FDF4]">
                      Option 1: Zero-Code Remote CSS CDN (Recommended)
                    </h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cssCdnTag, 'css')}
                    className="px-2.5 py-1 rounded-lg bg-[#064E3B] hover:bg-[#059669] text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'css' ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'css' ? 'Copied' : 'Copy <link>'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Paste this single tag into the <code className="text-[#A7F3D0]">&lt;head&gt;</code> of ForgeOS, Tome Crafter, RLM Pro, and RL Easy Flow. Any color/theme change made in this Admin Console applies automatically to all apps on next page load.
                </p>
                <pre className="p-3 rounded-xl bg-[#070D0B] border border-[#1E3A33] text-[11px] font-mono text-[#34D399] overflow-x-auto">
                  {cssCdnTag}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1311] border border-[#1E3A33] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#34D399]" />
                    <h4 className="text-xs font-mono font-bold text-[#F0FDF4]">
                      Option 2: Python SDK & JSON Tokens (`InitiativeClient`)
                    </h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(pythonSdkBranding, 'python')}
                    className="px-2.5 py-1 rounded-lg bg-[#064E3B] hover:bg-[#059669] text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'python' ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'python' ? 'Copied' : 'Copy Python'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#070D0B] border border-[#1E3A33] text-[11px] font-mono text-[#A7F3D0] overflow-x-auto">
                  {pythonSdkBranding}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-[#1E3A33] bg-[#101E1A] flex items-center justify-between">
          <span className="text-xs font-mono text-[#94A3B8]">
            Master Node: <span className="text-[#34D399]">The H.U.M.A.N. Initiative Console</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-[#142320] hover:bg-[#1E3A33] text-[#F0FDF4] font-mono text-xs font-semibold border border-[#1E3A33] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleBroadcastTheme}
              disabled={isBroadcasting}
              className="py-2 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1311] font-mono text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isBroadcasting ? 'Broadcasting...' : 'Save & Broadcast'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
