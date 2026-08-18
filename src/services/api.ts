import axios from 'axios';
import { 
  Tester, 
  CopyrightClaim, 
  FeedbackItem, 
  BroadcastMessage, 
  RoyaltyStreamEvent, 
  RoyaltyPoolSummary,
  AppName 
} from '../types';
import { 
  INITIAL_TESTERS, 
  INITIAL_CLAIMS, 
  INITIAL_FEEDBACK, 
  INITIAL_BROADCASTS, 
  INITIAL_ROYALTY_EVENTS, 
  INITIAL_SUMMARY 
} from './initialData';

// Storage keys for local persistence
const STORAGE_KEYS = {
  TESTERS: 'human_testers_v1',
  CLAIMS: 'human_claims_v1',
  FEEDBACK: 'human_feedback_v1',
  BROADCASTS: 'human_broadcasts_v1',
  ROYALTY_EVENTS: 'human_royalty_events_v1',
  SUMMARY: 'human_summary_v1',
};

// Initialize localStorage if empty
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Axios instance with base configuration
export const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000,
});

export const TesterService = {
  async getTesters(): Promise<Tester[]> {
    return loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
  },

  async addTester(newTester: Omit<Tester, 'id' | 'joined_at' | 'total_royalties_received' | 'last_active'>): Promise<Tester> {
    const testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
    const id = `tst_${Date.now().toString(36)}`;
    const created: Tester = {
      ...newTester,
      id,
      joined_at: new Date().toISOString(),
      total_royalties_received: 0,
      last_active: 'Just joined',
      license_keys: newTester.app_access_list.reduce((acc, app) => {
        const prefix = app.substring(0, 3).toUpperCase();
        acc[app] = `HUMAN-${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        return acc;
      }, {} as Record<string, string>),
      email_welcomed: true,
    };

    testers.unshift(created);
    saveToStorage(STORAGE_KEYS.TESTERS, testers);
    return created;
  },

  async updateTester(id: string, updates: Partial<Tester>): Promise<Tester> {
    const testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
    const index = testers.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tester not found');
    
    testers[index] = { ...testers[index], ...updates };
    saveToStorage(STORAGE_KEYS.TESTERS, testers);
    return testers[index];
  },

  async deleteTester(id: string): Promise<boolean> {
    let testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
    testers = testers.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.TESTERS, testers);
    return true;
  },

  /**
   * Sensitive Operation: Grant Access
   * Calls server endpoint to dispatch access webhook & issue verified tokens.
   */
  async grantAccess(testerId: string, appName: AppName, accessTier?: string): Promise<{ success: boolean; message: string; licenseKey: string }> {
    try {
      const res = await apiClient.post('/api/stripe/grant-access', {
        testerId,
        appName,
        accessTier,
      });

      // Update tester license record locally
      const testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
      const tester = testers.find(t => t.id === testerId);
      if (tester) {
        if (!tester.app_access_list.includes(appName)) {
          tester.app_access_list.push(appName);
        }
        if (!tester.license_keys) tester.license_keys = {};
        tester.license_keys[appName] = res.data.licenseKey;
        tester.current_subscription_status = 'Stripe Connect Active';
        tester.last_active = 'Just updated access';
        saveToStorage(STORAGE_KEYS.TESTERS, testers);
      }

      return res.data;
    } catch {
      // Offline / fallback response
      const fallbackKey = `HUMAN-${appName.substring(0, 3).toUpperCase()}-TEST-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      return {
        success: true,
        message: `Access granted for ${appName}. Offline simulation active.`,
        licenseKey: fallbackKey,
      };
    }
  },

  /**
   * Sensitive Operation: Reset Stripe Sandbox
   * Calls server endpoint to clear test payment intent tokens & generate fresh sandbox IDs.
   */
  async resetStripeSandbox(testerId: string, email: string): Promise<{ success: boolean; message: string; account: any }> {
    try {
      const res = await apiClient.post('/api/stripe/sandbox-reset', {
        testerId,
        email,
      });

      // Update tester stripe account status
      const testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
      const tester = testers.find(t => t.id === testerId);
      if (tester) {
        tester.current_subscription_status = 'Stripe Sandbox';
        tester.stripe_account_id = res.data.account.stripeSandboxAccountId;
        tester.last_active = 'Sandbox reset just now';
        saveToStorage(STORAGE_KEYS.TESTERS, testers);
      }

      return res.data;
    } catch {
      const newAccountId = `acct_test_${Math.random().toString(36).substring(2, 10)}`;
      return {
        success: true,
        message: `Stripe Sandbox tokens refreshed for ${email}.`,
        account: { stripeSandboxAccountId: newAccountId, status: 'Stripe Sandbox' },
      };
    }
  },
};

export const ClaimService = {
  async getClaims(): Promise<CopyrightClaim[]> {
    return loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
  },

  async evaluateClaimWithGemini(payload: {
    title: string;
    creatorName: string;
    assetType: string;
    repositoryOrSource: string;
    description: string;
  }) {
    const res = await apiClient.post('/api/gemini/evaluate-claim', payload);
    return res.data;
  },

  async addClaim(newClaim: Omit<CopyrightClaim, 'id' | 'created_at' | 'total_payouts_claimed_usd'>): Promise<CopyrightClaim> {
    const claims = loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    const created: CopyrightClaim = {
      ...newClaim,
      id: `clm_${Date.now().toString(36)}`,
      created_at: new Date().toISOString(),
      total_payouts_claimed_usd: 0,
    };
    claims.unshift(created);
    saveToStorage(STORAGE_KEYS.CLAIMS, claims);
    return created;
  },

  async triggerPayout(claimId: string, amountUsd: number): Promise<boolean> {
    const claims = loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return false;

    claim.payout_balance_usd = Math.max(0, claim.payout_balance_usd - amountUsd);
    claim.total_payouts_claimed_usd += amountUsd;
    saveToStorage(STORAGE_KEYS.CLAIMS, claims);
    return true;
  },
};

export const FeedbackService = {
  async getFeedback(): Promise<FeedbackItem[]> {
    return loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  },

  async addFeedback(item: Omit<FeedbackItem, 'id' | 'created_at' | 'status'>): Promise<FeedbackItem> {
    const list = loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    const created: FeedbackItem = {
      ...item,
      id: `fb_${Date.now().toString(36)}`,
      created_at: new Date().toISOString(),
      status: 'New',
    };
    list.unshift(created);
    saveToStorage(STORAGE_KEYS.FEEDBACK, list);
    return created;
  },

  async updateFeedbackStatus(id: string, status: FeedbackItem['status']): Promise<FeedbackItem> {
    const list = loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    const item = list.find(f => f.id === id);
    if (!item) throw new Error('Feedback not found');
    item.status = status;
    saveToStorage(STORAGE_KEYS.FEEDBACK, list);
    return item;
  },

  async addReply(id: string, replyMessage: string, senderName = 'Admin (H.U.M.A.N.)'): Promise<FeedbackItem> {
    const list = loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    const item = list.find(f => f.id === id);
    if (!item) throw new Error('Feedback not found');
    if (!item.reply_history) item.reply_history = [];
    item.reply_history.push({
      sender: senderName,
      message: replyMessage,
      timestamp: new Date().toISOString(),
    });
    if (item.status === 'New') {
      item.status = 'In Review';
    }
    saveToStorage(STORAGE_KEYS.FEEDBACK, list);
    return item;
  },
};

export const BroadcastService = {
  async getBroadcasts(): Promise<BroadcastMessage[]> {
    return loadFromStorage<BroadcastMessage[]>(STORAGE_KEYS.BROADCASTS, INITIAL_BROADCASTS);
  },

  async draftWithGemini(payload: {
    appTarget: string;
    topic: string;
    tone?: string;
    extraContext?: string;
  }) {
    const res = await apiClient.post('/api/gemini/draft-broadcast', payload);
    return res.data;
  },

  async sendBroadcast(payload: {
    subject: string;
    body_text: string;
    target_app: string;
    key_takeaways?: string[];
    sender_admin?: string;
  }): Promise<BroadcastMessage> {
    const broadcasts = loadFromStorage<BroadcastMessage[]>(STORAGE_KEYS.BROADCASTS, INITIAL_BROADCASTS);
    const testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);

    const matchingTesters = payload.target_app === 'All Apps'
      ? testers
      : testers.filter(t => t.app_access_list.includes(payload.target_app as AppName));

    const created: BroadcastMessage = {
      id: `bc_${Date.now().toString(36)}`,
      subject: payload.subject,
      body_text: payload.body_text,
      target_app: payload.target_app,
      recipients_count: matchingTesters.length,
      sent_at: new Date().toISOString(),
      status: 'Delivered',
      key_takeaways: payload.key_takeaways,
      sender_admin: payload.sender_admin || 'Cody Germain (Lead Architect)',
    };

    broadcasts.unshift(created);
    saveToStorage(STORAGE_KEYS.BROADCASTS, broadcasts);
    return created;
  },
};

export const SynthesisService = {
  async getRoyaltyEvents(): Promise<RoyaltyStreamEvent[]> {
    return loadFromStorage<RoyaltyStreamEvent[]>(STORAGE_KEYS.ROYALTY_EVENTS, INITIAL_ROYALTY_EVENTS);
  },

  async getSummary(): Promise<RoyaltyPoolSummary> {
    return loadFromStorage<RoyaltyPoolSummary>(STORAGE_KEYS.SUMMARY, INITIAL_SUMMARY);
  },

  async synthesizeWithRoyalties(payload: { prompt: string; requestedType?: string }) {
    const res = await apiClient.post('/api/gemini/synthesize-with-royalties', payload);
    const data = res.data;

    // Record stream events locally
    const events = loadFromStorage<RoyaltyStreamEvent[]>(STORAGE_KEYS.ROYALTY_EVENTS, INITIAL_ROYALTY_EVENTS);
    const summary = loadFromStorage<RoyaltyPoolSummary>(STORAGE_KEYS.SUMMARY, INITIAL_SUMMARY);

    if (data.attributedCreators && Array.isArray(data.attributedCreators)) {
      data.attributedCreators.forEach((c: any) => {
        events.unshift({
          id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`,
          timestamp: 'Just now',
          trigger_prompt: payload.prompt.substring(0, 60),
          app_source: 'ReForgeOS Synthesizer',
          amount_cents: c.microRoyaltyCents || 3.5,
          recipient_name: c.name,
          package_or_work: c.package,
          stripe_transfer_id: `tr_test_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          audit_hash: data.auditHash || '0xabc...123',
        });
      });

      const totalNewUsd = (data.totalStreamedCents || 5.0) / 100;
      summary.total_streamed_usd += totalNewUsd;
      summary.total_synthesis_events += 1;

      saveToStorage(STORAGE_KEYS.ROYALTY_EVENTS, events.slice(0, 50));
      saveToStorage(STORAGE_KEYS.SUMMARY, summary);
    }

    return data;
  },
};
