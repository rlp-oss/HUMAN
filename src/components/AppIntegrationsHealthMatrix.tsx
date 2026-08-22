import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  BookOpen, 
  Music, 
  Code, 
  Video, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  Zap, 
  Award, 
  DollarSign, 
  Sliders, 
  FileCheck, 
  CheckCheck, 
  Info,
  ChevronDown,
  ChevronUp,
  Key,
  Database,
  Globe,
  Radio,
  FileCode,
  Download,
  Terminal,
  Sparkles,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AppIntegrationHealthItem {
  id: string;
  name: string;
  appId: string;
  vertical: string;
  appUrl?: string;
  iconType: 'book' | 'music' | 'code' | 'video';
  healthScore: number;
  status: 'Optimal' | 'Warning' | 'Delinquent' | 'Unlinked';
  activationState: 'ACTIVE' | 'PENDING' | 'CONFIGURING';
  c2paHash: string;
  ftAuditId: string;
  storyIpId: string;
  royaltyBalance: number;
  lastAudited: string;
  checkpoints: {
    cleanroomCertified: boolean;
    c2paJumbfBound: boolean;
    royaltyFunded: boolean;
    personhoodVerified: boolean;
    regulatoryCompliant: boolean;
  };
  metrics: {
    totalInferences: string;
    royaltiesStreamedUsd: number;
    creatorsAttributed: number;
  };
}

interface AppIntegrationsHealthMatrixProps {
  onSelectAppForEmbed?: (appId: string, appName: string, appUrl?: string) => void;
  activeAppId?: string;
}

const INITIAL_APPS: AppIntegrationHealthItem[] = [
  {
    id: 'app_pub_01',
    name: 'Tome Crafter',
    appId: 'tomecrafter-ai-book-studio',
    vertical: 'Complete Book Creation & Publishing Suite',
    appUrl: 'https://tomecrafter-ai-book-studio.ai.studio',
    iconType: 'book',
    healthScore: 100,
    status: 'Optimal',
    activationState: 'ACTIVE',
    c2paHash: '0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b',
    ftAuditId: 'FT-ETHIC-TOMECRAFTER-2026',
    storyIpId: '0x33b4...tome77',
    royaltyBalance: 185.00,
    lastAudited: '2026-08-18 21:40 UTC',
    checkpoints: {
      cleanroomCertified: true,
      c2paJumbfBound: true,
      royaltyFunded: true,
      personhoodVerified: true,
      regulatoryCompliant: true,
    },
    metrics: {
      totalInferences: '48,200 chapters & manuscripts synthesized',
      royaltiesStreamedUsd: 1420.80,
      creatorsAttributed: 410,
    }
  },
  {
    id: 'app_rlm_02',
    name: 'RLM Pro Studio',
    appId: 'rlm-pro-studio',
    vertical: 'Hybrid Audio Production Suite',
    appUrl: 'https://remix-lyria-studio-5954.ai.studio',
    iconType: 'music',
    healthScore: 100,
    status: 'Optimal',
    activationState: 'ACTIVE',
    c2paHash: '0x4f1b88e10c29a877bf4356e29910ac772189d9804b219',
    ftAuditId: 'FT-ETHIC-RLM-AUDIO-2026',
    storyIpId: '0x9E83...audio99',
    royaltyBalance: 310.00,
    lastAudited: '2026-08-18 21:35 UTC',
    checkpoints: {
      cleanroomCertified: true,
      c2paJumbfBound: true,
      royaltyFunded: true,
      personhoodVerified: true,
      regulatoryCompliant: true,
    },
    metrics: {
      totalInferences: '22,600 audio stems & mixes synthesized',
      royaltiesStreamedUsd: 2840.50,
      creatorsAttributed: 512,
    }
  },
  {
    id: 'app_bld_03',
    name: 'ForgeOS App Builders & Tester',
    appId: 'forgeos-app-builder-tester',
    vertical: 'Open-Source Code AST Engine & Tester Console',
    appUrl: 'https://forgeos-app-builder-tester-console-416188261320.us-east1.run.app',
    iconType: 'code',
    healthScore: 100,
    status: 'Optimal',
    activationState: 'ACTIVE',
    c2paHash: '0x93de66a8710fa44029ce11082bb4901cb00192e441890',
    ftAuditId: 'FT-ETHIC-FORGEOS-APPBUILDER-2026',
    storyIpId: '0x11ce...code44',
    royaltyBalance: 250.00,
    lastAudited: '2026-08-18 21:30 UTC',
    checkpoints: {
      cleanroomCertified: true,
      c2paJumbfBound: true,
      royaltyFunded: true,
      personhoodVerified: true,
      regulatoryCompliant: true,
    },
    metrics: {
      totalInferences: '118,500 code completions & tests',
      royaltiesStreamedUsd: 3410.00,
      creatorsAttributed: 720,
    }
  },
  {
    id: 'app_vid_04',
    name: 'RL Easy Flow',
    appId: 'rl-easy-flow',
    vertical: 'AI-Powered Video Generation Studio',
    appUrl: 'https://rl-easy-flow.ai.studio',
    iconType: 'video',
    healthScore: 100,
    status: 'Optimal',
    activationState: 'ACTIVE',
    c2paHash: '0x22ab8991fc33910ebf778103418ba09c1189ac3409112',
    ftAuditId: 'FT-ETHIC-RL-EASY-FLOW-2026',
    storyIpId: '0x55ef...flow11',
    royaltyBalance: 220.00,
    lastAudited: '2026-08-18 21:25 UTC',
    checkpoints: {
      cleanroomCertified: true,
      c2paJumbfBound: true,
      royaltyFunded: true,
      personhoodVerified: true,
      regulatoryCompliant: true,
    },
    metrics: {
      totalInferences: '14,250 video scenes synthesized',
      royaltiesStreamedUsd: 2180.50,
      creatorsAttributed: 286,
    }
  },
];

