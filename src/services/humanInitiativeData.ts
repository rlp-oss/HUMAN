import { 
  InitiativeUrgencyTier, 
  RoleWalletAccount, 
  MerchantStoreProfile, 
  MerchantPOSScanEvent, 
  InitiativeSlidingScaleState, 
  AppSignificanceEvaluation,
  HumanPoweredApp,
  DeveloperEmbedConfig 
} from '../types';

export const INITIAL_URGENCY_TIERS: InitiativeUrgencyTier[] = [
  {
    key: 'tier1_survival',
    tierNumber: 1,
    title: 'Tier 1: Survival & Health Foundation',
    subtitle: 'Food Security ($FOOD) & Global Medical Emergency Fund ($MED)',
    allocationPct: 35,
    colorCode: '#D67D5C',
    programs: [
      {
        name: 'World Food Security Network ($FOOD)',
        description: 'Cryptographic food vouchers redeemable at partner grocers and markets for essential nutrition with zero bureaucratic friction.',
        currentFundingUsd: 172900,
        beneficiariesCount: 4850,
        metrics: '210,000 nutritious meals subsidized this quarter'
      },
      {
        name: 'Global Medical & Emergency Health Fund ($MED)',
        description: 'Emergency co-pay coverage, essential medicine subsidies, and preventative care clinic vouchers.',
        currentFundingUsd: 131250,
        beneficiariesCount: 2140,
        metrics: '1,780 emergency prescriptions & urgent care visits cleared'
      }
    ]
  },
  {
    key: 'tier2_transition',
    tierNumber: 2,
    title: 'Tier 2: AI-Displacement Restitution',
    subtitle: 'Direct Transition Dividends & Labor Retooling Registry',
    allocationPct: 25,
    colorCode: '#5A5A40',
    programs: [
      {
        name: 'AI-Displacement Restitution Pool',
        description: 'Direct transition dividends for creative, administrative, and knowledge workers displaced by generative models.',
        currentFundingUsd: 125000,
        beneficiariesCount: 1650,
        metrics: '$750/mo baseline bridge during skills transition'
      },
      {
        name: 'Displaced Labor Upskilling & Retooling Registry',
        description: 'Hands-on trade masterclasses, hardware craftsmanship, and human-in-the-loop validation apprenticeships.',
        currentFundingUsd: 87400,
        beneficiariesCount: 920,
        metrics: '84% transition into high-merit craftsmanship roles'
      }
    ]
  },
  {
    key: 'tier3_planetary',
    tierNumber: 3,
    title: 'Tier 3: Planetary Regeneration & Clean Energy',
    subtitle: 'Soil Health, Permaculture & Green Microgrids ($EARTH, $INFR)',
    allocationPct: 20,
    colorCode: '#3D6E50',
    programs: [
      {
        name: 'Soil & Land Regeneration Initiative ($EARTH)',
        description: 'Grants directly to regenerative farmers, soil microbiome restorers, and urban agriculture co-ops.',
        currentFundingUsd: 98900,
        beneficiariesCount: 420,
        metrics: '2,400 acres transitioned to zero-chemical permaculture'
      },
      {
        name: 'Distributed Green Microgrids ($INFR)',
        description: 'Community solar, geothermal pumps, and clean water filtration units in underserved areas.',
        currentFundingUsd: 69400,
        beneficiariesCount: 680,
        metrics: '16 off-grid community power nodes live'
      }
    ]
  },
  {
    key: 'tier4_rnd',
    tierNumber: 4,
    title: 'Tier 4: Open-Source R&D & Ethical Tooling',
    subtitle: 'Cleanroom Software, Next-Gen Architectures & Developer Tooling',
    allocationPct: 10,
    colorCode: '#4A6B82',
    programs: [
      {
        name: 'Zero-Dependency Cleanroom Libraries',
        description: 'Funding independent developers building verifiable, non-extractive software primitives.',
        currentFundingUsd: 45700,
        beneficiariesCount: 190,
        metrics: '42 open-source packages released with C2PA metadata'
      },
      {
        name: 'Open AI Safety & Fairly-Trained Research',
        description: 'Independent auditing tools, provenance cryptographic standards, and training transparency tests.',
        currentFundingUsd: 37300,
        beneficiariesCount: 140,
        metrics: '380,000 model queries verified for fair attribution'
      }
    ]
  },
  {
    key: 'tier5_social',
    tierNumber: 5,
    title: 'Tier 5: Beneficial Social Work Subsidies',
    subtitle: 'Frontline Caregiver Wage Assistance & Crisis Circles ($CREW)',
    allocationPct: 10,
    colorCode: '#8B5A7C',
    programs: [
      {
        name: 'Beneficial Social Work App Subsidies ($CREW)',
        description: 'Direct wage assistance for frontline human caregivers, social workers, crisis counselors, and youth mentors.',
        currentFundingUsd: 48000,
        beneficiariesCount: 410,
        metrics: '28 community co-ops receiving monthly wage support'
      },
      {
        name: 'Community Restoration & Desperation-Reduction Centers',
        description: 'Safe community maker spaces, collective kitchens, and dispute mediation circles.',
        currentFundingUsd: 32800,
        beneficiariesCount: 290,
        metrics: 'Documented 41% decline in local distress calls'
      }
    ]
  }
];

