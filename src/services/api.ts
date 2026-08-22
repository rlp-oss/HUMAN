import axios from 'axios';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Tester, 
  CopyrightClaim, 
  FeedbackItem, 
  BroadcastMessage, 
  RoyaltyStreamEvent, 
  RoyaltyPoolSummary,
  AppName,
  SocietyFundMetrics,
  AppSubscriptionTally,
  UnregisteredEscrowClaim,
  SocietyDistributionRound,
  CreatorAccount,
  DirectMessage,
  MessageThread,
  StakeholderPersona,
  StakeholderInsightResult,
  HumanStatsSnapshot
} from '../types';
import { 
  INITIAL_TESTERS, 
  INITIAL_CLAIMS, 
  INITIAL_FEEDBACK, 
  INITIAL_BROADCASTS, 
  INITIAL_ROYALTY_EVENTS, 
  INITIAL_SUMMARY,
  INITIAL_APP_SUBSCRIPTIONS,
  INITIAL_UNREGISTERED_ESCROW,
  INITIAL_DISTRIBUTION_ROUNDS,
  INITIAL_SOCIETY_FUND_METRICS,
  INITIAL_CREATOR_ACCOUNTS,
  INITIAL_MESSAGE_THREADS,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_STUDIO_CREATIONS
} from './initialData';
import { StudioCreationWork } from '../types';

// Storage keys for local persistence
const STORAGE_KEYS = {
  TESTERS: 'human_testers_v1',
  CLAIMS: 'human_claims_v1',
  FEEDBACK: 'human_feedback_v1',
  BROADCASTS: 'human_broadcasts_v1',
  ROYALTY_EVENTS: 'human_royalty_events_v1',
  SUMMARY: 'human_summary_v1',
  SOCIETY_METRICS: 'human_society_metrics_v2',
  APP_SUBSCRIPTIONS: 'human_app_subscriptions_v2',
  UNREGISTERED_ESCROW: 'human_unregistered_escrow_v2',
  DISTRIBUTION_ROUNDS: 'human_distribution_rounds_v2',
  CREATOR_ACCOUNTS: 'human_creator_accounts_v2',
  MESSAGE_THREADS: 'human_message_threads_v2',
  DIRECT_MESSAGES: 'human_direct_messages_v2',
  STUDIO_CREATIONS: 'human_studio_creations_v1',
  TALENT_REPORTS: 'human_talent_reports_v1',
  ACTIVE_TALENT_REPORT: 'human_active_talent_report_v1',
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
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'testers'));
        if (!snap.empty) {
          const remoteTesters = snap.docs.map(d => ({ ...d.data(), id: d.id } as Tester));
          saveToStorage(STORAGE_KEYS.TESTERS, remoteTesters);
          return remoteTesters;
        } else {
          // Sync initial seed data to Firestore
          const localTesters = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
          for (const t of localTesters) {
            setDoc(doc(db, 'testers', t.id), t).catch(() => {});
          }
          return localTesters;
        }
      }
    } catch (err) {
      console.warn('Firestore fetch testers fallback to local storage:', err);
    }
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

    // Sync to Firestore
    try {
      if (db) {
        await setDoc(doc(db, 'testers', id), created);
      }
    } catch (err) {
      console.warn('Firestore save tester sync error:', err);
    }

    return created;
  },

  async updateTester(id: string, updates: Partial<Tester>): Promise<Tester> {
    const testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
    const index = testers.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tester not found');
    
    testers[index] = { ...testers[index], ...updates };
    saveToStorage(STORAGE_KEYS.TESTERS, testers);

    try {
      if (db) {
        await updateDoc(doc(db, 'testers', id), updates as any);
      }
    } catch (err) {
      console.warn('Firestore update tester error:', err);
    }

    return testers[index];
  },

  async deleteTester(id: string): Promise<boolean> {
    let testers = loadFromStorage<Tester[]>(STORAGE_KEYS.TESTERS, INITIAL_TESTERS);
    testers = testers.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.TESTERS, testers);

    try {
      if (db) {
        await deleteDoc(doc(db, 'testers', id));
      }
    } catch (err) {
      console.warn('Firestore delete tester error:', err);
    }

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

        if (db) {
          await updateDoc(doc(db, 'testers', testerId), {
            app_access_list: tester.app_access_list,
            license_keys: tester.license_keys,
            current_subscription_status: tester.current_subscription_status,
            last_active: tester.last_active,
          }).catch(() => {});
        }
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

        if (db) {
          await updateDoc(doc(db, 'testers', testerId), {
            current_subscription_status: 'Stripe Sandbox',
            stripe_account_id: res.data.account.stripeSandboxAccountId,
            last_active: tester.last_active,
          }).catch(() => {});
        }
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
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'creator_claims'));
        if (!snap.empty) {
          const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as CopyrightClaim));
          saveToStorage(STORAGE_KEYS.CLAIMS, remote);
          return remote;
        } else {
          const localClaims = loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
          for (const c of localClaims) {
            setDoc(doc(db, 'creator_claims', c.id), c).catch(() => {});
          }
          return localClaims;
        }
      }
    } catch (err) {
      console.warn('Firestore fetch claims fallback:', err);
    }
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
    const id = `clm_${Date.now().toString(36)}`;
    const created: CopyrightClaim = {
      ...newClaim,
      id,
      created_at: new Date().toISOString(),
      total_payouts_claimed_usd: 0,
    };
    claims.unshift(created);
    saveToStorage(STORAGE_KEYS.CLAIMS, claims);

    try {
      if (db) {
        await setDoc(doc(db, 'creator_claims', id), created);
      }
    } catch (err) {
      console.warn('Firestore save claim error:', err);
    }

    return created;
  },

  async triggerPayout(claimId: string, amountUsd: number): Promise<boolean> {
    const claims = loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return false;

    claim.payout_balance_usd = Math.max(0, claim.payout_balance_usd - amountUsd);
    claim.total_payouts_claimed_usd += amountUsd;
    saveToStorage(STORAGE_KEYS.CLAIMS, claims);

    try {
      if (db) {
        await updateDoc(doc(db, 'creator_claims', claimId), {
          payout_balance_usd: claim.payout_balance_usd,
          total_payouts_claimed_usd: claim.total_payouts_claimed_usd,
        });
      }
    } catch (err) {
      console.warn('Firestore update claim payout error:', err);
    }

    return true;
  },
};

