import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoURL: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const testers = pgTable('testers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  appAccessList: jsonb('app_access_list').$type<string[]>().notNull(),
  currentSubscriptionStatus: text('current_subscription_status').notNull(),
  joinedDate: text('joined_date').notNull(),
  restitutionTier: text('restitution_tier'),
  lifetimeContributedSec: integer('lifetime_contributed_sec').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const feedback = pgTable('feedback', {
  id: text('id').primaryKey(),
  testerId: text('tester_id'),
  testerEmail: text('tester_email').notNull(),
  appName: text('app_name').notNull(),
  category: text('category').notNull(),
  sentiment: text('sentiment').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull(),
  status: text('status').default('NEW'),
  priority: text('priority').default('MEDIUM'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const broadcasts = pgTable('broadcasts', {
  id: text('id').primaryKey(),
  appName: text('app_name').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  sender: text('sender').notNull(),
  timestamp: text('timestamp').notNull(),
  recipientCount: integer('recipient_count').notNull(),
  deliveryStatus: text('delivery_status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const creatorClaims = pgTable('creator_claims', {
  id: text('id').primaryKey(),
  creatorName: text('creator_name').notNull(),
  creatorEmail: text('creator_email').notNull(),
  assetTitle: text('asset_title').notNull(),
  workType: text('work_type').notNull(),
  claimDate: text('claim_date').notNull(),
  status: text('status').notNull(),
  allocatedRestitutionUsd: integer('allocated_restitution_usd').default(0),
  verifiedViaC2pa: boolean('verified_via_c2pa').default(false),
  c2paManifestHash: text('c2pa_manifest_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const driveBackups = pgTable('drive_backups', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  fileId: text('file_id').notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url'),
  backupType: text('backup_type').notNull(),
  itemCount: integer('item_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  driveBackups: many(driveBackups),
}));

export const driveBackupsRelations = relations(driveBackups, ({ one }) => ({
  user: one(users, {
    fields: [driveBackups.userUid],
    references: [users.uid],
  }),
}));