export const INITIAL_ROLE_WALLETS: RoleWalletAccount[] = [
  {
    id: 'wallet_cody_founder',
    holderName: 'Cody Germain (Architect)',
    holderRole: 'Artisan / Creator',
    laborDifficultyMultiplier: 2.2,
    walletAddress: '0xHUMAN_7F89_RED_DEER_ALBERTA_CA',
    balances: {
      FOOD: 350,
      MED: 200,
      EARTH: 500,
      INFR: 420,
      CREW: 600
    },
    totalUsdEquivalent: 2070.00,
    qrPayload: 'human://wallet/0xHUMAN_7F89_RED_DEER_ALBERTA_CA?holder=Cody+Germain&role=Artisan',
    lastDistributedAt: '2026-08-15T12:00:00Z'
  },
  {
    id: 'wallet_marcus_trade',
    holderName: 'Marcus Vance (Ironworker & Timber Craftsman)',
    holderRole: 'Heavy Labor / Trade',
    laborDifficultyMultiplier: 3.5, // Max multiplier for high-friction physical labor
    walletAddress: '0xHUMAN_LABOR_4482_HEAVY_TRADES',
    balances: {
      FOOD: 850,
      MED: 450,
      EARTH: 320,
      INFR: 980,
      CREW: 210
    },
    totalUsdEquivalent: 2810.00,
    qrPayload: 'human://wallet/0xHUMAN_LABOR_4482_HEAVY_TRADES?holder=Marcus+Vance&multiplier=3.5x',
    lastDistributedAt: '2026-08-18T09:30:00Z'
  },
  {
    id: 'wallet_elena_transition',
    holderName: 'Elena Rostova (Former Copywriter -> Worldbuilder)',
    holderRole: 'Displaced Labor / Transition',
    laborDifficultyMultiplier: 1.5,
    walletAddress: '0xHUMAN_TRANSITION_9921_WRITERS',
    balances: {
      FOOD: 600,
      MED: 300,
      EARTH: 150,
      INFR: 100,
      CREW: 450
    },
    totalUsdEquivalent: 1600.00,
    qrPayload: 'human://wallet/0xHUMAN_TRANSITION_9921_WRITERS?holder=Elena+Rostova&role=Transition',
    lastDistributedAt: '2026-08-19T14:15:00Z'
  },
  {
    id: 'wallet_sarah_nurse',
    holderName: 'Nurse Sarah Jenkins (Rural Mobile Health)',
    holderRole: 'Medical / Healthcare Worker',
    laborDifficultyMultiplier: 2.8,
    walletAddress: '0xHUMAN_HEALTH_3108_CARE_MOBILE',
    balances: {
      FOOD: 500,
      MED: 850,
      EARTH: 200,
      INFR: 300,
      CREW: 750
    },
    totalUsdEquivalent: 2600.00,
    qrPayload: 'human://wallet/0xHUMAN_HEALTH_3108_CARE_MOBILE?holder=Sarah+Jenkins&role=Medical',
    lastDistributedAt: '2026-08-20T08:00:00Z'
  },
  {
    id: 'wallet_amara_social',
    holderName: 'Amara Diallo (Youth Crisis & Community Co-op Lead)',
    holderRole: 'Social Worker / Co-op',
    laborDifficultyMultiplier: 2.5,
    walletAddress: '0xHUMAN_SOCIAL_6733_COMMUNITY_CARE',
    balances: {
      FOOD: 620,
      MED: 400,
      EARTH: 350,
      INFR: 220,
      CREW: 980
    },
    totalUsdEquivalent: 2570.00,
    qrPayload: 'human://wallet/0xHUMAN_SOCIAL_6733_COMMUNITY_CARE?holder=Amara+Diallo&role=SocialWork',
    lastDistributedAt: '2026-08-20T16:45:00Z'
  }
];

