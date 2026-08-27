/**
 * THE H.U.M.A.N. INITIATIVE — PROOF-OF-HUMANITY & REGIONAL TRUST REGISTRY
 * Document: humanity-registry-schema.ts
 * Version: 1.0.0
 * Architect: Cody Germain
 * Compliance: GDPR, CCPA/CPRA (Biometric-Free, Privacy-First Cryptographic Social Graph)
 * 
 * This file defines the Firestore and TypeScript database schemas for the decentralized,
 * biometric-free Proof-of-Humanity (PoH) system. It maps how physical workers, local circles,
 * peer vouchers, and role-based wallets ($FOOD, $MED, $EARTH, $INFR, $CREW) are structured
 * to resist Sybil attacks and automate the Labor Difficulty Multiplier.
 */

// ============================================================================
// 1. GLOBAL ENUMS & TYPES
// ============================================================================

export type WalletRole = 'FOOD' | 'MED' | 'EARTH' | 'INFR' | 'CREW';

export type CircleRole = 'LEAD' | 'VERIFIER' | 'STEWARD' | 'MEMBER';

export type ActivitySector = 
  | 'REGENERATIVE_AGRICULTURE' // High multiplier (Earth)
  | 'INFRASTRUCTURE_BUILDING'  // High multiplier (Infr)
  | 'COMMUNITY_HEALTHCARE'    // High multiplier (Med)
  | 'LOGISTICS_DISTRIBUTION'   // Standard multiplier (Crew)
  | 'CREATIVE_CRAFTSMANSHIP'   // Tome Crafter / RLM Pro Studio integration (Creative)
  | 'CIVIC_STEWARDSHIP';       // General coordination

export type VerificationStatus = 
  | 'PENDING_VOUCHERS'  // Awaiting peer vouchers
  | 'PROVISIONALLY_ACTIVE' // Active with limited transaction capacity
  | 'FULLY_VERIFIED'   // Passed full web-of-trust validation
  | 'REVOKED'          // Flagged for Sybil/botnet activity
  | 'QUARANTINED';     // Flagged for dynamic auditing

// ============================================================================
// 2. FIRESTORE COLLECTION SCHEMAS
// ============================================================================

/**
 * COLLECTION: `local_circles`
 * Represents a localized, physical geographic community hub (e.g., a community farm, local clinic).
 * Stored in Firestore as: `/local_circles/{circleId}`
 */
export interface LocalCircle {
  id: string;
  name: string;
  description: string;
  
  // Privacy-preserving geo-fencing (rough region, no exact home coordinates)
  region: {
    country: string;
    stateOrProvince: string;
    cityOrDistrict: string;
    approximateCenterGeoHash: string; // Truncated to 5 characters (~2.5km accuracy) to protect privacy
  };
  
  metrics: {
    totalActiveMembers: number;
    totalVerifiedHumans: number;
    totalVouchChainDepth: number; // Measures the strength of the local trust graph
    lastAuditTimestamp: string;
  };
  
  governance: {
    minimumVouchersRequired: number; // Standard: 3 verified humans to onboard a new member
    gracePeriodDays: number;         // Days allowed to gather vouchers while in PROVISIONALLY_ACTIVE state
  };
  
  createdAt: string;
  updatedAt: string;
}

/**
 * COLLECTION: `human_participants`
 * Represents an individual human. No facial scans, fingerprints, or iris data are stored.
 * Instead, human uniqueness is verified via physical localized vouchers and social trust loops.
 * Stored in Firestore as: `/human_participants/{participantId}`
 */
export interface HumanParticipant {
  id: string; // Cryptographic public key (ED25519) serving as the unique user identifier
  circleId: string; // The primary local circle they belong to (physical proximity check)
  status: VerificationStatus;
  
  profile: {
    displayName: string;
    email: string; // Zero-ingestion encrypted email reference
    avatarSymbol: string; // Biometric-free, generated programmatic icon
    languages: string[];
  };
  
  cryptographicCredentials: {
    pohPublicKey: string; // Public verification key for signing local ledger vouchers
    c2paIdentityRoot: string; // SHA-256 seed for stamping C2PA metadata in Tome Crafter/RLM
    lastSignatureSequence: number;
  };

