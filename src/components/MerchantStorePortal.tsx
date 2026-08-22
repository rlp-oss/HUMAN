import React, { useState, useEffect } from 'react';
import { 
  Store, 
  QrCode, 
  DollarSign, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Landmark, 
  Receipt, 
  Coins, 
  Search, 
  ShoppingBag, 
  Stethoscope, 
  Sprout, 
  Users, 
  AlertCircle,
  Download,
  Share2,
  Lock,
  Cpu
} from 'lucide-react';
import { 
  MerchantStoreProfile, 
  MerchantPOSScanEvent, 
  RoleWalletAccount, 
  RoleWalletType 
} from '../types';
import { HumanInitiativeService } from '../services/humanInitiativeService';

interface MerchantStorePortalProps {
  onNavigateToInitiative?: () => void;
}

export const MerchantStorePortal: React.FC<MerchantStorePortalProps> = ({
  onNavigateToInitiative
}) => {
  const [merchants, setMerchants] = useState<MerchantStoreProfile[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantStoreProfile | null>(null);
  const [wallets, setWallets] = useState<RoleWalletAccount[]>([]);
  const [scanEvents, setScanEvents] = useState<MerchantPOSScanEvent[]>([]);

  // Onboarding Form State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<MerchantStoreProfile['category']>('Grocery & Food Market');
  const [contactEmail, setContactEmail] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [reportedNetWorthUsd, setReportedNetWorthUsd] = useState<number>(500000);
  const [pledgePercent, setPledgePercent] = useState<number>(1.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardSuccessStore, setOnboardSuccessStore] = useState<MerchantStoreProfile | null>(null);

  // POS Scanner State
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<string>('');
  const [tokenTypeToRedeem, setTokenTypeToRedeem] = useState<RoleWalletType>('$FOOD');
  const [tokenUnitsToRedeem, setTokenUnitsToRedeem] = useState<number>(35);
  const [itemDescription, setItemDescription] = useState('Fresh Organic Food & Pantry Staples');
  const [isProcessingRedemption, setIsProcessingRedemption] = useState(false);
  const [latestReceipt, setLatestReceipt] = useState<MerchantPOSScanEvent | null>(null);

  const loadData = () => {
    const m = HumanInitiativeService.getMerchants();
    const w = HumanInitiativeService.getRoleWallets();
    const s = HumanInitiativeService.getPOSScanEvents();
    setMerchants(m);
    setWallets(w);
    setScanEvents(s);
    if (m.length > 0 && !selectedMerchant) {
      setSelectedMerchant(m[0]);
    }
    if (w.length > 0 && !selectedWalletAddress) {
      setSelectedWalletAddress(w[0].walletAddress);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactEmail || !locationCity) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newMerchant = HumanInitiativeService.registerMerchant({
        businessName,
        category,
        contactEmail,
        locationCity,
        reportedNetWorthUsd,
        pledgeTierPercent: pledgePercent,
      });

      setMerchants(HumanInitiativeService.getMerchants());
      setSelectedMerchant(newMerchant);
      setOnboardSuccessStore(newMerchant);
      setIsSubmitting(false);
      setIsRegisterOpen(false);
      
      // Reset form
      setBusinessName('');
      setContactEmail('');
      setLocationCity('');
    }, 600);
  };

  const handleProcessRedemption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchant || !selectedWalletAddress) return;
    setIsProcessingRedemption(true);

    setTimeout(() => {
      const result = HumanInitiativeService.processPOSRedemption({
        storeId: selectedMerchant.storeId,
        customerWalletAddress: selectedWalletAddress,
        tokenType: tokenTypeToRedeem,
        tokenUnits: Number(tokenUnitsToRedeem),
        itemDescription: itemDescription || 'Essential goods redemption'
      });

      setLatestReceipt(result.scanEvent);
      loadData();
      setIsProcessingRedemption(false);
    }, 700);
  };

  const selectedWallet = wallets.find(w => w.walletAddress === selectedWalletAddress);
  const currentTokenBalance = selectedWallet ? (
    tokenTypeToRedeem === '$FOOD' ? selectedWallet.balances.FOOD :
    tokenTypeToRedeem === '$MED' ? selectedWallet.balances.MED :
    tokenTypeToRedeem === '$EARTH' ? selectedWallet.balances.EARTH :
    tokenTypeToRedeem === '$INFR' ? selectedWallet.balances.INFR :
    selectedWallet.balances.CREW
  ) : 0;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Banner / Philosophy */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F5] to-[#F2ECE4] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5A5A40]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5A40]/10 border border-[#5A5A40]/20 text-xs font-mono text-[#5A5A40] font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>The Human Initiative Merchant & Clinic Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#2D2926] tracking-tight">
            Local Commerce & Point-of-Sale Terminal
          </h1>
          <p className="text-sm sm:text-base text-[#6A655C] leading-relaxed">
            Every business and clinic receives a unique cryptographic <strong>Store ID & QR Code</strong>. 
            Signups start with a <strong>1% Net Worth Investment</strong> into the global pool for humanity&apos;s needs—not a loan, but an investment into the post-scarcity future where basic survival is guaranteed and commerce serves human thriving.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Register New Store / Clinic</span>
            </button>
            {onNavigateToInitiative && (
              <button
                onClick={onNavigateToInitiative}
                className="px-4 py-2.5 rounded-xl border border-[#DCD5CA] bg-white hover:bg-[#F2ECE4] text-[#2D2926] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-[#D67D5C]" />
                <span>View Full Initiative Urgency Tiers</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Onboard Success Notification */}
      {onboardSuccessStore && (
        <div className="rounded-2xl border-2 border-[#3D6E50] bg-[#FAF8F5] p-5 space-y-3 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#3D6E50] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Store Registered Successfully • Store ID: {onboardSuccessStore.storeId}</span>
            </div>
            <button 
              onClick={() => setOnboardSuccessStore(null)}
              className="text-xs text-[#8C857B] hover:text-[#2D2926]"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-[#6A655C]">
            <strong>{onboardSuccessStore.businessName}</strong> has been bound to the Human Initiative Merchant Network with a <strong>1% Net Worth Pledge (${onboardSuccessStore.annualPledgeContributionUsd.toLocaleString()})</strong>. Your Store QR code and Stripe Connect payout rails are active.
          </p>
        </div>
      )}

      {/* Main Grid: Store Selector + QR Terminal + POS Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Store & QR Code (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Store Switcher */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D2926] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#5A5A40]" />
                <span>Select Active Store Profile</span>
              </h3>
              <span className="text-[11px] font-mono text-[#8C857B]">
                {merchants.length} Registered Stores
              </span>
            </div>

            <div className="space-y-2">
              {merchants.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMerchant(m)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left ${
                    selectedMerchant?.id === m.id
                      ? 'border-[#5A5A40] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#E5E0D8] bg-white hover:border-[#DCD5CA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2D2926]">{m.businessName}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F2ECE4] text-[#5A5A40] font-bold">
                      {m.storeId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[#6A655C]">
                    <span>{m.category} • {m.locationCity}</span>
                    <span className="text-[#3D6E50] font-bold">1% Pledge: ${m.annualPledgeContributionUsd.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scannable Store QR Code Card */}
          {selectedMerchant && (
            <div className="rounded-3xl border-2 border-[#5A5A40]/30 bg-gradient-to-b from-[#FFFFFF] to-[#FAF8F5] p-6 space-y-4 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#5A5A40] font-bold">
                <QrCode className="w-4 h-4" />
                <span>OFFICIAL STORE QR CODE</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] inline-block shadow-xs">
                <img
                  src={selectedMerchant.qrCodeUrl}
                  alt={`QR Code for ${selectedMerchant.businessName}`}
                  className="w-48 h-48 mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h4 className="font-bold text-base text-[#2D2926]">{selectedMerchant.businessName}</h4>
                <p className="font-mono text-xs text-[#5A5A40] font-bold mt-0.5">{selectedMerchant.storeId}</p>
                <p className="text-[11px] text-[#8C857B] mt-1">{selectedMerchant.locationCity} • Connected to Stripe: {selectedMerchant.stripeAccountId}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-left border-t border-[#E5E0D8] text-xs">
                <div className="p-2.5 rounded-xl bg-[#F2ECE4]/60">
                  <span className="text-[10px] text-[#8C857B] block">Total Redeemed</span>
                  <span className="font-bold text-[#3D6E50] font-mono text-sm">
                    ${selectedMerchant.totalRedemptionsUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F2ECE4]/60">
                  <span className="text-[10px] text-[#8C857B] block">Pledge Status</span>
                  <span className="font-bold text-[#5A5A40] font-mono text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#3D6E50]" />
                    1% Net Worth
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: POS Scanner Terminal & Redemptions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* POS Terminal Form */}
          <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#D67D5C]" />
                  <span>Point-of-Sale Token Redemption Terminal</span>
                </h3>
                <p className="text-xs text-[#6A655C]">
                  Verify customer role-based tokens ($FOOD, $MED, $EARTH) and disburse instant Stripe Connect reimbursements.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF0EC] text-[#D67D5C] font-mono text-xs font-bold border border-[#EECDBC]">
                POS v2.4 Live
              </span>
            </div>

            <form onSubmit={handleProcessRedemption} className="space-y-4">
              {/* Customer Wallet Selector (Simulated QR Scan) */}
              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1.5 flex items-center justify-between">
                  <span>Customer Wallet (Scanned via Token QR)</span>
                  <span className="text-[10px] text-[#8C857B] font-mono">5 Demo Beneficiaries</span>
                </label>
                <select
                  value={selectedWalletAddress}
                  onChange={(e) => setSelectedWalletAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.walletAddress}>
                      {w.holderName} ({w.holderRole} • Multiplier: {w.laborDifficultyMultiplier}x) — {w.walletAddress.substring(0, 18)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Token Type & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                    Redemption Token Type
                  </label>
                  <select
                    value={tokenTypeToRedeem}
                    onChange={(e) => setTokenTypeToRedeem(e.target.value as RoleWalletType)}
                    className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                  >
                    <option value="$FOOD">$FOOD — Groceries, Produce & Nutrition ($1.00 USD/token)</option>
                    <option value="$MED">$MED — Healthcare, Clinic Co-pays & Medicine ($1.00 USD/token)</option>
                    <option value="$EARTH">$EARTH — Soil Regeneration & Agriculture ($1.00 USD/token)</option>
                    <option value="$INFR">$INFR — Infrastructure & Hardware ($1.00 USD/token)</option>
                    <option value="$CREW">$CREW — Community Co-op & Care ($1.00 USD/token)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1.5 flex items-center justify-between">
                    <span>Units to Redeem</span>
                    <span className="text-[10px] font-mono text-[#5A5A40]">
                      Available: {currentTokenBalance} {tokenTypeToRedeem}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={currentTokenBalance || 1000}
                      value={tokenUnitsToRedeem}
                      onChange={(e) => setTokenUnitsToRedeem(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] font-mono font-bold focus:outline-hidden focus:border-[#5A5A40]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-[#8C857B] font-mono">
                      = ${(tokenUnitsToRedeem).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Item Description */}
              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                  Goods / Services Description
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="e.g. Organic Produce Basket, Antibiotic Prescription, Heirloom Seeds"
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isProcessingRedemption || currentTokenBalance < tokenUnitsToRedeem}
                className="w-full py-3 rounded-xl bg-[#D67D5C] hover:bg-[#C06B4C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isProcessingRedemption ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Settling via Stripe Connect & Tier 1 Pool...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Redeem {tokenUnitsToRedeem} {tokenTypeToRedeem} (${tokenUnitsToRedeem}.00 USD)</span>
                  </>
                )}
              </button>
            </form>

            {/* Latest Receipt Modal / Card */}
            {latestReceipt && (
              <div className="p-4 rounded-2xl border border-[#3D6E50]/40 bg-[#FAF8F5] space-y-2 text-xs animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between font-bold text-[#3D6E50]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Redemption Settled Successfully</span>
                  </span>
                  <span className="font-mono text-[10px]">{latestReceipt.receiptHash}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6A655C]">
                  <div>
                    <span className="text-[#8C857B]">Store:</span> {latestReceipt.storeName}
                  </div>
                  <div>
                    <span className="text-[#8C857B]">Disbursed:</span> ${latestReceipt.usdEquivalent.toFixed(2)} USD via Stripe
                  </div>
                  <div>
                    <span className="text-[#8C857B]">Item:</span> {latestReceipt.itemDescription}
                  </div>
                  <div>
                    <span className="text-[#8C857B]">Timestamp:</span> {new Date(latestReceipt.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* POS Scan Ledger */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Recent Merchant Redemptions & Receipts</span>
              </h4>
              <span className="text-[10px] font-mono text-[#8C857B]">
                {scanEvents.length} Recorded
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {scanEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#2D2926] flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#E5E0D8] text-[10px] font-mono font-bold">
                        {evt.tokenType}
                      </span>
                      <span>{evt.itemDescription}</span>
                    </div>
                    <div className="text-[11px] text-[#8C857B] font-mono">
                      {evt.storeName} • Hash: {evt.receiptHash.substring(0, 16)}...
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-[#3D6E50] block">
                      +${evt.usdEquivalent.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#5A5A40]">Stripe Settled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Register New Store */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#2D2926] flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#5A5A40]" />
                  <span>Register Store / Business</span>
                </h3>
                <p className="text-xs text-[#6A655C] mt-0.5">
                  Join the Human Initiative with a 1% Net Worth investment into the collective foundation.
                </p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-xs font-mono text-[#8C857B] hover:text-[#2D2926]"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleRegisterMerchant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Business / Clinic Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Red Deer Organic Co-op, Prairie Healing Clinic"
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Store Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                  >
                    <option value="Grocery & Food Market">Grocery & Food Market</option>
                    <option value="Pharmacy & Health Clinic">Pharmacy & Health Clinic</option>
                    <option value="Hardware & Agriculture">Hardware & Agriculture</option>
                    <option value="Social Co-op & Services">Social Co-op & Services</option>
                    <option value="Artisan Shop">Artisan Shop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2926] mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    required
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="e.g. Red Deer, AB"
                    className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2926] mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="manager@storename.org"
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                />
              </div>

              {/* Net Worth & 1% Pledge Calculation */}
              <div className="p-4 rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#2D2926]">
                    Self-Reported Business Scale / Net Worth
                  </label>
                  <span className="font-mono text-xs font-bold text-[#5A5A40]">
                    ${reportedNetWorthUsd.toLocaleString()} USD
                  </span>
                </div>

                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={25000}
                  value={reportedNetWorthUsd}
                  onChange={(e) => setReportedNetWorthUsd(Number(e.target.value))}
                  className="w-full accent-[#5A5A40]"
                />

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8] text-xs">
                  <span className="text-[#6A655C]">1% Annual Investment into Fund:</span>
                  <span className="font-bold text-[#3D6E50] font-mono text-sm">
                    ${((reportedNetWorthUsd * pledgePercent) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
                <p className="text-[10.5px] text-[#8C857B] leading-relaxed">
                  *This is an investment in humanity&apos;s collective abundance—eliminating poverty and fear so that communities thrive and support local commerce.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6A655C] hover:bg-[#F2ECE4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Store ID & QR Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Store Registration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
