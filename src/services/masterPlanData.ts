import { MasterPlanReferenceData, RoadmapPhase, IdeologicalTenet } from '../types';

export const MASTER_PLAN_PHASES: RoadmapPhase[] = [
  {
    phaseNumber: 1,
    timeframe: '2026 – 2027',
    title: 'Ethical Covenant & Automated Micro-Royalties',
    codename: 'Genesis Initiative',
    strategicObjective: 'Establish the programmatic foundation for 50/50 revenue splits, copyright quarantine against uncompensated AI training, and decentralized developer SDK integration across commercial apps.',
    civilizationEra: 'Transition',
    keyMilestones: [
      'Universal 50% split SDK deployed across creator tools (ShareShop Pro, Lyria Studio, ForgeOS).',
      'Automated Stripe Connect escrow smart contracts dispersing real-time payouts.',
      'Copyleft Quarantine Engine flagging unauthorized training models.',
      'Beta Tester incentive registry onboarding initial 25,000 verified human creators.'
    ],
    economicImpact: {
      monthlyLivingFloorUsd: 1450,
      costOfLivingDeflationPct: 15,
      globalEndowmentTreasuryUsd: 150_000_000_000,
      povertyEradicationPct: 18.5,
      humanParticipationRatePct: 78
    },
    technologicalBreakthroughs: [
      'Proof-of-Contribution cryptographic hashing of creative artifacts.',
      'Sub-second Layer-1 micro-settlement channels for AI token generation.',
      'Zero-knowledge copyright attestation credentials.'
    ],
    governanceAndLegalShift: 'Voluntary developer covenants backed by digital trust seals and decentralized merchant audits.',
    iconName: 'ShieldCheck'
  },
  {
    phaseNumber: 2,
    timeframe: '2027 – 2029',
    title: 'Sovereign 1% Endowment & Global Layer-1 Consensus',
    codename: 'Sovereign Anchor',
    strategicObjective: 'Ratify the universal 1% Sovereign Wealth Endowment and activate high-throughput, carbon-negative Layer-1 blockchain for transparent planetary ledger reconciliation.',
    civilizationEra: 'Transition',
    keyMilestones: [
      '$4.50 Trillion Global Sovereign Endowment fully capitalized via multilateral pacts.',
      'Enterprise AI Ingestion licensing standard adopted by Fortune 500 tech conglomerates.',
      'Decentralized Identity (DID) biometric zero-knowledge wallets distributed to 100M+ citizens.',
      'First 12 pilot nation-states ratify the H.U.M.A.N. Initiative Macro Accord.'
    ],
    economicImpact: {
      monthlyLivingFloorUsd: 1650,
      costOfLivingDeflationPct: 32,
      globalEndowmentTreasuryUsd: 4_500_000_000_000,
      povertyEradicationPct: 44.0,
      humanParticipationRatePct: 84
    },
    technologicalBreakthroughs: [
      'Zero-gas sovereign settlement engine processing 250,000 TPS.',
      'Algorithmic macro-hedging vaults preventing currency depreciation.',
      'Biometric Proof-of-Humanity without centralized database storage.'
    ],
    governanceAndLegalShift: 'Multilateral treaties recognizing automated algorithmic dividends as non-taxable human sovereign equity.',
    iconName: 'Landmark'
  },
  {
    phaseNumber: 3,
    timeframe: '2029 – 2031',
    title: 'Universal Living Payment & Anti-Parasitic Meritocracy',
    codename: 'Harmonic Baseline',
    strategicObjective: 'Activate the automated 1st-of-the-month guaranteed living payment ($1,450 to $2,400/month) backed by real-time productivity accountability and mutual aid scoring.',
    civilizationEra: 'Consolidation',
    keyMilestones: [
      '1.2 Billion adult citizens receiving programmatic, debt-free monthly living disbursements.',
      'Dynamic productivity sliding scale deployed: diligence bonuses rewarding industrious regions.',
      'Full immunity for AI-displaced workers with zero penalty for automated sector transitions.',
      'Zero-sum redistribution engine routing forfeited slacker penalties into high-performing creator pools.'
    ],
    economicImpact: {
      monthlyLivingFloorUsd: 1950,
      costOfLivingDeflationPct: 48,
      globalEndowmentTreasuryUsd: 7_800_000_000_000,
      povertyEradicationPct: 76.2,
      humanParticipationRatePct: 89
    },
    technologicalBreakthroughs: [
      'Automated global mutual aid routing algorithm for real-time crisis response.',
      'AI labor displacement neural indexing separating machine output from human effort.',
      'Decentralized dispute resolution juries for contribution claims.'
    ],
    governanceAndLegalShift: 'Constitutional codification of the Universal Economic Baseline across 45 participating nations.',
    iconName: 'Coins'
  },
  {
    phaseNumber: 4,
    timeframe: '2031 – 2033',
    title: 'Structural Technological Deflation & Public Commons',
    codename: 'Abundance Surge',
    strategicObjective: 'Deploy 15% Compute, Energy, and Biotech commons endowment to systematically collapse the cost of survival necessities by over 64%.',
    civilizationEra: 'Abundance',
    keyMilestones: [
      'Solar, modular nuclear fission, and sodium-ion microgrids driving electricity to zero marginal cost.',
      'Autonomous precision agriculture and vertical hydroponics reducing family food expenditures by 65%.',
      'Open-source AI drug discovery and generic bedside synthesizers eliminating pharmaceutical monopolies.',
      'Robotic 3D prefabricated modular housing cutting residential build costs by 55%.'
    ],
    economicImpact: {
      monthlyLivingFloorUsd: 2200,
      costOfLivingDeflationPct: 65,
      globalEndowmentTreasuryUsd: 12_400_000_000_000,
      povertyEradicationPct: 94.8,
      humanParticipationRatePct: 92
    },
    technologicalBreakthroughs: [
      'Decentralized molecular synthesis arrays printing generic therapies locally.',
      'Carbon-negative timber-geopolymer automated construction robotics.',
      'Universal open-weights frontier LLM compute clusters accessible to every student.'
    ],
    governanceAndLegalShift: 'Global abolition of patent rent-seeking on life-saving medicines and essential agricultural genomes.',
    iconName: 'TrendingDown'
  },
  {
    phaseNumber: 5,
    timeframe: '2033 – 2036',
    title: 'The Global Peace Dividend & Military Conversion',
    codename: 'Planetary Concord',
    strategicObjective: 'Redirect $2.44 Trillion in annual global military budgets from destruction to planetary construction, funding 6 mega-civilizational initiatives.',
    civilizationEra: 'Abundance',
    keyMilestones: [
      '75% to 100% reallocation of global defense budgets into civilian engineering consortiums.',
      'Conversion of ballistic missile factories into space exploration and deep-geothermal drilling teams.',
      'Deployment of transcontinental 600 km/h maglev rail corridors linking all major continents.',
      'Solar graphene ocean desalination arrays turning arid deserts into lush agricultural belts.'
    ],
    economicImpact: {
      monthlyLivingFloorUsd: 2750,
      costOfLivingDeflationPct: 76,
      globalEndowmentTreasuryUsd: 18_900_000_000_000,
      povertyEradicationPct: 99.4,
      humanParticipationRatePct: 95
    },
    technologicalBreakthroughs: [
      'Direct magnetic fusion reactors generating baseload multi-terawatt clean power.',
      'Autonomous planetary reforestation swarms rewilding 1.2B hectares of degraded land.',
      'Universal cancer antigen vaccines and neuro-regeneration therapies.'
    ],
    governanceAndLegalShift: 'Planetary Non-Aggression and Mutual Construction Treaty ratified by all UN security members.',
    iconName: 'HeartHandshake'
  },
  {
    phaseNumber: 6,
    timeframe: '2036 – 2038',
    title: 'Autonomous Post-Scarcity & Creative Renaissance',
    codename: 'Neo-Enlightenment',
    strategicObjective: 'Complete the emancipation of biological humanity from coercive survival labor, unleashing the greatest scientific, artistic, and philosophical renaissance in history.',
    civilizationEra: 'Abundance',
    keyMilestones: [
      '100% eradication of involuntary poverty, homelessness, and malnutrition worldwide.',
      'Human labor fully shifts to voluntary scientific inquiry, arts, space colonization, and community care.',
      'Universal decentralized compute nodes providing limitless AI cognitive co-pilots.',
      'Universal education attainment with personalized mastery learning for all children.'
    ],
    economicImpact: {
      monthlyLivingFloorUsd: 3200,
      costOfLivingDeflationPct: 82,
      globalEndowmentTreasuryUsd: 26_000_000_000_000,
      povertyEradicationPct: 100.0,
      humanParticipationRatePct: 98
    },
    technologicalBreakthroughs: [
      'Quantum-assisted room-temperature superconductors deployed in global grid infrastructure.',
      'Direct neural-cognitive synthesis tools for creative arts and engineering.',
      'Closed-loop circular molecular recycling with near-zero industrial waste.'
    ],
    governanceAndLegalShift: 'Decentralized liquid democracy councils overseeing planetary resource allocation via algorithmic transparency.',
    iconName: 'Sparkles'
  },
  {
    phaseNumber: 7,
    timeframe: '2038 – 2040+',
    title: 'Type-I Planetary Civilization & Interstellar Horizons',
    codename: 'Cosmic Dawn',
    strategicObjective: 'Attain Kardashev Type-I planetary energetic equilibrium and expand human presence permanently into the lunar, Martian, and asteroid orbits.',
    civilizationEra: 'Planetary',
    keyMilestones: [
      'Planetary energy capture harnessing 100% of solar, geothermal, and fusion throughput in harmony with nature.',
      'Permanent self-sustaining lunar and Martian scientific research habitats established.',
      'Automated asteroid harvesting capturing trillion-dollar platinum-group and rare-earth abundance.',
      'Interstellar propulsion research probes launched toward nearest stellar systems.'
    ],
    economicImpact: {
      monthlyLivingFloorUsd: 4000,
      costOfLivingDeflationPct: 88,
      globalEndowmentTreasuryUsd: 40_000_000_000_000,
      povertyEradicationPct: 100.0,
      humanParticipationRatePct: 99
    },
    technologicalBreakthroughs: [
      'Off-world orbital foundries and solar sail propulsion arrays.',
      'Planetary-scale weather equilibrium and geo-engineered thermal management.',
      'Deep-space quantum communication relays.'
    ],
    governanceAndLegalShift: 'Interplanetary Human Commons Charter governing resource extraction outside Earth orbit.',
    iconName: 'Rocket'
  }
];

