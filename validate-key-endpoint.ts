import express, { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { HunterRegistryService } from './HunterRegistryService';

const router = express.Router();
const registry = new HunterRegistryService();

// Cryptographically secure list of server-side valid keys for Chapters 1-15.
// This prevents hackers from scraping client-side bundle files to skip the Hunt.
const CHAPTER_KEYS: { [chapter: number]: { key: string; nextChapterUrl: string } } = {
  1: {
    key: 'hpa-axis',
    nextChapterUrl: 'https://human-ethical-ai.ai.studio/testers'
  },
  2: {
    key: 'dignity',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-3.md'
  },
  3: {
    key: '0.15',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-4.md'
  },
  4: {
    key: '5-character',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-5.md'
  },
  5: {
    key: 'cleanroom',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-6.md'
  },
  6: {
    key: 'ast-quarantine',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-7.md'
  },
  7: {
    key: 'zero-copyleft',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-8.md'
  },
  8: {
    key: 'people-covenant',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-9.md'
  },
  9: {
    key: 'stripe-connect',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-10.md'
  },
  10: {
    key: 'sovereign-key',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-11.md'
  },
  11: {
    key: 'geohash-v2',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-12.md'
  },
  12: {
    key: 'labor-multiplier',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-13.md'
  },
  13: {
    key: 'un-corruptible',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-14.md'
  },
  14: {
    key: 'municipal-trust',
    nextChapterUrl: 'https://github.com/rlp-oss/HUMAN/blob/main/chapters/chapter-15.md'
  },
  15: {
    key: 'sovereign-victory',
    nextChapterUrl: 'https://human-ethical-ai.ai.studio/governance/srk-mint'
  }
};

/**
 * Middleware: Verify Firebase ID Token to prove authentic Google login.
 */
async function verifyGoogleAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized. Missing bearer token.' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.body.uid = decodedToken.uid;
    req.body.email = decodedToken.email;
    next();
  } catch (error) {
    console.error('Error verifying Google Auth token in Validator:', error);
    res.status(403).json({ success: false, error: 'Forbidden. Invalid signature credentials.' });
  }
}

/**
 * @route   POST /api/hunters/validate-key
 * @desc    Validate a submitted chapter key, update database progress, and return the next node
 * @access  Protected (Requires active Google OAuth token)
 */
router.post(
  '/validate-key',
  verifyGoogleAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { uid, chapterNumber, submittedKey, attemptsCount } = req.body;

      if (!uid || chapterNumber === undefined || !submittedKey) {
        res.status(400).json({
          success: false,
          error: 'Required fields (chapterNumber, submittedKey) are missing.',
        });
        return;
      }

      const chapter = parseInt(chapterNumber, 10);
      const expectedRecord = CHAPTER_KEYS[chapter];

      if (!expectedRecord) {
        res.status(404).json({
          success: false,
          error: 'Invalid chapter parameter. No riddle exists for this node.',
        });
        return;
      }

      const sanitizedInput = submittedKey.trim().toLowerCase();
      const sanitizedExpected = expectedRecord.key.toLowerCase();

      if (sanitizedInput === sanitizedExpected) {
        // Update user database progression to unlock the next chapter
        const dbUpdated = await registry.advanceChapter(
          uid,
          chapter,
          sanitizedInput,
          attemptsCount || 1
        );

        if (!dbUpdated) {
          res.status(500).json({
            success: false,
            error: 'Failed to synchronize progress inside secure registry.',
          });
          return;
        }

        console.log(`[DECRYPT COMPLETED] Hunter UID ${uid} solved Chapter ${chapter}.`);

        res.status(200).json({
          success: true,
          match: true,
          message: `Chapter ${chapter} decrypted successfully.`,
          unlockedUrl: expectedRecord.nextChapterUrl,
          nextChapter: chapter + 1
        });
      } else {
        console.log(`[DECRYPT FAILED] Hunter UID ${uid} failed Chapter ${chapter} with key: "${submittedKey}"`);
        res.status(200).json({
          success: true,
          match: false,
          message: 'Decryption failed. Signature mismatch.'
        });
      }

    } catch (error) {
      console.error('Error during Hunter verification endpoint routing:', error);
      next(error);
    }
  }
);

export default router;
