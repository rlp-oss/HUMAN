import React, { useState } from 'react';
import { 
  Heart,
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
  Landmark, 
  Users2, 
  Scale, 
  FileText, 
  Download, 
  Palette,
  HeartHandshake,
  Store,
  Code2,
  CreditCard,
  Sun,
  Moon,
  Zap,
  Sliders,
  Paintbrush,
  HardDrive,
  Globe2,
  Compass,
  Cpu,
  Coins,
  Radio,
  Trophy,
  Fingerprint
} from 'lucide-react';
import { HumanLogo, HumanProtocolLogo } from './HumanLogo';
import { TopUninvasiveTrustBadge } from './UninvasiveTrustBadge';
import { PublicUrlsDirectoryModal } from './PublicUrlsDirectoryModal';
import { useTheme } from '../context/ThemeContext';

export type ActiveTab = 
  | 'mission-home'
  | 'roadmap-site'
  | 'media-hub'
  | 'global-fund'
  | 'crypto-wallet'
  | 'initiative'
  | 'developer-embed'
  | 'stripe-guide'
  | 'merchants'
  | 'portal'
  | 'technical-ai'
  | 'crypto-valuation'
  | 'hunter'
  | 'testers' 
  | 'claims' 
  | 'payouts'
  | 'personas'
  | 'badge' 
  | 'synthesizer' 
  | 'broadcast' 
  | 'feedback'
  | 'privacy';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  totalStreamedUsd: number;
  isBadgeActive?: boolean;
  onOpenOnboardModal: () => void;
  onOpenStripeModal: () => void;
  onOpenCustomBadgeModal?: () => void;
  onOpenColorStudio?: () => void;
  onOpenGoogleDriveModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  totalStreamedUsd,
  isBadgeActive = false,
  onOpenOnboardModal,
  onOpenStripeModal,
  onOpenCustomBadgeModal,
  onOpenColorStudio,
  onOpenGoogleDriveModal,
}) => {
  const { mode, setMode, toggleSideMenu } = useTheme();
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);

  const tabs = [
    { 
      id: 'mission-home' as ActiveTab, 
      label: 'The Mission (Public Sanctuary)', 
      icon: Heart, 
      badge: 'Public Education',
      highlight: true,
      badgeColor: 'text-[#D67D5C]'
    },
    { 
      id: 'roadmap-site' as ActiveTab, 
      label: 'Human Initiative Roadmap (Reference Site)', 
      icon: Compass, 
      badge: 'Public Spec URL',
      highlight: true,
      badgeColor: 'text-[#D67D5C]'
    },
    { 
      id: 'media-hub' as ActiveTab, 
      label: 'App & Podcast Broadcast Hub', 
      icon: Radio, 
      badge: 'Podcast Fleet',
      highlight: true,
      badgeColor: 'text-[#10B981]'
    },
    { 
      id: 'technical-ai' as ActiveTab, 
      label: 'Technical AI Assessment & Solutions', 
      icon: Cpu, 
      badge: 'Build AI',
      highlight: true,
      badgeColor: 'text-[#10B981]'
    },
    { 
      id: 'crypto-valuation' as ActiveTab, 
      label: 'Crypto, Whitepaper & Valuation', 
      icon: Coins, 
      badge: 'Tokenomics',
      highlight: true,
      badgeColor: 'text-cyan-400'
    },
    { 
      id: 'crypto-wallet' as ActiveTab, 
      label: 'Sovereign Token Wallet', 
      icon: Lock, 
      badge: '24-Word Vault',
      highlight: true,
      badgeColor: 'text-[#10B981]'
    },
    { 
      id: 'global-fund' as ActiveTab, 
      label: '1% Fund for Humanity & Blockchain', 
      icon: Globe2, 
      badge: '$4.50T Macro L1',
      highlight: true,
      badgeColor: 'text-[#10B981]'
    },
    { 
      id: 'initiative' as ActiveTab, 
      label: 'The Human Initiative (Master)', 
      icon: HeartHandshake, 
      badge: 'Master Plan',
      highlight: true,
      badgeColor: 'text-[#D67D5C]'
    },
    { 
      id: 'developer-embed' as ActiveTab, 
      label: 'Developer Embed & Ecosystem', 
      icon: Code2, 
      badge: '50% Split SDK',
      highlight: true,
      badgeColor: 'text-[#5A5A40]'
    },
    { 
      id: 'stripe-guide' as ActiveTab, 
      label: 'Stripe Integration Guide', 
      icon: CreditCard, 
      badge: 'Webhook URL',
      highlight: true,
      badgeColor: 'text-[#D67D5C]'
    },
    { 
      id: 'merchants' as ActiveTab, 
      label: 'Merchant POS & QR Terminal', 
      icon: Store, 
      badge: '1% Pledge',
      badgeColor: 'text-[#3D6E50]'
    },
    { 
      id: 'hunter' as ActiveTab, 
      label: 'Hunter Guild (Treasure Hunt)', 
      icon: Fingerprint, 
      badge: '15 Chapters',
      highlight: true,
      badgeColor: 'text-[#10B981]'
    },
    { 
      id: 'portal' as ActiveTab, 
      label: 'Copyright Owner Portal (Site)', 
      icon: ShieldCheck, 
      badge: 'Public URLs',
      badgeColor: 'text-[#3D6E50]'
    },
    { id: 'testers' as ActiveTab, label: 'Tester CRM & Onboarding', icon: Users, badge: '5 Active' },
    { id: 'claims' as ActiveTab, label: 'Copyright Claims & Pool', icon: ShieldCheck, badge: 'Pool Live' },
    { id: 'payouts' as ActiveTab, label: 'Creator Payouts & Stripe', icon: Landmark, badge: 'Direct Connect' },
    { id: 'personas' as ActiveTab, label: "Dragons' Den & Personas", icon: Users2, badge: '5 Dragons' },
    { 
      id: 'badge' as ActiveTab, 
      label: 'Ethical Badge & Micro-QR', 
      icon: QrCode, 
      badge: isBadgeActive ? 'Active' : 'Unlinked',
      badgeColor: isBadgeActive ? 'text-[#5A5A40]' : 'text-[#D67D5C]'
    },
    { id: 'synthesizer' as ActiveTab, label: 'Ethical AI Sandbox', icon: Sparkles },
    { id: 'broadcast' as ActiveTab, label: 'Broadcast Console', icon: Send },
    { id: 'feedback' as ActiveTab, label: 'Feedback Portal', icon: MessageSquareQuote, badge: '3 Unread' },
    { id: 'privacy' as ActiveTab, label: 'Privacy Policy & PDF', icon: Scale, badge: 'C2PA PDF' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E0D8] bg-[#F9F7F2]/95 dark:bg-[#101B18]/95 backdrop-blur-md transition-colors">
      {/* Directory Modal */}
      <PublicUrlsDirectoryModal 
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onNavigateTab={(tab) => {
          onSelectTab(tab);
          setIsDirectoryOpen(false);
        }}
      />

      {/* Top Banner with live stats */}
      <div className="border-b border-[#E5E0D8] dark:border-[#1E3A33] bg-[#F2ECE4] dark:bg-[#0B1311] px-3 sm:px-4 py-1.5 text-xs text-[#5A5A40] dark:text-[#94A3B8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="font-mono text-[#2D2926] dark:text-[#F0FDF4] truncate text-[11px] sm:text-xs">
              <strong className="text-[#059669] dark:text-[#34D399] font-bold">H.U.M.A.N. Initiative</strong>: Powering Ethical AI Apps
            </span>
            <span className="hidden lg:inline text-[#B8ADA0] dark:text-[#1E3A33]">|</span>
            <span className="hidden lg:inline text-[#6A655C] dark:text-[#94A3B8] font-mono text-[11px]">
              4 Connected Apps • 50% Subscription Restitution Pool
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* All URLs Directory Launcher Button */}
            <button
              onClick={() => setIsDirectoryOpen(true)}
              className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 sm:px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors font-bold cursor-pointer"
              title="Open Directory of all Public, Creator, Developer and Admin URLs"
            >
              <Globe2 className="w-3 h-3 text-emerald-500" />
              <span className="hidden sm:inline">All URLs Directory</span>
              <span className="sm:hidden">URLs</span>
            </button>

            {/* Master Admin Color Studio Trigger */}
            {onOpenColorStudio && (
              <button
                onClick={onOpenColorStudio}
                className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#064E3B] dark:text-[#34D399] hover:text-[#047857] transition-all bg-[#EAF4EE] dark:bg-[#142320] hover:bg-[#D8ECE0] dark:hover:bg-[#1E3A33] px-2 sm:px-2.5 py-1 rounded-lg border border-[#A7F3D0] dark:border-[#1E3A33] shadow-2xs font-bold cursor-pointer"
                title="Open Master Administration Color Studio & Sliders"
              >
                <Paintbrush className="w-3 h-3 text-[#059669] dark:text-[#34D399]" />
                <span>Colors</span>
              </button>
            )}

            {/* Top Settings Area: Light / Dark Mode Adjustment Switch */}
            <div className="flex items-center bg-[#E5E0D8] dark:bg-[#142320] p-0.5 rounded-lg border border-[#DCD5CA] dark:border-[#1E3A33]" title="Theme Adjustment Switch">
              <button
                onClick={() => setMode('light')}
                className={`p-1 rounded-md text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'light'
                    ? 'bg-[#FFFFFF] text-[#064E3B] font-bold shadow-2xs'
                    : 'text-[#6A655C] dark:text-[#94A3B8] hover:text-[#2D2926]'
                }`}
                title="Light Sage & Alabaster Mode"
              >
                <Sun className="w-3.5 h-3.5 text-[#D97706]" />
                <span className="hidden xl:inline text-[11px]">Light</span>
              </button>

              <button
                onClick={() => setMode('dark')}
                className={`p-1 rounded-md text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'dark'
                    ? 'bg-[#10B981] text-[#0B1311] font-bold shadow-2xs'
                    : 'text-[#6A655C] dark:text-[#94A3B8] hover:text-[#2D2926]'
                }`}
                title="Cyber Dark Mode (Obsidian & Emerald Glow)"
              >
                <Moon className="w-3.5 h-3.5 text-[#0B1311]" />
                <span className="hidden xl:inline text-[11px]">Dark</span>
              </button>

              <button
                onClick={() => setMode('oled')}
                className={`p-1 rounded-md text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'oled'
                    ? 'bg-[#34D399] text-[#000000] font-bold shadow-2xs'
                    : 'text-[#6A655C] dark:text-[#94A3B8] hover:text-[#2D2926]'
                }`}
                title="OLED Pure Midnight"
              >
                <Zap className="w-3.5 h-3.5 text-[#000000]" />
                <span className="hidden xl:inline text-[11px]">OLED</span>
              </button>
            </div>

            {/* Side Menu Tool & Taskbar Button */}
            <button
              onClick={toggleSideMenu}
              className="flex items-center gap-1 text-[11px] font-mono text-[#064E3B] dark:text-[#34D399] hover:text-[#047857] transition-colors bg-[#EAF4EE] dark:bg-[#142320] hover:bg-[#D8ECE0] dark:hover:bg-[#1E3A33] px-2 sm:px-2.5 py-1 rounded-lg border border-[#A7F3D0] dark:border-[#1E3A33] shadow-2xs font-semibold cursor-pointer"
              title="Open Hideable Side Menu Tools & Python SDK Console"
            >
              <Sliders className="w-3 h-3 text-[#059669] dark:text-[#34D399]" />
              <span className="hidden sm:inline">Tools & Settings</span>
              <span className="sm:hidden">Tools</span>
            </button>

            <button
              onClick={onOpenStripeModal}
              className="hidden md:flex items-center gap-1 text-[11px] font-mono text-[#5A5A40] dark:text-[#A7F3D0] hover:text-[#2D2926] transition-colors bg-[#FFFFFF] dark:bg-[#142320] hover:bg-[#F2ECE4] dark:hover:bg-[#1E3A33] px-2.5 py-1 rounded-lg border border-[#DCD5CA] dark:border-[#1E3A33] shadow-2xs"
              title="Stripe Sandbox Settings & Environment Secrets"
            >
              <Lock className="w-3 h-3 text-[#059669] dark:text-[#34D399]" />
              <span>Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 gap-2">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <button 
            onClick={() => onSelectTab('testers')}
            className="text-left focus:outline-none cursor-pointer shrink-0"
          >
            <HumanProtocolLogo size="md" />
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#064E3B] text-white shadow-sm font-bold'
                      : 'text-[#6A655C] dark:text-[#94A3B8] hover:text-[#2D2926] dark:hover:text-[#F0FDF4] hover:bg-[#F2ECE4] dark:hover:bg-[#142320]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#34D399]' : 'text-[#8C857B]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded border ${
                      isActive 
                        ? 'bg-[#042F24] text-[#34D399] border-[#059669]' 
                        : 'bg-[#FFFFFF] dark:bg-[#142320] text-[#6A655C] dark:text-[#94A3B8] border-[#E5E0D8] dark:border-[#1E3A33]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {tab.highlight && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right CTA Actions & Uninvasive Trust Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Top Uninvasive Verified Ethical AI Badge (Hidden on very narrow mobile to prevent overflow) */}
          <div className="hidden sm:block">
            <TopUninvasiveTrustBadge 
              onOpenBadgeModal={onOpenCustomBadgeModal}
              onOpenPrivacyModal={() => onSelectTab('privacy')}
              onNavigateToCopyright={() => onSelectTab('portal')}
            />
          </div>

          {onOpenCustomBadgeModal && (
            <button
              onClick={onOpenCustomBadgeModal}
              className="hidden md:flex items-center gap-1.5 bg-[#FFFFFF] dark:bg-[#142320] hover:bg-[#FAF8F5] dark:hover:bg-[#1E3A33] text-[#5A5A40] dark:text-[#A7F3D0] border border-[#DCD5CA] dark:border-[#1E3A33] font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer"
              title="Upload Custom Brand Logo & Configure Official Verification Badge"
            >
              <Palette className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
              <span>Badge</span>
            </button>
          )}

          {onOpenGoogleDriveModal && (
            <button
              onClick={onOpenGoogleDriveModal}
              className="flex items-center gap-1.5 bg-[#FFFFFF] dark:bg-[#142320] hover:bg-[#FAF8F5] dark:hover:bg-[#1E3A33] text-[#064E3B] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A33] font-bold text-xs px-2.5 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer"
              title="Google Drive Storage & Cloud SQL Database Snapshots"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
              <span className="hidden sm:inline">Drive & SQL</span>
              <span className="sm:hidden">Drive</span>
            </button>
          )}

          <button
            onClick={onOpenOnboardModal}
            className="flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1311] font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 text-[#0B1311]" />
            <span className="hidden sm:inline">Onboard Tester</span>
            <span className="sm:hidden">Onboard</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Scroller (Clean scrollable tab bar) */}
      <div className="lg:hidden flex overflow-x-auto px-3 py-1.5 gap-1.5 border-t border-[#E5E0D8] dark:border-[#1E3A33] bg-[#F2ECE4] dark:bg-[#0B1311] scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#064E3B] text-[#34D399] font-bold border border-[#10B981]/50'
                  : 'text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#EBE5DC] dark:hover:bg-[#142320]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};


