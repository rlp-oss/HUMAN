import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Landmark, 
  CreditCard, 
  ExternalLink, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  TrendingUp, 
  Building, 
  AlertCircle, 
  Lock, 
  User, 
  Layers, 
  Filter, 
  Sparkles,
  ChevronRight,
  FileSpreadsheet,
  Users,
  PieChart,
  Zap,
  Globe,
  Sliders,
  Check,
  Scale,
  BookOpen,
  Music,
  Code,
  Video,
  FileCheck,
  HelpCircle,
  Calculator,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CopyrightClaim, 
  RoyaltyStreamEvent, 
  SocietyFundMetrics, 
  AppSubscriptionTally, 
  UnregisteredEscrowClaim, 
  SocietyDistributionRound 
} from '../types';
import { ClaimService } from '../services/api';
import { 
  StripeDistributionService, 
  DistributionAllocationModel, 
  RoyaltyDistributionPlan, 
  CreatorPayoutAllocation 
} from '../services/StripeDistributionService';

interface CreatorPayoutDashboardProps {
  claims: CopyrightClaim[];
  royaltyEvents: RoyaltyStreamEvent[];
  onRefresh: () => void;
  onOpenStripeSandboxModal?: () => void;
}

interface CreatorMeta {
  name: string;
  email: string;
  id: string;
  stripeId: string;
}

