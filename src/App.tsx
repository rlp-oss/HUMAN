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
import { CreatorPayoutDashboard } from './components/CreatorPayoutDashboard';
import { StakeholderPersonas } from './components/StakeholderPersonas';
import { PrivacyPolicyViewer } from './components/PrivacyPolicyViewer';
import { CopyrightOwnerWebsite } from './components/CopyrightOwnerWebsite';
import { CustomBadgeModal } from './components/CustomBadgeModal';
import { FooterTrustBadge } from './components/UninvasiveTrustBadge';
import { HumanInitiativeMaster } from './components/HumanInitiativeMaster';
import { MerchantStorePortal } from './components/MerchantStorePortal';
import { DeveloperEmbedKit } from './components/DeveloperEmbedKit';
import { StripeIntegrationGuide } from './components/StripeIntegrationGuide';
import { GlobalFundMacroAndBlockchainArchitecture } from './components/GlobalFundMacroAndBlockchainArchitecture';
import { HumanInitiativeRoadmapSite } from './components/HumanInitiativeRoadmapSite';
import { PublicMissionWebsite } from './components/PublicMissionWebsite';
import { AppMediaHub } from './components/AppMediaHub';
import { TechnicalAiAssessmentPanel } from './components/TechnicalAiAssessmentPanel';
import { CryptoValuationOptimizer } from './components/CryptoValuationOptimizer';
import { CryptoTokenWalletSuite } from './components/CryptoTokenWalletSuite';
import { SideMenuTaskbar } from './components/SideMenuTaskbar';
import { UniversalThemeHubModal } from './components/UniversalThemeHubModal';
import { MasterAdminColorStudio } from './components/MasterAdminColorStudio';
import { GoogleDriveManagerModal } from './components/GoogleDriveManagerModal';
import HunterAuthGateway from '../HunterAuthGateway';
import { ThemeProvider } from './context/ThemeContext';
import { 
  Tester, 
  CopyrightClaim, 
  FeedbackItem, 
  BroadcastMessage, 
  RoyaltyStreamEvent, 
  RoyaltyPoolSummary,
  AppName,
  CopyrightPortalSubPage
} from './types';
import { 
  TesterService, 
  ClaimService, 
  FeedbackService, 
  BroadcastService, 
  SynthesisService 
} from './services/api';
import { testFirestoreConnection } from './lib/firebase';
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
  Layers,
  Database
} from 'lucide-react';
import { HumanLogo } from './components/HumanLogo';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam === 'mission-home' || tabParam === 'mission' || hash === 'mission-home' || hash === 'mission' || path.includes('/mission')) {
      return 'mission-home';
    }

    if (tabParam === 'roadmap-site' || tabParam === 'roadmap' || hash === 'roadmap-site' || hash === 'roadmap' || path.includes('/roadmap') || path.includes('/evolution-roadmap') || path.includes('/master-plan')) {
      return 'roadmap-site';
    }

    if (tabParam === 'media-hub' || tabParam === 'podcast' || tabParam === 'media' || hash === 'media-hub' || hash === 'podcast' || hash === 'media' || path.includes('/media') || path.includes('/podcast')) {
      return 'media-hub';
    }

    if (
      path.includes('/copyright-owner') || 
      path.includes('/royalties') || 
      path.includes('/transparency') || 
      path.includes('/portal') || 
      hash === 'portal' || 
      hash === 'royalties' || 
      hash === 'transparency'
    ) {
      return 'portal';
    }
    if (hash === 'technical-ai' || path.includes('/technical-ai') || tabParam === 'technical-ai') return 'technical-ai';
    if (hash === 'crypto-valuation' || hash === 'crypto' || path.includes('/crypto') || tabParam === 'crypto-valuation') return 'crypto-valuation';
    if (hash === 'crypto-wallet' || hash === 'wallet' || path.includes('/wallet') || tabParam === 'crypto-wallet' || tabParam === 'wallet') return 'crypto-wallet';
    if (hash === 'hunter' || hash === 'treasure-hunt' || hash === 'decoder' || path.includes('/hunter') || path.includes('/treasure-hunt') || tabParam === 'hunter' || tabParam === 'treasure-hunt' || tabParam === 'decoder') return 'hunter';
    if (hash === 'merchants' || path.includes('/merchants')) return 'merchants';
    if (hash === 'developer-embed' || hash === 'developers' || path.includes('/developers') || path.includes('/embed')) return 'developer-embed';
    if (hash === 'testers' || path.includes('/testers')) return 'testers';
    if (hash === 'claims' || path.includes('/claims')) return 'claims';
    if (hash === 'payouts' || path.includes('/payouts')) return 'payouts';
    if (hash === 'global-fund' || path.includes('/global-fund')) return 'global-fund';
    if (hash === 'initiative' || path.includes('/initiative')) return 'initiative';
    return 'mission-home';
  });

  const [testers, setTesters] = useState<Tester[]>([]);
  const [claims, setClaims] = useState<CopyrightClaim[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [royaltyEvents, setRoyaltyEvents] = useState<RoyaltyStreamEvent[]>([]);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null);
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
  const [isCustomBadgeModalOpen, setIsCustomBadgeModalOpen] = useState(false);
  const [isThemeHubModalOpen, setIsThemeHubModalOpen] = useState(false);
  const [isMasterColorStudioOpen, setIsMasterColorStudioOpen] = useState(false);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);
  const [masterStudioInitialTab, setMasterStudioInitialTab] = useState<'colors' | 'logos' | 'api'>('colors');
  const [broadcastInitialApp, setBroadcastInitialApp] = useState<AppName | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isBadgeActive, setIsBadgeActive] = useState<boolean>(() => {
    return localStorage.getItem('human_badge_activated') === 'true' && 
           localStorage.getItem('human_badge_linked') === 'true';
  });

  // URL Popstate Listener
  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (
        path.includes('/copyright-owner') || 
        path.includes('/royalties') || 
        path.includes('/transparency') || 
        path.includes('/portal') || 
        hash === 'portal' || 
        hash === 'royalties' || 
        hash === 'transparency'
      ) {
        setActiveTab('portal');
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'portal') {
      try {
        window.history.pushState({}, '', '/copyright-owner');
      } catch {
        window.location.hash = 'portal';
      }
    } else {
      try {
        window.history.pushState({}, '', '/');
      } catch {
        window.location.hash = tab;
      }
    }
  };

  const loadAllData = useCallback(async () => {
    try {
      testFirestoreConnection().then(conn => setFirestoreConnected(conn));

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
        onSelectTab={handleTabChange}
        totalStreamedUsd={summary.total_streamed_usd}
        isBadgeActive={isBadgeActive}
        onOpenOnboardModal={() => setIsOnboardModalOpen(true)}
        onOpenStripeModal={() => setIsStripeModalOpen(true)}
        onOpenCustomBadgeModal={() => setIsCustomBadgeModalOpen(true)}
        onOpenColorStudio={() => setIsMasterColorStudioOpen(true)}
        onOpenGoogleDriveModal={() => setIsGoogleDriveModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <RefreshCw className="w-8 h-8 text-[#5A5A40] animate-spin" />
            <div className="text-xs font-mono text-[#6A655C]">
              Connecting to The H.U.M.A.N. Initiative Ledger (Powering Ethical AI apps, And Paying the People)...
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {activeTab === 'mission-home' && (
              <PublicMissionWebsite
                onNavigateToRoadmap={() => handleTabChange('roadmap-site')}
                onNavigateToInitiative={() => handleTabChange('initiative')}
                onNavigateToFund={() => handleTabChange('global-fund')}
                onNavigateToCreators={() => handleTabChange('portal')}
                onNavigateToDevelopers={() => handleTabChange('developer-embed')}
              />
            )}

            {activeTab === 'roadmap-site' && (
              <HumanInitiativeRoadmapSite
                onNavigateToTab={(tab) => handleTabChange(tab as ActiveTab)}
              />
            )}

            {activeTab === 'media-hub' && (
              <AppMediaHub
                onNavigateToTab={(tab) => handleTabChange(tab as ActiveTab)}
                onOpenOnboardModal={() => setIsOnboardModalOpen(true)}
              />
            )}

            {activeTab === 'technical-ai' && (
              <TechnicalAiAssessmentPanel />
            )}

            {activeTab === 'crypto-valuation' && (
              <CryptoValuationOptimizer />
            )}

            {activeTab === 'crypto-wallet' && (
              <CryptoTokenWalletSuite />
            )}

            {activeTab === 'global-fund' && (
              <GlobalFundMacroAndBlockchainArchitecture />
            )}

            {activeTab === 'initiative' && (
              <HumanInitiativeMaster
                onNavigateToMerchantPortal={() => handleTabChange('merchants')}
                onNavigateToCreators={() => handleTabChange('portal')}
                onNavigateToDeveloperEmbed={() => handleTabChange('developer-embed')}
                onNavigateToRoadmapSite={() => handleTabChange('roadmap-site')}
              />
            )}

            {activeTab === 'developer-embed' && (
              <DeveloperEmbedKit
                onNavigateToInitiative={() => handleTabChange('initiative')}
                onNavigateToMerchantPortal={() => handleTabChange('merchants')}
                onNavigateToStripeGuide={() => handleTabChange('stripe-guide')}
              />
            )}

            {activeTab === 'stripe-guide' && (
              <StripeIntegrationGuide />
            )}

            {activeTab === 'merchants' && (
              <MerchantStorePortal
                onNavigateToInitiative={() => handleTabChange('initiative')}
              />
            )}

            {activeTab === 'hunter' && (
              <HunterAuthGateway />
            )}

            {activeTab === 'portal' && (
              <CopyrightOwnerWebsite
                claims={claims}
                royaltyEvents={royaltyEvents}
                onRefreshAll={loadAllData}
                onSwitchToAdminTesterConsole={() => handleTabChange('testers')}
                onOpenBadgeModal={() => setIsCustomBadgeModalOpen(true)}
              />
            )}

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
                onNavigateToPayouts={() => setActiveTab('payouts')}
              />
            )}

            {activeTab === 'payouts' && (
              <CreatorPayoutDashboard
                claims={claims}
                royaltyEvents={royaltyEvents}
                onRefresh={loadAllData}
                onOpenStripeSandboxModal={() => setIsStripeModalOpen(true)}
              />
            )}

            {activeTab === 'personas' && (
              <StakeholderPersonas
                isBadgeActive={isBadgeActive}
              />
            )}

            {activeTab === 'badge' && (
              <HumanBadgeWidget 
                isLinked={isBadgeActive}
                isActivated={isBadgeActive}
                onToggleActivation={(linked, activated) => setIsBadgeActive(linked && activated)}
                onNavigateToCopyright={() => handleTabChange('portal')}
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

            {activeTab === 'privacy' && (
              <PrivacyPolicyViewer
                onNavigateToTab={setActiveTab}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E5E0D8] bg-[#F2ECE4] py-8 px-4 text-xs text-[#6A655C] font-mono space-y-6">
        <div className="mx-auto max-w-7xl">
          {/* Footer Verified Ethical Trust Badge */}
          <FooterTrustBadge 
            onOpenBadgeModal={() => setIsCustomBadgeModalOpen(true)}
            onOpenPrivacyModal={() => setActiveTab('privacy')}
            onNavigateToCopyright={() => handleTabChange('portal')}
          />
        </div>

        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E5E0D8]/60">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleTabChange('portal')}
              className="text-left cursor-pointer hover:opacity-85 transition-opacity"
              title="View Copyright Owner & Royalty Landing Page"
            >
              <HumanLogo size="sm" showText={true} />
            </button>
            <span className="text-[#D4CCC1] hidden sm:inline">|</span>
            <span className="text-[#6A655C]">
              Universal Micro-Royalty Initiative & Tester Console
            </span>
            <button
              onClick={() => setActiveTab('privacy')}
              className="text-[#5A5A40] hover:text-[#2D2926] hover:underline font-semibold ml-2 cursor-pointer"
            >
              Privacy Policy & PDF
            </button>
          </div>

          <div className="flex items-center gap-4 text-[#5A5A40] flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] bg-[#EFE9DF] border border-[#DCD3C6]">
              <Database className="w-3 h-3 text-[#5A5A40]" />
              Firestore: {firestoreConnected === true ? <span className="text-[#3D6E50] font-semibold">Active & Synced</span> : firestoreConnected === false ? <span className="text-[#6A655C]">Local Cache / Ready</span> : <span className="text-[#6A655C]">Connecting...</span>}
            </span>
            <span>•</span>
            <span className="font-medium text-[#2D2926]">Powering Ethical AI apps, And Paying the People</span>
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

      <CustomBadgeModal
        isOpen={isCustomBadgeModalOpen}
        onClose={() => setIsCustomBadgeModalOpen(false)}
        onApplyBadge={() => {
          loadAllData();
        }}
      />

      <UniversalThemeHubModal
        isOpen={isThemeHubModalOpen}
        onClose={() => setIsThemeHubModalOpen(false)}
      />

      <MasterAdminColorStudio
        isOpen={isMasterColorStudioOpen}
        initialTab={masterStudioInitialTab}
        onClose={() => setIsMasterColorStudioOpen(false)}
      />

      <GoogleDriveManagerModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        testers={testers}
        claims={claims}
        feedback={feedbackList}
        broadcasts={broadcasts}
        onImportLogoToStudio={(dataUrl, filename) => {
          setMasterStudioInitialTab('logos');
          setIsMasterColorStudioOpen(true);
        }}
      />

      {/* Hideable Side Menu Tool and Task Bar with Light/Dark Settings & Python SDK Console */}
      <SideMenuTaskbar
        onNavigateTab={(tab) => handleTabChange(tab)}
        onOpenStripeModal={() => setIsStripeModalOpen(true)}
        onOpenBadgeModal={() => setIsCustomBadgeModalOpen(true)}
        onOpenOnboardModal={() => setIsOnboardModalOpen(true)}
        onOpenUniversalThemeHub={() => setIsThemeHubModalOpen(true)}
        onOpenMasterColorStudio={() => {
          setMasterStudioInitialTab('colors');
          setIsMasterColorStudioOpen(true);
        }}
        onOpenMasterLogoStudio={() => {
          setMasterStudioInitialTab('logos');
          setIsMasterColorStudioOpen(true);
        }}
        onOpenGoogleDriveModal={() => setIsGoogleDriveModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

