export type PlatformRole = 
  | 'App Creator' 
  | 'OSS Maintainer' 
  | 'Artisan Author' 
  | 'Musician' 
  | 'Beta Tester';

export type SubscriptionStatus = 
  | 'Stripe Sandbox' 
  | 'Stripe Connect Active' 
  | 'Trial' 
  | 'Suspended' 
  | 'Active';

export type AppName = 
  | 'Tome Crafter'
  | 'RLM Pro Studio'
  | 'ForgeOS App Builder'
  | 'RL Easy Flow';

export interface CustomBadgeConfig {
  id: string;
  appName: string;
  tagline: string;
  covenantPct: number; // e.g. 40
  verificationUrl: string;
  c2paHash: string;
  logoDataUrl?: string;
  logoVariant: 'custom' | 'tome-crafter' | 'rlm-pro-studio' | 'forgeos' | 'rl-easy-flow' | 'human-master';
  theme: 'emerald-neon' | 'natural-olive' | 'warm-clay' | 'dark-slate';
  badgeShape: 'seal-circle' | 'embedded-pill' | 'card-provenance' | 'hex-token';
  isOfficialVerified: boolean;
  updatedAt: string;
}

export interface FiveYearRoiYearProjection {
  year: number;
  subscribers: number;
  grossMrr: number;
  grossAnnualRevenue: number;
  societyFundAnnualPool: number; // 50%
  cumulativeSocietyFundDistributed: number;
  forProfitSoftwareRevenue: number; // 50%
  activeCreators: number;
  averageCreatorAnnualPayout: number;
  estimatedValuationLow: number; // e.g. 8x ARR
  estimatedValuationHigh: number; // e.g. 12x ARR
}

export interface FiveYearRoiSimulation {
  initialStreamedBase: number;
  initialSubscribers: number;
  blendedArpu: number;
  annualGrowthRatePct: number;
  societyFundSplitPct: number;
  forProfitMarginPct: number;
  valuationMultiple: number;
  projections: FiveYearRoiYearProjection[];
  cumulative5YearFundTotal: number;
  cumulative5YearCreatorPayoutsTotal: number;
  year5Arr: number;
  year5EstimatedValuation: number;
}

export interface Tester {
  id: string;
  name: string;
  email: string;
  github_handle: string;
  role: PlatformRole;
  app_access_list: AppName[];
  current_subscription_status: SubscriptionStatus;
  stripe_account_id: string;
  joined_at: string;
  total_royalties_received: number; // in USD
  last_active: string;
  license_keys?: Record<string, string>;
  notes?: string;
  email_welcomed?: boolean;
}

export type AssetType = 
  | 'Code Library' 
  | 'Book / Literature' 
  | 'Music / Audio' 
  | 'Visual Art' 
  | 'Scientific Algorithm';

export interface CopyrightClaim {
  id: string;
  title: string;
  creator_name: string;
  creator_email: string;
  asset_type: AssetType;
  repository_or_source: string;
  evidence_description: string;
  status: 'Verified' | 'Pending Review' | 'Disputed';
  confidence_score: number;
  attribution_share_bps: number; // e.g. 250 = 2.5%
  micro_rate_usd: string;
  bank_connected: boolean;
  stripe_account_id: string;
  payout_balance_usd: number;
  total_payouts_claimed_usd: number;
  created_at: string;
  analysis_notes?: string;
}

export type FeedbackCategory = 
  | 'Bug' 
  | 'Feature Request' 
  | 'Royalty Dispute' 
  | 'UX & Flow' 
  | 'General';

export type FeedbackSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type FeedbackStatus = 'New' | 'In Review' | 'Resolved';

export interface FeedbackReply {
  sender: string;
  message: string;
  timestamp: string;
}

export interface FeedbackItem {
  id: string;
  tester_id: string;
  tester_name: string;
  tester_email: string;
  app_name: AppName;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  subject: string;
  content: string;
  status: FeedbackStatus;
  created_at: string;
  reply_history?: FeedbackReply[];
}

