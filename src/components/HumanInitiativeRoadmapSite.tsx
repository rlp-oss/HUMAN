import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Landmark,
  ShieldCheck,
  Coins,
  TrendingDown,
  HeartHandshake,
  Rocket,
  Atom,
  Droplets,
  Trees,
  Scale,
  Shield,
  Zap,
  Globe,
  Sliders,
  BookOpen,
  FileText,
  Search,
  Filter,
  ArrowRight,
  Maximize2,
  Minimize2,
  Lock,
  Cpu,
  HeartPulse,
  Sun,
  Eye,
  CheckCircle2,
  HelpCircle,
  Flag,
  Award,
  Archive
} from 'lucide-react';
import {
  MASTER_PLAN_PHASES,
  IDEOLOGICAL_TENETS,
  TECHNOLOGICAL_BILL_OF_RIGHTS,
  MASTER_PLAN_REFERENCE_DATA
} from '../services/masterPlanData';
import { RoadmapPhase, IdeologicalTenet } from '../types';

interface HumanInitiativeRoadmapSiteProps {
  onNavigateToTab?: (tab: string) => void;
  isStandaloneView?: boolean;
}

export const HumanInitiativeRoadmapSite: React.FC<HumanInitiativeRoadmapSiteProps> = ({
  onNavigateToTab,
  isStandaloneView = false
}) => {
  // Navigation & Deep Linking State
  const [activeSection, setActiveSection] = useState<'manifesto' | 'ideology' | 'roadmap' | 'bill-of-rights' | 'simulator' | 'whitepaper'>('roadmap');
  const [selectedPhaseNumber, setSelectedPhaseNumber] = useState<number>(1);
  const [selectedTenetId, setSelectedTenetId] = useState<string>('tenet_1');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eraFilter, setEraFilter] = useState<'All' | 'Transition' | 'Consolidation' | 'Abundance' | 'Planetary'>('All');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Dynamic Trajectory Simulation Controls
  const [customAdoptionSpeed, setCustomAdoptionSpeed] = useState<number>(1.0); // 0.5x (Slow) to 2.0x (Accelerated)
  const [customPeaceReallocation, setCustomPeaceReallocation] = useState<number>(75); // %
  const [customCommonsDeflation, setCustomCommonsDeflation] = useState<number>(65); // %

  // Check URL parameters on mount to support direct shareable deep links
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sectionParam = urlParams.get('section');
      const phaseParam = urlParams.get('phase');
      const tenetParam = urlParams.get('tenet');

      if (sectionParam && ['manifesto', 'ideology', 'roadmap', 'bill-of-rights', 'simulator', 'whitepaper'].includes(sectionParam)) {
        setActiveSection(sectionParam as any);
      }
      if (phaseParam) {
        const pNum = parseInt(phaseParam, 10);
        if (pNum >= 1 && pNum <= 7) {
          setSelectedPhaseNumber(pNum);
        }
      }
      if (tenetParam) {
        setSelectedTenetId(tenetParam);
      }
    } catch (e) {
      // Safe fallback
    }
  }, []);

  // Update browser history query parameters without full reload
  const updateShareableUrl = (section: string, phaseNum?: number, tenetId?: string) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'roadmap-site');
      url.searchParams.set('section', section);
      if (phaseNum) url.searchParams.set('phase', phaseNum.toString());
      if (tenetId) url.searchParams.set('tenet', tenetId);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // Ignore in sandboxed iframes
    }
  };

  const handleSectionChange = (section: 'manifesto' | 'ideology' | 'roadmap' | 'bill-of-rights' | 'simulator' | 'whitepaper') => {
    setActiveSection(section);
    updateShareableUrl(section, selectedPhaseNumber, selectedTenetId);
  };

  const handlePhaseSelect = (phaseNum: number) => {
    setSelectedPhaseNumber(phaseNum);
    updateShareableUrl('roadmap', phaseNum, selectedTenetId);
  };

  const handleCopyShareableLink = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'roadmap-site');
      url.searchParams.set('section', activeSection);
      if (activeSection === 'roadmap') {
        url.searchParams.set('phase', selectedPhaseNumber.toString());
      } else if (activeSection === 'ideology') {
        url.searchParams.set('tenet', selectedTenetId);
      }
      navigator.clipboard.writeText(url.toString());
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    } catch (e) {
      // Fallback
    }
  };

  const handleExportMarkdownSpec = () => {
    const markdownContent = `# The Human Initiative & Economic Evolution Roadmap
**Document Specification**: ${MASTER_PLAN_REFERENCE_DATA.initiativeVersion}  
**Ratification Status**: ${MASTER_PLAN_REFERENCE_DATA.ratificationStatus}  
**Last Updated**: ${MASTER_PLAN_REFERENCE_DATA.lastUpdated}  

---

## Executive Summary & Manifesto
${MASTER_PLAN_REFERENCE_DATA.coreManifestoSummary}

---

## The 5 Foundational Ideological Tenets
${IDEOLOGICAL_TENETS.map((t, idx) => `
### Tenet ${idx + 1}: ${t.title}
* **Axiom**: "${t.axiom}"
* **Legacy Problem**: ${t.traditionalParadigmVsHumanInitiative.extractiveLegacy}
* **Human Evolution**: ${t.traditionalParadigmVsHumanInitiative.humanInitiativeEvolution}
* **Philosophical Grounding**: ${t.philosophicalRoot}
* **Tangible Output**: ${t.tangibleOutcome}
`).join('\n')}

---

## 7-Phase Civilizational Economic Evolution Roadmap (2026 – 2040+)
${MASTER_PLAN_PHASES.map((p) => `
### Phase ${p.phaseNumber} (${p.timeframe}): ${p.title} [Codename: ${p.codename}]
* **Strategic Objective**: ${p.strategicObjective}
* **Civilization Era**: ${p.civilizationEra}
* **Monthly Living Floor**: $${p.economicImpact.monthlyLivingFloorUsd.toLocaleString()} / month
* **Cost of Living Deflation**: -${p.economicImpact.costOfLivingDeflationPct}%
* **Global Sovereign Treasury**: $${(p.economicImpact.globalEndowmentTreasuryUsd / 1_000_000_000_000).toFixed(2)} Trillion USD
* **Poverty Eradication Level**: ${p.economicImpact.povertyEradicationPct}%
* **Key Milestones**:
${p.keyMilestones.map((m) => `  - ${m}`).join('\n')}
* **Technological Breakthroughs**:
${p.technologicalBreakthroughs.map((b) => `  - ${b}`).join('\n')}
* **Governance & Legal Evolution**: ${p.governanceAndLegalShift}
`).join('\n')}

---

## The Technological Bill of Rights
${TECHNOLOGICAL_BILL_OF_RIGHTS.map((r) => `
### ${r.articleNumber}: ${r.title}
${r.clauses.map((c) => `* ${c}`).join('\n')}
* **Enforcement Mechanism**: ${r.enforcementMechanism}
`).join('\n')}

---
*Generated directly from The H.U.M.A.N. Initiative Master Specification consensus node.*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HUMAN_Initiative_Roadmap_Master_Spec_${MASTER_PLAN_REFERENCE_DATA.initiativeVersion}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 3000);
  };

  // Filtered Phases based on Era & Search
  const filteredPhases = useMemo(() => {
    return MASTER_PLAN_PHASES.filter((p) => {
      const matchesEra = eraFilter === 'All' || p.civilizationEra === eraFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.codename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.strategicObjective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyMilestones.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesEra && matchesSearch;
    });
  }, [eraFilter, searchQuery]);

  // Active Phase Data
  const activePhase = useMemo(() => {
    return MASTER_PLAN_PHASES.find((p) => p.phaseNumber === selectedPhaseNumber) || MASTER_PLAN_PHASES[0];
  }, [selectedPhaseNumber]);

  // Active Tenet Data
  const activeTenet = useMemo(() => {
    return IDEOLOGICAL_TENETS.find((t) => t.id === selectedTenetId) || IDEOLOGICAL_TENETS[0];
  }, [selectedTenetId]);

  return (
    <div className={`w-full min-h-screen text-slate-100 bg-slate-950 font-sans transition-all ${isFullscreen ? 'p-4 sm:p-8' : 'space-y-8'}`}>
      
      {/* ========================================================================= */}
      {/* 1. MASTER HEADER & SHAREABLE REFERENCE BANNER                              */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border-2 border-indigo-500/40 shadow-2xl p-6 sm:p-10 space-y-6">
        {/* Glow backdrop decorative accent */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-extrabold tracking-wide">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                OFFICIAL REFERENCE PUBLICATION
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                {MASTER_PLAN_REFERENCE_DATA.initiativeVersion}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                Ratified: {MASTER_PLAN_REFERENCE_DATA.lastUpdated}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Human Initiative & Economic Evolution Roadmap
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              The canonical master plan and philosophical architecture transitioning global civilization from predatory artificial scarcity and militarized conflict into <strong className="text-emerald-300">automated technological deflation</strong>, <strong className="text-indigo-300">universal creator equity</strong>, and <strong className="text-amber-300">post-scarcity abundance</strong>.
            </p>
          </div>

          {/* Action Buttons: Direct Link & Export */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleCopyShareableLink}
              className={`px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                copiedUrl
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-emerald-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {copiedUrl ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copiedUrl ? 'Direct Reference Link Copied!' : 'Copy Shareable Deep Link'}
            </button>

            <button
              onClick={handleExportMarkdownSpec}
              className={`px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                copiedMarkdown
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Download className="w-4 h-4 text-emerald-400" />
              {copiedMarkdown ? 'Markdown Spec Downloaded!' : 'Download Master Spec (.md)'}
            </button>

            <a
              href="/downloads/human_ethical_ai_complete_gemini_notebook.zip"
              download="human_ethical_ai_complete_gemini_notebook.zip"
              className="px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-500/40 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 shadow-sm"
              title="Download full project code and notebook markdown bundle for Gemini Notebook & NotebookLM"
            >
              <Archive className="w-4 h-4 text-amber-400" />
              <span>Download Gemini Notebook ZIP (.zip)</span>
            </a>
          </div>
        </div>

        {/* Master Section Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => handleSectionChange('roadmap')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-300'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            🗺️ 7-Phase Civilizational Roadmap (2026 – 2040+)
          </button>

          <button
            onClick={() => handleSectionChange('ideology')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'ideology'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300 font-extrabold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            🏛️ 5 Foundational Ideological Tenets
          </button>

          <button
            onClick={() => handleSectionChange('bill-of-rights')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'bill-of-rights'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 ring-2 ring-amber-300 font-extrabold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-500" />
            📜 The Technological Bill of Rights
          </button>

          <button
            onClick={() => handleSectionChange('simulator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'simulator'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30 ring-2 ring-teal-300 font-extrabold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-teal-400" />
            🧪 Dynamic Evolution Trajectory Simulator
          </button>

          <button
            onClick={() => handleSectionChange('manifesto')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSection === 'manifesto'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-300'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            📖 The Sovereign Manifesto
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: 7-PHASE CIVILIZATIONAL ROADMAP (2026 – 2040+)                  */}
      {/* ========================================================================= */}
      {activeSection === 'roadmap' && (
        <div className="space-y-6">
          
          {/* Roadmap Filter & Search Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Era:
              </span>
              {(['All', 'Transition', 'Consolidation', 'Abundance', 'Planetary'] as const).map((era) => (
                <button
                  key={era}
                  onClick={() => setEraFilter(era)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    eraFilter === era
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search milestones, codenames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Interactive Phase Timeline Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {MASTER_PLAN_PHASES.map((phase) => {
              const isSelected = selectedPhaseNumber === phase.phaseNumber;
              return (
                <button
                  key={phase.phaseNumber}
                  onClick={() => handlePhaseSelect(phase.phaseNumber)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-400 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-400/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      P-{phase.phaseNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{phase.timeframe}</span>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {phase.codename}
                    </div>
                    <div className="text-xs font-extrabold text-white line-clamp-2 mt-0.5 leading-snug">
                      {phase.title}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-mono font-bold">
                      ${phase.economicImpact.monthlyLivingFloorUsd}/mo
                    </span>
                    <span className="text-teal-300 font-mono">
                      -{phase.economicImpact.costOfLivingDeflationPct}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Deep Dive Detail Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                    PHASE {activePhase.phaseNumber} • {activePhase.timeframe}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                    Era: {activePhase.civilizationEra}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    Codename: {activePhase.codename}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activePhase.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
                  {activePhase.strategicObjective}
                </p>
              </div>

              {/* Economic KPI Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0">
                <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Monthly Floor</div>
                  <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
                    ${activePhase.economicImpact.monthlyLivingFloorUsd.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-400">/ adult citizen</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-teal-500/40 text-center">
                  <div className="text-[10px] text-teal-300 font-bold uppercase">Cost Deflation</div>
                  <div className="text-xl font-mono font-extrabold text-teal-400 mt-0.5">
                    -{activePhase.economicImpact.costOfLivingDeflationPct}%
                  </div>
                  <div className="text-[9px] text-slate-400">Survival costs</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-indigo-500/40 text-center">
                  <div className="text-[10px] text-indigo-300 font-bold uppercase">Endowment</div>
                  <div className="text-xl font-mono font-extrabold text-indigo-400 mt-0.5">
                    ${(activePhase.economicImpact.globalEndowmentTreasuryUsd / 1_000_000_000_000).toFixed(1)}T
                  </div>
                  <div className="text-[9px] text-slate-400">Treasury scale</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/40 text-center">
                  <div className="text-[10px] text-amber-300 font-bold uppercase">Poverty Exit</div>
                  <div className="text-xl font-mono font-extrabold text-amber-400 mt-0.5">
                    {activePhase.economicImpact.povertyEradicationPct}%
                  </div>
                  <div className="text-[9px] text-slate-400">Global eradication</div>
                </div>
              </div>
            </div>

            {/* Key Deliverables & Tech Pillars */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Core Key Milestones */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  Key Programmatic Milestones
                </div>
                <div className="space-y-2.5">
                  {activePhase.keyMilestones.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Technological Breakthroughs */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Technological Breakthroughs
                </div>
                <div className="space-y-2.5">
                  {activePhase.technologicalBreakthroughs.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Governance & Legal Framework */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  Governance & Legal Evolution
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  {activePhase.governanceAndLegalShift}
                </p>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Participation Rate:</span>
                  <span className="text-white font-bold">{activePhase.economicImpact.humanParticipationRatePct}% Global Workforce</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: 5 FOUNDATIONAL IDEOLOGICAL TENETS                              */}
      {/* ========================================================================= */}
      {activeSection === 'ideology' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/50 border border-emerald-500/30 space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              The 5 Foundational Ideological Tenets
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The intellectual, moral, and economic axioms underpinning The H.U.M.A.N. Initiative. These tenets replace the outdated incentives of extractive debt capitalism with programmatic human-first equity.
            </p>
          </div>

          {/* Tenet Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {IDEOLOGICAL_TENETS.map((tenet, idx) => {
              const isSelected = selectedTenetId === tenet.id;
              return (
                <button
                  key={tenet.id}
                  onClick={() => {
                    setSelectedTenetId(tenet.id);
                    updateShareableUrl('ideology', selectedPhaseNumber, tenet.id);
                  }}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer border space-y-2 ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-400 shadow-xl ring-2 ring-emerald-400/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      TENET #{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2">{tenet.title}</h3>
                </button>
              );
            })}
          </div>

          {/* Active Tenet Comprehensive Deep Dive */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-2xl space-y-6">
            <div className="space-y-2 pb-6 border-b border-slate-800">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                FOUNDATIONAL CANONICAL AXIOM
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeTenet.title}</h2>
              <blockquote className="p-4 rounded-xl bg-slate-950/90 border-l-4 border-emerald-400 text-sm sm:text-base font-semibold text-emerald-200 italic">
                "{activeTenet.axiom}"
              </blockquote>
            </div>

            {/* Paradigm Contrast: Extractive Legacy vs Human Evolution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-rose-400" />
                  The Extractive Legacy Problem (Status Quo)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTenet.traditionalParadigmVsHumanInitiative.extractiveLegacy}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  The H.U.M.A.N. Initiative Evolutionary Solution
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTenet.traditionalParadigmVsHumanInitiative.humanInitiativeEvolution}
                </p>
              </div>
            </div>

            {/* Philosophical Grounding & Real Tangible Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Philosophical & Ethical Root
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTenet.philosophicalRoot}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Tangible Programmatic Output
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTenet.tangibleOutcome}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: THE TECHNOLOGICAL BILL OF RIGHTS                                */}
      {/* ========================================================================= */}
      {activeSection === 'bill-of-rights' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/50 border border-amber-500/30 space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              The Technological Bill of Rights (Articles I – V)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inalienable civil, digital, and economic guarantees codified into the cryptographic consensus of The H.U.M.A.N. Initiative Layer-1 ledger.
            </p>
          </div>

          <div className="space-y-4">
            {TECHNOLOGICAL_BILL_OF_RIGHTS.map((article, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-extrabold">
                      {article.articleNumber}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">{article.title}</h3>
                  </div>
                </div>

                <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-slate-800">
                  {article.clauses.map((clause, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                      <span className="text-amber-400 font-mono font-bold mt-0.5">§{cIdx + 1}.</span>
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-2 text-xs">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-emerald-300">Cryptographic Enforcement:</strong> {article.enforcementMechanism}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: DYNAMIC EVOLUTION TRAJECTORY SIMULATOR                         */}
      {/* ========================================================================= */}
      {activeSection === 'simulator' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-teal-500/40 shadow-2xl space-y-6">
            <div className="space-y-2 pb-6 border-b border-slate-800">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                <Sliders className="w-3.5 h-3.5" />
                CIVILIZATIONAL TRAJECTORY PREDICTOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Simulate Humanity's Acceleration to Post-Scarcity
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Adjust global adoption parameters, disarmament speed, and public commons efficiency to see how quickly humanity reaches Kardashev Type-I abundance.
              </p>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold">Tech Adoption Velocity:</span>
                  <span className="font-mono font-bold text-teal-400">{customAdoptionSpeed.toFixed(1)}x Speed</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={customAdoptionSpeed}
                  onChange={(e) => setCustomAdoptionSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <p className="text-[11px] text-slate-400">
                  Rate at which nation-states and enterprises adopt the 50/50 split SDK and sovereign compute commons.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold">Military Peace Reallocation:</span>
                  <span className="font-mono font-bold text-amber-400">{customPeaceReallocation}% War Budget</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customPeaceReallocation}
                  onChange={(e) => setCustomPeaceReallocation(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <p className="text-[11px] text-slate-400">
                  Portion of $2.44T global defense budgets redirected into planetary fusion, maglevs, and universal bonuses.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold">Cost-of-Living Deflation:</span>
                  <span className="font-mono font-bold text-emerald-400">-{customCommonsDeflation}% Drop</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={customCommonsDeflation}
                  onChange={(e) => setCustomCommonsDeflation(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <p className="text-[11px] text-slate-400">
                  Efficiency of robotic vertical agriculture, open-source medicine, and zero-marginal-cost solar grids.
                </p>
              </div>

            </div>

            {/* Real-Time Simulated Output */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                Simulated 2035 Global Civilization Baseline
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Monthly Payout</div>
                  <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
                    ${Math.round(1450 * customAdoptionSpeed + (customPeaceReallocation * 4.84)).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">/ month / adult</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Purchasing Multiplier</div>
                  <div className="text-2xl font-mono font-extrabold text-teal-400 mt-1">
                    {(1 / (1 - customCommonsDeflation / 100)).toFixed(2)}x
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Real wealth scale</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Peace Capital Unlocked</div>
                  <div className="text-2xl font-mono font-extrabold text-amber-400 mt-1">
                    ${((2.44 * customPeaceReallocation) / 100).toFixed(2)}T
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Annual redirection</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Time to Post-Scarcity</div>
                  <div className="text-2xl font-mono font-extrabold text-indigo-400 mt-1">
                    {Math.max(4, Math.round(14 / customAdoptionSpeed))} Years
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Target: 2030 – 2038</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: THE SOVEREIGN MANIFESTO (FULL TEXT)                            */}
      {/* ========================================================================= */}
      {activeSection === 'manifesto' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-3 pb-8 border-b border-slate-800">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-extrabold">
              CANONICAL DECLARATION OF ECONOMIC LIBERATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              The Sovereign Manifesto for Post-Scarcity Civilization
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              A declaration to all creators, engineers, workers, and sovereign nation-states regarding the unconditional future of human freedom.
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-slate-200 leading-relaxed font-serif">
            <p className="text-lg text-slate-100 font-sans font-medium">
              We stand at the most profound inflection point in biological history. For ten thousand years, human survival was bounded by physical scarcity, manual toil, and the violent zero-sum competition for limited arable land and energy.
            </p>

            <p>
              With the birth of universal artificial intelligence, automated robotics, and zero-marginal-cost renewable energy, the technological prerequisites for planetary abundance have arrived. Yet, our economic institutions remain shackled to legacy mechanisms designed for artificial scarcity: uncompensated creative harvesting, predatory pharmaceutical patent monopolies, and trillions squandered on destructive militarized conflict.
            </p>

            <div className="p-6 rounded-2xl bg-slate-950 border-l-4 border-indigo-500 font-sans space-y-2 my-6">
              <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">The Fundamental Theorem of the H.U.M.A.N. Initiative:</h4>
              <p className="text-sm text-slate-200 italic font-serif">
                "Technology exists to serve human dignity, not to reduce human beings to uncompensated raw data. By establishing an automated 50/50 revenue covenant, a universal sovereign endowment, and dedicating our collective genius to mutual construction rather than warfare, we can guarantee every living soul a dignified existence while driving the cost of staying alive toward zero."
              </p>
            </div>

            <p>
              We reject the false dichotomy between cruel austerity and bureaucratic stagnation. We champion a dynamic, diligence-inspired meritocracy where human creativity is celebrated, industrious contributors are rewarded with surge bonuses, and displaced workers are fully protected by an unshakeable $1,450 to $2,400 monthly living baseline.
            </p>

            <p>
              This is not a utopian fantasy—it is a rigorous, cryptographically verifiable engineering architecture. Through the 7 phases outlined in this roadmap, humanity will reclaim its birthright: a clean planet, universal health, infinite clean energy, and the uninhibited freedom to explore the cosmos.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
            <div>
              <strong>Ratified by:</strong> Global Developer Coalition, Verified Human Creators & Multilateral Economic Observers
            </div>
            <button
              onClick={handleCopyShareableLink}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
            >
              Share Manifesto
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FOOTER & COMPLIANCE SEAL                                                  */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>H.U.M.A.N. Initiative Mainnet Consortium • All Rights Reserved Under Universal Creator Copyleft</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-slate-500">Spec Hash: 0x8f7c...9a21</span>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

    </div>
  );
};
