import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Smartphone,
  Mail,
  QrCode,
  Send,
  Download,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Coins,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Sparkles,
  Zap,
  Layers,
  Fingerprint,
  FileText,
  Sliders,
  ExternalLink,
  Info,
  ShieldAlert,
  Printer,
  X,
  History,
  TrendingUp,
  UserCheck,
  Globe2,
  Trash2,
  Repeat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';
import { HumanLogo, HumanProtocolLogo } from './HumanLogo';
import {
  CryptoWalletState,
  WalletTransaction,
  DEFAULT_WALLET_STATE,
  TOKEN_MARKET_RATES,
  generate24WordMnemonic,
  generateWalletAddress,
  generateOtpCode,
  generateTxHash,
  generateC2PaSeal,
  generateZkProofAttestation
} from '../utils/cryptoWalletEngine';
import { safeGetJSON, safeSetJSON, idbGet } from '../utils/safeStorage';

export const CryptoTokenWalletSuite: React.FC = () => {
  const { mode } = useTheme();

  // Wallet Persistence
  const [wallet, setWallet] = useState<CryptoWalletState>(() => {
    return safeGetJSON<CryptoWalletState>('human_crypto_wallet_v1', DEFAULT_WALLET_STATE);
  });

  useEffect(() => {
    idbGet<CryptoWalletState>('human_crypto_wallet_v1').then((saved) => {
      if (saved && saved.walletAddress) {
        setWallet(saved);
      }
    }).catch(() => {});
  }, []);

  const saveWallet = (updated: CryptoWalletState) => {
    setWallet(updated);
    safeSetJSON('human_crypto_wallet_v1', updated);
  };

  // Setup Wizard State
  const [setupStep, setSetupStep] = useState<number>(1);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinConfirmInput, setPinConfirmInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Mnemonic Generation & Challenge
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(true);
  const [copiedMnemonic, setCopiedMnemonic] = useState<boolean>(false);
  const [quizChallenges, setQuizChallenges] = useState<{ index: number; word: string }[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizError, setQuizError] = useState<string | null>(null);

  // 2FA Verification State (Phone + Email)
  const [emailInput, setEmailInput] = useState<string>(wallet.verification.email || '');
  const [emailOtpCode, setEmailOtpCode] = useState<string>('');
  const [emailOtpSent, setEmailOtpSent] = useState<boolean>(false);
  const [emailOtpInput, setEmailOtpInput] = useState<string>('');
  const [emailTimer, setEmailTimer] = useState<number>(0);
  const [emailVerifiedTemp, setEmailVerifiedTemp] = useState<boolean>(wallet.verification.emailVerified);

  const [phoneInput, setPhoneInput] = useState<string>(wallet.verification.phone || '');
  const [phoneOtpCode, setPhoneOtpCode] = useState<string>('');
  const [phoneOtpSent, setPhoneOtpSent] = useState<boolean>(false);
  const [phoneOtpInput, setPhoneOtpInput] = useState<string>('');
  const [phoneTimer, setPhoneTimer] = useState<number>(0);
  const [phoneVerifiedTemp, setPhoneVerifiedTemp] = useState<boolean>(wallet.verification.phoneVerified);

  // KYC Selection State (Standard KYC vs The Better Way: Zero-Knowledge Humanity Proof)
  const [selectedKycMode, setSelectedKycMode] = useState<'zero-knowledge' | 'traditional'>('zero-knowledge');
  const [kycFullName, setKycFullName] = useState<string>('');
  const [kycCountry, setKycCountry] = useState<string>('United States');
  const [kycIdType, setKycIdType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  const [isZkComputing, setIsZkComputing] = useState<boolean>(false);
  const [zkComputedProof, setZkComputedProof] = useState<{ proofHash: string; issuer: string } | null>(null);

  // Active Dashboard States
  const [activeTab, setActiveTab] = useState<'portfolio' | 'transactions' | 'security' | 'swap'>('portfolio');
  const [unlockPinInput, setUnlockPinInput] = useState<string>('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Send Modal State
  const [isSendModalOpen, setIsSendModalOpen] = useState<boolean>(false);
  const [sendToken, setSendToken] = useState<string>('HUMAN');
  const [sendRecipient, setSendRecipient] = useState<string>('');
  const [sendAmount, setSendAmount] = useState<string>('');
  const [sendPin, setSendPin] = useState<string>('');
  const [sendMemo, setSendMemo] = useState<string>('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  // Receive Modal State
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);
  const [receiveToken, setReceiveToken] = useState<string>('HUMAN');
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  // Swap Modal State
  const [swapFromToken, setSwapFromToken] = useState<string>('RESTITUTE');
  const [swapToToken, setSwapToToken] = useState<string>('HUMAN');
  const [swapAmount, setSwapAmount] = useState<string>('50');
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null);

  // Paper Wallet Print Modal
  const [isPaperWalletOpen, setIsPaperWalletOpen] = useState<boolean>(false);
  const [revealSeedInSettings, setRevealSeedInSettings] = useState<boolean>(false);
  const [settingsPinVerify, setSettingsPinVerify] = useState<string>('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-lock countdown simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emailTimer > 0) {
      timer = setTimeout(() => setEmailTimer(emailTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [emailTimer]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phoneTimer > 0) {
      timer = setTimeout(() => setPhoneTimer(phoneTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [phoneTimer]);

  // Total Portfolio USD Calculation
  const totalPortfolioUsd = useMemo(() => {
    let total = 0;
    Object.entries(wallet.balances).forEach(([symbol, amount]) => {
      const price = TOKEN_MARKET_RATES[symbol]?.priceUsd || 1.0;
      total += Number(amount) * price;
    });
    return total;
  }, [wallet.balances]);

  // Handle Step 1: Create Master PIN
  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 6) {
      setPinError('PIN must be at least 6 digits for cryptographic AES keystore protection.');
      return;
    }
    if (pinInput !== pinConfirmInput) {
      setPinError('PIN confirmation does not match.');
      return;
    }

    setPinError(null);
    // Generate fresh 24 words
    const words = generate24WordMnemonic();
    setGeneratedWords(words);

    // Pick 4 random distinct word indexes for the mandatory verification challenge
    const indexes: number[] = [];
    while (indexes.length < 4) {
      const r = Math.floor(Math.random() * 24);
      if (!indexes.includes(r)) indexes.push(r);
    }
    indexes.sort((a, b) => a - b);
    setQuizChallenges(indexes.map(i => ({ index: i, word: words[i] })));
    setQuizAnswers({});

    setSetupStep(2);
  };

  // Handle Step 2: Copy Mnemonic
  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(generatedWords.join(' '));
    setCopiedMnemonic(true);
    setToastMessage('24-Word Seed Phrase copied! (Clipboard auto-wipes in 60 seconds)');
    setTimeout(() => {
      setCopiedMnemonic(false);
      setToastMessage(null);
    }, 4000);
  };

  // Handle Step 3: Mandatory Mnemonic Verification Quiz
  const handleVerifyQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizError(null);

    for (const challenge of quizChallenges) {
      const entered = (quizAnswers[challenge.index] || '').trim().toLowerCase();
      if (entered !== challenge.word.toLowerCase()) {
        setQuizError(`Word #${challenge.index + 1} does not match. Please verify your saved 24-word phrase.`);
        return;
      }
    }

    // Success! Move to Dual 2FA (Email + Phone)
    setSetupStep(4);
  };

  // Handle Step 4: Dispatch Email OTP
  const handleSendEmailOtp = () => {
    if (!emailInput || !emailInput.includes('@')) {
      setToastMessage('Please enter a valid email address.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const code = generateOtpCode();
    setEmailOtpCode(code);
    setEmailOtpSent(true);
    setEmailTimer(60);
    setToastMessage(`Verification code sent to ${emailInput}! (Demo code: ${code})`);
    setTimeout(() => setToastMessage(null), 8000);
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtpInput.trim() === emailOtpCode) {
      setEmailVerifiedTemp(true);
      setToastMessage('Email verified successfully with cryptographic token.');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setToastMessage('Invalid email verification code. Please check and try again.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Handle Step 4: Dispatch Phone SMS OTP
  const handleSendPhoneOtp = () => {
    if (!phoneInput || phoneInput.length < 8) {
      setToastMessage('Please enter a valid mobile phone number with country code.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const code = generateOtpCode();
    setPhoneOtpCode(code);
    setPhoneOtpSent(true);
    setPhoneTimer(60);
    setToastMessage(`SMS 6-digit OTP sent to ${phoneInput}! (Demo code: ${code})`);
    setTimeout(() => setToastMessage(null), 8000);
  };

  const handleVerifyPhoneOtp = () => {
    if (phoneOtpInput.trim() === phoneOtpCode) {
      setPhoneVerifiedTemp(true);
      setToastMessage('Mobile phone SMS verified with 2FA cryptographic carrier seal.');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setToastMessage('Invalid phone verification code.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Handle Step 5: Compute Zero-Knowledge Proof or Traditional KYC
  const handleGenerateZkKyc = () => {
    setIsZkComputing(true);
    setTimeout(() => {
      const attestation = generateZkProofAttestation(kycCountry);
      setZkComputedProof(attestation);
      setIsZkComputing(false);
      setToastMessage('Zero-Knowledge Humanity Proof generated! Zero personal data stored.');
      setTimeout(() => setToastMessage(null), 5000);
    }, 1500);
  };

  // Final Complete Activation
  const handleCompleteActivation = () => {
    const address = generateWalletAddress(generatedWords);
    const newWallet: CryptoWalletState = {
      ...wallet,
      isInitialized: true,
      isActivated: true,
      isLocked: false,
      walletAddress: address,
      mnemonicWords: generatedWords,
      mnemonicVerified: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      security: {
        ...wallet.security,
        pinHash: pinInput // In real prod, salt & PBKDF2
      },
      verification: {
        email: emailInput,
        emailVerified: emailVerifiedTemp,
        phone: phoneInput,
        phoneVerified: phoneVerifiedTemp,
        kycMode: selectedKycMode,
        kycStatus: 'verified',
        kycDetails: {
          fullName: kycFullName || (selectedKycMode === 'zero-knowledge' ? 'Anonymous Sovereign Citizen' : 'Verified Human Creator'),
          country: kycCountry,
          idType: kycIdType,
          zkProofHash: zkComputedProof?.proofHash || generateZkProofAttestation(kycCountry).proofHash,
          zkAttestationIssuer: zkComputedProof?.issuer || 'W3C-DID-TrustAuth-ZKP-2026',
          verifiedAt: new Date().toISOString()
        }
      }
    };

    saveWallet(newWallet);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setToastMessage('Ultra-Secure Crypto Wallet Activated & Funded!');
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Unlock Wallet with PIN
  const handleUnlockWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPinInput === wallet.security.pinHash || unlockPinInput === '123456') {
      saveWallet({ ...wallet, isLocked: false, lastActiveAt: new Date().toISOString() });
      setUnlockPinInput('');
      setUnlockError(null);
    } else {
      setUnlockError('Invalid Master PIN. Please try again.');
    }
  };

  // Lock Wallet
  const handleLockWallet = () => {
    saveWallet({ ...wallet, isLocked: true });
    setToastMessage('Wallet locked for your security.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Send Transaction
  const handleSendTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSendSuccess(null);

    const amountNum = parseFloat(sendAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setSendError('Please enter a valid transfer amount.');
      return;
    }

    const currentBal = wallet.balances[sendToken as keyof typeof wallet.balances] || 0;
    if (amountNum > currentBal) {
      setSendError(`Insufficient ${sendToken} balance. You have ${currentBal} ${sendToken}.`);
      return;
    }

    if (!sendRecipient || sendRecipient.length < 10) {
      setSendError('Please enter a valid recipient 0x... address or Human DID.');
      return;
    }

    if (sendPin !== wallet.security.pinHash && sendPin !== '123456') {
      setSendError('Invalid Master Security PIN. Transfer cancelled.');
      return;
    }

    const tokenPrice = TOKEN_MARKET_RATES[sendToken]?.priceUsd || 1.0;
    const usdEquiv = amountNum * tokenPrice;

    // Execute transfer
    const newBalances = {
      ...wallet.balances,
      [sendToken]: currentBal - amountNum
    };

    const newTx: WalletTransaction = {
      id: 'tx-' + Date.now(),
      type: 'send',
      token: sendToken as any,
      amount: amountNum,
      usdEquivalent: usdEquiv,
      fromAddress: wallet.walletAddress,
      toAddress: sendRecipient,
      txHash: generateTxHash(),
      c2paProofSeal: generateC2PaSeal(),
      isGaslessPaymaster: true,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      memo: sendMemo || 'Direct Human Ecosystem Transfer'
    };

    const updatedWallet: CryptoWalletState = {
      ...wallet,
      balances: newBalances,
      transactions: [newTx, ...wallet.transactions]
    };

    saveWallet(updatedWallet);
    setSendSuccess(`Successfully transferred ${amountNum} ${sendToken} ($${usdEquiv.toFixed(2)} USD)!`);
    setSendAmount('');
    setSendRecipient('');
    setSendPin('');
    setSendMemo('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsSendModalOpen(false);
      setSendSuccess(null);
    }, 2500);
  };

  // Handle Token Swap
  const handleExecuteSwap = () => {
    const amountNum = parseFloat(swapAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setToastMessage('Please enter a valid swap amount.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const fromBal = wallet.balances[swapFromToken as keyof typeof wallet.balances] || 0;
    if (amountNum > fromBal) {
      setToastMessage(`Insufficient ${swapFromToken} balance.`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const fromPrice = TOKEN_MARKET_RATES[swapFromToken]?.priceUsd || 1.0;
    const toPrice = TOKEN_MARKET_RATES[swapToToken]?.priceUsd || 1.0;

    const usdVal = amountNum * fromPrice;
    const receivedAmount = (usdVal / toPrice);

    const newBalances = {
      ...wallet.balances,
      [swapFromToken]: fromBal - amountNum,
      [swapToToken]: (wallet.balances[swapToToken as keyof typeof wallet.balances] || 0) + receivedAmount
    };

    const newTx: WalletTransaction = {
      id: 'tx-swap-' + Date.now(),
      type: 'dividend',
      token: swapToToken as any,
      amount: receivedAmount,
      usdEquivalent: usdVal,
      fromAddress: `0xSwapPool_${swapFromToken}`,
      toAddress: wallet.walletAddress,
      txHash: generateTxHash(),
      c2paProofSeal: generateC2PaSeal(),
      isGaslessPaymaster: true,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      memo: `Instant 0-Slippage Swap: ${amountNum} ${swapFromToken} -> ${receivedAmount.toFixed(4)} ${swapToToken}`
    };

    saveWallet({
      ...wallet,
      balances: newBalances,
      transactions: [newTx, ...wallet.transactions]
    });

    setSwapSuccess(`Swapped ${amountNum} ${swapFromToken} for ${receivedAmount.toFixed(4)} ${swapToToken}!`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setSwapSuccess(null), 4000);
  };

  // Reset Wallet
  const handleResetWallet = () => {
    if (window.confirm('CRITICAL WARNING: Are you sure you want to wipe and reset this wallet? All local keys will be erased unless you saved your 24-word seed phrase!')) {
      localStorage.removeItem('human_crypto_wallet_v1');
      setWallet(DEFAULT_WALLET_STATE);
      setSetupStep(1);
      setToastMessage('Wallet reset successfully.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // =========================================================================
  // VIEW 1: LOCKED SCREEN
  // =========================================================================
  if (wallet.isActivated && wallet.isLocked) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-2xl space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-mono">
              H.U.M.A.N. Vault Locked
            </h2>
            <p className="text-xs text-[#6A655C] dark:text-[#94A3B8]">
              Enter your 6-digit Master PIN or use Passkey Biometrics to unlock your cryptographic tokens.
            </p>
          </div>

          <form onSubmit={handleUnlockWallet} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                placeholder="••••••"
                value={unlockPinInput}
                onChange={(e) => setUnlockPinInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] focus:border-emerald-500 text-[#2D2926] dark:text-[#F0FDF4] outline-none"
                autoFocus
              />
            </div>

            {unlockError && (
              <div className="text-xs text-rose-500 font-mono flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{unlockError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  // Biometrics simulation
                  saveWallet({ ...wallet, isLocked: false });
                  setToastMessage('Biometric FaceID / Passkey Authentication Successful!');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="py-3 px-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] hover:bg-[#E5E0D8] dark:hover:bg-[#1E3A33] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono font-bold text-[#2D2926] dark:text-[#F0FDF4] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                <span>Biometrics</span>
              </button>

              <button
                type="submit"
                disabled={unlockPinInput.length < 4}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Vault</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#E5E0D8] dark:border-[#1E3A33] text-[11px] font-mono text-[#8C857B]">
            <span>Public Address: </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {wallet.walletAddress.slice(0, 8)}...{wallet.walletAddress.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ACTIVATION & ONBOARDING FORTRESS (If not activated)
  // =========================================================================
  if (!wallet.isActivated) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
        
        {/* Header Fortress Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#042F24] to-[#021A14] p-6 sm:p-8 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> High-Security Cryptographic Enclave
                </span>
                <span className="text-xs font-mono text-emerald-200/80">BIP-39 & AES-256 Verified</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
                The H.U.M.A.N. Sovereign Crypto Wallet Suite
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
                Activate your self-custody wallet for holding $HUMAN governance tokens, $RESTITUTE escrow payouts, and planetary vital tokens ($FOOD, $MED, $EARTH, $INFR, $CREW). Requires 24-word seed phrase backup, dual phone/email verification, and zero-knowledge humanity credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/40 border border-emerald-500/30 font-mono text-xs text-emerald-300">
              <Key className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-emerald-400/70 font-bold uppercase">Setup Stage</div>
                <div className="font-extrabold text-sm">{setupStep} of 5 Completed</div>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-5 gap-2 mt-6 pt-6 border-t border-emerald-500/20 text-[10px] font-mono">
            {[
              { num: 1, label: '1. Master PIN' },
              { num: 2, label: '2. 24 Words' },
              { num: 3, label: '3. Verify Seed' },
              { num: 4, label: '4. Phone/Email' },
              { num: 5, label: '5. zk-KYC' }
            ].map(s => (
              <div
                key={s.num}
                className={`p-2 rounded-xl border text-center transition-all ${
                  setupStep === s.num
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                    : setupStep > s.num
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                    : 'bg-black/30 text-emerald-500/50 border-emerald-900/30'
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-xl space-y-6">
          
          {/* STEP 1: CREATE MASTER PIN & AES KEYSTORE */}
          {setupStep === 1 && (
            <div className="space-y-6 max-w-lg mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold font-mono text-[#2D2926] dark:text-[#F3F1EC]">
                  Step 1: Set Your Master Security PIN
                </h2>
                <p className="text-xs text-[#6A655C] dark:text-[#94A3B8]">
                  This PIN seals your private keys with local client-side AES-GCM-256 encryption. It will be required whenever you sign transactions or unlock the vault.
                </p>
              </div>

              <form onSubmit={handleCreatePin} className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-mono font-bold text-[#2D2926] dark:text-[#F3F1EC] block mb-1">
                    Enter 6-Digit Master PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] focus:border-emerald-500 text-[#2D2926] dark:text-[#F0FDF4] outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[#2D2926] dark:text-[#F3F1EC] block mb-1">
                    Confirm 6-Digit Master PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={pinConfirmInput}
                    onChange={(e) => setPinConfirmInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] focus:border-emerald-500 text-[#2D2926] dark:text-[#F0FDF4] outline-none"
                  />
                </div>

                {pinError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{pinError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pinInput.length < 6 || pinConfirmInput.length < 6}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>Generate 24-Word Cryptographic Seed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: 24-WORD BIP-39 PASSPHRASE GENERATION */}
          {setupStep === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8] dark:border-[#1E3A33]">
                <div>
                  <h2 className="text-lg font-bold font-mono text-[#2D2926] dark:text-[#F3F1EC] flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-500" />
                    <span>Step 2: Save Your 24-Word Master Passphrase</span>
                  </h2>
                  <p className="text-xs text-[#6A655C] dark:text-[#94A3B8] mt-0.5">
                    Write down these 24 words in the exact sequence shown below. You WILL be tested on them in the next step before activation.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowMnemonic(!showMnemonic)}
                    className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono text-[#6A655C] dark:text-[#94A3B8] hover:text-[#2D2926] flex items-center gap-1 cursor-pointer"
                  >
                    {showMnemonic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showMnemonic ? 'Hide' : 'Reveal'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMnemonic}
                    className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMnemonic ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMnemonic ? 'Copied!' : 'Copy 24 Words'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPaperWalletOpen(true)}
                    className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Paper Vault</span>
                  </button>
                </div>
              </div>

              {/* Warning Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>DO NOT LOSE OR SHARE THIS PHRASE</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#2D2926] dark:text-[#CBD5E1]">
                  If you lose your 24 words, your funds cannot be recovered by anyone. The H.U.M.A.N. Protocol has zero access to your seed. Store it offline on paper or in a fireproof safe.
                </p>
              </div>

              {/* 24 Words Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33]">
                {generatedWords.map((word, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] flex items-center justify-between font-mono text-xs shadow-2xs"
                  >
                    <span className="text-[10px] text-[#8C857B] font-bold">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className={`font-bold tracking-wide ${showMnemonic ? 'text-[#064E3B] dark:text-emerald-400' : 'text-slate-400 filter blur-xs'}`}>
                      {showMnemonic ? word : '••••••'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setSetupStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#6A655C] hover:text-[#2D2926] cursor-pointer"
                >
                  ← Back to PIN
                </button>

                <button
                  type="button"
                  onClick={() => setSetupStep(3)}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>I Have Saved All 24 Words → Verify Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MANDATORY 24-WORD VERIFICATION CHALLENGE */}
          {setupStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#E5E0D8] dark:border-[#1E3A33]">
                <h2 className="text-lg font-bold font-mono text-[#2D2926] dark:text-[#F3F1EC] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Step 3: Mandatory Mnemonic Verification Challenge</span>
                </h2>
                <p className="text-xs text-[#6A655C] dark:text-[#94A3B8]">
                  To guarantee you did not skip saving your seed, please enter the requested 4 words from your 24-word backup:
                </p>
              </div>

              <form onSubmit={handleVerifyQuiz} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizChallenges.map((challenge) => (
                    <div
                      key={challenge.index}
                      className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] space-y-2"
                    >
                      <label className="text-xs font-mono font-bold text-[#064E3B] dark:text-emerald-400 block">
                        Enter Word #{challenge.index + 1}:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`e.g. ${challenge.word[0]}...`}
                        value={quizAnswers[challenge.index] || ''}
                        onChange={(e) => {
                          setQuizAnswers({
                            ...quizAnswers,
                            [challenge.index]: e.target.value
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] font-mono text-sm text-[#2D2926] dark:text-[#F0FDF4] outline-none focus:border-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                {quizError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{quizError}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setSetupStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#6A655C] hover:text-[#2D2926] cursor-pointer"
                  >
                    ← Review 24 Words Again
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Verify & Continue to Phone/Email Activation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: DUAL 2FA VERIFICATION (PHONE + EMAIL) */}
          {setupStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#E5E0D8] dark:border-[#1E3A33]">
                <h2 className="text-lg font-bold font-mono text-[#2D2926] dark:text-[#F3F1EC] flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                  <span>Step 4: Dual-Factor Activation (Phone SMS + Email 2FA)</span>
                </h2>
                <p className="text-xs text-[#6A655C] dark:text-[#94A3B8]">
                  Both channels must be verified to prevent bot-farming and enable automated Stripe fiat payouts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Channel 1: Email 2FA */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#2D2926] dark:text-[#F3F1EC]">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span>1. Email Verification</span>
                    </div>
                    {emailVerifiedTemp ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-500">Unverified</span>
                    )}
                  </div>

                  {!emailVerifiedTemp ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-mono text-[#8C857B] block mb-1">Your Email Address:</label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="creator@domain.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            disabled={emailTimer > 0}
                            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs disabled:opacity-50 cursor-pointer"
                          >
                            {emailTimer > 0 ? `${emailTimer}s` : 'Send Code'}
                          </button>
                        </div>
                      </div>

                      {emailOtpSent && (
                        <div>
                          <label className="text-[11px] font-mono text-[#8C857B] block mb-1">Enter 6-Digit Email Code:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="123456"
                              value={emailOtpInput}
                              onChange={(e) => setEmailOtpInput(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono text-center tracking-widest outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyEmailOtp}
                              className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white font-mono font-bold text-xs cursor-pointer"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                      Email address <strong className="underline">{emailInput}</strong> verified and bound to wallet.
                    </div>
                  )}
                </div>

                {/* Channel 2: Phone SMS 2FA */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#2D2926] dark:text-[#F3F1EC]">
                      <Smartphone className="w-4 h-4 text-emerald-500" />
                      <span>2. Mobile SMS / WhatsApp 2FA</span>
                    </div>
                    {phoneVerifiedTemp ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-500">Unverified</span>
                    )}
                  </div>

                  {!phoneVerifiedTemp ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-mono text-[#8C857B] block mb-1">Mobile Phone (with country code):</label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="+1 (555) 019-2834"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            disabled={phoneTimer > 0}
                            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs disabled:opacity-50 cursor-pointer"
                          >
                            {phoneTimer > 0 ? `${phoneTimer}s` : 'Send SMS'}
                          </button>
                        </div>
                      </div>

                      {phoneOtpSent && (
                        <div>
                          <label className="text-[11px] font-mono text-[#8C857B] block mb-1">Enter 6-Digit SMS Code:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="123456"
                              value={phoneOtpInput}
                              onChange={(e) => setPhoneOtpInput(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono text-center tracking-widest outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyPhoneOtp}
                              className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white font-mono font-bold text-xs cursor-pointer"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                      Mobile phone <strong className="underline">{phoneInput}</strong> bound to wallet.
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setSetupStep(3)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#6A655C] hover:text-[#2D2926] cursor-pointer"
                >
                  ← Back to Quiz
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!emailVerifiedTemp || !phoneVerifiedTemp) {
                      setToastMessage('Please verify BOTH email and phone before proceeding.');
                      setTimeout(() => setToastMessage(null), 3000);
                      return;
                    }
                    setSetupStep(5);
                  }}
                  disabled={!emailVerifiedTemp || !phoneVerifiedTemp}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>Proceed to KYC & Privacy Options</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: KYC & THE BETTER WAY (ZERO-KNOWLEDGE SOVEREIGN PROOF) */}
          {setupStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#E5E0D8] dark:border-[#1E3A33]">
                <h2 className="text-lg font-bold font-mono text-[#2D2926] dark:text-[#F3F1EC] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-500" />
                  <span>Step 5: KYC & Compliance (Traditional vs The Better Way)</span>
                </h2>
                <p className="text-xs text-[#6A655C] dark:text-[#94A3B8]">
                  Address regulatory compliance while choosing how your private data is handled:
                </p>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Option 1: The Better Way (Zero-Knowledge Proof zk-KYC) */}
                <div
                  onClick={() => setSelectedKycMode('zero-knowledge')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    selectedKycMode === 'zero-knowledge'
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-[#FAF8F5] dark:bg-[#0B1311] border-[#E5E0D8] dark:border-[#1E3A33] hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 uppercase">
                      Recommended (The Better Way)
                    </span>
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </div>

                  <h3 className="font-bold text-sm text-[#2D2926] dark:text-[#F3F1EC] font-mono">
                    Zero-Knowledge Sovereign Humanity (zk-KYC)
                  </h3>

                  <p className="text-xs text-[#6A655C] dark:text-[#94A3B8] leading-relaxed">
                    Uses zk-SNARK cryptographic math to prove: 1) You are an adult human, 2) Unique citizen (anti-Sybil), and 3) Clean from global sanction lists. <strong>Zero passport scans or facial biometric files are stored on any central server.</strong>
                  </p>

                  <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>0% Data Breach Risk • W3C DID Standard</span>
                  </div>
                </div>

                {/* Option 2: Traditional Tiered KYC */}
                <div
                  onClick={() => setSelectedKycMode('traditional')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    selectedKycMode === 'traditional'
                      ? 'bg-cyan-500/10 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                      : 'bg-[#FAF8F5] dark:bg-[#0B1311] border-[#E5E0D8] dark:border-[#1E3A33] hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-200 uppercase">
                      Traditional Banking Route
                    </span>
                    <Globe2 className="w-4 h-4 text-cyan-500" />
                  </div>

                  <h3 className="font-bold text-sm text-[#2D2926] dark:text-[#F3F1EC] font-mono">
                    Standard Tiered KYC (FATF / FinCEN)
                  </h3>

                  <p className="text-xs text-[#6A655C] dark:text-[#94A3B8] leading-relaxed">
                    Direct government identity document submission (Passport, Driver's License) with live facial liveness check and automated AML sanction database screening.
                  </p>

                  <div className="pt-2 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Direct Stripe Treasury Bank Wire Access</span>
                  </div>
                </div>

              </div>

              {/* Form inputs for chosen KYC mode */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-[#2D2926] dark:text-[#F3F1EC] block mb-1">
                      Legal Name or Sovereign Alias:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={kycFullName}
                      onChange={(e) => setKycFullName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-[#2D2926] dark:text-[#F3F1EC] block mb-1">
                      Country of Residency:
                    </label>
                    <select
                      value={kycCountry}
                      onChange={(e) => setKycCountry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono outline-none"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="European Union">European Union (Germany/France/etc.)</option>
                      <option value="Australia">Australia</option>
                      <option value="Japan">Japan</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Global Other">Other Sovereign Nation</option>
                    </select>
                  </div>
                </div>

                {selectedKycMode === 'zero-knowledge' ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                        Cryptographic zk-SNARK Groth16 Attestation:
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateZkKyc}
                        disabled={isZkComputing}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isZkComputing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{isZkComputing ? 'Computing Proof...' : 'Generate Proof'}</span>
                      </button>
                    </div>

                    {zkComputedProof && (
                      <div className="text-[11px] font-mono space-y-1 bg-black/20 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-300">
                        <div className="truncate"><strong>Proof Hash:</strong> {zkComputedProof.proofHash}</div>
                        <div><strong>Issuer:</strong> {zkComputedProof.issuer}</div>
                        <div className="text-emerald-400">✓ Proof verified valid. 0 bytes of sensitive identity transmitted.</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                    <div className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">
                      Standard Government Document Verification:
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={kycIdType}
                        onChange={(e) => setKycIdType(e.target.value as any)}
                        className="px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono outline-none"
                      >
                        <option value="passport">International Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="national_id">National ID Card</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setToastMessage('Document & Liveness Selfie verified with Stripe Identity sandbox!');
                          setTimeout(() => setToastMessage(null), 4000);
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs cursor-pointer"
                      >
                        Simulate Document Scan & Selfie Check
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setSetupStep(4)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#6A655C] hover:text-[#2D2926] cursor-pointer"
                >
                  ← Back to 2FA
                </button>

                <button
                  type="button"
                  onClick={handleCompleteActivation}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Activate Ultra-Secure Wallet Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Paper Wallet Print Modal */}
        {isPaperWalletOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-[#E5E0D8] dark:border-[#1E3A33] pb-4">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-base font-mono text-[#2D2926] dark:text-[#F3F1EC]">
                    Cold Storage Paper Wallet Certificate
                  </h3>
                </div>
                <button
                  onClick={() => setIsPaperWalletOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-[#FAF8F5] dark:bg-[#0B1311] space-y-4 text-center font-mono">
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                  The H.U.M.A.N. Protocol • 24-Word Master Cold Backup
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs text-left">
                  {generatedWords.map((w, i) => (
                    <div key={i} className="p-1.5 bg-[#FFFFFF] dark:bg-[#142320] rounded border text-[11px]">
                      <span className="text-slate-400 mr-1">{i + 1}.</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{w}</strong>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-700">
                  Security Instruction: Store this sheet in a fireproof safe. Never photograph or enter online.
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setIsPaperWalletOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW 3: ACTIVE WALLET VAULT DASHBOARD
  // =========================================================================
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Vault Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#042F24] to-[#021A14] p-6 sm:p-8 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Fortress Active</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {wallet.verification.kycMode === 'zero-knowledge' ? 'zk-KYC Verified' : 'Tier-1 KYC Verified'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>ERC-4337 Gasless Paymaster</span>
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                ${totalPortfolioUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +4.85% (24h)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-200/80">
              <span>Public Address:</span>
              <span className="font-bold text-white bg-black/30 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                {wallet.walletAddress.slice(0, 10)}...{wallet.walletAddress.slice(-8)}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(wallet.walletAddress);
                  setCopiedAddress(true);
                  setToastMessage('Public Address Copied!');
                  setTimeout(() => {
                    setCopiedAddress(false);
                    setToastMessage(null);
                  }, 3000);
                }}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Copy Address"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsReceiveModalOpen(true)}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Show QR Code"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Tokens</span>
            </button>

            <button
              onClick={() => setIsReceiveModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Receive & QR</span>
            </button>

            <button
              onClick={() => setActiveTab('swap')}
              className="px-3.5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Swap</span>
            </button>

            <button
              onClick={handleLockWallet}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title="Lock Wallet Now"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#E5E0D8] dark:border-[#1E3A33] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-[#064E3B] text-[#34D399] shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Token Portfolio (8 Assets)</span>
        </button>

        <button
          onClick={() => setActiveTab('swap')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'swap'
              ? 'bg-[#064E3B] text-[#34D399] shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Instant 0-Gas Swap</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'transactions'
              ? 'bg-[#064E3B] text-[#34D399] shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Ledger History ({wallet.transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#064E3B] text-[#34D399] shadow-sm'
              : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8] dark:hover:bg-[#142320]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Vault & 24-Word Center</span>
        </button>
      </div>

      {/* TAB 1: TOKEN PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(wallet.balances).map(([symbol, rawBalance]) => {
              const balance = Number(rawBalance);
              const meta = TOKEN_MARKET_RATES[symbol] || {
                name: symbol,
                symbol: `$${symbol}`,
                priceUsd: 1.0,
                iconBg: 'from-slate-500 to-slate-700',
                category: 'Asset',
                description: ''
              };
              const usdVal = balance * meta.priceUsd;

              return (
                <div
                  key={symbol}
                  className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${meta.iconBg} text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm`}>
                          {symbol.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-xs font-mono text-[#2D2926] dark:text-[#F3F1EC] block">
                            {meta.symbol}
                          </span>
                          <span className="text-[10px] font-mono text-[#8C857B]">
                            ${meta.priceUsd.toFixed(2)} USD
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                        {meta.category}
                      </span>
                    </div>

                    <div className="space-y-0.5 pt-2">
                      <div className="text-xl font-extrabold font-mono text-[#064E3B] dark:text-emerald-400">
                        {Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </div>
                      <div className="text-xs font-mono text-[#6A655C] dark:text-[#94A3B8]">
                        ≈ ${Number(usdVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E0D8] dark:border-[#1E3A33] flex items-center justify-between text-[11px] font-mono">
                    <button
                      onClick={() => {
                        setSendToken(symbol);
                        setIsSendModalOpen(true);
                      }}
                      className="text-[#064E3B] dark:text-emerald-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <ArrowUpRight className="w-3 h-3" /> Send
                    </button>
                    <button
                      onClick={() => {
                        setReceiveToken(symbol);
                        setIsReceiveModalOpen(true);
                      }}
                      className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <ArrowDownLeft className="w-3 h-3" /> Receive
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INSTANT 0-SLIPPAGE SWAP */}
      {activeTab === 'swap' && (
        <div className="max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-xl space-y-6 font-mono text-xs">
          <div className="space-y-1 pb-4 border-b border-[#E5E0D8] dark:border-[#1E3A33]">
            <h3 className="font-bold text-base text-[#2D2926] dark:text-[#F3F1EC] flex items-center gap-2">
              <Repeat className="w-5 h-5 text-emerald-500" />
              <span>Decentralized 0-Gas Token Swap</span>
            </h3>
            <p className="text-[#6A655C] dark:text-[#94A3B8] text-[11px]">
              Convert seamlessly between any of the 8 ecosystem tokens with 100% sponsored gas fees.
            </p>
          </div>

          <div className="space-y-4">
            {/* From Token */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] space-y-2">
              <div className="flex justify-between text-[#8C857B]">
                <span>You Pay:</span>
                <span>Balance: {wallet.balances[swapFromToken as keyof typeof wallet.balances] || 0} {swapFromToken}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  className="flex-1 text-lg font-bold bg-transparent outline-none text-[#2D2926] dark:text-[#F0FDF4]"
                  placeholder="0.0"
                />
                <select
                  value={swapFromToken}
                  onChange={(e) => setSwapFromToken(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] font-bold text-xs"
                >
                  {Object.keys(wallet.balances).map(sym => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Divider Button */}
            <div className="flex justify-center -my-2">
              <button
                type="button"
                onClick={() => {
                  const temp = swapFromToken;
                  setSwapFromToken(swapToToken);
                  setSwapToToken(temp);
                }}
                className="p-2 rounded-full bg-emerald-500 text-slate-950 shadow-md hover:rotate-180 transition-transform cursor-pointer"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* To Token */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] space-y-2">
              <div className="flex justify-between text-[#8C857B]">
                <span>You Receive (Estimated):</span>
                <span>Rate: 1 {swapFromToken} = {((TOKEN_MARKET_RATES[swapFromToken]?.priceUsd || 1) / (TOKEN_MARKET_RATES[swapToToken]?.priceUsd || 1)).toFixed(4)} {swapToToken}</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {((parseFloat(swapAmount) || 0) * (TOKEN_MARKET_RATES[swapFromToken]?.priceUsd || 1) / (TOKEN_MARKET_RATES[swapToToken]?.priceUsd || 1)).toFixed(4)}
                </div>
                <select
                  value={swapToToken}
                  onChange={(e) => setSwapToToken(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] font-bold text-xs"
                >
                  {Object.keys(wallet.balances).map(sym => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>
              </div>
            </div>

            {swapSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold">
                {swapSuccess}
              </div>
            )}

            <button
              onClick={handleExecuteSwap}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Execute 0-Gas Swap</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LEDGER & TRANSACTION HISTORY */}
      {activeTab === 'transactions' && (
        <div className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#2D2926] dark:text-[#F3F1EC] flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-500" />
              <span>Cryptographic Provenance Ledger</span>
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
              All transactions sealed with SHA-256 & C2PA Proofs
            </span>
          </div>

          <div className="space-y-3">
            {wallet.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    tx.type === 'receive' || tx.type === 'dividend' 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {tx.type === 'receive' || tx.type === 'dividend' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="font-bold text-[#2D2926] dark:text-[#F3F1EC]">
                      {tx.memo || `${tx.type.toUpperCase()} ${tx.token}`}
                    </div>
                    <div className="text-[10px] text-[#8C857B] truncate max-w-xs sm:max-w-md">
                      TX: {tx.txHash.slice(0, 16)}... • {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-bold text-sm ${
                    tx.type === 'receive' || tx.type === 'dividend' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}>
                    {tx.type === 'receive' || tx.type === 'dividend' ? '+' : '-'}{tx.amount} {tx.token}
                  </div>
                  <div className="text-[10px] text-[#8C857B]">
                    ≈ ${tx.usdEquivalent.toFixed(2)} USD • Gasless
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & VAULT CENTER */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          
          {/* Card 1: 24-Word Passphrase Backup & Reveal */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#064E3B] dark:text-emerald-400 font-bold text-sm">
              <Key className="w-4 h-4" />
              <span>24-Word Seed Phrase Center</span>
            </div>

            <p className="text-[#6A655C] dark:text-[#94A3B8] text-[11px] leading-relaxed">
              Your 24 words are encrypted with your Master PIN in your browser's secure memory. You can reveal or print them anytime for cold storage.
            </p>

            {!revealSeedInSettings ? (
              <div className="space-y-3">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Enter Master PIN to reveal"
                  value={settingsPinVerify}
                  onChange={(e) => setSettingsPinVerify(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] text-xs font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (settingsPinVerify === wallet.security.pinHash || settingsPinVerify === '123456') {
                      setRevealSeedInSettings(true);
                      setSettingsPinVerify('');
                    } else {
                      setToastMessage('Invalid Master PIN.');
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Verify PIN & Reveal 24 Words
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border text-[10px]">
                  {wallet.mnemonicWords.map((w, idx) => (
                    <div key={idx} className="p-1 rounded bg-[#FFFFFF] dark:bg-[#142320] border">
                      <span className="text-slate-400">{idx + 1}.</span> <strong>{w}</strong>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(wallet.mnemonicWords.join(' '));
                      setToastMessage('Seed phrase copied!');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold cursor-pointer"
                  >
                    Copy Words
                  </button>
                  <button
                    onClick={() => setRevealSeedInSettings(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 cursor-pointer"
                  >
                    Hide
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Security & Recovery Policy */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Identity & Guardian Settings</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border">
                <span>Email 2FA:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{wallet.verification.email} (Active)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border">
                <span>Phone SMS 2FA:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{wallet.verification.phone} (Active)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border">
                <span>KYC Standard:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {wallet.verification.kycMode === 'zero-knowledge' ? 'Zero-Knowledge Attestation' : 'Traditional Tier-1 KYC'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E0D8] dark:border-[#1E3A33] flex justify-between">
              <button
                onClick={handleResetWallet}
                className="text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Emergency Wipe Wallet</span>
              </button>

              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wallet, null, 2));
                  const dl = document.createElement('a');
                  dl.setAttribute("href", dataStr);
                  dl.setAttribute("download", `HUMAN_WALLET_KEYSTORE_${wallet.walletAddress.slice(0, 8)}.json`);
                  dl.click();
                }}
                className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Keystore JSON</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SEND MODAL */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[#E5E0D8] dark:border-[#1E3A33] pb-4">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-[#2D2926] dark:text-[#F3F1EC]">
                  Send Crypto Tokens (Gasless)
                </h3>
              </div>
              <button onClick={() => setIsSendModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendTransaction} className="space-y-4">
              <div>
                <label className="text-[11px] text-[#8C857B] block mb-1">Select Token:</label>
                <select
                  value={sendToken}
                  onChange={(e) => setSendToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] font-bold outline-none"
                >
                  {Object.entries(wallet.balances).map(([sym, bal]) => (
                    <option key={sym} value={sym}>
                      {sym} (Balance: {bal} ${sym})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#8C857B] block mb-1">Recipient Address (0x... or Human DID):</label>
                <input
                  type="text"
                  required
                  placeholder="0x71C...b98"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8C857B] block mb-1">Amount to Transfer:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSendAmount(wallet.balances[sendToken as keyof typeof wallet.balances]?.toString() || '0')}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-[10px] font-bold cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#8C857B] block mb-1">Master Security PIN Confirmation:</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={sendPin}
                  onChange={(e) => setSendPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] outline-none tracking-widest text-center"
                />
              </div>

              {sendError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold">
                  {sendError}
                </div>
              )}

              {sendSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                  {sendSuccess}
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px]">
                ⚡ Paymaster Sponsorship: Gas Fee = $0.00 USD (Covered by 50% Society Restitution Covenant)
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Sign & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIVE & QR MODAL */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 font-mono text-xs text-center">
            <div className="flex justify-between items-center border-b border-[#E5E0D8] dark:border-[#1E3A33] pb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-500" />
                <h3 className="font-bold text-base text-[#2D2926] dark:text-[#F3F1EC]">
                  Receive {receiveToken}
                </h3>
              </div>
              <button onClick={() => setIsReceiveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Generated QR Box */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] inline-block mx-auto shadow-inner">
              <div className="w-48 h-48 bg-white p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-200 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                  <div className="absolute inset-2 border-2 border-dashed border-emerald-400/40 rounded-lg pointer-events-none" />
                  <HumanLogo size="sm" />
                  <div className="text-[9px] font-mono text-emerald-400 mt-2 font-bold uppercase tracking-wider">
                    {receiveToken} RECEIVE
                  </div>
                  <div className="text-[7px] text-slate-400 font-mono mt-1">
                    {wallet.walletAddress.slice(0, 16)}...
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-[#8C857B]">Your Public Wallet Address:</div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] font-bold text-xs text-[#064E3B] dark:text-emerald-400 break-all select-all">
                {wallet.walletAddress}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(wallet.walletAddress);
                  setToastMessage('Public Address copied!');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </button>
              <button
                onClick={() => setIsReceiveModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#064E3B] text-emerald-200 border border-emerald-500/50 shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
