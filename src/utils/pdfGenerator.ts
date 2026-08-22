import { jsPDF } from 'jspdf';

export interface PrivacyPdfMetadata {
  effectiveDate: string;
  version: string;
  documentId: string;
  ecosystemApps: { name: string; url: string; vertical: string; auditId: string }[];
}

export const generatePrivacyPolicyPdf = (metadata?: Partial<PrivacyPdfMetadata>) => {
  const meta: PrivacyPdfMetadata = {
    effectiveDate: metadata?.effectiveDate || 'August 19, 2026',
    version: metadata?.version || 'Version 4.2 (Certified)',
    documentId: metadata?.documentId || 'HUMAN-POL-2026-V4.2-C2PA',
    ecosystemApps: metadata?.ecosystemApps || [
      {
        name: 'Tome Crafter',
        url: 'https://tomecrafter-ai-book-studio.ai.studio',
        vertical: 'Complete Book Creation & Publishing Suite',
        auditId: 'FT-ETHIC-TOMECRAFTER-2026'
      },
      {
        name: 'RLM Pro Studio',
        url: 'https://remix-lyria-studio-5954.ai.studio',
        vertical: 'Hybrid Audio Production Suite & Stem DAW',
        auditId: 'FT-ETHIC-RLM-AUDIO-2026'
      },
      {
        name: 'ForgeOS App Builders & Tester',
        url: 'https://forgeos-app-builder-tester-console-416188261320.us-east1.run.app',
        vertical: 'Open-Source Code AST Engine & Tester Console',
        auditId: 'FT-ETHIC-FORGEOS-APPBUILDER-2026'
      },
      {
        name: 'RL Easy Flow',
        url: 'https://rl-easy-flow.ai.studio',
        vertical: 'AI-Powered Video Generation Studio',
        auditId: 'FT-ETHIC-RL-EASY-FLOW-2026'
      }
    ]
  };

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  const primaryColor: [number, number, number] = [90, 90, 64]; // #5A5A40 Olive
  const darkColor: [number, number, number] = [45, 41, 38]; // #2D2926 Warm Dark
  const accentColor: [number, number, number] = [214, 125, 92]; // #D67D5C Terracotta
  const mutedColor: [number, number, number] = [106, 101, 92]; // #6A655C Muted Grey
  const lightBg: [number, number, number] = [249, 247, 242]; // #F9F7F2 Off-white
  const cardBorder: [number, number, number] = [220, 213, 202]; // #DCD5CA

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin + 10;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top subtle bar
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Footer
    const footerY = pageHeight - 10;
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedColor);
    doc.text('H.U.M.A.N. Protocol Non-Profit Ethical AI Registry • C2PA JUMBF Certified', margin, footerY);

    const pageCount = doc.getNumberOfPages();
    const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;
    doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - margin, footerY, { align: 'right' });
  };

  // ---------------- PAGE 1: TITLE & EXECUTIVE SUMMARY ----------------
  drawHeaderFooter();

  // Document Title Header Box
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('H.U.M.A.N. PROTOCOL & ECOSYSTEM', margin + 6, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.text('Global Ethical AI, Provenance & Creator Privacy Policy', margin + 6, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text(`Document ID: ${meta.documentId}  •  Effective Date: ${meta.effectiveDate}  •  Status: ${meta.version}`, margin + 6, y + 26);
  doc.text('Standards: EU AI Act (Art. 50/53), Fairly Trained (FT-2026), C2PA JUMBF v2.1, GDPR & CCPA/CPRA', margin + 6, y + 32);

  y += 46;

  // Executive Statement Callout
  doc.setFillColor(235, 243, 237); // Light green
  doc.setDrawColor(201, 209, 190);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(61, 110, 80); // Forest green
  doc.text('EXECUTIVE COVENANT & PRIVACY GUARANTEE', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkColor);
  const execText = "The H.U.M.A.N. Protocol operates as a non-profit ethical oversight standard and decentralized registry. We guarantee that user-authored works, audio stems, codebases, and literature generated within our certified ecosystem are NEVER ingested into unauthorized AI foundation training corpora. All creator royalties are routed via pass-through escrow with strict data minimization.";
  const splitExec = doc.splitTextToSize(execText, contentWidth - 10);
  doc.text(splitExec, margin + 5, y + 12);

  y += 30;

  // Section 1: Scope & Multi-App Architecture
  const addSectionHeader = (number: string, title: string) => {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryColor);
    doc.text(`${number}. ${title}`, margin, y);
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 7;
  };

  const addParagraph = (text: string, spaceAfter = 4) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...darkColor);
    const lines = doc.splitTextToSize(text, contentWidth);
    const needed = (lines.length * 3.6) + spaceAfter;
    checkPageBreak(needed);
    doc.text(lines, margin, y);
    y += (lines.length * 3.6) + spaceAfter;
  };

  const addBullet = (label: string, text: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...darkColor);
    const labelWidth = doc.getTextWidth(`• ${label}: `);
    
    doc.setFont('helvetica', 'normal');
    const fullText = `• ${label}: ${text}`;
    const lines = doc.splitTextToSize(fullText, contentWidth - 4);
    const needed = (lines.length * 3.6) + 2.5;
    checkPageBreak(needed);

    doc.text(lines, margin + 4, y);
    y += (lines.length * 3.6) + 2.5;
  };

  addSectionHeader('1', 'SCOPE & ENTITY ARCHITECTURE');
  addParagraph('This Privacy Policy governs the decentralized cryptographic verification and micro-royalty routing mechanisms operated by the H.U.M.A.N. Non-Profit Foundation ("H.U.M.A.N.", "we", "us", or "our"), as well as the 4 flagship commercial applications natively bound to the H.U.M.A.N. Protocol:');
  
  meta.ecosystemApps.forEach(app => {
    addBullet(app.name, `${app.vertical} (${app.url}) — Cleanroom Audit ID: ${app.auditId}`);
  });

  addParagraph('The H.U.M.A.N. non-profit authority maintains zero equity and zero proprietary interest in third-party commercial outputs. All micro-royalty settlement pools are pass-through clearing buffers dedicated solely to verified human creators, maintainers, and rightsholders.', 5);

  addSectionHeader('2', 'DATA MINIMIZATION & CLEANROOM ZERO-INGESTION GUARANTEE');
  addParagraph('Unlike conventional AI platforms that scrape user drafts to fine-tune proprietary foundation models, our ecosystem enforces strict algorithmic cleanroom separation:');
  addBullet('No Training on User Prompts or Drafts', 'Manuscripts written in Tome Crafter, audio stems produced in RLM Pro Studio, source code generated in ForgeOS, and video scenes created in RL Easy Flow are never indexed, cached, or utilized for neural network training.');
  addBullet('Fairly Trained Standard (FT-2026)', 'All underlying foundational weights have undergone full cryptographic cleanroom lineage auditing to verify zero non-consensual copyrighted works were ingested during model pre-training.');
  addBullet('Zero-Copyleft AST Quarantine', 'Code generation engines run inside an isolated OSPO sandbox with automated quarantine against viral license contamination (GPL/AGPL/SSPL).');

  // ---------------- SECTION 3: DATA COLLECTED ----------------
  addSectionHeader('3', 'CATEGORIES OF INFORMATION WE PROCESS');
  addParagraph('We collect and process only the minimal cryptographic proofs required to issue C2PA watermarks and distribute creator micro-payouts:');
  addBullet('Cryptographic Merkle Root Hashes', 'SHA-256 root hashes and C2PA JUMBF metadata claims embedded into exported media (MP4, WAV, EPUB, PDF, AST headers).');
  addBullet('Story Protocol IP Asset Identifiers', 'On-chain programmable IP registry mappings used to resolve downstream attribution and licensing splits.');
  addBullet('Stripe Connect Escrow Identifiers', 'Tokenized payout account IDs used to deliver instant creator disbursements. We do NOT store credit card numbers or banking credentials on our servers.');
  addBullet('Tester & Cohort Telemetry', 'Opt-in feedback submissions, diagnostic logs, and platform version checks submitted through the Tester Console.');

  // ---------------- SECTION 4: MICRO-ROYALTY SETTLEMENT ----------------
  addSectionHeader('4', 'MICRO-ROYALTY ESCROW & FINANCIAL CLEARING');
  addParagraph('When an end-user synthesizes assets or exports commercial media across any certified ecosystem app:');
  addBullet('Automated Micro-Allocation', 'A per-inference micro-fee (typically $0.005 to $0.05) is routed from the app treasury into the H.U.M.A.N. pass-through escrow buffer.');
  addBullet('Direct Creator Split', 'Funds are disbursed instantaneously to registered creators, open-source maintainers (via OSS micro-grants), and master rights holders using Stripe Connect Express.');
  addBullet('Non-Profit Zero Retention', 'The H.U.M.A.N. foundation retains zero percent (0%) of creator royalty allocations, operating strictly as a certified public-benefit clearinghouse.');

  // ---------------- SECTION 5: REGULATORY COMPLIANCE ----------------
  addSectionHeader('5', 'GLOBAL REGULATORY COMPLIANCE & LEGAL BASES');
  addParagraph('Our protocol is engineered from the ground up to guarantee immediate, verifiable compliance with emerging global AI frameworks:');
  addBullet('EU AI Act (Regulation EU 2024/1689)', 'Fully satisfies Article 50 (Transparency for AI-generated content & synthetic media watermarking) and Article 53 (Copyright transparency summaries for general-purpose AI).');
  addBullet('GDPR (Regulation EU 2016/679) & UK GDPR', 'Legal basis under Article 6(1)(b) [Contract Performance] and Article 6(1)(f) [Legitimate Interests in Provenance & Creator Protection]. You hold full rights to access, rectification, erasure, and portability.');
  addBullet('CCPA / CPRA (California Privacy Rights Act)', 'We do NOT sell, rent, or share personal data with data brokers or advertising networks. California residents enjoy complete right to opt-out and delete.');
  addBullet('C2PA & Coalition for Content Provenance and Authenticity', 'All exported media complies with C2PA Technical Specification v2.1 with tamper-evident digital signatures.');

  // ---------------- SECTION 6: COOKIES & LOCAL STORAGE ----------------
  addSectionHeader('6', 'CLIENT STORAGE & ZERO TRACKING COOKIES');
  addParagraph('The H.U.M.A.N. Console and badge widgets utilize standard browser `localStorage` solely for:');
  addBullet('Local Session State', 'Remembering your selected active app domain, dark/light theme preference, and verified badge toggle state.');
  addBullet('No Third-Party Ad Trackers', 'We do not employ cross-site tracking pixels, social media beacons, or behavioral advertising cookies.');

  // ---------------- SECTION 7: SECURITY & INCIDENT RESPONSE ----------------
  addSectionHeader('7', 'SECURITY ARCHITECTURE & INCIDENT RESPONSE');
  addParagraph('We implement multi-layered cryptographic safeguards including TLS 1.3 in-transit encryption, AES-256 at-rest Firestore security rules, strict role-based access control (RBAC), and automated penetration auditing across all API ingress points.');

  // ---------------- SECTION 8: CONTACT & DPO ----------------
  addSectionHeader('8', 'DATA PROTECTION OFFICER & CONTACT INFORMATION');
  addParagraph('For inquiries regarding this Privacy Policy, cryptographic audit verifications, or to exercise your GDPR/CCPA rights:');
  addBullet('Non-Profit Registry Board', 'H.U.M.A.N. Protocol Global Ethical Registry Authority');
  addBullet('Data Protection Officer (DPO)', 'codygermain032@gmail.com / legal@human-protocol.org');
  addBullet('Headquarters & Registry Desk', 'Global Non-Profit Ethical AI Registry • Cleanroom Standards Bureau');
  addBullet('Live Verification Portal', 'https://ais-dev-xbevwyvcnsn355pwprt5ih-321940249756.us-east1.run.app');

  // Add final signature & stamp block
  checkPageBreak(30);
  y += 4;
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('CRYPTOGRAPHIC SEAL & OFFICIAL ATTESTATION', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...mutedColor);
  doc.text('Master C2PA Merkle Root: 0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b', margin + 5, y + 12);
  doc.text('Attested by H.U.M.A.N. Protocol Non-Profit Foundation • Certified Under Fairly Trained Cleanroom Audit 2026', margin + 5, y + 17);

  // Update total page numbers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedColor);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  // Save / trigger download
  const filename = `HUMAN_Protocol_Ecosystem_Privacy_Policy_${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
};