export const IDEOLOGICAL_TENETS: IdeologicalTenet[] = [
  {
    id: 'tenet_1',
    title: 'The Primacy of Biological Creation',
    axiom: 'Artificial Intelligence is an amplification of human cultural heritage, not an autonomous replacement for human dignity.',
    traditionalParadigmVsHumanInitiative: {
      extractiveLegacy: 'Tech monopolies harvest human creativity and labor for zero compensation, treating artists and coders as discarded inputs.',
      humanInitiativeEvolution: 'Every algorithmic output is cryptographically tracked back to human progenitors, routing perpetual micro-dividends through automated covenants.'
    },
    philosophicalRoot: 'Kant’s Categorical Imperative: Humanity must always be treated as an end, never merely as a means to corporate capital accumulation.',
    tangibleOutcome: 'Mandatory 50% split SDKs and copyleft quarantine mechanisms that defend creators automatically.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'tenet_2',
    title: 'Abundance Through Technological Deflation',
    axiom: 'True wealth is not measured in paper currency volume, but in the systematic collapse of the cost of staying alive.',
    traditionalParadigmVsHumanInitiative: {
      extractiveLegacy: 'Artificial scarcity, planned obsolescence, and predatory patent rent-seeking inflate the cost of housing, healthcare, and food.',
      humanInitiativeEvolution: 'Funding open-source compute, robotic agriculture, and energy commons drives the marginal cost of living toward zero.'
    },
    philosophicalRoot: 'Physical Economy Axiom: Capital is a derivative of physical energy and human knowledge, not financial debt instruments.',
    tangibleOutcome: '64.7% net reduction in family living expenses, expanding real purchasing power by 2.84x without tax increases.',
    iconName: 'TrendingDown'
  },
  {
    id: 'tenet_3',
    title: 'Mutual Creation Over Mutual Destruction',
    axiom: 'Humanity’s greatest engineering capacity must be directed toward planetary terraforming and discovery, not lethal confrontation.',
    traditionalParadigmVsHumanInitiative: {
      extractiveLegacy: '$2.44 Trillion USD spent annually on weapons of war while billions lack clean water, affordable energy, and medical care.',
      humanInitiativeEvolution: 'Reallocating defense budgets into fusion grids, transcontinental maglevs, and planetary carbon sinks creates permanent universal security.'
    },
    philosophicalRoot: 'Universal Peace Concord: Security achieved through shared mutual abundance is indestructible; security achieved through fear is fragile.',
    tangibleOutcome: '+$363 to +$484 / month added directly to every adult living floor, funding 6 planetary mega-projects.',
    iconName: 'Shield'
  },
  {
    id: 'tenet_4',
    title: 'Anti-Parasitic Meritocracy & Diligence Sliding Scale',
    axiom: 'Unconditional survival security must pair with transparent meritocratic incentives to prevent freeriding and societal stagnation.',
    traditionalParadigmVsHumanInitiative: {
      extractiveLegacy: 'Bureaucratic welfare traps that penalize work, or harsh austerity that punishes displaced workers for machine automation.',
      humanInitiativeEvolution: 'Guaranteed survival floor ($1,450/mo) with dynamic surge bonuses (+15% to +40%) for industrious creators, with slack penalties redistributed outward.'
    },
    philosophicalRoot: 'Reciprocal Justice: Society guarantees life; the individual honors the collective through honest contribution and creativity.',
    tangibleOutcome: 'Mathematical diligence index with 100% protection for AI automation shifts and zero tolerance for unexcused human slack.',
    iconName: 'Scale'
  },
  {
    id: 'tenet_5',
    title: 'Zero Debt, Zero Inflation Sovereign Capital',
    axiom: 'Universal dividends must be settled from real physical productivity and enterprise ingestion fees, never through inflationary money printing.',
    traditionalParadigmVsHumanInitiative: {
      extractiveLegacy: 'Central bank debt expansion devalues the working class’s savings through chronic inflation.',
      humanInitiativeEvolution: 'Sovereign 1% Endowment and enterprise AI ingestion royalties back every payment with tangible computing and industrial output.'
    },
    philosophicalRoot: 'Classical Sound Money & Commodity Staking: Value is rooted in physical compute, productive energy, and verifiable human artifacts.',
    tangibleOutcome: 'Algorithmic L1 treasury with zero national debt issuance and transparent blockchain auditing.',
    iconName: 'Landmark'
  }
];