export interface BroadcastMessage {
  id: string;
  subject: string;
  body_text: string;
  target_app: string; // specific AppName or 'All Apps'
  recipients_count: number;
  sent_at: string;
  status: 'Delivered' | 'Queued';
  key_takeaways?: string[];
  sender_admin: string;
}

export interface RoyaltyStreamEvent {
  id: string;
  timestamp: string;
  trigger_prompt: string;
  app_source: string;
  amount_cents: number;
  recipient_name: string;
  package_or_work: string;
  stripe_transfer_id: string;
  audit_hash: string;
}

export interface SocietyFundMetrics {
  total_subscription_revenue_usd: number;
  society_fund_share_pct: 50; // 50% immutable covenant allocation
  total_society_fund_usd: number;
  unallocated_holding_escrow_usd: number;
  allocated_registered_pool_usd: number;
  total_active_subscribers: number;
  average_monthly_sub_price: number;
  per_subscriber_royalty_yield: number;
  estimated_payout_per_registered_creator: number;
  total_registered_creators: number;
  total_unregistered_claims: number;
  total_badge_integrated_apps: number;
  last_distribution_timestamp: string;
}

export interface AppSubscriptionTally {
  app_id: string;
  app_name: string;
  app_url: string;
  badge_status: 'Active' | 'Unlinked';
  subscribers_count: number;
  plan_price_monthly: number;
  gross_monthly_mrr: number;
  society_fund_40pct_contribution: number;
  c2pa_audit_id: string;
  icon_category: 'book' | 'audio' | 'code' | 'video';
}

export interface UnregisteredEscrowClaim {
  id: string;
  work_title: string;
  detected_author_or_source: string;
  asset_type: AssetType;
  holding_escrow_balance_usd: number;
  subscribers_referencing_count: number;
  first_accrued_at: string;
  c2pa_manifest_hash: string;
  status: 'Awaiting Creator Registration' | 'Claim Initiated' | 'Disbursed';
}

export interface SocietyDistributionRound {
  round_id: string;
  timestamp: string;
  total_distributed_usd: number;
  subscribers_at_execution: number;
  creators_paid_count: number;
  average_payout_per_creator: number;
  status: 'Completed' | 'Processing' | 'Scheduled';
  stripe_batch_id: string;
  c2pa_audit_seal: string;
}

export interface RoyaltyPoolSummary {
  total_streamed_usd: number;
  total_active_creators: number;
  total_synthesis_events: number;
  copyleft_quarantine_violations: number;
  active_badge_apps: number;
  monthly_pool_growth_pct: number;
  society_fund_balance_usd?: number;
  unallocated_holding_escrow_usd?: number;
  total_active_subscribers?: number;
}

export type PersonaArchetypeCategory = 
  | 'The Tech Idealist'
  | 'The Artistic Patron'
  | 'The Cash Flow Hawk'
  | 'The Enterprise Defender'
  | 'The Growth Scaler'
  | 'Custom';

export type StanceSentiment = 'Bullish Offer' | 'Conditional Term-Sheet' | 'Cautious / Grilling' | 'I am Out';

export interface PersonaEvaluation {
  stance: StanceSentiment;
  scoreOutOf10: number;
  sweetSpotAlignment: string;
  directQuote: string;
  keyStrengths: string[];
  keyRisks: string[];
  recommendedAction: string;
}

export interface StakeholderPersona {
  id: string;
  name: string;
  title: string;
  archetype: PersonaArchetypeCategory;
  sweetSpot: string;
  avatarColor: string;
  riskTolerance: 'Low (Risk-Averse)' | 'Moderate' | 'High (Aggressive)' | 'Capitalist-First';
  tone: 'Incisive & Direct' | 'Empathetic & Creator-Centric' | 'Analytical & Technical' | 'Legal & Governance-Focused' | 'Growth & Metric-Driven';
  keyQuestions: string[];
  primaryConcern: string;
  isCustom?: boolean;
}

