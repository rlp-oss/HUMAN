import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Check, 
  Copy, 
  ExternalLink, 
  Search, 
  Lock, 
  Award, 
  BookOpen, 
  Music, 
  Code, 
  Video, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  FileCheck, 
  HelpCircle,
  Eye,
  Layers,
  ArrowDownToLine,
  Landmark,
  FileCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePrivacyPolicyPdf } from '../utils/pdfGenerator';

interface PrivacyPolicyViewerProps {
  onNavigateToTab?: (tabName: any) => void;
}

export const PrivacyPolicyViewer: React.FC<PrivacyPolicyViewerProps> = ({ onNavigateToTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'plain' | 'legal'>('plain');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        const filename = generatePrivacyPolicyPdf();
        setIsGeneratingPdf(false);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5A5A40', '#3D6E50', '#D67D5C', '#10B981']
        });
        showToast(`Downloaded Official Signed PDF: ${filename}`);
      } catch (err) {
        console.error('Failed to generate PDF:', err);
        setIsGeneratingPdf(false);
        showToast('Error generating PDF. Please try again.');
      }
    }, 400);
  };

  const handleCopyMarkdown = () => {
    const fullText = `# H.U.M.A.N. Protocol & Ecosystem Privacy Policy
Effective Date: August 19, 2026 | Document ID: HUMAN-POL-2026-V4.2-C2PA
Non-Profit Authority: H.U.M.A.N. Protocol Foundation
Standards: EU AI Act (Art. 50/53), Fairly Trained (FT-2026), C2PA JUMBF v2.1, GDPR & CCPA

## 1. Scope & Multi-App Architecture
The H.U.M.A.N. Non-Profit Foundation governs the ethical verification and micro-royalty routing across 4 flagship applications:
- Tome Crafter (https://tomecrafter-ai-book-studio.ai.studio) - FT-ETHIC-TOMECRAFTER-2026
- RLM Pro Studio (https://remix-lyria-studio-5954.ai.studio) - FT-ETHIC-RLM-AUDIO-2026
- ForgeOS App Builders & Tester (https://forgeos-app-builder-tester-console-416188261320.us-east1.run.app) - FT-ETHIC-FORGEOS-APPBUILDER-2026
- RL Easy Flow (https://rl-easy-flow.ai.studio) - FT-ETHIC-RL-EASY-FLOW-2026

## 2. Zero-Ingestion Cleanroom Guarantee
User-authored book drafts, audio stems, codebases, and video prompts are NEVER scraped or utilized to train foundation models without explicit consent.

## 3. Data We Process
- C2PA Cryptographic Hashes & Manifests (SHA-256)
- Story Protocol Programmable IP Identifiers
- Stripe Connect Tokenized Escrow Routing (Zero card/banking storage on H.U.M.A.N. servers)
- Diagnostic Opt-In Tester Telemetry

## 4. Pass-Through Micro-Royalty Escrow
Per-inference fees are routed directly to registered authors, artists, and open-source maintainers. The non-profit foundation retains 0% of creator royalty pools.

## 5. Global Regulatory Compliance
- EU AI Act: Articles 50 & 53 compliant synthetic media watermarking.
- GDPR: Full user rights to access, rectification, erasure, and portability.
- CCPA / CPRA: Zero sale or sharing of personal information.
- C2PA Specification v2.1: Tamper-evident digital provenance.

Contact: legal@human-protocol.org / codygermain032@gmail.com`;

    navigator.clipboard.writeText(fullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
    showToast('Copied Privacy Policy Markdown to clipboard!');
  };

  const apps = [
    {
      name: 'Tome Crafter',
      url: 'https://tomecrafter-ai-book-studio.ai.studio',
      vertical: 'Complete Book Creation & Publishing Suite',
      auditId: 'FT-ETHIC-TOMECRAFTER-2026',
      icon: <BookOpen className="w-4 h-4 text-emerald-800" />,
      tag: 'Drafting to Publishing'
    },
    {
      name: 'RLM Pro Studio',
      url: 'https://remix-lyria-studio-5954.ai.studio',
      vertical: 'Hybrid Audio Production Suite & Stem DAW',
      auditId: 'FT-ETHIC-RLM-AUDIO-2026',
      icon: <Music className="w-4 h-4 text-[#5A5A40]" />,
      tag: 'Stem Split & Master DAW'
    },
    {
      name: 'ForgeOS App Builders & Tester',
      url: 'https://forgeos-app-builder-tester-console-416188261320.us-east1.run.app',
      vertical: 'Open-Source Code AST Engine & Tester Console',
      auditId: 'FT-ETHIC-FORGEOS-APPBUILDER-2026',
      icon: <Code className="w-4 h-4 text-indigo-700" />,
      tag: 'Cleanroom AST & Zero-Copyleft'
    },
    {
      name: 'RL Easy Flow',
      url: 'https://rl-easy-flow.ai.studio',
      vertical: 'AI-Powered Video Generation Studio',
      auditId: 'FT-ETHIC-RL-EASY-FLOW-2026',
      icon: <Video className="w-4 h-4 text-[#D67D5C]" />,
      tag: 'AI Video Scene Generator'
    }
  ];

  const sections = [
    {
      id: 'section-1',
      number: '1',
      title: 'Scope & Entity Architecture',
      plain: 'The H.U.M.A.N. Protocol is a registered non-profit ethical authority and registry. The 4 commercial apps (Tome Crafter, RLM Pro Studio, ForgeOS, and RL Easy Flow) are separate entities that embed the H.U.M.A.N. badge to guarantee fair creator micro-royalties and cryptographic watermarking. The non-profit foundation takes 0% profit.',
      legal: 'This Privacy Policy governs the decentralized cryptographic verification, audit registry, and micro-royalty routing services operated by the H.U.M.A.N. Non-Profit Foundation ("H.U.M.A.N.", "we", "our"). The commercial platforms operating within this ecosystem operate as independent data fiduciaries bound by the H.U.M.A.N. Ethical AI Covenant and C2PA provenance standards.'
    },
    {
      id: 'section-2',
      number: '2',
      title: 'Zero-Ingestion Cleanroom AI Guarantee',
      plain: 'We NEVER use your books, audio stems, code, or video prompts to train foundation AI models. Your creative works remain 100% yours. All AI models in our ecosystem are certified by Fairly Trained (FT-2026) to prove no pirated or non-consensual works were used.',
      legal: 'In compliance with the Fairly Trained (FT-2026) cleanroom standard and EU AI Act Article 53, no user prompts, draft manuscripts, acoustic multi-tracks, source trees, or synthesized assets are logged, ingested, cached, or aggregated into foundation training sets. Inferences are executed in stateless sandbox containers with instantaneous memory flush upon job termination.'
    },
    {
      id: 'section-3',
      number: '3',
      title: 'Information We Process (Minimal Data Principle)',
      plain: 'We only process public cryptographic hashes (like SHA-256 C2PA stamps) and tokenized payout IDs from Stripe. We never store credit cards, bank accounts, or sensitive identity information on our servers.',
      legal: 'We collect and process solely the minimal cryptographic artifacts necessary for content provenance and financial settlement: (a) 160-bit and 256-bit C2PA JUMBF Merkle claim roots; (b) Programmable Story Protocol IP Asset identifiers; (c) Tokenized Stripe Connect account references for instant creator micro-payouts; and (d) Opt-in tester diagnostic reports.'
    },
    {
      id: 'section-4',
      number: '4',
      title: 'Pass-Through Micro-Royalty Escrow',
      plain: 'Every time AI generates content, a micro-fee is deposited into an escrow clearing buffer and paid directly to human authors, musicians, and open-source developers via Stripe Connect. The non-profit foundation takes zero cut of this pool.',
      legal: 'Micro-royalty fees ($0.005 to $0.05 per synthetic inference) are deposited into an automated pass-through clearing pool. Funds are disbursed in real-time to verified rights holders and open-source maintainers via Stripe Connect Express. The H.U.M.A.N. non-profit entity retains zero percent (0%) of royalty disbursements.'
    },
    {
      id: 'section-5',
      number: '5',
      title: 'Global Compliance (EU AI Act, GDPR & CCPA)',
      plain: 'Our badge guarantees 100% compliance with the European Union AI Act (Articles 50 & 53), GDPR privacy rights, and California CCPA rules. You have the right to access, delete, or export your attribution data at any time.',
      legal: 'We satisfy all transparency mandates under EU AI Act Regulation (EU) 2024/1689 (Arts. 50 & 53), including machine-readable metadata watermarking and copyright summaries. Under GDPR (Regulation EU 2016/679) and CCPA/CPRA, users hold unconditional rights of access, rectification, erasure, and data portability without discrimination.'
    },
    {
      id: 'section-6',
      number: '6',
      title: 'Cookies & Local Storage',
      plain: 'We do NOT use tracking cookies or sell your data to ad networks. We only use standard browser storage to remember your active app tab and theme preference.',
      legal: 'The console and client-side badge components utilize standard browser `localStorage` solely to maintain ephemeral UI state, domain binding confirmations, and theme tokens. No third-party tracking pixels, advertising beacons, or behavioral fingerprinting scripts are deployed.'
    },
    {
      id: 'section-7',
      number: '7',
      title: 'Cryptographic Security & OSPO Sandbox',
      plain: 'All code generation runs in an isolated sandbox with zero-copyleft quarantine to prevent license contamination, protected by TLS 1.3 encryption and automated security rules.',
      legal: 'Technical safeguards include end-to-end TLS 1.3 encryption, AES-256 encrypted database storage, strict Firestore role-based security rules, OSPO AST code license quarantine, and automated C2PA cryptographic signature verification.'
    },
    {
      id: 'section-8',
      number: '8',
      title: 'Contact & Data Protection Officer',
      plain: 'If you have questions about your rights or want to verify an audit claim, contact our Data Protection Officer at privacy@human-protocol.org.',
      legal: 'For legal notices, cryptographic verification inquiries, or data subject access requests (DSAR), contact the H.U.M.A.N. Protocol Data Protection Officer at codygermain032@gmail.com or legal@human-protocol.org.'
    }
  ];

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.plain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.legal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#3D6E50]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#3D6E50]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner with PDF Download Action */}
      <div className="rounded-2xl border-2 border-[#5A5A40]/30 bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/30 text-xs font-mono text-[#5A5A40] font-bold">
              <Scale className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>H.U.M.A.N. Protocol • Official Legal & Privacy Center</span>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2926] tracking-tight flex items-center gap-2 flex-wrap">
              <span>Ecosystem Privacy Policy & Cleanroom Covenant</span>
              <span className="text-xs font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] px-2.5 py-0.5 rounded-full border border-[#C9D1BE]">
                EU AI Act & C2PA Certified
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6A655C] leading-relaxed">
              Legally binding commitments governing data minimization, zero-ingestion cleanroom AI safety, C2PA tamper-evident watermarking, and non-profit creator micro-royalty pass-through across all 4 flagship applications.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono font-bold text-[#5A5A40] flex items-center gap-2 shadow-2xs transition-all cursor-pointer hover:border-[#5A5A40]"
              title="Copy plain markdown format for legal review or documentation"
            >
              {copiedText ? <Check className="w-4 h-4 text-[#3D6E50]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'Copied Markdown' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF (Signed)'}</span>
            </button>
          </div>
        </div>

        {/* Regulatory Stamp Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E5E0D8] text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-0.5">
            <span className="text-[10px] text-[#8C857B] uppercase block">AI Standard</span>
            <strong className="text-[#2D2926] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#3D6E50]" /> Fairly Trained (FT-2026)
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-0.5">
            <span className="text-[10px] text-[#8C857B] uppercase block">Content Provenance</span>
            <strong className="text-[#2D2926] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#3D6E50]" /> C2PA JUMBF v2.1
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-0.5">
            <span className="text-[10px] text-[#8C857B] uppercase block">European Union</span>
            <strong className="text-[#2D2926] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#3D6E50]" /> EU AI Act Art. 50/53
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-0.5">
            <span className="text-[10px] text-[#8C857B] uppercase block">Financial Clearing</span>
            <strong className="text-[#2D2926] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#3D6E50]" /> Stripe Connect Escrow
            </strong>
          </div>
        </div>
      </div>

      {/* 4 Registered Apps Grid */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="text-sm font-bold text-[#2D2926]">4 Ecosystem Apps Bound by this Policy</h3>
          </div>
          <span className="text-xs font-mono text-[#3D6E50] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#C9D1BE]">
            4/4 Verified Cleanroom
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {apps.map((app, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8]">
                    {app.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2D2926]">{app.name}</h4>
                    <span className="text-[9px] font-mono text-[#8C857B]">{app.tag}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#6A655C] space-y-0.5">
                <div className="truncate text-indigo-700 font-semibold flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  <a href={app.url} target="_blank" rel="noreferrer" className="hover:underline truncate">
                    {app.url.replace('https://', '')}
                  </a>
                </div>
                <div className="text-[#8C857B] truncate">
                  Audit: <code className="text-[#5A5A40]">{app.auditId}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Search & View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D8]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C857B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search privacy clauses (e.g., training, royalties, GDPR, C2PA)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-xs font-mono text-[#8C857B] mr-1">Display Mode:</span>
          <button
            type="button"
            onClick={() => setViewMode('plain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'plain'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#DCD5CA] text-[#5A5A40] hover:bg-[#FAF8F5]'
            }`}
          >
            Plain English Summary
          </button>

          <button
            type="button"
            onClick={() => setViewMode('legal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'legal'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#DCD5CA] text-[#5A5A40] hover:bg-[#FAF8F5]'
            }`}
          >
            Full Legal Text (Articled)
          </button>
        </div>
      </div>

      {/* Policy Articles Accordion / Cards */}
      <div className="space-y-4">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            id={sec.id}
            className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 sm:p-6 space-y-3 shadow-2xs hover:border-[#DCD5CA] transition-all"
          >
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/40 text-xs font-mono font-bold text-[#5A5A40]">
                  {sec.number}
                </span>
                <h3 className="text-base font-bold text-[#2D2926] tracking-tight">{sec.title}</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C857B] border border-[#E5E0D8]">
                Clause {sec.number}
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-[#2D2926]">
              {viewMode === 'plain' ? (
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#5A5A40] block">
                    Plain-Language Explanation:
                  </span>
                  <p className="text-xs text-[#2D2926] leading-relaxed">{sec.plain}</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#DCD5CA] space-y-1.5 font-serif">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#8C857B] block font-sans">
                    Statutory Legal Provision:
                  </span>
                  <p className="text-xs text-[#2D2926] leading-relaxed">{sec.legal}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PDF Download Footer Banner */}
      <div className="rounded-2xl border-2 border-dashed border-[#5A5A40]/40 bg-[#FAF8F5] p-6 text-center space-y-3">
        <div className="inline-flex p-3 rounded-full bg-[#FFFFFF] border border-[#5A5A40]/30 shadow-2xs text-[#5A5A40]">
          <FileCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-lg mx-auto">
          <h4 className="text-sm font-bold text-[#2D2926]">Need a Certified PDF Copy for Corporate Legal Review?</h4>
          <p className="text-xs text-[#6A655C]">
            Download the complete, multi-page PDF document featuring official C2PA Merkle hash attestation, compliance matrix, and Fairly Trained audit IDs.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-6 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-md inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF Document'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