export const INITIAL_MERCHANT_STORES: MerchantStoreProfile[] = [
  {
    id: 'merchant_1',
    storeId: 'STORE-HUMAN-7491',
    businessName: 'Prairie Harvest Cooperative Grocery',
    category: 'Grocery & Food Market',
    contactEmail: 'manager@prairieharvestcoop.org',
    locationCity: 'Red Deer, AB',
    reportedNetWorthUsd: 1250000,
    pledgeTierPercent: 1.0,
    annualPledgeContributionUsd: 12500,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STORE-HUMAN-7491-PrairieHarvestCoop',
    stripeAccountId: 'acct_merchant_prairie_harvest',
    stripeConnected: true,
    totalRedemptionsUsd: 48920.00,
    acceptedTokens: ['$FOOD'],
    registeredAt: '2026-06-12T10:00:00Z',
    status: 'Active'
  },
  {
    id: 'merchant_2',
    storeId: 'STORE-HUMAN-8820',
    businessName: 'Community First Wellness & Dispensary',
    category: 'Pharmacy & Health Clinic',
    contactEmail: 'rx@communityfirstwellness.ca',
    locationCity: 'Calgary, AB',
    reportedNetWorthUsd: 2100000,
    pledgeTierPercent: 1.0,
    annualPledgeContributionUsd: 21000,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STORE-HUMAN-8820-CommunityFirstWellness',
    stripeAccountId: 'acct_merchant_community_first_rx',
    stripeConnected: true,
    totalRedemptionsUsd: 34150.00,
    acceptedTokens: ['$MED'],
    registeredAt: '2026-06-25T14:30:00Z',
    status: 'Active'
  },
  {
    id: 'merchant_3',
    storeId: 'STORE-HUMAN-5519',
    businessName: 'Sunland Regenerative Farm & Seed Supply',
    category: 'Hardware & Agriculture',
    contactEmail: 'orders@sunlandregenerative.com',
    locationCity: 'Edmonton, AB',
    reportedNetWorthUsd: 850000,
    pledgeTierPercent: 1.0,
    annualPledgeContributionUsd: 8500,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STORE-HUMAN-5519-SunlandRegenerative',
    stripeAccountId: 'acct_merchant_sunland_seeds',
    stripeConnected: true,
    totalRedemptionsUsd: 19800.00,
    acceptedTokens: ['$EARTH', '$INFR'],
    registeredAt: '2026-07-04T09:15:00Z',
    status: 'Active'
  },
  {
    id: 'merchant_4',
    storeId: 'STORE-HUMAN-9304',
    businessName: 'Heritage Guild Artisans & Collective',
    category: 'Artisan Shop',
    contactEmail: 'guild@heritagecrafts.org',
    locationCity: 'Vancouver, BC',
    reportedNetWorthUsd: 620000,
    pledgeTierPercent: 1.0,
    annualPledgeContributionUsd: 6200,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STORE-HUMAN-9304-HeritageGuild',
    stripeAccountId: 'acct_merchant_heritage_guild',
    stripeConnected: true,
    totalRedemptionsUsd: 22400.00,
    acceptedTokens: ['$CREW', '$FOOD'],
    registeredAt: '2026-07-18T11:20:00Z',
    status: 'Active'
  }
];

export const INITIAL_POS_SCAN_EVENTS: MerchantPOSScanEvent[] = [
  {
    id: 'pos_evt_101',
    storeId: 'STORE-HUMAN-7491',
    storeName: 'Prairie Harvest Cooperative Grocery',
    tokenType: '$FOOD',
    tokenUnits: 45,
    usdEquivalent: 45.00,
    customerWalletAddress: '0xHUMAN_TRANSITION_9921_WRITERS',
    itemDescription: 'Organic Whole Produce, Oats, Milk & Eggs Basket',
    status: 'Settled via Stripe Connect',
    receiptHash: '0xREC_F00D_7491_8820A1B',
    timestamp: '2026-08-21T14:32:00Z'
  },
  {
    id: 'pos_evt_102',
    storeId: 'STORE-HUMAN-8820',
    storeName: 'Community First Wellness & Dispensary',
    tokenType: '$MED',
    tokenUnits: 65,
    usdEquivalent: 65.00,
    customerWalletAddress: '0xHUMAN_HEALTH_3108_CARE_MOBILE',
    itemDescription: 'Essential Asthma Inhaler & Antibiotic Co-Pay',
    status: 'Settled via Stripe Connect',
    receiptHash: '0xREC_M3D_8820_9103C4D',
    timestamp: '2026-08-21T13:15:00Z'
  },
  {
    id: 'pos_evt_103',
    storeId: 'STORE-HUMAN-5519',
    storeName: 'Sunland Regenerative Farm & Seed Supply',
    tokenType: '$EARTH',
    tokenUnits: 120,
    usdEquivalent: 120.00,
    customerWalletAddress: '0xHUMAN_LABOR_4482_HEAVY_TRADES',
    itemDescription: 'Heritage Heirloom Seed Packets & Compost Inoculant',
    status: 'Settled via Stripe Connect',
    receiptHash: '0xREC_3ARTH_5519_2948E7F',
    timestamp: '2026-08-20T17:40:00Z'
  },
  {
    id: 'pos_evt_104',
    storeId: 'STORE-HUMAN-7491',
    storeName: 'Prairie Harvest Cooperative Grocery',
    tokenType: '$FOOD',
    tokenUnits: 80,
    usdEquivalent: 80.00,
    customerWalletAddress: '0xHUMAN_SOCIAL_6733_COMMUNITY_CARE',
    itemDescription: 'Community Youth Center Weekly Fresh Groceries',
    status: 'Settled via Stripe Connect',
    receiptHash: '0xREC_F00D_7491_5512G9H',
    timestamp: '2026-08-20T11:05:00Z'
  }
];