export interface CreatorAccount {
  id: string;
  name: string;
  email: string;
  category: AssetType;
  stripe_account_id: string;
  stripe_status: 'Connected' | 'Pending Verification';
  registered_works_count: number;
  total_earned_usd: number;
  available_balance_usd: number;
  c2pa_did: string;
  joined_at: string;
  bio?: string;
  is_verified_human: boolean;
}

export interface DirectMessage {
  id: string;
  thread_id: string;
  sender_type: 'creator' | 'admin' | 'steward' | 'system';
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  subject: string;
  message_text: string;
  timestamp: string;
  is_read: boolean;
  work_reference?: string;
  c2pa_attachment_hash?: string;
  category: 'Royalty Payout' | 'C2PA Claim' | 'Activation' | 'General Inquiry' | 'Dispute';
}

export interface MessageThread {
  id: string;
  creator_email: string;
  creator_name: string;
  work_title?: string;
  subject: string;
  status: 'Open' | 'Resolved' | 'Action Needed';
  last_message_at: string;
  last_message_preview: string;
  messages_count: number;
  unread_count: number;
  category: 'Royalty Payout' | 'C2PA Claim' | 'Activation' | 'General Inquiry' | 'Dispute';
}

export type CopyrightPortalSubPage = 
  | 'home'
  | 'path-walkthrough'
  | 'talent-identifier'
  | 'signup'
  | 'signin'
  | 'activation'
  | 'royalties'
  | 'transparency'
  | 'messages';

export type CreatorPathId = 
  | 'prose-worldbuilder'
  | 'sonic-timbre'
  | 'cleanroom-code'
  | 'visual-vector'
  | 'polymath-synthesist';

export interface CreatorPathDefinition {
  id: CreatorPathId;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  primaryApp: AppName;
  secondaryApps: AppName[];
  assetCategory: AssetType;
  earningYieldBps: number; // e.g. 280 = 2.80%
  sampleRoyaltyProjection: string;
  c2paStandard: string;
  coreHumanSuperpowers: string[];
  sampleDeliverables: string[];
  startingMilestones: {
    step: number;
    title: string;
    description: string;
  }[];
}

export interface TalentOption {
  text: string;
  archetypeBias: CreatorPathId;
  talentHint: string;
}

export interface TalentProbeQuestion {
  id: string;
  dimension: string;
  question: string;
  subtext: string;
  categoryIcon?: string;
  options: TalentOption[];
}

export interface DiscoveredTalent {
  talent: string;
  description: string;
  manifestsIn: string;
}

export interface AssignedFlagshipApp {
  appName: string;
  appUrl: string;
  role: string;
  royaltyYieldBps: number;
  projectedMonthlyDividendUsd: number;
}

export interface TalentDiscoveryReport {
  id: string;
  creatorName: string;
  creatorEmail?: string;
  primaryArchetype: string;
  superpowerTitle: string;
  rarityPercentile: string;
  dominantPathId: CreatorPathId;
  dimensionScores: Record<string, number>;
  discoveredHiddenTalents: DiscoveredTalent[];
  assignedFlagshipApps: AssignedFlagshipApp[];
  firstProjectRecommendation: {
    title: string;
    summary: string;
    humanEffortHours: number;
    recommendedStatus: string;
  };
  c2paProofPrompt: string;
  completedAt: string;
}

export type CreatorStudioSubPage = 
  | 'studio'
  | 'onboarding'
  | 'recognition'
  | 'fund-enrollment'
  | 'earnings'
  | 'showcase'
  | 'cleanroom-assistant';