export const TECHNOLOGICAL_BILL_OF_RIGHTS = [
  {
    articleNumber: 'Article I',
    title: 'Right to the Universal Living Baseline & Automation Dividend',
    clauses: [
      'Every biological human being possesses an inalienable, non-forfeitable birthright to a guaranteed monthly living dividend ($1,450 floor).',
      'Displacement by artificial intelligence, autonomous robotics, or algorithmic optimization shall never result in financial penalty or loss of dividend.',
      'Dividends shall be disbursed directly on the 1st of every calendar month without bureaucratic intermediaries.'
    ],
    enforcementMechanism: 'Smart contract escrow vaults auto-settled on Layer-1 with biometric zero-knowledge DID authentication.'
  },
  {
    articleNumber: 'Article II',
    title: 'Immunity from Uncompensated AI Training Exploitation',
    clauses: [
      'No commercial artificial intelligence model may train upon or synthesize human creative works, code, voice, or likeness without cryptographic attribution and compensation.',
      'The 50/50 automated revenue covenant shall apply to all generative outputs utilizing human training weights.',
      'Any model violating copyleft terms shall face immediate initiative quarantine and forfeiture of ingestion licenses.'
    ],
    enforcementMechanism: 'Decentralized Copyleft Quarantine Engine and automated algorithmic royalty routing oracles.'
  },
  {
    articleNumber: 'Article III',
    title: 'Right to Sovereign Digital Identity & Cognitive Privacy',
    clauses: [
      'Every individual retains exclusive ownership over their biometric identifiers, thoughts, and cognitive data.',
      'Centralized identity harvesting, unauthorized biometric profiling, and behavioral surveillance are strictly outlawed under initiative consensus.',
      'All initiative interactions must support zero-knowledge verification without exposing private personal keys.'
    ],
    enforcementMechanism: 'Zero-knowledge zk-SNARK cryptographic identity proofs verified on-chain.'
  },
  {
    articleNumber: 'Article IV',
    title: 'Right to Open-Source Healthcare & Essential Life Energy',
    clauses: [
      'No corporation or state may hold restrictive intellectual property monopolies over life-saving therapeutic molecules or essential agricultural seeds.',
      'Clean electrical power, potable water, and broadband compute intelligence are classified as universal planetary commons.',
      'Public research funded by the initiative commons must remain permanently open and freely synthesizable worldwide.'
    ],
    enforcementMechanism: 'Open Biotech Patent Commons funded by the 15% compute & energy endowment pool.'
  },
  {
    articleNumber: 'Article V',
    title: 'Prohibition of Autonomous Lethal Warfare & Demilitarization Mandate',
    clauses: [
      'Autonomous lethal weapons systems and weaponized artificial intelligence are prohibited globally.',
      'Participating nations commit to systematic budget reallocations from offensive munitions into planetary engineering, fusion grids, and public transit.',
      'The Global Peace Dividend shall be distributed directly to citizens as demilitarization milestones are verified.'
    ],
    enforcementMechanism: 'Orbital satellite verification arrays and multilateral smart contract disarmament escrows.'
  }
];

export const MASTER_PLAN_REFERENCE_DATA: MasterPlanReferenceData = {
  initiativeVersion: 'v4.8.0-Mainnet-Concord',
  lastUpdated: 'August 2026',
  ratificationStatus: 'International Coalition Draft & Open Developer Consensus',
  coreManifestoSummary: 'The Human Initiative and Economic Evolution Roadmap is humanity’s comprehensive engineering blueprint to transition from an era of extractive scarcity, war, and algorithmic commodification into an era of sustainable post-scarcity abundance, technological deflation, and universal creative freedom.',
  phases: MASTER_PLAN_PHASES,
  ideologicalTenets: IDEOLOGICAL_TENETS,
  technologicalBillOfRights: TECHNOLOGICAL_BILL_OF_RIGHTS
};