export const INITIAL_APP_SIGNIFICANCE_GRADES: AppSignificanceEvaluation[] = [
  {
    appName: 'Tome Crafter',
    appCategory: 'Original Literature & Philosophy Engine',
    realWorldProblemSolved: 'Eliminates algorithmic hallucinations in creative worldbuilding; grounds literature in genuine human psychological resonance.',
    significanceGrade: 'A+',
    problemSolvingWeight: 92,
    laborDifficultyBonus: '2.0x for deep psychological lore & narrative complexity',
    grantEligibilityBps: 280
  },
  {
    appName: 'RLM Pro Studio',
    appCategory: 'Acoustic & Timbre Synthesis Workstation',
    realWorldProblemSolved: 'Restores human acoustic musicianship and organic instrumental fidelity over repetitive synthetic noise.',
    significanceGrade: 'A+',
    problemSolvingWeight: 94,
    laborDifficultyBonus: '2.4x for live performance acoustic stems & microtonal tuning',
    grantEligibilityBps: 310
  },
  {
    appName: 'ForgeOS App Builder',
    appCategory: 'Cleanroom Software & Systems Kernel',
    realWorldProblemSolved: 'Replaces bloated, extractive ad-tech code with verifiable, zero-dependency, private utility software.',
    significanceGrade: 'A+',
    problemSolvingWeight: 96,
    laborDifficultyBonus: '2.8x for bare-metal kernels & verifiable distributed DAGs',
    grantEligibilityBps: 220
  },
  {
    appName: 'RL Easy Flow',
    appCategory: 'Interactive Visual & Vector Geometry Engine',
    realWorldProblemSolved: 'Enables precise, mathematical vector illustration and visual storytelling without copyleft infringement.',
    significanceGrade: 'A',
    problemSolvingWeight: 89,
    laborDifficultyBonus: '1.8x for pure SVG bezier geometry and visual design systems',
    grantEligibilityBps: 190
  }
];

/**
 * The Core Mathematical Engine for The Human Initiative:
 * - Secures Founder Operational Floor off the top ($12,500 - $25,000/mo)
 * - Calculates Sliding Scale Community Percentage based on subscriber volume:
 *   - < 10,000 subs: 50% (Phase 1: Balanced Foundation)
 *   - 10,000 - 50,000 subs: 65% (Phase 2: Growth Tiers)
 *   - 50,000 - 250,000 subs: 80% (Phase 3: Global Scaling)
 *   - 250,000+ subs: 95% (Phase 4: Planetary Hyper-Scale)
 * - Partitions Community Pool into Urgency Tiers:
 *   - Tier 1: Survival & Health (35%) -> $FOOD + $MED
 *   - Tier 2: AI-Displacement Restitution (25%)
 *   - Tier 3: Planetary Regeneration & Green Energy (20%) -> $EARTH + $INFR
 *   - Tier 4: Open-Source R&D (10%)
 *   - Tier 5: Social Work Subsidies (10%) -> $CREW
 */
