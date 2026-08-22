import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  RotateCcw, 
  Layers, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import { RoiProjectionService, RoiSimulationParams } from '../services/RoiProjectionService';
import { FiveYearRoiSimulation } from '../types';
import { useTheme } from '../context/ThemeContext';

interface StakeholderRoiProjectionModuleProps {
  initialStreamedUsd?: number;
  onExportNotice?: (msg: string) => void;
}

export const StakeholderRoiProjectionModule: React.FC<StakeholderRoiProjectionModuleProps> = ({
  initialStreamedUsd = 128450,
  onExportNotice
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark' || mode === 'oled';

  // Interactive Simulation Controls
  const [streamedBase, setStreamedBase] = useState<number>(initialStreamedUsd);
  const [activeSubscribers, setActiveSubscribers] = useState<number>(4080);
  const [blendedArpu, setBlendedArpu] = useState<number>(49.50);
  const [growthRateYoY, setGrowthRateYoY] = useState<number>(120); // 120% YoY
  const [societyFundSplit, setSocietyFundSplit] = useState<number>(50); // 50%
  const [valuationMultiple, setValuationMultiple] = useState<number>(8.5); // 8.5x ARR
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'venture' | 'hyperscale'>('venture');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Apply quick presets
  const applyPreset = (preset: 'conservative' | 'venture' | 'hyperscale') => {
    setActiveScenario(preset);
    if (preset === 'conservative') {
      setGrowthRateYoY(65);
      setValuationMultiple(6.0);
    } else if (preset === 'venture') {
      setGrowthRateYoY(120);
      setValuationMultiple(8.5);
    } else if (preset === 'hyperscale') {
      setGrowthRateYoY(210);
      setValuationMultiple(12.0);
    }
  };

  const simulation: FiveYearRoiSimulation = useMemo(() => {
    return RoiProjectionService.calculate5YearProjection({
      initialStreamedBase: streamedBase,
      initialSubscribers: activeSubscribers,
      blendedArpu,
      annualGrowthRatePct: growthRateYoY,
      societyFundSplitPct: societyFundSplit,
      valuationMultiple,
    });
  }, [streamedBase, activeSubscribers, blendedArpu, growthRateYoY, societyFundSplit, valuationMultiple]);

  const copyMarkdown = () => {
    const md = RoiProjectionService.exportToMarkdown(simulation);
    navigator.clipboard.writeText(md);
    setCopiedType('markdown');
    if (onExportNotice) onExportNotice('5-Year Stakeholder ROI model copied to clipboard as Markdown!');
    setTimeout(() => setCopiedType(null), 3000);
  };

  const copyCsv = () => {
    const csv = RoiProjectionService.exportToCsv(simulation);
    navigator.clipboard.writeText(csv);
    setCopiedType('csv');
    if (onExportNotice) onExportNotice('5-Year ROI data exported to CSV format!');
    setTimeout(() => setCopiedType(null), 3000);
  };

  const maxRevenue = useMemo(() => {
    return Math.max(...simulation.projections.map(p => p.grossAnnualRevenue), 1);
  }, [simulation]);

  return (
    <div className={`rounded-2xl border-2 p-6 space-y-6 shadow-sm transition-colors ${
      isDark 
        ? 'border-emerald-500/30 bg-slate-950 text-slate-100' 
        : 'border-[#5A5A40] bg-[#FFFFFF] text-[#2D2926]'
    }`}>
      
      {/* Module Title & Top Stats */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5 ${
        isDark ? 'border-slate-800' : 'border-[#E5E0D8]'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
              isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-[#5A5A40] text-white'
            }`}>
              <TrendingUp className="w-3 h-3" />
              5-Year Investor Growth Trajectory
            </span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border font-bold ${
              isDark ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' : 'text-[#3D6E50] bg-[#EBF3ED] border-[#C5DEC9]'
            }`}>
              50/50 Fund Covenant Model
            </span>
          </div>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
            Stakeholder ROI & 5-Year Economic Projection
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            Model the compound impact of starting with the current <strong className={isDark ? 'text-emerald-300' : 'text-[#2D2926]'}>${streamedBase.toLocaleString()}</strong> streamed baseline. Visualize how the 50% Society Fund covenant accelerates for-profit SaaS enterprise multiples while sustainably paying human creators.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyMarkdown}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors shadow-2xs font-semibold cursor-pointer border ${
              isDark 
                ? 'bg-slate-900 hover:bg-slate-850 border-slate-700 text-slate-200 hover:text-white' 
                : 'bg-white hover:bg-[#FAF8F5] border-[#DCD5CA] text-[#5A5A40] hover:text-[#2D2926]'
            }`}
            title="Copy Pitch Deck Financial Summary as Markdown"
          >
            {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'markdown' ? 'Copied Brief!' : 'Export Deck MD'}</span>
          </button>

          <button
            onClick={copyCsv}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer ${
              isDark 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-[#5A5A40] hover:bg-[#484833] text-white'
            }`}
            title="Download CSV Projection Table"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{copiedType === 'csv' ? 'Copied CSV!' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Quick Scenario Buttons & Baseline Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => applyPreset('conservative')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeScenario === 'conservative'
              ? (isDark ? 'bg-slate-900 border-indigo-400 ring-2 ring-indigo-400/30' : 'bg-[#FAF8F5] border-[#5A5A40] ring-2 ring-[#5A5A40]/20 shadow-xs')
              : (isDark ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-white border-[#E5E0D8] hover:border-[#DCD5CA]')
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>1. Conservative Organic</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'text-[#6A655C] bg-white border-slate-200'
            }`}>
              65% YoY
            </span>
          </div>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            Steady grassroots creator adoption with 6.0x software ARR multiple.
          </p>
        </button>

        <button
          type="button"
          onClick={() => applyPreset('venture')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeScenario === 'venture'
              ? (isDark ? 'bg-slate-900 border-emerald-400 ring-2 ring-emerald-400/30' : 'bg-[#FAF8F5] border-[#5A5A40] ring-2 ring-[#5A5A40]/20 shadow-xs')
              : (isDark ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-white border-[#E5E0D8] hover:border-[#DCD5CA]')
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>2. Venture Growth Baseline</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${
              isDark ? 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40' : 'text-[#3D6E50] bg-[#EBF3ED] border-[#C5DEC9]'
            }`}>
              120% YoY (Standard)
            </span>
          </div>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            Rapid expansion across all 4 flagship apps with 8.5x ARR multiple.
          </p>
        </button>

        <button
          type="button"
          onClick={() => applyPreset('hyperscale')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeScenario === 'hyperscale'
              ? (isDark ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30' : 'bg-[#FAF8F5] border-[#5A5A40] ring-2 ring-[#5A5A40]/20 shadow-xs')
              : (isDark ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-white border-[#E5E0D8] hover:border-[#DCD5CA]')
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>3. Hyper-Scale Blitzscaling</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${
              isDark ? 'text-amber-300 bg-amber-950/80 border-amber-500/40' : 'text-[#D67D5C] bg-[#FAF0EC] border-[#EECDBC]'
            }`}>
              210% YoY
            </span>
          </div>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            Enterprise regulatory compliance mandates drive category dominance.
          </p>
        </button>
      </div>

      {/* Interactive Sliders Panel */}
      <div className={`p-4 rounded-xl border space-y-4 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#FDFCF9] border-[#E5E0D8]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-emerald-400' : 'text-[#5A5A40]'
          }`}>
            <Sliders className="w-3.5 h-3.5" /> Interactive Projection Variables
          </span>
          <button
            onClick={() => {
              setStreamedBase(128450);
              setActiveSubscribers(4080);
              setBlendedArpu(49.50);
              setGrowthRateYoY(120);
              setSocietyFundSplit(50);
              setValuationMultiple(8.5);
              setActiveScenario('venture');
            }}
            className={`text-[11px] font-mono flex items-center gap-1 cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#6A655C] hover:text-[#2D2926]'
            }`}
          >
            <RotateCcw className="w-3 h-3" /> Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Slider 1: Streamed Baseline */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-[#6A655C]'}>Starting Streamed Base:</span>
              <span className={`font-mono font-bold ${isDark ? 'text-emerald-300' : 'text-[#2D2926]'}`}>${streamedBase.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={500000}
              step={5000}
              value={streamedBase}
              onChange={(e) => setStreamedBase(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Annual YoY Growth */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-[#6A655C]'}>YoY Subscriber Growth:</span>
              <span className={`font-mono font-bold ${isDark ? 'text-teal-300' : 'text-[#3D6E50]'}`}>+{growthRateYoY}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={250}
              step={5}
              value={growthRateYoY}
              onChange={(e) => setGrowthRateYoY(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Blended ARPU */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-[#6A655C]'}>Blended Monthly ARPU:</span>
              <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-[#2D2926]'}`}>${blendedArpu.toFixed(2)}/mo</span>
            </div>
            <input
              type="range"
              min={29}
              max={99}
              step={1}
              value={blendedArpu}
              onChange={(e) => setBlendedArpu(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Slider 4: Valuation Multiple */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-[#6A655C]'}>SaaS Valuation Multiple:</span>
              <span className={`font-mono font-bold ${isDark ? 'text-amber-300' : 'text-[#D67D5C]'}`}>{valuationMultiple.toFixed(1)}x ARR</span>
            </div>
            <input
              type="range"
              min={5}
              max={15}
              step={0.5}
              value={valuationMultiple}
              onChange={(e) => setValuationMultiple(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4 Executive Impact Cards for Dragons & Stakeholders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-4 rounded-xl border space-y-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#E8E2D8]'
        }`}>
          <span className={`text-[10px] font-mono uppercase font-bold block ${
            isDark ? 'text-slate-400' : 'text-[#8C857B]'
          }`}>
            5-Year Cumulative Creator Royalties
          </span>
          <div className={`text-xl font-bold font-mono ${
            isDark ? 'text-emerald-400' : 'text-[#3D6E50]'
          }`}>
            ${(simulation.cumulative5YearFundTotal / 1000000).toFixed(2)}M
          </div>
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            Direct Stripe Connect distributions to artists & authors
          </span>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#E8E2D8]'
        }`}>
          <span className={`text-[10px] font-mono uppercase font-bold block ${
            isDark ? 'text-slate-400' : 'text-[#8C857B]'
          }`}>
            Year 5 Gross ARR Run-Rate
          </span>
          <div className={`text-xl font-bold font-mono ${
            isDark ? 'text-white' : 'text-[#2D2926]'
          }`}>
            ${(simulation.year5Arr / 1000000).toFixed(2)}M
          </div>
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            Across 4 commercial software apps
          </span>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#E8E2D8]'
        }`}>
          <span className={`text-[10px] font-mono uppercase font-bold block ${
            isDark ? 'text-slate-400' : 'text-[#8C857B]'
          }`}>
            Year 5 For-Profit SaaS Ops (50%)
          </span>
          <div className={`text-xl font-bold font-mono ${
            isDark ? 'text-indigo-400' : 'text-[#5A5A40]'
          }`}>
            ${((simulation.year5Arr * 0.5) / 1000000).toFixed(2)}M/yr
          </div>
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            High net margin software operating profit
          </span>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#E8E2D8]'
        }`}>
          <span className={`text-[10px] font-mono uppercase font-bold block ${
            isDark ? 'text-slate-400' : 'text-[#8C857B]'
          }`}>
            Est. Software Valuation ({valuationMultiple}x)
          </span>
          <div className={`text-xl font-bold font-mono ${
            isDark ? 'text-amber-400' : 'text-[#D67D5C]'
          }`}>
            ${(simulation.year5EstimatedValuation / 1000000).toFixed(1)}M
          </div>
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
            Enterprise value for commercial holding co
          </span>
        </div>
      </div>

      {/* 5-Year Visual Trajectory Chart (SVG & Multi-Bar) */}
      <div className={`p-5 rounded-xl border space-y-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-[#FAF8F5] border-[#E8E2D8]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
              <BarChart3 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-[#5A5A40]'}`} />
              5-Year Revenue & Society Fund Distribution Trajectory
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
              Emerald bars indicate the 50% non-profit Society Fund; Indigo bars indicate 50% for-profit SaaS Ops.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded ${isDark ? 'bg-emerald-500' : 'bg-[#3D6E50]'}`} />
              <span className={isDark ? 'text-slate-300' : 'text-[#2D2926]'}>50% Society Fund Pool</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded ${isDark ? 'bg-indigo-500' : 'bg-[#5A5A40]'}`} />
              <span className={isDark ? 'text-slate-300' : 'text-[#2D2926]'}>50% SaaS Ops Revenue</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Progression */}
        <div className={`grid grid-cols-5 gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-[#E5E0D8]'}`}>
          {simulation.projections.map((p) => {
            const heightFundPct = Math.max((p.societyFundAnnualPool / maxRevenue) * 100, 6);
            const heightSaaSPct = Math.max((p.forProfitSoftwareRevenue / maxRevenue) * 100, 8);

            return (
              <div key={p.year} className="flex flex-col items-center gap-2">
                
                {/* Value Label */}
                <div className={`text-[10px] font-mono font-bold text-center ${
                  isDark ? 'text-slate-200' : 'text-[#2D2926]'
                }`}>
                  ${(p.grossAnnualRevenue / 1000000).toFixed(2)}M
                </div>

                {/* Stacked Bar Container */}
                <div className={`w-full rounded-xl h-44 flex flex-col justify-end p-1.5 gap-1 relative overflow-hidden ${
                  isDark ? 'bg-slate-950 border border-slate-800' : 'bg-[#EAE4DC]'
                }`}>
                  
                  {/* SaaS Ops (50%) Bar */}
                  <div 
                    className={`w-full rounded-lg transition-all duration-500 relative group flex items-center justify-center ${
                      isDark ? 'bg-indigo-600' : 'bg-[#5A5A40]'
                    }`}
                    style={{ height: `${heightSaaSPct}%` }}
                  >
                    <span className="text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      50%
                    </span>
                  </div>

                  {/* Society Fund (50%) Bar */}
                  <div 
                    className={`w-full rounded-lg transition-all duration-500 relative group flex items-center justify-center shadow-xs ${
                      isDark ? 'bg-emerald-500' : 'bg-[#3D6E50]'
                    }`}
                    style={{ height: `${heightFundPct}%` }}
                  >
                    <span className="text-[8px] font-mono text-slate-950 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      50%
                    </span>
                  </div>
                </div>

                {/* Year Label & Stats */}
                <div className="text-center space-y-0.5">
                  <div className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-[#2D2926]'}`}>
                    Year {p.year}
                  </div>
                  <div className={`text-[9px] font-mono ${isDark ? 'text-slate-400' : 'text-[#6A655C]'}`}>
                    {p.subscribers.toLocaleString()} subs
                  </div>
                  <div className={`text-[9px] font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-[#3D6E50]'}`}>
                    +${(p.societyFundAnnualPool / 1000000).toFixed(2)}M fund
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Financial Projections Table */}
      <div className={`rounded-xl border overflow-x-auto ${isDark ? 'border-slate-800' : 'border-[#E5E0D8]'}`}>
        <table className="w-full text-left text-xs">
          <thead className={`font-mono uppercase text-[10px] border-b ${
            isDark 
              ? 'bg-slate-900 text-slate-400 border-slate-800' 
              : 'bg-[#F2ECE4] text-[#5A5A40] border-[#E5E0D8]'
          }`}>
            <tr>
              <th className="p-3">Year</th>
              <th className="p-3">Active Subscribers</th>
              <th className="p-3">Monthly MRR</th>
              <th className="p-3">Gross ARR</th>
              <th className={`p-3 ${isDark ? 'text-emerald-400' : 'text-[#3D6E50]'}`}>50% Society Fund Pool</th>
              <th className={`p-3 ${isDark ? 'text-indigo-400' : 'text-[#5A5A40]'}`}>50% For-Profit SaaS Ops</th>
              <th className="p-3">Creator Cohort</th>
              <th className="p-3">Avg Payout/Creator</th>
              <th className={`p-3 ${isDark ? 'text-amber-400' : 'text-[#D67D5C]'}`}>Est. Valuation ({valuationMultiple}x)</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-mono ${
            isDark ? 'divide-slate-800 text-slate-200' : 'divide-[#E5E0D8] text-[#2D2926]'
          }`}>
            {simulation.projections.map((p) => (
              <tr key={p.year} className={`transition-colors ${
                isDark ? 'hover:bg-slate-900/60' : 'hover:bg-[#FAF8F5]'
              }`}>
                <td className="p-3 font-bold">Year {p.year}</td>
                <td className="p-3">{p.subscribers.toLocaleString()}</td>
                <td className="p-3">${(p.grossMrr / 1000).toFixed(1)}k/mo</td>
                <td className="p-3 font-bold">${(p.grossAnnualRevenue / 1000000).toFixed(2)}M</td>
                <td className={`p-3 font-bold ${isDark ? 'text-emerald-400' : 'text-[#3D6E50]'}`}>
                  ${(p.societyFundAnnualPool / 1000000).toFixed(2)}M
                </td>
                <td className={`p-3 font-bold ${isDark ? 'text-indigo-400' : 'text-[#5A5A40]'}`}>
                  ${(p.forProfitSoftwareRevenue / 1000000).toFixed(2)}M
                </td>
                <td className="p-3">{p.activeCreators.toLocaleString()} creators</td>
                <td className="p-3 font-semibold">
                  ${p.averageCreatorAnnualPayout.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                </td>
                <td className={`p-3 font-bold ${isDark ? 'text-amber-400' : 'text-[#D67D5C]'}`}>
                  ${(p.estimatedValuationLow / 1000000).toFixed(1)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Investor Moat & Defense Rationale Box - High Contrast in Dark & Light Modes */}
      <div className={`rounded-xl border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
        isDark 
          ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 text-slate-100' 
          : 'border-[#C5DEC9] bg-[#EBF3ED] text-[#2D2926]'
      }`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-[#3D6E50]'}`} />
          <div className="space-y-1">
            <h5 className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-emerald-300' : 'text-[#3D6E50]'
            }`}>
              Why Investors Win with the 50% Fund Covenant
            </h5>
            <p className={`text-xs leading-relaxed ${
              isDark ? 'text-slate-200' : 'text-[#2D2926]'
            }`}>
              Allocating 50% of subscription revenue to the independent non-profit foundation eliminates copyright infringement liability, provides zero-copyleft cleanroom certification, and creates organic creator lock-in that traditional venture-backed closed AI labs cannot replicate.
            </p>
          </div>
        </div>

        <button
          onClick={copyMarkdown}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
            isDark 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold' 
              : 'bg-[#3D6E50] hover:bg-[#2C523B] text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Copy Investor Brief</span>
        </button>
      </div>

    </div>
  );
};