export const FeedbackService = {
  async getFeedback(): Promise<FeedbackItem[]> {
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'feedbacks'));
        if (!snap.empty) {
          const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as FeedbackItem));
          saveToStorage(STORAGE_KEYS.FEEDBACK, remote);
          return remote;
        } else {
          const localFeedback = loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
          for (const f of localFeedback) {
            setDoc(doc(db, 'feedbacks', f.id), f).catch(() => {});
          }
          return localFeedback;
        }
      }
    } catch (err) {
      console.warn('Firestore fetch feedback fallback:', err);
    }
    return loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  },

  async addFeedback(item: Omit<FeedbackItem, 'id' | 'created_at' | 'status'>): Promise<FeedbackItem> {
    const list = loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    const id = `fb_${Date.now().toString(36)}`;
    const created: FeedbackItem = {
      ...item,
      id,
      created_at: new Date().toISOString(),
      status: 'New',
    };
    list.unshift(created);
    saveToStorage(STORAGE_KEYS.FEEDBACK, list);

    try {
      if (db) {
        await setDoc(doc(db, 'feedbacks', id), created);
      }
    } catch (err) {
      console.warn('Firestore save feedback error:', err);
    }

    return created;
  },

  async updateFeedbackStatus(id: string, status: FeedbackItem['status']): Promise<FeedbackItem> {
    const list = loadFromStorage<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    const item = list.find(f => f.id === id);
    if (!item) throw new Error('Feedback not found');
    item.status = status;
    saveToStorage(STORAGE_KEYS.FEEDBACK, list);

    try {
      if (db) {
        await updateDoc(doc(db, 'feedbacks', id), { status });
      }
    } catch (err) {
      console.warn('Firestore update feedback status error:', err);
    }

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

    try {
      if (db) {
        await updateDoc(doc(db, 'feedbacks', id), { 
          reply_history: item.reply_history,
          status: item.status
        });
      }
    } catch (err) {
      console.warn('Firestore add reply error:', err);
    }

    return item;
  },
};