export function calculateInitiativeSlidingScale(
  activeSubscribers: number = 15000,
  averageSubscriptionPriceUsd: number = 49.55,
  founderFloorUsd: number = 25000.00
): InitiativeSlidingScaleState {
  const grossMonthlyInflowUsd = activeSubscribers * averageSubscriptionPriceUsd;
  
  // Layer 1: Secure Founder Operational Floor off the top
  const effectiveFounderFloor = Math.min(grossMonthlyInflowUsd, founderFloorUsd);
  const netRemainder = Math.max(0, grossMonthlyInflowUsd - effectiveFounderFloor);

  // Sliding Scale Logic for Community Allocation
  let communitySharePct = 0.50; // < 10,000
  if (activeSubscribers < 10000) {
    communitySharePct = 0.50; // Phase 1: Balanced Foundation
  } else if (activeSubscribers < 50000) {
    communitySharePct = 0.65; // Phase 2: Growth Tiers
  } else if (activeSubscribers < 250000) {
    communitySharePct = 0.80; // Phase 3: Global Scaling
  } else {
    communitySharePct = 0.95; // Phase 4: Planetary Hyper-Scale (1-5% Ops Baseline)
  }

  const totalCommunityPoolUsd = netRemainder * communitySharePct;
  const retainedPlatformOps = netRemainder * (1.0 - communitySharePct);
  const founderTotalShare = effectiveFounderFloor + retainedPlatformOps;

  // Split into 5 Urgency Tiers:
  // Tier 1: 35%, Tier 2: 25%, Tier 3: 20%, Tier 4: 10%, Tier 5: 10%
  return {
    activeSubscribers,
    grossMonthlyInflowUsd,
    founderOperationalFloorUsd: effectiveFounderFloor,
    netDistributableUsd: netRemainder,
    communityAllocationPct: Number((communitySharePct * 100).toFixed(1)),
    founderOperationalShareUsd: founderTotalShare,
    totalCommunityPoolUsd,
    tierAllocations: {
      tier1_survival_usd: totalCommunityPoolUsd * 0.35,
      tier2_transition_usd: totalCommunityPoolUsd * 0.25,
      tier3_planetary_usd: totalCommunityPoolUsd * 0.20,
      tier4_rnd_usd: totalCommunityPoolUsd * 0.10,
      tier5_social_usd: totalCommunityPoolUsd * 0.10
    }
  };
}

/**
 * Generates standalone Python code strictly matching the user's HumanInitiativeEngine class
 */
export function generatePythonEngineCode(): string {
  return `class HumanInitiativeEngine:
    def __init__(self, active_subscribers: int, blended_arpu: float = 49.55):
        self.subscribers = active_subscribers
        self.arpu = blended_arpu
        
    def calculate_monthly_inflow(self) -> float:
        """Calculates Gross Monthly Recurring Revenue (MRR)."""
        return self.subscribers * self.arpu

    def process_revenue_distribution(self, founder_operational_floor: float):
        """
        Executes the heartbeat distribution:
        1. Secures Founder Operational Floor off the top.
        2. Calculates Sliding Scale Community Percentage based on subscriber volume.
        3. Partitions Community Pool into Urgency Tiers.
        """
        gross_mrr = self.calculate_monthly_inflow()
        
        # Safety Check: Inflow must cover the operational floor
        if gross_mrr < founder_operational_floor:
            raise ValueError("Gross MRR is currently below the Founder Operational Floor.")

        # Layer 1: Secure Founder Operational Floor off the top
        net_remainder = gross_mrr - founder_operational_floor

        # Sliding Scale Logic for Community Allocation
        if self.subscribers < 10000:
            community_share_pct = 0.50  # Phase 1: Balanced Foundation
        elif 10000 <= self.subscribers < 50000:
            community_share_pct = 0.65  # Phase 2: Growth Tiers
        elif 50000 <= self.subscribers < 250000:
            community_share_pct = 0.80  # Phase 3: Global Scaling
        else:
            community_share_pct = 0.95  # Phase 4: Planetary Hyper-Scale (Flashing 1-5% Ops Baseline)

        community_pool = net_remainder * community_share_pct
        retained_platform_ops = net_remainder * (1.0 - community_share_pct)

        # Urgency Tiers & Impact Pool Breakdown
        # Tier 1: Survival & Health (Food + Medical) -> 35%
        # Tier 2: AI-Displacement Restitution -> 25%
        # Tier 3: Planetary Regeneration & Green Energy -> 20%
        # Tier 4: Open-Source R&D -> 10%
        # Tier 5: Social Work Subsidies -> 10%
        urgency_breakdown = {
            "Tier_1_Survival_and_Health": community_pool * 0.35,
            "Tier_2_AI_Displacement_Restitution": community_pool * 0.25,
            "Tier_3_Planetary_Regeneration": community_pool * 0.20,
            "Tier_4_Open_Source_RD": community_pool * 0.10,
            "Tier_5_Social_Work_Subsidies": community_pool * 0.10,
        }

        return {
            "Gross_MRR": gross_mrr,
            "Founder_Operational_Floor": founder_operational_floor,
            "Net_Community_Pool": community_pool,
            "Retained_Platform_Ops": retained_platform_ops,
            "Urgency_Allocation": urgency_breakdown
        }

# --- Example Execution Run (Simulating 15,000 Subscribers) ---
if __name__ == "__main__":
    initiative = HumanInitiativeEngine(active_subscribers=15000)
    # Assuming a fixed operational baseline of $25,000/month for servers, legal, and development
    result = initiative.process_revenue_distribution(founder_operational_floor=25000.00)
    
    print("=== THE HUMAN INITIATIVE: HEARTBEAT SIMULATION ===")
    print(f"Active Subscribers: {initiative.subscribers:,}")
    print(f"Gross Monthly Inflow: \\\${result['Gross_MRR']:,.2f}")
    print(f"Founder Operational Floor (Secured): \\\${result['Founder_Operational_Floor']:,.2f}")
    print(f"Net Community Impact Pool: \\\${result['Net_Community_Pool']:,.2f}")
    print("\\n--- Urgency Tiers Breakdown ---")
    for tier, amount in result['Urgency_Allocation'].items():
        print(f" - {tier.replace('_', ' ')}: \\\${amount:,.2f}")
`;
}

