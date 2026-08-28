import React, { useState } from 'react';
import {
  Globe2,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Compass,
  ShieldCheck,
  Code2,
  Users,
  Landmark,
  Coins,
  Cpu,
  Store,
  CreditCard,
  Lock,
  Sparkles,
  BookOpen,
  Radio,
  Fingerprint
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { useTheme } from '../context/ThemeContext';

interface PublicUrlsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

interface NavDirectoryItem {
  id: ActiveTab;
  title: string;
  category: 'public' | 'creators' | 'developers' | 'admin';
  audience: string;
  urlPath: string;
  description: string;
  badge: string;
  badgeColor?: string;
  icon: any;
}

const DIRECTORY_ITEMS: NavDirectoryItem[] = [
  // 1. Public & Civic Commons
  {
    id: 'mission-home',
    title: 'The Mission (Public Sanctuary)',
    category: 'public',
    audience: 'Everyday Citizens & The World',
    urlPath: '/mission or ?tab=mission-home',
    description: 'The educational sanctuary breaking down how we end needless hate, pain, violence, greed & human suffering with the 50% covenant.',
    badge: 'Public Portal',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: Heart
  },
  {
    id: 'media-hub',
    title: 'App & Broadcast Hub (Podcast Fleet)',
    category: 'public',
    audience: 'Creators, Builders, Listeners & Community',
    urlPath: '/media or ?tab=media-hub',
    description: 'The Sovereign Human Renaissance Soundboard with interactive audio player, podcast series, app fleet registry, and open SDK guides.',
    badge: 'Podcast & Apps',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Radio
  },
  {
    id: 'roadmap-site',
    title: 'Human Initiative Roadmap (Reference Site)',
    category: 'public',
    audience: 'Researchers, Economists, Public',
    urlPath: '/roadmap or ?tab=roadmap-site',
    description: 'The 7-phase civilizational master plan, macroeconomic post-scarcity milestones, and downloadable markdown specification.',
    badge: 'Public Spec URL',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Compass
  },
  {
    id: 'merchants',
    title: 'Merchant POS & 1% QR Terminal',
    category: 'public',
    audience: 'Local Businesses & Shoppers',
    urlPath: '/merchants or ?tab=merchants',
    description: 'Physical and digital merchant checkout terminal empowering businesses to pledge 1% of transactions to human community flourishing.',
    badge: 'Merchant Terminal',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: Store
  },
  {
    id: 'hunter',
    title: 'Hunter Guild & 15-Chapter Treasure Hunt',
    category: 'public',
    audience: 'Treasure Seekers, Hunters & Codebreakers',
    urlPath: '/hunter or ?tab=hunter (#hunter)',
    description: 'The underground coordination node and 15-chapter cryptographic proof-of-humanity decoder with Google Sign-In and progress telemetry.',
    badge: '15 Chapters',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Fingerprint
  },

  // 2. Creators & Rightsholders
  {
    id: 'portal',
    title: 'Copyright Owner Portal & Transparency',
    category: 'creators',
    audience: 'Artists, Writers, Musicians, Photographers',
    urlPath: '/copyright-owner or ?tab=portal',
    description: 'Public verification portal for human creators to inspect C2PA provenance hashes, claim royalties, and verify zero-knowledge attribution.',
    badge: 'Creator Portal',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: ShieldCheck
  },
  {
    id: 'payouts',
    title: 'Creator Payouts & Stripe Connect',
    category: 'creators',
    audience: 'Verified Creators & Rights Owners',
    urlPath: '/payouts or ?tab=payouts',
    description: 'Live Stripe Connect micro-payout engine streaming 50% subscription allocations directly to connected bank accounts and debit cards.',
    badge: 'Direct Connect',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: Landmark
  },

  // 3. Developers & Engineers
  {
    id: 'developer-embed',
    title: 'Developer Embed & Ecosystem SDKs',
    category: 'developers',
    audience: 'Engineers, Indie Hackers, SaaS Builders',
    urlPath: '/developers or ?tab=developer-embed',
    description: 'React, Python, and Web Component embed kits to add the 50% verified trust badge and automatic revenue split webhooks in minutes.',
    badge: 'SDK Hub',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Code2
  },
  {
    id: 'stripe-guide',
    title: 'Stripe Integration Guide & Webhooks',
    category: 'developers',
    audience: 'Backend Engineers & Payment Admins',
    urlPath: '/stripe-guide or ?tab=stripe-guide',
    description: 'Step-by-step implementation guide for configuring Stripe webhook events, destination charges, and cryptographic escrow signatures.',
    badge: 'Webhook Docs',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: CreditCard
  },

  // 4. Admin, AI & Valuation
  {
    id: 'technical-ai' as ActiveTab,
    title: 'Technical AI Build Assessment Panel',
    category: 'admin',
    audience: 'CTO, Lead Architects, AI Engineers',
    urlPath: '/technical-ai or ?tab=technical-ai',
    description: 'AI-powered build diagnostics evaluating C2PA manifests, multi-tenant locks, rate limiting, and progressive solutions for full completion.',
    badge: 'AI Diagnostics',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Cpu
  },
  {
    id: 'crypto-valuation' as ActiveTab,
    title: 'Crypto, Whitepaper & Valuation Optimizer',
    category: 'admin',
    audience: 'Founders, CFO, Web3 Token Strategists',
    urlPath: '/crypto-valuation or ?tab=crypto-valuation',
    description: 'Tokenomics strategy for $HUMAN, $RESTITUTE, and $CREATOR, interactive valuation simulator, and downloadable institutional whitepaper.',
    badge: 'Valuation Suite',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: Coins
  },
  {
    id: 'crypto-wallet' as ActiveTab,
    title: 'Sovereign Token Wallet Suite',
    category: 'admin',
    audience: 'Token Holders, Creators, Validators & Citizens',
    urlPath: '/wallet or ?tab=crypto-wallet',
    description: 'Self-custody BIP-39 24-word fortress wallet with mandatory phrase verification, phone/email 2FA, zero-knowledge humanity proof (zk-KYC), and ERC-4337 gasless transfers.',
    badge: '24-Word Vault',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Lock
  },
  {
    id: 'testers',
    title: 'Beta Tester CRM & Onboarding Console',
    category: 'admin',
    audience: 'Product Managers & Internal Admins',
    urlPath: '/testers or ?tab=testers',
    description: 'Manage the 5 beta testers across the 4 fleet apps (Tome Crafter, RLM Pro, ForgeOS, Easy Flow), trigger welcome emails, and reset sandbox.',
    badge: 'Internal Admin',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    icon: Users
  }
];

export const PublicUrlsDirectoryModal: React.FC<PublicUrlsDirectoryModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'public' | 'creators' | 'developers' | 'admin'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = filterCategory === 'all'
    ? DIRECTORY_ITEMS
    : DIRECTORY_ITEMS.filter(item => item.category === filterCategory);

  const handleCopy = (path: string, id: string) => {
    const fullUrl = `${window.location.origin}${path.split(' ')[0]}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FFFFFF] dark:bg-[#101B18] border border-[#E5E0D8] dark:border-[#1E3A33] shadow-2xl overflow-hidden text-[#2D2926] dark:text-[#F3F1EC]">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E0D8] dark:border-[#1E3A33] bg-[#FAF8F5] dark:bg-[#0B1311] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] border border-[#10B981]/30">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Public URLs & Navigation Directory</h2>
              <p className="text-xs text-[#6A655C] dark:text-[#94A3B8]">
                Curated list of public sanctuaries, creator portals, developer SDKs, and admin consoles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-[#F2ECE4] dark:bg-[#142320] hover:bg-[#E5E0D8] text-xs font-mono font-bold cursor-pointer transition-colors"
          >
            Close ✕
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-[#E5E0D8] dark:border-[#1E3A33] bg-[#FFFFFF] dark:bg-[#142320] flex flex-wrap gap-2 text-xs font-mono">
          {[
            { id: 'all', label: 'All Ecosystem URLs' },
            { id: 'public', label: 'Public & Civic Commons' },
            { id: 'creators', label: 'Creators & Rights Owners' },
            { id: 'developers', label: 'Developers & Webhooks' },
            { id: 'admin', label: 'Admin, AI & Valuation' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id as any)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-[#064E3B] text-white font-bold'
                  : 'bg-[#F2ECE4] dark:bg-[#0B1311] text-[#6A655C] dark:text-[#94A3B8] hover:bg-[#E5E0D8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B1311] border border-[#E5E0D8] dark:border-[#1E3A33] hover:border-[#10B981]/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[#EBE5DC] dark:bg-[#1E3A33] text-[#064E3B] dark:text-[#34D399]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-xs">{item.title}</h3>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6A655C] dark:text-[#94A3B8] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-2 rounded-xl bg-white dark:bg-[#142320] border border-[#E5E0D8] dark:border-[#1E3A33] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#059669] dark:text-[#34D399] truncate mr-2">{item.urlPath}</span>
                      <button
                        onClick={() => handleCopy(item.urlPath, item.id)}
                        className="flex items-center gap-1 text-[10px] text-[#6A655C] dark:text-[#94A3B8] hover:text-[#2D2926] dark:hover:text-white cursor-pointer shrink-0"
                      >
                        {copiedUrl === item.id ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E0D8] dark:border-[#1E3A33] flex items-center justify-between text-[11px]">
                    <span className="text-[#8C857B] font-mono">Audience: {item.audience}</span>
                    <button
                      onClick={() => {
                        onNavigateTab(item.id);
                        onClose();
                      }}
                      className="px-3 py-1 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0B1311] font-bold font-mono text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Open View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
