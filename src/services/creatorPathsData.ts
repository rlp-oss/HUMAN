import { CreatorPathDefinition, TalentProbeQuestion } from '../types';

export const CREATOR_PATHS: CreatorPathDefinition[] = [
  {
    id: 'prose-worldbuilder',
    title: 'The Prose & Worldbuilder Architect',
    badge: 'Narrative Sovereignty',
    tagline: 'Craft original literature, deep character psychology, and modular world codices.',
    description: 'Ground AI literature engines with genuine human emotional cadences, rich dialogue trees, speculative lore, and zero-copyleft prose.',
    primaryApp: 'Tome Crafter',
    secondaryApps: ['RL Easy Flow', 'RLM Pro Studio'],
    assetCategory: 'Book / Literature',
    earningYieldBps: 280, // 2.80%
    sampleRoyaltyProjection: '$420 - $1,150 / month in recurring Society Fund yields',
    c2paStandard: 'C2PA Literary Provenance & Zero-Plagiarism Lexical Signatures',
    coreHumanSuperpowers: [
      'Subtext & Emotional Nuance Formulation',
      'Long-arc Causality & World Rule Consistency',
      'Psychological Character Resonance',
      'Metaphoric Symmetry & Pacing'
    ],
    sampleDeliverables: [
      'Multi-chapter speculative fiction codex with worldbuilding constraints',
      'Dynamic branching character dialogue systems for interactive narrative',
      'Original mythological codex for procedural story grounding'
    ],
    startingMilestones: [
      { step: 1, title: 'Define Your World Rules & Codex', description: 'Establish the core thematic constraints, atmosphere, and societal laws of your universe.' },
      { step: 2, title: 'Craft Anchor Chapter & Lexical Palette', description: 'Write a zero-copyleft original manuscript with distinct character cadences.' },
      { step: 3, title: 'Register C2PA Content Credential', description: 'Generate your cryptographic manifest hash and connect to Tome Crafter.' },
      { step: 4, title: 'Activate 50% Society Fund Stream', description: 'Begin streaming monthly subscription royalties from every active Tome Crafter reader.' }
    ]
  },
  {
    id: 'sonic-timbre',
    title: 'The Sonic & Timbre Sculptor',
    badge: 'Acoustic Purity',
    tagline: 'Record pristine analog stems, melodic progressions, and expressive timbral textures.',
    description: 'Provide pure, uncompressed human instrumental recordings, modular synthesizer patches, and polyphonic stems that power ethical music generation in RLM Pro Studio.',
    primaryApp: 'RLM Pro Studio',
    secondaryApps: ['RL Easy Flow'],
    assetCategory: 'Music / Audio',
    earningYieldBps: 350, // 3.50%
    sampleRoyaltyProjection: '$580 - $1,600 / month in recurring Society Fund yields',
    c2paStandard: 'C2PA Audio Fingerprint & Stem-Level Non-Exclusive Master Rights',
    coreHumanSuperpowers: [
      'Micro-timing, Swing & Human Groove Organic Feel',
      'Harmonic Tension & Resolution Intuition',
      'Analog Saturation & Physical Instrument Resonance',
      'Timbral Synesthesia & Atmospheric Soundscapes'
    ],
    sampleDeliverables: [
      '16-stem multi-track analog synthesizer & acoustic instrument pack',
      'Original harmonic progression matrices with MIDI dynamic velocities',
      'Zero-sample Foley & cinematic sound design library'
    ],
    startingMilestones: [
      { step: 1, title: 'Record or Produce Raw Instrument Stems', description: 'Capture clean, isolated audio stems with documented BPM, key, and instrumentation.' },
      { step: 2, title: 'Audit Zero-Sample Cleared Pedigree', description: 'Verify that every recording is 100% human-performed with no third-party uncleared samples.' },
      { step: 3, title: 'Bind Story Initiative IP License', description: 'Lock in your 3.5% per-synthesis micro-patronage rail and C2PA audio manifest.' },
      { step: 4, title: 'Live Ingestion to RLM Pro Studio', description: 'Earn automatic royalties whenever producers generate tracks grounded on your timbre.' }
    ]
  },
  {
    id: 'cleanroom-code',
    title: 'The Cleanroom Code Craftsman',
    badge: 'Algorithmic Purity',
    tagline: 'Develop zero-dependency kernels, topological DAGs, and reactive UI primitives.',
    description: 'Author robust, first-principles algorithms and cleanroom software packages that serve as trusted foundation layers for ForgeOS App Builders.',
    primaryApp: 'ForgeOS App Builder',
    secondaryApps: ['RL Easy Flow', 'RLM Pro Studio'],
    assetCategory: 'Code Library',
    earningYieldBps: 220, // 2.20%
    sampleRoyaltyProjection: '$380 - $950 / month in recurring Society Fund yields',
    c2paStandard: 'C2PA AST Graph Verification & Zero-Copyleft GPL/MIT Isolation',
    coreHumanSuperpowers: [
      'First-Principles Algorithmic Elegance',
      'Topological State Architecture & Memory Efficiency',
      'Edge-Case Anticipation & Deterministic Reliability',
      'Modular Composition & Expressive Type Systems'
    ],
    sampleDeliverables: [
      'Zero-dependency topological dependency graph sorting engine',
      'Reactive canvas layout arithmetic engine with web worker offloading',
      'Cleanroom cryptographic audit trail generator for browser runtimes'
    ],
    startingMilestones: [
      { step: 1, title: 'Architect First-Principles Module', description: 'Write self-contained TypeScript/Rust code without bloated nested dependencies.' },
      { step: 2, title: 'Run Cleanroom Copyleft Quarantine Audit', description: 'Validate zero contaminated GPL/proprietary snippets via automated AST scanner.' },
      { step: 3, title: 'Sign Human Origin Personhood Proof', description: 'Publish cryptographic receipt linked to your developer public key.' },
      { step: 4, title: 'Integrate to ForgeOS Component Matrix', description: 'Disburse per-compilation and monthly seat subscription dividends into your Stripe account.' }
    ]
  },
  {
    id: 'visual-vector',
    title: 'The Visual & Vector Artisan',
    badge: 'Visual Geometry',
    tagline: 'Design harmonious mathematical vector systems, brand iconographies, and visual motifs.',
    description: 'Create mathematically precise SVG motif systems, Cyber-Agrarian palettes, and ethical visual assets that power procedural UI generation.',
    primaryApp: 'RL Easy Flow',
    secondaryApps: ['Tome Crafter', 'ForgeOS App Builder'],
    assetCategory: 'Visual Art',
    earningYieldBps: 190, // 1.90%
    sampleRoyaltyProjection: '$290 - $820 / month in recurring Society Fund yields',
    c2paStandard: 'C2PA Vector Coordinate Watermarking & Fairly Trained Visual Standard',
    coreHumanSuperpowers: [
      'Geometric Balance, Negative Space & Proportional Harmony',
      'Color Theory & Chromatic Emotional Weight',
      'Symbolic Iconography & Cultural Semiotics',
      'Vector Curve Precision & Scalability Math'
    ],
    sampleDeliverables: [
      'Comprehensive Cyber-Agrarian vector glyph and icon system',
      'Harmonic SVG generative grid templates for app interfaces',
      'Hand-illustrated architectural design tokens and visual themes'
    ],
    startingMilestones: [
      { step: 1, title: 'Formulate Visual Cohesion Matrix', description: 'Establish grid rules, line weights, corner radii, and mathematical color ratios.' },
      { step: 2, title: 'Export Clean Vector Curves & SVG Code', description: 'Ensure optimized SVG path strings with zero raster artifacts or AI noise.' },
      { step: 3, title: 'Attach C2PA Visual Manifest', description: 'Embed JUMBF provenance metadata and personhood signature.' },
      { step: 4, title: 'Deploy Across Ethical Fleet Apps', description: 'Collect dividend splits across RL Easy Flow video storyboards and ForgeOS templates.' }
    ]
  },
  {
    id: 'polymath-synthesist',
    title: 'The Cross-Disciplinary Polymath',
    badge: 'Multimodal Synthesis',
    tagline: 'Unify literature, soundscapes, visual aesthetics, and code into unified experiences.',
    description: 'Fuse narrative codices, custom audio stems, vector art, and code into full-stack creations that anchor across all four flagship apps simultaneously.',
    primaryApp: 'Tome Crafter',
    secondaryApps: ['RLM Pro Studio', 'ForgeOS App Builder', 'RL Easy Flow'],
    assetCategory: 'Scientific Algorithm',
    earningYieldBps: 450, // 4.50%
    sampleRoyaltyProjection: '$850 - $2,400 / month across all four fleet applications',
    c2paStandard: 'Full Multimodal C2PA Composite Manifest & Universal Society Fund Share',
    coreHumanSuperpowers: [
      'Systems Thinking & Cross-Domain Synthesis',
      'High-Level Creative Vision Orchestration',
      'Rapid Multi-Disciplinary Translation',
      'Holistic Aesthetic Experience Crafting'
    ],
    sampleDeliverables: [
      'Complete interactive multimedia book with embedded synth stems and code widgets',
      'Full-stack design system with integrated audio feedback and narrative UI copy',
      'Comprehensive multi-app ethical universe framework'
    ],
    startingMilestones: [
      { step: 1, title: 'Structure Multimodal Framework', description: 'Coordinate story lore, sonic textures, visual themes, and code architecture.' },
      { step: 2, title: 'Build Integrated Prototype', description: 'Validate the cross-domain experience across multiple media formats.' },
      { step: 3, title: 'Universal Fleet C2PA Certification', description: 'Sign an umbrella cryptographic covenant spanning all media types.' },
      { step: 4, title: 'Multi-Stream Automated Royalty Yield', description: 'Receive aggregate 50% subscription distributions from all connected fleet apps.' }
    ]
  }
];

