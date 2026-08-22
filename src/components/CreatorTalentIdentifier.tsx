import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  Music, 
  Code, 
  Palette, 
  Award, 
  DollarSign, 
  Lock, 
  Download, 
  Share2, 
  ExternalLink, 
  Fingerprint, 
  BrainCircuit, 
  Check, 
  Zap, 
  HelpCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TalentDiscoveryReport, CreatorPathId } from '../types';
import { TALENT_PROBE_QUESTIONS, CREATOR_PATHS } from '../services/creatorPathsData';
import { CreatorTalentService } from '../services/api';
import { 
  TomeCrafterLogoIcon, 
  RlmProStudioLogoIcon, 
  ForgeOsLogoIcon, 
  RlEasyFlowLogoIcon 
} from './HumanLogo';

interface CreatorTalentIdentifierProps {
  onNavigateToWalkthrough: (pathId?: CreatorPathId) => void;
  onNavigateToSignup: (initialCategory?: string) => void;
  onNavigateToActivation: () => void;
}

export const CreatorTalentIdentifier: React.FC<CreatorTalentIdentifierProps> = ({
  onNavigateToWalkthrough,
  onNavigateToSignup,
  onNavigateToActivation,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { optionText: string; archetypeBias: string; talentHint: string }>>({});
  const [creatorName, setCreatorName] = useState<string>('');
  const [creatorEmail, setCreatorEmail] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<TalentDiscoveryReport | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [historyReports, setHistoryReports] = useState<TalentDiscoveryReport[]>([]);

  useEffect(() => {
    CreatorTalentService.getActiveReport().then(r => {
      if (r) setReport(r);
    });
    CreatorTalentService.getSavedReports().then(setHistoryReports);
  }, []);

  const currentQuestion = TALENT_PROBE_QUESTIONS[currentQuestionIndex];
  const progressPct = Math.round(((currentQuestionIndex + 1) / TALENT_PROBE_QUESTIONS.length) * 100);

  const handleSelectOption = (option: { text: string; archetypeBias: string; talentHint: string }) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < TALENT_PROBE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteDiagnostic();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCompleteDiagnostic = async () => {
    setIsAnalyzing(true);
    try {
      // Find dominant archetype from answers
      const counts: Record<string, number> = {};
      Object.values(answers).forEach((a: { optionText: string; archetypeBias: string; talentHint: string }) => {
        if (a && a.archetypeBias) {
          counts[a.archetypeBias] = (counts[a.archetypeBias] || 0) + 1;
        }
      });
      let dominant = 'prose-worldbuilder';
      let maxCount = 0;
      Object.entries(counts).forEach(([bias, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominant = bias;
        }
      });

      const matchedPath = CREATOR_PATHS.find(p => p.id === dominant);

      const generatedReport = await CreatorTalentService.analyzeCreatorTalents({
        answers,
        userName: creatorName.trim() || 'Verified Artisan',
        userEmail: creatorEmail.trim() || 'artisan@rights.org',
        selectedArchetype: matchedPath?.title || 'The Prose & Worldbuilder Architect',
      });

      setReport(generatedReport);
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5A5A40', '#D67D5C', '#8C857B'],
      });
    } catch (err) {
      console.error('Error analyzing talents:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setReport(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleCopyShareSummary = () => {
    if (!report) return;
    const text = `🎨 The H.U.M.A.N. Initiative Creator Talent Diagnostic:
🏆 Primary Superpower: ${report.superpowerTitle} (${report.primaryArchetype})
⭐ Rarity: ${report.rarityPercentile}
🏛️ Assigned Flagship App: ${report.assignedFlagshipApps[0]?.appName || 'Tome Crafter'}
⚖️ 40% Society Fund Covenant: Active & Verifiable
https://humaninitiative.org/creator-identifier`;

    navigator.clipboard.writeText(text);
    setCopiedToast('Diagnostic summary copied to clipboard!');
    setTimeout(() => setCopiedToast(null), 3500);
  };

  const getAppLogo = (appName: string) => {
    if (appName.includes('Tome')) return <TomeCrafterLogoIcon size={18} />;
    if (appName.includes('RLM')) return <RlmProStudioLogoIcon size={18} />;
    if (appName.includes('Forge')) return <ForgeOsLogoIcon size={18} />;
    return <RlEasyFlowLogoIcon size={18} />;
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#2D2926]">
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#5A5A40]/40 bg-[#FFFFFF] text-[#2D2926] shadow-2xl backdrop-blur-md animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          <span className="text-xs font-mono font-semibold">{copiedToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] shadow-2xs">
            <BrainCircuit className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>AI-Proof Human Talent Identifier & Diagnostic</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-[#2D2926] tracking-tight">
            Discover & Unlock Your Latent Creative Superpowers
          </h1>

          <p className="text-sm md:text-base text-[#6A655C] leading-relaxed">
            Answer 5 deep probing questions designed specifically to uncover the nuanced human sensory abilities, aesthetic judgments, and structural instincts that artificial intelligence cannot replicate. We will map your unique gift to high-yield 40% Society Fund royalty channels.
          </p>
        </div>
      </div>

      {/* Main Diagnostic Container */}
      {!report && !isAnalyzing && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 md:p-8 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#5A5A40] font-bold uppercase">
                Probing Question {currentQuestionIndex + 1} of {TALENT_PROBE_QUESTIONS.length}
              </span>
              <span className="text-[#8C857B]">
                {progressPct}% Complete
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#F4EFEA] overflow-hidden">
              <div 
                className="h-full bg-[#5A5A40] transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-[#D67D5C] font-bold tracking-wider">
                {currentQuestion.dimension}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-[#2D2926] leading-snug">
                {currentQuestion.question}
              </h2>
              <p className="text-xs text-[#6A655C] italic">
                {currentQuestion.subtext}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id]?.optionText === option.text;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-sm ring-2 ring-[#5A5A40]/10'
                        : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#5A5A40] border-[#5A5A40] text-white'
                        : 'border-[#DCD5CA] bg-[#FAF8F5]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs md:text-sm font-medium text-[#2D2926] leading-relaxed">
                        {option.text}
                      </p>
                      <span className="inline-block text-[10px] font-mono text-[#8C857B]">
                        Unlocks: <strong>{option.talentHint}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Details Form on Last Question */}
          {currentQuestionIndex === TALENT_PROBE_QUESTIONS.length - 1 && (
            <div className="pt-4 border-t border-[#E5E0D8] space-y-3">
              <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold block">
                Personalize Your Talent Reveal Report (Optional):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name or Alias"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                />
                <input
                  type="email"
                  placeholder="Creator Email"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6A655C] hover:bg-[#FAF8F5] disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-semibold text-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
            >
              <span>{currentQuestionIndex === TALENT_PROBE_QUESTIONS.length - 1 ? 'Analyze & Unlock Superpowers' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Loading / Diagnostic Synthesis State */}
      {isAnalyzing && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] border border-[#E5E0D8] mx-auto flex items-center justify-center text-[#5A5A40] animate-bounce">
            <Sparkles className="w-6 h-6 text-[#5A5A40]" />
          </div>
          <h2 className="text-xl font-bold text-[#2D2926]">
            Synthesizing Your Probing Diagnostic...
          </h2>
          <p className="text-xs text-[#6A655C] font-mono max-w-md mx-auto">
            Cross-referencing your sensory instinct parameters against C2PA provenance datasets, zero-copyleft cleanroom standards, and 40% Society Fund dividend schedules...
          </p>
        </div>
      )}

      {/* Report Reveal View */}
      {report && !isAnalyzing && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Banner Report */}
          <div className="rounded-3xl border border-[#5A5A40]/40 bg-[#FFFFFF] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#F4EFEA] text-[#5A5A40] font-bold border border-[#DCD5CA]">
                    {report.rarityPercentile}
                  </span>
                  <span className="text-xs font-mono text-[#8C857B]">
                    Diagnostic Completed: {new Date(report.completedAt).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[#2D2926] tracking-tight">
                  {report.superpowerTitle}
                </h2>
                <p className="text-xs font-mono text-[#5A5A40]">
                  Archetype: <strong>{report.primaryArchetype}</strong> • Beneficiary: {report.creatorName}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyShareSummary}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-semibold text-[#2D2926] hover:bg-[#F2ECE4] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Share Diagnostic</span>
                </button>

                <button
                  onClick={handleRetake}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-semibold text-[#6A655C] hover:bg-[#F2ECE4] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#6A655C]" />
                  <span>Retake</span>
                </button>
              </div>
            </div>

            {/* Discovered Hidden Talents Grid */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold tracking-wider">
                Discovered Latent Human Superpowers:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.discoveredHiddenTalents.map((talent, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8] text-[#5A5A40]">
                        <Award className="w-4 h-4 text-[#5A5A40]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#2D2926]">{talent.talent}</h4>
                    </div>

                    <p className="text-xs text-[#6A655C] leading-relaxed">
                      {talent.description}
                    </p>

                    <div className="pt-2 border-t border-[#E5E0D8] text-[10px] font-mono text-[#8C857B]">
                      Manifests In: <strong className="text-[#5A5A40]">{talent.manifestsIn}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Ecosystem Applications & Dividend Projections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold tracking-wider">
                  Recommended Ecosystem Channels:
                </span>

                <div className="space-y-2.5">
                  {report.assignedFlagshipApps.map((app, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {getAppLogo(app.appName)}
                        <div>
                          <h4 className="text-xs font-bold text-[#2D2926]">{app.appName}</h4>
                          <span className="text-[10px] font-mono text-[#6A655C]">{app.role}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-[#5A5A40]">
                          +${app.projectedMonthlyDividendUsd}/mo
                        </div>
                        <div className="text-[10px] text-[#8C857B]">
                          {(app.royaltyYieldBps / 100).toFixed(2)}% covenant yield
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable First Project Recommendation */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold tracking-wider">
                  Actionable First Creation Blueprint:
                </span>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#5A5A40]/30 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#D67D5C] font-bold">
                      Recommended Starter Project
                    </span>
                    <h4 className="text-xs font-bold text-[#2D2926] mt-0.5">
                      {report.firstProjectRecommendation.title}
                    </h4>
                  </div>

                  <p className="text-xs text-[#6A655C] leading-relaxed">
                    {report.firstProjectRecommendation.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8C857B] pt-2 border-t border-[#E5E0D8]">
                    <span>Effort: ~{report.firstProjectRecommendation.humanEffortHours} Human Hours</span>
                    <span className="text-[#5A5A40] font-bold">C2PA Signature Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E0D8]">
              <button
                onClick={() => onNavigateToWalkthrough(report.dominantPathId)}
                className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-xs font-semibold text-[#2D2926] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Compass className="w-4 h-4 text-[#5A5A40]" />
                <span>Explore Step-by-Step Pathway Walkthrough</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToSignup(report.primaryArchetype)}
                  className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  <Award className="w-4 h-4 text-white" />
                  <span>Register Creator Profile & Claim 40% Share</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
