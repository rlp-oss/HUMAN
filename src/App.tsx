import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { TesterConsole } from './components/TesterConsole';
import { OnboardingModal } from './components/OnboardingModal';
import { CopyrightPortal } from './components/CopyrightPortal';
import { HumanBadgeWidget } from './components/HumanBadgeWidget';
import { BroadcastConsole } from './components/BroadcastConsole';
import { FeedbackPortal } from './components/FeedbackPortal';
import { SynthesisSimulator } from './components/SynthesisSimulator';
import { StripeSandboxModal } from './components/StripeSandboxModal';
import { 
  Tester, 
  CopyrightClaim, 
  FeedbackItem, 
  BroadcastMessage, 
  RoyaltyStreamEvent, 
  RoyaltyPoolSummary,
  AppName 
} from './types';
import { 
  TesterService, 
  ClaimService, 
  FeedbackService, 
  BroadcastService, 
  SynthesisService 
} from './services/api';
import { 
  ShieldCheck, 
  Award, 
  RefreshCw, 
  ExternalLink, 
  Github, 
  Lock, 
  Cpu, 
  DollarSign, 
  Sparkles,
  Layers
} from 'lucide-react';
import { HumanLogo } from './components/HumanLogo';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('testers');
  const [testers, setTesters] = useState<Tester[]>([]);
  const [claims, setClaims] = useState<CopyrightClaim[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [royaltyEvents, setRoyaltyEvents] = useState<RoyaltyStreamEvent[]>([]);
  const [summary, setSummary] = useState<RoyaltyPoolSummary>({
    total_streamed_usd: 128450.00,
    total_active_creators: 1420,
    total_synthesis_events: 384910,
    copyleft_quarantine_violations: 0,
    active_badge_apps: 89,
    monthly_pool_growth_pct: 34.8,
  });

  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [broadcastInitialApp, setBroadcastInitialApp] = useState<AppName | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isBadgeActive, setIsBadgeActive] = useState<boolean>(() => {
    return localStorage.getItem('human_badge_activated') === 'true' && 
           localStorage.getItem('human_badge_linked') === 'true';
  });

  const loadAllData = useCallback(async () => {
    try {
      const [
        fetchedTesters,
        fetchedClaims,
        fetchedFeedback,
        fetchedBroadcasts,
        fetchedEvents,
        fetchedSummary
      ] = await Promise.all([
        TesterService.getTesters(),
        ClaimService.getClaims(),
        FeedbackService.getFeedback(),
        BroadcastService.getBroadcasts(),
        SynthesisService.getRoyaltyEvents(),
        SynthesisService.getSummary(),
      ]);

      setTesters(fetchedTesters);
      setClaims(fetchedClaims);
      setFeedbackList(fetchedFeedback);
      setBroadcasts(fetchedBroadcasts);
      setRoyaltyEvents(fetchedEvents);
      setSummary(fetchedSummary);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleOpenBroadcastForApp = (app: AppName) => {
    setBroadcastInitialApp(app);
    setActiveTab('broadcast');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#2D2926] flex flex-col font-sans selection:bg-[#EED7CE] selection:text-[#2D2926]">
      {/* Background Soft Natural Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#5A5A40]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-[#D67D5C]/5 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#2D292608_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
      </div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalStreamedUsd={summary.total_streamed_usd}
        isBadgeActive={isBadgeActive}
        onOpenOnboardModal={() => setIsOnboardModalOpen(true)}
        onOpenStripeModal={() => setIsStripeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <RefreshCw className="w-8 h-8 text-[#5A5A40] animate-spin" />
            <div className="text-xs font-mono text-[#6A655C]">
              Connecting to ReForgeOS Micro-Royalty Ledger...
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {activeTab === 'testers' && (
              <TesterConsole
                testers={testers}
                onRefresh={loadAllData}
                onOpenOnboardModal={() => setIsOnboardModalOpen(true)}
                onOpenBroadcastWithCohort={handleOpenBroadcastForApp}
              />
            )}

            {activeTab === 'claims' && (
              <CopyrightPortal
                claims={claims}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === 'badge' && (
              <HumanBadgeWidget 
                isLinked={isBadgeActive}
                isActivated={isBadgeActive}
                onToggleActivation={(linked, activated) => setIsBadgeActive(linked && activated)}
              />
            )}

            {activeTab === 'synthesizer' && (
              <SynthesisSimulator
                events={royaltyEvents}
                summary={summary}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === 'broadcast' && (
              <BroadcastConsole
                testers={testers}
                broadcasts={broadcasts}
                initialAppTarget={broadcastInitialApp}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === 'feedback' && (
              <FeedbackPortal
                feedbackList={feedbackList}
                onRefresh={loadAllData}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E5E0D8] bg-[#F2ECE4] py-6 px-4 text-xs text-[#6A655C] font-mono">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HumanLogo size="sm" showText={true} />
            <span className="text-[#D4CCC1] hidden sm:inline">|</span>
            <span className="text-[#6A655C]">
              Universal Micro-Royalty Protocol & Tester Console
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#5A5A40]">
            <span>Powered by <strong className="text-[#2D2926]">ReForgeOS</strong></span>
            <span>•</span>
            <span className="text-[#5A5A40]">Strict OSPO 0-Copyleft Sandbox</span>
            <span>•</span>
            <span>Stripe Connect Protected</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <OnboardingModal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        onSuccess={() => {
          loadAllData();
        }}
      />

      <StripeSandboxModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
      />
    </div>
  );
}