export const TALENT_PROBE_QUESTIONS: TalentProbeQuestion[] = [
  {
    id: 'probe_sensory_01',
    dimension: 'Sensory Calibration & Intuition',
    question: 'When you step into an intricate new environment or experience a creative work, what subtle nuance registers in your mind before anything else?',
    subtext: 'Identifies your unconscious sensory anchor and primary quality evaluation framework.',
    categoryIcon: 'Eye',
    options: [
      {
        text: 'The acoustic space, vocal cadences, harmonic resonances, and background timbre',
        archetypeBias: 'sonic-timbre',
        talentHint: 'High-fidelity acoustic perception & timbral synesthesia'
      },
      {
        text: 'The spatial geometry, visual balance, negative space ratios, and palette harmony',
        archetypeBias: 'visual-vector',
        talentHint: 'Spatial mathematical intuition & aesthetic proportion sensitivity'
      },
      {
        text: 'The unspoken history, human motivations, emotional undercurrents, and character lore',
        archetypeBias: 'prose-worldbuilder',
        talentHint: 'Deep psychological subtext recognition & narrative causation'
      },
      {
        text: 'The underlying structural rules, logical dependencies, and invisible system mechanics',
        archetypeBias: 'cleanroom-code',
        talentHint: 'First-principles systems analysis & topological pattern detection'
      }
    ]
  },
  {
    id: 'probe_flow_02',
    dimension: 'Unconscious Flow State',
    question: 'If all responsibilities and digital feeds were paused for 24 hours, what creative pursuit would make you completely lose track of physical time?',
    subtext: 'Measures where your natural neuro-dopaminergic energy effortlessly concentrates without external pressure.',
    categoryIcon: 'Clock',
    options: [
      {
        text: 'Iterating on words, dialoguing, building worlds, or penning compelling prose and conceptual lore',
        archetypeBias: 'prose-worldbuilder',
        talentHint: 'Verbal-conceptual synthesis & mythopoeic architecture'
      },
      {
        text: 'Tweaking synthesizers, playing chords, mixing acoustic frequencies, or curating sonic textures',
        archetypeBias: 'sonic-timbre',
        talentHint: 'Harmonic flow modulation & sonic craftsmanship'
      },
      {
        text: 'Refactoring logic, building a clean tool from scratch, solving algorithmic puzzles, or architecting data flow',
        archetypeBias: 'cleanroom-code',
        talentHint: 'Algorithmic clarity & elegant deterministic construction'
      },
      {
        text: 'Sketching vector curves, coordinating color palettes, designing logos, or refining visual layouts',
        archetypeBias: 'visual-vector',
        talentHint: 'Visual hierarchy mastery & micro-detail craftsmanship'
      }
    ]
  },
  {
    id: 'probe_critical_03',
    dimension: 'Artistic Discerning Radar',
    question: 'When experiencing a piece of modern AI-generated content (writing, audio, art, or code), what immediate flaw or hollowness triggers your instinct that "a human is missing here"?',
    subtext: 'Reveals the exact high-order human craft qualities you possess that AI cannot fake.',
    categoryIcon: 'ShieldAlert',
    options: [
      {
        text: 'The lack of authentic human vulnerability, earned emotional stakes, or genuine narrative surprise',
        archetypeBias: 'prose-worldbuilder',
        talentHint: 'Emotional authenticity detection & nuanced human perspective'
      },
      {
        text: 'The sterile, mathematically uniform quantized timing and lack of organic micro-groove dynamic breath',
        archetypeBias: 'sonic-timbre',
        talentHint: 'Acoustic micro-dynamics & living groove sensitivity'
      },
      {
        text: 'The bloated, hallucinated dependencies, edge-case negligence, and superficial pattern-copying',
        archetypeBias: 'cleanroom-code',
        talentHint: 'Defensive engineering instinct & zero-copyleft rigor'
      },
      {
        text: 'The over-smoothed generic textures, lack of intentional focal tension, and derivative iconography',
        archetypeBias: 'visual-vector',
        talentHint: 'Intentional compositional weight & graphic clarity'
      }
    ]
  },
  {
    id: 'probe_synthesis_04',
    dimension: 'Multi-Modal Synthesis Instinct',
    question: 'When a powerful creative idea strikes you, in what format does your mind first conceptualize the breakthrough?',
    subtext: 'Detects whether you operate with deep domain specialization or broad cross-pollinating synthesis.',
    categoryIcon: 'Sparkles',
    options: [
      {
        text: 'As a holistic multi-sensory universe—where story, mood music, visual styling, and interaction form a cohesive whole',
        archetypeBias: 'polymath-synthesist',
        talentHint: 'Multimodal trans-disciplinary orchestration & systems thinking'
      },
      {
        text: 'As an evocative phrase, dialogue snippet, or philosophical premise seeking structural exploration',
        archetypeBias: 'prose-worldbuilder',
        talentHint: 'Narrative seed crystallization & rhetorical momentum'
      },
      {
        text: 'As a rhythmic hook, chord transition, or distinct acoustic timbre that carries an emotional mood',
        archetypeBias: 'sonic-timbre',
        talentHint: 'Aural motif development & sonic emotional mapping'
      },
      {
        text: 'As an elegant functional machine, state transition diagram, or modular component graph',
        archetypeBias: 'cleanroom-code',
        talentHint: 'Structural abstraction & topological model building'
      }
    ]
  },
  {
    id: 'probe_contribution_05',
    dimension: 'Ecosystem Legacy & Value Creation',
    question: 'How do you wish your human creativity to make an enduring impact within the H.U.M.A.N. Ethical AI ecosystem?',
    subtext: 'Maps your personal mission directly to the 50% Society Fund dividend distribution rails.',
    categoryIcon: 'Landmark',
    options: [
      {
        text: 'By publishing foundational literary lore and character codices that enrich millions of Tome Crafter stories',
        archetypeBias: 'prose-worldbuilder',
        talentHint: 'Literary heritage creator & narrative anchor'
      },
      {
        text: 'By releasing zero-sample analog recordings and stem packs that define the sonic identity of RLM Pro Studio',
        archetypeBias: 'sonic-timbre',
        talentHint: 'Sonic artisan & foundational audio contributor'
      },
      {
        text: 'By engineering cleanroom algorithms and core developer primitives that empower thousands of ForgeOS builders',
        archetypeBias: 'cleanroom-code',
        talentHint: 'Core infrastructure architect & open-source steward'
      },
      {
        text: 'By building an all-encompassing multimedia franchise spanning books, music, code, and visual art with cross-app yields',
        archetypeBias: 'polymath-synthesist',
        talentHint: 'Ecosystem titan & polymath franchise founder'
      }
    ]
  }
];
