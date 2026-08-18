import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Lock, 
  Code, 
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Power,
  Link as LinkIcon,
  Unlink,
  Radio,
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HumanLogo } from './HumanLogo';

interface HumanBadgeWidgetProps {
  isLinked?: boolean;
  isActivated?: boolean;
  onToggleActivation?: (linked: boolean, activated: boolean) => void;
}

export const HumanBadgeWidget: React.FC<HumanBadgeWidgetProps> = ({
  isLinked: propIsLinked,
  isActivated: propIsActivated,
  onToggleActivation
}) => {
  // Persistence in localStorage so user's choice persists across tabs
  const [isLinked, setIsLinked] = useState<boolean>(() => {
    const saved = localStorage.getItem('human_badge_linked');
    return saved !== null ? saved === 'true' : (propIsLinked ?? true);
  });
  
  const [isActivated, setIsActivated] = useState<boolean>(() => {
    const saved = localStorage.getItem('human_badge_activated');
    return saved !== null ? saved === 'true' : (propIsActivated ?? true);
  });

  // Royalty payment & balance replenishment state
  const [royaltyBalance, setRoyaltyBalance] = useState<number>(() => {
    const saved = localStorage.getItem('human_royalty_balance');
    return saved !== null ? parseFloat(saved) : 250.0;
  });

  const [selectedTheme, setSelectedTheme] = useState<'natural-olive' | 'warm-clay' | 'minimal-light' | 'charcoal-dark'>('natural-olive');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appIdInput, setAppIdInput] = useState('app_reforge_ssp_99');
  const [developerName, setDeveloperName] = useState('Cody Germain');
  const [stripeAccountId, setStripeAccountId] = useState('acct_1NzkEthicalDev99x');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showReplenishModal, setShowReplenishModal] = useState(false);
  const [replenishAmount, setReplenishAmount] = useState('100');

  useEffect(() => {
    localStorage.setItem('human_badge_linked', String(isLinked));
    localStorage.setItem('human_badge_activated', String(isActivated));
    localStorage.setItem('human_royalty_balance', String(royaltyBalance));
    if (onToggleActivation) {
      onToggleActivation(isLinked, isActivated && royaltyBalance > 0);
    }
  }, [isLinked, isActivated, royaltyBalance, onToggleActivation]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 3000);
  };

  const isRoyaltiesPaid = royaltyBalance > 0;
  const isBadgeFullyActive = isLinked && isActivated && isRoyaltiesPaid;
  const isDelinquent = isLinked && isActivated && !isRoyaltiesPaid;

  const reactSnippet = isBadgeFullyActive 
    ? `import { HumanEthicalBadge } from '@human-network/badge-react';

export default function App() {
  return (
    <div className="app-container">
      {/* H.U.M.A.N. Ethical AI Builder Badge (STATUS: ACTIVE & FUNDED) */}
      {/* Note: If royalties are not paid, this badge disappears and displays the */}
      {/* "Earn your badge: Pay artist royalties" banner. To remove, delete this tag. */}
      <HumanEthicalBadge 
        appId="${appIdInput}"
        builder="${developerName}"
        stripeAccount="${stripeAccountId}"
        theme="${selectedTheme}"
        microRoyaltyPoolActive={true}
        zeroCopyleftEnforced={true}
      />
    </div>
  );
}`
    : isDelinquent
    ? `/* 
 * H.U.M.A.N. PROTOCOL NOTICE: 
 * Royalties are currently UNPAID (Balance: $0.00).
 * The badge has disappeared and is replaced by the "Earn your badge: Pay artist royalties" banner.
 * Developers can remove the banner from their UI at any time by deleting this embed component.
 */
import { HumanEthicalBadge } from '@human-network/badge-react';

export default function App() {
  return (
    <div className="app-container">
      {/* Currently rendering "Earn your badge: Pay artist royalties" banner */}
      <HumanEthicalBadge 
        appId="${appIdInput}"
        fallbackBanner="earn-your-badge"
      />
    </div>
  );
}`
    : `/* 
 * H.U.M.A.N. PROTOCOL NOTICE:
 * The badge below will NOT populate because it is not linked or activated.
 * To remove completely, delete the embed snippet below.
 */
import { HumanEthicalBadge } from '@human-network/badge-react';

export default function App() {
  return (
    <div className="app-container">
      {/* Badge will not render until activated in H.U.M.A.N. Console */}
      <HumanEthicalBadge 
        appId="${appIdInput}"
        status="unlinked_inactive"
      />
    </div>
  );
}`;

  const htmlSnippet = isBadgeFullyActive
    ? `<!-- H.U.M.A.N. Ethical AI Builder Badge (LINKED & FUNDED) -->
<!-- If royalties are not paid, banner displays until replenished. Delete tag to remove. -->
<div id="human-ethical-badge" 
     data-app-id="${appIdInput}"
     data-builder="${developerName}" 
     data-stripe-account="${stripeAccountId}"
     data-reforge-audit="0x89f4b3c9e21a4401"
     data-theme="${selectedTheme}"
     data-status="active">
</div>
<script src="https://cdn.human-network.org/badge/v2/human-badge.js" async></script>`
    : isDelinquent
    ? `<!-- H.U.M.A.N. Badge: UNPAID ROYALTIES ($0.00 Balance) -->
<!-- Renders "Earn your badge: Pay artist royalties" banner. Delete tag to remove. -->
<div id="human-ethical-badge" 
     data-app-id="${appIdInput}" 
     data-status="unpaid_royalties_banner">
</div>
<script src="https://cdn.human-network.org/badge/v2/human-badge.js" async></script>`
    : `<!-- H.U.M.A.N. Badge: INACTIVE (Will not populate on screen until linked & activated) -->
<div id="human-ethical-badge" 
     data-app-id="${appIdInput}" 
     data-status="unlinked">
</div>
<script src="https://cdn.human-network.org/badge/v2/human-badge.js" async></script>`;

  const handleActivateAndLink = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsLinked(true);
      setIsActivated(true);
      if (royaltyBalance <= 0) {
        setRoyaltyBalance(250.0);
      }
      setIsProcessing(false);
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5A5A40', '#D67D5C', '#8C857B', '#2D2926'],
      });
      showToast('Badge successfully linked, activated, and funded with micro-royalties!');
    }, 800);
  };

  const handleDeactivate = () => {
    setIsActivated(false);
    setIsLinked(false);
    showToast('Badge deactivated and unlinked. The badge will no longer populate.');
  };

  const handleSimulateUnpaidRoyalties = () => {
    setRoyaltyBalance(0.0);
    showToast('Simulating Unpaid Royalties: Badge has disappeared and is replaced by the "Earn your badge" banner.');
  };

  const handleReplenishBalance = (amountNum: number) => {
    setRoyaltyBalance(prev => prev + amountNum);
    setShowReplenishModal(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#5A5A40', '#D67D5C', '#8C857B'],
    });
    showToast(`Royalty pool balance replenished (+$${amountNum.toFixed(2)})! Verified badge restored.`);
  };

  const handleSimulateQRScan = () => {
    if (!isBadgeFullyActive) {
      showToast('Cannot scan QR: Badge is inactive or royalties are unpaid.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#5A5A40', '#D67D5C'],
      });
      showToast('Micro-QR Code Audit Verified: Zero-copyleft covenant and royalties in good standing.');
    }, 600);
  };

  return (
    <div className="space-y-6 text-[#2D2926]">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#5A5A40]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Replenish Royalty Balance Modal */}
      {showReplenishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFFFF] border border-[#DCD5CA] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#5A5A40] border border-[#5A5A40]/30">
                  <Zap className="w-4 h-4 text-[#5A5A40]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D2926]">Replenish Artist Royalty Pool</h3>
                  <p className="text-[11px] font-mono text-[#6A655C]">Restore verified ethical badge</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReplenishModal(false)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#6A655C] space-y-1">
                <div className="flex justify-between text-[#2D2926] font-semibold">
                  <span>Current Royalty Balance:</span>
                  <span className={royaltyBalance > 0 ? 'text-[#5A5A40]' : 'text-[#D67D5C]'}>
                    ${royaltyBalance.toFixed(2)} USD
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Micro-royalties stream automatically to sampled human artists and creators. Adding funds clears all delinquency and reactivates the H.U.M.A.N. badge.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#6A655C] mb-1.5 uppercase font-semibold">
                  Select Replenishment Amount
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['25', '50', '100', '250'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setReplenishAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        replenishAmount === amt
                          ? 'bg-[#5A5A40] text-white border border-[#4A4A33] shadow-2xs'
                          : 'bg-[#FAF8F5] text-[#2D2926] border border-[#E5E0D8] hover:border-[#5A5A40]/50'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#6A655C] mb-1">
                  Or Custom Amount ($ USD)
                </label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={replenishAmount}
                  onChange={(e) => setReplenishAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD5CA] text-xs font-mono focus:outline-hidden focus:border-[#5A5A40] bg-[#FAF8F5]"
                  placeholder="Enter custom amount"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setShowReplenishModal(false)}
                className="px-3.5 py-2 rounded-xl border border-[#DCD5CA] text-xs font-semibold text-[#6A655C] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReplenishBalance(parseFloat(replenishAmount) || 50)}
                className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span>Replenish ${parseFloat(replenishAmount) || 50} (Stripe Connect)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-[11px] font-mono text-[#5A5A40] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>The Official Badge of Ethical AI Building</span>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2926] tracking-tight">
              H.U.M.A.N. Badge Activation & Royalty Console
            </h2>
            <p className="text-xs text-[#6A655C] leading-relaxed">
              <strong>Royalty & Activation Protocol:</strong> The badge only appears if the badge is linked, activated, and artist royalties are paid. If royalties are unpaid ($0.00 balance), the badge disappears and is replaced by the <em>"Earn your badge: Pay artist royalties"</em> banner until the balance is replenished. Developers can also remove the banner by deleting the badge embed from their code.
            </p>
          </div>

          {/* Quick Status Control Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {/* Royalty Balance Simulator Pill */}
            {isLinked && isActivated && (
              <div className="flex items-center gap-1.5">
                {isRoyaltiesPaid ? (
                  <button
                    onClick={handleSimulateUnpaidRoyalties}
                    className="px-3 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF0EC] text-[#D67D5C] border border-[#EECDBC] font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                    title="Simulate unpaid royalties to preview replacement banner"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D67D5C]" />
                    <span>Simulate $0 Unpaid</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReplenishModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#D67D5C] hover:bg-[#C4704F] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-white" />
                    <span>Pay Royalties (+$100)</span>
                  </button>
                )}
              </div>
            )}

            {isBadgeFullyActive ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#5A5A40]/40 text-[#5A5A40] text-xs font-mono font-bold shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-[#5A5A40] animate-pulse"></span>
                  <span>VERIFIED & FUNDED</span>
                </div>
                <button
                  onClick={handleDeactivate}
                  className="px-3 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF0EC] text-[#D67D5C] hover:text-[#C4704F] border border-[#EECDBC] font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                  title="Deactivate badge to test unlinked state"
                >
                  <Unlink className="w-3.5 h-3.5 text-[#D67D5C]" />
                  <span>Deactivate</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleActivateAndLink}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-[#F9F7F2]" />
                <span>{isProcessing ? 'Linking & Activating...' : 'Link & Activate Badge'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Activation & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Badge Stage (Conditional Populate) */}
        <div className="lg:col-span-6 rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 flex flex-col justify-between items-center space-y-6 relative shadow-2xs">
          <div className="w-full flex items-center justify-between border-b border-[#E5E0D8] pb-3">
            <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5A5A40]" />
              Live Badge Render Preview
            </span>
            
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isBadgeFullyActive ? 'bg-[#5A5A40] animate-ping' : 'bg-[#8C857B]'}`}></span>
              <span className="text-[11px] font-mono text-[#6A655C]">
                {isBadgeFullyActive ? 'Populating Live' : 'Not Populated (Inactive)'}
              </span>
            </div>
          </div>

          {/* Conditional Rendering Area: Shows badge ONLY IF linked, activated AND royalties paid */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] w-full min-h-[220px] flex justify-center items-center relative transition-all">
            {isBadgeFullyActive ? (
              /* 1. ACTIVE, LINKED & FUNDED STATE: THE BADGE POPULATES */
              <div 
                onClick={handleSimulateQRScan}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-102 rounded-2xl p-5 border shadow-md w-full max-w-md ${
                  selectedTheme === 'natural-olive'
                    ? 'bg-[#FFFFFF] border-[#5A5A40]/40 text-[#2D2926] shadow-[#5A5A40]/10'
                    : selectedTheme === 'warm-clay'
                    ? 'bg-[#FAF0EC] border-[#D67D5C]/50 text-[#2D2926] shadow-[#D67D5C]/10'
                    : selectedTheme === 'minimal-light'
                    ? 'bg-[#FFFFFF] border-[#DCD5CA] text-[#2D2926]'
                    : 'bg-[#2D2926] border-[#3E3E2B] text-[#F9F7F2]'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Fingerprint logo */}
                    <HumanLogo size="md" showText={false} animated={true} />

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black tracking-wider text-[11px] uppercase ${
                          selectedTheme === 'charcoal-dark' ? 'text-[#D67D5C]' : 'text-[#5A5A40]'
                        }`}>
                          ETHICAL AI BUILDER
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5A5A40] animate-ping"></span>
                      </div>
                      <div className={`font-bold text-sm flex items-center gap-1 ${
                        selectedTheme === 'charcoal-dark' ? 'text-[#FFFFFF]' : 'text-[#2D2926]'
                      }`}>
                        <span>H.U.M.A.N. Verified</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
                      </div>
                      <div className={`text-[10px] font-mono ${
                        selectedTheme === 'charcoal-dark' ? 'text-[#D4CCC1]' : 'text-[#6A655C]'
                      }`}>
                        Micro-Royalties Active (${royaltyBalance.toFixed(2)} Balance)
                      </div>
                    </div>
                  </div>

                  {/* Simulated Micro QR Code with embedded audit link */}
                  <div className="p-1 rounded bg-[#FFFFFF] border border-[#DCD5CA] ml-2 flex flex-col items-center shadow-2xs shrink-0">
                    <div className="w-8 h-8 grid grid-cols-4 gap-0.5 bg-[#5A5A40]/15 p-0.5 rounded">
                      <div className="bg-[#5A5A40]"></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div className="bg-[#5A5A40]"></div>
                      <div></div>
                      <div className="bg-[#5A5A40]"></div>
                    </div>
                    <span className="text-[7px] font-mono font-bold text-[#5A5A40] mt-0.5">SCAN</span>
                  </div>
                </div>
              </div>
            ) : isDelinquent ? (
              /* 2. UNPAID ROYALTIES STATE: BADGE DISAPPEARS, BANNER REPLACES IT */
              <div className="w-full max-w-lg rounded-2xl border-2 border-[#D67D5C] bg-[#FAF0EC] p-5 text-[#2D2926] shadow-md space-y-3.5 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#EECDBC] text-[#D67D5C] shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-[#D67D5C]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[#D67D5C] uppercase tracking-wide">
                        Earn your badge: Pay artist royalties
                      </h4>
                      <span className="text-[10px] font-mono bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#EECDBC] text-[#D67D5C] font-bold">
                        BALANCE: $0.00
                      </span>
                    </div>
                    <p className="text-xs text-[#2D2926] leading-relaxed">
                      Micro-royalties for this application are unpaid. The official H.U.M.A.N. verified badge has disappeared and is replaced by this notice until the balance is replenished.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-[#EECDBC]">
                  <div className="text-[11px] text-[#6A655C] font-mono">
                    <span className="font-semibold text-[#2D2926]">Embed Removal:</span> Delete the badge embed snippet from your code to remove this banner.
                  </div>
                  <button
                    onClick={() => setShowReplenishModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#D67D5C] hover:bg-[#C4704F] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-white" />
                    <span>Pay Artist Royalties</span>
                  </button>
                </div>
              </div>
            ) : (
              /* 3. UNLINKED / INACTIVE STATE: THE BADGE DOES NOT POPULATE */
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 max-w-md">
                <div className="p-3 rounded-full bg-[#FAF0EC] border border-[#EECDBC] text-[#D67D5C]">
                  <Lock className="w-6 h-6 text-[#D67D5C]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#2D2926]">
                    Badge Inactive — Not Populating
                  </h4>
                  <p className="text-xs text-[#6A655C] leading-relaxed">
                    The badge will <strong>not populate</strong> on client apps or websites until your developer account is linked with Stripe Connect and activated.
                  </p>
                </div>
                
                <button
                  onClick={handleActivateAndLink}
                  disabled={isProcessing}
                  className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span>{isProcessing ? 'Activating...' : 'Link & Activate Badge'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Selector (Active only when populated) */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#E5E0D8] pt-3">
            <span className="text-xs font-mono text-[#6A655C]">STYLE PRESET</span>
            <div className="flex flex-wrap gap-1.5">
              {(['natural-olive', 'warm-clay', 'minimal-light', 'charcoal-dark'] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => setSelectedTheme(th)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all cursor-pointer ${
                    selectedTheme === th
                      ? 'bg-[#5A5A40] text-white border border-[#4A4A33]'
                      : 'bg-[#FAF8F5] text-[#6A655C] border border-[#E5E0D8] hover:text-[#2D2926]'
                  }`}
                >
                  {th.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activation Stepper & Verification Proof */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Activation & Linking Workflow Box */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#5A5A40] font-bold">
                <FileCheck className="w-4 h-4 text-[#5A5A40]" />
                <span>3-Step Activation Protocol</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isBadgeFullyActive 
                  ? 'bg-[#FAF8F5] text-[#5A5A40] border-[#5A5A40]/40 font-bold'
                  : 'bg-[#FAF0EC] text-[#D67D5C] border-[#EECDBC]'
              }`}>
                {isBadgeFullyActive ? 'ALL 3 STEPS VERIFIED' : 'ACTIVATION REQUIRED'}
              </span>
            </div>

            {/* Stepper Steps */}
            <div className="space-y-3 text-xs">
              {/* Step 1: Stripe Connect Linking */}
              <div className={`p-3 rounded-xl border transition-all ${
                isLinked 
                  ? 'bg-[#FAF8F5] border-[#5A5A40]/30' 
                  : 'bg-[#FFFFFF] border-[#E5E0D8]'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1 rounded-full ${isLinked ? 'bg-[#5A5A40] text-white' : 'bg-[#E5E0D8] text-[#8C857B]'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-[#2D2926]">1. Link Stripe Connect Royalty Account</div>
                      <div className="text-[11px] text-[#6A655C] font-mono mt-0.5">
                        Routes micro-royalties from training set usage to the creator pool.
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#5A5A40] font-semibold shrink-0">
                    {isLinked ? 'Linked' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Step 2: Application ID Registration */}
              <div className={`p-3 rounded-xl border transition-all ${
                isLinked 
                  ? 'bg-[#FAF8F5] border-[#5A5A40]/30' 
                  : 'bg-[#FFFFFF] border-[#E5E0D8]'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1 rounded-full ${isLinked ? 'bg-[#5A5A40] text-white' : 'bg-[#E5E0D8] text-[#8C857B]'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-[#2D2926]">2. Register App ID & Audit Covenant</div>
                      <div className="text-[11px] text-[#6A655C] font-mono mt-0.5">
                        App ID: <code className="text-[#5A5A40] font-bold">{appIdInput}</code> (ReForgeOS 0-Copyleft Verified)
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#5A5A40] font-semibold shrink-0">
                    {isLinked ? 'Registered' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Step 3: Micro QR Embedded Activation */}
              <div className={`p-3 rounded-xl border transition-all ${
                isActivated 
                  ? 'bg-[#FAF8F5] border-[#5A5A40]/30' 
                  : 'bg-[#FFFFFF] border-[#E5E0D8]'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1 rounded-full ${isActivated ? 'bg-[#5A5A40] text-white' : 'bg-[#E5E0D8] text-[#8C857B]'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-[#2D2926]">3. Micro QR Cryptographic Activation</div>
                      <div className="text-[11px] text-[#6A655C] font-mono mt-0.5">
                        Embeds live QR hash <code className="text-[#5A5A40]">0x89f4b3c9...</code> for instant verification.
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#5A5A40] font-semibold shrink-0">
                    {isActivated ? 'Activated' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Action */}
            <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between">
              <span className="text-[11px] text-[#6A655C]">
                {isBadgeFullyActive 
                  ? 'Badge is live and visible on your deployments.' 
                  : 'Click below to link and activate your badge.'}
              </span>

              {isBadgeFullyActive ? (
                <button
                  onClick={handleDeactivate}
                  className="text-xs text-[#D67D5C] hover:text-[#C4704F] font-semibold underline cursor-pointer"
                >
                  Unlink & Deactivate
                </button>
              ) : (
                <button
                  onClick={handleActivateAndLink}
                  disabled={isProcessing}
                  className="px-3.5 py-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {isProcessing ? 'Activating...' : 'Link & Activate All'}
                </button>
              )}
            </div>
          </div>

          {/* Embed Code Tabs */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#5A5A40] font-bold">
                <Code className="w-4 h-4 text-[#5A5A40]" />
                <span>Embed Snippet (React / Next.js / HTML)</span>
              </div>

              <button
                onClick={() => copyToClipboard(reactSnippet, 'react')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#5A5A40] border border-[#DCD5CA] transition-colors cursor-pointer"
              >
                {copiedType === 'react' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Copy React</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="rounded-xl bg-[#2D2926] p-3.5 text-xs font-mono text-[#F9F7F2] overflow-x-auto border border-[#3E3E2B] scrollbar-thin">
                {reactSnippet}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8]">
              <span className="text-xs font-mono text-[#6A655C]">Vanilla HTML / Web Component</span>
              <button
                onClick={() => copyToClipboard(htmlSnippet, 'html')}
                className="text-xs font-mono text-[#5A5A40] hover:text-[#2D2926] flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-[#5A5A40]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Vanilla HTML</span>
              </button>
            </div>

            {/* Delinquency & Removal Protocol Callout */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] text-[#6A655C] space-y-1.5 mt-2">
              <div className="flex items-center gap-1.5 font-bold text-[#2D2926]">
                <Info className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Royalty Depletion & Removal Behavior:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 leading-relaxed">
                <li>
                  <strong className="text-[#2D2926]">Unpaid Royalties:</strong> If micro-royalties are not paid, the badge disappears and is replaced by the banner: <em>"Earn your badge: Pay artist royalties"</em> until the balance is replenished.
                </li>
                <li>
                  <strong className="text-[#2D2926]">Code Removal:</strong> Developers can remove the badge and banner from their site or app at any time by simply deleting the embed snippet tag from their codebase.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