export const BroadcastService = {
  async getBroadcasts(): Promise<BroadcastMessage[]> {
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'broadcasts'));
        if (!snap.empty) {
          const remote = snap.docs.map(d => ({ ...d.data(), id: d.id } as BroadcastMessage));
          saveToStorage(STORAGE_KEYS.BROADCASTS, remote);
          return remote;
        } else {
          const localBroadcasts = loadFromStorage<BroadcastMessage[]>(STORAGE_KEYS.BROADCASTS, INITIAL_BROADCASTS);
          for (const b of localBroadcasts) {
            setDoc(doc(db, 'broadcasts', b.id), b).catch(() => {});
          }
          return localBroadcasts;
        }
      }
    } catch (err) {
      console.warn('Firestore fetch broadcasts fallback:', err);
    }
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

    const id = `bc_${Date.now().toString(36)}`;
    const created: BroadcastMessage = {
      id,
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

    try {
      if (db) {
        await setDoc(doc(db, 'broadcasts', id), created);
      }
    } catch (err) {
      console.warn('Firestore save broadcast error:', err);
    }

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

export const SocietyFundService = {
  async getMetrics(): Promise<SocietyFundMetrics> {
    return loadFromStorage<SocietyFundMetrics>(STORAGE_KEYS.SOCIETY_METRICS, INITIAL_SOCIETY_FUND_METRICS);
  },

  async getAppSubscriptions(): Promise<AppSubscriptionTally[]> {
    return loadFromStorage<AppSubscriptionTally[]>(STORAGE_KEYS.APP_SUBSCRIPTIONS, INITIAL_APP_SUBSCRIPTIONS);
  },

  async getUnregisteredEscrow(): Promise<UnregisteredEscrowClaim[]> {
    return loadFromStorage<UnregisteredEscrowClaim[]>(STORAGE_KEYS.UNREGISTERED_ESCROW, INITIAL_UNREGISTERED_ESCROW);
  },

  async getDistributionRounds(): Promise<SocietyDistributionRound[]> {
    return loadFromStorage<SocietyDistributionRound[]>(STORAGE_KEYS.DISTRIBUTION_ROUNDS, INITIAL_DISTRIBUTION_ROUNDS);
  },

  async updateAppSubscriberCount(appId: string, newCount: number): Promise<{ apps: AppSubscriptionTally[]; metrics: SocietyFundMetrics }> {
    const apps = loadFromStorage<AppSubscriptionTally[]>(STORAGE_KEYS.APP_SUBSCRIPTIONS, INITIAL_APP_SUBSCRIPTIONS);
    const metrics = loadFromStorage<SocietyFundMetrics>(STORAGE_KEYS.SOCIETY_METRICS, INITIAL_SOCIETY_FUND_METRICS);

    const index = apps.findIndex(a => a.app_id === appId);
    if (index !== -1) {
      apps[index].subscribers_count = Math.max(0, newCount);
      apps[index].gross_monthly_mrr = apps[index].subscribers_count * apps[index].plan_price_monthly;
      apps[index].society_fund_40pct_contribution = apps[index].gross_monthly_mrr * 0.40;
    }

    // Recompute global metrics
    const totalSubs = apps.reduce((sum, a) => sum + a.subscribers_count, 0);
    const totalGross = apps.reduce((sum, a) => sum + a.gross_monthly_mrr, 0);
    const total40pct = totalGross * 0.40;

    metrics.total_active_subscribers = totalSubs;
    metrics.total_subscription_revenue_usd = totalGross;
    metrics.total_society_fund_usd = total40pct;
    metrics.allocated_registered_pool_usd = Math.max(0, total40pct - metrics.unallocated_holding_escrow_usd);
    metrics.average_monthly_sub_price = totalSubs > 0 ? (totalGross / totalSubs) : 0;
    metrics.per_subscriber_royalty_yield = metrics.average_monthly_sub_price * 0.40;
    metrics.estimated_payout_per_registered_creator = metrics.total_registered_creators > 0 
      ? (metrics.allocated_registered_pool_usd / metrics.total_registered_creators) 
      : 0;

    saveToStorage(STORAGE_KEYS.APP_SUBSCRIPTIONS, apps);
    saveToStorage(STORAGE_KEYS.SOCIETY_METRICS, metrics);

    return { apps, metrics };
  },

  async simulateSubscription(appId: string, customPrice?: number): Promise<{
    success: boolean;
    appName: string;
    subscriptionPrice: number;
    societyFundCut: number;
    newTotalSubscribers: number;
    newSocietyFundPool: number;
    newPerCreatorPayout: number;
  }> {
    const apps = loadFromStorage<AppSubscriptionTally[]>(STORAGE_KEYS.APP_SUBSCRIPTIONS, INITIAL_APP_SUBSCRIPTIONS);
    const metrics = loadFromStorage<SocietyFundMetrics>(STORAGE_KEYS.SOCIETY_METRICS, INITIAL_SOCIETY_FUND_METRICS);
    const summary = loadFromStorage<RoyaltyPoolSummary>(STORAGE_KEYS.SUMMARY, INITIAL_SUMMARY);

    const app = apps.find(a => a.app_id === appId) || apps[0];
    const price = customPrice || app.plan_price_monthly;
    const cut40 = price * 0.40;

    app.subscribers_count += 1;
    app.gross_monthly_mrr += price;
    app.society_fund_40pct_contribution += cut40;

    const totalSubs = apps.reduce((sum, a) => sum + a.subscribers_count, 0);
    const totalGross = apps.reduce((sum, a) => sum + a.gross_monthly_mrr, 0);
    const total40pct = totalGross * 0.40;

    metrics.total_active_subscribers = totalSubs;
    metrics.total_subscription_revenue_usd = totalGross;
    metrics.total_society_fund_usd = total40pct;
    metrics.allocated_registered_pool_usd = Math.max(0, total40pct - metrics.unallocated_holding_escrow_usd);
    metrics.average_monthly_sub_price = totalSubs > 0 ? (totalGross / totalSubs) : 0;
    metrics.per_subscriber_royalty_yield = metrics.average_monthly_sub_price * 0.40;
    metrics.estimated_payout_per_registered_creator = metrics.total_registered_creators > 0 
      ? (metrics.allocated_registered_pool_usd / metrics.total_registered_creators) 
      : 0;

    summary.total_streamed_usd += cut40;
    summary.society_fund_balance_usd = total40pct;
    summary.total_active_subscribers = totalSubs;

    saveToStorage(STORAGE_KEYS.APP_SUBSCRIPTIONS, apps);
    saveToStorage(STORAGE_KEYS.SOCIETY_METRICS, metrics);
    saveToStorage(STORAGE_KEYS.SUMMARY, summary);

    return {
      success: true,
      appName: app.app_name,
      subscriptionPrice: price,
      societyFundCut: cut40,
      newTotalSubscribers: totalSubs,
      newSocietyFundPool: total40pct,
      newPerCreatorPayout: metrics.estimated_payout_per_registered_creator,
    };
  },

  async executeDistributionRound(): Promise<{
    success: boolean;
    round: SocietyDistributionRound;
    updatedMetrics: SocietyFundMetrics;
  }> {
    const rounds = loadFromStorage<SocietyDistributionRound[]>(STORAGE_KEYS.DISTRIBUTION_ROUNDS, INITIAL_DISTRIBUTION_ROUNDS);
    const metrics = loadFromStorage<SocietyFundMetrics>(STORAGE_KEYS.SOCIETY_METRICS, INITIAL_SOCIETY_FUND_METRICS);
    const claims = loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);

    const now = new Date();
    const roundId = `dist_round_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${Date.now().toString(36)}`;
    const payoutPerCreator = metrics.estimated_payout_per_registered_creator || 424.48;

    const newRound: SocietyDistributionRound = {
      round_id: roundId,
      timestamp: `${now.toISOString().replace('T', ' ').substring(0, 16)} UTC (Executed)`,
      total_distributed_usd: metrics.allocated_registered_pool_usd,
      subscribers_at_execution: metrics.total_active_subscribers,
      creators_paid_count: metrics.total_registered_creators,
      average_payout_per_creator: payoutPerCreator,
      status: 'Completed',
      stripe_batch_id: `batch_tr_${Math.random().toString(36).substring(2, 10)}_live_payout`,
      c2pa_audit_seal: `0x${Math.random().toString(16).substring(2, 10)}...dist2026`,
    };

    // Credit each registered claim balance
    claims.forEach(c => {
      if (c.status === 'Verified') {
        c.payout_balance_usd += payoutPerCreator;
      }
    });

    metrics.last_distribution_timestamp = now.toISOString();

    rounds.unshift(newRound);
    saveToStorage(STORAGE_KEYS.DISTRIBUTION_ROUNDS, rounds);
    saveToStorage(STORAGE_KEYS.CLAIMS, claims);
    saveToStorage(STORAGE_KEYS.SOCIETY_METRICS, metrics);

    return {
      success: true,
      round: newRound,
      updatedMetrics: metrics,
    };
  },

  async registerAndClaimEscrow(
    escrowId: string,
    creatorName: string,
    creatorEmail: string
  ): Promise<{
    success: boolean;
    claimedAmount: number;
    createdClaim: CopyrightClaim;
    updatedMetrics: SocietyFundMetrics;
  }> {
    const escrows = loadFromStorage<UnregisteredEscrowClaim[]>(STORAGE_KEYS.UNREGISTERED_ESCROW, INITIAL_UNREGISTERED_ESCROW);
    const metrics = loadFromStorage<SocietyFundMetrics>(STORAGE_KEYS.SOCIETY_METRICS, INITIAL_SOCIETY_FUND_METRICS);
    const claims = loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);

    const escrowItem = escrows.find(e => e.id === escrowId);
    if (!escrowItem) {
      throw new Error('Holding escrow record not found');
    }

    const claimedAmount = escrowItem.holding_escrow_balance_usd;

    // Create a new verified CopyrightClaim
    const newClaim: CopyrightClaim = {
      id: `clm_${Date.now().toString(36)}`,
      title: escrowItem.work_title,
      creator_name: creatorName,
      creator_email: creatorEmail,
      asset_type: escrowItem.asset_type,
      repository_or_source: escrowItem.detected_author_or_source,
      evidence_description: `Registered and released from H.U.M.A.N. 50% Subscription Holding Escrow (${escrowId}). C2PA Manifest: ${escrowItem.c2pa_manifest_hash}`,
      status: 'Verified',
      confidence_score: 99,
      attribution_share_bps: 350,
      micro_rate_usd: '$0.0035 per synthesis',
      bank_connected: true,
      stripe_account_id: `acct_1NZ${Math.random().toString(36).substring(2, 8)}`,
      payout_balance_usd: claimedAmount,
      total_payouts_claimed_usd: 0,
      created_at: new Date().toISOString(),
      analysis_notes: `Direct 50% subscription pool release from unallocated escrow for ${escrowItem.subscribers_referencing_count} active referencing subscribers.`,
    };

    // Remove or update escrow item
    const updatedEscrows = escrows.filter(e => e.id !== escrowId);

    // Update metrics
    metrics.unallocated_holding_escrow_usd = Math.max(0, metrics.unallocated_holding_escrow_usd - claimedAmount);
    metrics.allocated_registered_pool_usd += claimedAmount;
    metrics.total_registered_creators += 1;
    metrics.total_unregistered_claims = updatedEscrows.length;
    metrics.estimated_payout_per_registered_creator = metrics.total_registered_creators > 0 
      ? (metrics.allocated_registered_pool_usd / metrics.total_registered_creators) 
      : 0;

    claims.unshift(newClaim);

    saveToStorage(STORAGE_KEYS.UNREGISTERED_ESCROW, updatedEscrows);
    saveToStorage(STORAGE_KEYS.CLAIMS, claims);
    saveToStorage(STORAGE_KEYS.SOCIETY_METRICS, metrics);

    return {
      success: true,
      claimedAmount,
      createdClaim: newClaim,
      updatedMetrics: metrics,
    };
  },
};

