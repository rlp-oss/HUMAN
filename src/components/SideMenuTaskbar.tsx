import React, { useState } from 'react';
import { 
  Heart,
  Sun, 
  Moon, 
  Sparkles, 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Sliders, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  Palette, 
  Eye, 
  Pin, 
  PinOff,
  Minimize2,
  Maximize2,
  Cpu,
  HeartHandshake,
  HardDrive,
  Globe2,
  Compass,
  Archive,
  Coins,
  Fingerprint
} from 'lucide-react';
import { useTheme, ThemeMode, AccentPalette } from '../context/ThemeContext';
import { EmeraldHumanNetworkLogoIcon, HumanInitiativeLogo } from './HumanLogo';
import { generateInitiativeClientPythonCode } from '../services/humanInitiativeData';
import { ActiveTab } from './Navbar';

interface SideMenuTaskbarProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenStripeModal: () => void;
  onOpenBadgeModal: () => void;
  onOpenOnboardModal: () => void;
  onOpenUniversalThemeHub?: () => void;
  onOpenMasterColorStudio?: () => void;
  onOpenMasterLogoStudio?: () => void;
  onOpenGoogleDriveModal?: () => void;
}

export const SideMenuTaskbar: React.FC<SideMenuTaskbarProps> = ({
  onNavigateTab,
  onOpenStripeModal,
  onOpenBadgeModal,
  onOpenOnboardModal,
  onOpenUniversalThemeHub,
  onOpenMasterColorStudio,
  onOpenMasterLogoStudio,
  onOpenGoogleDriveModal,
}) => {
  const { 
    mode, 
    setMode, 
    accent, 
    setAccent, 
    glowIntensity, 
    setGlowIntensity,
    isSideMenuOpen, 
    setIsSideMenuOpen,
    toggleSideMenu,
    isTaskbarPinned,
    setIsTaskbarPinned
  } = useTheme();

  // Python SDK Interactive Sandbox State
  const [selectedAppSource, setSelectedAppSource] = useState<string>('ForgeOS App Builder');
  const [testAmountInCents, setTestAmountInCents] = useState<number>(4900); // $49.00
  const [testEmail, setTestEmail] = useState<string>('subscriber@forgeos-builder.dev');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<Array<{ text: string; time: string; type: 'info' | 'success' | 'code' }>>([
    {
      text: 'InitiativeClient SDK ready. Configured for 50% automated covenant routing.',
      time: new Date().toLocaleTimeString(),
      type: 'info'
    }
  ]);
  const [isExecutingSdk, setIsExecutingSdk] = useState<boolean>(false);

  const pythonSnippet = generateInitiativeClientPythonCode(selectedAppSource);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(null as any), 2000);
  };

  const handleRunSimulation = () => {
    setIsExecutingSdk(true);
    const amountInDollars = (testAmountInCents / 100).toFixed(2);
    const netPool = (testAmountInCents * 0.5 / 100).toFixed(2);
    const timeStr = new Date().toLocaleTimeString();

    setTimeout(() => {
      setSimulationLogs(prev => [
        {
          text: `[INFLOW TRIGGERED] ${selectedAppSource} • ${testEmail} • $${amountInDollars} USD`,
          time: timeStr,
          type: 'code'
        },
        {
          text: `Successfully routed $${netPool} to The Human Initiative pools. (50% Baseline Secured)`,
          time: timeStr,
          type: 'success'
        },
        ...prev.slice(0, 8)
      ]);
      setIsExecutingSdk(false);
    }, 400);
  };

  return (
    <>
      {/* 1. FLOATING MINIMIZED DOCK TRIGGER / TASKBAR (When menu is closed) */}
      {!isSideMenuOpen && isTaskbarPinned && (
        <aside 
          aria-label="Theme & Tools Quick Taskbar"
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 p-1.5 rounded-full bg-[#101B18]/90 dark:bg-[#101B18]/95 border border-[#1E3A33] shadow-2xl backdrop-blur-md text-[#F0FDF4] animate-fade-in"
        >
          {/* Logo icon trigger */}
          <button
            onClick={toggleSideMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#064E3B] hover:bg-[#059669] text-white font-mono text-xs font-semibold transition-all shadow-sm cursor-pointer group"
            title="Open Side Menu & Control Tools Console"
          >
            <EmeraldHumanNetworkLogoIcon size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Tools & Theme</span>
            <span className="flex h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
          </button>

          {/* Quick Color Studio Trigger Button */}
          {onOpenMasterColorStudio && (
            <button
              onClick={onOpenMasterColorStudio}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#142320] hover:bg-[#1E3A33] border border-[#10B981]/50 text-[#34D399] text-xs font-mono font-bold transition-all cursor-pointer"
              title="Open Master Administration Color Studio & Sliders"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Color Studio</span>
            </button>
          )}

          {/* Quick Real Logo Studio Trigger Button */}
          {onOpenMasterLogoStudio && (
            <button
              onClick={onOpenMasterLogoStudio}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
              title="Upload Real Logos from Google Drive / Local Storage & Optimize Sizes"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="hidden sm:inline">Logo Studio</span>
            </button>
          )}

          {/* Quick Light / Dark adjustment pills */}
          <div className="flex items-center bg-[#0B1311] p-0.5 rounded-full border border-[#1A2E28]">
            <button
              onClick={() => setMode('light')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                mode === 'light' 
                  ? 'bg-[#EAF4EE] text-[#064E3B] shadow-xs' 
                  : 'text-[#94A3B8] hover:text-[#F0FDF4]'
              }`}
              title="Switch to Light Sage & Alabaster Mode (Matches Logo)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                mode === 'dark' 
                  ? 'bg-[#10B981] text-[#0B1311] shadow-xs' 
                  : 'text-[#94A3B8] hover:text-[#F0FDF4]'
              }`}
              title="Switch to Cyber Dark Mode (Matches Logo Emerald Glow)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('oled')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                mode === 'oled' 
                  ? 'bg-[#34D399] text-[#000000] shadow-xs' 
                  : 'text-[#94A3B8] hover:text-[#F0FDF4]'
              }`}
              title="Switch to OLED Midnight Mode"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Python SDK Copy Action */}
          <button
            onClick={handleCopyCode}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#13231F] hover:bg-[#1A332C] text-[#A7F3D0] text-xs font-mono border border-[#1E3A33] transition-colors cursor-pointer"
            title="Copy Official Python SDK Snippet"
          >
            <Terminal className="w-3.5 h-3.5 text-[#34D399]" />
            <span>{isCopied ? 'Copied SDK!' : 'Python SDK'}</span>
          </button>

          {/* Open Drawer Chevron */}
          <button
            onClick={toggleSideMenu}
            className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#F0FDF4] hover:bg-[#162924] transition-colors cursor-pointer"
            title="Expand Side Console"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* 2. EXPANDED HIDEABLE SIDE MENU DRAWER & CONTROL TASKBAR */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div 
            onClick={toggleSideMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Side Drawer Container */}
          <aside 
            aria-label="Control Console & Side Menu"
            className="fixed inset-y-0 right-0 max-w-full flex pl-10"
          >
            <div className="w-screen max-w-md bg-[#0D1815] text-[#F0FDF4] border-l border-[#1E3A33] shadow-2xl flex flex-col h-full overflow-hidden animate-slide-left">
              
              {/* TOP SETTINGS & CONTROLS HEADER */}
              <div className="p-4 sm:p-5 border-b border-[#1E3A33] bg-[#101E1A] space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <EmeraldHumanNetworkLogoIcon size={28} />
                    <div>
                      <h2 className="text-sm font-bold font-mono tracking-tight text-[#F0FDF4] flex items-center gap-2">
                        <span>CONTROL CONSOLE</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/40 font-mono">
                          50% Covenant
                        </span>
                      </h2>
                      <p className="text-[11px] text-[#94A3B8]">
                        App Themes & Developer Taskbar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsTaskbarPinned(!isTaskbarPinned)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isTaskbarPinned 
                          ? 'bg-[#064E3B] text-[#34D399] border-[#10B981]' 
                          : 'bg-[#142320] text-[#94A3B8] border-[#1E3A33]'
                      }`}
                      title={isTaskbarPinned ? 'Taskbar Pinned to Screen' : 'Unpin Taskbar'}
                    >
                      {isTaskbarPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={toggleSideMenu}
                      className="p-1.5 rounded-lg bg-[#142320] hover:bg-[#1E3A33] text-[#94A3B8] hover:text-[#F0FDF4] border border-[#1E3A33] transition-colors cursor-pointer"
                      title="Close Side Menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 1. TOP SETTINGS: LIGHT / DARK ADJUSTMENT SWITCH */}
                {/* ========================================================================= */}
                <div className="space-y-3 rounded-2xl bg-[#0B1311] p-3.5 border border-[#1E3A33]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-[#A7F3D0] flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>App Color Theme & Mode</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
                      {mode === 'dark' ? 'Cyber Emerald Dark' : mode === 'light' ? 'Sage Alabaster Light' : 'OLED Midnight'}
                    </span>
                  </div>

                  {/* 3-Way Mode Switch matching logo */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#142320] border border-[#1E3A33]">
                    <button
                      onClick={() => setMode('light')}
                      className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        mode === 'light'
                          ? 'bg-[#F4F9F6] text-[#064E3B] font-bold shadow-md'
                          : 'text-[#94A3B8] hover:text-[#F0FDF4] hover:bg-[#1A332C]'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-[#D97706]" />
                      <span className="text-[11px]">Light Sage</span>
                    </button>

                    <button
                      onClick={() => setMode('dark')}
                      className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        mode === 'dark'
                          ? 'bg-[#10B981] text-[#0B1311] font-bold shadow-md'
                          : 'text-[#94A3B8] hover:text-[#F0FDF4] hover:bg-[#1A332C]'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-[#0B1311]" />
                      <span className="text-[11px]">Cyber Dark</span>
                    </button>

                    <button
                      onClick={() => setMode('oled')}
                      className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        mode === 'oled'
                          ? 'bg-[#34D399] text-[#000000] font-bold shadow-md'
                          : 'text-[#94A3B8] hover:text-[#F0FDF4] hover:bg-[#1A332C]'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-[#000000]" />
                      <span className="text-[11px]">OLED Pure</span>
                    </button>
                  </div>

                  {/* Accent Color Palette Switcher */}
                  <div className="pt-2 border-t border-[#1E3A33]/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                      <span>Logo Accent Palette:</span>
                      <span className="text-[#34D399] font-bold">
                        {accent === 'emerald-cyber' ? 'Emerald Cyber (Default)' : accent === 'cyan-mint' ? 'Cyan Mint Circuit' : accent === 'warm-clay' ? 'Terracotta Clay' : 'Forest Sage'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'emerald-cyber', label: 'Emerald', color: '#10B981' },
                        { id: 'cyan-mint', label: 'Cyan', color: '#67E8F9' },
                        { id: 'warm-clay', label: 'Clay', color: '#D67D5C' },
                        { id: 'forest-sage', label: 'Sage', color: '#047857' }
                      ].map((pal) => (
                        <button
                          key={pal.id}
                          onClick={() => setAccent(pal.id as AccentPalette)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-medium flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                            accent === pal.id
                              ? 'border-[#34D399] bg-[#163028] text-white'
                              : 'border-[#1E3A33] bg-[#101E1A] text-[#94A3B8] hover:border-[#2D544A]'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.color }} />
                          <span>{pal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Glow Intensity Slider */}
                  <div className="pt-2 border-t border-[#1E3A33]/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#34D399]" />
                        <span>Cyber Glow Intensity</span>
                      </span>
                      <span className="text-[#34D399]">{glowIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={glowIntensity}
                      onChange={(e) => setGlowIntensity(Number(e.target.value))}
                      className="w-full accent-[#10B981] h-1.5 bg-[#162C26] rounded-lg cursor-pointer"
                    />
                  </div>

                </div>

              </div>

              {/* SCROLLABLE TOOL & TASKBAR BODY */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin">
                
                {/* ========================================================================= */}
                {/* 2. OFFICIAL PYTHON SDK TOOL (`human_initiative`) */}
                {/* ========================================================================= */}
                <div className="rounded-2xl border border-[#1E3A33] bg-[#0E1A17] p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#34D399]" />
                      <h3 className="text-xs font-mono font-bold text-[#F0FDF4]">
                        Python SDK: InitiativeClient
                      </h3>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1 rounded-lg bg-[#064E3B] hover:bg-[#059669] text-white text-[11px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    Drop into your payment webhook to route subscriber inflows into the 50% global survival & restitution pools:
                  </p>

                  {/* App Source Selector */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#94A3B8] mb-1">
                      App Source Configuration Tag
                    </label>
                    <select
                      value={selectedAppSource}
                      onChange={(e) => setSelectedAppSource(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E3A33] bg-[#0A1412] text-xs font-mono text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                    >
                      <option value="ForgeOS App Builder">ForgeOS App Builder ($99.00/mo)</option>
                      <option value="Tome Crafter">Tome Crafter ($29.00/mo)</option>
                      <option value="RLM Pro Studio">RLM Pro Studio ($49.55/mo)</option>
                      <option value="RL Easy Flow">RL Easy Flow ($39.00/mo)</option>
                    </select>
                  </div>

                  {/* Code Window */}
                  <div className="rounded-xl border border-[#1E3A33] bg-[#070D0B] p-3 text-[11px] font-mono text-[#A7F3D0] overflow-x-auto leading-relaxed shadow-inner">
                    <pre>{pythonSnippet}</pre>
                  </div>

                  {/* Test Runner & Simulator */}
                  <div className="p-3 rounded-xl bg-[#0A1412] border border-[#1E3A33] space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#A7F3D0] font-bold">Simulate Inflow Execution</span>
                      <span className="text-[#94A3B8]">$49.00 Subscription</span>
                    </div>

                    <button
                      onClick={handleRunSimulation}
                      disabled={isExecutingSdk}
                      className="w-full py-2 px-3 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0B1311] font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isExecutingSdk ? 'Routing 50% Inflow...' : 'Execute client.process_inflow()'}</span>
                    </button>

                    {/* Simulation Output Terminal */}
                    <div className="p-2.5 rounded-lg bg-[#050A09] border border-[#162C26] text-[10px] font-mono space-y-1 max-h-32 overflow-y-auto">
                      {simulationLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#52525B] shrink-0">{log.time}</span>
                          <span className={
                            log.type === 'success' ? 'text-[#34D399] font-bold' : 
                            log.type === 'code' ? 'text-[#67E8F9]' : 'text-[#94A3B8]'
                          }>
                            {log.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 3. MULTI-APP FLEET TASKBAR */}
                {/* ========================================================================= */}
                <div className="rounded-2xl border border-[#1E3A33] bg-[#0E1A17] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold text-[#F0FDF4] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Connected Apps Fleet (4 Live)</span>
                    </h3>
                    <span className="text-[10px] text-[#34D399] font-mono">100% C2PA</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'ForgeOS App Builder', tier: '$99.00/mo', subs: '4,200', split: '50%' },
                      { name: 'Tome Crafter', tier: '$29.00/mo', subs: '5,100', split: '50%' },
                      { name: 'RLM Pro Studio', tier: '$49.55/mo', subs: '3,850', split: '50%' },
                      { name: 'RL Easy Flow', tier: '$39.00/mo', subs: '1,850', split: '50%' }
                    ].map((app) => (
                      <div 
                        key={app.name}
                        className="p-2.5 rounded-xl bg-[#0A1412] border border-[#1E3A33] flex items-center justify-between text-xs font-mono"
                      >
                        <div>
                          <div className="font-bold text-[#F0FDF4]">{app.name}</div>
                          <div className="text-[10px] text-[#94A3B8]">{app.tier} • {app.subs} subscribers</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] text-[10px] font-bold">
                            {app.split} Pool
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 4. QUICK SHORTCUTS & SYSTEM PORTS */}
                {/* ========================================================================= */}
                <div className="rounded-2xl border border-[#1E3A33] bg-[#0E1A17] p-4 space-y-2.5">
                  <h3 className="text-xs font-mono font-bold text-[#F0FDF4] flex items-center gap-1.5 mb-2">
                    <Zap className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Quick Navigation Tools</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      onClick={() => {
                        onNavigateTab('mission-home');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#D67D5C] to-[#8C5A85] hover:opacity-90 border border-[#F5D5C6] text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <Heart className="w-4 h-4 text-white fill-current shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-white">The Mission (Public Sanctuary)</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-white/20 text-white rounded-full font-bold">Public Portal</span>
                        </div>
                        <div className="text-[10px] text-white/80 font-normal">Ending needless hate, pain, violence, greed & suffering</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('stripe-guide');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#1E3A33] text-left text-[#A7F3D0] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Stripe Guide</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('developer-embed');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#1E3A33] text-left text-[#A7F3D0] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Ecosystem SDK</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenBadgeModal();
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#1E3A33] text-left text-[#A7F3D0] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Brand & Seal</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('roadmap-site');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#312E81] via-[#1E1B4B] to-[#0F172A] hover:from-[#3730A3] hover:to-[#1E293B] border border-indigo-500 text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <Compass className="w-4 h-4 text-indigo-400" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-white">Evolution Roadmap & Master Plan</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500 text-white rounded-full font-bold">Reference Site</span>
                        </div>
                        <div className="text-[10px] text-indigo-200 font-normal">7 Civilizational Phases, 5 Ideological Tenets & Shareable Direct URL</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('technical-ai');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <Cpu className="w-4 h-4 text-[#34D399]" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-white">Technical AI Build Assessment</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#10B981] text-slate-950 rounded-full font-bold">Build Audit</span>
                        </div>
                        <div className="text-[10px] text-[#A7F3D0] font-normal">C2PA verification, 50% split logic, multi-tenant locks & progressive solutions</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('crypto-valuation');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-950 hover:opacity-95 border border-cyan-500 text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <Coins className="w-4 h-4 text-cyan-400" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-white">Crypto & Valuation Optimizer</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500 text-slate-950 rounded-full font-bold">Tokenomics</span>
                        </div>
                        <div className="text-[10px] text-cyan-200 font-normal">Whitepaper readiness, $HUMAN token utility & Series A valuation simulator</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('crypto-wallet');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] via-[#042F24] to-[#021A14] hover:opacity-95 border border-emerald-500 text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-white">Sovereign Crypto Token Wallet</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded-full font-bold">24-Word Vault</span>
                        </div>
                        <div className="text-[10px] text-emerald-200 font-normal">BIP-39 phrase challenge, dual SMS/Email OTP & Zero-Knowledge zk-KYC</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('hunter');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950 via-[#0A1F18] to-slate-950 hover:opacity-95 border border-emerald-400 text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <Fingerprint className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-white">Hunter Guild & Treasure Hunt</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-400 text-slate-950 rounded-full font-bold">15 Chapters</span>
                        </div>
                        <div className="text-[10px] text-emerald-200 font-normal">Proof-of-Humanity Registry, Google Auth Gateway & 15-Chapter cryptographic decoder</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('global-fund');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#1E3A8A] hover:from-[#059669] hover:to-[#2563EB] border border-[#10B981] text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <Globe2 className="w-4 h-4 text-[#34D399]" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-white">1% Global Fund & Crypto L1</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#10B981] text-slate-950 rounded-full font-bold">$4.50T</span>
                        </div>
                        <div className="text-[10px] text-[#A7F3D0] font-normal">Macro endowment, dynamic productivity yield & full technical whitepaper</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenMasterColorStudio) onOpenMasterColorStudio();
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                    >
                      <Palette className="w-4 h-4 text-[#34D399]" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold">Master Admin Color Studio</div>
                        <div className="text-[10px] text-[#A7F3D0] font-normal">Slidable palettes & custom app profiles</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenMasterLogoStudio) onOpenMasterLogoStudio();
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#34D399]/60 text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-xs"
                    >
                      <Sparkles className="w-4 h-4 text-[#34D399]" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span>Real Logo Studio & Optimizer</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#064E3B] text-[#34D399] rounded-full">Drive / Local</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-normal">Upload, crop, auto-resize to recommended dimensions</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenGoogleDriveModal) onOpenGoogleDriveModal();
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#0A1A16] hover:bg-[#142C25] border border-[#A7F3D0]/40 text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-xs"
                    >
                      <HardDrive className="w-4 h-4 text-[#F59E0B]" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-[#FDFBF7]">Google Drive & Cloud SQL Hub</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#064E3B] text-[#34D399] rounded-full">Drive API v3</span>
                        </div>
                        <div className="text-[10px] text-[#A7F3D0] font-normal">Sync snapshots, browse Drive assets & manage PostgreSQL</div>
                      </div>
                    </button>

                    <a
                      href="/downloads/human_ethical_ai_complete_gemini_notebook.zip"
                      download="human_ethical_ai_complete_gemini_notebook.zip"
                      className="p-2.5 rounded-xl bg-gradient-to-r from-amber-900/60 to-purple-900/60 hover:opacity-95 border border-amber-500/50 text-left text-white flex items-center gap-2 transition-colors cursor-pointer font-bold col-span-2 shadow-sm"
                      title="Download complete project codebase, documentation, and markdown guides for Gemini Notebook"
                    >
                      <Archive className="w-4 h-4 text-amber-300 shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="text-amber-200">Gemini Notebook Archive (.zip)</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/30 text-amber-300 rounded-full font-bold">NotebookLM Ready</span>
                        </div>
                        <div className="text-[10px] text-amber-100/80 font-normal">Curated master docs, architecture, code & economic models</div>
                      </div>
                    </a>

                    <button
                      onClick={() => {
                        if (onOpenUniversalThemeHub) onOpenUniversalThemeHub();
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#1E3A33] text-left text-[#A7F3D0] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Theme Hub CDN</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('testers');
                        setIsSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#1E3A33] text-left text-[#A7F3D0] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Tester Console</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* FOOTER OF SIDE MENU */}
              <div className="p-4 border-t border-[#1E3A33] bg-[#101E1A] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Initiative Active</span>
                </span>
                <span className="text-[#34D399] font-bold">50% Community Heartbeat</span>
              </div>

            </div>
          </aside>
        </div>
      )}
    </>
  );
};
