import React, { useState, useEffect } from 'react';
import { Shield, Key, Terminal, Eye, Trophy, RefreshCw, BarChart2, CheckCircle, AlertTriangle } from 'lucide-react';

interface DecoderEvent {
  chapter: number;
  keyAttempt: string;
  timestamp: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
}

export default function TreasureHuntDecoder() {
  const [activeTab, setActiveTab] = useState<'decoder' | 'analytics'>('decoder');
  const [inputKey, setInputKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM INITIALIZATION... COGNITIVE COVENANT ACTIVE',
    'ESTABLISHING DECENTRALIZED WEB OF TRUST NODE...',
    'AWAITING HUMAN PROVENANCE SIGNATURE KEY...'
  ]);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]); // Start with Chapter 1 unlocked
  const [currentNotification, setCurrentNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Simulated Analytics Log Database (acts as the telemetry visualizer)
  const [analyticsLogs, setAnalyticsLogs] = useState<DecoderEvent[]>([
    { chapter: 1, keyAttempt: 'hpa-axis', timestamp: '2026-08-27T14:32:01-07:00', ipAddress: '142.231.11.45', status: 'SUCCESS' },
    { chapter: 1, keyAttempt: 'cortisol', timestamp: '2026-08-27T14:35:10-07:00', ipAddress: '203.0.113.195', status: 'FAILED' },
    { chapter: 1, keyAttempt: 'hpa-axis', timestamp: '2026-08-27T14:36:22-07:00', ipAddress: '203.0.113.195', status: 'SUCCESS' },
    { chapter: 2, keyAttempt: 'agreeable', timestamp: '2026-08-27T15:02:14-07:00', ipAddress: '74.125.19.102', status: 'FAILED' },
  ]);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, msg].slice(-10)); // Keep last 10 logs
  };

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    setCurrentNotification({ type, message });
    setTimeout(() => setCurrentNotification(null), 5000);
  };

  // Pre-configured keys and unlock rewards for the Sandbox Phase
  const chapterRegistry: Record<number, { title: string; key: string; hint: string; reward: string }> = {
    1: {
      title: 'Chapter 1: The Alarm Clock & The Slow-Motion Death',
      key: 'hpa-axis',
      hint: 'The biological system that legacy frameworks redline to trigger constant survival panic.',
      reward: 'UNLOCKED Chapter 2. Gateway Interface Active: https://human-ethical-ai.ai.studio/testers'
    },
    2: {
      title: 'Chapter 2: The Creative Alliance & The Locked Orchard',
      key: 'dignity',
      hint: "The first word of the second sentence of your creator ally's public statement about data privacy.",
      reward: 'UNLOCKED Chapter 3: The 50% People’s Covenant. Standard initialized.'
    },
    3: {
      title: 'Chapter 3: The 50% People’s Covenant (Stripe Leak Fix)',
      key: '0.15',
      hint: 'The correct decimal percentage for the holdingEscrow (Pool B) to halt the mathematical leak and sum to 100%.',
      reward: 'UNLOCKED Chapter 4: The Sovereign Municipal Trust Ledger.'
    },
    4: {
      title: 'Chapter 4: The Geohashed Proof-of-Humanity Schema',
      key: '5-character',
      hint: 'The visual character-length resolution used by local validation circles instead of biometric face sweeps.',
      reward: 'UNLOCKED Chapter 5: The Planetary Peace Dividend.'
    },
    5: {
      title: 'Chapter 5: The Zero-Ingestion Covenant',
      key: 'cleanroom',
      hint: 'Our software engineering standard that guarantees creative prompts and work logs are never cached or crawled.',
      reward: 'UNLOCKED Chapter 6: Deep Forge Phase Activated. Prober level reached.'
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = inputKey.trim().toLowerCase();
    if (!sanitized) return;

    setIsVerifying(true);
    addLog(`PROCESSING DECRYPTION HASH: "${sanitized.toUpperCase()}"...`);

    // Simulate cryptographic processing time
    setTimeout(() => {
      let matchedChapter = 0;
      let matchedData = null;

      // Scan registry to find which chapter matches the key
      for (const [chNum, data] of Object.entries(chapterRegistry)) {
        if (data.key.toLowerCase() === sanitized) {
          matchedChapter = Number(chNum);
          matchedData = data;
          break;
        }
      }

      const timestamp = new Date().toISOString();
      const ipAddress = '142.231.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255); // simulated client IP

      if (matchedChapter > 0 && matchedData) {
        // Record Successful Decode
        const newEvent: DecoderEvent = {
          chapter: matchedChapter,
          keyAttempt: sanitized,
          timestamp,
          ipAddress,
          status: 'SUCCESS'
        };

        setAnalyticsLogs(prev => [newEvent, ...prev]);
        setUnlockedChapters(prev => prev.includes(matchedChapter + 1) ? prev : [...prev, matchedChapter + 1]);
        
        addLog(`SUCCESS: VALID KEY DECODED FOR CHAPTER ${matchedChapter}`);
        addLog(`DECRYPTED CONTENT REVEALED: "${matchedData.reward}"`);
        notify('success', `Congratulations! You unlocked Chapter ${matchedChapter + 1}: ${chapterRegistry[matchedChapter + 1]?.title || 'Deep Forge Gates'}`);
      } else {
        // Record Failed Decode
        const newEvent: DecoderEvent = {
          chapter: Math.min(...Object.keys(chapterRegistry).map(Number).filter(n => !unlockedChapters.includes(n))),
          keyAttempt: sanitized,
          timestamp,
          ipAddress,
          status: 'FAILED'
        };

        setAnalyticsLogs(prev => [newEvent, ...prev]);
        addLog(`ERROR: SYSTEM DECRYPTION MISMATCH. CHECKSUM INCORRECT.`);
        notify('error', 'Decryption failed. Please check the clues and try again.');
      }

      setInputKey('');
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-[#F8FAFC] flex flex-col p-6 font-mono selection:bg-emerald-950 selection:text-emerald-300">
      
      {/* Background radial visual energy */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Title Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1E293B] pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-1">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>H.U.M.A.N. Protocol Core</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">THE DECENTRALIZED HUNT HOMEBASE</h1>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            The mathematical gateway to reclaim human cognitive bandwidth. Enter keys deciphered across social platforms to unlock পরবর্তী (the next) coordinates.
          </p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex bg-[#0F172A] p-1 rounded-lg border border-[#1E293B]">
          <button
            onClick={() => setActiveTab('decoder')}
            className={`px-4 py-2 rounded-md text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'decoder' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Key Decoder
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Live Analytics
          </button>
        </div>
      </div>

      {/* Global Toast Notifications */}
      {currentNotification && (
        <div className={`max-w-md mx-auto w-full mb-6 p-4 rounded-lg border flex items-start gap-3 shadow-lg animate-slide-in ${
          currentNotification.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-950/40 border-red-500/20 text-red-400'
        }`}>
          {currentNotification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {currentNotification.type === 'success' ? 'Attestation Verified' : 'Decryption Mismatch'}
            </h4>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{currentNotification.message}</p>
          </div>
        </div>
      )}

      {/* Main Grid Content Layout */}
      <div className="max-w-6xl mx-auto w-full flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {activeTab === 'decoder' ? (
          <>
            {/* Column 1 & 2: Active Keys Portal */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Decoder Console Input Card */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <h3 className="text-xs font-bold tracking-widest text-[#F8FAFC] uppercase mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Active Command Decoder Console
                </h3>

                <form onSubmit={handleKeySubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      disabled={isVerifying}
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="ENTER HASH OR DECRYPTED KEY VALUE..."
                      className="w-full bg-[#070A11] border border-[#1E293B] focus:border-emerald-500 rounded-lg px-4 py-4 text-sm focus:outline-none text-[#F8FAFC] placeholder-slate-600 tracking-widest font-black uppercase transition-all disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || !inputKey.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 text-white font-bold py-3.5 px-4 rounded-lg text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-emerald-600 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        VALIDATING SYSTEM HASH CHECKSUM...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        SUBMIT CRYPTOGRAPHIC SIGNATURE KEY
                      </>
                    )}
                  </button>
                </form>

                {/* Live Output Terminal Feed */}
                <div className="mt-6 bg-black/90 rounded-lg p-4 border border-[#1E293B] text-[10px] space-y-2 h-40 overflow-y-auto relative">
                  <div className="absolute top-2 right-2 text-zinc-600 select-none flex items-center gap-1">
                    <Terminal className="w-3 h-3" />
                    <span>SYS_COV_STDOUT</span>
                  </div>
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-emerald-500 select-none shrink-0">&gt;</span>
                      <span className={
                        log.startsWith('ERROR') 
                          ? 'text-red-400' 
                          : log.startsWith('SUCCESS') 
                            ? 'text-emerald-400 font-bold' 
                            : 'text-zinc-400'
                      }>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* The 15-Chapter Map Visualization */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
                <h3 className="text-xs font-bold tracking-widest text-[#F8FAFC] uppercase mb-4">
                  15-Chapter Decentralized Roadmap
                </h3>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {Array.from({ length: 15 }, (_, i) => i + 1).map(num => {
                    const isUnlocked = unlockedChapters.includes(num);
                    const isSandbox = num <= 5;
                    return (
                      <div
                        key={num}
                        className={`border rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all ${
                          isUnlocked 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-950/20' 
                            : 'bg-[#070A11] border-[#1E293B] text-zinc-600'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-widest mb-1">
                          Ch {num}
                        </span>
                        {isUnlocked ? (
                          <Trophy className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-zinc-700" />
                        )}
                        <span className="text-[8px] uppercase mt-1 tracking-wider select-none font-semibold">
                          {isSandbox ? 'Sandbox' : 'Deep Forge'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Column 3: Decrypted Intelligence Feed */}
            <div className="space-y-6">
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-xs font-bold tracking-widest text-[#F8FAFC] uppercase mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Decrypted Chapter Logs
                </h3>

                <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-1">
                  {unlockedChapters.map(chNum => {
                    const data = chapterRegistry[chNum];
                    if (!data) return null;
                    return (
                      <div key={chNum} className="border border-[#1E293B] bg-[#070A11]/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                            Chapter {chNum} Authorized
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <h4 className="text-xs font-bold text-[#F8FAFC] leading-normal">{data.title}</h4>
                        <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                          <span className="text-emerald-500 font-bold">Hint: </span> {data.hint}
                        </p>
                        <div className="text-[10px] bg-[#070A11] p-2 border border-[#1E293B] rounded text-emerald-400/90 leading-relaxed font-semibold">
                          {data.reward}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Live Analytics Monitoring Screen */
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-[#F8FAFC] uppercase flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-400" />
                    Hunter Traffic & Telemetry Logger
                  </h3>
                  <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mt-0.5">
                    Real-time ingestion flow monitoring of decryptions
                  </p>
                </div>
                <button 
                  onClick={() => notify('info', 'Refreshing live telemetry stream...')}
                  className="p-2 bg-[#070A11] border border-[#1E293B] rounded-lg text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ingestion Stream Table */}
              <div className="border border-[#1E293B] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs text-zinc-400">
                  <thead className="bg-[#070A11] text-zinc-500 text-[10px] tracking-widest uppercase border-b border-[#1E293B]">
                    <tr>
                      <th className="p-4 font-bold">Timestamp</th>
                      <th className="p-4 font-bold">IP Coordinates</th>
                      <th className="p-4 font-bold">Target Node</th>
                      <th className="p-4 font-bold">Key Signature</th>
                      <th className="p-4 font-bold text-right">Attestation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/50">
                    {analyticsLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-[#070A11]/30 transition-colors">
                        <td className="p-4 text-[10px] font-semibold text-zinc-500">{log.timestamp}</td>
                        <td className="p-4 font-semibold text-slate-300">{log.ipAddress}</td>
                        <td className="p-4 text-zinc-400 font-bold">Node Ch {log.chapter}</td>
                        <td className="p-4 font-mono font-bold tracking-widest text-[#F8FAFC] uppercase">
                          {log.keyAttempt}
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-block text-[9px] px-2.5 py-1 rounded font-black tracking-widest uppercase ${
                            log.status === 'SUCCESS' 
                              ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-red-950/50 text-red-400 border border-red-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inoculation & Verification Disclaimer */}
            <div className="p-5 bg-[#0F172A] border border-[#1E293B] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">Secure Firestore Telemetry Integration</h4>
                <p className="text-[10px] text-[#94A3B8] leading-relaxed mt-1 max-w-2xl">
                  This interface uses non-cookie, GDPR-compliant local transaction logs linked directly to your Google Cloud Firestore registry. It records decryption timestamps and status vectors without tracking names, emails, or biometric markers—perfectly preserving our 4.2 Privacy standard.
                </p>
              </div>
              <div className="text-[10px] bg-[#070A11] px-4 py-2 border border-[#1E293B] text-emerald-400 font-bold uppercase tracking-widest select-none shrink-0 rounded">
                Telemetry Active
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Simulated Lock icon from Lucide
function Lock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