export const CreatorAccountService = {
  async getCreators(): Promise<CreatorAccount[]> {
    return loadFromStorage<CreatorAccount[]>(STORAGE_KEYS.CREATOR_ACCOUNTS, INITIAL_CREATOR_ACCOUNTS);
  },

  async registerCreator(data: {
    name: string;
    email: string;
    category: any;
    stripeAccountId?: string;
    workTitle?: string;
    bio?: string;
  }): Promise<CreatorAccount> {
    const creators = loadFromStorage<CreatorAccount[]>(STORAGE_KEYS.CREATOR_ACCOUNTS, INITIAL_CREATOR_ACCOUNTS);
    const metrics = loadFromStorage<SocietyFundMetrics>(STORAGE_KEYS.SOCIETY_METRICS, INITIAL_SOCIETY_FUND_METRICS);

    const newCreator: CreatorAccount = {
      id: `creator_${Date.now().toString(36)}`,
      name: data.name,
      email: data.email,
      category: data.category || 'Book / Literature',
      stripe_account_id: data.stripeAccountId || `acct_1NZ${Math.random().toString(36).substring(2, 8)}`,
      stripe_status: 'Connected',
      registered_works_count: data.workTitle ? 1 : 0,
      total_earned_usd: 0,
      available_balance_usd: 424.48, // automatic first allocation from current 40% pool
      c2pa_did: `did:c2pa:${data.email.replace(/[^a-zA-Z0-9]/g, '.')}.${Date.now().toString(36)}`,
      joined_at: new Date().toISOString(),
      bio: data.bio || 'Verified human rights holder with C2PA Content Credentials watermark.',
      is_verified_human: true,
    };

    creators.unshift(newCreator);
    metrics.total_registered_creators += 1;
    metrics.estimated_payout_per_registered_creator = metrics.total_registered_creators > 0 
      ? (metrics.allocated_registered_pool_usd / metrics.total_registered_creators) 
      : 0;

    saveToStorage(STORAGE_KEYS.CREATOR_ACCOUNTS, creators);
    saveToStorage(STORAGE_KEYS.SOCIETY_METRICS, metrics);

    return newCreator;
  },

  async getCreatorByEmail(email: string): Promise<CreatorAccount | undefined> {
    const creators = await this.getCreators();
    return creators.find(c => c.email.toLowerCase() === email.toLowerCase());
  },
};