export const INITIAL_ECOSYSTEM_APPS: HumanPoweredApp[] = [
  {
    id: 'app_tc_001',
    appClientId: 'app_human_tomecrafter_91',
    appName: 'Tome Crafter',
    tagline: 'Philosophy & Literary Reforge Engine for Independent Thinkers',
    developerName: 'Cody Germain (Captain Billy Buster)',
    developerEmail: 'cody@tomecrafter.org',
    category: 'Productivity & Writing',
    appUrl: 'https://tomecrafter.org',
    githubUrl: 'https://github.com/human-initiative/tome-crafter',
    subscriptionPriceMonthly: 39.00,
    subscribersCount: 4850,
    communitySplitPct: 50.0,
    monthlyImpactRunRateUsd: 94575.00,
    c2paAuditHash: '0xTC_9F82A0E41C_C2PA_VERIFIED',
    stripeConnected: true,
    stripeAccountId: 'acct_1NzkEthicalTC99x',
    badgeTheme: 'natural-olive',
    badgePosition: 'bottom-right',
    registeredAt: '2026-01-15T08:00:00Z',
    status: 'Live & Certified',
    verificationSeal: 'SEAL_TC_FOUNDER_GENESIS'
  },
  {
    id: 'app_rlm_002',
    appClientId: 'app_human_rlmpro_44',
    appName: 'RLM Pro Studio',
    tagline: 'Sonic Architecture, Acoustic Synthesis & Zero-Extract Timbre Master',
    developerName: 'Cody Germain',
    developerEmail: 'cody@rlmprostudio.com',
    category: 'Audio & Synthesis',
    appUrl: 'https://rlmprostudio.com',
    subscriptionPriceMonthly: 49.00,
    subscribersCount: 3920,
    communitySplitPct: 50.0,
    monthlyImpactRunRateUsd: 96040.00,
    c2paAuditHash: '0xRLM_3B71E892A1_C2PA_VERIFIED',
    stripeConnected: true,
    stripeAccountId: 'acct_1NzkEthicalRLM88x',
    badgeTheme: 'warm-clay',
    badgePosition: 'bottom-right',
    registeredAt: '2026-02-01T10:30:00Z',
    status: 'Live & Certified',
    verificationSeal: 'SEAL_RLM_FOUNDER_GENESIS'
  },
  {
    id: 'app_forge_003',
    appClientId: 'app_human_forgeos_78',
    appName: 'ForgeOS Builder',
    tagline: 'Cleanroom Zero-Dependency App Builder & WASM Kernel Engine',
    developerName: 'Cody Germain (Wade Cody)',
    developerEmail: 'cody@forgeos.dev',
    category: 'Developer Tools & Cleanroom Code',
    appUrl: 'https://forgeos.dev',
    subscriptionPriceMonthly: 59.00,
    subscribersCount: 3410,
    communitySplitPct: 50.0,
    monthlyImpactRunRateUsd: 100595.00,
    c2paAuditHash: '0xFORGE_88E29BC73F_C2PA_VERIFIED',
    stripeConnected: true,
    stripeAccountId: 'acct_1NzkEthicalForge77x',
    badgeTheme: 'charcoal-dark',
    badgePosition: 'checkout-banner',
    registeredAt: '2026-02-10T14:15:00Z',
    status: 'Live & Certified',
    verificationSeal: 'SEAL_FORGE_FOUNDER_GENESIS'
  },
  {
    id: 'app_rleasy_004',
    appClientId: 'app_human_rleasy_19',
    appName: 'RL Easy Flow',
    tagline: 'Parametric Vector Geometry & Intuitive Mechanical Layout CAD',
    developerName: 'Cody Germain',
    developerEmail: 'cody@rleasyflow.io',
    category: 'CAD, Vector & Creative Flow',
    appUrl: 'https://rleasyflow.io',
    subscriptionPriceMonthly: 29.00,
    subscribersCount: 2070,
    communitySplitPct: 50.0,
    monthlyImpactRunRateUsd: 30015.00,
    c2paAuditHash: '0xRLE_14D982F10C_C2PA_VERIFIED',
    stripeConnected: true,
    stripeAccountId: 'acct_1NzkEthicalRLEasy66x',
    badgeTheme: 'natural-olive',
    badgePosition: 'bottom-left',
    registeredAt: '2026-02-18T16:45:00Z',
    status: 'Live & Certified',
    verificationSeal: 'SEAL_RLE_FOUNDER_GENESIS'
  },
  {
    id: 'app_soiltech_005',
    appClientId: 'app_human_soilprobe_33',
    appName: 'TerraMicrobe OS',
    tagline: 'Soil Microbiome Sensor Ingestion & Regenerative Yield Forecasts',
    developerName: 'Dr. Elena Rostova & BioCraft Labs',
    developerEmail: 'elena@biocraftlabs.org',
    category: 'Regenerative Agriculture & Soil',
    appUrl: 'https://terramicrobe.org',
    subscriptionPriceMonthly: 45.00,
    subscribersCount: 840,
    communitySplitPct: 60.0,
    monthlyImpactRunRateUsd: 22680.00,
    c2paAuditHash: '0xTERRA_55A19CD33B_C2PA_VERIFIED',
    stripeConnected: true,
    stripeAccountId: 'acct_1NzkTerraBio44x',
    badgeTheme: 'natural-olive',
    badgePosition: 'bottom-right',
    registeredAt: '2026-03-01T09:00:00Z',
    status: 'Live & Certified',
    verificationSeal: 'SEAL_TERRA_PARTNER_01'
  }
];

