import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Copy, 
  Code, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Layers, 
  Palette, 
  Sliders, 
  FileCheck,
  Eye,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { CustomBadgeConfig } from '../types';
import { 
  MasterHumanBadgeIcon, 
  MasterHumanBrandLogoIcon,
  EmeraldHumanNetworkLogoIcon,
  TomeCrafterLogoIcon, 
  RlmProStudioLogoIcon, 
  ForgeOsLogoIcon, 
  RlEasyFlowLogoIcon,
  HumanProtocolLogo
} from './HumanLogo';

interface CustomBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBadge?: (config: CustomBadgeConfig) => void;
  currentAppName?: string;
}

const DEFAULT_CONFIG: CustomBadgeConfig = {
  id: 'badge_cfg_custom_' + Date.now().toString(36),
  appName: 'Tome Crafter',
  tagline: 'Powering Ethical AI apps, And Paying the People',
  covenantPct: 50,
  verificationUrl: 'https://human.trust/verify/tomecrafter-ai-book-studio',
  c2paHash: '0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b',
  logoVariant: 'tome-crafter',
  theme: 'natural-olive',
  badgeShape: 'seal-circle',
  isOfficialVerified: true,
  updatedAt: new Date().toISOString(),
};

export const CustomBadgeModal: React.FC<CustomBadgeModalProps> = ({
  isOpen,
  onClose,
  onApplyBadge,
  currentAppName
}) => {
  // 1. Target App Badge Config
  const [config, setConfig] = useState<CustomBadgeConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_active_custom_badge');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved badge config', e);
        }
      }
    }
    return DEFAULT_CONFIG;
  });

  // 2. Official H.U.M.A.N. Protocol Branding State
  const [protocolUploadedLogo, setProtocolUploadedLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('human_protocol_official_logo');
    }
    return null;
  });

  const [protocolPreset, setProtocolPreset] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('human_protocol_preset') || 'emerald-cyber';
    }
    return 'emerald-cyber';
  });

  const [activeTab, setActiveTab] = useState<'app-design' | 'protocol-logo' | 'embed' | 'c2pa'>('app-design');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [protocolDragActive, setProtocolDragActive] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [protocolSaved, setProtocolSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const protocolFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentAppName && !config.logoDataUrl && config.appName !== currentAppName) {
      setConfig(prev => ({
        ...prev,
        appName: currentAppName,
        verificationUrl: `https://human.trust/verify/${currentAppName.toLowerCase().replace(/\s+/g, '-')}`
      }));
    }
  }, [currentAppName]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 3000);
  };

  // --- App Logo Upload Handlers ---
  const handleAppLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setConfig(prev => ({
        ...prev,
        logoDataUrl: dataUrl,
        logoVariant: 'custom',
        updatedAt: new Date().toISOString()
      }));
    };
    reader.readAsDataURL(file);
  };

  // --- Protocol Logo Upload Handlers ---
  const handleProtocolLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setProtocolUploadedLogo(dataUrl);
      localStorage.setItem('human_protocol_official_logo', dataUrl);
      window.dispatchEvent(new Event('storage'));
      setProtocolSaved(true);
      setTimeout(() => setProtocolSaved(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectProtocolPreset = (preset: string) => {
    setProtocolPreset(preset);
    setProtocolUploadedLogo(null);
    localStorage.removeItem('human_protocol_official_logo');
    localStorage.setItem('human_protocol_preset', preset);
    window.dispatchEvent(new Event('storage'));
    setProtocolSaved(true);
    setTimeout(() => setProtocolSaved(false), 2000);
  };

  const handleSelectPreset = (variant: CustomBadgeConfig['logoVariant'], appName: string, hash: string) => {
    setConfig(prev => ({
      ...prev,
      logoVariant: variant,
      logoDataUrl: undefined,
      appName: appName,
      c2paHash: hash,
      verificationUrl: `https://human.trust/verify/${appName.toLowerCase().replace(/\s+/g, '-')}`,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleApplyToFleet = () => {
    const updated = { ...config, updatedAt: new Date().toISOString() };
    localStorage.setItem('human_active_custom_badge', JSON.stringify(updated));
    if (config.logoDataUrl) {
      localStorage.setItem('human_active_custom_logo', config.logoDataUrl);
    } else {
      localStorage.removeItem('human_active_custom_logo');
    }
    localStorage.setItem('human_badge_activated', 'true');
    localStorage.setItem('human_badge_linked', 'true');

    // Trigger storage event for cross-component sync
    window.dispatchEvent(new Event('storage'));
    
    if (onApplyBadge) {
      onApplyBadge(updated);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  // Generate Embed Snippets
  const scriptEmbedCode = `<!-- H.U.M.A.N. Protocol Verified Ethical AI Badge -->
<div id="human-certified-badge"></div>
<script 
  src="https://cdn.human-protocol.org/badge.v2.js" 
  data-app-id="${config.appName.toLowerCase().replace(/\s+/g, '_')}"
  data-app-name="${config.appName}"
  data-covenant="${config.covenantPct}"
  data-theme="${config.theme}"
  data-shape="${config.badgeShape}"
  data-c2pa-hash="${config.c2paHash}"
  ${config.logoDataUrl ? `data-logo-src="${config.logoDataUrl.substring(0, 48)}..."` : `data-logo-preset="${config.logoVariant}"`}
  data-verify-url="${config.verificationUrl}"
  async>
</script>`;

  const reactEmbedCode = `import { HumanCertifiedBadge } from '@human-protocol/react-badge';

export function TrustFooter() {
  return (
    <HumanCertifiedBadge 
      appName="${config.appName}"
      covenantSplit={${config.covenantPct}}
      theme="${config.theme}"
      shape="${config.badgeShape}"
      verificationUrl="${config.verificationUrl}"
      c2paHash="${config.c2paHash}"
      ${config.logoDataUrl ? `customLogoUrl="${config.logoDataUrl.substring(0, 48)}..."` : `logoPreset="${config.logoVariant}"`}
      onVerifyClick={() => window.open('${config.verificationUrl}', '_blank')}
    />
  );
}`;

  const renderBadgeIcon = (size = 40) => {
    if (config.logoVariant === 'custom' && config.logoDataUrl) {
      return (
        <img 
          src={config.logoDataUrl} 
          alt={config.appName} 
          className="rounded-lg object-contain border border-[#5A5A40]/30 shadow-xs"
          style={{ width: size, height: size }}
        />
      );
    }

    switch (config.logoVariant) {
      case 'tome-crafter':
        return <TomeCrafterLogoIcon size={size} />;
      case 'rlm-pro-studio':
        return <RlmProStudioLogoIcon size={size} />;
      case 'forgeos':
        return <ForgeOsLogoIcon size={size} />;
      case 'rl-easy-flow':
        return <RlEasyFlowLogoIcon size={size} />;
      case 'emerald-cyber':
        return <EmeraldHumanNetworkLogoIcon size={size} />;
      case 'human-master':
      default:
        return <MasterHumanBadgeIcon size={size} colorTheme={config.theme} />;
    }
  };

  const getThemeClasses = () => {
    switch (config.theme) {
      case 'emerald-neon':
        return {
          container: 'bg-[#064E3B] text-[#ECFDF5] border-[#10B981]/50 shadow-[0_4px_20px_rgba(16,185,129,0.25)]',
          pill: 'bg-[#047857] text-[#A7F3D0] border-[#34D399]',
          accent: 'text-[#34D399]',
          subtext: 'text-[#A7F3D0]/80'
        };
      case 'warm-clay':
        return {
          container: 'bg-[#FAF0EC] text-[#2D2926] border-[#EECDBC] shadow-sm',
          pill: 'bg-[#FAF0EC] text-[#D67D5C] border-[#D67D5C]',
          accent: 'text-[#D67D5C]',
          subtext: 'text-[#6A655C]'
        };
      case 'dark-slate':
        return {
          container: 'bg-[#1E1E1E] text-[#F9F7F2] border-[#3A3835] shadow-lg',
          pill: 'bg-[#2D2926] text-[#D67D5C] border-[#5A5A40]',
          accent: 'text-[#E5E0D8]',
          subtext: 'text-[#B8ADA0]'
        };
      case 'natural-olive':
      default:
        return {
          container: 'bg-[#F9F7F2] text-[#2D2926] border-[#DCD5CA] shadow-sm',
          pill: 'bg-[#F2ECE4] text-[#5A5A40] border-[#5A5A40]/40',
          accent: 'text-[#5A5A40]',
          subtext: 'text-[#6A655C]'
        };
    }
  };

  const themeStyle = getThemeClasses();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#DCD5CA] bg-[#FFFFFF] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] bg-[#F9F7F2] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A5A40] text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2D2926] flex items-center gap-2">
                Brand & Trust Badge Manager
                <span className="rounded-full bg-[#EBF3ED] px-2.5 py-0.5 text-xs font-mono font-bold text-[#3D6E50] border border-[#C5DEC9]">
                  50% Fund Covenant
                </span>
              </h2>
              <p className="text-xs text-[#6A655C]">
                Configure target app emblems, customize the official H.U.M.A.N. Protocol logo, and generate embed codes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6A655C] hover:bg-[#E5E0D8] hover:text-[#2D2926] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Nav Tabs */}
        <div className="flex border-b border-[#E5E0D8] bg-[#F2ECE4] px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('app-design')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'app-design'
                ? 'border-[#5A5A40] text-[#5A5A40] bg-white'
                : 'border-transparent text-[#6A655C] hover:text-[#2D2926]'
            }`}
          >
            <Palette className="w-4 h-4" />
            1. Target App Emblem & Badge
          </button>

          <button
            onClick={() => setActiveTab('protocol-logo')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'protocol-logo'
                ? 'border-[#5A5A40] text-[#5A5A40] bg-white'
                : 'border-transparent text-[#6A655C] hover:text-[#2D2926]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#3D6E50]" />
            2. H.U.M.A.N. Protocol Logo
            {protocolUploadedLogo && (
              <span className="w-2 h-2 rounded-full bg-[#3D6E50]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'embed'
                ? 'border-[#5A5A40] text-[#5A5A40] bg-white'
                : 'border-transparent text-[#6A655C] hover:text-[#2D2926]'
            }`}
          >
            <Code className="w-4 h-4" />
            3. Embed Code (HTML/React)
          </button>

          <button
            onClick={() => setActiveTab('c2pa')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'c2pa'
                ? 'border-[#5A5A40] text-[#5A5A40] bg-white'
                : 'border-transparent text-[#6A655C] hover:text-[#2D2926]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            4. C2PA Signature
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* TAB 1: TARGET APP EMBLEM & BADGE DESIGN */}
          {activeTab === 'app-design' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Controls */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Official App Presets Selection */}
                <div className="rounded-xl border border-[#E5E0D8] bg-[#FDFCF9] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]">
                      A. Select Target App Emblem (App Layer)
                    </label>
                    <span className="text-[11px] text-[#6A655C] font-mono">
                      Dedicated App Emblem
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectPreset('tome-crafter', 'Tome Crafter', '0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b')}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        config.logoVariant === 'tome-crafter' && !config.logoDataUrl
                          ? 'border-[#5A5A40] bg-[#FAF7F0] ring-2 ring-[#5A5A40]/30 shadow-xs'
                          : 'border-[#E5E0D8] bg-white hover:border-[#B8ADA0]'
                      }`}
                    >
                      <TomeCrafterLogoIcon size={32} />
                      <span className="text-xs font-bold mt-1 text-[#2D2926]">Tome Crafter</span>
                      <span className="text-[10px] text-[#6A655C]">Books ($29/mo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectPreset('rlm-pro-studio', 'RLM Pro Studio', '0x4f1b88e10c29a877bf4356e29910ac772189d9804b219')}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        config.logoVariant === 'rlm-pro-studio' && !config.logoDataUrl
                          ? 'border-[#5A5A40] bg-[#FAF7F0] ring-2 ring-[#5A5A40]/30 shadow-xs'
                          : 'border-[#E5E0D8] bg-white hover:border-[#B8ADA0]'
                      }`}
                    >
                      <RlmProStudioLogoIcon size={32} />
                      <span className="text-xs font-bold mt-1 text-[#2D2926]">RLM Pro</span>
                      <span className="text-[10px] text-[#6A655C]">Music ($49/mo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectPreset('forgeos', 'ForgeOS App Builder', '0x93de66a8710fa44029ce11082bb4901cb00192e441890')}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        config.logoVariant === 'forgeos' && !config.logoDataUrl
                          ? 'border-[#5A5A40] bg-[#FAF7F0] ring-2 ring-[#5A5A40]/30 shadow-xs'
                          : 'border-[#E5E0D8] bg-white hover:border-[#B8ADA0]'
                      }`}
                    >
                      <ForgeOsLogoIcon size={32} />
                      <span className="text-xs font-bold mt-1 text-[#2D2926]">ForgeOS</span>
                      <span className="text-[10px] text-[#6A655C]">Code ($99/mo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectPreset('rl-easy-flow', 'RL Easy Flow', '0x12fe98801bca772810de44901889c1048b219001a')}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        config.logoVariant === 'rl-easy-flow' && !config.logoDataUrl
                          ? 'border-[#5A5A40] bg-[#FAF7F0] ring-2 ring-[#5A5A40]/30 shadow-xs'
                          : 'border-[#E5E0D8] bg-white hover:border-[#B8ADA0]'
                      }`}
                    >
                      <RlEasyFlowLogoIcon size={32} />
                      <span className="text-xs font-bold mt-1 text-[#2D2926]">RL Easy Flow</span>
                      <span className="text-[10px] text-[#6A655C]">Video ($39/mo)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Or Upload Custom App Logo Image */}
                <div className="rounded-xl border border-[#E5E0D8] bg-[#FDFCF9] p-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">
                    B. Or Upload Custom App Logo (For Third-Party Apps)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      config.logoDataUrl 
                        ? 'border-[#5A5A40] bg-[#FAF7F0]' 
                        : 'border-[#DCD5CA] hover:border-[#5A5A40] bg-white'
                    }`}
                  >
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAppLogoUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="h-8 w-8 rounded-full bg-[#FAF0EC] flex items-center justify-center text-[#D67D5C]">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-[#2D2926]">
                        {config.logoDataUrl ? 'Click to replace custom app logo' : 'Upload custom logo for this specific app'}
                      </p>
                      <p className="text-[10px] text-[#6A655C]">
                        (Changes this app's badge only — preserves the H.U.M.A.N. Protocol logo)
                      </p>
                    </div>
                  </div>

                  {config.logoDataUrl && (
                    <div className="mt-2.5 flex items-center justify-between bg-[#FAF7F0] p-2 rounded-lg border border-[#E5E0D8]">
                      <div className="flex items-center gap-2">
                        <img src={config.logoDataUrl} alt="App logo" className="h-7 w-7 object-contain rounded border bg-white" />
                        <span className="text-xs font-medium text-[#2D2926]">Custom App Logo Active</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfig(prev => ({ ...prev, logoDataUrl: undefined, logoVariant: 'tome-crafter' }));
                        }}
                        className="text-xs text-[#C25438] hover:underline font-mono cursor-pointer"
                      >
                        Reset to Preset
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Text & Covenant Customization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] mb-1">App / Platform Name</label>
                    <input
                      type="text"
                      value={config.appName}
                      onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                      className="w-full rounded-lg border border-[#DCD5CA] bg-white px-3 py-2 text-sm text-[#2D2926] focus:border-[#5A5A40] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] mb-1">Society Fund Split %</label>
                    <input
                      type="number"
                      min={20}
                      max={60}
                      value={config.covenantPct}
                      onChange={(e) => setConfig({ ...config, covenantPct: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[#DCD5CA] bg-white px-3 py-2 text-sm text-[#2D2926] focus:border-[#5A5A40] focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                {/* 4. Shape & Theme Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] mb-1">Badge Shape Style</label>
                    <select
                      value={config.badgeShape}
                      onChange={(e) => setConfig({ ...config, badgeShape: e.target.value as any })}
                      className="w-full rounded-lg border border-[#DCD5CA] bg-white px-3 py-2 text-sm text-[#2D2926] focus:border-[#5A5A40] focus:outline-hidden"
                    >
                      <option value="seal-circle">Circular Trust Seal</option>
                      <option value="embedded-pill">Embedded Floating Pill</option>
                      <option value="card-provenance">Full Provenance Card</option>
                      <option value="hex-token">Hexagonal Node Token</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] mb-1">Theme Palette</label>
                    <select
                      value={config.theme}
                      onChange={(e) => setConfig({ ...config, theme: e.target.value as any })}
                      className="w-full rounded-lg border border-[#DCD5CA] bg-white px-3 py-2 text-sm text-[#2D2926] focus:border-[#5A5A40] focus:outline-hidden"
                    >
                      <option value="natural-olive">Natural Olive (Official)</option>
                      <option value="emerald-neon">Cyber Emerald Neon</option>
                      <option value="warm-clay">Warm Clay Terracotta</option>
                      <option value="dark-slate">Dark Slate Luxury</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Right Column: Live App Badge Preview */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-center space-y-4">
                <div className="flex items-center justify-between w-full border-b border-[#E5E0D8] pb-2 text-xs">
                  <span className="font-mono text-[#6A655C] flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#5A5A40]" />
                    LIVE RENDERED BADGE
                  </span>
                  <span className="font-mono font-bold text-[#3D6E50] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#C5DEC9]">
                    Verified Active
                  </span>
                </div>

                {/* Render Selected Badge Shape */}
                <div className="w-full flex items-center justify-center min-h-[170px] p-2">
                  {/* Variant 1: Circular Seal */}
                  {config.badgeShape === 'seal-circle' && (
                    <div 
                      onClick={() => {
                        window.location.hash = 'portal';
                        try { window.history.pushState({}, '', '/copyright-owner'); } catch {}
                        onClose();
                      }}
                      className={`flex flex-col items-center text-center p-4 rounded-2xl border ${themeStyle.container} transition-all max-w-[260px] cursor-pointer hover:scale-103 active:scale-98 shadow-md`}
                      title="Click to view live Copyright & Royalty Landing Page"
                    >
                      <div className="mb-2">
                        {renderBadgeIcon(48)}
                      </div>
                      <span className="font-bold text-sm leading-tight">{config.appName}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mt-1.5 border ${themeStyle.pill}`}>
                        {config.covenantPct}% CREATOR FUND VERIFIED
                      </span>
                      <span className={`text-[10px] mt-1.5 ${themeStyle.subtext}`}>
                        {config.tagline}
                      </span>
                      <div className="mt-2 text-[9px] font-mono opacity-70">
                        Powered by H.U.M.A.N. Protocol
                      </div>
                    </div>
                  )}

                  {/* Variant 2: Embedded Floating Pill */}
                  {config.badgeShape === 'embedded-pill' && (
                    <div 
                      onClick={() => {
                        window.location.hash = 'portal';
                        try { window.history.pushState({}, '', '/copyright-owner'); } catch {}
                        onClose();
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-full border ${themeStyle.container} transition-all shadow-md cursor-pointer hover:scale-103 active:scale-98`}
                      title="Click to view live Copyright & Royalty Landing Page"
                    >
                      {renderBadgeIcon(28)}
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-xs leading-none">{config.appName}</span>
                        <span className="text-[10px] font-mono opacity-85 mt-0.5">
                          {config.covenantPct}% Royalty Covenant • H.U.M.A.N.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Variant 3: Full Provenance Card */}
                  {config.badgeShape === 'card-provenance' && (
                    <div 
                      onClick={() => {
                        window.location.hash = 'portal';
                        try { window.history.pushState({}, '', '/copyright-owner'); } catch {}
                        onClose();
                      }}
                      className={`w-full p-4 rounded-xl border ${themeStyle.container} space-y-2.5 text-left cursor-pointer hover:scale-102 active:scale-98 shadow-md`}
                      title="Click to view live Copyright & Royalty Landing Page"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {renderBadgeIcon(30)}
                          <div>
                            <div className="font-bold text-xs">{config.appName}</div>
                            <div className="text-[10px] opacity-75">Certified via H.U.M.A.N. Protocol</div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${themeStyle.pill}`}>
                          {config.covenantPct}% COVENANT
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/5 text-[10px] font-mono truncate">
                        C2PA: {config.c2paHash}
                      </div>
                    </div>
                  )}

                  {/* Variant 4: Hex Token */}
                  {config.badgeShape === 'hex-token' && (
                    <div 
                      onClick={() => {
                        window.location.hash = 'portal';
                        try { window.history.pushState({}, '', '/copyright-owner'); } catch {}
                        onClose();
                      }}
                      className={`flex flex-col items-center p-4 rounded-xl border ${themeStyle.container} text-center cursor-pointer hover:scale-103 active:scale-98 shadow-md`}
                      title="Click to view live Copyright & Royalty Landing Page"
                    >
                      {renderBadgeIcon(52)}
                      <span className="font-bold text-xs mt-2">{config.appName} Node</span>
                      <span className="text-[10px] font-mono mt-1 opacity-80">{config.covenantPct}% Fund Covenant Active</span>
                    </div>
                  )}
                </div>

                <div className="w-full bg-[#FFFFFF] p-3 rounded-xl border border-[#E5E0D8] text-[11px] text-[#6A655C] text-left space-y-1">
                  <div className="flex justify-between">
                    <span>Target Verification:</span>
                    <span className="font-mono text-[#5A5A40] truncate max-w-[140px]">{config.verificationUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>C2PA Manifest:</span>
                    <span className="font-mono text-[#3D6E50] font-bold">Ed25519 Signed</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyToFleet}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A34] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#FAF0EC]" />
                  <span>{isSaved ? 'Applied & Synced!' : 'Apply Badge to Royalties & Fleet'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: H.U.M.A.N. PROTOCOL LOGO MANAGEMENT */}
          {activeTab === 'protocol-logo' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#EBF3ED] border border-[#C5DEC9] text-[#2D2926]">
                <h3 className="font-bold text-sm flex items-center gap-2 text-[#3D6E50]">
                  <ShieldCheck className="w-4 h-4" />
                  H.U.M.A.N. Protocol Identity Layer
                </h3>
                <p className="text-xs text-[#5A5A40] mt-1">
                  The H.U.M.A.N. Protocol is the master authority powering ethical AI and distributing 50% subscription micro-royalties. This logo appears in the master header, verification seals, and audit registries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1: Emerald Cyber Network Vector (User's preferred style) */}
                <div 
                  onClick={() => handleSelectProtocolPreset('emerald-cyber')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                    protocolPreset === 'emerald-cyber' && !protocolUploadedLogo
                      ? 'border-[#3D6E50] bg-[#FAF7F0] ring-2 ring-[#3D6E50]/20 shadow-md'
                      : 'border-[#E5E0D8] bg-white hover:border-[#3D6E50]'
                  }`}
                >
                  <div className="p-2">
                    <EmeraldHumanNetworkLogoIcon size={56} />
                  </div>
                  <div className="mt-3">
                    <h4 className="font-bold text-sm text-[#2D2926]">Emerald Cyber Network</h4>
                    <p className="text-[11px] text-[#6A655C] mt-0.5">Official Turquoise Neural Constellation</p>
                  </div>
                  <span className={`mt-3 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    protocolPreset === 'emerald-cyber' && !protocolUploadedLogo
                      ? 'bg-[#3D6E50] text-white'
                      : 'bg-[#FAF8F5] text-[#5A5A40] border border-[#DCD5CA]'
                  }`}>
                    {protocolPreset === 'emerald-cyber' && !protocolUploadedLogo ? 'Active Protocol Logo' : 'Select Option'}
                  </span>
                </div>

                {/* Option 2: Natural Olive Brand Vector */}
                <div 
                  onClick={() => handleSelectProtocolPreset('natural-olive')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                    protocolPreset === 'natural-olive' && !protocolUploadedLogo
                      ? 'border-[#5A5A40] bg-[#FAF7F0] ring-2 ring-[#5A5A40]/20 shadow-md'
                      : 'border-[#E5E0D8] bg-white hover:border-[#5A5A40]'
                  }`}
                >
                  <div className="p-2">
                    <MasterHumanBrandLogoIcon size={56} />
                  </div>
                  <div className="mt-3">
                    <h4 className="font-bold text-sm text-[#2D2926]">Natural Olive Geometric</h4>
                    <p className="text-[11px] text-[#6A655C] mt-0.5">Classic Brand Palette (#5A5A40 / #D67D5C)</p>
                  </div>
                  <span className={`mt-3 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    protocolPreset === 'natural-olive' && !protocolUploadedLogo
                      ? 'bg-[#5A5A40] text-white'
                      : 'bg-[#FAF8F5] text-[#5A5A40] border border-[#DCD5CA]'
                  }`}>
                    {protocolPreset === 'natural-olive' && !protocolUploadedLogo ? 'Active Protocol Logo' : 'Select Option'}
                  </span>
                </div>

                {/* Option 3: Custom Uploaded H.U.M.A.N. Protocol Image */}
                <div 
                  onClick={() => protocolFileInputRef.current?.click()}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                    protocolUploadedLogo
                      ? 'border-[#D67D5C] bg-[#FAF7F0] ring-2 ring-[#D67D5C]/20 shadow-md'
                      : 'border-dashed border-[#DCD5CA] bg-[#FAF8F5] hover:border-[#D67D5C]'
                  }`}
                >
                  <input 
                    ref={protocolFileInputRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProtocolLogoUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="p-2">
                    {protocolUploadedLogo ? (
                      <img src={protocolUploadedLogo} alt="Uploaded H.U.M.A.N. logo" className="w-14 h-14 object-contain rounded-xl border bg-white p-1" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D67D5C] mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h4 className="font-bold text-sm text-[#2D2926]">
                      {protocolUploadedLogo ? 'Custom Protocol Image' : 'Upload From Gallery'}
                    </h4>
                    <p className="text-[11px] text-[#6A655C] mt-0.5">
                      Upload your specific H.U.M.A.N. protocol PNG / SVG
                    </p>
                  </div>
                  <span className={`mt-3 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    protocolUploadedLogo
                      ? 'bg-[#D67D5C] text-white'
                      : 'bg-white text-[#D67D5C] border border-[#EECDBC]'
                  }`}>
                    {protocolUploadedLogo ? 'Custom Image Active' : 'Browse File'}
                  </span>
                </div>
              </div>

              {/* Live Preview of Header & Footer Branding */}
              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 space-y-3">
                <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block">
                  Protocol Branding Preview (Header / Master Logo):
                </span>
                <div className="p-3 bg-white rounded-xl border border-[#DCD5CA] flex items-center justify-between">
                  <HumanProtocolLogo size="md" showText={true} />
                  <span className="text-xs font-mono font-bold text-[#3D6E50] bg-[#EBF3ED] px-2.5 py-1 rounded border border-[#C5DEC9]">
                    {protocolSaved ? '✓ Saved!' : 'Master Protocol'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMBED CODE */}
          {activeTab === 'embed' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-1.5">
                  Universal HTML Script Tag Embed
                </label>
                <div className="relative">
                  <pre className="rounded-xl bg-[#1E1E1E] p-4 text-xs font-mono text-[#D4D4D4] overflow-x-auto">
                    {scriptEmbedCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(scriptEmbedCode, 'script')}
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-[#333333] hover:bg-[#444444] px-3 py-1.5 text-xs text-white transition-colors cursor-pointer"
                  >
                    {copiedType === 'script' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'script' ? 'Copied' : 'Copy Script'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-1.5">
                  React Component Snippet
                </label>
                <div className="relative">
                  <pre className="rounded-xl bg-[#1E1E1E] p-4 text-xs font-mono text-[#D4D4D4] overflow-x-auto">
                    {reactEmbedCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(reactEmbedCode, 'react')}
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-[#333333] hover:bg-[#444444] px-3 py-1.5 text-xs text-white transition-colors cursor-pointer"
                  >
                    {copiedType === 'react' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'react' ? 'Copied' : 'Copy React'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: C2PA CRYPTOGRAPHIC SIGNATURE */}
          {activeTab === 'c2pa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2D2926]">
                  <FileCheck className="w-4 h-4 text-[#3D6E50]" />
                  <span>C2PA / CAI Cryptographic Provenance Manifest</span>
                </div>
                <p className="text-xs text-[#6A655C]">
                  Each badge embedded into client applications is cryptographically paired with an immutable C2PA assertion certifying the 50% subscription covenant.
                </p>
                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#DCD5CA] font-mono text-xs text-[#2D2926] break-all">
                  Hash: <strong>{config.c2paHash}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F5] px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[#6A655C]">
            <ShieldCheck className="w-4 h-4 text-[#3D6E50]" />
            <span>Changes persist immediately to local session storage.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-[#DCD5CA] bg-white px-4 py-2 text-xs font-semibold text-[#6A655C] hover:bg-[#F2ECE4] hover:text-[#2D2926] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleApplyToFleet}
              className="rounded-xl bg-[#5A5A40] hover:bg-[#4A4A34] px-5 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Royalties Portal & Embed</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
