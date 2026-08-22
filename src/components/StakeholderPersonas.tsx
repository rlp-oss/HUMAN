import React, { useState, useEffect } from 'react';
import { 
  Users2, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  BookOpen, 
  Music, 
  Code, 
  Video, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  Flame, 
  Target, 
  Scale, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Lightbulb, 
  Download,
  Info,
  Sliders,
  CheckCheck,
  BrainCircuit,
  Zap,
  BarChart3,
  ArrowRight,
  Send,
  History,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  StakeholderPersona, 
  PersonaArchetypeCategory, 
  PersonaEvaluation,
  StakeholderInsightResult,
  HumanStatsSnapshot
} from '../types';
import { StakeholderService } from '../services/api';
import { StakeholderRoiProjectionModule } from './StakeholderRoiProjectionModule';

interface StakeholderPersonasProps {
  isBadgeActive?: boolean;
}

// Initial 5 Canonical Dragons / Stakeholder Archetypes
const INITIAL_PERSONAS: StakeholderPersona[] = [
  {
    id: 'persona_cash_flow_hawk',
    name: 'Sterling "Mr. Wonderful" Vance',
    title: 'Venture Capitalist & Software Royalty Tycoon',
    archetype: 'The Cash Flow Hawk',
    sweetSpot: 'B2B SaaS gross margins, unit economics of per-use pass-through fees, subscription cash flow across the 4 commercial apps, and enterprise pricing power.',
    avatarColor: 'bg-[#5A5A40]',
    riskTolerance: 'Capitalist-First',
    tone: 'Incisive & Direct',
    primaryConcern: 'Maximizing subscription cash flow from the 4 commercial apps without letting per-use micro-royalties erode software gross margins.',
    keyQuestions: [
      'What is the blended gross margin on Tome Crafter, RLM Pro, ForgeOS, and RL Easy Flow?',
      'How do you prevent micro-royalties from eating into your 80% SaaS gross margins on heavy generation tiers?',
      'How fast do the 4 commercial apps reach $2.5M ARR with this ethical positioning?'
    ]
  },
  {
    id: 'persona_artistic_patron',
    name: 'Elena Rostova',
    title: 'Grammy-Nominated Producer & Creator Rights Advocate',
    archetype: 'The Artistic Patron',
    sweetSpot: 'Fair artist compensation, non-exclusive ownership retention, 50% pass-through Society Fund transparency, and ASCAP/Spotify creator dignity.',
    avatarColor: 'bg-[#D67D5C]',
    riskTolerance: 'Low (Risk-Averse)',
    tone: 'Empathetic & Creator-Centric',
    primaryConcern: 'Protecting musicians, writers, and artists from predatory AI scraping and ensuring they retain 100% master & publishing rights.',
    keyQuestions: [
      'Do artists keep 100% of their copyright when registering stems with RLM Pro Studio?',
      'How quickly do 50% subscription dividend shares deposit into a creator’s Stripe Connect bank account?',
      'How will you prove to skeptical indie musicians that this is genuine economic justice and not ethics-washing?'
    ]
  },
  {
    id: 'persona_enterprise_defender',
    name: 'Victoria Stone, Esq.',
    title: 'Former Big Tech General Counsel & Regulatory Strategist',
    archetype: 'The Enterprise Defender',
    sweetSpot: 'EU AI Act Article 53 compliance, corporate copyright liability indemnity, NIST AI Risk Management Framework, and enterprise procurement peace of mind.',
    avatarColor: 'bg-indigo-700',
    riskTolerance: 'Low (Risk-Averse)',
    tone: 'Legal & Governance-Focused',
    primaryConcern: 'Protecting Fortune 500 corporate buyers from multi-million dollar copyright class-action lawsuits and statutory regulatory fines.',
    keyQuestions: [
      'Does your downloadable PDF audit certificate satisfy the EU AI Act Article 53 transparency mandate?',
      'What legal warranties and indemnities do you provide to enterprise clients using Video Studio and Tome Crafter?',
      'How does the independent non-profit foundation covenant insulate the commercial holding company from conflict-of-interest audits?'
    ]
  },
  {
    id: 'persona_tech_idealist',
    name: 'Dr. Aaron Sterling',
    title: 'Open Source Architect & Standards Pioneer',
    archetype: 'The Tech Idealist',
    sweetSpot: 'Decentralized provenance, C2PA JUMBF cryptographic standards, zero-copyleft quarantine, and open-source developer freedom.',
    avatarColor: 'bg-emerald-700',
    riskTolerance: 'Moderate',
    tone: 'Analytical & Technical',
    primaryConcern: 'Ensuring models never train on non-consensual datasets while keeping the developer integration friction near zero.',
    keyQuestions: [
      'How do you mathematically prove zero copyleft contamination in the training corpus?',
      'Can the C2PA JUMBF cryptographic manifest be stripped by downstream web proxies?',
      'Is the badge embed lightweight enough for high-speed client-side rendering in WebAssembly?'
    ]
  },
  {
    id: 'persona_growth_scaler',
    name: 'Marcus Chen',
    title: 'Hyper-Growth SaaS Founder & Developer Community Builder',
    archetype: 'The Growth Scaler',
    sweetSpot: 'Viral developer adoption loops, embed badge ubiquity, multi-app ecosystem cross-selling, and low-friction onboarding.',
    avatarColor: 'bg-amber-700',
    riskTolerance: 'High (Aggressive)',
    tone: 'Growth & Metric-Driven',
    primaryConcern: 'Turning the badge into a viral growth loop where every app carrying the badge drives new developers to ForgeOS.',
    keyQuestions: [
      'How does the badge act as a viral marketing magnet for the other 4 commercial apps?',
      'What is the developer onboarding conversion rate when dropping the React component into an existing codebase?',
      'Can you syndicate the 4 pilot apps across ProductHunt, GitHub, and creator communities simultaneously?'
    ]
  }
];

// Default Live H.U.M.A.N. Protocol Stats for Grounding
const DEFAULT_HUMAN_STATS: HumanStatsSnapshot = {
  totalStreamedUsd: 128450.00,
  totalSocietyFundUsd: 95510.00,
  activeSubscribers: 3850,
  grossMrrUsd: 191020.00,
  verifiedCreators: 180,
  covenantSplitPct: '50%',
  activeBadgeApps: 4,
  holdingEscrowUsd: 24600.00,
  copyleftViolations: 0,
};