export function generateReactEmbedCode(config: DeveloperEmbedConfig): string {
  return `// 1. Install via npm: npm install @human-initiative/sdk-react
import React from 'react';
import { HumanPoweredBadge } from '@human-initiative/sdk-react';

export default function AppFooter() {
  return (
    <footer className="w-full border-t border-stone-200 py-6 px-4">
      {/* Real-time certified H.U.M.A.N powered badge */}
      <HumanPoweredBadge 
        appId="${config.appId}"
        splitPercent={${config.splitPct}}
        theme="${config.theme}"
        position="${config.position}"
        showLiveImpact={${config.showTelemetry}}
        fundDestination="survival_and_health"
      />
    </footer>
  );
}`;
}

export function generateWebComponentEmbedCode(config: DeveloperEmbedConfig): string {
  return `<!-- Drop this anywhere in your HTML, Webflow, WordPress, or Shopify site -->
<script 
  src="https://cdn.humaninitiative.org/v1/human-badge.min.js" 
  async
></script>

<human-powered-badge
  app-id="${config.appId}"
  app-name="${config.appName}"
  split-percent="${config.splitPct}"
  theme="${config.theme}"
  position="${config.position}"
  show-telemetry="${config.showTelemetry}"
></human-powered-badge>`;
}

export function generateStripeSplitNodeCode(appId: string, splitPct: number): string {
  return `/**
 * Node.js / Express Webhook Handler for 50% H.U.M.A.N Fund Routing
 * Automatically transfers 50% of every subscription invoice to the Global H.U.M.A.N Fund.
 */
import express from 'express';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const HUMAN_FUND_STRIPE_ACCOUNT = 'acct_1NzkEthicalGlobalHumanFund99x';
const SPLIT_RATIO = ${splitPct / 100}; // ${splitPct}% of gross

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(\`Webhook Signature Error: \${err.message}\`);
  }

  // Handle successful customer subscription charge
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const amountPaidInCents = invoice.amount_paid; // e.g. $39.00 -> 3900 cents
    
    if (amountPaidInCents > 0) {
      const humanFundShareCents = Math.round(amountPaidInCents * SPLIT_RATIO);
      
      // Execute instantaneous programmatic transfer to H.U.M.A.N Fund
      const transfer = await stripe.transfers.create({
        amount: humanFundShareCents,
        currency: invoice.currency,
        destination: HUMAN_FUND_STRIPE_ACCOUNT,
        description: \`H.U.M.A.N Fund Split for ${appId} - Invoice \${invoice.id}\`,
        metadata: {
          app_id: '${appId}',
          split_percentage: '${splitPct}%',
          target_urgency_pool: 'Tier 1 Food & Medical Baseline',
          c2pa_verified: 'true'
        }
      });

      console.log(\`✅ Routed \${humanFundShareCents / 100} \${invoice.currency.toUpperCase()} to H.U.M.A.N Fund (Transfer: \${transfer.id})\`);
    }
  }

  res.json({ received: true });
});
`;
}

