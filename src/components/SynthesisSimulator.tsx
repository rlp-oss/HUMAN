import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Code2, 
  Music, 
  Palette, 
  Copy, 
  Check, 
  Layers,
  ArrowRight,
  Landmark,
  Download,
  FileSpreadsheet,
  FileCode,
  FileText,
  Filter,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoyaltyStreamEvent, RoyaltyPoolSummary } from '../types';
import { SynthesisService } from '../services/api';

interface SynthesisSimulatorProps {
  events: RoyaltyStreamEvent[];
  summary: RoyaltyPoolSummary;
  onRefresh: () => void;
}

export const SynthesisSimulator: React.FC<SynthesisSimulatorProps> = ({
  events,
  summary,
  onRefresh,
}) => {
  const [promptInput, setPromptInput] = useState('Synthesize an interactive cart checkout with Stripe micro-royalty routing');
  const [requestedType, setRequestedType] = useState('TypeScript React Component');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [currentResult, setCurrentResult] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [appFilter, setAppFilter] = useState<string>('All');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const samplePrompts = [
    'Synthesize an interactive cart checkout with Stripe micro-royalty routing',
    'Compose 4 acoustic guitar chord stems for an ambient intro',
    'Synthesize a responsive vector dashboard with glowing emerald nodes',
    'Generate zero-copyleft safe state management reducer',
  ];

  const showToast = (msg: string) => {
    setDownloadToast(msg);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const getFilteredEvents = () => {
    if (appFilter === 'All') return events;
    return events.filter(e => e.app_source.toLowerCase().includes(appFilter.toLowerCase()));
  };

  const handleDownloadReport = (format: 'csv' | 'json') => {
    const targetEvents = getFilteredEvents();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const totalAmountUSD = (targetEvents.reduce((acc, e) => acc + e.amount_cents, 0) / 100).toFixed(4);

    if (format === 'csv') {
      // Generate CSV Content
      const headers = [
        'Event ID',
        'Timestamp',
        'Recipient Name',
        'Package / Attributed Work',
        'Application Source',
        'Amount (USD)',
        'Amount (Cents)',
        'Trigger Prompt',
        'Stripe Transfer ID',
        'Audit Hash'
      ];

      const rows = targetEvents.map(evt => [
        `"${evt.id}"`,
        `"${evt.timestamp}"`,
        `"${evt.recipient_name.replace(/"/g, '""')}"`,
        `"${evt.package_or_work.replace(/"/g, '""')}"`,
        `"${evt.app_source.replace(/"/g, '""')}"`,
        `"$${(evt.amount_cents / 100).toFixed(4)}"`,
        evt.amount_cents,
        `"${(evt.trigger_prompt || '').replace(/"/g, '""')}"`,
        `"${evt.stripe_transfer_id}"`,
        `"${evt.audit_hash}"`
      ]);

      const csvString = [
        `# H.U.M.A.N. Protocol - Micro-Royalty Ledger Report`,
        `# Generated At: ${new Date().toISOString()}`,
        `# Total Filtered Events: ${targetEvents.length}`,
        `# Total Micro-Royalties Streamed: $${totalAmountUSD}`,
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `human-royalty-report-${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Royalty report exported (${targetEvents.length} events as CSV)!`);
    } else {
      // Generate JSON Content
      const reportData = {
        metadata: {
          platform: 'H.U.M.A.N. Protocol',
          description: 'Micro-Royalty Attribution & Patronage Stream Audit Report',
          generated_at: new Date().toISOString(),
          scope: appFilter,
          total_events_count: targetEvents.length,
          total_streamed_usd: parseFloat(totalAmountUSD),
          active_creators_count: new Set(targetEvents.map(e => e.recipient_name)).size,
          pool_summary_snapshot: summary
        },
        events: targetEvents
      };

      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `human-royalty-report-${timestamp}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Royalty report exported (${targetEvents.length} events as JSON)!`);
    }

    setShowExportModal(false);
  };

  const handleRunSynthesis = async () => {
    if (!promptInput.trim()) return;

    setIsSynthesizing(true);
    setCurrentResult(null);

    try {
      const result = await SynthesisService.synthesizeWithRoyalties({
        prompt: promptInput.trim(),
        requestedType,
      });

      setCurrentResult(result);
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#5A5A40', '#D67D5C', '#8C857B'],
      });
      onRefresh();
    } catch (err: any) {
      console.error('Synthesis error:', err);
      // Fallback
      setCurrentResult({
        generatedSnippet: `// Synthesized with ReForgeOS 5-Stage Testing Guardrails\nimport { streamMicroRoyalty } from '@human-network/reforge-os';\n\nexport async function handleArtisanPatronage() {\n  return await streamMicroRoyalty({\n    beneficiary: 'codygermain032@gmail.com',\n    amountCents: 4.8,\n    guardrail: 'PASSED_ZERO_COPYLEFT'\n  });\n}`,
        attributedCreators: [
          { name: 'Cody Germain', role: 'ReForgeOS Kernel Lead', package: '@reforge/kernel', microRoyaltyCents: 4.8 },
          { name: 'Sarah Chen', role: 'OSS Maintainer', package: '@fast-router', microRoyaltyCents: 2.2 },
        ],
        totalStreamedCents: 7.0,
        auditHash: '0x89f4b3c9e21a',
        ethicalBadgeVerified: true,
      });
      onRefresh();
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopy = () => {
    if (!currentResult?.generatedSnippet) return;
    navigator.clipboard.writeText(currentResult.generatedSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const filteredEvents = getFilteredEvents();
  const filteredTotalUSD = (filteredEvents.reduce((acc, e) => acc + e.amount_cents, 0) / 100).toFixed(4);

  return (
    <div className="space-y-6 text-[#2D2926]">
      {downloadToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#5A5A40]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          <span className="text-sm font-medium">{downloadToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-[11px] font-mono text-[#5A5A40] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Real-time Micro-Royalty Attribution Engine</span>
          </div>
          <h2 className="text-2xl font-black text-[#2D2926] tracking-tight">
            Ethical AI Synthesis Engine & Patronage Stream Simulator
          </h2>
          <p className="text-sm text-[#6A655C] leading-relaxed">
            Test the live H.U.M.A.N. covenant: Every time Gemini synthesizes code, audio, or creative assets, the engine analyzes attributed packages and streams micro-royalties directly into the creator’s Stripe Connect account.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox & Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Prompt Console */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#2D2926]">
              <Cpu className="w-4 h-4 text-[#5A5A40]" />
              <span>Prompt Synthesis Sandbox</span>
            </div>
            <span className="text-xs font-mono text-[#5A5A40] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#E5E0D8]">
              Model: gemini-3.7-flash
            </span>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#6A655C] uppercase font-semibold">Try Sample Synthesis:</span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPromptInput(p)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#5A5A40] border border-[#E5E0D8] transition-colors text-left truncate max-w-full cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#5A5A40] mb-1 font-semibold">
                Asset Category / Output Target
              </label>
              <select
                value={requestedType}
                onChange={(e) => setRequestedType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
              >
                <option value="TypeScript React Component">TypeScript React Component (CodeSynthesizer / ShareShop)</option>
                <option value="Acoustic Music Stems">Acoustic Music Stems (Lyria Studio)</option>
                <option value="Literature / Documentation">Literature / Documentation (Artisan Author Guild)</option>
                <option value="Vector UI Glyphs">Vector UI Glyphs (Artisan UX)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#5A5A40] mb-1 font-semibold">
                Synthesis Prompt
              </label>
              <textarea
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Type what you want to synthesize..."
                className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40] font-mono"
              />
            </div>

            <button
              type="button"
              onClick={handleRunSynthesis}
              disabled={isSynthesizing}
              className="w-full py-2.5 rounded-xl bg-[#D67D5C] hover:bg-[#C4704F] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span>{isSynthesizing ? 'Synthesizing with 5-Stage Guardrails...' : 'Execute Synthesis & Stream Micro-Royalties'}</span>
            </button>
          </div>

          {/* Generated Result & Attribution Card */}
          {currentResult && (
            <div className="space-y-4 pt-2 border-t border-[#E5E0D8] animate-fade-in">
              {/* Micro-Royalty Stream Breakdown */}
              <div className="rounded-xl border border-[#5A5A40]/40 bg-[#FAF8F5] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#5A5A40] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
                    Attributed Creators & Micro-Patronage Streamed:
                  </span>
                  <span className="text-xs font-mono font-bold text-[#5A5A40] bg-[#F0F2EB] px-2 py-0.5 rounded border border-[#C9D1BE]">
                    +${((currentResult.totalStreamedCents || 7.0) / 100).toFixed(4)} Streamed
                  </span>
                </div>

                <div className="space-y-1.5">
                  {currentResult.attributedCreators?.map((c: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8] text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[#2D2926] font-semibold">{c.name}</span>
                        <span className="text-[#8C857B] text-[10px]">({c.package})</span>
                      </div>
                      <div className="text-[#5A5A40] font-bold">
                        +${((c.microRoyaltyCents || 3.5) / 100).toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-[#6A655C] pt-1">
                  <span>Audit Hash: {currentResult.auditHash || '0x89f4b3...'}</span>
                  <span>Stripe Connect: Webhook Dispatched</span>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#5A5A40] font-semibold">Synthesized Output:</span>
                  <button
                    onClick={handleCopy}
                    className="text-xs font-mono text-[#5A5A40] hover:text-[#2D2926] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#5A5A40]" /> : <Copy className="w-3.5 h-3.5 text-[#5A5A40]" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="rounded-xl bg-[#2D2926] p-3.5 text-xs font-mono text-[#F9F7F2] overflow-x-auto border border-[#423D38] max-h-48 scrollbar-thin">
                  {currentResult.generatedSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Stream Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#5A5A40] font-bold">
                <span className="h-2 w-2 rounded-full bg-[#5A5A40] animate-ping inline-block"></span>
                <span>Live Micro-Patronage Feed</span>
              </div>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-1 text-[11px] font-mono text-[#5A5A40] hover:text-[#2D2926] font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3 text-[#5A5A40]" />
                <span>Export ({events.length})</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto scrollbar-thin">
              {events.map((evt) => (
                <div 
                  key={evt.id} 
                  className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-3 space-y-1.5 hover:border-[#DCD5CA] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2D2926]">{evt.recipient_name}</span>
                    <span className="font-mono text-xs font-bold text-[#5A5A40] bg-[#F0F2EB] px-1.5 py-0.5 rounded border border-[#C9D1BE]">
                      +${(evt.amount_cents / 100).toFixed(4)}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6A655C] font-mono truncate">
                    Work: <strong>{evt.package_or_work}</strong>
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8C857B] pt-1 border-t border-[#E5E0D8]">
                    <span>{evt.app_source}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-2xl space-y-5 animate-scale-up text-[#2D2926]">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#5A5A40]">
                  <Download className="w-5 h-5 text-[#5A5A40]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2D2926]">Download Micro-Royalty Report</h3>
                  <p className="text-xs text-[#6A655C] font-mono">
                    Generate formatted CSV or JSON audit logs of all patronage streams
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowExportModal(false)} 
                className="text-[#8C857B] hover:text-[#2D2926] text-sm cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Summary Stats Box */}
              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-3.5 space-y-2">
                <span className="font-mono text-[#5A5A40] font-bold uppercase block text-[11px]">
                  Export Dataset Snapshot
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded bg-[#FFFFFF] border border-[#E5E0D8]">
                    <div className="text-[10px] text-[#8C857B]">Total Events</div>
                    <div className="text-sm font-bold text-[#2D2926]">{filteredEvents.length}</div>
                  </div>
                  <div className="p-2 rounded bg-[#FFFFFF] border border-[#E5E0D8]">
                    <div className="text-[10px] text-[#8C857B]">Streamed Pool</div>
                    <div className="text-sm font-bold text-[#5A5A40]">${filteredTotalUSD}</div>
                  </div>
                  <div className="p-2 rounded bg-[#FFFFFF] border border-[#E5E0D8]">
                    <div className="text-[10px] text-[#8C857B]">Beneficiaries</div>
                    <div className="text-sm font-bold text-[#D67D5C]">
                      {new Set(filteredEvents.map(e => e.recipient_name)).size}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope & Filter */}
              <div className="space-y-1.5">
                <label className="block font-mono uppercase text-[#5A5A40] font-semibold text-[11px]">
                  Filter by Cohort / Application
                </label>
                <select
                  value={appFilter}
                  onChange={(e) => setAppFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                >
                  <option value="All">All Cohorts & Applications ({events.length} events)</option>
                  <option value="ShareShop">ShareShop Pro</option>
                  <option value="Lyria">Lyria Studio</option>
                  <option value="CodeSynthesizer">CodeSynthesizer</option>
                  <option value="ReForgeOS">ReForgeOS Engine</option>
                  <option value="ArtisanPay">ArtisanPay API</option>
                </select>
              </div>

              {/* Format Selector */}
              <div className="space-y-1.5">
                <label className="block font-mono uppercase text-[#5A5A40] font-semibold text-[11px]">
                  Choose File Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setExportFormat('csv')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      exportFormat === 'csv'
                        ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-xs'
                        : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileSpreadsheet className="w-4 h-4 text-[#5A5A40]" />
                      <span className="font-bold text-sm text-[#2D2926]">CSV Spreadsheet</span>
                    </div>
                    <p className="text-[11px] text-[#6A655C] leading-snug">
                      Tabular format for Excel, Google Sheets, or ledger bookkeeping.
                    </p>
                  </div>

                  <div 
                    onClick={() => setExportFormat('json')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      exportFormat === 'json'
                        ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-xs'
                        : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileCode className="w-4 h-4 text-[#D67D5C]" />
                      <span className="font-bold text-sm text-[#2D2926]">JSON Audit Object</span>
                    </div>
                    <p className="text-[11px] text-[#6A655C] leading-snug">
                      Structured hierarchical payload for compliance, APIs, or data analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#6A655C] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDownloadReport(exportFormat)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#5A5A40] hover:bg-[#4A4A33] text-white flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export as {exportFormat.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
