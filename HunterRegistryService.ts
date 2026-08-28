import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, Firestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

/**
 * Interface representing an active Hunter in the 15-Chapter Treasure Hunt.
 * Complies with H.U.M.A.N. Protocol Ecosystem Privacy Policy v4.2 (Zero PII Harvesting).
 */
export interface HunterProfile {
  uid: string;                 // Secure Google UID
  displayName: string;         // Public pseudonym or display name
  emailHash: string;           // SHA-256 hashed email to protect hunter identity
  registeredAt: Timestamp;
  currentChapter: number;      // Tracking progression (1-15)
  unlockedKeys: {
    [chapterNumber: number]: {
      decryptedAt: Timestamp;
      keyUsed: string;
      attemptsCount: number;
    }
  };
  telemetry: {
    lastActiveAt: Timestamp;
    deviceType: string;
  };
}

export class HunterRegistryService {
  private db: Firestore;

  constructor() {
    if (getApps().length === 0) {
      initializeApp();
    }
    this.db = getFirestore();
  }

  /**
   * Registers a new Hunter or retrieves their existing profile upon Google Sign-In.
   * Utilizes transactional database checks to prevent race conditions or duplicate entries.
   */
  public async registerOrGetHunter(
    uid: string,
    displayName: string,
    rawEmail: string,
    userAgent: string
  ): Promise<HunterProfile> {
    // Generate a secure, irreversible cryptographic hash of the email to preserve privacy
    const emailHash = crypto.createHash('sha256').update(rawEmail.toLowerCase().trim()).digest('hex');
    
    const hunterRef = this.db.collection('hunters').doc(uid);

    return await this.db.runTransaction(async (transaction) => {
      const doc = await transaction.get(hunterRef);

      if (doc.exists) {
        // Hunter already exists, update their active telemetry heartbeat
        const currentData = doc.data() as HunterProfile;
        const updatedTelemetry = {
          ...currentData.telemetry,
          lastActiveAt: Timestamp.now()
        };

        transaction.update(hunterRef, {
          'telemetry.lastActiveAt': Timestamp.now()
        });

        return {
          ...currentData,
          telemetry: updatedTelemetry
        };
      }

      // Initialize a new Hunter profile at Chapter 1 (Sandbox Phase)
      const newHunter: HunterProfile = {
        uid,
        displayName: displayName || 'Anonymous Hunter',
        emailHash,
        registeredAt: Timestamp.now(),
        currentChapter: 1,
        unlockedKeys: {},
        telemetry: {
          lastActiveAt: Timestamp.now(),
          deviceType: userAgent.includes('Mobi') ? 'mobile' : 'desktop'
        }
      };

      transaction.set(hunterRef, newHunter);
      return newHunter;
    });
  }

  /**
   * Updates a hunter's active chapter progress after key validation.
   */
  public async advanceChapter(
    uid: string,
    chapterSolved: number,
    keyUsed: string,
    attempts: number
  ): Promise<boolean> {
    const hunterRef = this.db.collection('hunters').doc(uid);

    try {
      await this.db.runTransaction(async (transaction) => {
        const doc = await transaction.get(hunterRef);
        if (!doc.exists) {
          throw new Error('Hunter profile does not exist.');
        }

        const currentData = doc.data() as HunterProfile;
        const nextChapter = chapterSolved + 1;

        // Ensure we don't accidentally downgrade their progression
        const targetChapter = Math.max(currentData.currentChapter, nextChapter);

        const updatedKeys = {
          ...currentData.unlockedKeys,
          [chapterSolved]: {
            decryptedAt: Timestamp.now(),
            keyUsed: keyUsed.toLowerCase().trim(),
            attemptsCount: attempts
          }
        };

        transaction.update(hunterRef, {
          currentChapter: targetChapter,
          unlockedKeys: updatedKeys,
          'telemetry.lastActiveAt': Timestamp.now()
        });
      });

      return true;
    } catch (error) {
      console.error(`[Hunter Registry Error] Failed to advance chapter for user ${uid}:`, error);
      return false;
    }
  }
}
