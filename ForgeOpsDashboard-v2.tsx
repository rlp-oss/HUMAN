import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  TrendingUp, 
  Radio, 
  Fingerprint, 
  Heart,
  Server,
  Code2,
  DollarSign,
  Workflow,
  Sparkles
} from 'lucide-react';

// Interfaces for App Status
interface AppHealth {
  name: string;
  slug: string;
  status: 'OPTIMAL' | 'HEALING' | 'DEGRADED';
  cpu: number;
  memory: number;
  latency: number;
  c2paSuccess: number;
  uptime: string;
  version: string;
}

interface LogEntry {
  timestamp: string;
  app: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  message: string;
}

export const ForgeOpsDashboard: React.FC = () => {
  // Real-time State Simulations
  const [apps, setApps] = useState<AppHealth[]>([
    { name: 'Tome Crafter', slug: 'tome-crafter', status: 'OPTIMAL', cpu: 14, memory: 182, latency: 42, c2paSuccess: 100, uptime: '14d 6h', version: 'v2.0.4-FT' },
    { name: 'RLM Pro Studio', slug: 'rlm-pro', status: 'OPTIMAL', cpu: 28, memory: 345, latency: 68, c2paSuccess: 100, uptime: '14d 6h', version: 'v1.8.2-FT' },
    { name: 'ForgeOS Compiler', slug: 'forge-os', status: 'OPTIMAL', cpu: 8, memory: 98, latency: 12, c2paSuccess: 100, uptime: '32d 11h', version: 'v4.2.1-AST' },
    { name: 'RL Easy Flow', slug: 'easy-flow', status: 'OPTIMAL', cpu: 45, memory: 512, latency: 110, c2paSuccess: 99.8, uptime: '6d 2h', version: 'v2.1.0-FT' }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '23:04:12', app: 'ForgeOS', level: 'SUCCESS', message: 'AST Scan complete on index.ts. 0 Copyleft violations found.' },
    { timestamp: '23:05:01', app: 'ForgeOps', level: 'INFO', message: 'Ecosystem optimization pass started: Purging unused transient states.' },
    { timestamp: '23:05:04', app: 'ForgeOps', level: 'SUCCESS', message: 'Memory footprint optimized. Saved 14.2% heap overhead globally.' },
    { timestamp: '23:06:18', app: 'Tome Crafter', level: 'INFO', message: 'Triggering C2PA JUMBF metadata injection for manuscript #TC-9821' },
    { timestamp: '23:06:20', app: 'Tome Crafter', level: 'SUCCESS', message: 'C2PA stamp signed and verified. Merkle Root: 0x8a92e109ff8b432a76cd1154e2' }
  ]);

  const [activeTab, setActiveTab] = useState<'telemetry' | 'orchestrator' | 'logs'>('telemetry');
  const [totalSubscribers, setTotalSubscribers] = useState(254120);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimisationMessage, setOptimisationMessage] = useState('');

  // Live Metric Drift Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setApps(prevApps => 
        prevApps.map(app => {
          // Slight natural random fluctuations
          const cpuDelta = (Math.random() - 0.5) * 4;
          const latencyDelta = (Math.random() - 0.5) * 6;
          const memoryDelta = (Math.random() - 0.5) * 12;

          return {
            ...app,
            cpu: Math.max(5, Math.min(95, Math.round(app.cpu + cpuDelta))),
            latency: Math.max(8, Math.min(300, Math.round(app.latency + latencyDelta))),
            memory: Math.max(50, Math.min(1024, Math.round(app.memory + memoryDelta)))
          };
        })
      );

      // Randomly inject informational logs
      if (Math.random() > 0.7) {
        const appsList = ['ForgeOS', 'Tome Crafter', 'RLM Pro Studio', 'RL Easy Flow', 'ForgeOps'];
        const randomApp = appsList[Math.floor(Math.random() * appsList.length)];
        const systemMessages = [
          'Heartbeat ping optimal. Escrow buffers holding nominal values.',
          'Checking compliance telemetry. Standard: EU AI Act Art 50 compliant.',
          'Database read latency resolved at 8ms.',
          'C2PA Merkle Tree verification successful.',
          'Stripe sandbox routed micro-royalties to Pool A.',
          'AST parser compiled 14 assets successfully.'
        ];
        const randomMsg = systemMessages[Math.floor(Math.random() * systemMessages.length)];
        const now = new Date().toTimeString().split(' ')[0];

        setLogs(prevLogs => [
          { timestamp: now, app: randomApp, level: 'INFO', message: randomMsg },
          ...prevLogs.slice(0, 24) // Cap logs at 25 entries
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Trigger Autonomous Optimisation Run
  const handleTriggerOptimisation = async () => {
    setIsOptimizing(true);
    const steps = [
      'Scanning container environments for transient leaks...',
      'Minifying compiled runtime production JS assets...',
      'De-fragmenting Firestore transactional read cache keys...',
      'Re-validating C2PA cryptographic signature latency...',
      'Recalculating sliding-scale escrow splits for 254k subscribers...',
      'Ecosystem tune-up complete! Uptime maximized.'
    ];

    for (const step of steps) {
      setOptimisationMessage(step);
      
      // Log step to terminal
      const now = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [
        { timestamp: now, app: 'ForgeOps', level: step.includes('complete') ? 'SUCCESS' : 'INFO', message: step },
        ...prev
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Set RL Easy Flow to optimal if degraded (simulation feature)
    setApps(prev => prev.map(a => ({ ...a, status: 'OPTIMAL' })));
    setIsOptimizing(false);
    setOptimisationMessage('');
  };

  // Trigger A Mock Application Glitch and Self-Healing Routine
  const handleSimulateHealer = () => {
    const now = new Date().toTimeString().split(' ')[0];
    
    // Degrade RL Easy Flow
    setApps(prev => prev.map(a => a.slug === 'easy-flow' ? { ...a, status: 'DEGRADED', cpu: 92, latency: 285 } : a));
    
    setLogs(prev => [
      { timestamp: now, app: 'RL Easy Flow', level: 'ERROR', message: 'Latency spiked to 285ms. Dynamic rendering loop blocked!' },
      { timestamp: now, app: 'ForgeOps', level: 'WARN', message: 'Anomaly detected in RL Easy Flow. Booting Autonomous Diagnostic Engine.' },
      ...prev
    ]);

    // Stage self healing steps
    setTimeout(() => {
      const t1 = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [
        { timestamp: t1, app: 'ForgeOps', level: 'INFO', message: 'Analyzing AST execution paths... Isolated block in ThreadPool-6.' },
        ...prev
      ]);
    }, 1500);

    setTimeout(() => {
      const t2 = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [
        { timestamp: t2, app: 'ForgeOps', level: 'INFO', message: 'Patch formulated: Recompiling container thread priorities in isolated sandbox.' },
        ...prev
      ]);
    }, 3000);

    setTimeout(() => {
      const t3 = new Date().toTimeString().split(' ')[0];
      // Reset App State to Healing
      setApps(prev => prev.map(a => a.slug === 'easy-flow' ? { ...a, status: 'HEALING', cpu: 65, latency: 150 } : a));
      setLogs(prev => [
        { timestamp: t3, app: 'ForgeOps', level: 'SUCCESS', message: 'Zero-downtime hot-patch compiled & injected. Blue-green canister swap active.' },
        ...prev
      ]);
    }, 4500);

    setTimeout(() => {
      const t4 = new Date().toTimeString().split(' ')[0];
      // Restore Fully
      setApps(prev => prev.map(a => a.slug === 'easy-flow' ? { ...a, status: 'OPTIMAL', cpu: 38, latency: 95 } : a));
      setLogs(prev => [
        { timestamp: t4, app: 'RL Easy Flow', level: 'SUCCESS', message: 'System operation stabilized at 95ms latency. 0 records lost.' },
        ...prev
      ]);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-white font-sans p-6 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-950 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            Meta-System Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            FORGEOPS
            <span className="text-sm font-mono bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/50">
              Autonomous Orchestration Hub v1.0
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={handleTriggerOptimisation}
            disabled={isOptimizing}
            className="flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimising Systems...' : 'Trigger Global Tune-Up'}
          </button>
          <button 
            onClick={handleSimulateHealer}
            disabled={isOptimizing}
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B]/50 text-[#F8FAFC] border border-[#1E293B] px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
            Test Self-Healing
          </button>
        </div>
      </div>

      {/* Real-time Ticker banner if optimizing */}
      {isOptimizing && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 mb-6 flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
          <p className="text-emerald-300 text-sm font-mono font-medium">
            [ForgeOps-Action]: {optimisationMessage}
          </p>
        </div>
      )}

      {/* Global Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <p className="text-[#94A3B8] text-xs font-semibold tracking-widest uppercase mb-1">Ecosystem Status</p>
          <p className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            STABLE 
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </p>
          <p className="text-[#94A3B8] text-xs mt-2 font-mono">0 Open Exploits | 0 Copyleft Risks</p>
        </div>

        <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <p className="text-[#94A3B8] text-xs font-semibold tracking-widest uppercase mb-1">C2PA Signature Health</p>
          <p className="text-2xl font-bold text-white font-mono">99.95%</p>
          <p className="text-[#94A3B8] text-xs mt-2 font-mono">Art 50/53 EU AI Act Compliance</p>
        </div>

        <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <p className="text-[#94A3B8] text-xs font-semibold tracking-widest uppercase mb-1">Active Subscribers</p>
          <p className="text-2xl font-bold text-white font-mono">
            {totalSubscribers.toLocaleString()}
          </p>
          <p className="text-[#94A3B8] text-xs mt-2 font-mono flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            94.4% Community Routing (5% Split)
          </p>
        </div>

        <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <p className="text-[#94A3B8] text-xs font-semibold tracking-widest uppercase mb-1">Monthly Society Outflow</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            ${((totalSubscribers * 30 * 0.944) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[#94A3B8] text-xs mt-2 font-mono">Real-time Streamed via Stripe</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E293B] mb-6">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'telemetry' 
              ? 'border-emerald-500 text-emerald-400 font-bold bg-[#070A11]/20' 
              : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Activity className="w-4 h-4" />
          System Telemetry
        </button>
        <button
          onClick={() => setActiveTab('orchestrator')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orchestrator' 
              ? 'border-emerald-500 text-emerald-400 font-bold bg-[#070A11]/20' 
              : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Workflow className="w-4 h-4" />
          Dynamic Scaling Operations
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'logs' 
              ? 'border-emerald-500 text-emerald-400 font-bold bg-[#070A11]/20' 
              : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Orchestrator Terminal ({logs.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applications Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2 text-[#F8FAFC]">
              <Layers className="w-5 h-5 text-emerald-400" />
              Application Health Monitor
            </h2>
            {apps.map((app) => (
              <div 
                key={app.slug} 
                className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5 hover:border-emerald-950 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base">{app.name}</h3>
                    <span className="text-xs font-mono text-[#94A3B8]">{app.version}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider ${
                    app.status === 'OPTIMAL' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' :
                    app.status === 'HEALING' ? 'bg-amber-950/60 text-amber-400 border border-amber-900 animate-pulse' :
                    'bg-red-950/60 text-red-400 border border-red-900 animate-pulse'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0F172A]/40 p-2.5 rounded-lg border border-[#1E293B]/80">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs mb-1">
                      <Cpu className="w-3.5 h-3.5" /> CPU Load
                    </div>
                    <p className="text-sm font-semibold font-mono text-white">{app.cpu}%</p>
                  </div>
                  <div className="bg-[#0F172A]/40 p-2.5 rounded-lg border border-[#1E293B]/80">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs mb-1">
                      <Database className="w-3.5 h-3.5" /> Memory
                    </div>
                    <p className="text-sm font-semibold font-mono text-white">{app.memory}MB</p>
                  </div>
                  <div className="bg-[#0F172A]/40 p-2.5 rounded-lg border border-[#1E293B]/80">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs mb-1">
                      <Activity className="w-3.5 h-3.5" /> Latency
                    </div>
                    <p className="text-sm font-semibold font-mono text-white">{app.latency}ms</p>
                  </div>
                  <div className="bg-[#0F172A]/40 p-2.5 rounded-lg border border-[#1E293B]/80">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> C2PA Rate
                    </div>
                    <p className="text-sm font-semibold font-mono text-white">{app.c2paSuccess}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics & System Diagnostics */}
          <div className="space-y-6">
            {/* Core Health Overview */}
            <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#F8FAFC]">
                <Server className="w-5 h-5 text-emerald-400" />
                Infrastructure & Escrow Escort
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-[#94A3B8] mb-1 font-mono">
                    <span>Cleanroom VM Sandboxes</span>
                    <span className="text-emerald-400 font-bold">100% Secure</span>
                  </div>
                  <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-[#94A3B8] mb-1 font-mono">
                    <span>Stripe Express API Linkages</span>
                    <span className="text-emerald-400 font-bold">Optimal</span>
                  </div>
                  <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-[#94A3B8] mb-1 font-mono">
                    <span>AST Compiler Scanning</span>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>
                  <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Stats on Scaling and Escrow */}
            <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#F8FAFC]">
                <Fingerprint className="w-5 h-5 text-emerald-400" />
                Covenant Dynamic Payouts
              </h2>
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex justify-between py-1.5 border-b border-[#1E293B]">
                  <span className="text-[#94A3B8]">Pool A (Creators):</span>
                  <span className="text-emerald-400 font-bold">70% Allocation</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-[#1E293B]">
                  <span className="text-[#94A3B8]">Pool B (Unregistered Escrow):</span>
                  <span className="text-[#94A3B8]">15% Hold</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-[#1E293B]">
                  <span className="text-[#94A3B8]">Pool C (Community Floor):</span>
                  <span className="text-[#94A3B8]">15% Flow</span>
                </li>
                <li className="flex justify-between py-1.5">
                  <span className="text-[#94A3B8]">Milestone Phase:</span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded text-xs">
                    Phase 3 (95% Split Active)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orchestrator' && (
        <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#F8FAFC]">
            <Workflow className="w-5 h-5 text-emerald-400" />
            ForgeOps Automated Scaling Lifecycle
          </h2>
          <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed max-w-3xl">
            This flowchart maps out how ForgeOps automatically audits, updates, and optimizes your entire software suite. 
            When bugs or latency spikes are discovered, the orchestrator triggers an isolated sandbox runtime to formulate AST 
            hot-patches, minimizing your total structural overhead and eliminating human operations bottlenecks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-[#0F172A]/50 border border-[#1E293B] p-4 rounded-xl flex flex-col justify-between relative">
              <div>
                <span className="text-emerald-400 font-mono text-xs font-bold block mb-2">01 / ASSESS</span>
                <h3 className="font-bold text-white text-sm mb-1">Telemetry Diagnostics</h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  Scans servers, container heaps, and SQLite logs for overhead spikes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0F172A]/50 border border-[#1E293B] p-4 rounded-xl flex flex-col justify-between relative">
              <div>
                <span className="text-emerald-400 font-mono text-xs font-bold block mb-2">02 / AUDIT</span>
                <h3 className="font-bold text-white text-sm mb-1">AST License Quarantine</h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  Quarantines code dependencies carrying copyleft licensing threats.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0F172A]/50 border border-[#1E293B] p-4 rounded-xl flex flex-col justify-between relative">
              <div>
                <span className="text-emerald-400 font-mono text-xs font-bold block mb-2">03 / FORMULATE</span>
                <h3 className="font-bold text-white text-sm mb-1">Autonomous Healing</h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  Isolates faults and structures re-compiled micro-patches in sandboxes.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#0F172A]/50 border border-[#1E293B] p-4 rounded-xl flex flex-col justify-between relative">
              <div>
                <span className="text-emerald-400 font-mono text-xs font-bold block mb-2">04 / VALIDATE</span>
                <h3 className="font-bold text-white text-sm mb-1">Canary Pipeline</h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  Asserts C2PA hashes and runs sandbox transactions using Stripe APIs.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#0F172A]/50 border border-[#1E293B] p-4 rounded-xl flex flex-col justify-between relative">
              <div>
                <span className="text-emerald-400 font-mono text-xs font-bold block mb-2">05 / DEPLOY</span>
                <h3 className="font-bold text-white text-sm mb-1">Blue-Green Swap</h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  Gradually migrates active production traffic with absolute zero downtime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-[#070A11] border border-[#1E293B] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1E293B]">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#F8FAFC]">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Live Orchestrator Shell Logs
            </h2>
            <button 
              onClick={() => setLogs([])}
              className="text-xs text-[#94A3B8] hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="bg-[#070A11] border border-[#1E293B] rounded-lg p-4 font-mono text-xs h-[450px] overflow-y-auto space-y-2.5 shadow-inner">
            {logs.length === 0 ? (
              <p className="text-[#64748B] italic">No logs recorded in this session window.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-[#1E293B] pb-1.5 last:border-0">
                  <span className="text-[#64748B] select-none">[{log.timestamp}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold select-none ${
                    log.app === 'ForgeOps' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' :
                    log.app === 'ForgeOS' ? 'bg-[#0F172A] text-[#F8FAFC]' :
                    'bg-[#070A11] text-[#94A3B8] border border-[#1E293B]'
                  }`}>
                    {log.app}
                  </span>
                  <span className={`font-semibold ${
                    log.level === 'SUCCESS' ? 'text-emerald-400' :
                    log.level === 'WARN' ? 'text-amber-400' :
                    log.level === 'ERROR' ? 'text-red-400 animate-pulse' :
                    'text-[#94A3B8]'
                  }`}>
                    [{log.level}]
                  </span>
                  <span className="text-[#F8FAFC] whitespace-pre-wrap">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgeOpsDashboard;
