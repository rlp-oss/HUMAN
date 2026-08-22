import { 
  InitiativeUrgencyTier, 
  RoleWalletAccount, 
  MerchantStoreProfile, 
  MerchantPOSScanEvent, 
  InitiativeSlidingScaleState, 
  AppSignificanceEvaluation,
  RoleWalletType,
  HumanPoweredApp,
  DeveloperEmbedConfig 
} from '../types';
import { 
  INITIAL_URGENCY_TIERS, 
  INITIAL_ROLE_WALLETS, 
  INITIAL_MERCHANT_STORES, 
  INITIAL_POS_SCAN_EVENTS, 
  INITIAL_APP_SIGNIFICANCE_GRADES,
  INITIAL_ECOSYSTEM_APPS,
  calculateInitiativeSlidingScale,
  generatePythonEngineCode,
  generateReactEmbedCode,
  generateWebComponentEmbedCode,
  generateStripeSplitNodeCode,
  generateFlaskPythonWebhookCode,
  generateFastApiPythonSplitCode,
  generateInitiativeClientPythonCode
} from './humanInitiativeData';

const STORAGE_KEYS = {
  URGENCY_TIERS: 'human_initiative_urgency_tiers_v1',
  ROLE_WALLETS: 'human_initiative_role_wallets_v1',
  MERCHANTS: 'human_initiative_merchants_v1',
  POS_SCANS: 'human_initiative_pos_scans_v1',
  APP_SIGNIFICANCE: 'human_initiative_app_significance_v1',
  SLIDING_SCALE_CONFIG: 'human_initiative_sliding_scale_v1',
  ECOSYSTEM_APPS: 'human_initiative_ecosystem_apps_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export const HumanInitiativeService = {
  // 1. Sliding Scale & Heartbeat Engine
  getSlidingScaleState(subscribers?: number, price?: number): InitiativeSlidingScaleState {
    const savedSubs = subscribers ?? Number(localStorage.getItem('human_initiative_subscribers') || '14250');
    return calculateInitiativeSlidingScale(savedSubs, price ?? 39.00);
  },

  setSubscribers(count: number): InitiativeSlidingScaleState {
    localStorage.setItem('human_initiative_subscribers', count.toString());
    return calculateInitiativeSlidingScale(count);
  },

  // 2. Urgency Tiers
  getUrgencyTiers(): InitiativeUrgencyTier[] {
    return loadStorage<InitiativeUrgencyTier[]>(STORAGE_KEYS.URGENCY_TIERS, INITIAL_URGENCY_TIERS);
  },

  updateTierAllocation(key: string, newPct: number): InitiativeUrgencyTier[] {
    const tiers = this.getUrgencyTiers();
    const updated = tiers.map(t => t.key === key ? { ...t, allocationPct: newPct } : t);
    saveStorage(STORAGE_KEYS.URGENCY_TIERS, updated);
    return updated;
  },

  // 3. Role-Based Wallets ($FOOD, $MED, $EARTH, $INFR, $CREW)
  getRoleWallets(): RoleWalletAccount[] {
    return loadStorage<RoleWalletAccount[]>(STORAGE_KEYS.ROLE_WALLETS, INITIAL_ROLE_WALLETS);
  },

  createRoleWallet(params: {
    holderName: string;
    holderRole: RoleWalletAccount['holderRole'];
    laborDifficultyMultiplier: number;
  }): RoleWalletAccount {
    const wallets = this.getRoleWallets();
    const id = `wallet_${Date.now()}`;
    const cleanRole = params.holderRole.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const walletAddress = `0xHUMAN_${cleanRole}_${Math.floor(1000 + Math.random() * 9000)}`;

    const initialBalances = {
      FOOD: Math.round(200 * params.laborDifficultyMultiplier),
      MED: Math.round(150 * params.laborDifficultyMultiplier),
      EARTH: Math.round(100 * params.laborDifficultyMultiplier),
      INFR: Math.round(150 * params.laborDifficultyMultiplier),
      CREW: Math.round(180 * params.laborDifficultyMultiplier)
    };

    const totalUsd = initialBalances.FOOD + initialBalances.MED + initialBalances.EARTH + initialBalances.INFR + initialBalances.CREW;

    const newWallet: RoleWalletAccount = {
      id,
      holderName: params.holderName,
      holderRole: params.holderRole,
      laborDifficultyMultiplier: params.laborDifficultyMultiplier,
      walletAddress,
      balances: initialBalances,
      totalUsdEquivalent: totalUsd,
      qrPayload: `human://wallet/${walletAddress}?holder=${encodeURIComponent(params.holderName)}&mult=${params.laborDifficultyMultiplier}x`,
      lastDistributedAt: new Date().toISOString()
    };

    wallets.unshift(newWallet);
    saveStorage(STORAGE_KEYS.ROLE_WALLETS, wallets);
    return newWallet;
  },

  // 4. Merchant Store Profiles (1% Pledge, Store ID, QR Code)
  getMerchants(): MerchantStoreProfile[] {
    return loadStorage<MerchantStoreProfile[]>(STORAGE_KEYS.MERCHANTS, INITIAL_MERCHANT_STORES);
  },

  registerMerchant(params: {
    businessName: string;
    category: MerchantStoreProfile['category'];
    contactEmail: string;
    locationCity: string;
    reportedNetWorthUsd: number;
    pledgeTierPercent?: number;
    acceptedTokens?: RoleWalletType[];
  }): MerchantStoreProfile {
    const merchants = this.getMerchants();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const storeId = `STORE-HUMAN-${randomSuffix}`;
    const pledgePct = params.pledgeTierPercent ?? 1.0;
    const annualPledge = (params.reportedNetWorthUsd * pledgePct) / 100;
    const qrData = `${storeId}-${encodeURIComponent(params.businessName.replace(/\s+/g, ''))}`;

    const newMerchant: MerchantStoreProfile = {
      id: `merchant_${Date.now()}`,
      storeId,
      businessName: params.businessName,
      category: params.category,
      contactEmail: params.contactEmail,
      locationCity: params.locationCity,
      reportedNetWorthUsd: params.reportedNetWorthUsd,
      pledgeTierPercent: pledgePct,
      annualPledgeContributionUsd: annualPledge,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}`,
      stripeAccountId: `acct_merchant_${randomSuffix}`,
      stripeConnected: true,
      totalRedemptionsUsd: 0,
      acceptedTokens: params.acceptedTokens || (params.category.includes('Food') ? ['$FOOD'] : params.category.includes('Health') ? ['$MED'] : ['$FOOD', '$CREW']),
      registeredAt: new Date().toISOString(),
      status: 'Active'
    };

    merchants.unshift(newMerchant);
    saveStorage(STORAGE_KEYS.MERCHANTS, merchants);
    return newMerchant;
  },

  // 5. Merchant POS Scanning & Redemption Terminal
  getPOSScanEvents(): MerchantPOSScanEvent[] {
    return loadStorage<MerchantPOSScanEvent[]>(STORAGE_KEYS.POS_SCANS, INITIAL_POS_SCAN_EVENTS);
  },

  processPOSRedemption(params: {
    storeId: string;
    customerWalletAddress: string;
    tokenType: RoleWalletType;
    tokenUnits: number;
    itemDescription: string;
  }): { scanEvent: MerchantPOSScanEvent; remainingBalance: number } {
    const merchants = this.getMerchants();
    const wallets = this.getRoleWallets();
    const scans = this.getPOSScanEvents();

    const merchant = merchants.find(m => m.storeId === params.storeId) || merchants[0];
    const wallet = wallets.find(w => w.walletAddress === params.customerWalletAddress) || wallets[0];

    const tokenKey = params.tokenType.replace('$', '') as 'FOOD' | 'MED' | 'EARTH' | 'INFR' | 'CREW';
    const currentBalance = Number(wallet.balances[tokenKey]) || 0;

    const actualDeducted = Math.min(currentBalance, params.tokenUnits);
    wallet.balances[tokenKey] = Math.max(0, currentBalance - actualDeducted);
    const balanceValues: number[] = Object.values(wallet.balances);
    wallet.totalUsdEquivalent = balanceValues.reduce((sum: number, val: number) => sum + Number(val), 0);

    // Update merchant's total redemptions
    merchant.totalRedemptionsUsd += actualDeducted;

    // Create scan event
    const receiptHash = `0xREC_${String(tokenKey)}_${merchant.storeId.replace('STORE-HUMAN-', '')}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newScan: MerchantPOSScanEvent = {
      id: `pos_evt_${Date.now()}`,
      storeId: merchant.storeId,
      storeName: merchant.businessName,
      tokenType: params.tokenType,
      tokenUnits: actualDeducted,
      usdEquivalent: actualDeducted,
      customerWalletAddress: wallet.walletAddress,
      itemDescription: params.itemDescription,
      status: 'Settled via Stripe Connect',
      receiptHash,
      timestamp: new Date().toISOString()
    };

    scans.unshift(newScan);
    saveStorage(STORAGE_KEYS.POS_SCANS, scans);
    saveStorage(STORAGE_KEYS.MERCHANTS, merchants);
    saveStorage(STORAGE_KEYS.ROLE_WALLETS, wallets);

    return {
      scanEvent: newScan,
      remainingBalance: wallet.balances[tokenKey]
    };
  },

  // 6. App Significance Grades & Labor Multipliers
  getAppSignificanceGrades(): AppSignificanceEvaluation[] {
    return loadStorage<AppSignificanceEvaluation[]>(STORAGE_KEYS.APP_SIGNIFICANCE, INITIAL_APP_SIGNIFICANCE_GRADES);
  },

  // 7. Developer SDK & Code Generators
  getPythonCode(): string {
    return generatePythonEngineCode();
  },

  getReactEmbedSnippet(config: DeveloperEmbedConfig): string {
    return generateReactEmbedCode(config);
  },

  getWebComponentSnippet(config: DeveloperEmbedConfig): string {
    return generateWebComponentEmbedCode(config);
  },

  getStripeSplitNodeSnippet(appId: string, splitPct: number = 50): string {
    return generateStripeSplitNodeCode(appId, splitPct);
  },

  getFlaskPythonSnippet(appId: string, subscribersCount: number = 15000, founderFloor: number = 25000): string {
    return generateFlaskPythonWebhookCode(appId, subscribersCount, founderFloor);
  },

  getFastApiPythonSnippet(appId: string, splitPct: number = 50): string {
    return generateFastApiPythonSplitCode(appId, splitPct);
  },

  // 8. H.U.M.A.N Powered Ecosystem Apps
  getEcosystemApps(): HumanPoweredApp[] {
    return loadStorage<HumanPoweredApp[]>(STORAGE_KEYS.ECOSYSTEM_APPS, INITIAL_ECOSYSTEM_APPS);
  },

  registerEcosystemApp(params: {
    appName: string;
    tagline: string;
    developerName: string;
    developerEmail: string;
    category: HumanPoweredApp['category'];
    appUrl: string;
    githubUrl?: string;
    subscriptionPriceMonthly: number;
    estimatedSubscribers?: number;
    communitySplitPct?: number; // starts at 50%
    badgeTheme?: HumanPoweredApp['badgeTheme'];
    badgePosition?: HumanPoweredApp['badgePosition'];
    stripeAccountId?: string;
  }): HumanPoweredApp {
    const apps = this.getEcosystemApps();
    const cleanAppCode = params.appName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 14);
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const appClientId = `app_human_${cleanAppCode}_${randomHex.toLowerCase()}`;
    const c2paAuditHash = `0xHMN_${cleanAppCode.toUpperCase()}_${randomHex}_C2PA_VERIFIED`;
    const verificationSeal = `SEAL_HMN_${cleanAppCode.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;

    const splitPct = Math.max(50, params.communitySplitPct ?? 50.0);
    const subCount = params.estimatedSubscribers || 100;
    const monthlyGross = subCount * params.subscriptionPriceMonthly;
    const monthlyImpact = (monthlyGross * splitPct) / 100;

    const newApp: HumanPoweredApp = {
      id: `app_eco_${Date.now()}`,
      appClientId,
      appName: params.appName,
      tagline: params.tagline,
      developerName: params.developerName,
      developerEmail: params.developerEmail,
      category: params.category,
      appUrl: params.appUrl,
      githubUrl: params.githubUrl,
      subscriptionPriceMonthly: params.subscriptionPriceMonthly,
      subscribersCount: subCount,
      communitySplitPct: splitPct,
      monthlyImpactRunRateUsd: monthlyImpact,
      c2paAuditHash,
      stripeConnected: !!params.stripeAccountId,
      stripeAccountId: params.stripeAccountId || `acct_1Nzk${cleanAppCode}Connect99x`,
      badgeTheme: params.badgeTheme || 'natural-olive',
      badgePosition: params.badgePosition || 'bottom-right',
      registeredAt: new Date().toISOString(),
      status: 'Live & Certified',
      verificationSeal
    };

    apps.unshift(newApp);
    saveStorage(STORAGE_KEYS.ECOSYSTEM_APPS, apps);
    return newApp;
  },

  getInitiativeClientPythonSnippet(appSource?: string): string {
    return generateInitiativeClientPythonCode(appSource || 'ForgeOS App Builder');
  },

  getNodeSdkSnippet(): string {
    return `// =========================================================================
// @human-initiative/sdk - Node.js / TypeScript Integration
// =========================================================================
import { HumanInitiativeClient } from '@human-initiative/sdk';

const human = new HumanInitiativeClient({
  apiKey: process.env.HUMAN_INITIATIVE_SECRET_KEY,
  appName: 'Tome Crafter',
  stripeConnectAccountId: process.env.STRIPE_CONNECT_ID
});

// Automatic Heartbeat Subscription Split Webhook (50% Baseline)
export async function handleStripeSubscriptionWebhook(event: Stripe.Event) {
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const amountUsd = invoice.amount_paid / 100;

    // Dispatches 50%-95% directly into Tier 1 (Food/Health) and Tier 2 (Restitution)
    const receipt = await human.dispatchHeartbeatContribution({
      grossAmountUsd: amountUsd,
      subscriberEmail: invoice.customer_email,
      c2paManifestHash: invoice.metadata?.c2pa_hash
    });

    console.log(\`[HUMAN INITIATIVE] Disbursed to Urgency Pool: \${receipt.receiptHash}\`);
  }
}`;
  }
};