  verificationState: {
    vouchersReceivedCount: number;
    voucherList: string[]; // Array of participantIds of the verified humans who vouched for this human
    vouchingPower: number; // Dynamic score (0-1.0) indicating how much weight this human's voucher carries
    trustedBackupKeys: string[]; // Recovery keys (Social Recovery Engine)
    lastPhysicalPresenceCheck: string; // ISO string of last verification circle check-in
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * COLLECTION: `peer_vouchers`
 * Documents a cryptographic, peer-signed assertion that a specific individual is a unique physical human.
 * Stored in Firestore as: `/peer_vouchers/{voucherId}`
 */
export interface PeerVoucher {
  id: string; // Format: `vouch_from_to_${vouchingParticipantId}_${targetParticipantId}`
  vouchingParticipantId: string; // The verifier (must be FULLY_VERIFIED)
  targetParticipantId: string;   // The prospective participant
  circleId: string;              // The physical circle where the vouch occurred
  
  cryptographicProof: {
    timestamp: string;
    nonce: string;
    signature: string; // Signed hash of [vouchingParticipantId + targetParticipantId + timestamp + nonce]
  };
  
  expirationDate: string; // Vouchers must be periodically refreshed (e.g., every 365 days)
}

/**
 * COLLECTION: `labor_work_logs`
 * Tracks physical contributions in the real world. Automates the Labor Difficulty Multiplier
 * to heavily weight physically demanding and hazardous stewardship roles.
 * Stored in Firestore as: `/labor_work_logs/{logId}`
 */
export interface LaborWorkLog {
  id: string;
  participantId: string;
  circleId: string;
  sector: ActivitySector;
  
  taskDescription: string;
  hoursWorked: number;
  
  multipliers: {
    baseDifficultyWeight: number; // e.g., Regenerative Ag = 2.5x, Creative Craft = 1.0x
    environmentalHazardMultiplier: number; // e.g., Extreme heat or physical hazard = +0.5x
    calculatedMultiplier: number; // baseDifficultyWeight * environmentalHazardMultiplier
  };

  payoutCalculation: {
    baseRatePerHour: number; // e.g., $10.00 equivalent
    allocatedToken: WalletRole; // e.g., Earth labor pays in $EARTH, Farming in $FOOD, Construction in $INFR
    grossPanymentEstimated: number; // (hoursWorked * baseRatePerHour) * calculatedMultiplier
  };

  verification: {
    peerSupervisorId: string; // Fully verified human peer who co-signed the physical work log
    supervisorSignature: string;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISPUTED';
    approvedAt: string | null;
  };

  createdAt: string;
}

/**
 * COLLECTION: `role_based_wallets`
 * Tracks specialized token allocations designed to flow directly into preserving physical civilization.
 * Stored in Firestore as: `/role_based_wallets/{walletId}`
 */
export interface RoleBasedWallet {
  id: string; // Format: `wallet_${participantId}`
  participantId: string;
  
  // Balance splits representing functional capital targeting human flourishing
  balances: {
    FOOD: number;  // Redeemable for local organic agriculture and dining halls ($FOOD)
    MED: number;   // Redeemable for open-source diagnostics, medicine, healing ($MED)
    EARTH: number; // Redeemable for reforestation, compost, biodiversity seed kits ($EARTH)
    INFR: number;  // Redeemable for tools, community solar grid shares, housing ($INFR)
    CREW: number;  // Redeemable for logistics, transport, community circle support ($CREW)
  };
  
  limits: {
    dailySpendingCap: number; // Prevent systemic drain or wallet compromises
    lastSpendTimestamp: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 3. FIRESTORE SECURITY RULES & VALIDATION METADATA
// ============================================================================

export const humanityRegistryValidationRules = {
  /**
   * Enforces that no biometric identifiers exist in the profile schema
   */
  hasNoBiometricData: (participant: HumanParticipant): boolean => {
    const keys = Object.keys(participant.profile);
    const forbiddenKeys = [
      'fingerprint', 'iris', 'face', 'faceScan', 'retina', 
      'biometric', 'dna', 'facialEmbeddings', 'voicePrint'
    ];
    return !keys.some(key => forbiddenKeys.includes(key.toLowerCase()));
  },

  /**
   * Enforces the mathematical logic of the Labor Difficulty Multiplier
   */
  calculateLaborMultiplier: (sector: ActivitySector): { base: number, wallet: WalletRole } => {
    switch (sector) {
      case 'REGENERATIVE_AGRICULTURE':
        return { base: 2.5, wallet: 'FOOD' }; // High multiplier to reward physical soil creation
      case 'INFRASTRUCTURE_BUILDING':
        return { base: 2.5, wallet: 'INFR' }; // High multiplier to reward physical builders
      case 'COMMUNITY_HEALTHCARE':
        return { base: 3.0, wallet: 'MED' };  // Highest base multiplier to reward life-saving labor
      case 'LOGISTICS_DISTRIBUTION':
        return { base: 1.5, wallet: 'CREW' };  // Medium multiplier for resource runners
      case 'CREATIVE_CRAFTSMANSHIP':
        return { base: 1.0, wallet: 'CREW' };  // Standard baseline multiplier (supported by Pool A royalties)
      case 'CIVIC_STEWARDSHIP':
        return { base: 1.2, wallet: 'CREW' };  // Standard base multiplier for coordination
      default:
        return { base: 1.0, wallet: 'CREW' };
    }
  }
};
