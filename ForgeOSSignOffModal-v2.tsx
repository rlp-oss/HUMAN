import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Fingerprint, 
  Check, 
  Lock, 
  AlertCircle, 
  Scroll, 
  QrCode, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  X,
  ExternalLink
} from 'lucide-react';

interface ForgeOSSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (attestation: ForgeAttestation) => void;
  developerName?: string;
  developerEmail?: string;
}

export interface ForgeAttestation {
  signedAt: string;
  developerName: string;
  developerEmail: string;
  signatureHash: string;
  c2paMerkleRoot: string;
  badgeId: string;
  stripeSetupComplete: boolean;
}

export const ForgeOSSignOffModal: React.FC<ForgeOSSignOffModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  developerName = '',
  developerEmail = ''
}) => {
  // Form State
  const [name, setName] = useState(developerName);
  const [email, setEmail] = useState(developerEmail);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [biometricConfirmed, setBiometricConfirmed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signingStep, setSigningStep] = useState<string>('');
  const [signedAttestation, setSignedAttestation] = useState<ForgeAttestation | null>(null);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-fill props if they change
  useEffect(() => {
    if (developerName) setName(developerName);
    if (developerEmail) setEmail(developerEmail);
  }, [developerName, developerEmail]);

  // Handle scroll detection
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if user has scrolled to the bottom (with a 10px buffer)
    const isAtBottom = 
      container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
    
    if (isAtBottom) {
      setHasReadToBottom(true);
    }
  };

  // Simulate C2PA Cryptographic Signature Generation
  const handleSignAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasReadToBottom || !biometricConfirmed || !name || !email) return;

    setIsSigning(true);
    
    // Simulate multi-stage cryptographic and database registration pipeline
    const steps = [
      'Generating local ECC keypair (Secp256r1)...',
      'Injecting C2PA JUMBF v2.1 metadata block...',
      'Binding verified developer identity to local AST quarantine config...',
      'Registering signature payload to Firestore secure registry...',
      'Streaming Stripe Connect sandbox micro-royalty routing test...',
      'Computing Master Merkle Root Attestation...'
    ];

    for (const step of steps) {
      setSigningStep(step);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Generate a random-looking SHA-256 for the developer's signature
    const signatureHash = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const generatedAttestation: ForgeAttestation = {
      signedAt: new Date().toISOString(),
      developerName: name,
      developerEmail: email,
      signatureHash: `0x${signatureHash}`,
      c2paMerkleRoot: '0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b',
      badgeId: `FT-ETHIC-BADGE-${Math.floor(100000 + Math.random() * 900000)}`,
      stripeSetupComplete: true
    };

    setSignedAttestation(generatedAttestation);
    setIsSigning(false);

    if (onSuccess) {
      onSuccess(generatedAttestation);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#070A11]/80 backdrop-blur-md">
      {/* Glow Backdrop Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl overflow-hidden border bg-[#070A11] border-[#1E293B] rounded-2xl shadow-2xl shadow-emerald-950/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B] bg-[#070A11]/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
              <Shield className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ForgeOS Developer Security Attestation
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F172A] border border-[#1E293B] text-emerald-400">
                  v4.2-C2PA
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8]">H.U.M.A.N. Protocol Non-Profit Ethical AI Registry Agreement</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Content Split */}
        {!signedAttestation ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 division-y md:division-y-0 md:division-x divide-[#1E293B]">
            
            {/* Left Column: Interactive License Agreement */}
            <div className="col-span-1 md:col-span-7 p-6 flex flex-col h-[500px]">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[#F8FAFC]">
                <Scroll className="w-4 h-4 text-emerald-400" />
                <span>Read License Agreement to Unlock Sign-off</span>
              </div>
              
              {/* Scrollable License Box */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto p-4 rounded-lg bg-[#070A11] border border-[#1E293B] text-xs text-[#F8FAFC] font-mono space-y-4 scrollbar-thin scrollbar-thumb-[#1E293B]"
              >
                <div className="pb-4 border-b border-[#1E293B]">
                  <h3 className="font-bold text-emerald-400">THE H.U.M.A.N. INITIATIVE GLOBAL ETHICAL AI LICENSE</h3>
                  <p className="text-[10px] text-[#94A3B8]">Document ID: HUMAN-LIC-2026-V4.2-C2PA</p>
                  <p className="text-[10px] text-[#94A3B8]">Effective: August 19, 2026 | Status: Certified</p>
                </div>

                <p className="text-[#94A3B8] leading-relaxed">
                  This legally and cryptographically binding Covenant is designed to dismantle the "Scarcity Operating System." 
                  By activating your certificate, technology is hardcoded to serve as your symbiotic partner, protecting your intellectual property, 
                  guaranteeing physical and creative provenance, and routing automated wealth to secure human flourishing.
                </p>

                <div>
                  <h4 className="font-bold text-white mb-1">SECTION 1: CLEANROOM ZERO-INGESTION GUARANTEE</h4>
                  <p className="text-[#94A3B8] leading-relaxed">
                    The Registry provides an absolute, cryptographically and legally backed Zero-Ingestion Guarantee. Your creative works and code assets compiled in ForgeOS shall NEVER be ingested, cached, or utilized to train proprietary foundational models.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">SECTION 2: THE FAIRLY TRAINED STANDARD (FT-2026)</h4>
                  <p className="text-[#94A3B8] leading-relaxed">
                    All neural networks and foundational AI models integrated within the system have undergone third-party cryptographic lineage auditing, verifying zero non-consensual copyrighted works in pre-training.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">SECTION 3: THE 50% PEOPLE'S COVENANT & ESCROW SPLIT</h4>
                  <p className="text-[#94A3B8] leading-relaxed">
                    All platform revenues are programmatically split in real time via Stripe Connect: 50% remains dedicated to app operations & independent speed, and 50% is routed directly to the audited Creator and Community Fund.
                  </p>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-[#94A3B8]">
                    <li>Pool A (70%): Instant creator micro-royalties routed via Stripe Express.</li>
                    <li>Pool B (15%): Permanent unregistered holding escrow.</li>
                    <li>Pool C (15%): Universal community living floors and diagnostic commons.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">SECTION 4: DYNAMIC COMPRESSION HEARTBEAT</h4>
                  <p className="text-[#94A3B8] leading-relaxed">
                    At scale, the platform's operating fee compresses from 50% to a lean 1% to 5% heartbeat, maximizing direct sovereign payouts to society (up to 95%).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">SECTION 5: FORGEOS INTELLECTUAL PROPERTY & AST SANITIZATION</h4>
                  <p className="text-[#94A3B8] leading-relaxed">
                    ForgeOS isolates code synthesis inside an OSPO-compliant sandbox. The Zero-Copyleft AST Quarantine blocks, filters, and isolates code strings carrying copyleft licenses (GPL/AGPL), ensuring your codebase remains pristine, uninfected, and fully commercializable.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">SECTION 6: C2PA CRYPTOGRAPHIC WATERMARKING</h4>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Exported content receives tamper-evident SHA-256 Merkle root hashes (C2PA JUMBF v2.1 parameters), fully satisfying transparency requirements of Articles 50 and 53 of the EU AI Act.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1E293B] text-center text-emerald-500/80">
                  <p className="text-[10px]">*** END OF LICENSE PROTOCOL DOCUMENT ***</p>
                  <p className="text-[9px] text-[#64748B] mt-1">Scroll completely to register read receipt.</p>
                </div>
              </div>

              {/* Scroll indicators */}
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className={hasReadToBottom ? 'text-emerald-400 font-medium' : 'text-[#94A3B8]'}>
                  {hasReadToBottom ? '✓ Document read-through verified' : '⚠ Please scroll to bottom of document'}
                </span>
                <span className="text-[#64748B]">v4.2 Certified</span>
              </div>
            </div>

            {/* Right Column: Interaction Form */}
            <div className="col-span-1 md:col-span-5 p-6 bg-[#070A11] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1E293B]">
              <form onSubmit={handleSignAgreement} className="space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/15 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-white">Cryptographic Bond</p>
                        <p className="text-[10px] text-[#94A3B8]">Signing this modal generates a unique on-chain signature key mapped to your developer badge.</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Developer Signature Identity</label>
                      <input 
                        type="text" 
                        required
                        disabled={isSigning}
                        placeholder="John Doe (Legal Signature Name)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#070A11] border border-[#1E293B] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Registry Communication Email</label>
                      <input 
                        type="email" 
                        required
                        disabled={isSigning}
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#070A11] border border-[#1E293B] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Biometric Acknowledgment Checkbox */}
                  <div className="pt-2">
                    <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      biometricConfirmed 
                        ? 'border-emerald-500/30 bg-emerald-950/10' 
                        : 'border-[#1E293B] bg-[#070A11] hover:border-[#1E293B]'
                    }`}>
                      <input 
                        type="checkbox" 
                        required
                        disabled={!hasReadToBottom || isSigning}
                        checked={biometricConfirmed}
                        onChange={(e) => setBiometricConfirmed(e.target.checked)}
                        className="mt-0.5 rounded border-[#1E293B] text-emerald-500 focus:ring-emerald-500 bg-[#070A11] disabled:opacity-50"
                      />
                      <div className="flex gap-2">
                        <Fingerprint className={`w-5 h-5 shrink-0 ${biometricConfirmed ? 'text-emerald-400 animate-pulse' : 'text-[#64748B]'}`} />
                        <div>
                          <p className="text-xs font-medium text-white">Ethical Provenance Seal</p>
                          <p className="text-[9px] text-[#94A3B8]">I attest to human authorship and accept the 50/50 open distribution terms of the Covenant.</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Signing CTA */}
                <div className="pt-6 border-t border-[#1E293B]">
                  {isSigning ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-emerald-400 bg-[#0F172A] border border-emerald-500/20 rounded-lg">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Signing Protocol...</span>
                      </div>
                      <p className="text-[10px] text-[#94A3B8] font-mono text-center animate-pulse truncate px-1">
                        {signingStep}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!hasReadToBottom || !biometricConfirmed || !name || !email}
                      className="w-full py-2.5 px-4 text-xs font-semibold tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 disabled:bg-[#1E293B] disabled:text-[#94A3B8] rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
                    >
                      <Lock className="w-4 h-4" />
                      SIGN & DEPLOY ETHICAL AI BADGE
                    </button>
                  )}
                  
                  {!hasReadToBottom && (
                    <p className="text-[10px] text-center text-[#64748B] mt-2">
                      * You must read to the bottom of the license to activate registration.
                    </p>
                  )}
                </div>

              </form>
            </div>

          </div>
        ) : (
          /* SUCCESS STATE: Display Ethical AI Badge & Cryptographic Attestation */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-6">
            
            {/* Success Graphic */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-125 animate-pulse" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-400/40">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-bold tracking-tight text-white">Attestation Completed!</h3>
              <p className="text-sm text-[#94A3B8]">
                Your account is officially registered with the <strong>H.U.M.A.N. Protocol Global Non-Profit Ethical AI Registry</strong>.
              </p>
            </div>

            {/* Generated Badge Visualization */}
            <div className="w-full max-w-md p-6 bg-[#070A11] border border-emerald-500/30 rounded-xl shadow-lg shadow-emerald-950/10 text-left relative overflow-hidden font-mono">
              {/* Background watermark badge visual */}
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                <Fingerprint className="w-48 h-48 text-emerald-400" />
              </div>
              
              <div className="flex justify-between items-start border-b border-[#1E293B] pb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">ETHICAL AI DEVELOPER BADGE</p>
                  <p className="text-[9px] text-[#94A3B8]">ForgeOS Compliant (FT-2026 Codebase)</p>
                </div>
                <QrCode className="w-8 h-8 text-emerald-400 shrink-0" />
              </div>

              <div className="py-4 space-y-3 text-[11px] text-[#F8FAFC]">
                <div className="grid grid-cols-3">
                  <span className="text-[#94A3B8]">HOLDER:</span>
                  <span className="col-span-2 text-white font-medium truncate">{signedAttestation.developerName}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-[#94A3B8]">REGISTRATION:</span>
                  <span className="col-span-2 text-[#94A3B8] truncate">{signedAttestation.developerEmail}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-[#94A3B8]">SIGNED ON:</span>
                  <span className="col-span-2 text-[#94A3B8] font-sans">{new Date(signedAttestation.signedAt).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-[#94A3B8]">BADGE ID:</span>
                  <span className="col-span-2 text-emerald-400 font-bold">{signedAttestation.badgeId}</span>
                </div>
                <div className="pt-2 border-t border-[#1E293B] grid grid-cols-3">
                  <span className="text-[#94A3B8]">SECURE ROOT:</span>
                  <span className="col-span-2 text-[9px] text-[#94A3B8] tracking-tight font-sans break-all">{signedAttestation.c2paMerkleRoot}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-[#94A3B8]">SIGNATURE:</span>
                  <span className="col-span-2 text-[9px] text-[#94A3B8] tracking-tight font-sans break-all truncate">{signedAttestation.signatureHash}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex justify-between items-center text-[10px] text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Stripe Sandbox Escrow Active
                </span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  Secure v4.2 Verified
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#0F172A] hover:bg-[#1E293B]/50 text-[#F8FAFC] rounded-lg text-xs font-semibold border border-[#1E293B] hover:border-[#1E293B] transition-all"
              >
                CLOSE CONSOLE
              </button>
              <a
                href="https://human-ethical-ai.ai.studio"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center gap-1.5 justify-center"
              >
                <span>VISIT ONBOARDING CONSOLE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
