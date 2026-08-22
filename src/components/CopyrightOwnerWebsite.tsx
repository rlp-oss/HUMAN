import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Landmark, 
  Lock, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  FileCheck, 
  BookOpen, 
  Music, 
  Code, 
  Video, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  RefreshCw, 
  Copy, 
  Sliders, 
  Scale, 
  Clock, 
  Search, 
  Globe, 
  Layers, 
  Zap, 
  Key, 
  Fingerprint, 
  FileSpreadsheet,
  UserCheck,
  Building,
  Mail,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CopyrightClaim, 
  RoyaltyStreamEvent, 
  SocietyFundMetrics, 
  AppSubscriptionTally, 
  UnregisteredEscrowClaim, 
  SocietyDistributionRound,
  CreatorAccount,
  DirectMessage,
  MessageThread,
  CopyrightPortalSubPage,
  AssetType
} from '../types';
import { 
  SocietyFundService, 
  CreatorAccountService, 
  DirectMessageService, 
  ClaimService 
} from '../services/api';
import { 
  HumanLogo, 
  HumanInitiativeLogo, 
  TomeCrafterLogoIcon, 
  RlmProStudioLogoIcon, 
  ForgeOsLogoIcon, 
  RlEasyFlowLogoIcon, 
  EmeraldHumanNetworkLogoIcon, 
  MasterHumanBadgeIcon 
} from './HumanLogo';
import { Palette, Award, Compass, BrainCircuit } from 'lucide-react';
import { CustomBadgeConfig, CreatorPathId } from '../types';
import { CreatorPathWalkthrough } from './CreatorPathWalkthrough';
import { CreatorTalentIdentifier } from './CreatorTalentIdentifier';

interface CopyrightOwnerWebsiteProps {
  initialSubPage?: CopyrightPortalSubPage;
  claims: CopyrightClaim[];
  royaltyEvents: RoyaltyStreamEvent[];
  onRefreshAll: () => void;
  onSwitchToAdminTesterConsole: () => void;
  onOpenBadgeModal?: () => void;
}

