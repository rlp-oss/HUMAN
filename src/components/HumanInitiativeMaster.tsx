import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  Coins, 
  Landmark, 
  Users, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Zap, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Flame, 
  Compass, 
  Sprout, 
  Stethoscope, 
  BookOpen, 
  Music, 
  Code2, 
  Layers3, 
  Copy, 
  Check, 
  FileCode2, 
  Presentation, 
  Store, 
  QrCode,
  Globe,
  Share2,
  Lock
} from 'lucide-react';
import { 
  InitiativeUrgencyTier, 
  RoleWalletAccount, 
  InitiativeSlidingScaleState, 
  AppSignificanceEvaluation,
  RoleWalletType
} from '../types';
import { HumanInitiativeService } from '../services/humanInitiativeService';
import { HumanInitiativeLogo, MasterHumanBadgeIcon } from './HumanLogo';
import { useTheme } from '../context/ThemeContext';

interface HumanInitiativeMasterProps {
  onNavigateToMerchantPortal?: () => void;
  onNavigateToCreators?: () => void;
  onNavigateToDeveloperEmbed?: () => void;
  onNavigateToRoadmapSite?: () => void;
}

export const HumanInitiativeMaster: React.FC<HumanInitiativeMasterProps> = ({
  onNavigateToMerchantPortal,
  onNavigateToCreators,
  onNavigateToDeveloperEmbed,
  onNavigateToRoadmapSite
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark' || mode === 'oled';

  // State
  const [subscribers, setSubscribers] = useState<number>(15000);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number>(49.55);
  const [scaleState, setScaleState] = useState<InitiativeSlidingScaleState>(() => 
    HumanInitiativeService.getSlidingScaleState(15000, 49.55)
  );

  const [tiers, setTiers] = useState<InitiativeUrgencyTier[]>(() => 
    HumanInitiativeService.getUrgencyTiers()
  );
  const [selectedTierKey, setSelectedTierKey] = useState<string>('tier1_survival');
  const [roleWallets, setRoleWallets] = useState<RoleWalletAccount[]>(() => 
    HumanInitiativeService.getRoleWallets()
  );
  const [appGrades, setAppGrades] = useState<AppSignificanceEvaluation[]>(() => 
    HumanInitiativeService.getAppSignificanceGrades()
  );
  const [activeTab, setActiveTab] = useState<'architecture' | 'engine' | 'wallets' | 'pitch' | 'sdk'>('architecture');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // New Wallet Form State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletRole, setNewWalletRole] = useState<RoleWalletAccount['holderRole']>('Heavy Labor / Trade');
  const [newWalletMultiplier, setNewWalletMultiplier] = useState<number>(3.5);

  const loadData = () => {
    setTiers(HumanInitiativeService.getUrgencyTiers());
    setRoleWallets(HumanInitiativeService.getRoleWallets());
    setAppGrades(HumanInitiativeService.getAppSignificanceGrades());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const calculated = HumanInitiativeService.getSlidingScaleState(subscribers, subscriptionPrice);
    setScaleState(calculated);
  }, [subscribers, subscriptionPrice]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName) return;

    HumanInitiativeService.createRoleWallet({
      holderName: newWalletName,
      holderRole: newWalletRole,
      laborDifficultyMultiplier: newWalletMultiplier
    });

    setRoleWallets(HumanInitiativeService.getRoleWallets());
    setIsWalletModalOpen(false);
    setNewWalletName('');
  };

  const selectedTier = tiers.find(t => t.key === selectedTierKey) || tiers[0];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. MASTER HEADER & PHILOSOPHICAL MANIFESTO */}
      {/* ========================================================================= */}
      <div className={`rounded-3xl border-2 p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all ${
        isDark 
          ? 'border-[#1E3A33] bg-gradient-to-br from-[#0B1311] via-[#101E1A] to-[#08100E] text-[#F0FDF4]'
          : 'border-[#5A5A40]/30 bg-gradient-to-br from-[#FAF8F5] via-[#FFFFFF] to-[#F2ECE4] text-[#2D2926]'
      }`}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#34D399]/5 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 space-y-6 max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-xs ${
              isDark 
                ? 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                : 'bg-[#5A5A40] text-white'
            }`}>
              <MasterHumanBadgeIcon className="w-4 h-4 text-[#34D399]" />
              <span>THE HUMAN INITIATIVE MASTER ECOSYSTEM</span>
            </div>

            <div className={`text-right text-[11px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>
              <span className={`font-bold ${isDark ? 'text-[#34D399]' : 'text-[#2D2926]'}`}>Architect:</span> Cody Germain (C.W. Germain / Captain Billy Buster / Wade Cody) • Red Deer, AB
            </div>
          </div>

          <div className="space-y-3">
            {/* Glowing Green Cyber Title as requested by user in walkthrough */}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight bg-gradient-to-r from-white via-[#A7F3D0] to-[#34D399] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(52,211,153,0.45)]">
              The Heartbeat of Global Equity, Merit, & Human Thriving
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-[#A7F3D0]/90 font-medium' : 'text-[#6A655C]'}`}>
              Replacing the scarcity operating system with guaranteed baseline stability funded by automated SaaS subscriptions. By removing survival mode as a weapon against human beings, we transform civilization from defensive panic into creative exploration, heavy craft mastery, and planetary restoration.
            </p>
          </div>

          {/* 4 Core Pillars of Transformation - Harmonized Emerald/Mint Scheme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className={`rounded-2xl border p-4 space-y-2 shadow-xs transition-all ${
              isDark 
                ? 'border-[#1E3A33] bg-[#101B18] hover:border-[#10B981]/50 shadow-[0_0_15px_rgba(6,78,59,0.15)]' 
                : 'border-[#E5E0D8] bg-white'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#34D399]">
                <Sparkles className="w-4 h-4 text-[#34D399]" />
                <span>From Fear to Curiosity</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                When food, medicine, and housing transitions are pre-funded, human psychology shifts naturally to scientific discovery, artistic expression, and technical mastery.
              </p>
            </div>

            <div className={`rounded-2xl border p-4 space-y-2 shadow-xs transition-all ${
              isDark 
                ? 'border-[#1E3A33] bg-[#101B18] hover:border-[#10B981]/50 shadow-[0_0_15px_rgba(6,78,59,0.15)]' 
                : 'border-[#E5E0D8] bg-white'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#67E8F9]">
                <Sparkles className="w-4 h-4 text-[#67E8F9]" />
                <span>The Chance to Be Useful</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                Every individual is given the economic baseline to discover their unique skills and step up to become deeply valued, useful contributors in their communities.
              </p>
            </div>

            <div className={`rounded-2xl border p-4 space-y-2 shadow-xs transition-all ${
              isDark 
                ? 'border-[#1E3A33] bg-[#101B18] hover:border-[#10B981]/50 shadow-[0_0_15px_rgba(6,78,59,0.15)]' 
                : 'border-[#E5E0D8] bg-white'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#10B981]">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span>Merit-Driven Abundance</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                Survival and health are guaranteed, but human effort, physical labor mastery, and intellectual innovation unlock true abundance and prosperity.
              </p>
            </div>

            <div className={`rounded-2xl border p-4 space-y-2 shadow-xs transition-all ${
              isDark 
                ? 'border-[#1E3A33] bg-[#101B18] hover:border-[#10B981]/50 shadow-[0_0_15px_rgba(6,78,59,0.15)]' 
                : 'border-[#E5E0D8] bg-white'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#A7F3D0]">
                <ShieldCheck className="w-4 h-4 text-[#A7F3D0]" />
                <span>Collapse of Desperation Crime</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                Pre-funding basic needs causes survival-driven crimes to drop precipitously, freeing judicial resources to focus on modern tech fraud and white-collar exploitation.
              </p>
            </div>
          </div>

          {/* Quick Sub-Navigation Buttons */}
          <div className={`pt-2 flex flex-wrap items-center gap-2 border-t ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'architecture'
                  ? isDark ? 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-[#5A5A40] text-white shadow-2xs'
                  : isDark ? 'bg-[#101B18] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33]' : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architectural Map & Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('engine')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'engine'
                  ? isDark ? 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-[#5A5A40] text-white shadow-2xs'
                  : isDark ? 'bg-[#101B18] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33]' : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive Sliding Scale Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('wallets')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'wallets'
                  ? isDark ? 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-[#5A5A40] text-white shadow-2xs'
                  : isDark ? 'bg-[#101B18] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33]' : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Role Wallets & Labor Multipliers</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pitch'
                  ? isDark ? 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-[#5A5A40] text-white shadow-2xs'
                  : isDark ? 'bg-[#101B18] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33]' : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>District Ventures Pitch Dossier</span>
            </button>

            <button
              onClick={() => setActiveTab('sdk')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sdk'
                  ? isDark ? 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-[#5A5A40] text-white shadow-2xs'
                  : isDark ? 'bg-[#101B18] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33]' : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Python & Node SDK</span>
            </button>

            {onNavigateToRoadmapSite && (
              <button
                onClick={onNavigateToRoadmapSite}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 border border-indigo-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-300" />
                <span>Civilizational Roadmap Reference Site</span>
              </button>
            )}

            {onNavigateToMerchantPortal && (
              <button
                onClick={onNavigateToMerchantPortal}
                className="ml-auto px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-[#34D399] hover:text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Merchant & Clinic POS Scanner</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTENT: ARCHITECTURE & DATA FLOW */}
      {/* ========================================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Architectural Flow Diagram Box */}
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xs ${
            isDark ? 'border-[#1E3A33] bg-[#101B18] text-[#F0FDF4]' : 'border-[#E5E0D8] bg-[#FFFFFF] text-[#2D2926]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
              <div>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                  <Layers3 className={`w-5 h-5 ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`} />
                  <span>The Architectural Map (Data & Cash-Flow Pipeline)</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                  End-to-end routing from the 4-app SaaS fleet through the Founder Operational Floor to the 5 Urgency Tiers.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                isDark 
                  ? 'bg-[#064E3B] text-[#34D399] border-[#10B981]/50' 
                  : 'bg-[#FAF0EC] text-[#D67D5C] border-[#EECDBC]'
              }`}>
                Zero-Extraction Flow
              </span>
            </div>

            {/* Visual Step-by-Step Pipeline */}
            <div className="space-y-4">
              
              {/* Step 1: Subscriber Inflow */}
              <div className={`p-4 rounded-2xl border-2 space-y-2 ${
                isDark 
                  ? 'border-[#1E3A33] bg-[#0B1311]' 
                  : 'border-[#5A5A40]/30 bg-[#FAF8F5]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>
                    Step 1 • Fleet Inflow (Stripe Connect Gateway)
                  </span>
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                    4 Fleet Applications Active
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33] text-[#F0FDF4]' : 'bg-white border-[#E5E0D8] text-[#2D2926]'}`}>
                    <span className="font-bold block">Tome Crafter</span>
                    <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>Literature & Philosophy</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33] text-[#F0FDF4]' : 'bg-white border-[#E5E0D8] text-[#2D2926]'}`}>
                    <span className="font-bold block">RLM Pro Studio</span>
                    <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>Sonic & Timbre</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33] text-[#F0FDF4]' : 'bg-white border-[#E5E0D8] text-[#2D2926]'}`}>
                    <span className="font-bold block">ForgeOS Builder</span>
                    <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>Cleanroom Code Kernels</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33] text-[#F0FDF4]' : 'bg-white border-[#E5E0D8] text-[#2D2926]'}`}>
                    <span className="font-bold block">RL Easy Flow</span>
                    <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>Vector Geometry</span>
                  </div>
                </div>
              </div>

              {/* Down Arrow */}
              <div className={`flex justify-center ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Step 2: Founder Operational Floor */}
              <div className={`p-4 rounded-2xl border-2 space-y-2 ${
                isDark 
                  ? 'border-[#064E3B] bg-[#071310]' 
                  : 'border-[#D67D5C]/40 bg-[#FAF0EC]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#34D399]' : 'text-[#D67D5C]'}`}>
                    Layer 1 • Founder Operational Floor (Secured Off-The-Top)
                  </span>
                  <span className={`font-mono text-xs font-bold ${isDark ? 'text-[#A7F3D0]' : 'text-[#D67D5C]'}`}>
                    Fixed Baseline: $12,500 / Month
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                  Guarantees absolute operator independence, unshakeable development velocity, server infrastructure, legal compliance, and zero burnout for the architect before community splits are executed.
                </p>
              </div>

              {/* Down Arrow */}
              <div className={`flex justify-center ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Step 3: Dynamic Urgency Pool */}
              <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                isDark 
                  ? 'border-[#1E3A33] bg-[#0B1311]' 
                  : 'border-[#3D6E50]/40 bg-[#FAF8F5]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#34D399]' : 'text-[#3D6E50]'}`}>
                    Layer 2 • Dynamic Urgency & Impact Pool (50% to 95% Community Split)
                  </span>
                  <span className={`font-mono text-xs font-bold ${isDark ? 'text-[#34D399]' : 'text-[#3D6E50]'}`}>
                    Current Pool: {scaleState.communityAllocationPct}% of Gross
                  </span>
                </div>

                {/* 5 Tiers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
                  {tiers.map((t) => (
                    <div
                      key={t.key}
                      onClick={() => setSelectedTierKey(t.key)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                        selectedTierKey === t.key
                          ? isDark 
                            ? 'border-[#34D399] bg-[#142320] shadow-[0_0_12px_rgba(52,211,153,0.2)]' 
                            : 'border-[#2D2926] bg-white shadow-xs'
                          : isDark
                            ? 'border-[#1E3A33] bg-[#101B18] hover:border-[#10B981]/50'
                            : 'border-[#E5E0D8] bg-white/70 hover:border-[#DCD5CA]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span style={{ color: t.colorCode }}>Tier {t.tierNumber}</span>
                        <span className={`font-mono text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>{t.allocationPct}%</span>
                      </div>
                      <h4 className={`font-bold text-xs mt-1 line-clamp-1 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>{t.subtitle}</h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Down Arrow */}
              <div className={`flex justify-center ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Step 4: Merit & Contribution Engine */}
              <div className={`p-4 rounded-2xl border-2 space-y-2 ${
                isDark 
                  ? 'border-[#1E3A33] bg-[#0B1311]' 
                  : 'border-[#4A6B82]/40 bg-[#F4F7F9]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#67E8F9]' : 'text-[#4A6B82]'}`}>
                    Layer 3 • The Merit & Contribution Engine
                  </span>
                  <span className={`font-mono text-xs font-bold ${isDark ? 'text-[#67E8F9]' : 'text-[#4A6B82]'}`}>
                    5 Cryptographic Tokens ($FOOD, $MED, $EARTH, $INFR, $CREW)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33]' : 'bg-white border-[#E5E0D8]'}`}>
                    <strong className={`block ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>Labor Difficulty Multiplier</strong>
                    <span className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>Heavy/Hazardous physical work earns highest pay (up to 3.5x).</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33]' : 'bg-white border-[#E5E0D8]'}`}>
                    <strong className={`block ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>App Significance Grading</strong>
                    <span className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>Solving human needs (hunger, medicine, soil) gets maximum weight.</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33]' : 'bg-white border-[#E5E0D8]'}`}>
                    <strong className={`block ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>Direct Merchant POS Rails</strong>
                    <span className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>Instant QR redemption at grocers and clinics via Stripe Connect.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Selected Urgency Tier Deep-Dive */}
          {selectedTier && (
            <div className={`rounded-3xl border p-6 sm:p-8 space-y-5 shadow-xs ${
              isDark ? 'border-[#1E3A33] bg-[#101B18]' : 'border-[#E5E0D8] bg-[#FFFFFF]'
            }`}>
              <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
                <div>
                  <span className={`text-xs font-mono font-bold uppercase ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>
                    Active Tier Inspector • {selectedTier.allocationPct ?? 0}% Allocation
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                    {selectedTier.title}
                  </h3>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                  isDark 
                    ? 'bg-[#0B1311] border-[#1E3A33] text-[#34D399]' 
                    : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#2D2926]'
                }`}>
                  Allocated at Current Volume: ${((scaleState.totalCommunityPoolUsd * (selectedTier.allocationPct ?? 0)) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} / mo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTier.programs?.map((p, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'border-[#1E3A33] bg-[#0B1311]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>{p.name}</h4>
                      <span className="text-xs font-mono text-[#34D399] font-bold">
                        ${p.currentFundingUsd.toLocaleString()} Live
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                      {p.description}
                    </p>
                    <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
                      <span className={isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}>Beneficiaries: <strong className={isDark ? 'text-white' : 'text-[#2D2926]'}>{p.beneficiariesCount.toLocaleString()}</strong></span>
                      <span className={`font-bold font-mono ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>{p.metrics}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: SLIDING SCALE MATHEMATICAL SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'engine' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xs ${
            isDark ? 'border-[#1E3A33] bg-[#101B18]' : 'border-[#E5E0D8] bg-[#FFFFFF]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
              <div>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                  <Activity className={`w-5 h-5 ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`} />
                  <span>The Live Sliding Scale & Heartbeat Calculation Engine</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                  Adjust active subscriber volume to simulate real-time capital flow from 50% up to 95% community allocation.
                </p>
              </div>
              <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                isDark 
                  ? 'bg-[#064E3B] text-[#34D399] border-[#10B981]/50' 
                  : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#5A5A40]'
              }`}>
                engine.py Live Simulator
              </span>
            </div>

            {/* Sliders Control Box */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl border ${
              isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
            }`}>
              
              {/* Subscribers Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                    Active Fleet Subscribers
                  </label>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                    isDark ? 'bg-[#142320] text-[#34D399] border-[#1E3A33]' : 'bg-white text-[#5A5A40] border-[#E5E0D8]'
                  }`}>
                    {subscribers.toLocaleString()} Accounts
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={500000}
                  step={500}
                  value={subscribers}
                  onChange={(e) => setSubscribers(Number(e.target.value))}
                  className="w-full accent-[#10B981]"
                />
                <div className={`flex justify-between text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>
                  <span>500 Subs (50% Comm)</span>
                  <span>50k Subs (80% Comm)</span>
                  <span>500k Subs (95% Comm)</span>
                </div>
              </div>

              {/* Subscription Price Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                    Average Monthly Subscription Price
                  </label>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                    isDark ? 'bg-[#142320] text-[#34D399] border-[#1E3A33]' : 'bg-white text-[#D67D5C] border-[#E5E0D8]'
                  }`}>
                    ${subscriptionPrice.toFixed(2)} USD / month
                  </span>
                </div>
                <input
                  type="range"
                  min={19}
                  max={99}
                  step={1}
                  value={subscriptionPrice}
                  onChange={(e) => setSubscriptionPrice(Number(e.target.value))}
                  className="w-full accent-[#34D399]"
                />
                <div className={`flex justify-between text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>
                  <span>$19 / mo (Basic)</span>
                  <span>$39 / mo (Pro Suite)</span>
                  <span>$99 / mo (Enterprise)</span>
                </div>
              </div>

            </div>

            {/* Real-time Math Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'border-[#1E3A33] bg-[#0B1311]' : 'border-[#E5E0D8] bg-white'
              }`}>
                <span className={`text-[11px] block ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>Gross Monthly Inflow (MRR)</span>
                <span className={`text-xl font-bold font-mono block ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                  ${scaleState.grossMonthlyInflowUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>Across 4 Fleet SaaS Tools</span>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'border-[#064E3B] bg-[#071310]' : 'border-[#D67D5C]/30 bg-[#FAF0EC]'
              }`}>
                <span className={`text-[11px] font-bold block ${isDark ? 'text-[#34D399]' : 'text-[#D67D5C]'}`}>Founder Operational Floor</span>
                <span className={`text-xl font-bold font-mono block ${isDark ? 'text-[#A7F3D0]' : 'text-[#D67D5C]'}`}>
                  ${scaleState.founderOperationalFloorUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>Secured 100% Off-The-Top</span>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'border-[#1E3A33] bg-[#142320]' : 'border-[#3D6E50]/30 bg-[#FAF8F5]'
              }`}>
                <span className={`text-[11px] font-bold block ${isDark ? 'text-[#34D399]' : 'text-[#3D6E50]'}`}>Community Allocation Rate</span>
                <span className={`text-xl font-bold font-mono block ${isDark ? 'text-[#34D399]' : 'text-[#3D6E50]'}`}>
                  {scaleState.communityAllocationPct}%
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>Dynamic Sliding Scale Yield</span>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'border-[#1E3A33] bg-[#101E1A]' : 'border-[#5A5A40]/30 bg-[#F2ECE4]'
              }`}>
                <span className={`text-[11px] font-bold block ${isDark ? 'text-[#67E8F9]' : 'text-[#5A5A40]'}`}>Total Monthly Community Pool</span>
                <span className={`text-xl font-bold font-mono block ${isDark ? 'text-[#67E8F9]' : 'text-[#5A5A40]'}`}>
                  ${scaleState.totalCommunityPoolUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>Disbursed to 5 Urgency Tiers</span>
              </div>

            </div>

            {/* Detailed 5 Tiers Breakdown Table */}
            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b font-mono font-bold ${
                  isDark ? 'bg-[#0B1311] border-[#1E3A33] text-[#34D399]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#5A5A40]'
                }`}>
                  <tr>
                    <th className="p-3.5">Urgency Tier</th>
                    <th className="p-3.5">Core Objective</th>
                    <th className="p-3.5">Split %</th>
                    <th className="p-3.5 text-right">Monthly Funding</th>
                    <th className="p-3.5 text-right">Annual Impact Run-Rate</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-[#1E3A33] bg-[#101B18]' : 'divide-[#E5E0D8] bg-white'}`}>
                  <tr>
                    <td className="p-3.5 font-bold text-[#34D399]">Tier 1: Survival & Health</td>
                    <td className={`p-3.5 ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>World Food Security & Global Medical Emergency Fund ($FOOD, $MED)</td>
                    <td className="p-3.5 font-mono">35%</td>
                    <td className={`p-3.5 font-mono font-bold text-right ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                      ${scaleState.tierAllocations.tier1_survival_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 font-mono text-right text-[#34D399]">
                      ${(scaleState.tierAllocations.tier1_survival_usd * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-bold text-[#67E8F9]">Tier 2: AI-Displacement Restitution</td>
                    <td className={`p-3.5 ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>Restitution Pool & Displaced Labor Registry ($750/mo Baseline Bridges)</td>
                    <td className="p-3.5 font-mono">25%</td>
                    <td className={`p-3.5 font-mono font-bold text-right ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                      ${scaleState.tierAllocations.tier2_transition_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 font-mono text-right text-[#34D399]">
                      ${(scaleState.tierAllocations.tier2_transition_usd * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-bold text-[#10B981]">Tier 3: Planetary Regeneration</td>
                    <td className={`p-3.5 ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>Soil & Land Recovery, Regenerative Ag & Green Microgrids ($EARTH, $INFR)</td>
                    <td className="p-3.5 font-mono">20%</td>
                    <td className={`p-3.5 font-mono font-bold text-right ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                      ${scaleState.tierAllocations.tier3_planetary_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 font-mono text-right text-[#34D399]">
                      ${(scaleState.tierAllocations.tier3_planetary_usd * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-bold text-[#A7F3D0]">Tier 4: Open-Source R&D</td>
                    <td className={`p-3.5 ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>Cleanroom Zero-Dependency Software, C2PA Provenance & Developer Grants</td>
                    <td className="p-3.5 font-mono">10%</td>
                    <td className={`p-3.5 font-mono font-bold text-right ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                      ${scaleState.tierAllocations.tier4_rnd_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 font-mono text-right text-[#34D399]">
                      ${(scaleState.tierAllocations.tier4_rnd_usd * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-bold text-[#F472B6]">Tier 5: Social Work Subsidies</td>
                    <td className={`p-3.5 ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>Caregiver Wage Assistance, Youth Mentorship & Crisis De-escalation ($CREW)</td>
                    <td className="p-3.5 font-mono">10%</td>
                    <td className={`p-3.5 font-mono font-bold text-right ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                      ${scaleState.tierAllocations.tier5_social_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 font-mono text-right text-[#34D399]">
                      ${(scaleState.tierAllocations.tier5_social_usd * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: ROLE WALLETS & MERIT MULTIPLIERS */}
      {/* ========================================================================= */}
      {activeTab === 'wallets' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Header & Create Wallet Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                <Coins className={`w-5 h-5 ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`} />
                <span>Role-Based Wallets & Labor Difficulty Multipliers</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                Multi-token cryptographic balances ($FOOD, $MED, $EARTH, $INFR, $CREW) weighted by physical effort and craft difficulty.
              </p>
            </div>

            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-[#34D399]" />
              <span>Issue New Role Wallet</span>
            </button>
          </div>

          {/* Wallets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roleWallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`rounded-2xl border p-5 space-y-4 shadow-xs transition-all ${
                  isDark 
                    ? 'border-[#1E3A33] bg-[#101B18] hover:border-[#10B981]/50' 
                    : 'border-[#E5E0D8] bg-[#FFFFFF] hover:border-[#DCD5CA]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>{wallet.holderName}</h4>
                    <span className={`text-[11px] font-mono block mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>
                      {wallet.holderRole}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                    isDark 
                      ? 'bg-[#064E3B] text-[#34D399] border-[#10B981]/40' 
                      : 'bg-[#FAF0EC] text-[#D67D5C] border-[#EECDBC]'
                  }`}>
                    {wallet.laborDifficultyMultiplier}x Multiplier
                  </span>
                </div>

                {/* Token Balances Matrix */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#E5E0D8]'}`}>
                    <span className={`text-[10px] block ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>$FOOD</span>
                    <strong className="text-[#34D399] font-mono">{wallet.balances.FOOD}</strong>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#E5E0D8]'}`}>
                    <span className={`text-[10px] block ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>$MED</span>
                    <strong className="text-[#67E8F9] font-mono">{wallet.balances.MED}</strong>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#E5E0D8]'}`}>
                    <span className={`text-[10px] block ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>$EARTH</span>
                    <strong className="text-[#10B981] font-mono">{wallet.balances.EARTH}</strong>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#E5E0D8]'}`}>
                    <span className={`text-[10px] block ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>$INFR</span>
                    <strong className="text-[#A7F3D0] font-mono">{wallet.balances.INFR}</strong>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#E5E0D8]'}`}>
                    <span className={`text-[10px] block ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>$CREW</span>
                    <strong className="text-[#F472B6] font-mono">{wallet.balances.CREW}</strong>
                  </div>
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#142320] border-[#1E3A33]' : 'bg-[#F2ECE4] border-[#E5E0D8]'}`}>
                    <span className={`text-[10px] block font-bold ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>Total USD</span>
                    <strong className={`font-mono ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>${wallet.totalUsdEquivalent.toFixed(2)}</strong>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                  isDark ? 'border-[#1E3A33] text-[#94A3B8]' : 'border-[#E5E0D8] text-[#8C857B]'
                }`}>
                  <span>{wallet.walletAddress.substring(0, 18)}...</span>
                  <span className="text-[#34D399] font-bold">Redeemable at POS</span>
                </div>
              </div>
            ))}
          </div>

          {/* App Significance Grading Matrix */}
          <div className={`rounded-3xl border p-6 space-y-4 shadow-xs ${
            isDark ? 'border-[#1E3A33] bg-[#101B18]' : 'border-[#E5E0D8] bg-[#FFFFFF]'
          }`}>
            <h4 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
              <Scale className={`w-4 h-4 ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`} />
              <span>App Significance & Problem-Solving Grading Matrix</span>
            </h4>
            <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
              Software applications that solve acute human and planetary problems (hunger, medicine, clean soil, caregiving) receive the highest significance grades and grant eligibility weights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {appGrades.map((g, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'border-[#1E3A33] bg-[#0B1311]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>{g.appName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#064E3B] text-[#34D399] border border-[#10B981]/40 font-mono text-xs font-bold">
                      Grade: {g.significanceGrade} ({g.problemSolvingWeight}/100)
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                    <strong className={isDark ? 'text-[#34D399]' : 'text-[#2D2926]'}>Problem Solved:</strong> {g.realWorldProblemSolved}
                  </p>
                  <div className={`text-[11px] font-mono ${isDark ? 'text-[#A7F3D0]' : 'text-[#5A5A40]'}`}>
                    {g.laborDifficultyBonus} • Grant Eligibility: {(g.grantEligibilityBps / 100).toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: DISTRICT VENTURES PITCH DOSSIER (ARLENE DICKINSON READY) */}
      {/* ========================================================================= */}
      {activeTab === 'pitch' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className={`rounded-3xl border-2 p-6 sm:p-10 space-y-6 shadow-2xl ${
            isDark 
              ? 'border-[#1E3A33] bg-[#101B18] text-[#F0FDF4]' 
              : 'border-[#5A5A40]/40 bg-gradient-to-br from-[#FAF8F5] via-[#FFFFFF] to-[#F2ECE4] text-[#2D2926]'
          }`}>
            <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
              <div>
                <span className={`text-xs font-mono font-bold uppercase ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`}>
                  Institutional Pitch Dossier • District Ventures Capital Readiness
                </span>
                <h3 className={`text-2xl font-serif font-bold mt-0.5 ${isDark ? 'text-white drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'text-[#2D2926]'}`}>
                  The Human Initiative Presentation Package
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/50 font-mono text-xs font-bold">
                Calgary & Canadian VC Ready
              </span>
            </div>

            <div className={`space-y-4 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
              <p>
                <strong className={isDark ? 'text-white' : 'text-[#2D2926]'}>The Core Investment Hypothesis:</strong> Global tech investment pours billions into energy-draining, extractive AI models while agriculture, healthcare, and labor strain under economic panic. The Human Initiative monetizes high-utility SaaS tools (Tome Crafter, RLM Pro, ForgeOS, RL Easy Flow) while programmatically recycling capital back into human survival, medical stability, and open-source tools.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-white border-[#E5E0D8]'}`}>
                  <h4 className={`font-bold text-xs uppercase font-mono ${isDark ? 'text-[#34D399]' : 'text-[#2D2926]'}`}>1. Unit Economics & Floor</h4>
                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                    The Founder Operational Floor ($12,500/mo) is locked off the top. As subscriber volume scales from 10k to 250k+, the platform share compresses to a lean 5% heartbeat, routing 95% of incoming volume to global urgency pools.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-white border-[#E5E0D8]'}`}>
                  <h4 className={`font-bold text-xs uppercase font-mono ${isDark ? 'text-[#67E8F9]' : 'text-[#2D2926]'}`}>2. Desperation-Crime Reduction</h4>
                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                    By pre-funding basic survival (food, medical co-pays, and $750/mo displacement bridges), communities experience measurable declines in survival-driven property crime, unlocking immense municipal and legal savings.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-white border-[#E5E0D8]'}`}>
                  <h4 className={`font-bold text-xs uppercase font-mono ${isDark ? 'text-[#10B981]' : 'text-[#2D2926]'}`}>3. Physical Merchant Utility</h4>
                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                    Closed-loop cryptographic tokens ($FOOD, $MED) are spent at local grocers and pharmacies via simple POS QR scanners, triggering instantaneous Stripe Connect reimbursements with zero middleman friction.
                  </p>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-2 ${
                isDark ? 'border-[#1E3A33] bg-[#0B1311]' : 'border-[#3D6E50]/40 bg-[#FAF8F5]'
              }`}>
                <h4 className="font-bold text-sm text-[#34D399]">The Power of the 1% Micro-Contribution Model</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#CBD5E1]' : 'text-[#6A655C]'}`}>
                  Capturing microscopic transaction fractions from large-scale digital volume generates multi-million-dollar liquidity pools that self-fund global food distribution, emergency healthcare, and land restoration without bureaucratic drag or charity dependency.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: DEVELOPER SDK & PYTHON CODE PLAYGROUND */}
      {/* ========================================================================= */}
      {activeTab === 'sdk' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-5 shadow-xs ${
            isDark ? 'border-[#1E3A33] bg-[#101B18]' : 'border-[#E5E0D8] bg-[#FFFFFF]'
          }`}>
            <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
              <div>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                  <FileCode2 className={`w-5 h-5 ${isDark ? 'text-[#34D399]' : 'text-[#5A5A40]'}`} />
                  <span>Phase 1 & Phase 2 Code SDK: Python & TypeScript Primitives</span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                  Clean, open-source wrapper libraries that developers can plug into any SaaS application to integrate automated sliding-scale heartbeat contributions.
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(HumanInitiativeService.getPythonCode())}
                className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                {copiedCode ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4 text-white" />}
                <span>{copiedCode ? 'Copied to Clipboard' : 'Copy engine.py Code'}</span>
              </button>
            </div>

            {/* Code Display */}
            <div className="rounded-2xl border border-[#1E3A33] bg-[#070D0B] text-[#34D399] p-5 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
              <pre>{HumanInitiativeService.getPythonCode()}</pre>
            </div>

            {/* Developer Embed Kit Banner */}
            {onNavigateToDeveloperEmbed && (
              <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#5A5A40]/30'
              }`}>
                <div className="space-y-1 text-left">
                  <h4 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                    <MasterHumanBadgeIcon className="w-4 h-4 text-[#34D399]" />
                    <span>Self-Serve Developer Embed & Webhook Kit</span>
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#6A655C]'}`}>
                    Generate drop-in React badges, vanilla web components, and automated Stripe Connect split webhooks for any project.
                  </p>
                </div>
                <button
                  onClick={onNavigateToDeveloperEmbed}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-[#34D399]" />
                  <span>Launch Embed & Onboard Wizard</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL: Issue New Role Wallet */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 ${
            isDark ? 'border-[#1E3A33] bg-[#101B18] text-[#F0FDF4]' : 'border-[#E5E0D8] bg-[#FFFFFF] text-[#2D2926]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#1E3A33]' : 'border-[#E5E0D8]'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>Issue New Role Wallet</h3>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className={`text-xs font-mono cursor-pointer ${isDark ? 'text-[#94A3B8] hover:text-white' : 'text-[#8C857B] hover:text-[#2D2926]'}`}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateWallet} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                  Beneficiary / Holder Name
                </label>
                <input
                  type="text"
                  required
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="e.g. Liam MacDonald (Timber Craftsman)"
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-hidden ${
                    isDark 
                      ? 'border-[#1E3A33] bg-[#0B1311] text-[#F0FDF4] focus:border-[#10B981]' 
                      : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#2D2926] focus:border-[#5A5A40]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                  Human Role Category
                </label>
                <select
                  value={newWalletRole}
                  onChange={(e) => {
                    const role = e.target.value as any;
                    setNewWalletRole(role);
                    if (role.includes('Heavy')) setNewWalletMultiplier(3.5);
                    else if (role.includes('Medical')) setNewWalletMultiplier(2.8);
                    else if (role.includes('Social')) setNewWalletMultiplier(2.5);
                    else if (role.includes('Artisan')) setNewWalletMultiplier(2.0);
                    else setNewWalletMultiplier(1.5);
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-hidden ${
                    isDark 
                      ? 'border-[#1E3A33] bg-[#0B1311] text-[#F0FDF4] focus:border-[#10B981]' 
                      : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#2D2926] focus:border-[#5A5A40]'
                  }`}
                >
                  <option value="Heavy Labor / Trade">Heavy Labor / Trade (Max 3.5x Multiplier)</option>
                  <option value="Medical / Healthcare Worker">Medical / Healthcare Worker (2.8x Multiplier)</option>
                  <option value="Social Worker / Co-op">Social Worker / Co-op (2.5x Multiplier)</option>
                  <option value="Artisan / Creator">Artisan / Creator (2.0x Multiplier)</option>
                  <option value="Displaced Labor / Transition">Displaced Labor / Transition (1.5x Multiplier)</option>
                </select>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-2 ${
                isDark ? 'bg-[#0B1311] border-[#1E3A33]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>Labor Multiplier</span>
                  <span className="font-mono font-bold text-[#34D399]">{newWalletMultiplier}x</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={3.5}
                  step={0.1}
                  value={newWalletMultiplier}
                  onChange={(e) => setNewWalletMultiplier(Number(e.target.value))}
                  className="w-full accent-[#10B981]"
                />
                <p className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#8C857B]'}`}>
                  Initial distribution will seed $FOOD, $MED, $EARTH, $INFR, and $CREW tokens scaled by {newWalletMultiplier}x.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isDark ? 'text-[#94A3B8] hover:bg-[#142320]' : 'text-[#6A655C] hover:bg-[#F2ECE4]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create & Seed Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