export function generateFlaskPythonWebhookCode(appId: string, subscribersCount: number = 15000, founderFloor: number = 25000): string {
  return `from flask import Flask, jsonify, request
import os
import stripe
from engine import HumanInitiativeEngine

app = Flask(__name__)

# Initialize Stripe with your API keys (stored securely in environment variables)
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "sk_test_mockkey")
ENDPOINT_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "whsec_mocksecret")

# Configuration for The Human Initiative
FOUNDER_OPERATIONAL_FLOOR_MONTHLY = ${founderFloor.toFixed(2)}  # Secures your servers, legal, and operational baseline off the top
CURRENT_ACTIVE_SUBSCRIBERS = ${subscribersCount}             # Dynamic subscriber count feeding the sliding scale

@app.route("/stripe/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        # Secure cryptographic signature validation to prevent spoofing or tampering
        event = stripe.Webhook.construct_event(
            payload, sig_header, ENDPOINT_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return jsonify({"error": "Invalid signature"}), 400

    # Listen for successful subscription or invoice payment events across your 4 apps
    if event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        customer_email = invoice.get("customer_email")
        amount_paid = invoice.get("amount_paid", 0) / 100.00  # Convert cents to dollars
        app_source = invoice.get("metadata", {}).get("app_source", "${appId}")

        print(f"[INFLOW RECEIVED] App: {app_source} | Customer: {customer_email} | Amount: \\\${amount_paid:.2f}")

        # Execute The Human Initiative Financial Engine
        try:
            engine = HumanInitiativeEngine(active_subscribers=CURRENT_ACTIVE_SUBSCRIBERS)
            distribution_report = engine.process_revenue_distribution(
                founder_operational_floor=FOUNDER_OPERATIONAL_FLOOR_MONTHLY
            )

            # Log execution success (In production, this writes directly to your ledger database)
            print("=== HEARTBEAT DISTRIBUTION EXECUTED ===")
            print(f"Founder Floor Secured: \\\${distribution_report['Founder_Operational_Floor']:,.2f}")
            print(f"Community Impact Pool Funded: \\\${distribution_report['Net_Community_Pool']:,.2f}")

        except Exception as engine_error:
            print(f"[ENGINE ERROR] Failed to process distribution: {str(engine_error)}")
            return jsonify({"status": "error", "message": str(engine_error)}), 500

    # Return a rapid 200 OK to Stripe to acknowledge receipt (< 10 seconds requirement)
    return jsonify({"status": "success", "processed": True}), 200

if __name__ == "__main__":
    # Run the gateway locally on port 4242 (standard for Stripe CLI forwarding)
    app.run(port=4242, debug=True)
`;
}

export function generateFastApiPythonSplitCode(appId: string, splitPct: number): string {
  return `"""
FastAPI / Python Webhook Router for Automated H.U.M.A.N Heartbeat Routing
"""
import os
import stripe
from fastapi import FastAPI, Request, HTTPException, Header

app = FastAPI()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
HUMAN_FUND_ACCOUNT = "acct_1NzkEthicalGlobalHumanFund99x"
SPLIT_RATIO = ${splitPct / 100}  # ${splitPct}% Baseline

@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        amount_paid = invoice["amount_paid"]
        
        if amount_paid > 0:
            human_share = int(amount_paid * SPLIT_RATIO)
            transfer = stripe.Transfer.create(
                amount=human_share,
                currency=invoice["currency"],
                destination=HUMAN_FUND_ACCOUNT,
                description=f"H.U.M.A.N Split for ${appId} - Invoice {invoice['id']}",
                metadata={
                    "app_id": "${appId}",
                    "split_pct": "${splitPct}%",
                    "pool": "Survival and Emergency Health"
                }
            )
            print(f"✅ Routed \${human_share/100:.2f} to H.U.M.A.N Fund: {transfer.id}")

    return {"status": "success"}
`;
}

export function generateInitiativeClientPythonCode(appSource: string = "ForgeOS App Builder"): string {
  return `from human_initiative import InitiativeClient

# Initialize with your application credentials and app source tag
client = InitiativeClient(
    api_key="hi_live_sec_your_token_here",
    app_source="${appSource}"
)

# Triggered when a subscriber successfully pays their monthly invoice
def handle_successful_payment(customer_email: str, amount_in_cents: int):
    distribution = client.process_inflow(
        email=customer_email,
        amount=amount_in_cents
    )
    print(f"Successfully routed \${distribution['net_community_pool']} to The Human Initiative pools.")
`;
}