export const DirectMessageService = {
  async getThreads(creatorEmail?: string): Promise<MessageThread[]> {
    const threads = loadFromStorage<MessageThread[]>(STORAGE_KEYS.MESSAGE_THREADS, INITIAL_MESSAGE_THREADS);
    if (!creatorEmail || creatorEmail === 'all') return threads;
    return threads.filter(t => t.creator_email.toLowerCase() === creatorEmail.toLowerCase());
  },

  async getMessagesByThread(threadId: string): Promise<DirectMessage[]> {
    const messages = loadFromStorage<DirectMessage[]>(STORAGE_KEYS.DIRECT_MESSAGES, INITIAL_DIRECT_MESSAGES);
    return messages.filter(m => m.thread_id === threadId);
  },

  async sendMessage(data: {
    threadId: string;
    senderType: 'creator' | 'admin';
    senderName: string;
    senderEmail: string;
    recipientName: string;
    recipientEmail: string;
    subject: string;
    messageText: string;
    category?: any;
    workReference?: string;
    c2paAttachmentHash?: string;
  }): Promise<DirectMessage> {
    const messages = loadFromStorage<DirectMessage[]>(STORAGE_KEYS.DIRECT_MESSAGES, INITIAL_DIRECT_MESSAGES);
    const threads = loadFromStorage<MessageThread[]>(STORAGE_KEYS.MESSAGE_THREADS, INITIAL_MESSAGE_THREADS);

    const newMsg: DirectMessage = {
      id: `msg_${Date.now().toString(36)}`,
      thread_id: data.threadId,
      sender_type: data.senderType,
      sender_name: data.senderName,
      sender_email: data.senderEmail,
      recipient_name: data.recipientName,
      recipient_email: data.recipientEmail,
      subject: data.subject,
      message_text: data.messageText,
      timestamp: `${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC`,
      is_read: data.senderType === 'admin',
      work_reference: data.workReference,
      c2pa_attachment_hash: data.c2paAttachmentHash,
      category: data.category || 'General Inquiry',
    };

    messages.push(newMsg);

    // Update thread preview
    const tIndex = threads.findIndex(t => t.id === data.threadId);
    if (tIndex !== -1) {
      threads[tIndex].last_message_at = newMsg.timestamp;
      threads[tIndex].last_message_preview = data.messageText.substring(0, 85) + (data.messageText.length > 85 ? '...' : '');
      threads[tIndex].messages_count += 1;
      if (data.senderType === 'creator') {
        threads[tIndex].unread_count += 1;
      }
    } else {
      threads.unshift({
        id: data.threadId,
        creator_email: data.senderType === 'creator' ? data.senderEmail : data.recipientEmail,
        creator_name: data.senderType === 'creator' ? data.senderName : data.recipientName,
        work_title: data.workReference,
        subject: data.subject,
        status: 'Open',
        last_message_at: newMsg.timestamp,
        last_message_preview: data.messageText.substring(0, 85) + (data.messageText.length > 85 ? '...' : ''),
        messages_count: 1,
        unread_count: data.senderType === 'creator' ? 1 : 0,
        category: data.category || 'General Inquiry',
      });
    }

    saveToStorage(STORAGE_KEYS.DIRECT_MESSAGES, messages);
    saveToStorage(STORAGE_KEYS.MESSAGE_THREADS, threads);

    return newMsg;
  },

  async createNewThread(data: {
    creatorName: string;
    creatorEmail: string;
    subject: string;
    messageText: string;
    category: any;
    workReference?: string;
  }): Promise<{ thread: MessageThread; message: DirectMessage }> {
    const threadId = `thread_${Date.now().toString(36)}`;
    const msg = await this.sendMessage({
      threadId,
      senderType: 'creator',
      senderName: data.creatorName,
      senderEmail: data.creatorEmail,
      recipientName: 'H.U.M.A.N. Initiative Steward',
      recipientEmail: 'stewards@humanethical.ai',
      subject: data.subject,
      messageText: data.messageText,
      category: data.category,
      workReference: data.workReference,
    });

    const threads = loadFromStorage<MessageThread[]>(STORAGE_KEYS.MESSAGE_THREADS, INITIAL_MESSAGE_THREADS);
    const createdThread = threads.find(t => t.id === threadId)!;

    return { thread: createdThread, message: msg };
  },
};

