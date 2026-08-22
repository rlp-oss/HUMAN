import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Globe, 
  HeartHandshake, 
  TrendingUp, 
  ArrowRight, 
  Flame, 
  Search, 
  PlusCircle, 
  Download, 
  Lock, 
  DollarSign, 
  Share2, 
  Store, 
  CheckCheck,
  CreditCard
} from 'lucide-react';
import { HumanPoweredApp, DeveloperEmbedConfig, HumanAppCategory } from '../types';
import { HumanInitiativeService } from '../services/humanInitiativeService';
import { MasterHumanBadgeIcon, HumanInitiativeLogo } from './HumanLogo';
import confetti from 'canvas-confetti';

interface DeveloperEmbedKitProps {
  onNavigateToInitiative?: () => void;
  onNavigateToMerchantPortal?: () => void;
  onNavigateToStripeGuide?: () => void;
}

export const DeveloperEmbedKit: React.FC<DeveloperEmbedKitProps> = ({
  onNavigateToInitiative,
  onNavigateToMerchantPortal,
  onNavigateToStripeGuide
}) => {
  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'embed-generator' | 'onboard-wizard' | 'registry' | 'manifesto'>('embed-generator');

  // Embed Config State
  const [embedConfig, setEmbedConfig] = useState<DeveloperEmbedConfig>({
    appId: 'app_human_tomecrafter_91',
    appName: 'Tome Crafter',
    splitPct: 50,
    theme: 'natural-olive',
    position: 'bottom-right',
    showTelemetry: true,
    showFounderFloor: true,
    customCtaText: '50% of this subscription funds food & emergency medical baselines'
  });

  const [selectedSnippetLanguage, setSelectedSnippetLanguage] = useState<'python-sdk' | 'react' | 'webcomponent' | 'node-stripe' | 'python-flask' | 'python-fastapi' | 'readme'>('python-sdk');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Ecosystem Apps List
  const [apps, setApps] = useState<HumanPoweredApp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Interactive Live Badge Simulator Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // New App Registration Form State
  const [newAppName, setNewAppName] = useState('');
  const [newAppTagline, setNewAppTagline] = useState('');
  const [newDeveloperName, setNewDeveloperName] = useState('');
  const [newDeveloperEmail, setNewDeveloperEmail] = useState('');
  const [newCategory, setNewCategory] = useState<HumanAppCategory>('Productivity & Writing');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [newGithubUrl, setNewGithubUrl] = useState('');
  const [newSubscriptionPrice, setNewSubscriptionPrice] = useState<number>(29.00);
  const [newEstimatedSubs, setNewEstimatedSubs] = useState<number>(500);
  const [newSplitPct, setNewSplitPct] = useState<number>(50);
  const [newStripeAccountId, setNewStripeAccountId] = useState('');
  const [registeredSuccessApp, setRegisteredSuccessApp] = useState<HumanPoweredApp | null>(null);

  const loadApps = () => {
    setApps(HumanInitiativeService.getEcosystemApps());
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegisterApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName || !newDeveloperName) return;

    const registered = HumanInitiativeService.registerEcosystemApp({
      appName: newAppName,
      tagline: newAppTagline || 'Ethical SaaS with automated baseline funding',
      developerName: newDeveloperName,
      developerEmail: newDeveloperEmail || 'dev@example.com',
      category: newCategory,
      appUrl: newAppUrl || 'https://example.com',
      githubUrl: newGithubUrl,
      subscriptionPriceMonthly: newSubscriptionPrice,
      estimatedSubscribers: newEstimatedSubs,
      communitySplitPct: newSplitPct,
      stripeAccountId: newStripeAccountId,
      badgeTheme: embedConfig.theme,
      badgePosition: embedConfig.position
    });

    setRegisteredSuccessApp(registered);
    loadApps();

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5A5A40', '#D67D5C', '#3D6E50']
    });

    // Update config to newly registered app
    setEmbedConfig(prev => ({
      ...prev,
      appId: registered.appClientId,
      appName: registered.appName,
      splitPct: registered.communitySplitPct
    }));
  };

  // Compute stats across all ecosystem apps
  const totalEcosystemApps = apps.length;
  const totalEcosystemMonthlyImpact = apps.reduce((sum, a) => sum + a.monthlyImpactRunRateUsd, 0);
  const totalSubscribersEcosystem = apps.reduce((sum, a) => sum + a.subscribersCount, 0);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.appName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || app.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCodeSnippet = () => {
    switch (selectedSnippetLanguage) {
      case 'python-sdk':
        return HumanInitiativeService.getInitiativeClientPythonSnippet(embedConfig.appName || 'ForgeOS App Builder');
      case 'react':
        return HumanInitiativeService.getReactEmbedSnippet(embedConfig);
      case 'webcomponent':
        return HumanInitiativeService.getWebComponentSnippet(embedConfig);
      case 'node-stripe':
        return HumanInitiativeService.getStripeSplitNodeSnippet(embedConfig.appId, embedConfig.splitPct);
      case 'python-flask':
        return HumanInitiativeService.getFlaskPythonSnippet(embedConfig.appId, 15000, 25000);
      case 'python-fastapi':
        return HumanInitiativeService.getFastApiPythonSnippet(embedConfig.appId, embedConfig.splitPct);
      case 'readme':
        return `<!-- H.U.M.A.N Powered Badge for GitHub README -->
[![H.U.M.A.N Powered](https://img.shields.io/badge/H.U.M.A.N-50%25_Subscription_Split-5A5A40?style=for-the-badge&logo=shield&logoColor=white)](https://humaninitiative.org/verify/${embedConfig.appId})
[![Tier 1 Food & Health](https://img.shields.io/badge/Tier_1_Fund-Verified-3D6E50?style=for-the-badge)](https://humaninitiative.org)

> This project is proudly **H.U.M.A.N Powered**. A baseline **${embedConfig.splitPct}%** of all recurring subscription revenue is automatically transferred via Stripe Connect to pre-fund food security ($FOOD), emergency health ($MED), and AI-displacement transition bridges.`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. MASTER HEADER & DEVELOPER MOVEMENT CALL */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border-2 border-[#5A5A40]/30 bg-gradient-to-br from-[#FAF8F5] via-[#FFFFFF] to-[#F2ECE4] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5A5A40]/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>

        <div className="relative z-10 space-y-6 max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A5A40] text-white text-xs font-mono font-bold shadow-2xs">
              <MasterHumanBadgeIcon className="w-4 h-4 text-white" />
              <span>THE DEVELOPER STAGE NORMALIZATION INITIATIVE</span>
            </div>

            <div className="text-right text-[11px] font-mono text-[#8C857B]">
              <span className="text-[#2D2926] font-bold">50% Baseline:</span> Built-in Stripe Connect Split to Global Survival Funds
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2D2926] tracking-tight leading-tight">
              Embed H.U.M.A.N in Any App. Build the Next Standard of Software.
            </h1>
            <p className="text-sm sm:text-base text-[#6A655C] leading-relaxed">
              We start at the developer stage so every new SaaS application can effortlessly adopt the 50% automated heartbeat split. Normalize ethical computing, gain customer trust, and convert everyday software subscriptions into food, medicine, and planetary renewal.
            </p>
          </div>

          {/* Quick Ecosystem Metric Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1 shadow-2xs">
              <span className="text-[11px] text-[#8C857B] font-mono block">Certified Ecosystem Apps</span>
              <span className="text-2xl font-bold font-mono text-[#2D2926] block">
                {totalEcosystemApps} Apps Live
              </span>
              <span className="text-[10px] text-[#3D6E50] font-bold">100% Zero-Extraction Standards</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1 shadow-2xs">
              <span className="text-[11px] text-[#8C857B] font-mono block">Combined Subscribers Pool</span>
              <span className="text-2xl font-bold font-mono text-[#5A5A40] block">
                {totalSubscribersEcosystem.toLocaleString()} Users
              </span>
              <span className="text-[10px] text-[#6A655C]">Subscribing to H.U.M.A.N Apps</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1 shadow-2xs">
              <span className="text-[11px] text-[#8C857B] font-mono block">Monthly Urgency Inflow Run-Rate</span>
              <span className="text-2xl font-bold font-mono text-[#D67D5C] block">
                ${totalEcosystemMonthlyImpact.toLocaleString('en-US', { minimumFractionDigits: 2 })} / mo
              </span>
              <span className="text-[10px] text-[#D67D5C] font-bold">50% Minimum Baseline Routing</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#E5E0D8]">
            <button
              onClick={() => setActiveTab('embed-generator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'embed-generator'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Interactive Embed & Webhook Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('onboard-wizard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'onboard-wizard'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Onboard New App (1-Min Wizard)</span>
            </button>

            <button
              onClick={() => setActiveTab('registry')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'registry'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>H.U.M.A.N Ecosystem Directory ({apps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('manifesto')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'manifesto'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'bg-white text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>The Developer Normalization Manifesto</span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              {onNavigateToStripeGuide && (
                <button
                  onClick={onNavigateToStripeGuide}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF0EC] hover:bg-[#F5E6DF] border border-[#EECDBC] text-[#D67D5C] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#D67D5C]" />
                  <span>Stripe Webhook Guide</span>
                </button>
              )}

              {onNavigateToInitiative && (
                <button
                  onClick={onNavigateToInitiative}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E5E0D8] text-[#2D2926] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>View Master Heartbeat Engine</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTENT: INTERACTIVE EMBED & CODE GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'embed-generator' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Embed Configurator & Live Visual Badge Preview */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Badge Visual Preview Box */}
              <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                  <h3 className="text-sm font-bold text-[#2D2926] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                    <span>Live Interactive Badge Preview</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#3D6E50] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8]">
                    Client-Side Verified
                  </span>
                </div>

                {/* Simulated Webpage Canvas */}
                <div className="rounded-2xl border-2 border-dashed border-[#E5E0D8] bg-[#FAF8F5] p-6 relative min-h-[220px] flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-[#8C857B] uppercase tracking-wider">
                      Target App: <strong className="text-[#2D2926]">{embedConfig.appName}</strong>
                    </div>
                    <p className="text-xs text-[#6A655C]">
                      Your customers see this certified trust mark across your site, checkout page, or footer.
                    </p>
                  </div>

                  {/* Rendered Live Badge */}
                  <div className="pt-4 flex justify-center">
                    <div 
                      onClick={() => setShowPreviewModal(true)}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 shadow-md flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border text-xs font-mono font-bold ${
                        embedConfig.theme === 'natural-olive' 
                          ? 'bg-[#5A5A40] text-white border-[#4A4A33]' 
                          : embedConfig.theme === 'warm-clay'
                          ? 'bg-[#D67D5C] text-white border-[#C06B4C]'
                          : embedConfig.theme === 'charcoal-dark'
                          ? 'bg-[#1E1E1E] text-white border-[#333333]'
                          : 'bg-white text-[#2D2926] border-[#E5E0D8]'
                      }`}
                    >
                      <MasterHumanBadgeIcon className="w-4 h-4" />
                      <div className="flex flex-col text-left leading-tight">
                        <span className="text-[11px] font-bold">H.U.M.A.N POWERED</span>
                        <span className="text-[9px] opacity-80">{embedConfig.splitPct}% Split • Tier 1 Verified</span>
                      </div>
                      <ShieldCheck className="w-3.5 h-3.5 ml-1 opacity-90" />
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[10px] text-[#8C857B] italic">
                      (Click badge above to test the customer transparency popover)
                    </span>
                  </div>
                </div>

                {/* Configuration Controls */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                      Badge Visual Theme
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'natural-olive', label: 'Natural Olive (Founder)' },
                        { id: 'warm-clay', label: 'Warm Clay (Urgency)' },
                        { id: 'charcoal-dark', label: 'Charcoal Dark (Code)' },
                        { id: 'minimal-light', label: 'Minimal Linen Light' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setEmbedConfig(prev => ({ ...prev, theme: t.id as any }))}
                          className={`p-2 rounded-xl text-xs font-mono transition-all text-left border cursor-pointer ${
                            embedConfig.theme === t.id
                              ? 'border-[#2D2926] bg-[#FAF8F5] font-bold text-[#2D2926]'
                              : 'border-[#E5E0D8] bg-white text-[#6A655C] hover:border-[#DCD5CA]'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#2D2926]">
                        Automated Subscription Split Commitment
                      </label>
                      <span className="font-mono text-xs font-bold text-[#D67D5C]">
                        {embedConfig.splitPct}% of Subscriptions
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={95}
                      step={5}
                      value={embedConfig.splitPct}
                      onChange={(e) => setEmbedConfig(prev => ({ ...prev, splitPct: Number(e.target.value) }))}
                      className="w-full accent-[#D67D5C]"
                    />
                    <div className="flex justify-between text-[10px] text-[#8C857B] font-mono mt-1">
                      <span>50% Baseline (Required)</span>
                      <span>75% High Impact</span>
                      <span>95% Full Initiative</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D2926] mb-1.5">
                      Badge Placement Position
                    </label>
                    <select
                      value={embedConfig.position}
                      onChange={(e) => setEmbedConfig(prev => ({ ...prev, position: e.target.value as any }))}
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                    >
                      <option value="bottom-right">Floating Bottom-Right (Recommended)</option>
                      <option value="bottom-left">Floating Bottom-Left</option>
                      <option value="top-right">Header Top-Right</option>
                      <option value="inline">Inline Embedded in Footer</option>
                      <option value="checkout-banner">Checkout Trust Banner</option>
                    </select>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Code Snippets & Language Selector */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-xs">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#5A5A40]" />
                      <span>Developer Integration Code & SDK</span>
                    </h3>
                    <p className="text-xs text-[#6A655C] mt-0.5">
                      Drop this into your frontend or payment webhook in less than 2 minutes.
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(getCodeSnippet(), 'snippet')}
                    className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {copiedKey === 'snippet' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                    <span>{copiedKey === 'snippet' ? 'Copied Code!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Language / Platform Tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'python-sdk', label: 'Python SDK (human_initiative)', icon: Terminal },
                    { id: 'react', label: 'React / Next.js', icon: Code2 },
                    { id: 'webcomponent', label: 'HTML / Web Component', icon: Globe },
                    { id: 'node-stripe', label: 'Node.js Stripe Webhook', icon: Zap },
                    { id: 'python-flask', label: 'Python / Flask Webhook (Gateway)', icon: FileCode },
                    { id: 'python-fastapi', label: 'Python / FastAPI Webhook', icon: FileCode },
                    { id: 'readme', label: 'GitHub README Badge', icon: Share2 }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedSnippetLanguage(lang.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedSnippetLanguage === lang.id
                          ? 'bg-[#2D2926] text-white shadow-2xs'
                          : 'bg-[#FAF8F5] text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
                      }`}
                    >
                      <lang.icon className="w-3.5 h-3.5" />
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>

                {/* Code Window */}
                <div className="rounded-2xl border border-[#2D2926] bg-[#1E1E1E] text-[#D4D4D4] p-5 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed max-h-[380px]">
                  <pre>{getCodeSnippet()}</pre>
                </div>

                {/* Developer Implementation Checklist */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                  <h4 className="font-bold text-xs text-[#2D2926] uppercase font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3D6E50]" />
                    <span>3 Steps to Complete H.U.M.A.N Certification</span>
                  </h4>
                  <ul className="text-xs text-[#6A655C] space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#5A5A40] font-mono">1.</span>
                      <span><strong>Embed the UI Badge</strong> in your header, footer, or pricing table to declare your 50% baseline pledge.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#5A5A40] font-mono">2.</span>
                      <span><strong>Add the Stripe Webhook</strong> to automatically transfer the 50% split directly to the H.U.M.A.N Connect Account (<code className="font-mono text-[#2D2926]">acct_1NzkEthicalGlobalHumanFund99x</code>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#5A5A40] font-mono">3.</span>
                      <span><strong>Verify your C2PA hash</strong> to receive the official green verification seal on the public ecosystem registry.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: 1-MINUTE DEVELOPER ONBOARDING WIZARD */}
      {/* ========================================================================= */}
      {activeTab === 'onboard-wizard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="max-w-3xl mx-auto rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="border-b border-[#E5E0D8] pb-4 space-y-1">
              <span className="text-xs font-mono font-bold text-[#5A5A40] uppercase">
                Self-Serve Developer Gateway • 1-Minute Registration
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#2D2926]">
                Register Your App into the H.U.M.A.N Ecosystem
              </h2>
              <p className="text-xs text-[#6A655C]">
                Instantly generate your App Client ID, cryptographic verification seal, and join the verified list of human-first SaaS tools.
              </p>
            </div>

            {registeredSuccessApp ? (
              <div className="p-6 rounded-2xl border-2 border-[#3D6E50]/40 bg-[#FAF8F5] space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3D6E50] text-white flex items-center justify-center">
                    <CheckCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2D2926]">
                      {registeredSuccessApp.appName} Registered Successfully!
                    </h3>
                    <span className="text-xs font-mono text-[#3D6E50] font-bold">
                      Status: {registeredSuccessApp.status} • Verification Seal Issued
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] space-y-1">
                    <span className="text-[10px] text-[#8C857B] block font-mono">App Client ID</span>
                    <strong className="font-mono text-[#2D2926] text-xs">{registeredSuccessApp.appClientId}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] space-y-1">
                    <span className="text-[10px] text-[#8C857B] block font-mono">Cryptographic C2PA Hash</span>
                    <strong className="font-mono text-[#5A5A40] text-xs">{registeredSuccessApp.c2paAuditHash}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] space-y-1">
                    <span className="text-[10px] text-[#8C857B] block font-mono">Monthly Impact Run-Rate</span>
                    <strong className="font-mono text-[#D67D5C] text-xs">${registeredSuccessApp.monthlyImpactRunRateUsd.toLocaleString()} / mo</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] space-y-1">
                    <span className="text-[10px] text-[#8C857B] block font-mono">Stripe Connect Account</span>
                    <strong className="font-mono text-[#2D2926] text-xs">{registeredSuccessApp.stripeAccountId}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('embed-generator')}
                    className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Get Embed Code for {registeredSuccessApp.appName}</span>
                  </button>

                  <button
                    onClick={() => setRegisteredSuccessApp(null)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#6A655C] hover:bg-[#FAF8F5] text-xs font-bold cursor-pointer"
                  >
                    Register Another App
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterApp} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      App / Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      placeholder="e.g. ZenDesk Reforge, SoilHealth Pro, AudioGrid"
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      App Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                    >
                      <option value="Productivity & Writing">Productivity & Writing</option>
                      <option value="Audio & Synthesis">Audio & Synthesis</option>
                      <option value="Developer Tools & Cleanroom Code">Developer Tools & Cleanroom Code</option>
                      <option value="CAD, Vector & Creative Flow">CAD, Vector & Creative Flow</option>
                      <option value="Healthcare & Diagnostic Care">Healthcare & Diagnostic Care</option>
                      <option value="Regenerative Agriculture & Soil">Regenerative Agriculture & Soil</option>
                      <option value="Education & Skill Retooling">Education & Skill Retooling</option>
                      <option value="Ethical Commerce & POS">Ethical Commerce & POS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2D2926] mb-1">
                    Tagline / One-Line Problem Solved
                  </label>
                  <input
                    type="text"
                    value={newAppTagline}
                    onChange={(e) => setNewAppTagline(e.target.value)}
                    placeholder="e.g. Real-time soil microbiome sensory forecasts for organic family farms"
                    className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      Developer / Studio Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDeveloperName}
                      onChange={(e) => setNewDeveloperName(e.target.value)}
                      placeholder="e.g. Jane Doe / NorthStar Studio"
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      Developer Contact Email
                    </label>
                    <input
                      type="email"
                      value={newDeveloperEmail}
                      onChange={(e) => setNewDeveloperEmail(e.target.value)}
                      placeholder="dev@northstar.io"
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      App Website URL
                    </label>
                    <input
                      type="url"
                      value={newAppUrl}
                      onChange={(e) => setNewAppUrl(e.target.value)}
                      placeholder="https://yourapp.com"
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      GitHub Repository (Optional)
                    </label>
                    <input
                      type="url"
                      value={newGithubUrl}
                      onChange={(e) => setNewGithubUrl(e.target.value)}
                      placeholder="https://github.com/org/repo"
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      Monthly Price ($ USD)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={999}
                      value={newSubscriptionPrice}
                      onChange={(e) => setNewSubscriptionPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-mono font-bold text-[#2D2926]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      Target Subscribers
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100000}
                      step={50}
                      value={newEstimatedSubs}
                      onChange={(e) => setNewEstimatedSubs(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-mono font-bold text-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2D2926] mb-1">
                      Split Commitment (%)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={95}
                      value={newSplitPct}
                      onChange={(e) => setNewSplitPct(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-mono font-bold text-[#D67D5C]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF0EC] border border-[#EECDBC] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#D67D5C]">Estimated Monthly Impact to Global Urgency Funds:</span>
                    <span className="font-mono font-bold text-sm text-[#D67D5C]">
                      ${((newSubscriptionPrice * newEstimatedSubs * newSplitPct) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} / mo
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6A655C]">
                    30% funds food & emergency medical baselines ($FOOD, $MED), 25% funds AI-displacement restitution bridges, and the remainder funds soil and open-source tooling.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Register App & Issue Cryptographic Seal</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: H.U.M.A.N ECOSYSTEM DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'registry' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Filter & Search Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#2D2926] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#5A5A40]" />
                <span>Certified H.U.M.A.N Powered Applications Directory</span>
              </h3>
              <p className="text-xs text-[#6A655C] mt-0.5">
                Every listed application donates a minimum 50% subscription heartbeat to guaranteed human survival & health pools.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C857B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search app or developer..."
                  className="rounded-xl border border-[#E5E0D8] bg-white pl-8 pr-3 py-1.5 text-xs text-[#2D2926] focus:outline-hidden focus:border-[#5A5A40]"
                />
              </div>

              <button
                onClick={() => setActiveTab('onboard-wizard')}
                className="px-3.5 py-1.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register App</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Productivity & Writing', 'Audio & Synthesis', 'Developer Tools & Cleanroom Code', 'CAD, Vector & Creative Flow', 'Regenerative Agriculture & Soil'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#2D2926] text-white font-bold'
                    : 'bg-white text-[#6A655C] hover:bg-[#FAF8F5] border border-[#E5E0D8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Apps Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-4 shadow-2xs hover:border-[#DCD5CA] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#2D2926] flex items-center gap-1.5">
                        <span>{app.appName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3D6E50]" />
                      </h4>
                      <span className="text-[11px] text-[#8C857B] font-mono block mt-0.5">
                        {app.developerName}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#FAF0EC] text-[#D67D5C] text-xs font-mono font-bold border border-[#EECDBC]">
                      {app.communitySplitPct}% Split
                    </span>
                  </div>

                  <p className="text-xs text-[#6A655C] leading-relaxed line-clamp-2">
                    {app.tagline}
                  </p>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8C857B]">Category:</span>
                      <span className="font-bold text-[#2D2926] font-mono">{app.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8C857B]">Subscribers:</span>
                      <span className="font-bold text-[#5A5A40] font-mono">{app.subscribersCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8C857B]">Monthly Impact:</span>
                      <span className="font-bold text-[#D67D5C] font-mono">${app.monthlyImpactRunRateUsd.toLocaleString()} / mo</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#8C857B]">
                    {app.appClientId}
                  </span>

                  <button
                    onClick={() => {
                      setEmbedConfig(prev => ({
                        ...prev,
                        appId: app.appClientId,
                        appName: app.appName,
                        splitPct: app.communitySplitPct
                      }));
                      setActiveTab('embed-generator');
                    }}
                    className="text-xs text-[#5A5A40] hover:text-[#2D2926] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Get Badge</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: THE DEVELOPER NORMALIZATION MANIFESTO */}
      {/* ========================================================================= */}
      {activeTab === 'manifesto' && (
        <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
          
          <div className="rounded-3xl border-2 border-[#5A5A40]/40 bg-gradient-to-br from-[#FAF8F5] via-[#FFFFFF] to-[#F2ECE4] p-6 sm:p-10 space-y-6 shadow-sm">
            <div className="space-y-2 border-b border-[#E5E0D8] pb-4">
              <span className="text-xs font-mono font-bold text-[#5A5A40] uppercase">
                The Core Thesis • Why We Start at the Developer Stage
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2926]">
                Normalizing Human-Powered Software
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#6A655C] leading-relaxed">
              <p>
                <strong>The Software Dilemma:</strong> Traditional SaaS business models optimize for continuous user extraction, lock-in, and aggressive quarterly revenue targets that rarely benefit the broader community or protect human labor from automated obsolescence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                  <h4 className="font-bold text-xs text-[#2D2926] uppercase font-mono">1. Instant Customer Trust</h4>
                  <p className="text-xs text-[#6A655C]">
                    When subscribers see the verified H.U.M.A.N badge, they know their $29 or $39 monthly fee directly feeds families and clears medical copays, driving higher organic conversion.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                  <h4 className="font-bold text-xs text-[#2D2926] uppercase font-mono">2. Zero Operational Overhead</h4>
                  <p className="text-xs text-[#6A655C]">
                    Developers do not need to run charities. Stripe Connect automatically routes the designated split straight into the verified H.U.M.A.N Urgency Pools with zero manual bookkeeping.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                  <h4 className="font-bold text-xs text-[#2D2926] uppercase font-mono">3. Systemic Transformation</h4>
                  <p className="text-xs text-[#6A655C]">
                    If 1,000 independent software developers each route 50% of their subscription base, we create a $50M+ monthly safety net that permanently eliminates survival desperation.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#3D6E50]/40 bg-[#FAF8F5] space-y-2">
                <h4 className="font-bold text-sm text-[#3D6E50]">The Developer Promise</h4>
                <p className="text-xs text-[#6A655C] leading-relaxed">
                  Every line of code you write becomes an engine of real-world food security, preventative medicine, and ecological restoration. We make the right thing the easiest thing to do.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: Customer Transparency Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <MasterHumanBadgeIcon className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="text-base font-bold text-[#2D2926]">Certified Ethical Subscription</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-xs font-mono text-[#8C857B] hover:text-[#2D2926] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#6A655C]">
              <p>
                This application (<strong>{embedConfig.appName}</strong>) is certified under <strong>The H.U.M.A.N. Initiative</strong>.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <div className="flex items-center justify-between font-bold text-[#2D2926]">
                  <span>Automated Split:</span>
                  <span className="font-mono text-[#D67D5C]">{embedConfig.splitPct}% of Gross Revenue</span>
                </div>
                <div className="flex items-center justify-between font-bold text-[#2D2926]">
                  <span>Destination:</span>
                  <span className="text-[#3D6E50]">Tier 1 Food & Emergency Health Funds</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8C857B]">
                  <span>Verification Hash:</span>
                  <span>{embedConfig.appId}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#8C857B]">
                Your subscription eliminates survival mode as a weapon and funds verified food security and clinic redemptions via closed-loop tokens ($FOOD, $MED).
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#5A5A40] text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