export interface StudioCreationWork {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  title: string;
  category: AssetType;
  summary: string;
  content_payload: string;
  metadata: {
    wordCount?: number;
    audioBpm?: number;
    audioKey?: string;
    melodicPattern?: string[];
    codeLanguage?: string;
    codeAstNodes?: number;
    visualPalette?: string[];
    svgCode?: string;
    genreTags?: string[];
    originalityIndex?: number;
    humanEffortHours?: number;
  };
  human_touch_score: number; // e.g. 97.8%
  cleanroom_zero_copyleft_verified: boolean;
  c2pa_manifest_hash: string;
  c2pa_jumbf_manifest_urn: string;
  c2pa_signature_timestamp: string;
  registration_status: 'Draft' | 'Submitted for Recognition' | 'Active in Society Fund';
  assigned_apps: AppName[];
  royalty_yield_share_bps: number; // e.g. 200 = 2%
  earned_royalties_usd: number;
  synthesis_references_count: number;
  stripe_payout_ready: boolean;
  created_at: string;
  updated_at: string;
}

export interface HumanStatsSnapshot {
  totalStreamedUsd: number;
  totalSocietyFundUsd: number;
  activeSubscribers: number;
  grossMrrUsd: number;
  verifiedCreators: number;
  covenantSplitPct: string;
  activeBadgeApps: number;
  holdingEscrowUsd: number;
  copyleftViolations: number;
}

export interface StakeholderInsightResult {
  id: string;
  personaId: string;
  personaName: string;
  personaTitle?: string;
  archetype: PersonaArchetypeCategory;
  stance: StanceSentiment;
  scoreOutOf10: number;
  sweetSpotAlignment: string;
  directQuote: string;
  statsGrounding: {
    referencedMetric: string;
    interpretation: string;
  }[];
  keyStrengths: string[];
  keyRisks: string[];
  recommendedAction: string;
  financialValuationVerdict: {
    mrrAppraisal: string;
    covenantRiskScore: string;
    recommendedPricingTier: string;
  };
  generatedAt: string;
  isAiGenerated: boolean;
  scenarioContext?: string;
  appContext?: string;
}

// =========================================================================
// THE HUMAN INITIATIVE TYPES
// =========================================================================

export type InitiativeTierKey = 'tier1_survival' | 'tier2_transition' | 'tier3_planetary' | 'tier4_rnd' | 'tier5_social';

export interface InitiativeUrgencyTier {
  key: InitiativeTierKey;
  tierNumber: number;
  title: string;
  subtitle: string;
  allocationPct: number; // percentage of current community pool
  colorCode: string;
  programs: {
    name: string;
    description: string;
    currentFundingUsd: number;
    beneficiariesCount: number;
    metrics: string;
  }[];
}

export type RoleWalletType = '$FOOD' | '$MED' | '$EARTH' | '$INFR' | '$CREW';

export interface RoleWalletAccount {
  id: string;
  holderName: string;
  holderRole: 'Heavy Labor / Trade' | 'Displaced Labor / Transition' | 'Artisan / Creator' | 'Medical / Healthcare Worker' | 'Social Worker / Co-op';
  laborDifficultyMultiplier: number; // 1.0x to 3.5x for heavy/physical labor
  walletAddress: string;
  balances: {
    FOOD: number;
    MED: number;
    EARTH: number;
    INFR: number;
    CREW: number;
  };
  totalUsdEquivalent: number;
  qrPayload: string;
  lastDistributedAt: string;
}

export interface MerchantStoreProfile {
  id: string;
  storeId: string; // e.g. STORE-HUMAN-7491
  businessName: string;
  category: 'Grocery & Food Market' | 'Pharmacy & Health Clinic' | 'Hardware & Agriculture' | 'Social Co-op & Services' | 'Artisan Shop';
  contactEmail: string;
  locationCity: string;
  reportedNetWorthUsd: number;
  pledgeTierPercent: number; // starts at 1% of net worth / annual pledge
  annualPledgeContributionUsd: number;
  qrCodeUrl: string;
  stripeAccountId: string;
  stripeConnected: boolean;
  totalRedemptionsUsd: number;
  acceptedTokens: RoleWalletType[];
  registeredAt: string;
  status: 'Active' | 'Pledged' | 'Pending Verification';
}

