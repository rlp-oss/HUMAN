import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  RefreshCw, 
  Key, 
  Check, 
  Copy, 
  ExternalLink, 
  AlertCircle,
  FileCode,
  Landmark
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StripeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StripeSandboxModal: React.FC<StripeSandboxModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isResettingGlobal, setIsResettingGlobal] = useState(false);
  const [globalResetMsg, setGlobalResetMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const handleGlobalReset = () => {
    setIsResettingGlobal(true);
    setTimeout(() => {
      setIsResettingGlobal(false);
      setGlobalResetMsg('Stripe Sandbox environment variables & test ledger refreshed successfully.');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399'],
      });
      setTimeout(() => setGlobalResetMsg(null), 5000);
    }, 1000);
  };

  const serverCodeSnippet = `// server.ts - Secure Stripe API Integration
import Stripe from 'stripe';

/**
 * Lazy initialization pattern:
 * Ensure STRIPE_SECRET_KEY is defined in server environment variables (.env).
 * Never expose STRIPE_SECRET_KEY to client bundles or browser runtime.
 */
let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required on server');
    }
    stripeClient = new Stripe(key, { apiVersion: '2023-10-16' });
  }
  return stripeClient;
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-2xl space-y-5 animate-scale-up my-8 text-[#2D2926]">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#5A5A40]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2D2926]">Stripe Sandbox & Security Credentials</h3>
              <p className="text-xs text-[#6A655C] font-mono">
                Environment variable configuration & micro-royalty routing architecture
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8C857B] hover:text-[#2D2926] text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {globalResetMsg && (
          <div className="rounded-xl border border-[#5A5A40]/40 bg-[#FAF8F5] p-3 text-xs text-[#5A5A40] font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
            <span>{globalResetMsg}</span>
          </div>
        )}

        <div className="space-y-4 text-xs text-[#2D2926]">
          {/* Environment Variables Table */}
          <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 space-y-3">
            <span className="font-mono text-[#5A5A40] font-bold uppercase block">
              Required Environment Variables (.env / Secrets Manager)
            </span>
            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between p-2.5 rounded bg-[#FFFFFF] border border-[#E5E0D8]">
                <div>
                  <span className="text-[#2D2926] font-bold">STRIPE_SECRET_KEY</span>
                  <span className="block text-[10px] text-[#8C857B]">sk_test_51... (Server-side API key)</span>
                </div>
                <span className="text-[10px] bg-[#F0F2EB] text-[#5A5A40] px-2 py-0.5 rounded border border-[#C9D1BE]">
                  Secured on Backend
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#FFFFFF] border border-[#E5E0D8]">
                <div>
                  <span className="text-[#2D2926] font-bold">STRIPE_WEBHOOK_SECRET</span>
                  <span className="block text-[10px] text-[#8C857B]">whsec_... (Verifies signature of micro-patronage transfers)</span>
                </div>
                <span className="text-[10px] bg-[#F0F2EB] text-[#5A5A40] px-2 py-0.5 rounded border border-[#C9D1BE]">
                  Secured on Backend
                </span>
              </div>
            </div>
          </div>

          {/* Secure Pattern Code Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[#5A5A40]">
              <span className="flex items-center gap-1.5 font-semibold">
                <FileCode className="w-4 h-4 text-[#5A5A40]" />
                Backend Lazy-Initialization Implementation
              </span>
              <button
                onClick={() => copySnippet(serverCodeSnippet, 'stripe-code')}
                className="text-xs text-[#5A5A40] hover:text-[#2D2926] flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'stripe-code' ? <Check className="w-3.5 h-3.5 text-[#5A5A40]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'stripe-code' ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <pre className="rounded-xl bg-[#2D2926] p-3.5 text-xs font-mono text-[#F9F7F2] overflow-x-auto border border-[#423D38] max-h-48 scrollbar-thin">
              {serverCodeSnippet}
            </pre>
          </div>

          {/* Sandbox Controls */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
            <div>
              <span className="font-bold text-[#2D2926] block">Stripe Sandbox Ledger Health</span>
              <span className="text-[11px] text-[#6A655C] font-mono">
                Current mode: Active Sandbox Simulation with Instant Ledger Settlement
              </span>
            </div>

            <button
              onClick={handleGlobalReset}
              disabled={isResettingGlobal}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F2ECE4] hover:bg-[#EBE5DC] text-[#5A5A40] border border-[#DCD5CA] flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResettingGlobal ? 'animate-spin' : ''}`} />
              <span>{isResettingGlobal ? 'Refreshing...' : 'Flush Sandbox Ledger'}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#E5E0D8]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D67D5C] hover:bg-[#C4704F] text-white shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
