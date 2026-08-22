import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  FileCheck, 
  ChevronRight,
  Palette,
  Copy,
  Check
} from 'lucide-react';
import { CustomBadgeConfig } from '../types';
import { 
  EmeraldHumanNetworkLogoIcon, 
  MasterHumanBrandLogoIcon, 
  TomeCrafterLogoIcon, 
  RlmProStudioLogoIcon, 
  ForgeOsLogoIcon, 
  RlEasyFlowLogoIcon 
} from './HumanLogo';

interface TopUninvasiveTrustBadgeProps {
  onOpenBadgeModal?: () => void;
  onOpenPrivacyModal?: () => void;
  onNavigateToCopyright?: () => void;
}

export const TopUninvasiveTrustBadge: React.FC<TopUninvasiveTrustBadgeProps> = ({
  onOpenBadgeModal,
  onOpenPrivacyModal,
  onNavigateToCopyright
}) => {
  const [customBadge, setCustomBadge] = useState<CustomBadgeConfig | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_active_custom_badge');
      if (saved) {
        try { 
          const parsed = JSON.parse(saved);
          if (parsed && (!parsed.covenantPct || parsed.covenantPct === 40)) {
            parsed.covenantPct = 50;
            localStorage.setItem('human_active_custom_badge', JSON.stringify(parsed));
          }
          return parsed; 
        } catch (e) { console.error(e); }
      }
    }
    return null;
  });

  const [protocolLogo, setProtocolLogo] = useState<string | null>(() => {
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

  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('human_active_custom_badge');
        if (saved) {
          try { 
            const parsed = JSON.parse(saved);
            if (parsed && (!parsed.covenantPct || parsed.covenantPct === 40)) {
              parsed.covenantPct = 50;
            }
            setCustomBadge(parsed); 
          } catch {}
        }
        setProtocolLogo(localStorage.getItem('human_protocol_official_logo'));
        setProtocolPreset(localStorage.getItem('human_protocol_preset') || 'emerald-cyber');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    const hash = customBadge?.c2paHash || '0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b';
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToCopyright) {
      onNavigateToCopyright();
    } else if (typeof window !== 'undefined') {
      window.location.hash = 'portal';
      try {
        window.history.pushState({}, '', '/copyright-owner');
      } catch {}
    }
  };

  const appName = customBadge?.appName || 'Tome Crafter';
  const covenantPct = customBadge?.covenantPct || 50;

  const renderProtocolIcon = (size = 20) => {
    if (protocolLogo) {
      return (
        <img 
          src={protocolLogo} 
          alt="H.U.M.A.N. Protocol" 
          className="w-full h-full object-contain rounded-full"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (protocolPreset === 'emerald-cyber') {
      return <EmeraldHumanNetworkLogoIcon size={size} />;
    }
    return <MasterHumanBrandLogoIcon size={size} />;
  };

  const renderAppIcon = (size = 24) => {
    if (customBadge?.logoVariant === 'custom' && customBadge.logoDataUrl) {
      return (
        <img 
          src={customBadge.logoDataUrl} 
          alt={appName} 
          className="w-full h-full object-contain rounded-md"
          referrerPolicy="no-referrer"
        />
      );
    }
    switch (customBadge?.logoVariant) {
      case 'tome-crafter':
        return <TomeCrafterLogoIcon size={size} />;
      case 'rlm-pro-studio':
        return <RlmProStudioLogoIcon size={size} />;
      case 'forgeos':
        return <ForgeOsLogoIcon size={size} />;
      case 'rl-easy-flow':
        return <RlEasyFlowLogoIcon size={size} />;
      default:
        return <TomeCrafterLogoIcon size={size} />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleBadgeClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] hover:border-[#5A5A40] text-[#2D2926] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
        title="Verified Ethical AI Initiative Trust Badge — Click to view Copyright & Royalty Landing Page"
      >
        {/* Initiative Logo Icon */}
        <div className="w-5 h-5 rounded-full overflow-hidden bg-[#FAF8F5] border border-[#DCD5CA] flex items-center justify-center p-0.5 shrink-0 group-hover:scale-105 transition-transform">
          {renderProtocolIcon(16)}
        </div>

        {/* Verification Text - Compact & Noticeable */}
        <div className="flex items-center gap-1.5">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3D6E50] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3D6E50]"></span>
          </span>

          <span className="text-[11px] font-semibold text-[#2D2926] tracking-tight group-hover:text-[#5A5A40] transition-colors">
            Verified Ethical AI
          </span>

          <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#FAF0EC] text-[#D67D5C] border border-[#EECDBC]">
            {covenantPct}% Pool
          </span>
        </div>
      </button>

      {/* Uninvasive Hover Popover / Tooltip */}
      {showTooltip && (
        <div 
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute right-0 mt-1.5 w-80 z-50 rounded-xl bg-[#FFFFFF] border border-[#DCD5CA] shadow-xl p-3.5 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Header with Initiative & Target App */}
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#DCD5CA] p-1 flex items-center justify-center overflow-hidden shrink-0">
                {renderAppIcon(28)}
              </div>
              <div>
                <div className="font-bold text-[#2D2926] leading-none text-xs">{appName}</div>
                <div className="text-[10px] text-[#6A655C] font-mono mt-0.5">
                  Certified via The H.U.M.A.N. Initiative
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]">
              ACTIVE
            </span>
          </div>

          <p className="text-[11px] text-[#6A655C] leading-relaxed">
            Guaranteed {covenantPct}% gross subscription micro-royalties allocated directly to human training contributors.
          </p>

          <div className="bg-[#FAF8F5] p-2 rounded-lg border border-[#E5E0D8] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#6A655C] truncate max-w-[190px]">
              {customBadge?.c2paHash || '0x8a92e109ff8b432a...'}
            </span>
            <button
              onClick={handleCopyHash}
              className="text-[#5A5A40] hover:text-[#2D2926] flex items-center gap-1 text-[10px] font-mono font-bold cursor-pointer"
              title="Copy C2PA Signature Hash"
            >
              {copied ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3 text-[#5A5A40]" />}
              {copied ? 'Copied' : 'Hash'}
            </button>
          </div>

          {/* Direct Link to Copyright Landing Page */}
          <button
            onClick={handleBadgeClick}
            className="w-full py-2 px-3 rounded-lg bg-[#5A5A40] hover:bg-[#4A4A34] text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Copyright & Royalty Landing Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 pt-1 border-t border-[#E5E0D8]/60">
            {onOpenBadgeModal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                  onOpenBadgeModal();
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-[#5A5A40] text-[11px] font-semibold text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Palette className="w-3 h-3" />
                Customize Logos & Badge
              </button>
            )}
            {onOpenPrivacyModal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                  onOpenPrivacyModal();
                }}
                className="py-1.5 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-[#5A5A40] text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileCheck className="w-3 h-3" />
                Policy
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface FooterTrustBadgeProps {
  onOpenBadgeModal?: () => void;
  onOpenPrivacyModal?: () => void;
  onNavigateToCopyright?: () => void;
}

export const FooterTrustBadge: React.FC<FooterTrustBadgeProps> = ({
  onOpenBadgeModal,
  onOpenPrivacyModal,
  onNavigateToCopyright
}) => {
  const [customBadge, setCustomBadge] = useState<CustomBadgeConfig | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_active_custom_badge');
      if (saved) {
        try { 
          const parsed = JSON.parse(saved);
          if (parsed && (!parsed.covenantPct || parsed.covenantPct === 40)) {
            parsed.covenantPct = 50;
            localStorage.setItem('human_active_custom_badge', JSON.stringify(parsed));
          }
          return parsed; 
        } catch (e) { console.error(e); }
      }
    }
    return null;
  });

  const [protocolLogo, setProtocolLogo] = useState<string | null>(() => {
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

  useEffect(() => {
    const handleStorage = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('human_active_custom_badge');
        if (saved) {
          try { 
            const parsed = JSON.parse(saved);
            if (parsed && (!parsed.covenantPct || parsed.covenantPct === 40)) {
              parsed.covenantPct = 50;
            }
            setCustomBadge(parsed); 
          } catch {}
        }
        setProtocolLogo(localStorage.getItem('human_protocol_official_logo'));
        setProtocolPreset(localStorage.getItem('human_protocol_preset') || 'emerald-cyber');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToCopyright) {
      onNavigateToCopyright();
    } else if (typeof window !== 'undefined') {
      window.location.hash = 'portal';
      try {
        window.history.pushState({}, '', '/copyright-owner');
      } catch {}
    }
  };

  const appName = customBadge?.appName || 'Tome Crafter';
  const covenantPct = customBadge?.covenantPct || 50;

  const renderProtocolIcon = (size = 28) => {
    if (protocolLogo) {
      return (
        <img 
          src={protocolLogo} 
          alt="H.U.M.A.N. Protocol" 
          className="w-full h-full object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (protocolPreset === 'emerald-cyber') {
      return <EmeraldHumanNetworkLogoIcon size={size} />;
    }
    return <MasterHumanBrandLogoIcon size={size} />;
  };

  return (
    <div className="rounded-2xl border border-[#DCD5CA] bg-[#FFFFFF] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Master Initiative Identity with Link to Landing Page */}
      <div 
        onClick={handleBadgeClick}
        className="flex items-center gap-3 cursor-pointer group select-none"
        title="Click to view Copyright Owner & Royalty Landing Page"
      >
        <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] group-hover:border-[#5A5A40] p-1 flex items-center justify-center overflow-hidden shadow-2xs shrink-0 group-hover:scale-105 transition-all">
          {renderProtocolIcon(28)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2D2926] group-hover:text-[#5A5A40] transition-colors text-sm tracking-tight flex items-center gap-1">
              The H.U.M.A.N. Initiative
              <ChevronRight className="w-3.5 h-3.5 text-[#6A655C] group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]">
              <CheckCircle2 className="w-3 h-3 text-[#3D6E50]" />
              Official Trust Authority
            </span>
          </div>
          <p className="text-xs text-[#6A655C] mt-0.5">
            Powering Ethical AI apps, And Paying the People • Certifying {appName}
          </p>
        </div>
      </div>

      {/* Right: Covenant & Trust Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleBadgeClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF0EC] hover:bg-[#F2ECE4] border border-[#EECDBC] text-xs font-mono text-[#D67D5C] font-semibold transition-colors cursor-pointer"
          title="Direct link to verified Copyright Landing Page"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#D67D5C]" />
          <span>{covenantPct}% Revenue Split</span>
          <span className="text-[#8C857B]">•</span>
          <span>Zero-Knowledge C2PA</span>
        </button>

        {onOpenBadgeModal && (
          <button
            type="button"
            onClick={onOpenBadgeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#4A4A34] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Logos</span>
          </button>
        )}

        {onOpenPrivacyModal && (
          <button
            type="button"
            onClick={onOpenPrivacyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-[#5A5A40] text-xs font-semibold transition-all cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>View Policy</span>
          </button>
        )}
      </div>
    </div>
  );
};