export interface MerchantPOSScanEvent {
  id: string;
  storeId: string;
  storeName: string;
  tokenType: RoleWalletType;
  tokenUnits: number;
  usdEquivalent: number;
  customerWalletAddress: string;
  itemDescription: string;
  status: 'Settled via Stripe Connect' | 'Pending Verification' | 'Disbursed';
  receiptHash: string;
  timestamp: string;
}

export interface InitiativeSlidingScaleState {
  activeSubscribers: number;
  grossMonthlyInflowUsd: number;
  founderOperationalFloorUsd: number; // Secured off the top
  netDistributableUsd: number;
  communityAllocationPct: number; // 50% up to 95%
  founderOperationalShareUsd: number;
  totalCommunityPoolUsd: number;
  tierAllocations: {
    tier1_survival_usd: number;
    tier2_transition_usd: number;
    tier3_planetary_usd: number;
    tier4_rnd_usd: number;
    tier5_social_usd: number;
  };
}

export interface AppSignificanceEvaluation {
  appName: string;
  appCategory: string;
  realWorldProblemSolved: string;
  significanceGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  problemSolvingWeight: number; // 1-100
  laborDifficultyBonus: string;
  grantEligibilityBps: number;
}

export type HumanAppCategory = 
  | 'Productivity & Writing'
  | 'Audio & Synthesis'
  | 'Developer Tools & Cleanroom Code'
  | 'CAD, Vector & Creative Flow'
  | 'Healthcare & Diagnostic Care'
  | 'Regenerative Agriculture & Soil'
  | 'Education & Skill Retooling'
  | 'Ethical Commerce & POS';

export interface HumanPoweredApp {
  id: string;
  appClientId: string; // e.g. app_human_9482
  appName: string;
  tagline: string;
  developerName: string;
  developerEmail: string;
  category: HumanAppCategory;
  appUrl: string;
  githubUrl?: string;
  subscriptionPriceMonthly: number;
  subscribersCount: number;
  communitySplitPct: number; // minimum 50% baseline, up to 95%
  monthlyImpactRunRateUsd: number;
  c2paAuditHash: string;
  stripeConnected: boolean;
  stripeAccountId: string;
  badgeTheme: 'natural-olive' | 'warm-clay' | 'minimal-light' | 'charcoal-dark';
  badgePosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'inline' | 'checkout-banner';
  registeredAt: string;
  status: 'Live & Certified' | 'Pending Verification' | 'Sandbox Test';
  verificationSeal: string;
}

export interface DeveloperEmbedConfig {
  appId: string;
  appName: string;
  splitPct: number;
  theme: 'natural-olive' | 'warm-clay' | 'minimal-light' | 'charcoal-dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'inline' | 'checkout-banner';
  showTelemetry: boolean;
  showFounderFloor: boolean;
  customCtaText?: string;
}

export interface UniversalEcosystemBrandingConfig {
  initiativeVersion: string;
  lastUpdated: string;
  globalTheme: {
    mode: 'light' | 'dark' | 'oled';
    accent: 'emerald-cyber' | 'cyan-mint' | 'warm-clay' | 'forest-sage';
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    covenantPct: number; // 50%
    glowIntensity: number;
    fontFamily: string;
    borderRadius: string;
  };
  connectedApps: Array<{
    id: string;
    appName: string;
    customOverrideEnabled: boolean;
    appAccentColor?: string;
    badgeShape: 'seal-circle' | 'embedded-pill' | 'card-provenance' | 'hex-token';
    status: 'Synced' | 'Pending Sync' | 'Custom';
  }>;
}

export interface GlobalMacroFundMetrics {
  totalGlobalWealthUsd: number; // e.g. $450,000,000,000,000 ($450 Trillion USD)
  fundPledgePct: number; // 1.0%
  totalInjectedFundUsd: number; // $4,500,000,000,000 ($4.50 Trillion USD)
  annualPerpetualYieldPct: number; // 5.0%
  annualPerpetualDistributionUsd: number; // $225,000,000,000 ($225 Billion/year)
  allocations: {
    creatorRestitutionAndMicroRoyaltiesUsd: number; // $90 Billion/year (40%)
    globalHumanDividendAndPovertyEliminationUsd: number; // $67.5 Billion/year (30%)
    decentralizedSovereignComputeCommonsUsd: number; // $33.75 Billion/year (15%)
    openSourcePublicGoodsAndEducationUsd: number; // $22.5 Billion/year (10%)
    carbonAndEthicalValidationBufferUsd: number; // $11.25 Billion/year (5%)
  };
  globalComparisons: Array<{
    label: string;
    amountUsd: number;
    description: string;
    ratioVsFund: number;
  }>;
}

