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
  | 'ShareShop Pro' 
  | 'Lyria Studio' 
  | 'CodeSynthesizer' 
  | 'ReForgeOS Engine' 
  | 'ArtisanPay API';

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

export interface RoyaltyPoolSummary {
  total_streamed_usd: number;
  total_active_creators: number;
  total_synthesis_events: number;
  copyleft_quarantine_violations: number;
  active_badge_apps: number;
  monthly_pool_growth_pct: number;
}
