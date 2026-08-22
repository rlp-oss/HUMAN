import React, { useState } from 'react';
import { 
  BookOpen, 
  Music, 
  Code, 
  Palette, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  ExternalLink, 
  HelpCircle, 
  Layers, 
  Sliders, 
  ChevronRight, 
  Zap, 
  Lock, 
  Check, 
  Compass, 
  Award,
  Clock,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CreatorPathDefinition, CreatorPathId, AppName } from '../types';
import { CREATOR_PATHS } from '../services/creatorPathsData';
import { 
  TomeCrafterLogoIcon, 
  RlmProStudioLogoIcon, 
  ForgeOsLogoIcon, 
  RlEasyFlowLogoIcon, 
  HumanInitiativeLogo 
} from './HumanLogo';

interface CreatorPathWalkthroughProps {
  onSelectPath?: (pathId: CreatorPathId) => void;
  onNavigateToTalentIdentifier: () => void;
  onNavigateToSignup: (initialCategory?: string) => void;
  onNavigateToActivation: () => void;
}

export const CreatorPathWalkthrough: React.FC<CreatorPathWalkthroughProps> = ({
  onSelectPath,
  onNavigateToTalentIdentifier,
  onNavigateToSignup,
  onNavigateToActivation,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<CreatorPathId>('prose-worldbuilder');
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [subscriberCountSim, setSubscriberCountSim] = useState<number>(3850);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [simulatedEarningToast, setSimulatedEarningToast] = useState<string | null>(null);

  const currentPath = CREATOR_PATHS.find(p => p.id === selectedPathId) || CREATOR_PATHS[0];

  const getPathIcon = (id: CreatorPathId) => {
    switch (id) {
      case 'prose-worldbuilder': return <BookOpen className="w-5 h-5 text-[#5A5A40]" />;
      case 'sonic-timbre': return <Music className="w-5 h-5 text-[#D67D5C]" />;
      case 'cleanroom-code': return <Code className="w-5 h-5 text-[#5A5A40]" />;
      case 'visual-vector': return <Palette className="w-5 h-5 text-[#8C857B]" />;
      case 'polymath-synthesist': return <Sparkles className="w-5 h-5 text-[#D67D5C]" />;
    }
  };

  const getAppLogo = (appName: AppName) => {
    if (appName === 'Tome Crafter') return <TomeCrafterLogoIcon size={18} />;
    if (appName === 'RLM Pro Studio') return <RlmProStudioLogoIcon size={18} />;
    if (appName === 'ForgeOS App Builder') return <ForgeOsLogoIcon size={18} />;
    return <RlEasyFlowLogoIcon size={18} />;
  };

  const calculateDynamicProjection = () => {
    const basisPoints = currentPath.earningYieldBps;
    // Avg plan price ~$49/mo, 40% society fund share = $19.60/sub/mo. 180 creators.
    const poolMonthly = subscriberCountSim * 19.60;
    const baseShare = poolMonthly / 180;
    const pathWeighted = baseShare * (basisPoints / 250);
    return Math.round(pathWeighted);
  };

  const handleStepToggle = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNumber));
    } else {
      const nextSteps = [...completedSteps, stepNumber];
      setCompletedSteps(nextSteps);
      if (nextSteps.length === 4) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5A5A40', '#D67D5C', '#8C857B'],
        });
      }
    }
  };

  const handleTriggerSimulatedYield = () => {
    const projected = calculateDynamicProjection();
    setSimulatedEarningToast(`Simulated +$${projected}/mo yield dispatched to your simulated Stripe Connect escrow!`);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#5A5A40', '#D67D5C'],
    });
    setTimeout(() => setSimulatedEarningToast(null), 4500);
  };

  const handleCopyManifest = () => {
    const mockHash = `0x9e88b2_${currentPath.id}_c2pa_jumbf_manifest_signed`;
    navigator.clipboard.writeText(mockHash);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#2D2926]">
      {simulatedEarningToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#5A5A40]/40 bg-[#FFFFFF] text-[#2D2926] shadow-2xl backdrop-blur-md animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          <span className="text-xs font-mono font-semibold">{simulatedEarningToast}</span>
        </div>
      )}

      {/* Hero Intro Header */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Interactive Creator Pathway Walkthrough</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-[#2D2926] tracking-tight">
            Choose Your Creator Pathway & Unlock Recurring Society Royalties
          </h1>

          <p className="text-sm md:text-base text-[#6A655C] leading-relaxed">
            The H.U.M.A.N. Initiative reserves a legally binding <strong>40% subscription covenant</strong> from all connected AI applications directly for human creators. Whether you write lore, record instruments, develop clean algorithms, or design visual systems, follow this walkthrough to get your work verified and earning.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToTalentIdentifier}
              className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Unsure Which Fits? Take the Talent Identifier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateToSignup(currentPath.assetCategory)}
              className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-[#2D2926] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#D67D5C]" />
              <span>Register for this Path Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Path Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold tracking-wider">
            1. Select Your Creative Discipline:
          </span>
          <span className="text-xs text-[#8C857B] font-mono">
            5 Distinct Artisan Frameworks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CREATOR_PATHS.map((path) => {
            const isSelected = path.id === selectedPathId;
            return (
              <div
                key={path.id}
                onClick={() => {
                  setSelectedPathId(path.id);
                  if (onSelectPath) onSelectPath(path.id);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#5A5A40] shadow-md ring-2 ring-[#5A5A40]/10'
                    : 'bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#DCD5CA] hover:bg-[#FFFFFF]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#F4EFEA] border border-[#E5E0D8]">
                      {getPathIcon(path.id)}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#5A5A40] font-bold">
                      {(path.earningYieldBps / 100).toFixed(1)}% Yield
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#2D2926] leading-snug">
                      {path.title}
                    </h3>
                    <p className="text-[11px] text-[#6A655C] line-clamp-2 mt-1">
                      {path.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-[11px] font-mono text-[#8C857B]">
                  <span className="flex items-center gap-1">
                    {getAppLogo(path.primaryApp)}
                    <span className="truncate max-w-[80px]">{path.primaryApp}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#5A5A40] font-bold" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Path Deep Walkthrough Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Path Roadmap & Milestones */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-6 shadow-2xs">
            {/* Path Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#F4EFEA] text-[#5A5A40] font-bold border border-[#DCD5CA]">
                    {currentPath.badge}
                  </span>
                  <span className="text-xs font-mono text-[#8C857B]">
                    Asset Domain: {currentPath.assetCategory}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#2D2926]">
                  {currentPath.title}
                </h2>
                <p className="text-xs text-[#6A655C] leading-relaxed max-w-xl">
                  {currentPath.description}
                </p>
              </div>

              <div className="text-right sm:self-center shrink-0">
                <div className="text-xs font-mono text-[#8C857B]">Est. Recurring Yield</div>
                <div className="text-lg font-black text-[#5A5A40] font-mono">
                  ${calculateDynamicProjection()} / mo
                </div>
                <div className="text-[10px] text-[#8C857B] font-mono">@ {subscriberCountSim.toLocaleString()} subscribers</div>
              </div>
            </div>

            {/* Core Superpowers & Provenance Requirement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#5A5A40] flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Core Human Craft Superpowers
                </span>
                <ul className="space-y-1.5 text-xs text-[#2D2926]">
                  {currentPath.coreHumanSuperpowers.map((sp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#5A5A40] font-bold">✓</span>
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#5A5A40] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Cryptographic Provenance Standard
                </span>
                <p className="text-xs text-[#6A655C] leading-relaxed">
                  {currentPath.c2paStandard}
                </p>
                <div className="pt-1 text-[11px] font-mono text-[#8C857B] flex items-center gap-1">
                  <span>Audit Guarantee:</span>
                  <strong className="text-[#5A5A40]">Zero-Copyleft Cleanroom Isolated</strong>
                </div>
              </div>
            </div>

            {/* 4-Step Actionable Milestone Walkthrough */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold">
                  2. 4-Stage Pathway Milestones (Interactive):
                </span>
                <span className="text-xs font-mono text-[#6A655C]">
                  {completedSteps.length} of 4 Completed
                </span>
              </div>

              <div className="space-y-3">
                {currentPath.startingMilestones.map((m) => {
                  const isDone = completedSteps.includes(m.step);
                  return (
                    <div
                      key={m.step}
                      onClick={() => handleStepToggle(m.step)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-[#FAF8F5] border-[#5A5A40]/40 shadow-xs'
                          : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
                      }`}
                    >
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isDone
                          ? 'bg-[#5A5A40] text-white'
                          : 'bg-[#F4EFEA] text-[#8C857B] border border-[#DCD5CA]'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : m.step}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${isDone ? 'text-[#2D2926]' : 'text-[#6A655C]'}`}>
                            Stage {m.step}: {m.title}
                          </h4>
                          <span className="text-[10px] font-mono text-[#8C857B]">
                            {isDone ? 'Milestone Cleared' : 'Click to Mark Complete'}
                          </span>
                        </div>
                        <p className="text-xs text-[#6A655C] leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Yield Calculator & Connected Ecosystem Apps */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dynamic Dividend Yield Simulator */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2926]">
                <DollarSign className="w-4 h-4 text-[#5A5A40]" />
                <span>Society Fund Yield Simulator</span>
              </div>
              <span className="text-[10px] font-mono text-[#5A5A40] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E0D8]">
                40% Covenant
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#6A655C] font-mono text-[11px]">
                  <span>Active Ecosystem Subscribers:</span>
                  <strong className="text-[#2D2926]">{subscriberCountSim.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="250"
                  value={subscriberCountSim}
                  onChange={(e) => setSubscriberCountSim(parseInt(e.target.value, 10))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8C857B] font-mono">
                  <span>500 subs</span>
                  <span>10,000 subs</span>
                  <span>25,000 subs</span>
                </div>
              </div>

              {/* Payout Metric Card */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#6A655C] font-mono text-[11px]">Your Projected Share:</span>
                  <span className="text-xl font-black font-mono text-[#5A5A40]">
                    ${calculateDynamicProjection().toLocaleString()} <span className="text-xs font-normal text-[#8C857B]">/ mo</span>
                  </span>
                </div>
                <div className="text-[10px] text-[#8C857B] font-mono leading-snug">
                  * Based on {(currentPath.earningYieldBps / 100).toFixed(2)}% path share from the $19.60/sub/mo pool across 180 registered rights holders.
                </div>
              </div>

              <button
                onClick={handleTriggerSimulatedYield}
                className="w-full py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span>Simulate Automated Payout Event</span>
              </button>
            </div>
          </div>

          {/* Connected Flagship Apps Card */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <span className="text-xs font-bold text-[#2D2926] uppercase font-mono">
                Primary Receiving App
              </span>
              <span className="text-[10px] font-mono text-[#8C857B]">4 Flagship Suite</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
              <div className="flex items-center gap-2.5">
                {getAppLogo(currentPath.primaryApp)}
                <div>
                  <h4 className="font-bold text-xs text-[#2D2926]">{currentPath.primaryApp}</h4>
                  <p className="text-[10px] text-[#6A655C] font-mono">Primary Distribution Channel</p>
                </div>
              </div>
              <p className="text-xs text-[#6A655C] leading-snug">
                Subscribers on {currentPath.primaryApp} stream 40% of their subscription directly into the pool supporting this creator discipline.
              </p>
            </div>

            {currentPath.secondaryApps.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#8C857B] block font-semibold">
                  Secondary Cross-Pollination Apps:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentPath.secondaryApps.map((app, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-mono text-[#2D2926] flex items-center gap-1.5">
                      {getAppLogo(app)}
                      <span>{app}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* C2PA Manifest & Activation Prompt */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D2926]">
              <Lock className="w-4 h-4 text-[#5A5A40]" />
              <span>C2PA Sovereign Attribution Receipt</span>
            </div>
            <p className="text-xs text-[#6A655C] leading-relaxed">
              When you submit your original work, our automated AST compiler seals it with a verifiable JUMBF content credential.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyManifest}
                className="flex-1 py-2 px-3 rounded-lg bg-[#FFFFFF] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] hover:bg-[#F2ECE4] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedManifest ? <Check className="w-3.5 h-3.5 text-[#5A5A40]" /> : <Fingerprint className="w-3.5 h-3.5 text-[#5A5A40]" />}
                <span>{copiedManifest ? 'Manifest Copied!' : 'Copy Sample C2PA Hash'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
