import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Send, 
  MessageSquareQuote, 
  Sparkles, 
  QrCode, 
  DollarSign, 
  RefreshCw,
  ExternalLink,
  Lock,
  Landmark
} from 'lucide-react';
import { HumanLogo } from './HumanLogo';

export type ActiveTab = 
  | 'testers' 
  | 'claims' 
  | 'payouts'
  | 'badge' 
  | 'synthesizer' 
  | 'broadcast' 
  | 'feedback';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  totalStreamedUsd: number;
  isBadgeActive?: boolean;
  onOpenOnboardModal: () => void;
  onOpenStripeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  totalStreamedUsd,
  isBadgeActive = false,
  onOpenOnboardModal,
  onOpenStripeModal,
}) => {
  const tabs = [
    { id: 'testers' as ActiveTab, label: 'Tester CRM & Onboarding', icon: Users, badge: '5 Active' },
    { id: 'claims' as ActiveTab, label: 'Copyright Claims & Pool', icon: ShieldCheck, badge: 'Pool Live' },
    { id: 'payouts' as ActiveTab, label: 'Creator Payouts & Stripe', icon: Landmark, badge: 'Direct Connect' },
    { 
      id: 'badge' as ActiveTab, 
      label: 'Ethical Badge & Micro-QR', 
      icon: QrCode, 
      badge: isBadgeActive ? 'Active' : 'Unlinked',
      badgeColor: isBadgeActive ? 'text-[#5A5A40]' : 'text-[#D67D5C]'
    },
    { id: 'synthesizer' as ActiveTab, label: 'Ethical AI Sandbox', icon: Sparkles, highlight: true },
    { id: 'broadcast' as ActiveTab, label: 'Broadcast Console', icon: Send },
    { id: 'feedback' as ActiveTab, label: 'Feedback Portal', icon: MessageSquareQuote, badge: '3 Unread' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E0D8] bg-[#F9F7F2]/95 backdrop-blur-md">
      {/* Top Banner with live stats */}
      <div className="border-b border-[#E5E0D8] bg-[#F2ECE4] px-4 py-1.5 text-xs text-[#5A5A40]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D67D5C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D67D5C]"></span>
            </span>
            <span className="font-mono text-[#2D2926]">
              <strong className="text-[#5A5A40] font-bold">ReForgeOS Core</strong>: 5-Stage Testing Guardrails Active
            </span>
            <span className="hidden md:inline text-[#B8ADA0]">|</span>
            <span className="hidden md:inline text-[#6A655C] font-mono">
              0 Copyleft Violations • Strict OSPO Sandbox
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono" title="Sample amount — not real (for display and testing purposes)">
              <span className="text-[#6A655C]">Streamed (Simulated):</span>
              <span className="font-bold text-[#D67D5C] bg-[#FAF0EC] px-2 py-0.5 rounded border border-[#EECDBC]">
                ${totalStreamedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="hidden xl:inline text-[9.5px] text-[#8C857B] font-sans italic">
                *Sample amount (not real, testing only)
              </span>
            </div>

            <button
              onClick={onOpenStripeModal}
              className="flex items-center gap-1 text-[11px] font-mono text-[#5A5A40] hover:text-[#2D2926] transition-colors bg-[#FFFFFF] hover:bg-[#F2ECE4] px-2.5 py-0.5 rounded border border-[#DCD5CA] shadow-2xs"
              title="Stripe Sandbox Settings & Environment Secrets"
            >
              <Lock className="w-3 h-3 text-[#5A5A40]" />
              <span>Stripe Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onSelectTab('testers')}
            className="text-left focus:outline-none"
          >
            <HumanLogo size="md" />
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#5A5A40] text-white shadow-sm'
                      : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F9F7F2]' : 'text-[#8C857B]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      isActive 
                        ? 'bg-[#4A4A34] text-[#F9F7F2] border-[#3E3E2B]' 
                        : 'bg-[#FFFFFF] text-[#6A655C] border-[#E5E0D8]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {tab.highlight && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#D67D5C] animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenOnboardModal}
            className="flex items-center gap-2 bg-[#D67D5C] hover:bg-[#C4704F] text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-white" />
            <span>Onboard New Tester</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Scroller */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 gap-2 border-t border-[#E5E0D8] bg-[#F2ECE4] scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#5A5A40] text-white'
                  : 'text-[#6A655C] hover:bg-[#EBE5DC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