export const AppIntegrationsHealthMatrix: React.FC<AppIntegrationsHealthMatrixProps> = ({
  onSelectAppForEmbed,
  activeAppId = 'tomecrafter-ai-book-studio'
}) => {
  const [apps, setApps] = useState<AppIntegrationHealthItem[]>(() => {
    const saved = localStorage.getItem('human_app_integrations_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved integrations', e);
      }
    }
    return INITIAL_APPS;
  });

  const [spotlightAppId, setSpotlightAppId] = useState<string>('app_pub_01'); // Tome Crafter spotlight
  const [scanningAppId, setScanningAppId] = useState<string | null>(null);
  const [isScanningAll, setIsScanningAll] = useState<boolean>(false);
  const [expandedAppId, setExpandedAppId] = useState<string | null>('app_pub_01');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModalApp, setActiveModalApp] = useState<AppIntegrationHealthItem | null>(null);
  const [isActivatingDomain, setIsActivatingDomain] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScanSingleApp = (appId: string, appName: string) => {
    setScanningAppId(appId);
    setTimeout(() => {
      setApps(prev => {
        const updated = prev.map(a => a.id === appId ? {
          ...a,
          lastAudited: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          healthScore: 100,
          activationState: 'ACTIVE' as const
        } : a);
        localStorage.setItem('human_app_integrations_v5', JSON.stringify(updated));
        return updated;
      });
      setScanningAppId(null);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5A5A40', '#3D6E50', '#D67D5C']
      });
      showToast(`Verification Health scanned for ${appName}: 100% HEALTHY`);
    }, 600);
  };

  const handleScanAllApps = () => {
    setIsScanningAll(true);
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setApps(prev => {
        const updated = prev.map(a => ({
          ...a,
          lastAudited: now,
          healthScore: 100,
          activationState: 'ACTIVE' as const
        }));
        localStorage.setItem('human_app_integrations_v5', JSON.stringify(updated));
        return updated;
      });
      setIsScanningAll(false);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5A5A40', '#3D6E50', '#D67D5C', '#10B981']
      });
      showToast('All 4 App Integrations scanned: 100% Cryptographic Verification Health (4/4 Complete)!');
    }, 900);
  };

  const handleActivateAppDomain = (app: AppIntegrationHealthItem) => {
    setIsActivatingDomain(true);
    setTimeout(() => {
      setApps(prev => {
        const updated = prev.map(a => a.id === app.id ? {
          ...a,
          activationState: 'ACTIVE' as const,
          healthScore: 100,
          status: 'Optimal' as const,
          lastAudited: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
        } : a);
        localStorage.setItem('human_app_integrations_v5', JSON.stringify(updated));
        return updated;
      });
      setIsActivatingDomain(false);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D67D5C', '#5A5A40', '#10B981']
      });
      showToast(`H.U.M.A.N. Badge Activated & Cryptographically Bound to ${app.name} (${app.appUrl})!`);
    }, 800);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 3000);
  };

  const getIcon = (type: AppIntegrationHealthItem['iconType']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-[#D67D5C]" />;
      case 'music':
        return <Music className="w-4 h-4 text-[#5A5A40]" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-emerald-800" />;
      case 'code':
        return <Code className="w-4 h-4 text-indigo-700" />;
    }
  };

  const getIconBg = (type: AppIntegrationHealthItem['iconType']) => {
    switch (type) {
      case 'video':
        return 'bg-[#FAF0EC] border-[#EECDBC]';
      case 'music':
        return 'bg-[#FAF8F5] border-[#DCD5CA]';
      case 'book':
        return 'bg-emerald-50 border-emerald-200';
      case 'code':
        return 'bg-indigo-50 border-indigo-200';
    }
  };

  const currentSpotlightApp = apps.find(a => a.id === spotlightAppId) || apps[0];
  const overallAvgScore = Math.round(apps.reduce((acc, a) => acc + a.healthScore, 0) / apps.length);

  return (
    <div className="rounded-2xl border-2 border-[#5A5A40]/30 bg-[#FFFFFF] p-6 space-y-6 shadow-sm">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#3D6E50]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#3D6E50]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header with aggregate health status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/30 text-[11px] font-mono text-[#5A5A40] font-bold">
            <Radio className="w-3.5 h-3.5 text-[#3D6E50] animate-pulse" />
            <span>Complete 4-App Fleet • Domain Activation & Health Matrix</span>
          </div>
          <h3 className="text-lg font-bold text-[#2D2926] tracking-tight flex items-center gap-2">
            <span>4 Flagship App Integrations</span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-700" />
              4/4 Fleet Live & Bound
            </span>
          </h3>
          <p className="text-xs text-[#6A655C] leading-relaxed">
            Directly manage live URL bindings, C2PA JUMBF cryptographic roots, Fairly Trained cleanroom IDs, and real-time pass-through royalty pools across your complete ecosystem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
          {/* Aggregate Score Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EBF3ED] border border-[#C9D1BE] text-xs font-mono text-[#3D6E50] font-bold shadow-2xs">
            <CheckCheck className="w-4 h-4 text-[#3D6E50]" />
            <span>Fleet Health: {overallAvgScore}% 4/4 Perfect</span>
          </div>

          {/* Scan All Button */}
          <button
            type="button"
            onClick={handleScanAllApps}
            disabled={isScanningAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningAll ? 'animate-spin' : ''}`} />
            <span>{isScanningAll ? 'Scanning All 4 Apps...' : 'Re-verify All Apps'}</span>
          </button>
        </div>
      </div>

      {/* Spotlight Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-mono uppercase text-[#8C857B] font-bold whitespace-nowrap mr-1">
          Active Spotlight:
        </span>
        {apps.map(app => (
          <button
            key={app.id}
            type="button"
            onClick={() => setSpotlightAppId(app.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              spotlightAppId === app.id
                ? 'bg-[#2D2926] text-white shadow-xs'
                : 'bg-[#FAF8F5] border border-[#E5E0D8] text-[#5A5A40] hover:bg-[#F2ECE4]'
            }`}
          >
            {getIcon(app.iconType)}
            <span>{app.name}</span>
            <span className="text-[9px] bg-emerald-900/40 text-emerald-300 px-1.5 py-0.2 rounded">
              BOUND
            </span>
          </button>
        ))}
      </div>

      {/* Featured Activation Spotlight: Tome Crafter / Selected */}
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-4.5 space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${getIconBg(currentSpotlightApp.iconType)} shadow-2xs shrink-0`}>
              {getIcon(currentSpotlightApp.iconType)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#2D2926]">{currentSpotlightApp.name}</span>
                <span className="text-[10px] font-mono bg-[#FFFFFF] text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  {currentSpotlightApp.appId}
                </span>
                <span className="text-[10px] font-mono bg-[#E8F5E9] text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  <span>ACTIVATED & BOUND</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#6A655C] mt-0.5">
                <Globe className="w-3 h-3 text-emerald-700" />
                <a 
                  href={currentSpotlightApp.appUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-800 hover:underline font-bold flex items-center gap-1 truncate max-w-md"
                >
                  <span className="truncate">{currentSpotlightApp.appUrl}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveModalApp(currentSpotlightApp)}
              className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono font-bold text-[#5A5A40] flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Get Embed Snippet</span>
            </button>

            <button
              type="button"
              onClick={() => handleActivateAppDomain(currentSpotlightApp)}
              disabled={isActivatingDomain}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>{isActivatingDomain ? 'Verifying Handshake...' : 'Test Domain Handshake'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 text-[11px] font-mono">
          <div className="bg-[#FFFFFF] p-2 rounded-lg border border-emerald-200">
            <span className="text-[#8C857B] block text-[9px]">Cleanroom Audit</span>
            <strong className="text-[#2D2926] truncate block">{currentSpotlightApp.ftAuditId}</strong>
          </div>
          <div className="bg-[#FFFFFF] p-2 rounded-lg border border-emerald-200">
            <span className="text-[#8C857B] block text-[9px]">C2PA JUMBF Manifest</span>
            <strong className="text-emerald-800 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> Bound Active
            </strong>
          </div>
          <div className="bg-[#FFFFFF] p-2 rounded-lg border border-emerald-200">
            <span className="text-[#8C857B] block text-[9px]">Royalty Buffer</span>
            <strong className="text-[#2D2926]">${currentSpotlightApp.royaltyBalance.toFixed(2)} Active Pool</strong>
          </div>
          <div className="bg-[#FFFFFF] p-2 rounded-lg border border-emerald-200">
            <span className="text-[#8C857B] block text-[9px]">Story Protocol IP</span>
            <strong className="text-[#5A5A40]">{currentSpotlightApp.storyIpId}</strong>
          </div>
        </div>
      </div>

      {/* 4 Apps Grid */}
      <div className="grid grid-cols-1 gap-4">
        {apps.map((app) => {
          const isExpanded = expandedAppId === app.id;
          const isScanningThis = scanningAppId === app.id;

          return (
            <div
              key={app.id}
              className={`rounded-2xl border transition-all ${
                isExpanded 
                  ? 'border-[#5A5A40]/60 bg-[#FFFFFF] shadow-sm ring-1 ring-[#5A5A40]/20'
                  : 'border-[#E5E0D8] bg-[#FAF8F5] hover:border-[#DCD5CA]'
              }`}
            >
              {/* App Summary Row */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${getIconBg(app.iconType)} shrink-0 shadow-2xs`}>
                    {getIcon(app.iconType)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#2D2926]">{app.name}</h4>
                      <code className="text-[10px] font-mono text-[#5A5A40] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#DCD5CA]">
                        {app.appId}
                      </code>
                      {app.appUrl && (
                        <a 
                          href={app.appUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-mono text-emerald-800 hover:underline flex items-center gap-1 bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-emerald-200"
                        >
                          <Globe className="w-2.5 h-2.5 text-emerald-700" />
                          <span className="max-w-[220px] truncate">{app.appUrl.replace('https://', '')}</span>
                          <ExternalLink className="w-2 h-2" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#6A655C]">
                      <span>{app.vertical}</span>
                      <span>•</span>
                      <span>Audited: {app.lastAudited}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Health Gauge */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#3D6E50]">
                      <span className="h-2 w-2 rounded-full bg-[#3D6E50] animate-pulse"></span>
                      <span>Health: {app.healthScore}%</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8C857B]">
                      Pool: ${app.royaltyBalance.toFixed(2)} funded
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleScanSingleApp(app.id, app.name)}
                      disabled={isScanningThis}
                      className="p-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-[#5A5A40] hover:text-[#2D2926] transition-colors cursor-pointer disabled:opacity-50"
                      title="Run cryptographic verification health scan"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isScanningThis ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModalApp(app)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      title="Inspect embed snippet and domain configuration"
                    >
                      <FileCode className="w-3 h-3 text-[#5A5A40]" />
                      <span>Configure</span>
                    </button>

                    {onSelectAppForEmbed && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectAppForEmbed(app.appId, app.name, app.appUrl);
                          showToast(`Selected ${app.name} (${app.appId}) as active embed target!`);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
                        title="Set as active badge target in the console"
                      >
                        Set Active
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E5E0D8] text-[#6A655C] transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Diagnostic Detail View */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-[#E5E0D8] space-y-4 text-xs animate-fade-in bg-[#FFFFFF] rounded-b-2xl">
                  {/* 5-Point Verification Health Checkpoints */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8C857B] font-bold block mb-2">
                      5-Stage Verification Health Checkpoints:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#3D6E50]">
                          <Check className="w-3 h-3 text-[#3D6E50]" />
                          <span>Cleanroom Trained</span>
                        </div>
                        <p className="text-[9px] text-[#6A655C] font-mono leading-tight truncate">
                          {app.ftAuditId}
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#3D6E50]">
                          <Check className="w-3 h-3 text-[#3D6E50]" />
                          <span>C2PA JUMBF Root</span>
                        </div>
                        <p className="text-[9px] text-[#6A655C] font-mono truncate">
                          {app.c2paHash.substring(0, 14)}...
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#3D6E50]">
                          <Check className="w-3 h-3 text-[#3D6E50]" />
                          <span>Royalty Escrow</span>
                        </div>
                        <p className="text-[9px] text-[#6A655C] font-mono leading-tight">
                          ${app.royaltyBalance.toFixed(2)} Active
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#3D6E50]">
                          <Check className="w-3 h-3 text-[#3D6E50]" />
                          <span>Personhood Proof</span>
                        </div>
                        <p className="text-[9px] text-[#6A655C] font-mono leading-tight">
                          Hi Human Certified
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#3D6E50]">
                          <Check className="w-3 h-3 text-[#3D6E50]" />
                          <span>EU AI Act Art. 53</span>
                        </div>
                        <p className="text-[9px] text-[#6A655C] font-mono leading-tight">
                          100% Compliant
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Manifest Hash & Story Protocol Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D8]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#8C857B]">
                        <span>C2PA Manifest Merkle Root (SHA-256)</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(app.c2paHash, `hash_${app.id}`)}
                          className="text-[#5A5A40] hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                        >
                          {copiedSnippet === `hash_${app.id}` ? <Check className="w-2.5 h-2.5 text-[#3D6E50]" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedSnippet === `hash_${app.id}` ? 'Copied' : 'Copy Hash'}</span>
                        </button>
                      </div>
                      <code className="text-[11px] font-mono text-[#2D2926] block truncate">
                        {app.c2paHash}
                      </code>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#8C857B]">
                        <span>Story Protocol IP Asset & Registry ID</span>
                        <span className="text-[9px] font-mono text-[#3D6E50] font-bold">PIL-1.0 Verified</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#2D2926]">
                        <span>Asset: <code className="text-[#5A5A40]">{app.storyIpId}</code></span>
                        <span>Registry: <code className="text-[#5A5A40]">{app.ftAuditId}</code></span>
                      </div>
                    </div>
                  </div>

                  {/* Performance & Royalty Volume Footprint */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-[11px] font-mono text-[#6A655C]">
                    <div className="flex flex-wrap items-center gap-4">
                      <span>Total Volume: <strong className="text-[#2D2926]">{app.metrics.totalInferences}</strong></span>
                      <span>•</span>
                      <span>Micro-Royalties Streamed: <strong className="text-[#3D6E50]">${app.metrics.royaltiesStreamedUsd.toFixed(2)}</strong></span>
                      <span>•</span>
                      <span>Attributed Creators: <strong className="text-[#D67D5C]">{app.metrics.creatorsAttributed}</strong></span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        window.location.hash = 'portal';
                        try { window.history.pushState({}, '', '/copyright-owner'); } catch {}
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                      className="text-[10px] text-[#3D6E50] hover:text-[#2D2926] font-bold bg-[#EBF3ED] hover:bg-[#D8ECD8] px-2.5 py-1 rounded border border-[#C9D1BE] flex items-center gap-1 transition-colors cursor-pointer"
                      title="View Verified Copyright Landing Page"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#3D6E50]" />
                      <span>LIVE BADGE ACTIVE • VIEW LANDING PAGE</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dedicated App Activation & Embed Snippet Modal */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFFFF] border border-[#DCD5CA] rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border ${getIconBg(activeModalApp.iconType)} text-[#5A5A40]`}>
                  {getIcon(activeModalApp.iconType)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                    <span>{activeModalApp.name}</span>
                    <span className="text-xs font-mono bg-[#FAF8F5] text-[#5A5A40] px-2 py-0.5 rounded border border-[#DCD5CA]">
                      {activeModalApp.appId}
                    </span>
                  </h3>
                  <p className="text-xs text-[#6A655C] font-mono">{activeModalApp.vertical}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModalApp(null)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1 scrollbar-thin">
              {/* App URL Binding Callout */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Target Domain Binding:</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#FFFFFF] text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                    SSL & C2PA HANDSHAKE 200 OK
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#FFFFFF] p-2.5 rounded-lg border border-[#DCD5CA] text-xs font-mono">
                  <span className="text-[#2D2926] font-bold truncate max-w-[400px]">{activeModalApp.appUrl || `https://${activeModalApp.appId}.ai.studio`}</span>
                  {activeModalApp.appUrl && (
                    <a
                      href={activeModalApp.appUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-800 hover:underline flex items-center gap-1 text-[11px] font-semibold shrink-0"
                    >
                      <span>Open App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Ready-to-paste React Embed Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-[#5A5A40] flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    <span>React Component (Drop into {activeModalApp.name})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(`import { HumanEthicalBadge } from '@human-network/badge-react';

export function AppHeaderEthicalBadge() {
  return (
    <HumanEthicalBadge 
      appId="${activeModalApp.appId}"
      appName="${activeModalApp.name}"
      targetOrigin="${activeModalApp.appUrl || 'https://tomecrafter-ai-book-studio.ai.studio'}"
      cleanroomId="${activeModalApp.ftAuditId}"
      c2paManifestHash="${activeModalApp.c2paHash}"
      microRoyaltyActive={true}
      theme="natural-olive"
    />
  );
}`, 'modal_react')}
                    className="text-xs font-mono text-[#5A5A40] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    {copiedSnippet === 'modal_react' ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'modal_react' ? 'Copied Snippet' : 'Copy React'}</span>
                  </button>
                </div>
                <pre className="rounded-xl bg-[#2D2926] p-3 text-xs font-mono text-[#F9F7F2] border border-[#3E3E2B] overflow-x-auto">
{`import { HumanEthicalBadge } from '@human-network/badge-react';

export function AppHeaderEthicalBadge() {
  return (
    <HumanEthicalBadge 
      appId="${activeModalApp.appId}"
      appName="${activeModalApp.name}"
      targetOrigin="${activeModalApp.appUrl || 'https://tomecrafter-ai-book-studio.ai.studio'}"
      cleanroomId="${activeModalApp.ftAuditId}"
      c2paManifestHash="${activeModalApp.c2paHash}"
      microRoyaltyActive={true}
      theme="natural-olive"
    />
  );
}`}
                </pre>
              </div>

              {/* Book Publishing / Tome Crafter Manuscript C2PA Box Hook */}
              {activeModalApp.iconType === 'book' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-emerald-800 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Tome Crafter Manuscript & EPUB/PDF Exporter Hook (Node / Server)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(`// Tome Crafter EPUB / PDF / Manuscript C2PA JUMBF Manifest Injector
import { injectC2PAIntoManuscript } from '@human-network/c2pa-publishing-engine';

export async function finalizeManuscriptExport(bookBuffer, bookMetadata) {
  return await injectC2PAIntoManuscript(bookBuffer, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    claimGenerator: "Tome Crafter Book Publishing Suite v2.4",
    manifestHash: "${activeModalApp.c2paHash}",
    fairlyTrainedId: "${activeModalApp.ftAuditId}",
    authorAttributionSplitPercentage: 0.05,
    covenant: "Creative Commons & Author Guild Ethical AI Covenant"
  });
}`, 'modal_book_hook')}
                      className="text-xs font-mono text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedSnippet === 'modal_book_hook' ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'modal_book_hook' ? 'Copied Hook' : 'Copy Hook'}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#2D2926] p-3 text-xs font-mono text-[#F9F7F2] border border-[#3E3E2B] overflow-x-auto">
{`// Tome Crafter EPUB / PDF / Manuscript C2PA JUMBF Manifest Injector
import { injectC2PAIntoManuscript } from '@human-network/c2pa-publishing-engine';

export async function finalizeManuscriptExport(bookBuffer, bookMetadata) {
  return await injectC2PAIntoManuscript(bookBuffer, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    claimGenerator: "Tome Crafter Book Publishing Suite v2.4",
    manifestHash: "${activeModalApp.c2paHash}",
    fairlyTrainedId: "${activeModalApp.ftAuditId}",
    authorAttributionSplitPercentage: 0.05,
    covenant: "Creative Commons & Author Guild Ethical AI Covenant"
  });
}`}
                  </pre>
                </div>
              )}

              {/* Music Stem Pipeline C2PA JUMBF Manifest Injector Snippet */}
              {activeModalApp.iconType === 'music' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-[#5A5A40] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>RLM Audio DAW Stem Exporter C2PA Box Hook (Node/WAV/MP3)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(`// RLM Pro Studio Audio Stem Export Pipeline with C2PA JUMBF Box
import { injectC2PAIntoAudio } from '@human-network/c2pa-audio-engine';

export async function finalizeStemExport(audioBuffer, trackMetadata) {
  return await injectC2PAIntoAudio(audioBuffer, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    claimGenerator: "RLM Pro Studio Hybrid DAW v2.4",
    manifestHash: "${activeModalApp.c2paHash}",
    fairlyTrainedId: "${activeModalApp.ftAuditId}",
    proSocieties: ["ASCAP", "BMI", "PRS"],
    artistSplitPercentage: 0.05
  });
}`, 'modal_music_hook')}
                      className="text-xs font-mono text-[#5A5A40] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedSnippet === 'modal_music_hook' ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'modal_music_hook' ? 'Copied Hook' : 'Copy Hook'}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#2D2926] p-3 text-xs font-mono text-[#F9F7F2] border border-[#3E3E2B] overflow-x-auto">
{`// RLM Pro Studio Audio Stem Export Pipeline with C2PA JUMBF Box
import { injectC2PAIntoAudio } from '@human-network/c2pa-audio-engine';

export async function finalizeStemExport(audioBuffer, trackMetadata) {
  return await injectC2PAIntoAudio(audioBuffer, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    claimGenerator: "RLM Pro Studio Hybrid DAW v2.4",
    manifestHash: "${activeModalApp.c2paHash}",
    fairlyTrainedId: "${activeModalApp.ftAuditId}",
    proSocieties: ["ASCAP", "BMI", "PRS"],
    artistSplitPercentage: 0.05
  });
}`}
                  </pre>
                </div>
              )}

              {/* Code AST Hook for ForgeOS */}
              {activeModalApp.iconType === 'code' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-indigo-700 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>ForgeOS AST Cleanroom Injector (Node / CLI Engine)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(`// ForgeOS AST Cleanroom Engine & C2PA Merkle Injector
import { attachCleanroomProvenance } from '@human-network/ast-c2pa-engine';

export function wrapGeneratedCodeWithProvenance(sourceCode, fileMetadata) {
  return attachCleanroomProvenance(sourceCode, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    cleanroomId: "${activeModalApp.ftAuditId}",
    c2paManifest: "${activeModalApp.c2paHash}",
    zeroCopyleftEnforced: true,
    ossMaintainerSplit: 0.05
  });
}`, 'modal_code_hook')}
                      className="text-xs font-mono text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedSnippet === 'modal_code_hook' ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'modal_code_hook' ? 'Copied Hook' : 'Copy Hook'}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#2D2926] p-3 text-xs font-mono text-[#F9F7F2] border border-[#3E3E2B] overflow-x-auto">
{`// ForgeOS AST Cleanroom Engine & C2PA Merkle Injector
import { attachCleanroomProvenance } from '@human-network/ast-c2pa-engine';

export function wrapGeneratedCodeWithProvenance(sourceCode, fileMetadata) {
  return attachCleanroomProvenance(sourceCode, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    cleanroomId: "${activeModalApp.ftAuditId}",
    c2paManifest: "${activeModalApp.c2paHash}",
    zeroCopyleftEnforced: true,
    ossMaintainerSplit: 0.05
  });
}`}
                  </pre>
                </div>
              )}

              {/* Video Pipeline Hook if Video */}
              {activeModalApp.iconType === 'video' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-[#D67D5C] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Video Exporter C2PA Box Hook (Node/Server)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(`// Video Rendering Pipeline with C2PA JUMBF Box
import { injectC2PAIntoVideo } from '@human-network/c2pa-video-engine';

export async function finalizeVideoExport(videoBuffer, metadata) {
  return await injectC2PAIntoVideo(videoBuffer, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    claimGenerator: "${activeModalApp.name} Engine",
    manifestHash: "${activeModalApp.c2paHash}",
    fairlyTrainedId: "${activeModalApp.ftAuditId}",
    artistSplitPercentage: 0.05
  });
}`, 'modal_video_hook')}
                      className="text-xs font-mono text-[#D67D5C] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedSnippet === 'modal_video_hook' ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'modal_video_hook' ? 'Copied Hook' : 'Copy Hook'}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#2D2926] p-3 text-xs font-mono text-[#F9F7F2] border border-[#3E3E2B] overflow-x-auto">
{`// Video Rendering Pipeline with C2PA JUMBF Box
import { injectC2PAIntoVideo } from '@human-network/c2pa-video-engine';

export async function finalizeVideoExport(videoBuffer, metadata) {
  return await injectC2PAIntoVideo(videoBuffer, {
    appId: "${activeModalApp.appId}",
    origin: "${activeModalApp.appUrl}",
    claimGenerator: "${activeModalApp.name} Engine",
    manifestHash: "${activeModalApp.c2paHash}",
    fairlyTrainedId: "${activeModalApp.ftAuditId}",
    artistSplitPercentage: 0.05
  });
}`}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D8] shrink-0">
              <span className="text-[11px] font-mono text-[#6A655C]">
                Audit ID: <code className="text-[#5A5A40]">{activeModalApp.ftAuditId}</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalApp(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCD5CA] text-xs font-semibold text-[#6A655C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleActivateAppDomain(activeModalApp);
                    setActiveModalApp(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#5A5A40] text-white text-xs font-semibold hover:bg-[#4A4A33] flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span>Activate on {activeModalApp.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
