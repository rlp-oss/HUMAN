import { BadgeComplianceAuditor } from '../BadgeComplianceAuditor';
import { HUMAN_PROTOCOL_SPECIFICATION } from '../HumanProtocolSpecification';

describe('BadgeComplianceAuditor - Automated Compliance Engine Tests', () => {
  let auditor: BadgeComplianceAuditor;

  const validC2paMetadata = {
    version: 'v2.1',
    signatureAlgo: 'ECDSA-SHA256'
  };

  const validSybilConfig = {
    vouchScore: 0.92,
    geohashLen: 5
  };

  const validCovenantSplit = {
    platformSplitPct: 0.50,
    poolASplitPct: 0.70,
    poolBSplitPct: 0.15,
    poolCSplitPct: 0.15
  };

  const cleanroomDependencies = ['react', 'react-dom', 'lucide-react', 'recharts', 'c2pa-node'];

  beforeEach(() => {
    auditor = new BadgeComplianceAuditor();
  });

  describe('1. Zero-Ingestion Cleanroom & Blacklisted Dependencies', () => {
    it('should flag an application with blacklisted AI scraping/training dependencies as non-compliant', async () => {
      const blacklistedDeps = ['react', 'openai', 'transformers', 'viral-copyleft-scraper'];

      const result = await auditor.auditApp(
        'app_shadow_crawler',
        'Shadow Crawler AI',
        blacklistedDeps,
        validCovenantSplit,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.isCompliant).toBe(false);
      expect(result.details.zeroIngestionPassed).toBe(false);
      expect(result.details.licenseVerificationPassed).toBe(false);
      expect(result.bannedLibrariesFound).toEqual(
        expect.arrayContaining(['openai', 'transformers', 'viral-copyleft-scraper'])
      );
      expect(result.bannedLibrariesFound.length).toBe(3);
      expect(result.issuedBadges).toHaveLength(0);
      expect(result.score).toBeLessThan(100);
      expect(result.auditMessage).toContain('FAILURE');
      expect(result.auditMessage).toContain('Ingestion libraries found');
    });

    it('should flag single blacklisted dependency (e.g. anthropic or langchain-core)', async () => {
      const singleBannedDep = ['react', 'lucide-react', 'anthropic'];

      const result = await auditor.auditApp(
        'app_anthropic_wrapper',
        'Anthropic Prompt Studio',
        singleBannedDep,
        validCovenantSplit,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.isCompliant).toBe(false);
      expect(result.details.zeroIngestionPassed).toBe(false);
      expect(result.bannedLibrariesFound).toEqual(['anthropic']);
    });

    it('should approve applications containing only permissible cleanroom dependencies', async () => {
      const result = await auditor.auditApp(
        'app_tome_crafter_prod',
        'Tome Crafter Pro Studio',
        cleanroomDependencies,
        validCovenantSplit,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.details.zeroIngestionPassed).toBe(true);
      expect(result.details.licenseVerificationPassed).toBe(true);
      expect(result.bannedLibrariesFound).toHaveLength(0);
    });
  });

  describe('2. Economic Covenant & Royalty Split Configuration', () => {
    it('should flag an application with extractive platform split (e.g. 85% platform retention) as non-compliant', async () => {
      const extractiveSplit = {
        platformSplitPct: 0.85,
        poolASplitPct: 0.10,
        poolBSplitPct: 0.03,
        poolCSplitPct: 0.02
      };

      const result = await auditor.auditApp(
        'app_extractive_hub',
        'Extractive Creator Network',
        cleanroomDependencies,
        extractiveSplit,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.isCompliant).toBe(false);
      expect(result.details.covenantIntegrityPassed).toBe(false);
      expect(result.issuedBadges).toHaveLength(0);
      expect(result.auditMessage).toContain('Invalid Stripe splitting configuration');
    });

    it('should flag an application with non-compliant creator pool distribution (e.g. Pool A != 70%)', async () => {
      const invalidPoolSplit = {
        platformSplitPct: 0.50,
        poolASplitPct: 0.50, // Should be 70%
        poolBSplitPct: 0.30, // Should be 15%
        poolCSplitPct: 0.20  // Should be 15%
      };

      const result = await auditor.auditApp(
        'app_skewed_split',
        'Skewed Distribution App',
        cleanroomDependencies,
        invalidPoolSplit,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.isCompliant).toBe(false);
      expect(result.details.covenantIntegrityPassed).toBe(false);
    });

    it('should approve exact 50% People\'s Covenant and 70/15/15 pool ratios', async () => {
      const result = await auditor.auditApp(
        'app_compliant_covenant',
        'Compliant Fair Trade Store',
        cleanroomDependencies,
        validCovenantSplit,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.details.covenantIntegrityPassed).toBe(true);
    });
  });

  describe('3. Multi-Violation & Full 5-Stage Synthesis', () => {
    it('should detect compound violations (both blacklisted dependencies AND invalid royalty split)', async () => {
      const compoundViolator = {
        deps: ['react', 'google-generativeai', 'huggingface_hub'],
        split: {
          platformSplitPct: 0.90,
          poolASplitPct: 0.05,
          poolBSplitPct: 0.03,
          poolCSplitPct: 0.02
        }
      };

      const result = await auditor.auditApp(
        'app_compound_violator',
        'Compound Ingestion Corp',
        compoundViolator.deps,
        compoundViolator.split,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.isCompliant).toBe(false);
      expect(result.details.zeroIngestionPassed).toBe(false);
      expect(result.details.covenantIntegrityPassed).toBe(false);
      expect(result.details.licenseVerificationPassed).toBe(false);
      expect(result.score).toBeLessThanOrEqual(40);
      expect(result.issuedBadges).toHaveLength(0);
    });

    it('should award all ethical verification badges when all 5 stages pass', async () => {
      const result = await auditor.auditApp(
        'app_human_flagship',
        'H.U.M.A.N. Flagship Workstation',
        cleanroomDependencies,
        validCovenantSplit,
        validC2paMetadata,
        validSybilConfig
      );

      expect(result.isCompliant).toBe(true);
      expect(result.score).toBe(100);
      expect(result.details.zeroIngestionPassed).toBe(true);
      expect(result.details.covenantIntegrityPassed).toBe(true);
      expect(result.details.c2paSignaturePassed).toBe(true);
      expect(result.details.pohSybilPassed).toBe(true);
      expect(result.details.licenseVerificationPassed).toBe(true);

      expect(result.issuedBadges).toEqual(
        expect.arrayContaining([
          HUMAN_PROTOCOL_SPECIFICATION.badges.FAIRLY_TRAINED_2026,
          HUMAN_PROTOCOL_SPECIFICATION.badges.ZERO_INGESTION,
          HUMAN_PROTOCOL_SPECIFICATION.badges.ECOSYSTEM_MEMBER
        ])
      );
      expect(result.auditMessage).toContain('SUCCESS');
    });
  });
});
