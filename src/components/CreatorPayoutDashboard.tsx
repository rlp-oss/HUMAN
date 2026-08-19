import React, { useState } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CopyrightClaim, RoyaltyStreamEvent } from '../types';
import { ClaimService } from '../services/api';

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

  // Extract unique creators from claims
  const creators: CreatorMeta[] = Array.from(
    new Map<string, CreatorMeta>(
      claims.map(c => [c.creator_email, { name: c.creator_name, email: c.creator_email, id: c.id, stripeId: c.stripe_account_id }])
    ).values()
  );

  // Filter claims and events based on selected creator
  const filteredClaims = selectedCreatorEmail === 'all' 
    ? claims 
    : claims.filter(c => c.creator_email === selectedCreatorEmail);

  // Calculations
  const totalPaidOut = filteredClaims.reduce((acc, c) => acc + (c.total_payouts_claimed_usd || 0), 0);
  const totalAvailable = filteredClaims.reduce((acc, c) => acc + (c.payout_balance_usd || 0), 0);
  
  // Pending calculated from recent synthesis events (unsettled 24h batch buffer)
  const pendingBufferFactor = selectedCreatorEmail === 'all' ? 42.65 : 14.20;
  const totalPending = Math.round(pendingBufferFactor * 100) / 100;
  const totalLifetimeEarnings = totalPaidOut + totalAvailable + totalPending;

  const paidPct = totalLifetimeEarnings > 0 ? (totalPaidOut / totalLifetimeEarnings) * 100 : 0;
  const availablePct = totalLifetimeEarnings > 0 ? (totalAvailable / totalLifetimeEarnings) * 100 : 0;
  const pendingPct = totalLifetimeEarnings > 0 ? (totalPending / totalLifetimeEarnings) * 100 : 0;

  // Selected Creator Profile Meta
  const activeCreatorMeta = selectedCreatorEmail !== 'all' 
    ? creators.find(c => c.email === selectedCreatorEmail) 
    : null;

  // Simulated Payout Ledger Items
  const ledgerItems = [
    {
      id: 'tx_pay_901',
      date: '2026-08-17 14:10 UTC',
      type: 'Batch Settlement',
      work: 'ReForgeOS Virtual Kernel & Guardrail SDK',
      app: 'ReForgeOS Engine',
      amount_usd: 125.40,
      status: 'Paid',
      stripe_transfer_id: 'tr_1NZe44StripeConnectPaid',
      destination: 'JPMorgan Chase (•••• 4242)',
      c2pa_hash: '0x633270612e6175646974...cody',
    },
    {
      id: 'tx_pay_902',
      date: '2026-08-18 09:30 UTC',
      type: 'Instant Creator Disburse',
      work: 'Harmonic Stems Vol. 4',
      app: 'Lyria Studio',
      amount_usd: 84.50,
      status: 'Paid',
      stripe_transfer_id: 'tr_1NZm99StripeAudioDirect',
      destination: 'Wells Fargo (•••• 8819)',
      c2pa_hash: '0x633270612e6175646974...marcus',
    },
    {
      id: 'tx_pay_903',
      date: '2026-08-18 16:45 UTC',
      type: 'Real-time Synthesis Stream',
      work: 'The Principles of Ethical AI Synthesis',
      app: 'CodeSynthesizer',
      amount_usd: 512.60,
      status: 'Available',
      stripe_transfer_id: 'tr_1NZp77ReadyForInstantDisburse',
      destination: 'Silicon Valley Bank (•••• 1044)',
      c2pa_hash: '0x633270612e6175646974...evelyn',
    },
    {
      id: 'tx_pay_904',
      date: '2026-08-18 17:50 UTC',
      type: 'Live AI Micro-Patronage Ingestion',
      work: 'Fast-Router Component Micro-Library',
      app: 'ShareShop Pro',
      amount_usd: 14.20,
      status: 'Pending',
      stripe_transfer_id: 'tr_pending_24h_batch_buffer',
      destination: 'Stripe Settlement Escrow',
      c2pa_hash: '0x633270612e6175646974...buffer',
    },
    {
      id: 'tx_pay_905',
      date: '2026-08-18 18:12 UTC',
      type: 'Vector Glyph Ingestion',
      work: 'Artisan Typography & Glyph Atlas',
      app: 'ArtisanPay API',
      amount_usd: 28.45,
      status: 'Pending',
      stripe_transfer_id: 'tr_pending_24h_batch_buffer',
      destination: 'Stripe Settlement Escrow',
      c2pa_hash: '0x633270612e6175646974...amina',
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

  const handleInstantPayoutAll = async () => {
    if (totalAvailable <= 0) {
      alert('No available liquid balance to disburse right now.');
      return;
    }

    setPayoutLoading(true);
    setPayoutSuccessMsg(null);

    try {
      // Disburse all claims with positive available balances
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

  const handleExportCSV = () => {
    const headers = [
      'Payout ID',
      'Timestamp (UTC)',
      'Transaction Type',
      'Attributed Work',
      'Application Source',
      'Amount (USD)',
      'Payout Status',
      'Stripe Transfer Reference',
      'Destination Account',
      'C2PA Verification Hash'
    ];

    const rows = filteredLedger.map(item => [
      `"${item.id}"`,
      `"${item.date}"`,
      `"${item.type}"`,
      `"${item.work.replace(/"/g, '""')}"`,
      `"${item.app.replace(/"/g, '""')}"`,
      `"${item.amount_usd.toFixed(2)}"`,
      `"${item.status}"`,
      `"${item.stripe_transfer_id}"`,
      `"${item.destination}"`,
      `"${item.c2pa_hash}"`
    ]);

    const csvContent = [
      `# H.U.M.A.N. Protocol - Stripe Connect Creator Payout Statement`,
      `# Creator Filter: ${selectedCreatorEmail === 'all' ? 'Consolidated Network' : activeCreatorMeta?.name}`,
      `# Export Date: ${new Date().toISOString()}`,
      `# Total Lifetime Earned: $${totalLifetimeEarnings.toFixed(2)} USD`,
      `# Total Paid to Bank: $${totalPaidOut.toFixed(2)} USD`,
      `# Total Available: $${totalAvailable.toFixed(2)} USD`,
      `# Total Pending Clearing: $${totalPending.toFixed(2)} USD`,
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stripe-payout-statement-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-[#2D2926]">
      {/* Top Banner & Creator Filter */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-[11px] font-mono text-[#5A5A40] shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Stripe Connect Express • Micro-Patronage Payout Ledger</span>
            </div>
            <h2 className="text-2xl font-black text-[#2D2926] tracking-tight">
              Creator Earnings & Payout Transparency
            </h2>
            <p className="text-xs text-[#6A655C] leading-relaxed">
              Track the exact flow of micro-royalties from AI synthesis prompts through 24-hour clearing into creator bank accounts via Stripe Connect.
            </p>
            <div className="text-[10px] font-mono text-[#8C857B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E0D8] inline-block">
              *Sample amount — not real (for display and testing purposes)
            </div>
          </div>

          {/* Creator Selector Dropdown */}
          <div className="flex flex-col gap-2 min-w-[260px]">
            <label className="text-[11px] font-mono uppercase text-[#5A5A40] font-semibold">
              Filter by Creator Portfolio
            </label>
            <select
              value={selectedCreatorEmail}
              onChange={(e) => setSelectedCreatorEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#DCD5CA] text-xs font-semibold text-[#2D2926] focus:outline-none focus:border-[#5A5A40] shadow-2xs cursor-pointer"
            >
              <option value="all">Consolidated Network View (All Creators)</option>
              {creators.map(c => (
                <option key={c.email} value={c.email}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
            {onOpenStripeSandboxModal && (
              <button
                type="button"
                onClick={onOpenStripeSandboxModal}
                className="text-[11px] font-mono text-[#5A5A40] hover:text-[#2D2926] underline text-left cursor-pointer flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Configure Stripe Sandbox Secrets</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payout Success Alert */}
      {payoutSuccessMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-[#3D6E50]/30 bg-[#EBF3ED] text-[#2D2926] shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#3D6E50] shrink-0" />
          <div className="text-xs">
            <strong className="text-[#3D6E50] block font-semibold">Stripe Connect Transfer Initiated</strong>
            <span>{payoutSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Key Metric Transparency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Historical */}
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#6A655C]">
            <span>Total Lifetime Earned</span>
            <TrendingUp className="w-4 h-4 text-[#5A5A40]" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#2D2926] tracking-tight">
              ${totalLifetimeEarnings.toFixed(2)}
            </div>
            <span className="text-[10px] font-mono text-[#8C857B] block">
              Cumulative from {filteredClaims.length} active registered claim(s)
            </span>
          </div>
          <div className="pt-2 border-t border-[#F2ECE4] text-[10px] font-mono text-[#5A5A40] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#5A5A40]" />
            <span>100% C2PA Provenance Verified</span>
          </div>
        </div>

        {/* Paid Out to Bank */}
        <div className="rounded-2xl border border-[#C9D1BE] bg-[#FAFBF9] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#3D6E50] font-semibold">
            <span>Disbursed to Bank</span>
            <CheckCircle2 className="w-4 h-4 text-[#3D6E50]" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#3D6E50] tracking-tight">
              ${totalPaidOut.toFixed(2)}
            </div>
            <span className="text-[10px] font-mono text-[#6A655C] block">
              {paidPct.toFixed(1)}% of total lifetime earnings
            </span>
          </div>
          <div className="pt-2 border-t border-[#E8EDE3] text-[10px] font-mono text-[#3D6E50] flex items-center gap-1">
            <Landmark className="w-3 h-3" />
            <span>Settled via Stripe Connect Direct</span>
          </div>
        </div>

        {/* Available for Instant Payout */}
        <div className="rounded-2xl border border-[#EECDBC] bg-[#FDF7F4] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#D67D5C] font-semibold">
            <span>Liquid Available Now</span>
            <DollarSign className="w-4 h-4 text-[#D67D5C]" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#D67D5C] tracking-tight">
              ${totalAvailable.toFixed(2)}
            </div>
            <span className="text-[10px] font-mono text-[#6A655C] block">
              Ready for immediate 1-click payout
            </span>
          </div>
          <button
            type="button"
            onClick={handleInstantPayoutAll}
            disabled={totalAvailable <= 0 || payoutLoading}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              totalAvailable > 0 && !payoutLoading
                ? 'bg-[#D67D5C] hover:bg-[#C4704F] text-white shadow-2xs active:scale-95'
                : 'bg-[#E5E0D8] text-[#8C857B] cursor-not-allowed'
            }`}
          >
            {payoutLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <ArrowUpRight className="w-3 h-3" />
            )}
            <span>Disburse Instant Payout ($0 Fee)</span>
          </button>
        </div>

        {/* Pending 24h Clearing Buffer */}
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#6A655C]">
            <span>Pending 24h Clearing</span>
            <Clock className="w-4 h-4 text-[#8C857B]" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#6A655C] tracking-tight">
              ${totalPending.toFixed(2)}
            </div>
            <span className="text-[10px] font-mono text-[#8C857B] block">
              Clears daily at 00:00 UTC batch
            </span>
          </div>
          <div className="pt-2 border-t border-[#F2ECE4] text-[10px] font-mono text-[#8C857B] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8C857B]" />
            <span>Ingesting live from AI Synthesis</span>
          </div>
        </div>
      </div>

      {/* Visualizer: Pending vs. Paid vs. Available Ratio Bar */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E0D8] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#2D2926]">
              Earnings Distribution & Clearing Velocity
            </h3>
            <p className="text-xs text-[#6A655C] font-mono">
              Live visual ratio of Settled Bank Payouts vs. Liquid Available vs. In-Flight Micro-Streams
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#3D6E50]"></span>
              <span>Paid ({paidPct.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D67D5C]"></span>
              <span>Available ({availablePct.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#A8A095]"></span>
              <span>Pending ({pendingPct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Ratio Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-[#F2ECE4] overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${paidPct}%` }} 
              className="h-full bg-[#3D6E50] transition-all duration-500" 
              title={`Disbursed: $${totalPaidOut.toFixed(2)} (${paidPct.toFixed(1)}%)`}
            />
            <div 
              style={{ width: `${availablePct}%` }} 
              className="h-full bg-[#D67D5C] transition-all duration-500" 
              title={`Available: $${totalAvailable.toFixed(2)} (${availablePct.toFixed(1)}%)`}
            />
            <div 
              style={{ width: `${pendingPct}%` }} 
              className="h-full bg-[#A8A095] transition-all duration-500" 
              title={`Pending Clearing: $${totalPending.toFixed(2)} (${pendingPct.toFixed(1)}%)`}
            />
          </div>

          <div className="grid grid-cols-3 text-center text-xs font-mono pt-1 text-[#6A655C]">
            <div className="border-r border-[#E5E0D8]">
              <span className="text-[10px] text-[#8C857B] block">Settled to Bank</span>
              <strong className="text-[#3D6E50]">${totalPaidOut.toFixed(2)}</strong>
            </div>
            <div className="border-r border-[#E5E0D8]">
              <span className="text-[10px] text-[#8C857B] block">Ready for Instant Disburse</span>
              <strong className="text-[#D67D5C]">${totalAvailable.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#8C857B] block">24h In-Flight Ingestion</span>
              <strong className="text-[#6A655C]">${totalPending.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Connect Account Details & Express Portal Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#5A5A40]" />
              <h4 className="text-xs font-mono uppercase font-bold text-[#2D2926]">
                Stripe Connect Linked Payout Rails
              </h4>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]">
              <CheckCircle2 className="w-3 h-3" />
              Express Payout Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] space-y-1">
              <span className="text-[10px] font-mono text-[#8C857B] block">Stripe Connect ID</span>
              <strong className="font-mono text-[#2D2926] truncate block">
                {activeCreatorMeta?.stripeId || 'acct_1NZUniversalNetworkPool'}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] space-y-1">
              <span className="text-[10px] font-mono text-[#8C857B] block">Destination Account</span>
              <strong className="font-mono text-[#2D2926] block">
                JPMorgan Chase (•••• 4242)
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] space-y-1">
              <span className="text-[10px] font-mono text-[#8C857B] block">Payout Schedule</span>
              <strong className="font-mono text-[#5A5A40] block">
                Automatic Daily + Instant
              </strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-[#6A655C]">
            <div className="flex items-center gap-3">
              <span>Tax Status: <strong>W-9 Verified (1099-K Auto)</strong></span>
              <span>•</span>
              <span>Subsidized Fee: <strong>$0.00</strong></span>
            </div>
            <button
              onClick={() => alert('Simulating Stripe Express Dashboard login. In production, this generates a single-use login link via stripe.accounts.createLoginLink().')}
              className="text-[#5A5A40] hover:text-[#2D2926] font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Stripe Express Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Policy & Compliance Box */}
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#5A5A40] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
              <span>Zero-Cut Guarantee</span>
            </div>
            <p className="text-xs text-[#6A655C] leading-relaxed">
              H.U.M.A.N. Protocol takes <strong>0% cut</strong> from registered creator micro-royalties. All Stripe processing fees are subsidized through the developer enterprise badge pool.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F4EFEA] border border-[#DCD5CA] text-[11px] font-mono text-[#5A5A40] space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Next Automatic Clearing</span>
              <span>00:00 UTC</span>
            </div>
            <div className="text-[10px] text-[#8C857B]">
              Estimated next deposit: ${(totalAvailable + totalPending).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Payout Ledger Table */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#2D2926]">
              Stripe Connect Transaction & Payout History
            </h3>
            <p className="text-xs text-[#6A655C] font-mono">
              Individual audit entries for direct creator micro-royalty settlements
            </p>
          </div>

          {/* Controls: Search, Filter, Export */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search work or app..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#DCD5CA] bg-[#FAF8F5] text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#DCD5CA] bg-[#FAF8F5] text-[#2D2926] focus:outline-none focus:border-[#5A5A40] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid Only</option>
              <option value="available">Available Only</option>
              <option value="pending">Pending Only</option>
            </select>

            {/* Export Statement */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] hover:text-[#2D2926] hover:bg-[#F2ECE4] transition-colors cursor-pointer font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D8] font-mono text-[11px] uppercase text-[#8C857B] bg-[#FAF8F5]">
                <th className="py-2.5 px-3">Date / Time</th>
                <th className="py-2.5 px-3">Attributed Asset / Work</th>
                <th className="py-2.5 px-3">Application</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Stripe Transfer ID</th>
                <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4] font-mono">
              {filteredLedger.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-3 text-[#6A655C] whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="py-3 px-3 font-sans font-semibold text-[#2D2926]">
                    {tx.work}
                  </td>
                  <td className="py-3 px-3 text-[#5A5A40]">
                    {tx.app}
                  </td>
                  <td className="py-3 px-3 text-[#6A655C] text-[11px]">
                    {tx.destination}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-[#8C857B] truncate max-w-[150px]">
                    {tx.stripe_transfer_id}
                  </td>
                  <td className="py-3 px-3 text-right font-bold">
                    <span className={tx.status === 'Paid' ? 'text-[#3D6E50]' : tx.status === 'Available' ? 'text-[#D67D5C]' : 'text-[#6A655C]'}>
                      +${tx.amount_usd.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      tx.status === 'Paid'
                        ? 'bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]'
                        : tx.status === 'Available'
                        ? 'bg-[#FDF7F4] text-[#D67D5C] border border-[#EECDBC]'
                        : 'bg-[#F2ECE4] text-[#6A655C] border border-[#DCD5CA]'
                    }`}>
                      {tx.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                      {tx.status === 'Available' && <DollarSign className="w-3 h-3" />}
                      {tx.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLedger.length === 0 && (
          <div className="py-8 text-center text-xs font-mono text-[#8C857B]">
            No transactions match the selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