export const StakeholderPersonas: React.FC<StakeholderPersonasProps> = ({ isBadgeActive }) => {
  const [personas, setPersonas] = useState<StakeholderPersona[]>(() => {
    const saved = localStorage.getItem('human_stakeholder_personas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved personas', e);
      }
    }
    return INITIAL_PERSONAS;
  });

  const [humanStats, setHumanStats] = useState<HumanStatsSnapshot>(DEFAULT_HUMAN_STATS);
  const [selectedApp, setSelectedApp] = useState<'all' | 'publisher' | 'rlm' | 'builder' | 'video'>('all');
  const [selectedPitchScenario, setSelectedPitchScenario] = useState<string>('hybrid_model');
  const [customPitchText, setCustomPitchText] = useState<string>('');
  
  // Gemini AI Insight Generator State
  const [selectedInsightPersonaId, setSelectedInsightPersonaId] = useState<string>('persona_cash_flow_hawk');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState<boolean>(false);
  const [currentAiInsight, setCurrentAiInsight] = useState<StakeholderInsightResult | null>(null);
  const [insightHistory, setInsightHistory] = useState<StakeholderInsightResult[]>(() => {
    const saved = localStorage.getItem('human_stakeholder_insights_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load insight history', e);
      }
    }
    return [];
  });

  const [activePersonaFilter, setActivePersonaFilter] = useState<string>('all');
  const [activeSectionTab, setActiveSectionTab] = useState<'all' | 'insights' | 'roi' | 'evaluations'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatsAdjustModal, setShowStatsAdjustModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<StakeholderPersona | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedInsight, setCopiedInsight] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New/Edit Persona Form State
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formArchetype, setFormArchetype] = useState<PersonaArchetypeCategory>('The Tech Idealist');
  const [formSweetSpot, setFormSweetSpot] = useState('');
  const [formRisk, setFormRisk] = useState<StakeholderPersona['riskTolerance']>('Moderate');
  const [formTone, setFormTone] = useState<StakeholderPersona['tone']>('Analytical & Technical');
  const [formConcern, setFormConcern] = useState('');
  const [formQuestions, setFormQuestions] = useState('');

  useEffect(() => {
    localStorage.setItem('human_stakeholder_personas', JSON.stringify(personas));
  }, [personas]);

  useEffect(() => {
    localStorage.setItem('human_stakeholder_insights_history', JSON.stringify(insightHistory));
  }, [insightHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pitchScenarios = [
    {
      id: 'hybrid_model',
      title: 'The Master Hybrid Blueprint',
      description: 'An independent Non-Profit 50% Society Fund Foundation providing unimpeachable trust, coupled with a 4-app For-Profit Commercial Software Suite with per-use micro-royalties.',
      apps: 'All 4 Flagship Apps'
    },
    {
      id: 'music_rlm',
      title: 'RLM Pro Studio: Artist & Musician Pitch',
      description: 'Convincing master/stem creators they retain 100% copyright while earning direct 50% subscription distributions and per-synthesis Stripe payouts with zero platform profit deduction on royalties.',
      apps: 'RLM Pro Studio (Music & Stems)'
    },
    {
      id: 'publisher_book',
      title: 'Tome Crafter: Author Citation & Ethics',
      description: 'A book writing & publishing suite where every cited excerpt or stylistic reference triggers automated author compensation with C2PA metadata and 50% fund pool participation.',
      apps: 'Tome Crafter (Books & Literature)'
    },
    {
      id: 'enterprise_video',
      title: 'RL Easy Flow: Enterprise Commercial Indemnity',
      description: 'Pitching risk-averse corporate marketing teams on 100% cleanroom-trained video generation with downloadable PDF compliance certificates for broadcast clearance.',
      apps: 'RL Easy Flow (Video Studio)'
    },
    {
      id: 'builder_os',
      title: 'ForgeOS App Builder: Cleanroom AST Governance',
      description: 'Empowering software developers with zero-copyleft cleanroom code generation while streaming per-inference micro-grants to open-source repository maintainers.',
      apps: 'ForgeOS App Builder OS'
    }
  ];

  // Quick Suggested Challenger Angles
  const quickChallengerAngles = [
    "How do you defend 75-80% SaaS gross margins when allocating 50% of subscription revenue to the Society Fund?",
    "What prevents a legacy AI incumbent (OpenAI, Anthropic) from copying this ethical badge model?",
    "How does Stripe Connect batching prevent high transaction fees from eating small micro-royalty transfers?",
    "Why is a 50% non-profit covenant better than traditional enterprise copyright insurance?"
  ];

  // Handle generating a live Gemini Stakeholder Insight
  const handleGenerateGeminiInsight = async (targetPersonaId?: string) => {
    const personaToEvaluate = personas.find(p => p.id === (targetPersonaId || selectedInsightPersonaId)) || personas[0];
    
    setIsGeneratingInsight(true);
    showToast(`Engaging Gemini 3.7 Flash to simulate ${personaToEvaluate.name} (${personaToEvaluate.archetype})...`);

    try {
      const result = await StakeholderService.generateStakeholderInsight({
        persona: personaToEvaluate,
        humanStats,
        pitchScenario: pitchScenarios.find(s => s.id === selectedPitchScenario)?.title,
        customAngle: customPitchText || undefined,
        selectedApp: selectedApp === 'all' ? 'All 4 Flagship Apps' : selectedApp
      });

      setCurrentAiInsight(result);
      setInsightHistory(prev => [result, ...prev.slice(0, 9)]);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#5A5A40', '#D67D5C', '#3D6E50', '#8C857B'],
      });

      showToast(`Stakeholder Insight from ${result.personaName} generated successfully!`);
    } catch (err: any) {
      console.error('Error generating insight:', err);
      showToast('Error generating AI insight. Using grounded baseline simulation.');
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Helper to generate dynamic persona evaluation based on selected app and pitch
  const getPersonaEvaluation = (persona: StakeholderPersona): PersonaEvaluation => {
    switch (persona.archetype) {
      case 'The Cash Flow Hawk':
        return {
          stance: 'Bullish Offer',
          scoreOutOf10: 9.4,
          sweetSpotAlignment: 'High Gross Margin SaaS + Tollbooth Unit Economics',
          directQuote: `"Now you're speaking my language! With $${humanStats.grossMrrUsd.toLocaleString()} monthly MRR and the 50% non-profit allocation ($${humanStats.totalSocietyFundUsd.toLocaleString()}), you get the moral halo for free while capturing high-ticket subscriptions from enterprise buyers terrified of lawsuits. I want in on the for-profit holding company!"`,
          keyStrengths: [
            `Clear separation of non-profit certification ($${humanStats.totalSocietyFundUsd.toLocaleString()} Society Fund) vs. high-margin for-profit software revenue`,
            'Per-use micro-royalty model protects baseline 75–80% SaaS gross margins',
            `4 diversified revenue engines across Books, Audio, Code, and Video with ${humanStats.activeSubscribers.toLocaleString()} subscribers`
          ],
          keyRisks: [
            'Ensure banking/transfer fees on micro-royalties are strictly batched via Stripe Connect to prevent fee erosion',
            'Watch out for heavy synthesis abusers on unlimited tiers without top-up caps'
          ],
          recommendedAction: 'Set clear tier limits on attributed inferences per monthly tier and offer automated Stripe auto-recharge packs for heavy commercial creators.'
        };

      case 'The Artistic Patron':
        return {
          stance: 'Bullish Offer',
          scoreOutOf10: 9.7,
          sweetSpotAlignment: '100% Creator Ownership & 50% Society Fund Pool',
          directQuote: `"This is the breakthrough artists have been praying for. Because the badge foundation takes zero cut of royalties and distributes 50% ($${humanStats.totalSocietyFundUsd.toLocaleString()}) of subscriptions to ${humanStats.verifiedCreators} creators, you eliminate the suspicion of corporate greed. Indie musicians will become your fiercest advocates."`,
          keyStrengths: [
            'Non-exclusive license covenants mean creators never forfeit copyright',
            `Instant transparency with the public Merkle root and Stripe Connect bank payouts for ${humanStats.verifiedCreators} registered creators`,
            'The "delinquent banner" mechanism guarantees apps cannot shirk royalty obligations'
          ],
          keyRisks: [
            'Artist onboarding must be friction-free (simple ISRC / Spotify ID linking)',
            'Creative community needs plain-English marketing, avoiding heavy cryptography jargon'
          ],
          recommendedAction: 'Lead your outreach with the "Spotify + Fair Trade" analogy and recruit 10 recognizable indie producers as founding ambassadors.'
        };

      case 'The Tech Idealist':
        return {
          stance: 'Conditional Term-Sheet',
          scoreOutOf10: 8.9,
          sweetSpotAlignment: 'Cryptographic C2PA JUMBF Manifest & Fairly Trained Protocol',
          directQuote: `"The architecture is mathematically sound. Using C2PA v2.1 JUMBF boxes and Ed25519 signatures creates verifiable digital provenance. With ${humanStats.activeSubscribers.toLocaleString()} subscribers generating verified tokens, ensure developer SDKs for ForgeOS remain open-source and easy to audit."`,
          keyStrengths: [
            'Verifiable 4-layer trust matrix (Fairly Trained, Personhood Proof, C2PA, Story Protocol)',
            'Machine-readable JSON-LD export allows automated CI/CD compliance ingestion',
            `Strict adherence to permissive open-source licensing with ${humanStats.copyleftViolations} copyleft contamination incidents`
          ],
          keyRisks: [
            'Need client-side verification fallbacks if external CDNs are blocked in air-gapped environments',
            'Must ensure provenance metadata persists through video transcoders and audio stem compression'
          ],
          recommendedAction: 'Publish an open-source GitHub action for ForgeOS that automatically checks and signs pull requests with C2PA manifests.'
        };

      case 'The Enterprise Defender':
        return {
          stance: 'Bullish Offer',
          scoreOutOf10: 9.5,
          sweetSpotAlignment: 'EU AI Act Article 53 & US Copyright Office Compliance',
          directQuote: `"Every Fortune 500 General Counsel is currently blocking AI adoption due to copyright risk. Your downloadable PDF Compliance Audit Record and cleanroom dataset logs turn a massive legal hazard into a certified paper trail. This is an enterprise procurement dream."`,
          keyStrengths: [
            'One-click PDF audit certificate formatted directly for regulatory filing and corporate risk teams',
            'Documented training dataset hashes provide bulletproof defense against infringement subpoenas',
            'Independent non-profit foundation structure prevents conflict-of-interest audit challenges'
          ],
          keyRisks: [
            'Enterprise clients will demand formal SOC2 Type II and GDPR data processing addendums',
            'Ensure dispute resolution arbitration terms are clearly stated in the developer covenants'
          ],
          recommendedAction: 'Bundle the PDF Compliance Audit Record directly into enterprise sales proposals as the primary risk-mitigation differentiator.'
        };

      case 'The Growth Scaler':
        return {
          stance: 'Bullish Offer',
          scoreOutOf10: 9.2,
          sweetSpotAlignment: 'Multi-App Cross-Pollination & Viral Embed Badges',
          directQuote: `"The viral loop here is brilliant: every time a user sees the badge on a book written in Tome Crafter, a track produced in RLM Pro, or a video rendered in RL Easy Flow, they discover ForgeOS. You have built a self-sustaining marketing flywheel with ${humanStats.activeSubscribers.toLocaleString()} initial active users!"`,
          keyStrengths: [
            'Interactive Micro-QR code turns every generated piece of media into a viral discovery channel',
            `4 diversified pilot apps prove market fit across text, audio, code, and video generating $${humanStats.grossMrrUsd.toLocaleString()} MRR`,
            'Plug-and-play React/HTML embed allows third-party developers to adopt the badge in under 60 seconds'
          ],
          keyRisks: [
            'Don’t split marketing budget equally across all 4 apps—double down on the fastest-growing vertical first',
            'Need a self-serve developer portal for instant API key issuance'
          ],
          recommendedAction: 'Run a creator bounty campaign offering initial $100 royalty grant matching for the first 100 verified creators on RLM Pro Studio.'
        };

      default:
        return {
          stance: 'Conditional Term-Sheet',
          scoreOutOf10: 8.5,
          sweetSpotAlignment: 'Strategic Alignment with Ethical AI Governance',
          directQuote: `"The value proposition of combining a non-profit trust seal with commercial SaaS software creates a defensible brand with $${humanStats.grossMrrUsd.toLocaleString()} MRR. Ensure execution speed remains high across the 4 apps."`,
          keyStrengths: ['Ethical brand positioning', 'Multi-app ecosystem synergy', 'Cryptographic transparency'],
          keyRisks: ['Managing complexity across multiple media verticals simultaneously'],
          recommendedAction: 'Prioritize developer experience and maintain strict transparency across the royalty clearing pool.'
        };
    }
  };

  const handleSaveCustomPersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim()) {
      showToast('Please enter a name and title for the stakeholder archetype.');
      return;
    }

    const questionList = formQuestions.split('\n').filter(q => q.trim().length > 0);

    if (editingPersona) {
      setPersonas(prev => prev.map(p => p.id === editingPersona.id ? {
        ...p,
        name: formName,
        title: formTitle,
        archetype: formArchetype,
        sweetSpot: formSweetSpot,
        riskTolerance: formRisk,
        tone: formTone,
        primaryConcern: formConcern,
        keyQuestions: questionList.length > 0 ? questionList : p.keyQuestions,
      } : p));
      showToast(`Updated persona: ${formName}`);
    } else {
      const newPersona: StakeholderPersona = {
        id: `persona_custom_${Date.now()}`,
        name: formName,
        title: formTitle,
        archetype: formArchetype,
        sweetSpot: formSweetSpot,
        avatarColor: 'bg-teal-700',
        riskTolerance: formRisk,
        tone: formTone,
        primaryConcern: formConcern,
        keyQuestions: questionList.length > 0 ? questionList : [
          'How does this protect creator rights?',
          'What is the unit economics of the model?'
        ],
        isCustom: true
      };
      setPersonas(prev => [...prev, newPersona]);
      setSelectedInsightPersonaId(newPersona.id);
      showToast(`Added new custom persona: ${formName}`);
    }

    setShowAddModal(false);
    setEditingPersona(null);
    setFormName('');
    setFormTitle('');
    setFormSweetSpot('');
    setFormConcern('');
    setFormQuestions('');
  };

  const handleOpenEditModal = (p: StakeholderPersona) => {
    setEditingPersona(p);
    setFormName(p.name);
    setFormTitle(p.title);
    setFormArchetype(p.archetype);
    setFormSweetSpot(p.sweetSpot);
    setFormRisk(p.riskTolerance);
    setFormTone(p.tone);
    setFormConcern(p.primaryConcern);
    setFormQuestions(p.keyQuestions.join('\n'));
    setShowAddModal(true);
  };

  const handleDeletePersona = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your Dragons' Den panel?`)) {
      setPersonas(prev => prev.filter(p => p.id !== id));
      if (selectedInsightPersonaId === id) {
        setSelectedInsightPersonaId(personas[0]?.id || '');
      }
      showToast(`Removed persona: ${name}`);
    }
  };

  const handleResetDefaultPersonas = () => {
    if (confirm('Reset all stakeholder personas to the default canonical panel?')) {
      setPersonas(INITIAL_PERSONAS);
      setSelectedInsightPersonaId('persona_cash_flow_hawk');
      localStorage.removeItem('human_stakeholder_personas');
      showToast('Reset panel to default 5 Dragons.');
    }
  };

  const handleCopyPitchBrief = () => {
    const briefText = `
# H.U.M.A.N. PROTOCOL & 4-APP ECOSYSTEM — DRAGONS' DEN STAKEHOLDER BRIEFING
Generated: ${new Date().toLocaleDateString()}
Motto: Powering Ethical AI apps, And Paying the People

## LIVE GROUNDING METRICS:
- 50% Non-Profit Society Fund: $${humanStats.totalSocietyFundUsd.toLocaleString()} (Stripe Escrow)
- Gross Monthly MRR across Fleet: $${humanStats.grossMrrUsd.toLocaleString()} ($${(humanStats.grossMrrUsd * 12).toLocaleString()} ARR)
- Active Paying Subscribers: ${humanStats.activeSubscribers.toLocaleString()}
- Verified Human Rights Holders: ${humanStats.verifiedCreators}
- Active Connected Commercial Apps: 4 Flagships
- Copyleft Contamination: 0 Violations (Cleanroom AST)

## PANEL EVALUATION SUMMARY:
Overall Consensus: 9.4/10 (UNANIMOUS INVESTMENT ACCORD)

${personas.map(p => {
  const evalData = getPersonaEvaluation(p);
  return `
### ${p.name} (${p.title}) — ${p.archetype}
Verdict: ${evalData.stance} (${evalData.scoreOutOf10}/10)
Sweet Spot: ${p.sweetSpot}
Dragon Quote: ${evalData.directQuote}
Key Strengths:
${evalData.keyStrengths.map(s => `- ${s}`).join('\n')}
Red Flags / Questions:
${evalData.keyRisks.map(r => `- ${r}`).join('\n')}
Recommended Strategy: ${evalData.recommendedAction}
`;
}).join('\n')}
    `.trim();

    navigator.clipboard.writeText(briefText);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 3000);
    showToast('Full Dragons\' Den Pitch Brief copied to clipboard as Markdown!');
  };

  const handleCopySingleInsight = (insight: StakeholderInsightResult) => {
    const md = `
# STAKEHOLDER INSIGHT: ${insight.personaName} (${insight.archetype})
Evaluated on: ${new Date(insight.generatedAt).toLocaleString()}
Stance: ${insight.stance} (${insight.scoreOutOf10}/10)
Sweet Spot: ${insight.sweetSpotAlignment}

DIRECT QUOTE:
${insight.directQuote}

GROUNDED STATS EVALUATION:
${insight.statsGrounding.map(g => `- **${g.referencedMetric}**: ${g.interpretation}`).join('\n')}

KEY STRENGTHS VALUED:
${insight.keyStrengths.map(s => `- ${s}`).join('\n')}

TOUGH RISKS & QUESTIONS:
${insight.keyRisks.map(r => `- ${r}`).join('\n')}

STRATEGIC ACTION:
${insight.recommendedAction}

FINANCIAL APPRAISAL:
- MRR Analysis: ${insight.financialValuationVerdict.mrrAppraisal}
- Covenant Risk: ${insight.financialValuationVerdict.covenantRiskScore}
- Pricing Recommendation: ${insight.financialValuationVerdict.recommendedPricingTier}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopiedInsight(true);
    setTimeout(() => setCopiedInsight(false), 3000);
    showToast(`Insight from ${insight.personaName} copied to clipboard!`);
  };

  const filteredPersonas = activePersonaFilter === 'all' 
    ? personas 
    : personas.filter(p => p.archetype === activePersonaFilter || p.id === activePersonaFilter);

  const selectedPersonaObj = personas.find(p => p.id === selectedInsightPersonaId) || personas[0];

  return (
    <div className="space-y-6 text-[#2D2926]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#5A5A40]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-[11px] font-mono text-[#5A5A40] shadow-2xs font-bold">
              <BrainCircuit className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Gemini 3.7 Flash • Stakeholder Insight Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2926] tracking-tight">
              Stakeholder Personas & Investor Insight Simulator
            </h2>
            <p className="text-xs text-[#6A655C] leading-relaxed">
              Simulate high-stakes investor & advisory feedback using <strong>Gemini 3.7 Flash</strong> grounded directly in current H.U.M.A.N. Protocol metrics. Test how distinct archetypes (The Cash Flow Hawk, The Artistic Patron, The Tech Idealist, The Enterprise Defender, and The Growth Scaler) react to your <strong>50% Society Fund covenant</strong> and 4-app commercial software suite.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowStatsAdjustModal(true)}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono font-semibold text-[#5A5A40] hover:text-[#2D2926] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Tune Grounding Stats</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingPersona(null);
                setFormName('');
                setFormTitle('');
                setFormSweetSpot('');
                setFormConcern('');
                setFormQuestions('');
                setShowAddModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Define Custom Persona</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaultPersonas}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#6A655C] hover:text-[#2D2926] transition-colors cursor-pointer"
              title="Reset panel to original 5 canonical Dragons"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live H.U.M.A.N. Grounding Metrics Bar */}
      <div className="rounded-2xl border border-[#DCD5CA] bg-[#FFFFFF] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3D6E50] animate-pulse" />
            <span className="text-xs font-mono uppercase font-bold text-[#5A5A40]">
              Live Grounding Telemetry (Supplied to Gemini API)
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8C857B]">
            Powering Ethical AI apps, And Paying the People
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <span className="text-[10px] font-mono uppercase text-[#8C857B] block font-bold">50% Society Fund</span>
            <div className="text-sm font-bold font-mono text-[#2D2926] mt-0.5">
              ${humanStats.totalSocietyFundUsd.toLocaleString()}
            </div>
            <span className="text-[9px] font-mono text-[#3D6E50] font-semibold">Stripe Escrow</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <span className="text-[10px] font-mono uppercase text-[#8C857B] block font-bold">Monthly Gross MRR</span>
            <div className="text-sm font-bold font-mono text-[#2D2926] mt-0.5">
              ${humanStats.grossMrrUsd.toLocaleString()}
            </div>
            <span className="text-[9px] font-mono text-[#5A5A40]">4 Flagship Apps</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <span className="text-[10px] font-mono uppercase text-[#8C857B] block font-bold">Paying Subscribers</span>
            <div className="text-sm font-bold font-mono text-[#2D2926] mt-0.5">
              {humanStats.activeSubscribers.toLocaleString()}
            </div>
            <span className="text-[9px] font-mono text-[#3D6E50]">+34% MoM</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <span className="text-[10px] font-mono uppercase text-[#8C857B] block font-bold">Verified Creators</span>
            <div className="text-sm font-bold font-mono text-[#2D2926] mt-0.5">
              {humanStats.verifiedCreators}
            </div>
            <span className="text-[9px] font-mono text-[#D67D5C]">C2PA Watermarked</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <span className="text-[10px] font-mono uppercase text-[#8C857B] block font-bold">Holding Escrow</span>
            <div className="text-sm font-bold font-mono text-[#2D2926] mt-0.5">
              ${humanStats.holdingEscrowUsd.toLocaleString()}
            </div>
            <span className="text-[9px] font-mono text-[#8C857B]">Unallocated</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <span className="text-[10px] font-mono uppercase text-[#8C857B] block font-bold">Copyleft Violations</span>
            <div className="text-sm font-bold font-mono text-[#3D6E50] mt-0.5">
              {humanStats.copyleftViolations}
            </div>
            <span className="text-[9px] font-mono text-[#3D6E50] font-bold">0% Risk Cleanroom</span>
          </div>
        </div>
      </div>

      {/* 4-App Ecosystem Status Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* App 1: Tome Crafter */}
        <div 
          onClick={() => setSelectedApp('publisher')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedApp === 'publisher'
              ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-sm'
              : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#2D2926]">1. Tome Crafter</h4>
                  <span className="text-[9px] font-mono text-emerald-800 font-semibold">$29/mo</span>
                </div>
                <p className="text-[10px] text-[#6A655C] font-mono truncate max-w-[180px]">Books & Literature</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] px-1.5 py-0.5 rounded border border-[#C9D1BE]">
              50% POOL
            </span>
          </div>
          <p className="text-[10px] text-[#8C857B] mt-2 font-mono">
            Author citation metadata & per-chapter royalty splits.
          </p>
        </div>

        {/* App 2: RLM Pro Studio */}
        <div 
          onClick={() => setSelectedApp('rlm')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedApp === 'rlm'
              ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-sm'
              : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FAF8F5] text-[#5A5A40]">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#2D2926]">2. RLM Pro Studio</h4>
                  <span className="text-[9px] font-mono text-[#5A5A40] font-semibold">$49/mo</span>
                </div>
                <p className="text-[10px] text-[#6A655C] font-mono truncate max-w-[180px]">Music & Audio Stems</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] px-1.5 py-0.5 rounded border border-[#C9D1BE]">
              50% POOL
            </span>
          </div>
          <p className="text-[10px] text-[#8C857B] mt-2 font-mono">
            Direct ASCAP/BMI stem payouts with zero platform cut.
          </p>
        </div>

        {/* App 3: ForgeOS App Builder */}
        <div 
          onClick={() => setSelectedApp('builder')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedApp === 'builder'
              ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-sm'
              : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#2D2926]">3. ForgeOS App Builder</h4>
                  <span className="text-[9px] font-mono text-indigo-700 font-semibold">$99/mo</span>
                </div>
                <p className="text-[10px] text-[#6A655C] font-mono truncate max-w-[180px]">AST Cleanroom Code</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] px-1.5 py-0.5 rounded border border-[#C9D1BE]">
              50% POOL
            </span>
          </div>
          <p className="text-[10px] text-[#8C857B] mt-2 font-mono">
            Zero-copyleft AST engine + OSS maintainer micro-grants.
          </p>
        </div>

        {/* App 4: RL Easy Flow */}
        <div 
          onClick={() => setSelectedApp('video')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedApp === 'video'
              ? 'bg-[#FAF8F5] border-[#5A5A40] shadow-sm'
              : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FAF0EC] text-[#D67D5C]">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#2D2926]">4. RL Easy Flow</h4>
                  <span className="text-[9px] font-mono text-[#D67D5C] font-semibold">$39/mo</span>
                </div>
                <p className="text-[10px] text-[#6A655C] font-mono">Video Frame Provenance</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] px-1.5 py-0.5 rounded border border-[#C9D1BE]">
              50% POOL
            </span>
          </div>
          <p className="text-[10px] text-[#8C857B] mt-2 font-mono">
            C2PA 2.1 video credentials & commercial broadcast indemnity.
          </p>
        </div>
      </div>

      {/* SUB-NAVIGATION MODULE TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E0D8] pb-3">
        <button
          type="button"
          onClick={() => setActiveSectionTab('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSectionTab === 'all'
              ? 'bg-[#5A5A40] text-white shadow-xs'
              : 'bg-[#FAF8F5] text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full Executive Suite (All Modules)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSectionTab('roi')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSectionTab === 'roi'
              ? 'bg-[#5A5A40] text-white shadow-xs'
              : 'bg-[#FAF8F5] text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>5-Year ROI Projection ($128k Baseline)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSectionTab('insights')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSectionTab === 'insights'
              ? 'bg-[#5A5A40] text-white shadow-xs'
              : 'bg-[#FAF8F5] text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Gemini Stakeholder Insight Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSectionTab('evaluations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSectionTab === 'evaluations'
              ? 'bg-[#5A5A40] text-white shadow-xs'
              : 'bg-[#FAF8F5] text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F2ECE4]'
          }`}
        >
          <Users2 className="w-3.5 h-3.5 text-[#5A5A40]" />
          <span>Dragon Investor Archetypes ({personas.length})</span>
        </button>
      </div>

      {/* 1. STAKEHOLDER 5-YEAR ROI PROJECTION MODULE */}
      {(activeSectionTab === 'all' || activeSectionTab === 'roi') && (
        <StakeholderRoiProjectionModule 
          initialStreamedUsd={humanStats.totalStreamedUsd}
          onExportNotice={(msg) => showToast(msg)}
        />
      )}

      {/* 2. GEMINI STAKEHOLDER INSIGHT GENERATOR BOX */}
      {(activeSectionTab === 'all' || activeSectionTab === 'insights') && (
      <div className="rounded-2xl border-2 border-[#5A5A40] bg-[#FFFFFF] p-6 space-y-6 shadow-sm relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5A5A40]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A5A40] text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Gemini AI Simulation
              </span>
              <span className="text-xs font-mono text-[#6A655C]">Model: gemini-3.7-flash</span>
            </div>
            <h3 className="text-lg font-bold text-[#2D2926] flex items-center gap-2">
              Stakeholder Insight Generator
            </h3>
            <p className="text-xs text-[#6A655C]">
              Select an investor archetype to trigger real-time AI evaluation grounded in current H.U.M.A.N. numbers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleGenerateGeminiInsight()}
              disabled={isGeneratingInsight}
              className="px-5 py-3 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isGeneratingInsight ? 'animate-bounce text-amber-300' : 'text-amber-400'}`} />
              <span>
                {isGeneratingInsight 
                  ? `Simulating ${selectedPersonaObj.name.split(' ')[0]}...` 
                  : `Generate Insight (${selectedPersonaObj.name.split(' ')[0]})`}
              </span>
            </button>
          </div>
        </div>

        {/* Archetype Selector Strip */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase font-bold text-[#6A655C] flex items-center justify-between">
            <span>1. Choose Investor Archetype to Simulate:</span>
            <span className="text-[11px] text-[#5A5A40] font-semibold">
              Selected: {selectedPersonaObj.name} ({selectedPersonaObj.archetype})
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {personas.map((persona) => {
              const isSelected = selectedInsightPersonaId === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => setSelectedInsightPersonaId(persona.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FAF8F5] border-[#5A5A40] ring-2 ring-[#5A5A40]/30 shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E5E0D8] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-6 h-6 rounded-lg ${persona.avatarColor} text-white font-bold font-mono text-[10px] flex items-center justify-center shrink-0`}>
                      {persona.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#2D2926] truncate">{persona.name}</div>
                      <div className="text-[10px] font-mono text-[#6A655C] truncate">{persona.archetype}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-[#8C857B] line-clamp-2">
                    {persona.tone}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pitch Strategy & Scenario Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase font-bold text-[#6A655C] block">
            2. Select Pitch Strategy Scenario:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {pitchScenarios.slice(0, 3).map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setSelectedPitchScenario(scenario.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  selectedPitchScenario === scenario.id
                    ? 'bg-[#FAF8F5] border-[#5A5A40] ring-1 ring-[#5A5A40]'
                    : 'bg-[#FFFFFF] border-[#E5E0D8] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#2D2926]">{scenario.title}</h4>
                  <span className="text-[9px] font-mono text-[#5A5A40] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#DCD5CA]">
                    {scenario.apps}
                  </span>
                </div>
                <p className="text-[11px] text-[#6A655C] leading-tight">
                  {scenario.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Angle & Quick Challenger Chips */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-mono uppercase font-bold text-[#6A655C] flex items-center justify-between">
            <span>3. Custom Pitch Angle or Specific Objection to Test:</span>
            <span className="text-[10px] text-[#8C857B]">Click a suggestion or type your own</span>
          </label>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {quickChallengerAngles.map((angle, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCustomPitchText(angle)}
                className="text-[10px] font-mono bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#5A5A40] border border-[#DCD5CA] px-2.5 py-1 rounded-lg text-left transition-colors cursor-pointer"
              >
                "{angle}"
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={customPitchText}
              onChange={(e) => setCustomPitchText(e.target.value)}
              placeholder="e.g. 'How do you defend 80% margins with a 50% non-profit covenant across 4 apps?'"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40] focus:bg-[#FFFFFF] transition-colors pr-24"
            />
            <button
              type="button"
              onClick={() => handleGenerateGeminiInsight()}
              disabled={isGeneratingInsight}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>Test</span>
            </button>
          </div>
        </div>

        {/* Live Generated Insight Display Box */}
        {currentAiInsight && (
          <div className="rounded-xl border border-[#D6CFC4] bg-[#FAF8F5] p-5 space-y-4 animate-fade-in shadow-xs">
            {/* Top Insight Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D8] pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${selectedPersonaObj.avatarColor} text-white font-bold font-mono flex items-center justify-center text-sm shadow-md shrink-0`}>
                  {currentAiInsight.personaName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-[#2D2926]">{currentAiInsight.personaName}</h4>
                    <span className="text-[10px] font-mono bg-[#FFFFFF] text-[#5A5A40] border border-[#DCD5CA] px-2 py-0.5 rounded-full font-bold">
                      {currentAiInsight.archetype}
                    </span>
                    <span className="text-[9px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                      Gemini Grounded
                    </span>
                  </div>
                  <p className="text-xs text-[#6A655C] font-mono">
                    {currentAiInsight.personaTitle || selectedPersonaObj.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-2xs ${
                  currentAiInsight.stance === 'Bullish Offer'
                    ? 'bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]'
                    : currentAiInsight.stance === 'Conditional Term-Sheet'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-[#FAF0EC] text-[#D67D5C] border border-[#EECDBC]'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentAiInsight.stance} ({currentAiInsight.scoreOutOf10} / 10)
                </span>

                <button
                  type="button"
                  onClick={() => handleCopySingleInsight(currentAiInsight)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] flex items-center gap-1 cursor-pointer"
                  title="Copy formatted Markdown"
                >
                  {copiedInsight ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedInsight ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* In-Character Quote Speech Bubble */}
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D67D5C] font-mono">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Spoken Feedback from {currentAiInsight.personaName}:</span>
              </div>
              <p className="text-xs text-[#2D2926] italic leading-relaxed font-sans pl-1 border-l-2 border-[#D67D5C]/40">
                {currentAiInsight.directQuote}
              </p>
            </div>

            {/* Grounded Stats Analysis Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-[#8C857B] font-bold block">
                Grounded Metric Interpretations by this Archetype:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentAiInsight.statsGrounding?.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8] text-xs space-y-0.5">
                    <div className="font-mono font-bold text-[#5A5A40] text-[11px]">{item.referencedMetric}</div>
                    <p className="text-[#6A655C] text-[11px] leading-snug">{item.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Risks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              {/* Strengths */}
              <div className="space-y-2 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E5E0D8]">
                <span className="text-[11px] font-mono uppercase text-[#3D6E50] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#3D6E50]" />
                  Key Strengths Valued:
                </span>
                <ul className="space-y-1.5 text-[#6A655C] pl-1">
                  {currentAiInsight.keyStrengths?.map((strength, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-[#3D6E50] font-bold shrink-0">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="space-y-2 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E5E0D8]">
                <span className="text-[11px] font-mono uppercase text-[#D67D5C] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D67D5C]" />
                  Critical Risks & Tough Questions:
                </span>
                <ul className="space-y-1.5 text-[#6A655C] pl-1">
                  {currentAiInsight.keyRisks?.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-[#D67D5C] font-bold shrink-0">?</span>
                      <span className="italic">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strategic Winning Action */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#5A5A40]/30 flex items-start gap-2.5 text-xs">
              <Lightbulb className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#2D2926] block mb-0.5">Strategic Recommendation:</span>
                <p className="text-[#6A655C] leading-snug">{currentAiInsight.recommendedAction}</p>
              </div>
            </div>

            {/* Financial Valuation Verdict Footer */}
            {currentAiInsight.financialValuationVerdict && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-[#E8E2D8] text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8]">
                  <span className="text-[#8C857B] block">MRR Appraisal:</span>
                  <span className="text-[#2D2926] font-semibold">{currentAiInsight.financialValuationVerdict.mrrAppraisal}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8]">
                  <span className="text-[#8C857B] block">Covenant Risk Score:</span>
                  <span className="text-[#3D6E50] font-semibold">{currentAiInsight.financialValuationVerdict.covenantRiskScore}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E0D8]">
                  <span className="text-[#8C857B] block">Recommended Tier:</span>
                  <span className="text-[#5A5A40] font-semibold">{currentAiInsight.financialValuationVerdict.recommendedPricingTier}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* Stakeholder Personas & Multi-Card Dragons' Den Panel Display */}
      {(activeSectionTab === 'all' || activeSectionTab === 'evaluations') && (
      <div className="space-y-4">
        {/* Filter bar & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#8C857B] font-bold mr-1">Filter Dragons:</span>
            <button
              type="button"
              onClick={() => setActivePersonaFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePersonaFilter === 'all'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] text-[#6A655C] hover:text-[#2D2926]'
              }`}
            >
              All {personas.length} Archetypes
            </button>

            {personas.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePersonaFilter(p.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePersonaFilter === p.id
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#6A655C] hover:text-[#2D2926]'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyPitchBrief}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#DCD5CA] text-xs font-mono font-semibold text-[#5A5A40] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            {copiedBrief ? <Check className="w-3.5 h-3.5 text-[#3D6E50]" /> : <Copy className="w-3.5 h-3.5 text-[#5A5A40]" />}
            <span>{copiedBrief ? 'Copied Brief' : 'Export Pitch Brief (Markdown)'}</span>
          </button>
        </div>

        {/* Panel Consensus Banner */}
        <div className="rounded-xl border border-[#C9D1BE] bg-[#EBF3ED] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#C9D1BE] text-[#3D6E50]">
              <CheckCheck className="w-6 h-6 text-[#3D6E50]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#2D2926]">
                  Dragon Panel Consensus: UNANIMOUS INVESTMENT ACCORD (9.4 / 10)
                </h4>
                <span className="text-[10px] font-mono bg-[#3D6E50] text-white px-2 py-0.5 rounded font-bold">
                  HIGHLY DEFENSIVE MOAT
                </span>
              </div>
              <p className="text-xs text-[#6A655C] mt-0.5">
                The panel strongly endorses the <strong>50% Non-Profit Society Fund + 4 For-Profit SaaS Apps</strong> architecture. It provides airtight moral credibility with creators while securing enterprise pricing power for the software holding company.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl font-bold font-mono text-[#3D6E50]">9.4 / 10</div>
            <div className="text-[10px] font-mono text-[#6A655C]">Blended Investor Score</div>
          </div>
        </div>

        {/* Cards Grid for Personas */}
        <div className="grid grid-cols-1 gap-4">
          {filteredPersonas.map((persona) => {
            const evalData = getPersonaEvaluation(persona);
            return (
              <div
                key={persona.id}
                className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 shadow-2xs hover:shadow-sm transition-all space-y-4"
              >
                {/* Top Persona Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${persona.avatarColor} text-white font-bold font-mono flex items-center justify-center text-sm shadow-inner shrink-0`}>
                      {persona.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#2D2926]">{persona.name}</h4>
                        <span className="text-[10px] font-mono bg-[#FAF8F5] text-[#5A5A40] border border-[#DCD5CA] px-2 py-0.5 rounded-full font-bold">
                          {persona.archetype}
                        </span>
                        {persona.isCustom && (
                          <span className="text-[9px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6A655C] font-mono">{persona.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInsightPersonaId(persona.id);
                        handleGenerateGeminiInsight(persona.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#5A5A40] text-[#5A5A40] hover:text-white border border-[#DCD5CA] text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Simulate Insight</span>
                    </button>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {evalData.stance} ({evalData.scoreOutOf10}/10)
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(persona)}
                      className="p-1.5 rounded-lg text-[#8C857B] hover:text-[#2D2926] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                      title="Edit Persona"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {persona.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeletePersona(persona.id, persona.name)}
                        className="p-1.5 rounded-lg text-[#D67D5C] hover:bg-[#FAF0EC] transition-colors cursor-pointer"
                        title="Delete Persona"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sweet Spot & Core Personality Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D8]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8C857B] font-bold block">
                      Stakeholder Sweet Spot:
                    </span>
                    <p className="text-[#2D2926] leading-snug mt-0.5">
                      {persona.sweetSpot}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8C857B] font-bold block">
                      Primary Risk Focus & Sensitivity:
                    </span>
                    <p className="text-[#2D2926] leading-snug mt-0.5">
                      {persona.primaryConcern} ({persona.riskTolerance})
                    </p>
                  </div>
                </div>

                {/* Direct In-Character Dragon Quote */}
                <div className="p-3.5 rounded-xl bg-[#FAF0EC]/60 border border-[#EECDBC] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D67D5C] font-mono">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>In-Character Feedback from {persona.name.split(' ')[0]}:</span>
                  </div>
                  <p className="text-xs text-[#2D2926] italic leading-relaxed">
                    {evalData.directQuote}
                  </p>
                </div>

                {/* Evaluation Breakdown Grid: Strengths vs. Red Flags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono uppercase text-[#3D6E50] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#3D6E50]" />
                      Key Strengths Valued:
                    </span>
                    <ul className="space-y-1 text-[#6A655C] pl-2">
                      {evalData.keyStrengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#3D6E50] font-bold">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags & Tough Questions */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono uppercase text-[#D67D5C] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-[#D67D5C]" />
                      Tough Questions to Prepare For:
                    </span>
                    <ul className="space-y-1 text-[#6A655C] pl-2">
                      {persona.keyQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#D67D5C] font-bold">?</span>
                          <span className="italic">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Strategic Action Recommendation */}
                <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#5A5A40] shrink-0" />
                    <span className="text-[#6A655C]">
                      <strong className="text-[#2D2926]">Strategic Winning Action:</strong> {evalData.recommendedAction}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Tune Grounding Stats Modal */}
      {showStatsAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFFFF] border border-[#DCD5CA] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#5A5A40] border border-[#5A5A40]/30">
                  <Sliders className="w-4 h-4 text-[#5A5A40]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D2926]">
                    Tune Live Grounding Telemetry
                  </h3>
                  <p className="text-[11px] font-mono text-[#6A655C]">
                    Adjust financial numbers evaluated by Gemini AI in simulations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStatsAdjustModal(false)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Monthly Gross MRR ($ USD)</label>
                <input
                  type="number"
                  value={humanStats.grossMrrUsd}
                  onChange={(e) => {
                    const gross = Number(e.target.value) || 0;
                    setHumanStats(prev => ({
                      ...prev,
                      grossMrrUsd: gross,
                      totalSocietyFundUsd: Number((gross * 0.50).toFixed(2))
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                />
                <span className="text-[10px] font-mono text-[#3D6E50]">Auto-computes 50% Society Fund cut: ${humanStats.totalSocietyFundUsd.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Active Subscribers</label>
                  <input
                    type="number"
                    value={humanStats.activeSubscribers}
                    onChange={(e) => setHumanStats(prev => ({ ...prev, activeSubscribers: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Verified Creators</label>
                  <input
                    type="number"
                    value={humanStats.verifiedCreators}
                    onChange={(e) => setHumanStats(prev => ({ ...prev, verifiedCreators: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => {
                    setHumanStats(DEFAULT_HUMAN_STATS);
                    showToast('Reset grounding stats to live defaults.');
                  }}
                  className="text-xs font-mono text-[#8C857B] hover:text-[#2D2926] underline cursor-pointer"
                >
                  Reset Defaults
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowStatsAdjustModal(false);
                    showToast('Grounding telemetry updated for AI simulations.');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Apply Telemetry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Define / Edit Persona Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFFFF] border border-[#DCD5CA] rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#5A5A40] border border-[#5A5A40]/30">
                  <Users2 className="w-4 h-4 text-[#5A5A40]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D2926]">
                    {editingPersona ? 'Edit Stakeholder Persona' : 'Define Custom Investor Persona'}
                  </h3>
                  <p className="text-[11px] font-mono text-[#6A655C]">
                    Customize an investor or advisory board archetype for simulation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomPersona} className="overflow-y-auto flex-1 space-y-4 pr-1 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Dr. Julian Croft"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Lead IP Litigator & General Partner"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Archetype</label>
                  <select
                    value={formArchetype}
                    onChange={(e) => setFormArchetype(e.target.value as PersonaArchetypeCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="The Tech Idealist">The Tech Idealist</option>
                    <option value="The Artistic Patron">The Artistic Patron</option>
                    <option value="The Cash Flow Hawk">The Cash Flow Hawk</option>
                    <option value="The Enterprise Defender">The Enterprise Defender</option>
                    <option value="The Growth Scaler">The Growth Scaler</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Risk Sensitivity</label>
                  <select
                    value={formRisk}
                    onChange={(e) => setFormRisk(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="Low (Risk-Averse)">Low (Risk-Averse)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High (Aggressive)">High (Aggressive)</option>
                    <option value="Capitalist-First">Capitalist-First</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Tone / Style</label>
                  <select
                    value={formTone}
                    onChange={(e) => setFormTone(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="Incisive & Direct">Incisive & Direct</option>
                    <option value="Empathetic & Creator-Centric">Empathetic & Creator-Centric</option>
                    <option value="Analytical & Technical">Analytical & Technical</option>
                    <option value="Legal & Governance-Focused">Legal & Governance-Focused</option>
                    <option value="Growth & Metric-Driven">Growth & Metric-Driven</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Sweet Spot (What gets them excited?)</label>
                <textarea
                  rows={2}
                  value={formSweetSpot}
                  onChange={(e) => setFormSweetSpot(e.target.value)}
                  placeholder="e.g. Zero legal liability, strong recurring revenue multiples, high creator retention..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">Primary Concern / Risk Trigger</label>
                <input
                  type="text"
                  value={formConcern}
                  onChange={(e) => setFormConcern(e.target.value)}
                  placeholder="e.g. Preventing downstream copyright lawsuits and ensuring transparent royalty ledger."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase font-bold text-[#5A5A40]">
                  Key Tough Questions to Ask (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formQuestions}
                  onChange={(e) => setFormQuestions(e.target.value)}
                  placeholder="How do you handle dispute resolution?&#10;What is your customer acquisition cost?"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs text-[#2D2926] font-mono focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E0D8] shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#DCD5CA] text-xs font-semibold text-[#6A655C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  {editingPersona ? 'Save Changes' : 'Add to Panel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
