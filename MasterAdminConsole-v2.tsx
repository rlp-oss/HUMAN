import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Layers, Play, Pause, RefreshCw, CheckCircle, XCircle, AlertTriangle, Key, DollarSign, Globe, Code, Cpu } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS (Grounded in HumanProtocolSpecification)
// ============================================================================

interface AppRegistryEntry {
  appId: string;
  appName: string;
  developer: string;
  status: 'PENDING_AUDIT' | 'ACTIVE' | 'BLOCKED' | 'WARNING';
  registeredAt: string;
  userCount: number;
  currentOverheadFee: number; // e.g., 0.50 down to 0.05
  metrics: {
    cpu: number;
    memory: number;
    errorRate: number;
    latency: number;
    c2paRate: number;
    volumeUSD: number;
  };
  config: {
    packageDependencies: string[];
    stripeSplit: { platform: number; poolA: number; poolB: number; poolC: number };
    c2paVersion: string;
    vouchScoreThreshold: number;
    geohashPrecision: number;
  };
}

export default function MasterAdminConsole() {
  // ============================================================================
  // SYSTEM STATE
  // ============================================================================
  const [globalFreeze, setGlobalFreeze] = useState(false);
  const [securityLock, setSecurityLock] = useState(true);
  const [adminPassphrase, setAdminPassphrase] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppRegistryEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'auditor' | 'treasury'>('overview');
  
  // Financial Pools Tracking (Dynamic values updating based on simulated volume)
  const [totalEcosystemVolume, setTotalEcosystemVolume] = useState(128450.00);
  const [poolA_Creators, setPoolA_Creators] = useState(44957.50); // 70% of 50% split
  const [poolB_Legacy, setPoolB_Legacy] = useState(9633.75);     // 15% of 50% split
  const [poolC_Society, setPoolC_Society] = useState(9633.75);   // 15% of 50% split
  const [platformFeesCollected, setPlatformFeesCollected] = useState(64225.00); // Platform 50% share

  // Registry Database (Native + Third-Party SDK Integrations)
  const [apps, setApps] = useState<AppRegistryEntry[]>([
    {
      appId: 'tomecrafter',
      appName: 'Tome Crafter AI Book Studio',
      developer: 'The H.U.M.A.N. Initiative (Native)',
      status: 'ACTIVE',
      registeredAt: '2026-08-15T10:00:00Z',
      userCount: 14200,
      currentOverheadFee: 0.40625, // Milestone 2 compressed overhead
      metrics: { cpu: 22, memory: 145, errorRate: 0.1, latency: 54, c2paRate: 100, volumeUSD: 45200 },
      config: {
        packageDependencies: ['react', 'lucide-react', 'typescript'],
        stripeSplit: { platform: 0.50, poolA: 0.70, poolB: 0.15, poolC: 0.15 },
        c2paVersion: 'v2.1',
        vouchScoreThreshold: 0.85,
        geohashPrecision: 5
      }
    },
    {
      appId: 'rlm-pro-studio',
      appName: 'RLM Pro Studio DAW',
      developer: 'The H.U.M.A.N. Initiative (Native)',
      status: 'ACTIVE',
      registeredAt: '2026-08-16T12:00:00Z',
      userCount: 8900,
      currentOverheadFee: 0.50, // Standard 50% overhead split
      metrics: { cpu: 41, memory: 242, errorRate: 0.4, latency: 72, c2paRate: 99.8, volumeUSD: 31250 },
      config: {
        packageDependencies: ['react', 'typescript', 'wav-decoder'],
        stripeSplit: { platform: 0.50, poolA: 0.70, poolB: 0.15, poolC: 0.15 },
        c2paVersion: 'v2.1',
        vouchScoreThreshold: 0.85,
        geohashPrecision: 5
      }
    },
    {
      appId: 'forgeos',
      appName: 'ForgeOS Compiler Sandbox',
      developer: 'The H.U.M.A.N. Initiative (Native)',
      status: 'ACTIVE',
      registeredAt: '2026-08-14T08:30:00Z',
      userCount: 5200,
      currentOverheadFee: 0.50,
      metrics: { cpu: 18, memory: 92, errorRate: 0.0, latency: 12, c2paRate: 100, volumeUSD: 12400 },
      config: {
        packageDependencies: ['typescript', 'acorn-ast-parser'],
        stripeSplit: { platform: 0.50, poolA: 0.70, poolB: 0.15, poolC: 0.15 },
        c2paVersion: 'v2.1',
        vouchScoreThreshold: 0.85,
        geohashPrecision: 5
      }
    },
    {
      appId: 'rl-easy-flow',
      appName: 'RL Easy Flow Video Studio',
      developer: 'The H.U.M.A.N. Initiative (Native)',
      status: 'ACTIVE',
      registeredAt: '2026-08-17T15:45:00Z',
      userCount: 11050,
      currentOverheadFee: 0.40625,
      metrics: { cpu: 65, memory: 1840, errorRate: 0.8, latency: 280, c2paRate: 99.2, volumeUSD: 32600 },
      config: {
        packageDependencies: ['react', 'lucide-react', 'ffmpeg.js'],
        stripeSplit: { platform: 0.50, poolA: 0.70, poolB: 0.15, poolC: 0.15 },
        c2paVersion: 'v2.1',
        vouchScoreThreshold: 0.85,
        geohashPrecision: 5
      }
    },
    {
      appId: 'ecoplanter-mesh',
      appName: 'EcoPlanter Crop Coordinator',
      developer: 'Prairie Agriculture Circle (SDK)',
      status: 'PENDING_AUDIT',
      registeredAt: '2026-08-23T14:10:00Z',
      userCount: 0,
      currentOverheadFee: 0.50,
      metrics: { cpu: 0, memory: 0, errorRate: 0.0, latency: 0, c2paRate: 0, volumeUSD: 0 },
      config: {
        packageDependencies: ['react', 'leaflet-maps', 'openai'], // Crucial:openai is in banned list!
        stripeSplit: { platform: 0.50, poolA: 0.70, poolB: 0.15, poolC: 0.15 },
        c2paVersion: 'v2.1',
        vouchScoreThreshold: 0.85,
        geohashPrecision: 5
      }
    },
    {
      appId: 'healthshare-v2',
      appName: 'Aescu Diagnostics Node',
      developer: 'Sovereign Health Commons (SDK)',
      status: 'PENDING_AUDIT',
      registeredAt: '2026-08-23T15:30:00Z',
      userCount: 0,
      currentOverheadFee: 0.50,
      metrics: { cpu: 0, memory: 0, errorRate: 0.0, latency: 0, c2paRate: 0, volumeUSD: 0 },
      config: {
        packageDependencies: ['react', 'picosanity', 'scikit-learn'], // scikit-learn is fine unless executing extraction pipelines
        stripeSplit: { platform: 0.50, poolA: 0.70, poolB: 0.15, poolC: 0.15 },
        c2paVersion: 'v2.1',
        vouchScoreThreshold: 0.85,
        geohashPrecision: 5
      }
    }
  ]);

  // Telemetry Heartbeat Simulation
  useEffect(() => {
    if (globalFreeze) return;
    const interval = setInterval(() => {
      // Simulate passive transaction streaming
      const incrementalVolume = parseFloat((Math.random() * 25 + 5).toFixed(2));
      setTotalEcosystemVolume(prev => prev + incrementalVolume);
      
      const creatorAllocation = incrementalVolume * 0.50 * 0.70;
      const legacyAllocation = incrementalVolume * 0.50 * 0.15;
      const societyAllocation = incrementalVolume * 0.50 * 0.15;
      const platformOverhead = incrementalVolume * 0.50;

      setPoolA_Creators(prev => prev + creatorAllocation);
      setPoolB_Legacy(prev => prev + legacyAllocation);
      setPoolC_Society(prev => prev + societyAllocation);
      setPlatformFeesCollected(prev => prev + platformOverhead);

      // Fluctuating active metrics for live apps
      setApps(prevApps => 
        prevApps.map(app => {
          if (app.status !== 'ACTIVE') return app;
          return {
            ...app,
            metrics: {
              ...app.metrics,
              cpu: Math.max(10, Math.min(95, app.metrics.cpu + Math.floor(Math.random() * 9 - 4))),
              memory: app.appId === 'rl-easy-flow' 
                ? Math.max(1000, Math.min(3000, app.metrics.memory + Math.floor(Math.random() * 100 - 50)))
                : Math.max(50, Math.min(300, app.metrics.memory + Math.floor(Math.random() * 10 - 5))),
              latency: Math.max(5, Math.min(450, app.metrics.latency + Math.floor(Math.random() * 11 - 5))),
              errorRate: Math.max(0, parseFloat((app.metrics.errorRate + (Math.random() * 0.2 - 0.1)).toFixed(2)))
            }
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [globalFreeze]);

  // ============================================================================
  // EXECUTIVE BUSINESS LOGIC ACTIONS
  // ============================================================================
  
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassphrase === 'COVENANT-KEY-2026') {
      setSecurityLock(false);
      setAuthError('');
    } else {
      setAuthError('INVALID CREDENTIALS: Sign-off verification signature rejected.');
    }
  };

  const toggleEmergencyFreeze = () => {
    if (securityLock) return;
    setGlobalFreeze(!globalFreeze);
    console.warn(`[MASTER CONTROL] Global compliance emergency freeze toggled: ${!globalFreeze}`);
  };

  const runDynamicOverheadCompression = (appId: string) => {
    setApps(prev => prev.map(app => {
      if (app.appId !== appId) return app;
      
      // Enforce the progressive sliding scale from Chapter 5 of manual
      let targetOverhead = 0.50;
      if (app.userCount >= 250000) targetOverhead = 0.05;
      else if (app.userCount >= 100000) targetOverhead = 0.20;
      else if (app.userCount >= 50000) targetOverhead = 0.25;
      else if (app.userCount >= 25000) targetOverhead = 0.40625;
      else if (app.userCount >= 10000) targetOverhead = 0.50; // Retains 50% under 10k baseline split

      return {
        ...app,
        currentOverheadFee: targetOverhead
      };
    }));
  };

  const handleApproveApp = (appId: string) => {
    setApps(prev => prev.map(app => {
      if (app.appId !== appId) return app;
      return { ...app, status: 'ACTIVE' };
    }));
    setSelectedApp(null);
  };

  const handleRejectApp = (appId: string) => {
    setApps(prev => prev.map(app => {
      if (app.appId !== appId) return app;
      return { ...app, status: 'BLOCKED' };
    }));
    setSelectedApp(null);
  };

  // ============================================================================
  // THE COMPLIANCE AUDITOR SCANNER ENGINE
  // ============================================================================
  const executeAuditScan = (app: AppRegistryEntry) => {
    const bannedLibs = ['openai', 'anthropic', 'cohere', 'langchain-core', 'google-generativeai'];
    const foundBanned = app.config.packageDependencies.filter(dep => bannedLibs.includes(dep));
    
    const zeroIngestionPassed = foundBanned.length === 0;
    const covenantSplitPassed = 
      app.config.stripeSplit.platform === 0.50 &&
      app.config.stripeSplit.poolA === 0.70 &&
      app.config.stripeSplit.poolB === 0.15 &&
      app.config.stripeSplit.poolC === 0.15;
    const c2paPassed = app.config.c2paVersion === 'v2.1';
    const pohSybilPassed = app.config.vouchScoreThreshold >= 0.85 && app.config.geohashPrecision === 5;

    return {
      zeroIngestionPassed,
      foundBanned,
      covenantSplitPassed,
      c2paPassed,
      pohSybilPassed,
      overallCompliance: zeroIngestionPassed && covenantSplitPassed && c2paPassed && pohSybilPassed
    };
  };

  // ============================================================================
  // SECURITY SIGN-IN SCREEN (FOUNDER SHIELD)
  // ============================================================================
  if (securityLock) {
    return (
      <div className="min-h-screen bg-[#070A11] text-[#F8FAFC] flex items-center justify-center p-6 font-mono selection:bg-emerald-950 selection:text-emerald-300">
        <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-lg p-8 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <div className="p-3 bg-emerald-950/40 rounded-full border border-emerald-500/30 text-emerald-400">
              <Shield className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-emerald-300">MASTER EXECUTIVE</h1>
              <p className="text-xs text-[#94A3B8] uppercase tracking-widest">H.U.M.A.N. Protocol Core Console</p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] tracking-wider mb-2">Cryptographic Key Sign-off</label>
              <input
                type="password"
                placeholder="Enter Administrator Verification Signature"
                value={adminPassphrase}
                onChange={(e) => setAdminPassphrase(e.target.value)}
                className="w-full bg-[#070A11] border border-[#1E293B] focus:border-emerald-500 rounded px-4 py-3 text-sm focus:outline-none text-emerald-300 text-center tracking-widest font-bold"
              />
            </div>
            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded text-red-400 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded text-sm transition-all shadow-lg hover:shadow-emerald-500/10 uppercase tracking-widest border border-emerald-600"
            >
              Verify Sovereignty
            </button>
            <p className="text-[10px] text-[#94A3B8] text-center uppercase tracking-widest mt-4">
              Hint: use 'COVENANT-KEY-2026' for audit simulation access
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-[#F8FAFC] font-mono p-6 selection:bg-emerald-950 selection:text-emerald-300">
      {/* HEADER COMMAND */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1E293B] pb-6 mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 className="text-lg font-bold tracking-wider text-emerald-300">H.U.M.A.N. MASTER CONSOLE v3.1</h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 uppercase tracking-widest">
            COORDINATOR ACCESS: CODY GERMAIN (FOUNDER)
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* EMERGENCY SYSTEM KILLSWITCH */}
          <button
            onClick={toggleEmergencyFreeze}
            className={`flex items-center space-x-2 px-4 py-2 border rounded text-xs font-bold transition-all tracking-wider uppercase ${
              globalFreeze
                ? 'bg-red-950/60 border-red-500 text-red-400 shadow-lg shadow-red-950/50'
                : 'bg-[#0F172A] hover:bg-slate-800 border-[#1E293B] hover:border-red-500/50 text-[#F8FAFC] hover:text-red-400'
            }`}
          >
            {globalFreeze ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{globalFreeze ? 'Resume Protocol Flows' : 'EMERGENCY PROTOCOL FREEZE'}</span>
          </button>

          <button
            onClick={() => { setSecurityLock(true); setAdminPassphrase(''); }}
            className="p-2 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] rounded text-[#94A3B8] hover:text-emerald-400"
            title="Lock Console"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* METRIC OVERVIEW DECK */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#0F172A]/50 border border-[#1E293B] rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-slate-700"><Globe className="w-8 h-8" /></div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Total Transactional Inflow</p>
          <p className="text-lg font-bold text-[#F8FAFC] mt-2">${totalEcosystemVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
            <span>↑ Live Streaming via Stripe Connect</span>
          </div>
        </div>

        <div className="bg-[#0F172A]/50 border border-[#1E293B] rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-slate-700"><Users className="w-8 h-8" /></div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Pool A: Creator Royalties</p>
          <p className="text-lg font-bold text-emerald-400 mt-2">${poolA_Creators.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">70% of 50% split - Fee-free payout</p>
        </div>

        <div className="bg-[#0F172A]/50 border border-[#1E293B] rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-slate-700"><Layers className="w-8 h-8" /></div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Pool B: Legacy Escrow</p>
          <p className="text-lg font-bold text-yellow-500 mt-2">${poolB_Legacy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">15% Non-forfeiting holding pool</p>
        </div>

        <div className="bg-[#0F172A]/50 border border-[#1E293B] rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-slate-700"><Activity className="w-8 h-8" /></div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Pool C: Living Floors</p>
          <p className="text-lg font-bold text-cyan-400 mt-2">${poolC_Society.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">15% ($FOOD, $MED, $EARTH)</p>
        </div>

        <div className="bg-[#0F172A]/50 border border-[#1E293B] rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-slate-700"><DollarSign className="w-8 h-8" /></div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Platform Fees Retained</p>
          <p className="text-lg font-bold text-indigo-400 mt-2">${platformFeesCollected.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">Capped at operational ceilings</p>
        </div>
      </section>

      {/* EMERGENCY BULLETINS */}
      {globalFreeze && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-lg mb-6 flex items-center space-x-3 text-xs animate-pulse">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="font-bold uppercase">SYSTEM HALT: ACTIVE IMMUNIZATION MODE</h4>
            <p className="mt-1">All transactional ledger balances, SDK royalty streams, and API gateway routes have been cryptographically locked. No user pools are depleting.</p>
          </div>
        </div>
      )}

      {/* CORE INTERACTION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABULAR SELECTOR & APPLICATION LIST */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F172A]/40 border border-[#1E293B] rounded-lg p-4">
            <div className="flex border-b border-[#1E293B] pb-3 mb-4 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-xs uppercase font-bold tracking-wider rounded ${
                  activeTab === 'overview' ? 'bg-emerald-600/50 text-emerald-300' : 'text-[#94A3B8] hover:text-slate-200'
                }`}
              >
                Ecosystem Hubs
              </button>
              <button
                onClick={() => setActiveTab('apps')}
                className={`px-4 py-2 text-xs uppercase font-bold tracking-wider rounded ${
                  activeTab === 'apps' ? 'bg-emerald-600/50 text-emerald-300' : 'text-[#94A3B8] hover:text-slate-200'
                }`}
              >
                Ecosystem Apps ({apps.length})
              </button>
              <button
                onClick={() => setActiveTab('auditor')}
                className={`px-4 py-2 text-xs uppercase font-bold tracking-wider rounded ${
                  activeTab === 'auditor' ? 'bg-emerald-600/50 text-emerald-300' : 'text-[#94A3B8] hover:text-slate-200'
                }`}
              >
                Protocol Auditor (Gate)
              </button>
            </div>

            {/* TAB CONTENT: HUB OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="p-4 bg-[#070A11] border border-[#1E293B] rounded-lg">
                  <h3 className="text-sm font-bold text-emerald-300 mb-2 uppercase">Decentralized Web-of-Trust Social Graph</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Unlike traditional biometric systems that capture permanent biological markers, the H.U.M.A.N. Protocol's proof of personhood maps <strong>physical proximity trust and human network graph relationships</strong> using geohashed spatial circles.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <div className="p-3 bg-[#0F172A]/60 rounded text-center border border-[#1E293B]">
                      <p className="text-[10px] text-[#94A3B8] uppercase">Geohash Bounding</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">5 Chars (~2.5km)</p>
                    </div>
                    <div className="p-3 bg-[#0F172A]/60 rounded text-center border border-[#1E293B]">
                      <p className="text-[10px] text-[#94A3B8] uppercase">Min Peer Vouch</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">0.85 Minimum</p>
                    </div>
                    <div className="p-3 bg-[#0F172A]/60 rounded text-center border border-[#1E293B]">
                      <p className="text-[10px] text-[#94A3B8] uppercase">Audit Sortition</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">Every 30 Days</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#070A11] border border-[#1E293B] rounded-lg">
                  <h3 className="text-sm font-bold text-cyan-400 mb-2 uppercase">Prairie Biosphere Pilot Analytics (Red Deer)</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                    Monitoring real-world economic deflation indicators of local community development hubs operating on the protocol.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#0F172A]/40 rounded border border-[#1E293B]">
                      <p className="text-[10px] text-[#94A3B8] uppercase">Shelter Deflation</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1">-82.4%</p>
                    </div>
                    <div className="p-3 bg-[#0F172A]/40 rounded border border-[#1E293B]">
                      <p className="text-[10px] text-[#94A3B8] uppercase">Clinics Online</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">4 Active</p>
                    </div>
                    <div className="p-3 bg-[#0F172A]/40 rounded border border-[#1E293B]">
                      <p className="text-[10px] text-[#94A3B8] uppercase">Survival Crime</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1">-91.4%</p>
                    </div>
                    <div className="p-3 bg-[#0F172A]/40 rounded border border-[#1E293B]">
                      <p className="text-[10px] text-[#94A3B8] uppercase">Active Farmers</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">214 Co-ops</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: APP LIST */}
            {activeTab === 'apps' && (
              <div className="space-y-3">
                {apps.map(app => (
                  <div
                    key={app.appId}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      selectedApp?.appId === app.appId
                        ? 'bg-emerald-950/20 border-emerald-500/80 shadow'
                        : 'bg-[#070A11] hover:bg-[#0F172A]/70 border-[#1E293B] hover:border-[#1E293B]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`h-2 w-2 rounded-full ${
                          app.status === 'ACTIVE' ? 'bg-emerald-400' :
                          app.status === 'PENDING_AUDIT' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                        }`}></span>
                        <h4 className="text-sm font-bold text-slate-200">{app.appName}</h4>
                        <span className="text-[9px] bg-[#0F172A] text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#1E293B] uppercase tracking-widest">{app.appId}</span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">{app.developer}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:text-right">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-[#94A3B8] uppercase">Subscribers</p>
                        <p className="text-xs font-bold text-[#F8FAFC]">{app.userCount.toLocaleString()}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-[#94A3B8] uppercase">SDK Fee Level</p>
                        <p className="text-xs font-bold text-emerald-400">{(app.currentOverheadFee * 100).toFixed(2)}%</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-[#94A3B8] uppercase">Stripe Volume</p>
                        <p className="text-xs font-bold text-emerald-400">${app.metrics.volumeUSD.toLocaleString()}</p>
                      </div>
                      {app.status === 'ACTIVE' && app.userCount >= 10000 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            runDynamicOverheadCompression(app.appId);
                          }}
                          className="px-2.5 py-1 bg-[#0F172A] hover:bg-emerald-950/40 border border-[#1E293B] hover:border-emerald-500/50 rounded text-[10px] font-bold text-emerald-300 uppercase tracking-wider"
                          title="Verify user counts & trigger scaling sliding-scale fee compression"
                        >
                          Decompress Fee
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: PROTOCOL AUDITOR SCANS */}
            {activeTab === 'auditor' && (
              <div className="space-y-4">
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  These third-party platforms have integrated the H.U.M.A.N. SDK and are awaiting a cryptographically signed <strong>Ethical AI Badge</strong>. If any compliance audit criteria fail, their SDK transaction ledger pipelines are suspended.
                </p>
                
                {apps.filter(a => a.status === 'PENDING_AUDIT').length === 0 ? (
                  <div className="p-8 text-center bg-[#070A11] border border-[#1E293B] rounded-lg text-[#94A3B8] text-xs">
                    No applications currently awaiting compliance checks. All nodes verified.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apps.filter(a => a.status === 'PENDING_AUDIT').map(app => {
                      const audit = executeAuditScan(app);
                      return (
                        <div key={app.appId} className="p-4 bg-[#070A11] border border-[#1E293B] rounded-lg space-y-4">
                          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                            <div>
                              <h4 className="text-sm font-bold text-slate-200">{app.appName}</h4>
                              <p className="text-[10px] text-[#94A3B8] uppercase">Request Signature: {app.appId}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                              audit.overallCompliance ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                            }`}>
                              {audit.overallCompliance ? 'Audit Passed' : 'Audit Failed'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-[#0F172A]/30 rounded border border-[#1E293B]/40 flex items-center justify-between">
                              <span className="text-[#94A3B8]">1. Zero-Ingestion Protection:</span>
                              <span className={`font-bold ${audit.zeroIngestionPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {audit.zeroIngestionPassed ? 'PASSED (0 leaks)' : 'FAILED'}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0F172A]/30 rounded border border-[#1E293B]/40 flex items-center justify-between">
                              <span className="text-[#94A3B8]">2. Covenant Stripe Split (50%):</span>
                              <span className={`font-bold ${audit.covenantSplitPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {audit.covenantSplitPassed ? 'PASSED (Verified)' : 'FAILED'}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0F172A]/30 rounded border border-[#1E293B]/40 flex items-center justify-between">
                              <span className="text-[#94A3B8]">3. C2PA JUMBF Manifests:</span>
                              <span className={`font-bold ${audit.c2paPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {audit.c2paPassed ? 'PASSED (v2.1)' : 'FAILED'}
                              </span>
                            </div>
                            <div className="p-3 bg-[#0F172A]/30 rounded border border-[#1E293B]/40 flex items-center justify-between">
                              <span className="text-[#94A3B8]">4. Sybil-Proof Proof-of-Humanity:</span>
                              <span className={`font-bold ${audit.pohSybilPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {audit.pohSybilPassed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                          </div>

                          {/* FLAG COMPLIANCE ISSUES */}
                          {!audit.zeroIngestionPassed && (
                            <div className="p-3 bg-red-950/20 border border-red-900/40 rounded text-xs text-red-300">
                              <span className="font-bold">CRITICAL DEVIATION DETECTED:</span> Banned scraper or extractive LLM model libraries found inside target app bundle dependencies: <strong>[{audit.foundBanned.join(', ')}]</strong>. 
                              Egress must be strictly isolated to prevent user content theft.
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveApp(app.appId)}
                              disabled={!audit.overallCompliance}
                              className={`flex-1 font-bold py-2 px-4 rounded text-xs uppercase tracking-wider transition-all ${
                                audit.overallCompliance 
                                  ? 'bg-emerald-900 hover:bg-emerald-800 text-white' 
                                  : 'bg-[#0F172A] text-[#64748B] border border-[#1E293B] cursor-not-allowed'
                              }`}
                            >
                              Approve App & Issue Badge
                            </button>
                            <button
                              onClick={() => handleRejectApp(app.appId)}
                              className="bg-red-950/50 hover:bg-red-900 text-red-400 font-bold py-2 px-4 rounded text-xs uppercase tracking-wider transition-all border border-red-900"
                            >
                              Reject & Block SDK
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DETAILED APPS INSPECTOR BOARD */}
        <div className="space-y-6">
          <div className="bg-[#0F172A]/40 border border-[#1E293B] rounded-lg p-4 h-full flex flex-col justify-between">
            {selectedApp ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">{selectedApp.appName}</h3>
                    <p className="text-[10px] text-[#94A3B8] uppercase">Inspect: {selectedApp.appId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    Clear
                  </button>
                </div>

                {/* APP CONFIG TELEMETRY */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-emerald-300 uppercase tracking-widest mb-2 flex items-center space-x-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Live App Performance Telemetry</span>
                    </h4>
                    <div className="p-3 bg-[#070A11] rounded border border-slate-950 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">CPU Workload:</span>
                        <span className={`font-bold ${selectedApp.metrics.cpu > 80 ? 'text-yellow-500' : 'text-slate-200'}`}>{selectedApp.metrics.cpu}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Heap Memory:</span>
                        <span className="text-slate-200 font-bold">{selectedApp.metrics.memory} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Request Latency:</span>
                        <span className="text-slate-200 font-bold">{selectedApp.metrics.latency} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">C2PA Signature Rate:</span>
                        <span className="text-emerald-400 font-bold">{selectedApp.metrics.c2paRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Exceptions/Errors:</span>
                        <span className={`font-bold ${selectedApp.metrics.errorRate > 1 ? 'text-red-400' : 'text-emerald-400'}`}>{selectedApp.metrics.errorRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs text-emerald-300 uppercase tracking-widest mb-2 flex items-center space-x-1">
                      <Code className="w-3.5 h-3.5" />
                      <span>SDK Deployment Configurations</span>
                    </h4>
                    <div className="p-3 bg-[#070A11] rounded border border-slate-950 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">C2PA Signature Version:</span>
                        <span className="text-slate-200 font-bold">{selectedApp.config.c2paVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Vouch Score Threshold:</span>
                        <span className="text-slate-200 font-bold">{selectedApp.config.vouchScoreThreshold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Geohash Length Limit:</span>
                        <span className="text-slate-200 font-bold">{selectedApp.config.geohashPrecision} characters</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs text-[#94A3B8] uppercase tracking-widest mb-1">Package Dependencies</h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedApp.config.packageDependencies.map(dep => (
                        <span 
                          key={dep} 
                          className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                            ['openai', 'anthropic'].includes(dep)
                              ? 'bg-red-950 border-red-500 text-red-400 font-bold'
                              : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8]'
                          }`}
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E293B]/40 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${selectedApp.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-yellow-500 animate-pulse'}`}></span>
                    <span className="text-[#94A3B8]">App Status: </span>
                    <strong className="text-[#F8FAFC] uppercase tracking-wider">{selectedApp.status}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#94A3B8]">
                <Shield className="w-10 h-10 text-slate-800 mb-3" />
                <p className="text-xs uppercase tracking-wider">Select an application from the grid to inspect details and compile verification telemetry.</p>
              </div>
            )}

            {/* PROTOCOL HEARTBEAT SIGNALS */}
            <div className="border-t border-[#1E293B] pt-4 mt-6">
              <div className="flex items-center justify-between text-[10px] text-[#94A3B8] uppercase tracking-wider mb-2">
                <span>Ecosystem Heartbeat</span>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="flex gap-1 h-3">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded ${
                      globalFreeze ? 'bg-red-900/60 animate-pulse' : 'bg-emerald-600 animate-pulse'
                    }`}
                    style={{ animationDelay: `${i * 150}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