export const CreatorPayoutDashboard: React.FC<CreatorPayoutDashboardProps> = ({
  claims,
  royaltyEvents,
  onRefresh,
  onOpenStripeSandboxModal,
}) => {
  const [selectedCreatorEmail, setSelectedCreatorEmail] = useState<string>('all');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'available' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 40% Society Fund State via StripeDistributionService
  const [metrics, setMetrics] = useState<SocietyFundMetrics | null>(null);
  const [appSubs, setAppSubs] = useState<AppSubscriptionTally[]>([]);
  const [unregisteredEscrow, setUnregisteredEscrow] = useState<UnregisteredEscrowClaim[]>([]);
  const [distributionRounds, setDistributionRounds] = useState<SocietyDistributionRound[]>([]);
  const [isExecutingDistribution, setIsExecutingDistribution] = useState(false);
  const [isSimulatingSub, setIsSimulatingSub] = useState(false);

  // Real-Time Fund Allocation Engine State
  const [allocationModel, setAllocationModel] = useState<DistributionAllocationModel>('equal_share');
  const [currentPlan, setCurrentPlan] = useState<RoyaltyDistributionPlan | null>(null);
  const [isRecalculatingPlan, setIsRecalculatingPlan] = useState(false);

  // Escrow Claim Modal State
  const [claimingEscrowItem, setClaimingEscrowItem] = useState<UnregisteredEscrowClaim | null>(null);
  const [claimNameInput, setClaimNameInput] = useState('');
  const [claimEmailInput, setClaimEmailInput] = useState('');
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);

  const loadSocietyFundData = async (targetModel: DistributionAllocationModel = allocationModel) => {
    try {
      const [m, apps, escrow, rounds, plan] = await Promise.all([
        StripeDistributionService.getSocietyFundMetrics(),
        StripeDistributionService.getConnectedApps(),
        StripeDistributionService.getUnregisteredEscrow(),
        StripeDistributionService.getDistributionRounds(),
        StripeDistributionService.calculateDistributionPlan(targetModel),
      ]);
      setMetrics(m);
      setAppSubs(apps);
      setUnregisteredEscrow(escrow);
      setDistributionRounds(rounds);
      setCurrentPlan(plan);
    } catch (e) {
      console.error('Error loading society fund data:', e);
    }
  };

  useEffect(() => {
    loadSocietyFundData();
  }, []);

  const handleModelChange = async (newModel: DistributionAllocationModel) => {
    setAllocationModel(newModel);
    setIsRecalculatingPlan(true);
    try {
      const plan = await StripeDistributionService.calculateDistributionPlan(newModel);
      setCurrentPlan(plan);
    } catch (e) {
      console.error('Error recalculating plan:', e);
    } finally {
      setIsRecalculatingPlan(false);
    }
  };

  // Extract unique creators from claims
  const creators: CreatorMeta[] = Array.from(
    new Map<string, CreatorMeta>(
      claims.map(c => [c.creator_email, { name: c.creator_name, email: c.creator_email, id: c.id, stripeId: c.stripe_account_id }])
    ).values()
  );

  // Filter claims based on selected creator
  const filteredClaims = selectedCreatorEmail === 'all' 
    ? claims 
    : claims.filter(c => c.creator_email === selectedCreatorEmail);

  // Calculations
  const totalPaidOut = filteredClaims.reduce((acc, c) => acc + (c.total_payouts_claimed_usd || 0), 0);
  const totalAvailable = filteredClaims.reduce((acc, c) => acc + (c.payout_balance_usd || 0), 0);
  const pendingBufferFactor = selectedCreatorEmail === 'all' ? 42.65 : 14.20;
  const totalPending = Math.round(pendingBufferFactor * 100) / 100;
  const totalLifetimeEarnings = totalPaidOut + totalAvailable + totalPending;

  const handleSimulateNewSubscriber = async (appId?: string) => {
    setIsSimulatingSub(true);
    const targetApp = appSubs.find(a => a.app_id === appId) || appSubs[0] || {
      app_id: 'tomecrafter-ai-book-studio',
      app_name: 'Tome Crafter',
      plan_price_monthly: 49.00
    };

    try {
      const split = await StripeDistributionService.captureSubscriptionPayment({
        appId: targetApp.app_id,
        appName: targetApp.app_name,
        amountUsd: targetApp.plan_price_monthly,
        subscriberEmail: `tester_${Math.random().toString(36).substring(2, 7)}@artisan.app`,
        tierName: 'Pro',
      });

      await loadSocietyFundData();
      onRefresh();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#3D6E50', '#D67D5C', '#5A5A40'],
      });
      setPayoutSuccessMsg(`🎉 New Subscriber on ${split.sourceAppName}! +$${split.grossAmountUsd.toFixed(2)} ($${split.societyFundSplitUsd.toFixed(2)} 40% immediately routed to Society Fund in Stripe Connect)`);
      setTimeout(() => setPayoutSuccessMsg(null), 6000);
    } catch (err: any) {
      alert('Subscription simulation error: ' + err.message);
    } finally {
      setIsSimulatingSub(false);
    }
  };

  const handleUpdateSubscriberSlider = async (appId: string, val: number) => {
    try {
      const apps = await StripeDistributionService.updateAppSubscribers(appId, val);
      const newMetrics = await StripeDistributionService.getSocietyFundMetrics();
      const newPlan = await StripeDistributionService.calculateDistributionPlan(allocationModel);
      setAppSubs([...apps]);
      setMetrics({ ...newMetrics });
      setCurrentPlan(newPlan);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecuteDistribution = async () => {
    if (!currentPlan) return;
    setIsExecutingDistribution(true);
    try {
      const result = await StripeDistributionService.executeBatchPayout(currentPlan);
      setMetrics({ ...result.updatedSocietyMetrics });
      await loadSocietyFundData();
      onRefresh();
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#5A5A40', '#3D6E50', '#D67D5C', '#10B981'],
      });
      setPayoutSuccessMsg(`✅ 40% Society Fund Distribution Executed: Disbursed $${result.totalPaidUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} across ${result.creatorsPaidCount} registered creators via Stripe Connect Batch (${result.stripeBatchTransferId})!`);
      setTimeout(() => setPayoutSuccessMsg(null), 8000);
    } catch (e: any) {
      alert('Distribution execution failed: ' + e.message);
    } finally {
      setIsExecutingDistribution(false);
    }
  };

  const handleRegisterAndClaimEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingEscrowItem || !claimNameInput || !claimEmailInput) return;

    setIsClaimSubmitting(true);
    try {
      const res = await StripeDistributionService.registerAndClaimEscrow(
        claimingEscrowItem.id,
        claimNameInput,
        claimEmailInput
      );
      setClaimingEscrowItem(null);
      setClaimNameInput('');
      setClaimEmailInput('');
      await loadSocietyFundData();
      onRefresh();

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3D6E50', '#D67D5C', '#5A5A40'],
      });
      setPayoutSuccessMsg(`🎉 Copyright Claim Registered! Released $${res.claimedAmount.toFixed(2)} from holding escrow to ${claimNameInput}'s verified Stripe Connect balance!`);
      setTimeout(() => setPayoutSuccessMsg(null), 6000);
    } catch (err: any) {
      alert('Claim submission failed: ' + err.message);
    } finally {
      setIsClaimSubmitting(false);
    }
  };

  const handleInstantPayoutAll = async () => {
    if (totalAvailable <= 0) {
      alert('No available liquid balance to disburse right now.');
      return;
    }

    setPayoutLoading(true);
    setPayoutSuccessMsg(null);

    try {
      for (const claim of filteredClaims) {
        if (claim.payout_balance_usd > 0) {
          await ClaimService.triggerPayout(claim.id, claim.payout_balance_usd);
        }
      }

      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#3D6E50', '#D67D5C', '#5A5A40'],
      });

      setPayoutSuccessMsg(`Successfully disbursed $${totalAvailable.toFixed(2)} via Stripe Connect Instant Payout!`);
      onRefresh();
      setTimeout(() => setPayoutSuccessMsg(null), 5000);
    } catch (err: any) {
      alert('Payout execution error: ' + err.message);
    } finally {
      setPayoutLoading(false);
    }
  };

  const getAppIcon = (cat: string) => {
    switch (cat) {
      case 'book': return <BookOpen className="w-4 h-4 text-emerald-800" />;
      case 'audio': return <Music className="w-4 h-4 text-[#5A5A40]" />;
      case 'code': return <Code className="w-4 h-4 text-indigo-700" />;
      case 'video': return <Video className="w-4 h-4 text-[#D67D5C]" />;
      default: return <Globe className="w-4 h-4 text-[#5A5A40]" />;
    }
  };

  // Simulated Payout Ledger Items
  const ledgerItems = [
    {
      id: 'tx_pay_901',
      date: '2026-08-17 14:10 UTC',
      type: '40% Subscription Society Split',
      work: 'Tome Crafter Complete Drafting Engine',
      app: 'Tome Crafter',
      amount_usd: 424.48,
      status: 'Paid',
      stripe_transfer_id: 'tr_1NZe44StripeConnectPaid',
      destination: 'JPMorgan Chase (•••• 4242)',
      c2pa_hash: '0x633270612e6175646974...cody',
    },
    {
      id: 'tx_pay_902',
      date: '2026-08-18 09:30 UTC',
      type: '40% Subscription Society Split',
      work: 'Harmonic Stems Vol. 4',
      app: 'RLM Pro Studio',
      amount_usd: 424.48,
      status: 'Paid',
      stripe_transfer_id: 'tr_1NZm99StripeAudioDirect',
      destination: 'Wells Fargo (•••• 8819)',
      c2pa_hash: '0x633270612e6175646974...marcus',
    },
    {
      id: 'tx_pay_903',
      date: '2026-08-18 16:45 UTC',
      type: '40% Subscription Society Split',
      work: 'ReForgeOS AST Cleanroom Kernel',
      app: 'ForgeOS App Builders',
      amount_usd: 512.60,
      status: 'Available',
      stripe_transfer_id: 'tr_1NZp77ReadyForInstantDisburse',
      destination: 'Silicon Valley Bank (•••• 1044)',
      c2pa_hash: '0x633270612e6175646974...evelyn',
    },
    {
      id: 'tx_pay_904',
      date: '2026-08-19 17:50 UTC',
      type: 'Holding Escrow Accrual',
      work: 'Algorithmic Graph Traversal Kernels',
      app: 'ForgeOS App Builders',
      amount_usd: 5420.00,
      status: 'Pending',
      stripe_transfer_id: 'tr_holding_escrow_awaiting_claim',
      destination: 'Society Fund Holding Escrow',
      c2pa_hash: '0x88f1a...wasm44',
    },
    {
      id: 'tx_pay_905',
      date: '2026-08-20 08:12 UTC',
      type: 'Holding Escrow Accrual',
      work: 'Atmospheric Binaural Modular Soundscapes',
      app: 'RLM Pro Studio',
      amount_usd: 4680.00,
      status: 'Pending',
      stripe_transfer_id: 'tr_holding_escrow_awaiting_claim',
      destination: 'Society Fund Holding Escrow',
      c2pa_hash: '0x4f1b8...audio88',
    },
  ];

  const filteredLedger = ledgerItems.filter(item => {
    if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter) return false;
    if (searchTerm) {
      const match = item.work.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.stripe_transfer_id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Payout ID',
      'Timestamp (UTC)',
      'Transaction Type',
      'Attributed Work',
      'Application Source',
      'Amount (USD)',
      'Status',
      'Stripe Transfer ID',
      'Destination Account',
      'C2PA Cryptographic Stamp'
    ];

    const rows = filteredLedger.map(i => [
      i.id,
      i.date,
      `"${i.type}"`,
      `"${i.work}"`,
      `"${i.app}"`,
      i.amount_usd.toFixed(2),
      i.status,
      i.stripe_transfer_id,
      `"${i.destination}"`,
      i.c2pa_hash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `human_40pct_society_fund_payouts_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fundTotal = metrics?.total_society_fund_usd || 76408.00;
  const grossMRR = metrics?.total_subscription_revenue_usd || 191020.00;
  const totalSubs = metrics?.total_active_subscribers || 4080;
  const holdingEscrow = metrics?.unallocated_holding_escrow_usd || 14280.00;
  const registeredPool = metrics?.allocated_registered_pool_usd || 62128.00;
  const perCreatorEst = metrics?.estimated_payout_per_registered_creator || 424.48;

  return (
    <div className="space-y-8">
      {/* Toast Banner */}
      {payoutSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#EBF3ED] border-2 border-[#3D6E50]/40 text-[#2D2926] flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#3D6E50] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{payoutSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setPayoutSuccessMsg(null)}
            className="text-xs font-mono text-[#6A655C] hover:text-[#2D2926] p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 40% SOCIETY FUND CORE HERO */}
      <div className="rounded-2xl border-2 border-[#5A5A40]/30 bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/30 text-xs font-mono text-[#5A5A40] font-bold">
              <Scale className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>H.U.M.A.N. 40% Subscription Royalty Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] tracking-tight flex items-center gap-3 flex-wrap">
              <span>Society Fund & Creator Distribution Hub</span>
              <span className="text-xs font-mono font-bold bg-[#FAF0EC] text-[#D67D5C] px-3 py-1 rounded-full border border-[#EECDBC]">
                40% Auto-Split via StripeDistributionService
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed">
              <strong>The 40% Society Rule:</strong> Exactly 40% of every subscription paid across all apps carrying the H.U.M.A.N. badge goes <em>immediately</em> into the non-profit Society Fund in Stripe Connect. Funds stay in holding escrow until copyright creators are registered. As total subscribers grow across the badge fleet, the pool surges and payouts per registered creator increase dynamically.
            </p>
          </div>

          {/* Core Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSimulateNewSubscriber()}
              disabled={isSimulatingSub}
              className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono font-bold text-[#5A5A40] flex items-center gap-2 shadow-2xs transition-all cursor-pointer hover:border-[#5A5A40] active:scale-95 disabled:opacity-50"
              title="Simulate a new subscriber joining any badge app"
            >
              <Zap className="w-4 h-4 text-[#D67D5C]" />
              <span>{isSimulatingSub ? 'Processing Sub...' : '+ Simulate Subscriber (+40%)'}</span>
            </button>

            <button
              type="button"
              onClick={handleExecuteDistribution}
              disabled={isExecutingDistribution}
              className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <DollarSign className="w-4 h-4 text-white" />
              <span>{isExecutingDistribution ? 'Executing Batch Payout...' : 'Execute Batch Payout'}</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Card 1: Society Fund Total */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">
                40% Society Fund Pool
              </span>
              <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCD5CA]">
                <Landmark className="w-4 h-4 text-[#5A5A40]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#5A5A40] tracking-tight">
              ${fundTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-[#6A655C] flex items-center justify-between pt-1 border-t border-[#E5E0D8]">
              <span>Gross MRR: ${grossMRR.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
              <span className="font-bold text-[#3D6E50]">40% Cut</span>
            </div>
          </div>

          {/* Card 2: Active Subscribers */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">
                Active Subscribers Tally
              </span>
              <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCD5CA]">
                <Users className="w-4 h-4 text-[#D67D5C]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2D2926] tracking-tight">
              {totalSubs.toLocaleString()} <span className="text-xs font-normal text-[#6A655C]">paying users</span>
            </div>
            <div className="text-[11px] font-mono text-[#6A655C] flex items-center justify-between pt-1 border-t border-[#E5E0D8]">
              <span>Across 4 Flagship Apps</span>
              <span className="text-[#3D6E50] font-semibold">100% Verified</span>
            </div>
          </div>

          {/* Card 3: Per-Creator Dynamic Payout */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">
                Est. Payout / Creator
              </span>
              <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCD5CA]">
                <TrendingUp className="w-4 h-4 text-[#3D6E50]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#3D6E50] tracking-tight">
              ${perCreatorEst.toFixed(2)} <span className="text-xs font-normal text-[#6A655C]">/ mo</span>
            </div>
            <div className="text-[11px] font-mono text-[#6A655C] flex items-center justify-between pt-1 border-t border-[#E5E0D8]">
              <span>180 Registered Creators</span>
              <span className="text-[#5A5A40] font-bold">Scales with Subs</span>
            </div>
          </div>

          {/* Card 4: Unallocated Holding Escrow */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-[#6A655C]">
                Holding Escrow (Unregistered)
              </span>
              <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCD5CA]">
                <Lock className="w-4 h-4 text-[#D67D5C]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#D67D5C] tracking-tight">
              ${holdingEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-[#6A655C] flex items-center justify-between pt-1 border-t border-[#E5E0D8]">
              <span>{unregisteredEscrow.length} Works Waiting</span>
              <span className="text-indigo-700 font-semibold underline cursor-pointer" onClick={() => {
                const el = document.getElementById('unregistered-escrow-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Claim Now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME FUND ALLOCATION ENGINE & ALGORITHMIC MODELING */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="text-base font-bold text-[#2D2926]">
                Real-Time Fund Allocation Engine & Algorithmic Modeling
              </h3>
            </div>
            <p className="text-xs text-[#6A655C]">
              Computed directly by <code className="text-[#5A5A40] font-semibold">StripeDistributionService.calculateDistributionPlan()</code> based on active subscription liquidity and registered personhood proofs.
            </p>
          </div>

          {/* Model Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#E5E0D8]">
            <button
              type="button"
              onClick={() => handleModelChange('equal_share')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                allocationModel === 'equal_share'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'text-[#6A655C] hover:text-[#2D2926]'
              }`}
            >
              Equal Share
            </button>
            <button
              type="button"
              onClick={() => handleModelChange('attribution_weighted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                allocationModel === 'attribution_weighted'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'text-[#6A655C] hover:text-[#2D2926]'
              }`}
            >
              Attribution Weighted
            </button>
            <button
              type="button"
              onClick={() => handleModelChange('hybrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                allocationModel === 'hybrid'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'text-[#6A655C] hover:text-[#2D2926]'
              }`}
            >
              Hybrid Floor + AST
            </button>
          </div>
        </div>

        {/* Algorithm Blueprint Summary */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[#5A5A40] font-bold uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Active Distribution Algorithm: {allocationModel === 'equal_share' ? 'Universal Equal Dividend (1/N)' : allocationModel === 'attribution_weighted' ? 'AST Volume & Reference Weighted' : 'Hybrid (60% Guaranteed Universal Floor + 40% Volume Pool)'}
            </span>
            <span className="text-[#6A655C]">
              Batch Audit Hash: <code>{currentPlan?.c2paBatchAuditProof || '0x4f12...c2paSeal'}</code>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8]">
              <span className="text-[#8C857B] block uppercase text-[10px]">Distributable Registered Pool</span>
              <strong className="text-[#3D6E50] text-sm">${(currentPlan?.totalDistributingUsd || registeredPool).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8]">
              <span className="text-[#8C857B] block uppercase text-[10px]">Participating Verified Creators</span>
              <strong className="text-[#2D2926] text-sm">{currentPlan?.registeredCreatorsCount || 180} Creators</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8]">
              <span className="text-[#8C857B] block uppercase text-[10px]">Average Yield Per Creator</span>
              <strong className="text-[#5A5A40] text-sm">${(currentPlan?.averagePayoutPerCreator || perCreatorEst).toFixed(2)} / Creator</strong>
            </div>
          </div>
        </div>

        {/* Live Allocation Preview Table */}
        {currentPlan && currentPlan.payouts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#6A655C]">
              <span>Sample Verified Creator Allocation Breakdown ({currentPlan.payouts.length} Sample Representatives Shown)</span>
              <span className="text-[#3D6E50] font-semibold">Live Real-Time Sync</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#E5E0D8]">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[#FAF8F5] text-[#8C857B] uppercase border-b border-[#E5E0D8]">
                  <tr>
                    <th className="py-2 px-3">Creator Name & Domain</th>
                    <th className="py-2 px-3">Stripe Account</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Work Reference</th>
                    <th className="py-2 px-3">Base Share</th>
                    <th className="py-2 px-3">Bonus / Weight</th>
                    <th className="py-2 px-3">Total Calculated Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8]">
                  {currentPlan.payouts.slice(0, 5).map((payout) => (
                    <tr key={payout.creatorId} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-2 px-3 font-semibold text-[#2D2926]">
                        <div>{payout.creatorName}</div>
                        <span className="text-[10px] text-[#8C857B]">{payout.creatorEmail}</span>
                      </td>
                      <td className="py-2 px-3 text-[#6A655C]">
                        <code>{payout.stripeAccountId}</code>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#FAF8F5] border border-[#E5E0D8] text-[#5A5A40]">
                          {payout.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#6A655C] text-[11px]">{payout.workReference}</td>
                      <td className="py-2 px-3 text-[#2D2926]">${payout.baseAmountUsd.toFixed(2)}</td>
                      <td className="py-2 px-3 text-[#D67D5C]">+${payout.attributionBonusUsd.toFixed(2)}</td>
                      <td className="py-2 px-3 font-bold text-[#3D6E50]">${payout.totalPayoutUsd.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC SUBSCRIBER TALLY & FLIGHTWHEEL SCALING SIMULATOR */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="text-base font-bold text-[#2D2926]">
                Subscriber Tallies & Dynamic Scaling Engine across 4 Badge Apps
              </h3>
            </div>
            <p className="text-xs text-[#6A655C]">
              Adjust the subscriber count slider for each app to observe how the 40% Society Fund and per-creator royalty payouts scale dynamically.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#3D6E50] bg-[#EBF3ED] px-2.5 py-1 rounded-md border border-[#C9D1BE] font-semibold">
              Flywheel Active: +$18.73/sub yield
            </span>
          </div>
        </div>

        {/* 4 Apps Interactive Slider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appSubs.map((app) => (
            <div 
              key={app.app_id} 
              className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-4 hover:border-[#DCD5CA] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8]">
                    {getAppIcon(app.icon_category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2926]">{app.app_name}</h4>
                    <div className="text-[11px] font-mono text-[#6A655C]">
                      Plan: <strong className="text-[#2D2926]">${app.plan_price_monthly.toFixed(0)}/mo</strong> • Audit: <code>{app.c2pa_audit_id}</code>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulateNewSubscriber(app.app_id)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#FAF0EC] border border-[#DCD5CA] text-[11px] font-mono font-bold text-[#D67D5C] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                  title="Simulate +1 Subscriber on this app"
                >
                  <Zap className="w-3 h-3 text-[#D67D5C]" />
                  <span>+1 Sub</span>
                </button>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#6A655C]">Subscribers:</span>
                  <span className="font-bold text-[#2D2926]">{app.subscribers_count.toLocaleString()} active</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={app.subscribers_count}
                  onChange={(e) => handleUpdateSubscriberSlider(app.app_id, parseInt(e.target.value, 10) || 0)}
                  className="w-full h-2 bg-[#E5E0D8] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                />
              </div>

              {/* Revenue & 40% Split Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E0D8] text-xs font-mono">
                <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8]">
                  <span className="text-[10px] text-[#8C857B] block uppercase">Gross MRR</span>
                  <strong className="text-[#2D2926]">${app.gross_monthly_mrr.toLocaleString('en-US', { minimumFractionDigits: 0 })}</strong>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF0EC] border border-[#EECDBC]">
                  <span className="text-[10px] text-[#D67D5C] block uppercase font-bold">40% Society Cut</span>
                  <strong className="text-[#D67D5C]">${app.society_fund_40pct_contribution.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UNREGISTERED COPYRIGHT HOLDING ESCROW PORTAL */}
      <div id="unregistered-escrow-section" className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D67D5C]" />
              <h3 className="text-base font-bold text-[#2D2926]">
                Holding Escrow Station (Unclaimed 40% Subscription Royalties)
              </h3>
            </div>
            <p className="text-xs text-[#6A655C]">
              40% subscription revenues are safely locked in Stripe Connect escrow until the copyright owner verifies personhood and claims the asset.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-[#D67D5C] bg-[#FAF0EC] px-3 py-1 rounded-full border border-[#EECDBC] self-start sm:self-auto">
            ${holdingEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })} Locked
          </span>
        </div>

        {/* Escrow Items List */}
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

                <h4 className="text-sm font-bold text-[#2D2926] line-clamp-2">{item.work_title}</h4>
                <p className="text-[11px] text-[#6A655C] leading-tight">
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
                  setClaimNameInput('');
                  setClaimEmailInput('');
                }}
                className="w-full mt-3 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Register & Claim Escrow (${item.holding_escrow_balance_usd.toFixed(0)})</span>
              </button>
            </div>
          ))}
        </div>
      </div>

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
              <div className="text-[10px] font-mono text-[#8C857B]">
                Accrued from {claimingEscrowItem.subscribers_referencing_count} paying subscribers across H.U.M.A.N. badge fleet.
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
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
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
                  {isClaimSubmitting ? 'Verifying & Releasing...' : `Release $${claimingEscrowItem.holding_escrow_balance_usd.toFixed(2)} to Stripe`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HISTORICAL DISTRIBUTION ROUNDS */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="text-base font-bold text-[#2D2926]">Society Fund Distribution History</h3>
          </div>
          <span className="text-xs font-mono text-[#6A655C]">
            Bi-Monthly Automated Cycles
          </span>
        </div>

        <div className="space-y-3">
          {distributionRounds.map((round) => (
            <div key={round.round_id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    round.status === 'Completed' ? 'bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]' : 'bg-[#FFF8E7] text-[#B45309] border border-[#FDE68A]'
                  }`}>
                    {round.status}
                  </span>
                  <span className="text-xs font-bold text-[#2D2926]">{round.timestamp}</span>
                </div>
                <div className="text-xs text-[#6A655C] font-mono">
                  Batch: <code>{round.stripe_batch_id}</code> • Audit: <code>{round.c2pa_audit_seal}</code>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono self-end sm:self-auto">
                <div>
                  <span className="text-[#8C857B] block text-[10px]">Subscribers</span>
                  <strong className="text-[#2D2926]">{round.subscribers_at_execution.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-[#8C857B] block text-[10px]">Creators Paid</span>
                  <strong className="text-[#2D2926]">{round.creators_paid_count}</strong>
                </div>
                <div>
                  <span className="text-[#8C857B] block text-[10px]">Total Disbursed</span>
                  <strong className="text-[#3D6E50] font-bold">${round.total_distributed_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED PAYOUT LEDGER */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2D2926]">Direct Creator Payout Ledger</h3>
            <p className="text-xs text-[#6A655C]">
              Individual disbursement receipts with C2PA hashes and Stripe Connect transfer IDs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl border border-[#DCD5CA] bg-[#FFFFFF] hover:bg-[#FAF8F5] text-xs font-mono text-[#5A5A40] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Export CSV</span>
            </button>

            {onOpenStripeSandboxModal && (
              <button
                onClick={onOpenStripeSandboxModal}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Stripe Sandbox</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by work, app, or transfer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
          />
          <div className="flex items-center gap-1.5">
            {(['all', 'paid', 'available', 'pending'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#6A655C] border border-[#E5E0D8] hover:bg-[#F2ECE4]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#E5E0D8] text-[#8C857B] uppercase">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Attributed Work / Type</th>
                <th className="py-2.5 px-3">Application</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">C2PA Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]">
              {filteredLedger.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-2.5 px-3 text-[#6A655C]">{row.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#2D2926]">
                    <div>{row.work}</div>
                    <span className="text-[10px] text-[#8C857B] font-normal">{row.type}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#5A5A40] font-bold">{row.app}</td>
                  <td className="py-2.5 px-3 font-bold text-[#3D6E50]">${row.amount_usd.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      row.status === 'Paid' ? 'bg-[#EBF3ED] text-[#3D6E50]' :
                      row.status === 'Available' ? 'bg-[#EAF2FA] text-indigo-700' :
                      'bg-[#FFF8E7] text-[#B45309]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#6A655C]">{row.destination}</td>
                  <td className="py-2.5 px-3 text-[10px] text-[#8C857B]">
                    <code>{row.c2pa_hash}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

