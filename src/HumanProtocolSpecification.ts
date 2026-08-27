/**
 * ============================================================================
 *               THE H.U.M.A.N. INITIATIVE: PROTOCOL CONFIGURATION ENGINE
 * ============================================================================
 * Version: 3.1-PROD
 * Description: The canonical, machine-readable specification of the entire
 *              H.U.M.A.N. Protocol Manual. This file is ingested directly by the
 *              H.U.M.A.N. Badge & Onboarding Console to programmatically audit,
 *              verify, and enforce compliance across all registered applications.
 * 
 * "Technology is a symbiotic partner, protecting human rights and mathematically
 *  guaranteeing financial and existential dignity."
 * ============================================================================
 */

export interface ZeroIngestionRule {
  egressBlocking: boolean;
  bannedLibraries: string[];
  cleanroomVerificationHash: string;
  allowedTelemetryDomains: string[];
}

export interface CovenantEconomicSplit {
  platformFloorFixedUSD: number;
  antiBurnoutDeveloperCapUSD: number;
  initialPlatformSplitPct: number; // e.g., 0.50 (50% People's Covenant)
  milestones: {
    userThreshold: number;
    platformCompressionPct: number; // e.g., drops to 0.25, 0.05
  }[];
  societyFundDistribution: {
    poolA_CreatorMicroRoyaltiesPct: number; // 70%
    poolB_UnregisteredEscrowPct: number;    // 15%
    poolC_CommunityLivingFloorPct: number;   // 15%
  };
}

export interface LaborDifficultySpec {
  sector: string;
  multiplier: number;
  associatedWallet: 'FOOD' | 'MED' | 'EARTH' | 'INFR' | 'CREW';
  requiredVouchers: number;
}

export interface C2PASigningSpec {
  jumbfVersion: string;
  assertionSchema: string;
  signingAlgorithm: string;
  tamperEvidenceStrict: boolean;
}

export interface SybilResistanceSpec {
  minVouchScore: number;
  relationalEntropyThreshold: number;
  temporalLatencyMs: number;
  geohashLength: number; // 5-character geohashes (~2.5km precision)
}

export const HUMAN_PROTOCOL_SPECIFICATION = {
  protocolName: "The H.U.M.A.N. Protocol",
  architect: "Cody Germain",
  epochYear: 2026,
  governanceLicense: "FT-2026 (Fairly Trained & Zero-Ingestion)",

  /**
   * ACT I & II: The Cleanroom Standard & Zero-Ingestion Protection
   * Absolute blocking of training-data scraping and unauthorized egress.
   */
  zeroIngestion: {
    egressBlocking: true,
    bannedLibraries: [
      "openai", "anthropic", "cohere", "langchain-core", 
      "google-generativeai", "transformers", "huggingface_hub",
      "scikit-learn-ext-ingestion", "viral-copyleft-scraper"
    ],
    cleanroomVerificationHash: "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    allowedTelemetryDomains: [
      "https://human-ethical-ai.ai.studio",
      "https://reforgeos-live.ai.studio"
    ]
  } as ZeroIngestionRule,

  /**
   * ACT II & III: The 50% People's Covenant & Dynamic Sliding-Scale Economics
   * Protects creator equity and scales down platform overhead programmatically.
   */
  economicCovenant: {
    platformFloorFixedUSD: 50000.00, // Monthly Founder Operational Floor
    antiBurnoutDeveloperCapUSD: 5000.00, // Developer anti-burnout cap to shield from VC buyouts
    initialPlatformSplitPct: 0.50, // 50/50 starting split
    milestones: [
      { userThreshold: 10000, platformCompressionPct: 0.50 }, // 50% retained under 10k
      { userThreshold: 25000, platformCompressionPct: 0.40625 },
      { userThreshold: 50000, platformCompressionPct: 0.25 }, // platform overhead drops to 25%
      { userThreshold: 100000, platformCompressionPct: 0.20 },
      { userThreshold: 250000, platformCompressionPct: 0.05 }  // Compresses to a 5% operational heartbeat
    ],
    societyFundDistribution: {
      poolA_CreatorMicroRoyaltiesPct: 0.70, // 70% direct creator micro-royalties via Stripe Connect
      poolB_UnregisteredEscrowPct: 0.15,    // 15% non-forfeiting legacy escrow
      poolC_CommunityLivingFloorPct: 0.15   // 15% Local Living Floors ($FOOD, $MED, $EARTH)
    }
  } as CovenantEconomicSplit,

  /**
   * ACT II: The Labor Difficulty Multipliers
   * Decentering speculative capital and highly compensating physical caretakers.
   */
  laborMultipliers: [
    { sector: "REGENERATIVE_AGRICULTURE", multiplier: 2.5, associatedWallet: "FOOD", requiredVouchers: 2 },
    { sector: "INFRASTRUCTURE_BUILDING", multiplier: 2.5, associatedWallet: "INFR", requiredVouchers: 2 },
    { sector: "COMMUNITY_HEALTHCARE", multiplier: 3.0, associatedWallet: "MED", requiredVouchers: 3 },
    { sector: "CREATIVE_CRAFTSMANSHIP", multiplier: 1.0, associatedWallet: "CREW", requiredVouchers: 1 }
  ] as LaborDifficultySpec[],

  /**
   * ACT I: C2PA JUMBF Cryptographic Content Credentials
   * Enforces tamper-evident signatures on all exports.
   */
  cryptographicProvenance: {
    jumbfVersion: "v2.1",
    assertionSchema: "https://c2pa.org/specifications/v2.1/json-ld/manifest.json",
    signingAlgorithm: "ECDSA-SHA256",
    tamperEvidenceStrict: true
  } as C2PASigningSpec,

  /**
   * ACT III: Biometric-Free Sybil Resistance & Proof-of-Humanity
   * Protects role-based community wallets using local circles instead of iris scanning.
   */
  sybilResistance: {
    minVouchScore: 0.85,
    relationalEntropyThreshold: 0.65,
    temporalLatencyMs: 1500, // Discards instant mechanical script actions
    geohashLength: 5 // Truncated location bounding to ensure personal data minimization
  } as SybilResistanceSpec,

  /**
   * Platform Verification Marks
   */
  badges: {
    FAIRLY_TRAINED_2026: "FT-2026",
    ZERO_INGESTION: "FT-ZERO-INGESTION",
    ECOSYSTEM_MEMBER: "CERTIFIED_FT-2026"
  }
};