export interface BlockchainDocumentSpec {
  id: string;
  category: 'Whitepaper & Technical' | 'Legal & Regulatory' | 'Economic & Tokenomics' | 'Governance & Compliance';
  title: string;
  code: string;
  status: 'Draft Ready' | 'Architecture Finalized' | 'Legal Review Required' | 'Community RFC';
  summary: string;
  keySections: string[];
  jurisdictionOrStandard: string;
  downloadFilename: string;
}

export interface BlockchainNutsAndBoltsSpec {
  layer: 'Consensus & Network' | 'Execution & VM' | 'Zero-Knowledge & Privacy' | 'Oracles & Provenance' | 'Tokenomics & Treasury' | 'Account & Gas Abstraction';
  title: string;
  specification: string;
  technologyStack: string[];
  keyParameters: Record<string, string | number>;
  securityAuditCheckpoints: string[];
}

export interface FounderActionItem {
  id: string;
  phase: 'Phase 1: Legal & Foundation Incorporation' | 'Phase 2: Technical Whitepaper & Spec' | 'Phase 3: Tokenomics & Cryptographic Modeling' | 'Phase 4: Testnet & Validator Genesis' | 'Phase 5: Audits & Security Hardening' | 'Phase 6: TGE & Global 1% Ingestion';
  title: string;
  description: string;
  priority: 'Critical Path' | 'High' | 'Strategic';
  estimatedDuration: string;
  dependencies: string[];
  deliverable: string;
  completed: boolean;
}

export interface UniversalGuaranteedMonthlyLivingMetrics {
  baseMonthlyLivingFloorUsd: number; // e.g. $1,450 / month / citizen
  currentDynamicMonthlyPayoutUsd: number; // e.g. $1,820 / month after productivity sliding scale
  annualPerCapitaEquivalentUsd: number; // e.g. $21,840 / year
  globalEligiblePopulation: number; // e.g. 5.2 Billion adult citizens
  totalMonthlyDisbursementPoolUsd: number; // e.g. $9.46 Trillion annual aggregate
  slidingScaleFactor: number; // e.g. 1.25x (+25% bonus for high collective output)
  purchasingPowerAdjustedRange: {
    minimumBaseFloorUsd: number; // $950 / mo (if severe societal slowdown)
    baselineTargetUsd: number; // $1,450 / mo (baseline standard)
    highProductivitySurgeUsd: number; // $2,400 / mo (hardworking societal peak)
    hyperAbundancePeakUsd: number; // $3,800 / mo (peak technological & human collaboration)
  };
  payoutFrequency: '1st of Every Month (Smart Contract Auto-Settled via Stripe/Bank/USDC)';
}

export interface ProductivityYieldEngine {
  baseYieldRatePct: number;
  globalProductivityScore: number;
  collectiveOutputIndex: number;
  workforceEngagementPct: number;
  verifiedContributionHoursMln: number;
  adjustedDynamicYieldUsd: number;
  perCapitaDistributionUsd: number;
  incentiveMechanism: {
    growthBonusMultiplier: number;
    slackContractionPenalty: number;
    antiFreeriderProofAlgorithm: string;
    meritRestitutionTiering: string;
  };
}

