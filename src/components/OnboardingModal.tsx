import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Github, 
  ShieldCheck, 
  Check, 
  Key, 
  DollarSign, 
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlatformRole, AppName, SubscriptionStatus } from '../types';
import { TesterService } from '../services/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [githubHandle, setGithubHandle] = useState('');
  const [role, setRole] = useState<PlatformRole>('App Creator');
  const [selectedApps, setSelectedApps] = useState<AppName[]>(['Tome Crafter', 'RLM Pro Studio']);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('Stripe Sandbox');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableApps: AppName[] = [
    'Tome Crafter',
    'RLM Pro Studio',
    'ForgeOS App Builder',
    'RL Easy Flow',
  ];

  const handleToggleApp = (app: AppName) => {
    if (selectedApps.includes(app)) {
      if (selectedApps.length > 1) {
        setSelectedApps(selectedApps.filter(a => a !== app));
      }
    } else {
      setSelectedApps([...selectedApps, app]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter the developer or creator name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const stripeAccountId = `acct_test_${Math.random().toString(36).substring(2, 10)}`;
      
      await TesterService.addTester({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        github_handle: githubHandle.trim().replace(/^@/, '') || 'anonymous-coder',
        role,
        app_access_list: selectedApps,
        current_subscription_status: subscriptionStatus,
        stripe_account_id: stripeAccountId,
        notes: notes.trim() || 'New beta tester onboarded via H.U.M.A.N. Protocol Console (Powering Ethical AI apps, And Paying the People).',
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#6EE7B7'],
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to onboard tester.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-emerald-700/50 bg-[#07130f] p-6 shadow-2xl space-y-5 animate-scale-up my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-100">Onboard New Beta Tester & Creator</h2>
              <p className="text-xs text-emerald-400/80 font-mono">
                Automated license generator & Stripe Connect welcome setup
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-500 hover:text-emerald-300 text-sm p-1 rounded"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-950/60 border border-red-800/60 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-emerald-200">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-1">
                Developer / Creator Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cody Germain"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#040807] border border-emerald-800/60 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-1">
                Primary Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. codygermain032@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#040807] border border-emerald-800/60 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          {/* Row 2: GitHub & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-1">
                GitHub Handle / Org
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
                <input
                  type="text"
                  placeholder="e.g. codygermain"
                  value={githubHandle}
                  onChange={(e) => setGithubHandle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#040807] border border-emerald-800/60 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
              <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block">
                Used to route Stripe Connect micro-patronage for OSS libraries
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-1">
                Platform Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as PlatformRole)}
                className="w-full px-3 py-2 rounded-lg bg-[#040807] border border-emerald-800/60 text-sm text-emerald-100 focus:outline-none focus:border-emerald-400"
              >
                <option value="App Creator">App Creator (Build & Deploy apps with 5-stage guardrails)</option>
                <option value="OSS Maintainer">OSS Maintainer (Claim packages & receive micro-royalties)</option>
                <option value="Artisan Author">Artisan Author (Books, Literature, Research)</option>
                <option value="Musician">Musician (Audio Stems & Soundtracks)</option>
                <option value="Beta Tester">Beta Tester (Quality Assurance Sandbox)</option>
              </select>
            </div>
          </div>

          {/* App Access Selection */}
          <div>
            <label className="block text-xs font-mono uppercase text-emerald-400 mb-1.5 flex items-center justify-between">
              <span>Assign Software Access List</span>
              <span className="text-[10px] text-emerald-500 font-normal">Select at least one app</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableApps.map((app) => {
                const isSelected = selectedApps.includes(app);
                return (
                  <button
                    key={app}
                    type="button"
                    onClick={() => handleToggleApp(app)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                        : 'bg-[#040807] text-emerald-600 border-emerald-900/50 hover:border-emerald-800'
                    }`}
                  >
                    <span>{app}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stripe Subscription Setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-1">
                Stripe Subscription State
              </label>
              <select
                value={subscriptionStatus}
                onChange={(e) => setSubscriptionStatus(e.target.value as SubscriptionStatus)}
                className="w-full px-3 py-2 rounded-lg bg-[#040807] border border-emerald-800/60 text-sm text-emerald-100 focus:outline-none focus:border-emerald-400"
              >
                <option value="Stripe Sandbox">Stripe Sandbox (Test token routing)</option>
                <option value="Stripe Connect Active">Stripe Connect Active (Live Micro-patronage)</option>
                <option value="Trial">Trial (14-day evaluation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400 mb-1">
                Admin Notes & Scope
              </label>
              <input
                type="text"
                placeholder="e.g. Assigned to Cohort 2 checkout test"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#040807] border border-emerald-800/60 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Automatic Actions Summary Callout */}
          <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/30 p-3.5 text-xs text-emerald-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-mono">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Automated Onboarding Sequence:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-emerald-300/80 font-mono text-[11px]">
              <li>Issues cryptographically signed H.U.M.A.N. Protocol License Keys for each assigned app</li>
              <li>Provisions sandbox customer ID in Stripe test database</li>
              <li>Generates & triggers tailored Welcome Email with credentials</li>
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-900/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-950/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-950 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4 text-black" />
              <span>{isSubmitting ? 'Onboarding Tester...' : 'Complete Onboarding & Dispatch Email'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
