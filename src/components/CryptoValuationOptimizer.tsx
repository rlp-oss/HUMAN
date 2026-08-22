import React, { useState } from 'react';
import {
  Coins,
  FileText,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  Layers,
  ArrowRight,
  Download,
  Copy,
  Check,
  CheckCircle2,
  DollarSign,
  PieChart,
  Award,
  Sparkles,
  Sliders,
  Scale
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { HumanLogo } from './HumanLogo';

interface TokenMetric {
  symbol: string;
  name: string;
  role: string;
  totalSupply: string;
  circulatingPct: number;
  utility: string;
  valuationStrategy: string;
}

const PROJECT_TOKENS: TokenMetric[] = [
  {
    symbol: '$HUMAN',
    name: 'Human Covenant Governance & Ecosystem Token',
    role: 'Planetary Governance & Ecosystem Anchor',
    totalSupply: '1,000,000,000 HUMAN',
    circulatingPct: 20,
    utility: 'Voting on 50% fund allocations, staking for developer SDK API priority, and community grant proposals.',
    valuationStrategy: 'Deflationary buy-and-burn mechanism funded by 5% of all commercial app gross profits.'
  },
  {
    symbol: '$RESTITUTE',
    name: 'Restitution & Micro-Dividend Yield Token',
    role: 'Creator Payout & Escrow Liquid Unit',
    totalSupply: 'Dynamic (Collateralized 1:1 by Stripe Escrow Reserves)',
    circulatingPct: 65,
    utility: 'Instant settlement unit for micro-royalties (<$0.01) to eliminate credit card processing minimums.',
    valuationStrategy: '100% backed by real fiat revenue streams deposited in audited Stripe Treasury accounts.'
  },
  {
    symbol: '$CREATOR-NFT',
    name: 'C2PA Proof-of-Human-Attribution (PoHA) Pass',
    role: 'Cryptographic Provenance Token',
    totalSupply: 'Open Mint per Human Registration',
    circulatingPct: 100,
    utility: 'Zero-knowledge proof proving human authorship without exposing personal identity or raw biometric data.',
    valuationStrategy: 'Required license key for AI companies seeking certified ethical model training datasets.'
  }
];

export const CryptoValuationOptimizer: React.FC = () => {
  const { mode } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<'tokens' | 'whitepaper' | 'valuation' | 'compliance'>('tokens');
  const [projectedMrrUsd, setProjectedMrrUsd] = useState<number>(250000);
  const [valuationMultiplier, setValuationMultiplier] = useState<number>(15);
  const [copiedWhitepaper, setCopiedWhitepaper] = useState(false);

  // Valuation Math
  const annualizedRevenue = projectedMrrUsd * 12;
  const fiftyPercentSocietyFundAnnual = annualizedRevenue * 0.50;
  const projectedEcosystemValuation = annualizedRevenue * valuationMultiplier;
  const projectedTokenFdvUsd = projectedEcosystemValuation * 1.8;

  const handleDownloadWhitepaper = () => {
    const whitepaperText = `# The H.U.M.A.N. Initiative: Decentralized Ethical AI & Restitution Network
## Institutional Whitepaper & Economic Architecture Specification (v2.4)

### 1. Abstract
The H.U.M.A.N. Initiative introduces an immutable 50/50 gross revenue distribution covenant between commercial AI applications and human creators. Operating via cryptographic C2PA provenance manifests and Layer-2 settlement rails, the network turns technological automation into a self-sustaining universal restitution fund.

### 2. Tokenomics Matrix
- **$HUMAN (Governance & Trust Token)**: 1,000,000,000 Total Supply. Deflationary buyback from commercial SaaS licensing.
- **$RESTITUTE (Escrow Yield Token)**: Collateralized by Stripe fiat reserves for gasless instant payouts.
- **$CREATOR-NFT (PoHA Standard)**: Non-fungible attribution proof preventing uncompensated AI training.

### 3. Institutional Valuation & Revenue Mechanics
- Gross Annual Revenue Benchmark: $${annualizedRevenue.toLocaleString()} USD
- 50% Society Restitution Annual Allocation: $${fiftyPercentSocietyFundAnnual.toLocaleString()} USD
- Projected Token FDV: $${projectedTokenFdvUsd.toLocaleString()} USD

### 4. Regulatory Insulation & Howey Test Mitigation
All token utilities are structured through a Swiss Verein / Non-Profit Foundation Trust model with decentralized programmatic governance.
`;

    const blob = new Blob([whitepaperText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HUMAN_INITIATIVE_CRYPTO_WHITEPAPER_v2.4.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCopiedWhitepaper(true);
    setTimeout(() => setCopiedWhitepaper(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#090D16] p-6 sm:p-8 text-white border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <Coins className="w-3 h-3" /> Blockchain & Tokenomics Strategy
              </span>
              <span className="text-xs font-mono text-cyan-200/80">Institutional Valuation Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Crypto, Whitepaper & Valuation Optimization Console
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Expert strategies and mathematical frameworks for optimizing Layer-1/Layer-2 blockchain architecture, drafting institutional whitepapers, hardening token utility, and preparing ecosystem valuation for Series A & Sovereign Wealth Funds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadWhitepaper}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {copiedWhitepaper ? 'Whitepaper Downloaded!' : 'Export Institutional Whitepaper (.md)'}
            </button>
          </div>
        </div>

        {/* Quick Valuation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-cyan-500/20 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-bold text-lg">${projectedEcosystemValuation.toLocaleString()}</div>
            <div className="text-slate-400 text-[11px]">Ecosystem Implied Valuation</div>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-bold text-lg">${projectedTokenFdvUsd.toLocaleString()}</div>
            <div className="text-slate-400 text-[11px]">Projected Token FDV (Fully Diluted)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-bold text-lg">3 Interlocking Tokens</div>
            <div className="text-slate-400 text-[11px]">$HUMAN, $RESTITUTE, $CREATOR</div>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-cyan-500/20">
            <div className="text-cyan-400 font-bold text-lg">100% Non-Profit Foundation</div>
            <div className="text-slate-400 text-[11px]">Swiss Verein Governance Trust</div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#E5E0D8] dark:border-[#1E3A33] pb-2">
        <button
          onClick={() => setActiveSubTab('tokens')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'tokens'
              ? 'bg-[#0F172A] text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Tokenomics Architecture ($HUMAN Ecosystem)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('valuation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'valuation'
              ? 'bg-[#0F172A] text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Interactive Valuation Model</span>
        </button>

        <button
          onClick={() => setActiveSubTab('whitepaper')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'whitepaper'
              ? 'bg-[#0F172A] text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Whitepaper Blueprint & Structure</span>
        </button>

        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'compliance'
              ? 'bg-[#0F172A] text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>SEC Howey Test & Legal Insulation</span>
        </button>
      </div>

      {/* Tab 1: Tokenomics Architecture */}
      {activeSubTab === 'tokens' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROJECT_TOKENS.map(token => (
              <div
                key={token.symbol}
                className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold font-mono text-[#059669] dark:text-cyan-400">
                      {token.symbol}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/30">
                      {token.role}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#2D2926] dark:text-[#F3F1EC]">
                    {token.name}
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33]">
                      <div className="text-[10px] font-mono text-[#8C857B] uppercase font-bold">Total Supply / Cap</div>
                      <div className="font-mono font-bold text-[#2D2926] dark:text-[#F0FDF4] mt-0.5">{token.totalSupply}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-[#8C857B] uppercase font-bold">Core Utility</div>
                      <p className="text-[#6A655C] dark:text-[#94A3B8] leading-relaxed mt-0.5">{token.utility}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E0D8] dark:border-[#1E3A33] text-xs">
                  <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Valuation Strategy
                  </div>
                  <p className="text-[#5A5A40] dark:text-[#CBD5E1] mt-0.5 leading-relaxed">
                    {token.valuationStrategy}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Token Distribution Model */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#2D2926] dark:text-[#F3F1EC] font-mono flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-500" />
              <span>Token Distribution & Vesting Schedule (1,000,000,000 $HUMAN)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30">
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">50% (500M)</div>
                <div className="font-bold text-[#2D2926] dark:text-[#F0FDF4] mt-1">Creator Restitution & Society Escrow</div>
                <div className="text-[10px] text-[#6A655C] dark:text-[#94A3B8] mt-0.5">Vested continuously per verified work.</div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-500/30">
                <div className="text-cyan-600 dark:text-cyan-400 font-extrabold text-lg">20% (200M)</div>
                <div className="font-bold text-[#2D2926] dark:text-[#F0FDF4] mt-1">Community DAO & Open Grants</div>
                <div className="text-[10px] text-[#6A655C] dark:text-[#94A3B8] mt-0.5">5-year linear governance unlock.</div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-500/30">
                <div className="text-purple-600 dark:text-purple-400 font-extrabold text-lg">15% (150M)</div>
                <div className="font-bold text-[#2D2926] dark:text-[#F0FDF4] mt-1">Core Contributors & Engineering</div>
                <div className="text-[10px] text-[#6A655C] dark:text-[#94A3B8] mt-0.5">4-year vesting with 1-year cliff.</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30">
                <div className="text-amber-600 dark:text-amber-400 font-extrabold text-lg">15% (150M)</div>
                <div className="font-bold text-[#2D2926] dark:text-[#F0FDF4] mt-1">Planetary Peace Dividend Reserve</div>
                <div className="text-[10px] text-[#6A655C] dark:text-[#94A3B8] mt-0.5">Locked for Phase 5–7 global deploy.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Valuation Model */}
      {activeSubTab === 'valuation' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#2D2926] dark:text-[#F3F1EC] font-mono flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
                <span>Interactive Institutional Valuation Simulator</span>
              </h2>
              <p className="text-xs text-[#6A655C] dark:text-[#94A3B8] mt-1">
                Adjust commercial app fleet Monthly Recurring Revenue (MRR) and valuation multiple to model enterprise valuation and token FDV.
              </p>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33]">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-[#2D2926] dark:text-[#F0FDF4]">Fleet Monthly Recurring Revenue (MRR)</span>
                  <span className="text-cyan-600 dark:text-cyan-400">${projectedMrrUsd.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="2000000"
                  step="25000"
                  value={projectedMrrUsd}
                  onChange={(e) => setProjectedMrrUsd(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8C857B] font-mono">
                  <span>$25K (Early Beta)</span>
                  <span>$500K (10K Users)</span>
                  <span>$2M (Global Scale)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-[#2D2926] dark:text-[#F0FDF4]">Valuation Revenue Multiple</span>
                  <span className="text-cyan-600 dark:text-cyan-400">{valuationMultiplier}x ARR</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={valuationMultiplier}
                  onChange={(e) => setValuationMultiplier(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8C857B] font-mono">
                  <span>5x (Conservative)</span>
                  <span>15x (High-Growth SaaS)</span>
                  <span>30x (AI Infrastructure)</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 text-cyan-300">
                <div className="text-[10px] uppercase font-bold text-cyan-400/80">Annualized Run-Rate (ARR)</div>
                <div className="text-xl font-extrabold mt-1 text-cyan-300">${annualizedRevenue.toLocaleString()} USD</div>
                <div className="text-[10px] text-cyan-200/60 mt-1">Gross SaaS subscription inflow</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300">
                <div className="text-[10px] uppercase font-bold text-emerald-400/80">50% Society Escrow Pool</div>
                <div className="text-xl font-extrabold mt-1 text-emerald-300">${fiftyPercentSocietyFundAnnual.toLocaleString()} USD / yr</div>
                <div className="text-[10px] text-emerald-200/60 mt-1">Direct to creators & community living floors</div>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 text-purple-300">
                <div className="text-[10px] uppercase font-bold text-purple-400/80">Implied Network Value (FDV)</div>
                <div className="text-xl font-extrabold mt-1 text-purple-300">${projectedTokenFdvUsd.toLocaleString()} USD</div>
                <div className="text-[10px] text-purple-200/60 mt-1">Series A / Sovereign Wealth Target</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Whitepaper Blueprint */}
      {activeSubTab === 'whitepaper' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D2926] dark:text-[#F3F1EC] font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-500" />
              <span>Institutional Whitepaper Section Architecture</span>
            </h3>
            <button
              onClick={handleDownloadWhitepaper}
              className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Full Spec
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {[
              {
                num: '01',
                title: 'Executive Summary & The 50% Axiom',
                desc: 'The mathematical argument for why automated 50/50 revenue sharing outperforms predatory monopoly extraction.'
              },
              {
                num: '02',
                title: 'Proof-of-Human-Attribution (PoHA)',
                desc: 'Zero-knowledge C2PA cryptography verifying original human creators and quarantining unauthorized AI training scrapers.'
              },
              {
                num: '03',
                title: 'Dual-Layer Economic Engine',
                desc: 'Stripe Connect fiat rails for instant merchant checkout paired with Layer-2 gasless micro-dividend settlement.'
              },
              {
                num: '04',
                title: 'Deflationary $HUMAN Governance',
                desc: '5% gross profit buy-and-burn mechanism paired with staking incentives for commercial developer SDK access.'
              },
              {
                num: '05',
                title: 'Swiss Verein Foundation Governance',
                desc: 'Decentralized legal trust structure insulating creator assets from corporate seizure or venture debt liquidation.'
              },
              {
                num: '06',
                title: 'The 7-Phase Post-Scarcity Roadmap',
                desc: 'Chronological roadmap collapsing energy, healthcare, and food costs to achieve planetary peace dividends.'
              }
            ].map(sec => (
              <div
                key={sec.num}
                className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] space-y-1"
              >
                <div className="flex items-center gap-2 font-mono font-bold text-[#059669] dark:text-cyan-400 text-xs">
                  <span>SECTION {sec.num}</span>
                </div>
                <h4 className="font-bold text-[#2D2926] dark:text-[#F3F1EC] text-xs">
                  {sec.title}
                </h4>
                <p className="text-[#6A655C] dark:text-[#94A3B8] text-[11px] leading-relaxed">
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: SEC Howey Test & Legal Insulation */}
      {activeSubTab === 'compliance' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#2D2926] dark:text-[#F3F1EC] font-mono flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-500" />
            <span>Regulatory Insulation & SEC Howey Test Risk Analysis</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Prong 1: Pure Utility & Non-Security Architecture</span>
              </div>
              <p className="text-[#2D2926] dark:text-[#CBD5E1] leading-relaxed">
                $HUMAN tokens are functional software access tokens required for rate-limit tiers and DAO governance. Payouts from commercial software subscriptions are executed directly in fiat (USD) or collateralized stablecoins via Stripe Connect, ensuring no expectation of passive profit solely from the entrepreneurial efforts of others.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Prong 2: Swiss Verein Non-Profit Trust Governance</span>
              </div>
              <p className="text-[#2D2926] dark:text-[#CBD5E1] leading-relaxed">
                The 50% Society Fund is held in an unassailable non-profit foundation trust (Verein model under Swiss Civil Code Articles 60–79), legally preventing corporate shareholders from expropriating creator restitution reserves.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