export interface CountryProductivityAccountability {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  populationMln: number;
  perCapitaBaselineAllocationUsd: number; // Baseline monthly share before adjustments
  actualDynamicMonthlyPayoutUsd: number; // Actual monthly citizen payout received
  humanEffortProductivityScore: number; // 0 - 100% human labor / diligence metric
  aiAutomationDisplacementPct: number; // % of job shifts caused by AI (PROTECTED from penalty)
  humanCausedSlackDropPct: number; // % unexcused drop in human output / civic contribution
  status: 'Surge Producer (+Bonus Pool Inflow)' | 'Balanced Target' | 'Slack Penalty (Redistributed Outward)' | 'AI Transition Protected';
  redistributionDeltaPct: number; // e.g. +14.2% bonus or -18.5% penalty
  redistributionAmountMonthlyUsd: number; // Total monthly $ transferred to/from country pool
  mutualAidReliabilityIndex: number; // 0 - 100 (Global score for crisis assistance)
  strengths: string[];
}

export interface CostOfLivingDeflationMetrics {
  sector: string;
  category: 'Energy' | 'Food & Agriculture' | 'Healthcare & Biotech' | 'Housing & Construction' | 'Education & Compute' | 'Logistics & Mobility';
  iconName: string;
  baselineAnnualCostUsd: number;
  postFundAbundanceCostUsd: number;
  deflationPct: number; // e.g. -64%
  primaryDriver: string;
  mechanism: string;
  annualSavingsPerFamilyUsd: number;
}

export interface DeflationaryAbundanceModel {
  totalAverageHouseholdSpendBaselineUsd: number; // e.g. $42,000 / year
  totalAverageHouseholdSpendAbundanceUsd: number; // e.g. $14,800 / year
  netCostOfLivingReductionPct: number; // e.g. -64.7%
  effectivePurchasingPowerMultiplier: number; // e.g. 2.84x real purchasing power
  disposableSurplusAnnualUsd: number;
  macroPillars: {
    energyMarginalCostZero: string;
    autonomousAgricultureAndDistribution: string;
    decentralizedOpenSourceBiotech: string;
    modularAutomatedBuilding: string;
    freeComputeCommonsAndUniversalIntelligence: string;
  };
}

export interface GlobalPeaceDividendMetrics {
  currentGlobalAnnualMilitarySpendUsd: number; // ~$2.44 Trillion USD / year (based on verified public global military expenditure data from SIPRI)
  reallocatedAnnualCapitalUsd: number; // dynamically controlled reallocation
  reallocationPct: number; // 0 - 100%
  perCapitaAnnualPeaceBonusUsd: number;
  perCapitaMonthlyPeaceBonusUsd: number;
  globalMegaProjectsFunded: {
    title: string;
    category: 'Energy & Fusion' | 'Clean Water & Ocean Restoration' | 'Global High-Speed Transit' | 'Space Exploration & Planetary Defense' | 'Disease Eradication' | 'Planetary Reforestation & Biosphere';
    annualCostUsd: number;
    timelineYears: number;
    impactDescription: string;
    unlockedCivilizationMilestone: string;
    iconName: string;
  }[];
  divertedHumanGenius: {
    aerospaceWeaponsToSpaceExploration: string;
    cyberWarfareToUniversalCyberSecurity: string;
    explosivesAndBallisticsToGeothermalAndDeepMining: string;
    surveillanceInfrastructureToGlobalEcosystemMonitoring: string;
  };
}

export interface RoadmapPhase {
  phaseNumber: number;
  timeframe: string;
  title: string;
  codename: string;
  strategicObjective: string;
  civilizationEra: 'Transition' | 'Consolidation' | 'Abundance' | 'Planetary';
  keyMilestones: string[];
  economicImpact: {
    monthlyLivingFloorUsd: number;
    costOfLivingDeflationPct: number;
    globalEndowmentTreasuryUsd: number;
    povertyEradicationPct: number;
    humanParticipationRatePct: number;
  };
  technologicalBreakthroughs: string[];
  governanceAndLegalShift: string;
  iconName: string;
}

export interface IdeologicalTenet {
  id: string;
  title: string;
  axiom: string;
  traditionalParadigmVsHumanInitiative: {
    extractiveLegacy: string;
    humanInitiativeEvolution: string;
  };
  philosophicalRoot: string;
  tangibleOutcome: string;
  iconName: string;
}