export const CopyrightOwnerWebsite: React.FC<CopyrightOwnerWebsiteProps> = ({
  initialSubPage = 'home',
  claims,
  royaltyEvents,
  onRefreshAll,
  onSwitchToAdminTesterConsole,
  onOpenBadgeModal,
}) => {
  // Custom Logo & Badge Config State (Synced via localStorage)
  const [customBadgeConfig, setCustomBadgeConfig] = useState<CustomBadgeConfig | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('human_active_custom_badge');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return null;
  });
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('human_active_custom_logo');
    }
    return null;
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      const savedBadge = localStorage.getItem('human_active_custom_badge');
      if (savedBadge) {
        try { setCustomBadgeConfig(JSON.parse(savedBadge)); } catch {}
      }
      const savedLogo = localStorage.getItem('human_active_custom_logo');
      setCustomLogoUrl(savedLogo);
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);
  // Navigation & Sub-Route State
  const [subPage, setSubPage] = useState<CopyrightPortalSubPage>(() => {
    // Check initial path or hash
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    if (path.includes('/royalties') || hash === 'royalties') return 'royalties';
    if (path.includes('/transparency') || hash === 'transparency') return 'transparency';
    if (path.includes('/signup') || hash === 'signup') return 'signup';
    if (path.includes('/signin') || hash === 'signin') return 'signin';
    if (path.includes('/activation') || hash === 'activation') return 'activation';
    if (path.includes('/messages') || hash === 'messages') return 'messages';
    return initialSubPage;
  });

  // Authenticated Creator State
  const [creators, setCreators] = useState<CreatorAccount[]>([]);
  const [currentCreator, setCurrentCreator] = useState<CreatorAccount | null>(null);

  // Society Fund & Telemetry State
  const [metrics, setMetrics] = useState<SocietyFundMetrics | null>(null);
  const [appSubs, setAppSubs] = useState<AppSubscriptionTally[]>([]);
  const [unregisteredEscrow, setUnregisteredEscrow] = useState<UnregisteredEscrowClaim[]>([]);
  const [distributionRounds, setDistributionRounds] = useState<SocietyDistributionRound[]>([]);

  // Direct Messaging State
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('thread_001');
  const [activeMessages, setActiveMessages] = useState<DirectMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);
  const [newThreadSubject, setNewThreadSubject] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState<'Royalty Payout' | 'C2PA Claim' | 'Activation' | 'General Inquiry' | 'Dispute'>('Royalty Payout');

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCategory, setSignupCategory] = useState<AssetType>('Book / Literature');
  const [signupWorkTitle, setSignupWorkTitle] = useState('');
  const [signupStripeAccount, setSignupStripeAccount] = useState('');
  const [signupBio, setSignupBio] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Activation & Claim State
  const [claimingEscrowItem, setClaimingEscrowItem] = useState<UnregisteredEscrowClaim | null>(null);
  const [claimNameInput, setClaimNameInput] = useState('');
  const [claimEmailInput, setClaimEmailInput] = useState('');
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);

  // Transparency JSON Inspector State
  const [selectedAppInspect, setSelectedAppInspect] = useState<string>('tomecrafter-ai-book-studio');
  const [isCopiedUrl, setIsCopiedUrl] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load All Data
  const loadData = async () => {
    try {
      const [m, apps, escrow, rounds, creatorList, messageThreads] = await Promise.all([
        SocietyFundService.getMetrics(),
        SocietyFundService.getAppSubscriptions(),
        SocietyFundService.getUnregisteredEscrow(),
        SocietyFundService.getDistributionRounds(),
        CreatorAccountService.getCreators(),
        DirectMessageService.getThreads(),
      ]);
      setMetrics(m);
      setAppSubs(apps);
      setUnregisteredEscrow(escrow);
      setDistributionRounds(rounds);
      setCreators(creatorList);
      if (!currentCreator && creatorList.length > 0) {
        setCurrentCreator(creatorList[0]);
      }
      setThreads(messageThreads);
      if (messageThreads.length > 0 && !activeThreadId) {
        setActiveThreadId(messageThreads[0].id);
      }
    } catch (e) {
      console.error('Error loading portal data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update browser URL on subpage change to provide separate URLs
  const navigateTo = (page: CopyrightPortalSubPage) => {
    setSubPage(page);
    let targetPath = '/copyright-owner';
    if (page === 'royalties') targetPath = '/royalties';
    else if (page === 'transparency') targetPath = '/transparency';
    else if (page !== 'home') targetPath = `/copyright-owner/${page}`;

    try {
      window.history.pushState({ page }, '', targetPath);
    } catch {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync back/forward browser buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (path.includes('/royalties') || hash === 'royalties') setSubPage('royalties');
      else if (path.includes('/transparency') || hash === 'transparency') setSubPage('transparency');
      else if (path.includes('/signup') || hash === 'signup') setSubPage('signup');
      else if (path.includes('/signin') || hash === 'signin') setSubPage('signin');
      else if (path.includes('/activation') || hash === 'activation') setSubPage('activation');
      else if (path.includes('/messages') || hash === 'messages') setSubPage('messages');
      else setSubPage('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load messages when activeThreadId changes
  useEffect(() => {
    if (activeThreadId) {
      DirectMessageService.getMessagesByThread(activeThreadId).then(msgs => {
        setActiveMessages(msgs);
      });
    }
  }, [activeThreadId]);

  const handleCopyUrl = (customPath?: string) => {
    let url = window.location.origin + '/copyright-owner';
    if (customPath === 'royalties' || subPage === 'royalties') url = window.location.origin + '/royalties';
    else if (customPath === 'transparency' || subPage === 'transparency') url = window.location.origin + '/transparency';
    else if (customPath && customPath !== 'home') url = `${window.location.origin}/copyright-owner/${customPath}`;
    else if (subPage !== 'home') url = `${window.location.origin}/copyright-owner/${subPage}`;

    navigator.clipboard.writeText(url);
    setIsCopiedUrl(true);
    setTimeout(() => setIsCopiedUrl(false), 2500);
  };

  // Sign Up Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) return;

    setIsSigningUp(true);
    try {
      const newCreator = await CreatorAccountService.registerCreator({
        name: signupName,
        email: signupEmail,
        category: signupCategory,
        stripeAccountId: signupStripeAccount || `acct_1NZ${Math.random().toString(36).substring(2, 8)}`,
        workTitle: signupWorkTitle,
        bio: signupBio,
      });

      // If work title provided, create a verified claim too
      if (signupWorkTitle) {
        await ClaimService.addClaim({
          title: signupWorkTitle,
          creator_name: signupName,
          creator_email: signupEmail,
          asset_type: signupCategory,
          repository_or_source: 'Copyright Owner Royalty Portal Direct Onboarding',
          evidence_description: `Direct Registration on The H.U.M.A.N. Initiative. C2PA DID: ${newCreator.c2pa_did}`,
          confidence_score: 99,
          attribution_share_bps: 350,
          micro_rate_usd: '$0.0035 per synthesis',
          bank_connected: true,
          stripe_account_id: newCreator.stripe_account_id,
          payout_balance_usd: 424.48,
          status: 'Verified',
        });
      }

      // Auto-send welcome direct message thread
      await DirectMessageService.createNewThread({
        creatorName: signupName,
        creatorEmail: signupEmail,
        subject: 'Welcome to The H.U.M.A.N. Initiative 40% Subscription Royalty Covenant!',
        messageText: `Welcome ${signupName}! Your account has been provisioned with C2PA DID ${newCreator.c2pa_did} and linked to Stripe Connect (${newCreator.stripe_account_id}). Exactly 40% of all ecosystem subscriptions are being tallied for your works.`,
        category: 'Activation',
        workReference: signupWorkTitle || 'Universal Human Catalog',
      });

      setCurrentCreator(newCreator);
      await loadData();
      onRefreshAll();

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#5A5A40', '#3D6E50', '#D67D5C'],
      });

      setToastMsg(`🎉 Welcome, ${newCreator.name}! Your Copyright Account is active with 40% subscription royalty auto-routing.`);
      navigateTo('signin');
      setTimeout(() => setToastMsg(null), 7000);
    } catch (err: any) {
      alert('Sign up failed: ' + err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  // Escrow Claim Release
  const handleRegisterAndClaimEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingEscrowItem || !claimNameInput || !claimEmailInput) return;

    setIsClaimSubmitting(true);
    try {
      const res = await SocietyFundService.registerAndClaimEscrow(
        claimingEscrowItem.id,
        claimNameInput,
        claimEmailInput
      );

      // Create a notification thread
      await DirectMessageService.createNewThread({
        creatorName: claimNameInput,
        creatorEmail: claimEmailInput,
        subject: `Holding Escrow Claimed: ${claimingEscrowItem.work_title}`,
        messageText: `Congratulations! Your claim for "${claimingEscrowItem.work_title}" has been verified. The holding balance of $${res.claimedAmount.toFixed(2)} has been released directly into your Stripe Connect balance.`,
        category: 'Activation',
        workReference: claimingEscrowItem.work_title,
      });

      setClaimingEscrowItem(null);
      setClaimNameInput('');
      setClaimEmailInput('');
      await loadData();
      onRefreshAll();

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3D6E50', '#D67D5C', '#5A5A40'],
      });

      setToastMsg(`✅ Escrow Released! $${res.claimedAmount.toFixed(2)} has been credited to ${claimNameInput}'s Stripe Connect balance.`);
      setTimeout(() => setToastMsg(null), 6000);
    } catch (err: any) {
      alert('Escrow claim failed: ' + err.message);
    } finally {
      setIsClaimSubmitting(false);
    }
  };

  // Send Direct Message Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    const currentThread = threads.find(t => t.id === activeThreadId);
    if (!currentThread) return;

    setIsSendingMessage(true);
    try {
      const senderName = currentCreator ? currentCreator.name : 'Verified Creator';
      const senderEmail = currentCreator ? currentCreator.email : currentThread.creator_email;

      await DirectMessageService.sendMessage({
        threadId: activeThreadId,
        senderType: 'creator',
        senderName,
        senderEmail,
        recipientName: 'The H.U.M.A.N. Initiative Steward',
        recipientEmail: 'stewards@humanethical.ai',
        subject: currentThread.subject,
        messageText: replyText,
        category: currentThread.category,
        workReference: currentThread.work_title,
      });

      setReplyText('');
      const updatedMsgs = await DirectMessageService.getMessagesByThread(activeThreadId);
      setActiveMessages(updatedMsgs);
      const updatedThreads = await DirectMessageService.getThreads();
      setThreads(updatedThreads);

      // Trigger automatic steward auto-response for realistic direct communication
      setTimeout(async () => {
        await DirectMessageService.sendMessage({
          threadId: activeThreadId,
          senderType: 'admin',
          senderName: 'The H.U.M.A.N. Initiative Steward',
          senderEmail: 'stewards@humanethical.ai',
          recipientName: senderName,
          recipientEmail: senderEmail,
          subject: `Re: ${currentThread.subject}`,
          messageText: `Thank you for your message, ${senderName.split(' ')[0]}. Your inquiry regarding "${currentThread.work_title || 'Attributed Work'}" has been logged in our immutable audit records (C2PA seal 0x${Math.random().toString(16).substring(2, 10)}). We are reviewing the telemetry.`,
          category: currentThread.category,
          workReference: currentThread.work_title,
        });
        const freshMsgs = await DirectMessageService.getMessagesByThread(activeThreadId);
        setActiveMessages(freshMsgs);
      }, 1200);

    } catch (e: any) {
      alert('Error sending message: ' + e.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Create New Message Thread
  const handleCreateNewThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadSubject || !newThreadBody) return;

    const senderName = currentCreator ? currentCreator.name : 'Verified Creator';
    const senderEmail = currentCreator ? currentCreator.email : 'creator@openrights.org';

    try {
      const { thread } = await DirectMessageService.createNewThread({
        creatorName: senderName,
        creatorEmail: senderEmail,
        subject: newThreadSubject,
        messageText: newThreadBody,
        category: newThreadCategory,
        workReference: currentCreator?.bio?.substring(0, 30) || 'Registered Intellectual Property',
      });

      setIsNewThreadModalOpen(false);
      setNewThreadSubject('');
      setNewThreadBody('');
      await loadData();
      setActiveThreadId(thread.id);
      setToastMsg(`Message thread "${newThreadSubject}" created.`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      alert('Failed to start thread: ' + err.message);
    }
  };

  const fundTotal = metrics?.total_society_fund_usd || 76408.00;
  const grossMRR = metrics?.total_subscription_revenue_usd || 191020.00;
  const totalSubs = metrics?.total_active_subscribers || 4080;
  const holdingEscrow = metrics?.unallocated_holding_escrow_usd || 14280.00;
  const perCreatorEst = metrics?.estimated_payout_per_registered_creator || 424.48;

  const currentThread = threads.find(t => t.id === activeThreadId);

  // Dynamic Current URL Display
  const getCurrentUrlPath = () => {
    if (subPage === 'royalties') return '/royalties';
    if (subPage === 'transparency') return '/transparency';
    if (subPage === 'home') return '/copyright-owner';
    return `/copyright-owner/${subPage}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-[#EBF3ED] border-2 border-[#3D6E50]/40 text-[#2D2926] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#3D6E50] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{toastMsg}</span>
          </div>
          <button 
            onClick={() => setToastMsg(null)}
            className="text-xs font-mono text-[#6A655C] hover:text-[#2D2926] p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* DEDICATED COPYRIGHT OWNER WEBSITE TOP HEADER & URL BAR */}
      <header className="rounded-2xl border-2 border-[#5A5A40]/30 bg-[#FFFFFF] shadow-sm overflow-hidden">
        {/* Top URL Breadcrumb & Share Strip */}
        <div className="bg-[#F2ECE4] px-4 sm:px-6 py-2.5 border-b border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3D6E50] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3D6E50]"></span>
            </span>
            <span className="text-[#6A655C]">Active Live Portal URL:</span>
            <code className="bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#DCD5CA] text-[#3D6E50] font-bold select-all">
              {typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-xbevwyvcnsn355pwprt5ih-321940249756.us-east1.run.app'}{getCurrentUrlPath()}
            </code>
          </div>

          <div className="flex items-center gap-3">
            {onOpenBadgeModal && (
              <button
                onClick={onOpenBadgeModal}
                className="px-3 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#5A5A40]/40 text-[#5A5A40] hover:text-[#2D2926] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs font-sans font-semibold"
                title="Upload custom logo & configure official badge"
              >
                <Palette className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Upload Logo & Badge</span>
              </button>
            )}

            <button
              onClick={() => handleCopyUrl()}
              className="px-3 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-[#5A5A40] hover:text-[#2D2926] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs font-sans font-semibold"
              title="Copy active live URL to clipboard"
            >
              {isCopiedUrl ? <Check className="w-3.5 h-3.5 text-[#3D6E50]" /> : <Copy className="w-3.5 h-3.5 text-[#5A5A40]" />}
              <span>{isCopiedUrl ? 'Copied Live URL!' : 'Copy Live Link'}</span>
            </button>

            <a
              href={`${typeof window !== 'undefined' ? window.location.origin : ''}${getCurrentUrlPath()}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-lg bg-[#EBF3ED] hover:bg-[#DEECE1] border border-[#C9D1BE] text-[#3D6E50] font-sans font-semibold flex items-center gap-1.5 transition-all"
              title="Open direct live link in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#3D6E50]" />
              <span>Open in New Tab</span>
            </a>

            <button
              onClick={onSwitchToAdminTesterConsole}
              className="px-3 py-1 rounded-lg bg-[#FAF0EC] hover:bg-[#F5E2DA] border border-[#EECDBC] text-[#D67D5C] font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#D67D5C]" />
              <span>Switch to Admin CRM</span>
            </button>
          </div>
        </div>

        {/* Live URL Helper Notice */}
        <div className="bg-[#FAF8F5] px-4 sm:px-6 py-2 border-b border-[#E5E0D8] flex items-center justify-between text-[11px] text-[#6A655C]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#2D2926]">💡 Note for Mobile & External Browsers:</span>
            <span>Use your live Cloud Run URL above (not the sample domain name <code className="bg-[#FFFFFF] px-1 py-0.5 rounded border border-[#E5E0D8] text-[#8C857B]">humanethical.ai</code> unless configured in your DNS).</span>
          </div>
          <span className="hidden md:inline-block font-mono text-[#3D6E50]">● Server Online & Routing Active</span>
        </div>

        {/* Dedicated Portal Brand & Nav Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-[#DCD5CA] bg-white p-1 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              {customLogoUrl ? (
                <img 
                  src={customLogoUrl} 
                  alt="Custom App Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : customBadgeConfig?.logoVariant === 'rlm-pro-studio' ? (
                <RlmProStudioLogoIcon size={38} />
              ) : customBadgeConfig?.logoVariant === 'forgeos' ? (
                <ForgeOsLogoIcon size={38} />
              ) : customBadgeConfig?.logoVariant === 'rl-easy-flow' ? (
                <RlEasyFlowLogoIcon size={38} />
              ) : (
                <TomeCrafterLogoIcon size={38} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2D2926] tracking-tight">
                  {customBadgeConfig?.appName ? `${customBadgeConfig.appName} Copyright & Royalty Portal` : 'H.U.M.A.N. Copyright & Royalty Portal'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF0EC] text-[#D67D5C] border border-[#EECDBC]">
                  40% Split Direct
                </span>
                {customBadgeConfig?.isOfficialVerified && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]">
                    <CheckCircle2 className="w-3 h-3 text-[#3D6E50]" />
                    Official Badge Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6A655C]">
                {customBadgeConfig?.tagline || 'Official Royalty Sign-Up, Activation, Distribution & Direct Messaging Network for Creators'}
              </p>
            </div>
          </div>

          {/* Active Creator Account Pill */}
          <div className="flex items-center gap-3 bg-[#FAF8F5] p-2 rounded-xl border border-[#E5E0D8] self-start lg:self-auto">
            {currentCreator ? (
              <div className="flex items-center gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white font-bold flex items-center justify-center text-xs">
                  {currentCreator.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#2D2926] flex items-center gap-1.5">
                    <span>{currentCreator.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE] font-mono">
                      Verified
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#6A655C]">
                    {currentCreator.category} • Balance: <strong className="text-[#3D6E50]">${currentCreator.available_balance_usd.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#6A655C]">
                Not signed in • <button onClick={() => navigateTo('signin')} className="text-[#5A5A40] font-bold underline cursor-pointer">Sign In</button>
              </div>
            )}
          </div>
        </div>

        {/* Sub-Navigation Links with URL Sync */}
        <nav className="flex items-center gap-1 px-4 sm:px-6 py-2 overflow-x-auto bg-[#FAF8F5] text-xs font-mono">
          <button
            onClick={() => navigateTo('home')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'home'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Portal Home (/copyright-owner)</span>
          </button>

          <button
            onClick={() => navigateTo('path-walkthrough')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'path-walkthrough'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Creator Pathways</span>
          </button>

          <button
            onClick={() => navigateTo('talent-identifier')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'talent-identifier'
                ? 'bg-[#D67D5C] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Talent Identifier (AI-Proof)</span>
          </button>

          <button
            onClick={() => navigateTo('signup')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'signup'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Sign Up (/signup)</span>
          </button>

          <button
            onClick={() => navigateTo('signin')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'signin'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In & Dashboard (/signin)</span>
          </button>

          <button
            onClick={() => navigateTo('royalties')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'royalties'
                ? 'bg-[#3D6E50] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Royalties Distribution (/royalties)</span>
          </button>

          <button
            onClick={() => navigateTo('transparency')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'transparency'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Full Transparency (/transparency)</span>
          </button>

          <button
            onClick={() => navigateTo('activation')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'activation'
                ? 'bg-[#D67D5C] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Work Activation & Escrow</span>
          </button>

          <button
            onClick={() => navigateTo('messages')}
            className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              subPage === 'messages'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Messages</span>
            {threads.reduce((acc, t) => acc + t.unread_count, 0) > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D67D5C] text-white text-[9px] font-bold">
                {threads.reduce((acc, t) => acc + t.unread_count, 0)}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* SUBPAGE 1: PORTAL HOME (/copyright-owner) */}
      {/* ========================================================================= */}
      {subPage === 'home' && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Hero */}
          <div className="rounded-3xl border border-[#E5E0D8] bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F5] to-[#F2ECE4] p-8 sm:p-12 space-y-8 relative overflow-hidden shadow-sm">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#5A5A40]/30 text-xs font-mono font-bold text-[#5A5A40]">
                <Scale className="w-4 h-4 text-[#5A5A40]" />
                <span>The Global Copyright Protection & Micro-Patronage Standard</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2D2926] tracking-tight leading-tight">
                Where Human Creativity Collects <span className="text-[#3D6E50]">40% of AI Subscriptions</span>
              </h2>

              <p className="text-base sm:text-lg text-[#6A655C] leading-relaxed">
                Welcome to the dedicated portal for Authors, Musicians, Open-Source Programmers, and Visual Artists. When AI applications build on your work, 40% of all subscription revenue is automatically routed to our non-profit Society Fund in Stripe Connect and paid directly to verified creators.
              </p>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('signup')}
                  className="px-6 py-3.5 rounded-2xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Key className="w-4 h-4 text-white" />
                  <span>Register as Copyright Owner</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={() => navigateTo('royalties')}
                  className="px-6 py-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-sm font-bold text-[#5A5A40] flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-[#3D6E50]" />
                  <span>View Royalties Distribution Hub</span>
                </button>

                <button
                  onClick={() => navigateTo('activation')}
                  className="px-5 py-3.5 rounded-2xl bg-[#FAF0EC] hover:bg-[#F5E2DA] border border-[#EECDBC] text-sm font-bold text-[#D67D5C] flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#D67D5C]" />
                  <span>Claim Holding Escrow (${holdingEscrow.toLocaleString('en-US', { minimumFractionDigits: 0 })})</span>
                </button>
              </div>
            </div>

            {/* Quick Live Telemetry Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E5E0D8]">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#8C857B] uppercase block">Current 40% Fund</span>
                <div className="text-xl sm:text-2xl font-bold text-[#5A5A40]">${fundTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-[10px] font-mono text-[#3D6E50]">Auto-Split in Stripe</div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#8C857B] uppercase block">Active Subscribers</span>
                <div className="text-xl sm:text-2xl font-bold text-[#2D2926]">{totalSubs.toLocaleString()} paying users</div>
                <div className="text-[10px] font-mono text-[#6A655C]">Across 4 Flagship Apps</div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#8C857B] uppercase block">Est. Payout / Creator</span>
                <div className="text-xl sm:text-2xl font-bold text-[#3D6E50]">${perCreatorEst.toFixed(2)}/mo</div>
                <div className="text-[10px] font-mono text-[#5A5A40]">180 Registered Creators</div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#8C857B] uppercase block">Unallocated Escrow</span>
                <div className="text-xl sm:text-2xl font-bold text-[#D67D5C]">${holdingEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-[10px] font-mono text-indigo-700 underline cursor-pointer" onClick={() => navigateTo('activation')}>
                  Claim Unregistered Works
                </div>
              </div>
            </div>
          </div>

          {/* Creator Pathway & Talent Identifier Feature Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border-2 border-[#5A5A40]/30 bg-gradient-to-br from-[#FAF8F5] to-[#FFFFFF] p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5A5A40] font-bold">
                <Compass className="w-4 h-4 text-[#5A5A40]" />
                <span>Interactive Pathway Walkthrough</span>
              </div>
              <h3 className="text-xl font-bold text-[#2D2926]">
                Choose Your Creator Path & Start Earning
              </h3>
              <p className="text-xs text-[#6A655C] leading-relaxed">
                Step-by-step guidance across Prose & Worldbuilding, Sonic & Timbre, Cleanroom Code, and Visual Vectors. Complete milestones, estimate monthly royalties, and bind your works to the 40% Society Fund.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigateTo('path-walkthrough')}
                  className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Start Pathway Walkthrough</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-[#D67D5C]/40 bg-gradient-to-br from-[#FAF0EC] to-[#FFFFFF] p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D67D5C] font-bold">
                <BrainCircuit className="w-4 h-4 text-[#D67D5C]" />
                <span>AI-Proof Talent Identifier</span>
              </div>
              <h3 className="text-xl font-bold text-[#2D2926]">
                Discover Your Hidden Creative Superpowers
              </h3>
              <p className="text-xs text-[#6A655C] leading-relaxed">
                5 deep probing questions designed specifically to unlock the unique human craft qualities, sensory instincts, and aesthetic judgment that artificial intelligence can never replicate.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigateTo('talent-identifier')}
                  className="px-4 py-2.5 rounded-xl bg-[#D67D5C] hover:bg-[#C06B4C] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Take Talent Diagnostic</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Core Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-3 shadow-2xs hover:border-[#DCD5CA] transition-all">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] w-fit">
                <Landmark className="w-6 h-6 text-[#5A5A40]" />
              </div>
              <h3 className="text-base font-bold text-[#2D2926]">1. Guaranteed 40% Subscription Royalty</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed">
                40% of every subscription paid across all apps carrying the H.U.M.A.N. badge is intercepted in Stripe and distributed to registered rights holders.
              </p>
              <button onClick={() => navigateTo('royalties')} className="text-xs font-mono text-[#5A5A40] font-bold flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>Explore Royalty Mechanics</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-3 shadow-2xs hover:border-[#DCD5CA] transition-all">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] w-fit">
                <ShieldCheck className="w-6 h-6 text-[#3D6E50]" />
              </div>
              <h3 className="text-base font-bold text-[#2D2926]">2. C2PA & Fairly Trained Transparency</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed">
                Zero black-box training. Every synthesis is signed with C2PA Content Credentials and Story Protocol programmable IP licenses with public audit trails.
              </p>
              <button onClick={() => navigateTo('transparency')} className="text-xs font-mono text-[#3D6E50] font-bold flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>Audit C2PA Manifests</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-3 shadow-2xs hover:border-[#DCD5CA] transition-all">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] w-fit">
                <MessageSquare className="w-6 h-6 text-[#D67D5C]" />
              </div>
              <h3 className="text-base font-bold text-[#2D2926]">3. Direct Creator-Steward Messaging</h3>
              <p className="text-xs text-[#6A655C] leading-relaxed">
                Direct two-way communication channels between rights holders and initiative stewards for rapid dispute resolution, claim inquiries, and disbursement receipts.
              </p>
              <button onClick={() => navigateTo('messages')} className="text-xs font-mono text-[#D67D5C] font-bold flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>Open Direct Messages</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 2: SIGN UP (/copyright-owner/signup) */}
      {/* ========================================================================= */}
      {subPage === 'signup' && (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-8 space-y-6 shadow-sm">
            <div className="space-y-2 border-b border-[#E5E0D8] pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/30 text-xs font-mono text-[#5A5A40] font-bold">
                <Key className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Dedicated Creator Registration URL: /copyright-owner/signup</span>
              </div>
              <h2 className="text-2xl font-bold text-[#2D2926]">Register as a Verified Copyright Owner</h2>
              <p className="text-xs text-[#6A655C] leading-relaxed">
                Connect your intellectual property to The H.U.M.A.N. Initiative to instantly receive 40% subscription splits and claim holding escrow funds.
              </p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                    Legal / Creator Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Pendelton or Studio Audio LLC"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                    Payout Email (Stripe Connect) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="creator@estate.org"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                    Primary Creative Category
                  </label>
                  <select
                    value={signupCategory}
                    onChange={(e) => setSignupCategory(e.target.value as AssetType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="Book / Literature">Book / Literature (e.g. Tome Crafter)</option>
                    <option value="Music / Audio">Music / Audio (e.g. RLM Pro Studio)</option>
                    <option value="Code Library">Code Library / AST (e.g. ForgeOS App Builders)</option>
                    <option value="Visual Art">Visual Art (e.g. RL Easy Flow)</option>
                    <option value="Scientific Algorithm">Scientific Algorithm / Weights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                    Initial Work / Asset Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Complete Narrative Drafting Engine"
                    value={signupWorkTitle}
                    onChange={(e) => setSignupWorkTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                  Optional Existing Stripe Connect Account ID
                </label>
                <input
                  type="text"
                  placeholder="acct_1NZ... (Leave blank to auto-provision in sandbox)"
                  value={signupStripeAccount}
                  onChange={(e) => setSignupStripeAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                  Creator Biography / Rights Statement
                </label>
                <textarea
                  rows={3}
                  placeholder="Author or collective holding commercial rights and registering for the 40% subscription pool..."
                  value={signupBio}
                  onChange={(e) => setSignupBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs space-y-2 text-[#6A655C]">
                <div className="flex items-center gap-2 font-bold text-[#2D2926]">
                  <ShieldCheck className="w-4 h-4 text-[#3D6E50]" />
                  <span>The H.U.M.A.N. Creator Guarantee:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li>Instant C2PA Decentralized Identifier (DID) cryptographic minting.</li>
                  <li>Immediate eligibility for the bi-monthly 40% Society Fund batch payout.</li>
                  <li>Zero-Ingestion AI Cleanroom compliance audited against Fairly Trained standards.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => navigateTo('signin')}
                  className="text-xs font-mono text-[#5A5A40] hover:underline cursor-pointer"
                >
                  Already registered? Switch to Sign In →
                </button>

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="px-6 py-3 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSigningUp ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      <span>Provisioning C2PA DID & Stripe Account...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Complete Registration & Activate 40% Split</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 3: SIGN IN & CREATOR DASHBOARD (/copyright-owner/signin) */}
      {/* ========================================================================= */}
      {subPage === 'signin' && (
        <div className="space-y-6 animate-fade-in">
          {/* Creator Persona Switcher */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2D2926]">Select Authenticated Creator Account</h3>
                <p className="text-xs text-[#6A655C]">
                  Switch between registered copyright holder profiles to inspect personalized Stripe Connect balances and direct messages.
                </p>
              </div>
              <button
                onClick={() => navigateTo('signup')}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] font-bold self-start sm:self-auto cursor-pointer"
              >
                + Register New Account
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {creators.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCurrentCreator(c)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer space-y-2 ${
                    currentCreator?.id === c.id
                      ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-sm ring-2 ring-[#5A5A40]/20'
                      : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#5A5A40] border border-[#E5E0D8] font-bold">
                      {c.category}
                    </span>
                    {currentCreator?.id === c.id && (
                      <span className="flex h-2 w-2 rounded-full bg-[#3D6E50]"></span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-[#2D2926]">{c.name}</div>
                  <div className="text-[11px] font-mono text-[#6A655C] truncate">{c.email}</div>
                  <div className="text-[10px] font-mono text-[#3D6E50] font-semibold pt-1 border-t border-[#E5E0D8]">
                    Balance: ${c.available_balance_usd.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Creator Personal Dashboard */}
          {currentCreator && (
            <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#2D2926]">{currentCreator.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]">
                      Stripe Connect: {currentCreator.stripe_status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6A655C]">{currentCreator.bio}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('royalties')}
                    className="px-4 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold shadow-2xs hover:bg-[#4A4A33] transition-all cursor-pointer"
                  >
                    View Royalties Hub
                  </button>
                  <button
                    onClick={() => navigateTo('messages')}
                    className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-bold text-[#5A5A40] hover:bg-[#F2ECE4] transition-all cursor-pointer"
                  >
                    Direct Messages
                  </button>
                </div>
              </div>

              {/* 4 Personal Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <span className="text-[10px] font-mono text-[#8C857B] uppercase block">Available Balance</span>
                  <div className="text-2xl font-bold text-[#3D6E50]">${currentCreator.available_balance_usd.toFixed(2)}</div>
                  <span className="text-[10px] text-[#6A655C]">Ready for Instant Transfer</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <span className="text-[10px] font-mono text-[#8C857B] uppercase block">Total Lifetime Earned</span>
                  <div className="text-2xl font-bold text-[#2D2926]">${currentCreator.total_earned_usd.toFixed(2)}</div>
                  <span className="text-[10px] text-[#5A5A40]">40% Society Pool</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <span className="text-[10px] font-mono text-[#8C857B] uppercase block">Registered Works</span>
                  <div className="text-2xl font-bold text-[#5A5A40]">{currentCreator.registered_works_count} assets</div>
                  <span className="text-[10px] text-[#6A655C]">Signed with C2PA</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <span className="text-[10px] font-mono text-[#8C857B] uppercase block">C2PA DID Identity</span>
                  <div className="text-xs font-mono text-[#2D2926] truncate" title={currentCreator.c2pa_did}>
                    {currentCreator.c2pa_did}
                  </div>
                  <span className="text-[10px] text-[#3D6E50]">Cryptographically Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 4: ROYALTIES DISTRIBUTION HUB (/royalties) */}
      {/* ========================================================================= */}
      {subPage === 'royalties' && (
        <div className="space-y-8 animate-fade-in">
          {/* Hero Banner with URL Tag */}
          <div className="rounded-2xl border-2 border-[#3D6E50]/40 bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3ED] border border-[#C9D1BE] text-xs font-mono text-[#3D6E50] font-bold">
                  <DollarSign className="w-3.5 h-3.5 text-[#3D6E50]" />
                  <span>Dedicated Royalties URL: /royalties</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] tracking-tight">
                  40% Subscription Royalties Distribution Covenant
                </h2>
                <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed">
                  Every subscription across Tome Crafter, RLM Pro Studio, ForgeOS App Builders, and RL Easy Flow contributes 40% into the non-profit Society Fund. Payouts are computed dynamically based on total active subscriber tallies and disbursed directly via Stripe Connect.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleCopyUrl('royalties')}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Share /royalties URL</span>
                </button>
              </div>
            </div>

            {/* 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">Gross MRR</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#2D2926]">${grossMRR.toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
                <span className="text-[10px] font-mono text-[#6A655C] block pt-1 border-t border-[#E5E0D8]">Across 4 Flagship Apps</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">40% Society Fund Pool</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#3D6E50]">${fundTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <span className="text-[10px] font-mono text-[#3D6E50] block pt-1 border-t border-[#E5E0D8]">Stripe Connect Non-Profit</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">Total Paying Subscribers</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#5A5A40]">{totalSubs.toLocaleString()} active</div>
                <span className="text-[10px] font-mono text-[#6A655C] block pt-1 border-t border-[#E5E0D8]">Yield: $18.73 / subscriber</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">Est. Per-Creator Payout</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#D67D5C]">${perCreatorEst.toFixed(2)}/mo</div>
                <span className="text-[10px] font-mono text-[#D67D5C] block pt-1 border-t border-[#E5E0D8]">180 Registered Creators</span>
              </div>
            </div>
          </div>

          {/* App Subscription Matrix */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-4 shadow-2xs">
            <h3 className="text-base font-bold text-[#2D2926]">Fleet Applications Contributing 40% Subscription Revenue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appSubs.map((app) => (
                <div key={app.app_id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#2D2926]">{app.app_name}</h4>
                    <span className="text-xs font-mono font-bold text-[#3D6E50]">40% Split: ${app.society_fund_40pct_contribution.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-xs font-mono text-[#6A655C] space-y-1">
                    <div>Subscribers: <strong className="text-[#2D2926]">{app.subscribers_count.toLocaleString()}</strong> @ ${app.plan_price_monthly.toFixed(0)}/mo</div>
                    <div>Gross MRR: <strong className="text-[#2D2926]">${app.gross_monthly_mrr.toLocaleString('en-US', { minimumFractionDigits: 0 })}</strong></div>
                    <div>C2PA Audit ID: <code>{app.c2pa_audit_id}</code></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution Rounds History */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="text-base font-bold text-[#2D2926]">Bi-Monthly Distribution Rounds</h3>
              <span className="text-xs font-mono text-[#6A655C]">Automated Stripe Connect Batch Rails</span>
            </div>

            <div className="space-y-3">
              {distributionRounds.map((round) => (
                <div key={round.round_id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        round.status === 'Completed' ? 'bg-[#EBF3ED] text-[#3D6E50]' : 'bg-[#FFF8E7] text-[#B45309]'
                      }`}>
                        {round.status}
                      </span>
                      <span className="text-xs font-bold text-[#2D2926]">{round.timestamp}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#6A655C]">
                      Batch ID: <code>{round.stripe_batch_id}</code> • Audit Seal: <code>{round.c2pa_audit_seal}</code>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#8C857B] block">Paying Subscribers</span>
                      <strong className="text-[#2D2926]">{round.subscribers_at_execution.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C857B] block">Total Disbursed</span>
                      <strong className="text-[#3D6E50] font-bold">${round.total_distributed_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 5: FULL TRANSPARENCY & C2PA AUDIT EXPLORER (/transparency) */}
      {/* ========================================================================= */}
      {subPage === 'transparency' && (
        <div className="space-y-8 animate-fade-in">
          <div className="rounded-2xl border-2 border-[#5A5A40]/30 bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/30 text-xs font-mono text-[#5A5A40] font-bold">
                  <Scale className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Dedicated Transparency URL: /transparency</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] tracking-tight">
                  Full Ecosystem Transparency & Cryptographic Audit Explorer
                </h2>
                <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed">
                  Every inference, prompt, and subscription disbursement on The H.U.M.A.N. Initiative is cryptographically signed using C2PA Content Credentials 2.1, Fairly Trained ethics certifications, and Story Protocol programmable IP assets.
                </p>
              </div>

              <button
                onClick={() => handleCopyUrl('transparency')}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] flex items-center gap-1.5 cursor-pointer self-start lg:self-auto"
              >
                <Share2 className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Share /transparency URL</span>
              </button>
            </div>

            {/* 4 Pillars of Transparency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#8C857B] font-bold">1. Fairly Trained Ethics</div>
                <div className="text-xs font-bold text-[#3D6E50]">Certified Cleanroom v2</div>
                <p className="text-[11px] text-[#6A655C]">Zero unlicensed data in model weights.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#8C857B] font-bold">2. C2PA JUMBF Manifests</div>
                <div className="text-xs font-bold text-[#5A5A40]">Standard 2.1 Compliant</div>
                <p className="text-[11px] text-[#6A655C]">Cryptographic tamper-evident seals.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#8C857B] font-bold">3. Story Protocol IP</div>
                <div className="text-xs font-bold text-indigo-700">ERC-6551 Token Accounts</div>
                <p className="text-[11px] text-[#6A655C]">Programmable IP licensing terms.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#8C857B] font-bold">4. 40% Stripe Split</div>
                <div className="text-xs font-bold text-[#D67D5C]">Non-Profit Society Fund</div>
                <p className="text-[11px] text-[#6A655C]">Direct-to-bank instant transfers.</p>
              </div>
            </div>
          </div>

          {/* Interactive C2PA Manifest Inspector */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2D2926]">Live C2PA Cryptographic Manifest Inspector</h3>
                <p className="text-xs text-[#6A655C]">Inspect verifiable JSON-LD provenance assertions served live from /api/c2pa/manifest/:appId</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAppInspect}
                  onChange={(e) => setSelectedAppInspect(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#2D2926] focus:outline-none"
                >
                  <option value="tomecrafter-ai-book-studio">Tome Crafter</option>
                  <option value="remix-lyria-studio-5954">RLM Pro Studio</option>
                  <option value="forgeos-app-builder-tester">ForgeOS App Builders</option>
                  <option value="rl-easy-flow">RL Easy Flow</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2D2926] text-emerald-400 text-xs font-mono overflow-x-auto">
              <pre>{JSON.stringify({
                "@context": "https://c2pa.org/specifications/v2/context.jsonld",
                "manifest_version": "2.1.0",
                "appId": selectedAppInspect,
                "claim_generator": "The H.U.M.A.N. Ethical AI Builder Initiative v2.4 (humanethicalai)",
                "signature": {
                  "issuer": "did:human:ethical-ai-authority",
                  "algorithm": "Ed25519",
                  "verified": true,
                  "timestamp": new Date().toISOString()
                },
                "assertions": [
                  {
                    "label": "c2pa.training_data.ethics",
                    "standard": "Fairly Trained Model Standard v2",
                    "status": "certified",
                    "zero_copyleft_enforced": true
                  },
                  {
                    "label": "c2pa.compensation.society_fund",
                    "standard": "The H.U.M.A.N. Initiative 40% Subscription Royalty Covenant",
                    "society_fund_share_pct": 40,
                    "stripe_connect_mode": "Auto-Split Batch Disbursed"
                  }
                ]
              }, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 6: WORK ACTIVATION & ESCROW CLAIMING (/copyright-owner/activation) */}
      {/* ========================================================================= */}
      {subPage === 'activation' && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border-2 border-[#D67D5C]/40 bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#EECDBC] text-xs font-mono text-[#D67D5C] font-bold">
                <Zap className="w-3.5 h-3.5 text-[#D67D5C]" />
                <span>Dedicated Activation URL: /copyright-owner/activation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] tracking-tight">
                Work Activation & Holding Escrow Claim Station
              </h2>
              <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed">
                When AI tools reference your creative works without prior registration, 40% subscription revenues are safely locked in Stripe Connect holding escrow. Complete a one-click personhood claim to release accrued funds directly to your bank.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {unregisteredEscrow.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#5A5A40] border border-[#E5E0D8] font-bold">
                        {item.asset_type}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#D67D5C]">
                        ${item.holding_escrow_balance_usd.toFixed(2)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#2D2926]">{item.work_title}</h4>
                    <p className="text-[11px] text-[#6A655C]">
                      <strong>Detected Source:</strong> {item.detected_author_or_source}
                    </p>

                    <div className="text-[10px] font-mono text-[#8C857B] space-y-0.5">
                      <div>Referenced by: <strong className="text-[#2D2926]">{item.subscribers_referencing_count} subscribers</strong></div>
                      <div>C2PA Hash: <code className="text-[#5A5A40]">{item.c2pa_manifest_hash}</code></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setClaimingEscrowItem(item);
                      setClaimNameInput(currentCreator?.name || '');
                      setClaimEmailInput(currentCreator?.email || '');
                    }}
                    className="w-full mt-3 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Claim & Release Escrow (${item.holding_escrow_balance_usd.toFixed(0)})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE 7: DIRECT MESSAGING CONSOLE (/copyright-owner/messages) */}
      {/* ========================================================================= */}
      {subPage === 'messages' && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/30 text-xs font-mono text-[#5A5A40] font-bold mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Direct Creator-Steward Messaging: /copyright-owner/messages</span>
                </div>
                <h2 className="text-xl font-bold text-[#2D2926]">Direct Communication & Dispute Console</h2>
                <p className="text-xs text-[#6A655C]">
                  Connect directly with The H.U.M.A.N. Initiative Stewards regarding C2PA assertions, royalty allocations, and escrow releases.
                </p>
              </div>

              <button
                onClick={() => setIsNewThreadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>+ New Message / Dispute</span>
              </button>
            </div>

            {/* Split Screen Chat Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
              {/* Left Column: Threads List (4 cols) */}
              <div className="lg:col-span-5 border border-[#E5E0D8] rounded-2xl bg-[#FAF8F5] p-3 space-y-2 overflow-y-auto max-h-[520px]">
                <div className="text-[11px] font-mono text-[#8C857B] px-2 py-1 uppercase font-bold">
                  Active Conversations ({threads.length})
                </div>

                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer space-y-1.5 ${
                      activeThreadId === thread.id
                        ? 'bg-[#FFFFFF] border-[#5A5A40] shadow-sm ring-1 ring-[#5A5A40]/20'
                        : 'bg-[#FFFFFF]/60 border-[#E5E0D8] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        thread.category === 'Royalty Payout' ? 'bg-[#EBF3ED] text-[#3D6E50]' :
                        thread.category === 'C2PA Claim' ? 'bg-[#EAF2FA] text-indigo-700' :
                        thread.category === 'Activation' ? 'bg-[#FAF0EC] text-[#D67D5C]' :
                        'bg-[#FFF8E7] text-[#B45309]'
                      }`}>
                        {thread.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C857B]">{thread.last_message_at.substring(5, 16)}</span>
                    </div>

                    <div className="font-bold text-xs text-[#2D2926] line-clamp-1">{thread.subject}</div>
                    <div className="text-[11px] text-[#6A655C] line-clamp-1">{thread.last_message_preview}</div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8C857B] pt-1">
                      <span>{thread.creator_name}</span>
                      <span className={`px-1.5 py-0.2 rounded ${
                        thread.status === 'Resolved' ? 'text-[#3D6E50]' :
                        thread.status === 'Action Needed' ? 'text-[#D67D5C] font-bold' :
                        'text-[#5A5A40]'
                      }`}>
                        {thread.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Chat History & Composer (7 cols) */}
              <div className="lg:col-span-7 border border-[#E5E0D8] rounded-2xl bg-[#FFFFFF] p-4 flex flex-col justify-between space-y-4">
                {currentThread ? (
                  <>
                    {/* Thread Header */}
                    <div className="border-b border-[#E5E0D8] pb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#2D2926]">{currentThread.subject}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[#5A5A40] font-bold">
                          {currentThread.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#6A655C]">
                        With: <strong className="text-[#2D2926]">The H.U.M.A.N. Initiative Stewards</strong> • Reference: <code>{currentThread.work_title || 'General IP'}</code>
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="space-y-3 overflow-y-auto max-h-[320px] p-2">
                      {activeMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3.5 rounded-2xl text-xs space-y-1.5 max-w-[85%] ${
                            msg.sender_type === 'creator'
                              ? 'ml-auto bg-[#5A5A40] text-white'
                              : 'bg-[#FAF8F5] border border-[#E5E0D8] text-[#2D2926]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
                            <span>{msg.sender_name}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                          {msg.c2pa_attachment_hash && (
                            <div className="p-1.5 rounded bg-black/10 text-[10px] font-mono flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>C2PA Seal: {msg.c2pa_attachment_hash}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Reply Composer */}
                    <form onSubmit={handleSendReply} className="pt-2 border-t border-[#E5E0D8] flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a message or inquiry to initiative stewards..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                      />
                      <button
                        type="submit"
                        disabled={isSendingMessage || !replyText.trim()}
                        className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>Send</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-xs text-[#6A655C] space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#8C857B]" />
                    <span>Select a message thread from the left to view conversation.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE: CREATOR PATHWAY WALKTHROUGH */}
      {/* ========================================================================= */}
      {subPage === 'path-walkthrough' && (
        <CreatorPathWalkthrough
          onNavigateToTalentIdentifier={() => navigateTo('talent-identifier')}
          onNavigateToSignup={(category) => {
            if (category) setSignupCategory(category as any);
            navigateTo('signup');
          }}
          onNavigateToActivation={() => navigateTo('activation')}
        />
      )}

      {/* ========================================================================= */}
      {/* SUBPAGE: TALENT IDENTIFIER & PROBING DIAGNOSTIC */}
      {/* ========================================================================= */}
      {subPage === 'talent-identifier' && (
        <CreatorTalentIdentifier
          onNavigateToWalkthrough={(pathId) => navigateTo('path-walkthrough')}
          onNavigateToSignup={(archetype) => {
            if (archetype?.toLowerCase().includes('sonic')) setSignupCategory('Music / Audio');
            else if (archetype?.toLowerCase().includes('code')) setSignupCategory('Code Library');
            else if (archetype?.toLowerCase().includes('visual')) setSignupCategory('Visual Art');
            else setSignupCategory('Book / Literature');
            navigateTo('signup');
          }}
          onNavigateToActivation={() => navigateTo('activation')}
        />
      )}

      {/* NEW THREAD MODAL */}
      {isNewThreadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="text-base font-bold text-[#2D2926]">Start Direct Message Thread</h3>
              </div>
              <button 
                onClick={() => setIsNewThreadModalOpen(false)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewThread} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                  Category
                </label>
                <select
                  value={newThreadCategory}
                  onChange={(e) => setNewThreadCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none"
                >
                  <option value="Royalty Payout">Royalty Payout & 40% Split Inquiry</option>
                  <option value="C2PA Claim">C2PA Content Credentials Assertion</option>
                  <option value="Activation">Holding Escrow Release & Activation</option>
                  <option value="Dispute">Attribution or License Dispute</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verification of Literary Rights for Tome Crafter"
                  value={newThreadSubject}
                  onChange={(e) => setNewThreadSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#6A655C] mb-1">
                  Message Body *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry, attributed work, or C2PA manifest hash..."
                  value={newThreadBody}
                  onChange={(e) => setNewThreadBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setIsNewThreadModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#DCD5CA] text-xs font-semibold text-[#6A655C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Send Message to Stewards
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLAIM ESCROW MODAL */}
      {claimingEscrowItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3D6E50]" />
                <h3 className="text-base font-bold text-[#2D2926]">Claim Accrued Escrow Royalty</h3>
              </div>
              <button 
                onClick={() => setClaimingEscrowItem(null)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs space-y-1.5">
              <div className="font-bold text-[#2D2926]">{claimingEscrowItem.work_title}</div>
              <div className="text-[11px] text-[#6A655C]">
                Locked Escrow Amount: <strong className="text-[#3D6E50] font-mono text-sm">${claimingEscrowItem.holding_escrow_balance_usd.toFixed(2)} USD</strong>
              </div>
            </div>

            <form onSubmit={handleRegisterAndClaimEscrow} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[#6A655C] mb-1 font-semibold uppercase">
                  Creator Legal / Entity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton or OpenSound Studio LLC"
                  value={claimNameInput}
                  onChange={(e) => setClaimNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#6A655C] mb-1 font-semibold uppercase">
                  Stripe Connect Payout Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="creator@artisanstudio.org"
                  value={claimEmailInput}
                  onChange={(e) => setClaimEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setClaimingEscrowItem(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#DCD5CA] text-xs font-semibold text-[#6A655C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isClaimSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isClaimSubmitting ? 'Releasing...' : `Release $${claimingEscrowItem.holding_escrow_balance_usd.toFixed(2)} to Stripe`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
