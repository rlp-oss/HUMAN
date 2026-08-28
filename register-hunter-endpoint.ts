import express, { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { HunterRegistryService } from './HunterRegistryService';

const router = express.Router();
const registry = new HunterRegistryService();

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
    console.error('Error verifying Google Auth token:', error);
    res.status(403).json({ success: false, error: 'Forbidden. Invalid signature credentials.' });
  }
}

/**
 * @route   POST /api/hunters/register
 * @desc    Onboard or login an active seeker into the secure Firestore Hunter cohort
 * @access  Protected (Requires active Google OAuth token)
 */
router.post(
  '/register',
  verifyGoogleAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { uid, email, displayName, userAgent } = req.body;

      if (!uid || !email) {
        res.status(400).json({
          success: false,
          error: 'Invalid signature payload. Required identity fields are missing.',
        });
        return;
      }

      const clientUserAgent = userAgent || req.headers['user-agent'] || 'unknown';

      // Record/retrieve from secure registry
      const hunterProfile = await registry.registerOrGetHunter(
        uid,
        displayName || 'Anonymous Seeker',
        email,
        clientUserAgent
      );

      console.log(`[HUNTER ONBOARDING] Active Seeker verified. Google UID: ${uid}, Email Hash: ${hunterProfile.emailHash}`);

      res.status(200).json({
        success: true,
        message: 'Hunter session verified and synchronized successfully.',
        hunter: {
          uid: hunterProfile.uid,
          displayName: hunterProfile.displayName,
          emailHash: hunterProfile.emailHash,
          currentChapter: hunterProfile.currentChapter,
          registeredAt: hunterProfile.registeredAt,
          lastActiveAt: hunterProfile.telemetry.lastActiveAt
        },
      });

    } catch (error) {
      console.error('Error during Hunter registration routing:', error);
      next(error);
    }
  }
);

export default router;