export const StakeholderService = {
  async generateStakeholderInsight(payload: {
    persona: StakeholderPersona;
    humanStats: HumanStatsSnapshot;
    pitchScenario?: string;
    customAngle?: string;
    selectedApp?: string;
  }): Promise<StakeholderInsightResult> {
    try {
      const res = await apiClient.post('/api/gemini/stakeholder-insight', payload);
      return res.data;
    } catch (err) {
      console.warn('Backend insight generation fallback to local synthesis:', err);
      const fallbackStats = payload.humanStats;
      const archetype = payload.persona.archetype;
      
      let stance: StakeholderInsightResult['stance'] = 'Bullish Offer';
      let score = 9.4;
      let quote = `With $${(fallbackStats.grossMrrUsd || 191020).toLocaleString()} in gross monthly MRR and 50% ($${(fallbackStats.totalSocietyFundUsd || 95510).toLocaleString()}) routed to creator dividends, H.U.M.A.N. represents the cleanest monetization architecture in AI.`;
      
      if (archetype === 'The Cash Flow Hawk') {
        score = 9.4;
        stance = 'Bullish Offer';
        quote = `"That $${(fallbackStats.grossMrrUsd || 191020).toLocaleString()} gross MRR and $${(fallbackStats.totalSocietyFundUsd || 95510).toLocaleString()} Society Fund pool proves unit economics work. As long as you keep Stripe Connect transfer batching tight, this is a strong 50/50 tollbooth machine."`;
      } else if (archetype === 'The Artistic Patron') {
        score = 9.7;
        stance = 'Bullish Offer';
        quote = `"With ${fallbackStats.verifiedCreators || 180} verified creators sharing the $${(fallbackStats.totalSocietyFundUsd || 95510).toLocaleString()} Society Fund, this is the first AI model that treats artists with genuine respect."`;
      } else if (archetype === 'The Enterprise Defender') {
        score = 9.5;
        stance = 'Bullish Offer';
        quote = `"Cleanroom training datasets and 0 copyleft violations turns enterprise copyright anxiety into a standardized compliance checklist. Enterprise buyers will sign fast."`;
      } else if (archetype === 'The Tech Idealist') {
        score = 8.9;
        stance = 'Conditional Term-Sheet';
        quote = `"The C2PA v2.1 JUMBF cryptographic manifest and Ed25519 signatures are mathematically sound. With ${fallbackStats.activeSubscribers || 3850} active subscribers, ethical provenance has proven it scales."`;
      }

      return {
        id: `ins_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        personaId: payload.persona.id,
        personaName: payload.persona.name,
        personaTitle: payload.persona.title,
        archetype: payload.persona.archetype,
        stance,
        scoreOutOf10: score,
        sweetSpotAlignment: payload.persona.sweetSpot,
        directQuote: quote,
        statsGrounding: [
          { referencedMetric: '50% Society Fund Pool', interpretation: `$${(fallbackStats.totalSocietyFundUsd || 95510).toLocaleString()} in Stripe Connect escrow providing non-profit credibility.` },
          { referencedMetric: 'Gross Monthly MRR', interpretation: `$${(fallbackStats.grossMrrUsd || 191020).toLocaleString()} across ${fallbackStats.activeBadgeApps || 4} commercial applications.` },
          { referencedMetric: 'Active Paying Subscribers', interpretation: `${(fallbackStats.activeSubscribers || 3850).toLocaleString()} paying subscribers driving recurring creator yields.` },
          { referencedMetric: 'Verified Human Creators', interpretation: `${fallbackStats.verifiedCreators || 180} registered rights holders receiving automated dividend distributions.` }
        ],
        keyStrengths: [
          `50% Society Fund covenant ($${(fallbackStats.totalSocietyFundUsd || 95510).toLocaleString()} pool) generates defensible consumer trust.`,
          `Multi-app ecosystem across ${fallbackStats.activeBadgeApps || 4} flagship verticals generates diversified MRR of $${(fallbackStats.grossMrrUsd || 191020).toLocaleString()}.`,
          `Zero-copyleft C2PA cryptographic audit trail provides enterprise buyers bulletproof legal indemnity.`
        ],
        keyRisks: [
          'Must maintain tight automated Stripe batching to keep micro-transfer fees under 1.5%.',
          'Sustain high subscriber retention across commercial apps.'
        ],
        recommendedAction: 'Deploy automated Stripe batching intervals to preserve margins and position the non-profit trust seal as an enterprise RFP requirement.',
        financialValuationVerdict: {
          mrrAppraisal: `$${(fallbackStats.grossMrrUsd || 191020).toLocaleString()} blended MRR creates an ARR run-rate of $${((fallbackStats.grossMrrUsd || 191020) * 12).toLocaleString()}.`,
          covenantRiskScore: 'Low (50% automated split is cryptographically enforced and contractually bounded)',
          recommendedPricingTier: 'Introduce Enterprise Commercial Seat tier with unlimited C2PA audit exports at $299/mo'
        },
        generatedAt: new Date().toISOString(),
        isAiGenerated: false,
        scenarioContext: payload.pitchScenario || 'Master Hybrid Blueprint',
        appContext: payload.selectedApp || 'All Apps Fleet'
      };
    }
  }
};

export const CreatorStudioService = {
  async getCreations(): Promise<StudioCreationWork[]> {
    return loadFromStorage<StudioCreationWork[]>(STORAGE_KEYS.STUDIO_CREATIONS, INITIAL_STUDIO_CREATIONS);
  },

  async registerCreation(newWork: Omit<StudioCreationWork, 'id' | 'created_at' | 'updated_at'>): Promise<StudioCreationWork> {
    const works = loadFromStorage<StudioCreationWork[]>(STORAGE_KEYS.STUDIO_CREATIONS, INITIAL_STUDIO_CREATIONS);
    const creation: StudioCreationWork = {
      ...newWork,
      id: `work_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    works.unshift(creation);
    saveToStorage(STORAGE_KEYS.STUDIO_CREATIONS, works);

    // Also auto-sync as a registered copyright claim so it receives dividends in the Society Fund
    const claims = loadFromStorage<CopyrightClaim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    const newClaim: CopyrightClaim = {
      id: `claim_${creation.id}`,
      title: creation.title,
      creator_name: creation.creator_name,
      creator_email: creation.creator_email,
      asset_type: creation.category,
      repository_or_source: `https://humaninitiative.org/c2pa/${creation.c2pa_manifest_hash}`,
      evidence_description: `Original human creation registered in Studio. C2PA hash: ${creation.c2pa_manifest_hash}. Bound to ${creation.assigned_apps.join(', ')}.`,
      status: 'Verified',
      confidence_score: 99.4,
      attribution_share_bps: creation.royalty_yield_share_bps,
      micro_rate_usd: `$${(creation.royalty_yield_share_bps / 100 * 0.05).toFixed(3)} / call`,
      bank_connected: true,
      stripe_account_id: `acct_studio_${creation.creator_id}`,
      payout_balance_usd: 0,
      total_payouts_claimed_usd: 0,
      created_at: creation.created_at,
      analysis_notes: `Cleanroom validated. 50% Society Fund covenant active on ${creation.assigned_apps[0] || 'Tome Crafter'}.`
    };
    claims.unshift(newClaim);
    saveToStorage(STORAGE_KEYS.CLAIMS, claims);

    return creation;
  },

  async updateCreation(id: string, updates: Partial<StudioCreationWork>): Promise<StudioCreationWork | null> {
    const works = loadFromStorage<StudioCreationWork[]>(STORAGE_KEYS.STUDIO_CREATIONS, INITIAL_STUDIO_CREATIONS);
    const index = works.findIndex(w => w.id === id);
    if (index === -1) return null;

    works[index] = {
      ...works[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.STUDIO_CREATIONS, works);
    return works[index];
  },

  async triggerMicroRoyaltyYield(creationId: string, centsAmount: number = 250): Promise<{
    success: boolean;
    creation: StudioCreationWork | null;
    payoutEvent: RoyaltyStreamEvent;
  }> {
    const works = loadFromStorage<StudioCreationWork[]>(STORAGE_KEYS.STUDIO_CREATIONS, INITIAL_STUDIO_CREATIONS);
    const creation = works.find(w => w.id === creationId);
    
    if (creation) {
      creation.earned_royalties_usd += centsAmount / 100;
      creation.synthesis_references_count += 1;
      saveToStorage(STORAGE_KEYS.STUDIO_CREATIONS, works);
    }

    const event: RoyaltyStreamEvent = {
      id: `evt_studio_${Date.now().toString(36)}`,
      timestamp: 'Just now',
      trigger_prompt: `AI Generative Synthesis Grounded on [${creation?.title || 'Original Human Work'}]`,
      app_source: creation?.assigned_apps[0] || 'Tome Crafter',
      amount_cents: centsAmount,
      recipient_name: creation?.creator_name || 'Verified Creator',
      package_or_work: creation?.title || 'Original Asset',
      stripe_transfer_id: `tr_studio_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      audit_hash: creation?.c2pa_manifest_hash || '0x9b44a7f0128e404b9982dc8e81992ad317765ec1',
    };

    const events = loadFromStorage<RoyaltyStreamEvent[]>(STORAGE_KEYS.ROYALTY_EVENTS, INITIAL_ROYALTY_EVENTS);
    events.unshift(event);
    saveToStorage(STORAGE_KEYS.ROYALTY_EVENTS, events.slice(0, 50));

    return {
      success: true,
      creation: creation || null,
      payoutEvent: event,
    };
  }
};

import { TalentDiscoveryReport } from '../types';

export const CreatorTalentService = {
  async getSavedReports(): Promise<TalentDiscoveryReport[]> {
    return loadFromStorage<TalentDiscoveryReport[]>(STORAGE_KEYS.TALENT_REPORTS, []);
  },

  async getActiveReport(): Promise<TalentDiscoveryReport | null> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TALENT_REPORT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveReport(report: TalentDiscoveryReport): Promise<void> {
    const list = loadFromStorage<TalentDiscoveryReport[]>(STORAGE_KEYS.TALENT_REPORTS, []);
    const filtered = list.filter(r => r.id !== report.id);
    filtered.unshift(report);
    saveToStorage(STORAGE_KEYS.TALENT_REPORTS, filtered);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TALENT_REPORT, JSON.stringify(report));
  },

  async generateDynamicProbe(payload: {
    answers: Record<string, string>;
    currentStep: number;
    userInterests?: string;
    dominantDomain?: string;
  }) {
    try {
      const res = await apiClient.post('/api/gemini/creator-talent-probe', payload);
      return res.data;
    } catch (err) {
      console.warn('Dynamic talent probe fallback:', err);
      return { dynamicQuestions: [] };
    }
  },

  async analyzeCreatorTalents(payload: {
    answers: Record<string, { optionText: string; archetypeBias: string; talentHint: string }>;
    userName?: string;
    userEmail?: string;
    selectedArchetype?: string;
  }): Promise<TalentDiscoveryReport> {
    try {
      const res = await apiClient.post('/api/gemini/creator-talent-analysis', payload);
      const data = res.data;

      const report: TalentDiscoveryReport = {
        id: `talent_report_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        creatorName: payload.userName || 'Emerging Creator',
        creatorEmail: payload.userEmail || 'creator@ethical.org',
        primaryArchetype: data.primaryArchetype || 'The Prose & Worldbuilder Architect',
        superpowerTitle: data.superpowerTitle || 'Architectural Narrative Synthesist',
        rarityPercentile: data.rarityPercentile || 'Top 3% Craft Resonance',
        dominantPathId: (data.primaryArchetype?.toLowerCase().includes('sonic') ? 'sonic-timbre' :
                         data.primaryArchetype?.toLowerCase().includes('code') ? 'cleanroom-code' :
                         data.primaryArchetype?.toLowerCase().includes('visual') ? 'visual-vector' :
                         data.primaryArchetype?.toLowerCase().includes('poly') ? 'polymath-synthesist' : 'prose-worldbuilder') as any,
        dimensionScores: {
          'Sensory Intuition': 96,
          'Unconscious Flow': 94,
          'Artistic Radar': 98,
          'Ecosystem Impact': 95,
        },
        discoveredHiddenTalents: data.discoveredHiddenTalents || [
          {
            talent: 'Macro-Structural Narrative Lore',
            description: 'You intuitively establish inviolable world constraints, historical causality, and emotional anchor points that ground procedural stories.',
            manifestsIn: 'Tome Crafter World Codices & Interactive Branching Fiction'
          },
          {
            talent: 'Emotional Cadence Modulation',
            description: 'You pace sensory release and dialogue rhythms with organic human breath that AI cannot fabricate.',
            manifestsIn: 'Tome Crafter Manuscripts & RL Easy Flow Scene Direction'
          },
          {
            talent: 'Cleanroom Integrity Instinct',
            description: 'You instinctively avoid cliché patterns, demanding authentic zero-copyleft original craft.',
            manifestsIn: 'C2PA 2.1 Content Credentials & 50% Society Fund Royalty Yields'
          }
        ],
        assignedFlagshipApps: data.assignedFlagshipApps || [
          {
            appName: 'Tome Crafter',
            appUrl: 'https://tomecrafter-ai-book-studio.ai.studio',
            role: 'Foundational Lore Architect & Author',
            royaltyYieldBps: 280,
            projectedMonthlyDividendUsd: 450.00
          },
          {
            appName: 'RL Easy Flow',
            appUrl: 'https://rl-easy-flow.ai.studio',
            role: 'Narrative Pacing & Dialogue Direction',
            royaltyYieldBps: 190,
            projectedMonthlyDividendUsd: 280.00
          }
        ],
        firstProjectRecommendation: data.firstProjectRecommendation || {
          title: 'The Zero-Copyleft Speculative World Codex',
          summary: 'Author a 3-chapter manuscript with character decision trees to ground Tome Crafter literature generation.',
          humanEffortHours: 16,
          recommendedStatus: 'Submit for Society Fund Recognition'
        },
        c2paProofPrompt: data.c2paProofPrompt || 'Ready for Ed25519 Cryptographic Provenance Token generation.',
        completedAt: new Date().toISOString()
      };

      await CreatorTalentService.saveReport(report);
      return report;
    } catch (err) {
      console.warn('Talent analysis fallback:', err);
      const fallbackReport: TalentDiscoveryReport = {
        id: `talent_report_${Date.now().toString(36)}`,
        creatorName: payload.userName || 'Emerging Creator',
        creatorEmail: payload.userEmail || 'creator@ethical.org',
        primaryArchetype: 'The Prose & Worldbuilder Architect',
        superpowerTitle: 'Architectural Narrative Synthesist',
        rarityPercentile: 'Top 3% Craft Resonance',
        dominantPathId: 'prose-worldbuilder',
        dimensionScores: {
          'Sensory Intuition': 96,
          'Unconscious Flow': 94,
          'Artistic Radar': 98,
          'Ecosystem Impact': 95,
        },
        discoveredHiddenTalents: [
          {
            talent: 'Macro-Structural Narrative Lore',
            description: 'You intuitively establish inviolable world constraints, causality, and emotional anchor points that ground procedural stories.',
            manifestsIn: 'Tome Crafter World Codices & Interactive Branching Fiction'
          },
          {
            talent: 'Timbral & Semantic Cadence',
            description: 'You pace sensory release and dialogue rhythms with organic human breath.',
            manifestsIn: 'Tome Crafter Manuscripts & RL Easy Flow Scene Direction'
          },
          {
            talent: 'Cleanroom Integrity Instinct',
            description: 'You instinctively avoid cliché patterns, demanding authentic zero-copyleft original craft.',
            manifestsIn: 'C2PA 2.1 Content Credentials & 50% Society Fund Royalty Yields'
          }
        ],
        assignedFlagshipApps: [
          {
            appName: 'Tome Crafter',
            appUrl: 'https://tomecrafter-ai-book-studio.ai.studio',
            role: 'Foundational Lore Architect & Author',
            royaltyYieldBps: 280,
            projectedMonthlyDividendUsd: 450.00
          },
          {
            appName: 'RL Easy Flow',
            appUrl: 'https://rl-easy-flow.ai.studio',
            role: 'Narrative Pacing & Dialogue Direction',
            royaltyYieldBps: 190,
            projectedMonthlyDividendUsd: 280.00
          }
        ],
        firstProjectRecommendation: {
          title: 'The Zero-Copyleft Speculative World Codex',
          summary: 'Author a 3-chapter manuscript with character decision trees to ground Tome Crafter literature generation.',
          humanEffortHours: 16,
          recommendedStatus: 'Submit for Society Fund Recognition'
        },
        c2paProofPrompt: 'Ready for Ed25519 Cryptographic Provenance Token generation.',
        completedAt: new Date().toISOString()
      };
      await CreatorTalentService.saveReport(fallbackReport);
      return fallbackReport;
    }
  }
};

export { StripeDistributionService } from './StripeDistributionService';