export interface MasterPlanReferenceData {
  initiativeVersion: string;
  lastUpdated: string;
  ratificationStatus: string;
  coreManifestoSummary: string;
  phases: RoadmapPhase[];
  ideologicalTenets: IdeologicalTenet[];
  technologicalBillOfRights: {
    articleNumber: string;
    title: string;
    clauses: string[];
    enforcementMechanism: string;
  }[];
}

// =========================================================================
// UNIVERSAL BASIC LIVING FUND (UBLF) & SOVEREIGN STATE DONATION ENGINE TYPES
// =========================================================================

export type GovernmentDonationTier = 'Sovereign Core (3-5% GDP)' | 'Standard Treaty (1-2% GDP)' | 'Emerging Contributor (0.5% GDP)' | 'Observer / Phase-In';

export interface SovereignGovernmentPledge {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  gdpAnnualTrillionUsd: number;
  pledgeRatePct: number; // e.g. 1.5%
  annualContributionUsd: number;
  monthlyDisbursementToUBLFUsd: number;
  populationMillion: number;
  citizenMonthlyFloorUsd: number;
  treatyStatus: 'Ratified Treaty' | 'Parliamentary Review' | 'Bilateral Accord' | 'Simulated Pledge';
  shiftFromGreedMetric: {
    divertedLobbyingAndWasteUsd: number;
    administrativeBureaucracySavedUsd: number;
    directCitizenYieldEfficiencyPct: number; // e.g. 98.4% direct to citizens (vs 30% in legacy bureaucracy)
  };
  civicPillarsGuaranteed: string[];
}

export interface UniversalBasicLivingFundMetrics {
  totalGlobalGdpBaselineUsd: number; // ~$105 Trillion USD
  participatingGovernmentsCount: number;
  aggregateAnnualGovernmentContributionsUsd: number;
  monthlyGlobalDistributableFundUsd: number;
  globalCitizenBeneficiariesCount: number;
  baseMonthlyLivingFloorPerCitizenUsd: number;
  greedShiftRatio: {
    capitalDivertedFromSpeculativeGreedUsd: number;
    bureaucracyOverheadEliminatedUsd: number;
    directCitizenValueRatio: string; // e.g. 98.6% direct liquidity
  };
  governanceProtocols: {
    title: string;
    axiom: string;
    mechanism: string;
    iconName: string;
  }[];
}

// =========================================================================
// 10-YEAR GLOBAL PROSPERITY PROJECTION (50% ROYALTY SPLIT ADOPTION)
// =========================================================================

export interface GlobalProsperityYearData {
  year: number; // 1 to 10
  calendarYear: number; // 2026 to 2035
  globalRoyaltyAdoptionPct: number; // e.g. 15% -> 96%
  extremePovertyRatePct: number; // e.g. 8.5% -> 0.2%
  moderatePovertyRatePct: number; // e.g. 28.4% -> 2.1%
  annualRoyaltiesDistributedTrillionUsd: number; // e.g. $0.48T -> $5.85T
  cumulativeRoyaltiesDistributedTrillionUsd: number; // cumulative sum
  medianCitizenMonthlyLivingFloorUsd: number; // e.g. $1,450 -> $2,420
  globalLivingSecurityIndex: number; // 0-100 score (e.g. 24 -> 94)
  childLaborReductionPct: number; // e.g. 0% -> 98.5% eradicated
}

export interface GlobalProsperityProjectionSummary {
  adoptionScenario: 'Baseline Accord' | 'Accelerated Treaty' | 'Conservative Organic';
  tenYearTotalRoyaltyDistributedTrillionUsd: number;
  extremePovertyEliminatedPct: number;
  moderatePovertyReductionPct: number;
  livesLiftedAboveLivingFloorMillion: number;
  royaltySplitRatioDescription: string; // e.g. "50% Creator & Citizen Revenue Covenant"
}






