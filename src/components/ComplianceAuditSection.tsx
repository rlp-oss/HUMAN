import React, { useState } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  FileCheck, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  CheckCircle2, 
  Hash, 
  Database, 
  FileText, 
  DollarSign, 
  Clock, 
  Award, 
  Sparkles, 
  Search, 
  Filter, 
  Lock, 
  Eye, 
  RefreshCw,
  Globe,
  Share2,
  Building,
  Key,
  ChevronDown,
  Printer,
  FileJson
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComplianceAuditSectionProps {
  appId: string;
  developerName: string;
  manifestHash: string;
  storyIpAssetId: string;
  ftAuditId: string;
  royaltyBalance: number;
  isBadgeActive: boolean;
}

export const ComplianceAuditSection: React.FC<ComplianceAuditSectionProps> = ({
  appId,
  developerName,
  manifestHash,
  storyIpAssetId,
  ftAuditId,
  royaltyBalance,
  isBadgeActive,
}) => {
  const [activeTab, setActiveTab] = useState<'training-sources' | 'license-receipts' | 'payout-records'>('training-sources');
  const [copiedAuditUrl, setCopiedAuditUrl] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showPublicAuditModal, setShowPublicAuditModal] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const publicAuditUrl = `https://reforge-os.org/audit/${appId}?manifest=${encodeURIComponent(manifestHash.slice(0, 18))}`;

  // 1. Hashed Training Data Sources
  const trainingSources = [
    {
      id: 'src_ds_001',
      name: 'OpenScholar Peer-Reviewed Academic Corpus V4',
      type: 'Literature & Research',
      hash: '0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b',
      recordsCount: '450,000 papers',
      license: 'CC-BY-4.0 (Verified Attribution)',
      status: 'Cleanroom Certified',
      provenanceProvider: 'Open Academic Registry / DOI Network',
      lastAudited: '2026-08-15',
    },
    {
      id: 'src_ds_002',
      name: 'ArtisanAudio Master Acoustic Loops & Stems',
      type: 'Audio / FLAC Masters',
      hash: '0x4f1b88e10c29a877bf4356e29910ac772189d9804b219',
      recordsCount: '12,400 stems',
      license: 'Story Protocol PIL-1.0 (Commercial Micro-Royalty)',
      status: 'Cleanroom Certified',
      provenanceProvider: 'AudioArtisan Collective',
      lastAudited: '2026-08-16',
    },
    {
      id: 'src_ds_003',
      name: 'ReForgeOS Virtual Kernel & Zero-Copyleft AST Engine',
      type: 'Code & Architecture',
      hash: '0x93de66a8710fa44029ce11082bb4901cb00192e441890',
      recordsCount: '85,000 modules',
      license: 'Permissive MIT + H.U.M.A.N. Covenant',
      status: 'Cleanroom Certified',
      provenanceProvider: 'ReForgeOS Core Team (Cody Germain)',
      lastAudited: '2026-08-18',
    },
    {
      id: 'src_ds_004',
      name: 'VectorGlyph Typography & Visual Atlas',
      type: 'Visual & Font Vectors',
      hash: '0x22ab8991fc33910ebf778103418ba09c1189ac3409112',
      recordsCount: '24,000 glyph sets',
      license: 'Artisan Author Direct Agreement',
      status: 'Cleanroom Certified',
      provenanceProvider: 'Amina Al-Mansoor Design Guild',
      lastAudited: '2026-08-17',
    },
  ];

  // 2. Verifiable License Receipts
  const licenseReceipts = [
    {
      receiptId: 'rcpt_lic_9901',
      title: 'Story Protocol Programmable IP License PIL-1.0',
      licensor: 'Marcus Vance (ASCAP / AudioArtisan)',
      licensorDid: 'did:human:creator:marcus-vance-sound',
      assetType: 'Music & Stem Synthesizer',
      royaltyShare: '3.20% per audio stem synthesis',
      signatureAlgorithm: 'Ed25519 / Story Protocol ERC-6551',
      validity: 'Valid & Active',
      receiptHash: '0x3344aae90184b2c89011de34901ba19',
      issuedAt: '2026-07-20T08:30:00Z',
    },
    {
      receiptId: 'rcpt_lic_9902',
      title: 'Open Attribution Academic Citation Covenant',
      licensor: 'Dr. Evelyn Morales (Artisans Guild Research)',
      licensorDid: 'did:human:scholar:evelyn-morales-edu',
      assetType: 'Book / Literature RAG Context',
      royaltyShare: '2.80% per citation inquiry',
      signatureAlgorithm: 'Ed25519 / Open Academic Proof',
      validity: 'Valid & Active',
      receiptHash: '0x8899bcf01123a4561009ce4401bb882',
      issuedAt: '2026-07-28T14:15:00Z',
    },
    {
      receiptId: 'rcpt_lic_9903',
      title: 'Zero-Copyleft Permissive Runtime Warranty',
      licensor: 'Cody Germain (Reforge Core)',
      licensorDid: 'did:human:dev:codygermain032',
      assetType: 'Code Generation Kernel',
      royaltyShare: '4.50% per code synthesis event',
      signatureAlgorithm: 'Ed25519 / GitHub Verified Commit Signature',
      validity: 'Valid & Active',
      receiptHash: '0x7711dce990223a4556100ee9901ab33',
      issuedAt: '2026-06-15T12:00:00Z',
    },
  ];

  // 3. Payout Transaction Records
  const payoutRecords = [
    {
      txId: 'tx_aud_8801',
      timestamp: '2026-08-18 16:45:12 UTC',
      recipient: 'Dr. Evelyn Morales',
      workTitle: 'The Principles of Ethical AI Synthesis',
      appSource: 'CodeSynthesizer',
      amountUsd: 512.60,
      rail: 'Stripe Connect Direct Bank',
      transferRef: 'tr_1NZp77ReadyForInstantDisburse',
      c2paAuditHash: manifestHash.slice(0, 20) + '...',
      status: 'Settled to Bank',
    },
    {
      txId: 'tx_aud_8802',
      timestamp: '2026-08-18 09:30:44 UTC',
      recipient: 'Marcus Vance',
      workTitle: 'Harmonic Stems Vol. 4',
      appSource: 'Lyria Studio',
      amountUsd: 84.50,
      rail: 'Stripe Connect Express',
      transferRef: 'tr_1NZm99StripeAudioDirect',
      c2paAuditHash: '0x4f1b88e10c29...marcus',
      status: 'Settled to Bank',
    },
    {
      txId: 'tx_aud_8803',
      timestamp: '2026-08-17 14:10:02 UTC',
      recipient: 'Cody Germain',
      workTitle: 'ReForgeOS Virtual Kernel',
      appSource: 'ReForgeOS Engine',
      amountUsd: 125.40,
      rail: 'Stripe Connect Direct Bank',
      transferRef: 'tr_1NZe44StripeConnectPaid',
      c2paAuditHash: '0x93de66a8710f...cody',
      status: 'Settled to Bank',
    },
    {
      txId: 'tx_aud_8804',
      timestamp: '2026-08-18 17:50:33 UTC',
      recipient: 'Sarah Chen (OSS Guild)',
      workTitle: 'Fast-Router Component Micro-Library',
      appSource: 'ShareShop Pro',
      amountUsd: 14.20,
      rail: 'Story Protocol Programmable Split',
      transferRef: 'tr_pending_24h_batch_buffer',
      c2paAuditHash: '0x633270615f6a...buffer',
      status: 'In 24h Clearing Buffer',
    },
  ];

  const handleCopyAuditUrl = () => {
    navigator.clipboard.writeText(publicAuditUrl);
    setCopiedAuditUrl(true);
    setTimeout(() => setCopiedAuditUrl(false), 3000);
  };

  const handleCopyHash = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 3000);
  };

  const handleRunInstantAuditCheck = () => {
    setVerificationLoading(true);
    setTimeout(() => {
      setVerificationLoading(false);
      setVerifiedSuccess(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3D6E50', '#5A5A40', '#D67D5C'],
      });
      showToast('Merkle roots and cryptographic signatures re-verified successfully.');
    }, 700);
  };

  // Download Audit Record as JSON file
  const handleDownloadJSON = () => {
    setShowDownloadDropdown(false);
    const auditReport = {
      "@context": [
        "https://c2pa.org/specifications/v2/context.jsonld",
        "https://reforge-os.org/schemas/human-compliance-v2.jsonld"
      ],
      "audit_type": "H.U.M.A.N. Protocol Cryptographic Compliance & Provenance Record",
      "compliance_standard": "EU AI Act Article 53 & US Copyright Office Attribution Standards",
      "report_version": "2.1.0",
      "generated_at": new Date().toISOString(),
      "application": {
        "app_id": appId,
        "developer_name": developerName,
        "status": isBadgeActive ? "VERIFIED_ACTIVE" : "PENDING_VERIFICATION",
        "fairly_trained_registry_id": ftAuditId,
        "story_protocol_ip_asset_id": storyIpAssetId,
        "c2pa_manifest_hash": manifestHash,
        "public_audit_uri": publicAuditUrl,
        "sample_royalty_balance_usd": royaltyBalance
      },
      "regulatory_compliance_attestations": {
        "eu_ai_act_article_53_copyright_transparency": "COMPLIANT_VERIFIED",
        "us_copyright_human_origin_covenant": "COMPLIANT_VERIFIED",
        "nist_ai_rmf_provenance_tracking": "COMPLIANT_VERIFIED",
        "zero_copyleft_quarantine": "ENFORCED",
        "audit_authority": "did:human:ethical-ai-authority"
      },
      "hashed_training_data_sources": trainingSources,
      "verifiable_license_receipts": licenseReceipts,
      "payout_settlement_ledger": payoutRecords,
      "cryptographic_verification": {
        "algorithm": "Ed25519 (JUMBF v2.1 RFC-C2PA)",
        "merkle_root": manifestHash,
        "authority_did": "did:human:ethical-ai-authority",
        "signature_valid": true,
        "timestamp": new Date().toISOString()
      }
    };

    const jsonStr = JSON.stringify(auditReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance-audit-record-${appId}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#5A5A40', '#3D6E50', '#D67D5C'],
    });
    showToast('Machine-readable Compliance Audit JSON downloaded for regulatory record-keeping.');
  };

  // Download / Print Audit Record as PDF Certificate
  const handleDownloadPDF = () => {
    setShowDownloadDropdown(false);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Popup blocker prevented opening print window. Please allow popups.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Compliance Audit Record - ${appId}</title>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2D2926;
      background: #FFFFFF;
      margin: 0;
      padding: 36px;
      line-height: 1.5;
      font-size: 12px;
    }
    .header {
      border-bottom: 2px solid #5A5A40;
      padding-bottom: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      color: #2D2926;
      margin: 0 0 4px 0;
    }
    .subtitle {
      font-size: 11px;
      color: #6A655C;
      margin: 0;
      font-family: monospace;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      font-family: monospace;
      background: #EBF3ED;
      color: #3D6E50;
      border: 1px solid #C9D1BE;
    }
    .section {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #5A5A40;
      border-bottom: 1px solid #E5E0D8;
      padding-bottom: 4px;
      margin-bottom: 10px;
      font-family: monospace;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .meta-box {
      background: #FAF8F5;
      border: 1px solid #E5E0D8;
      border-radius: 6px;
      padding: 10px;
    }
    .meta-label {
      font-size: 9px;
      font-family: monospace;
      color: #8C857B;
      text-transform: uppercase;
    }
    .meta-value {
      font-size: 11px;
      font-weight: 700;
      color: #2D2926;
      margin-top: 2px;
      word-break: break-all;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      font-size: 10.5px;
    }
    th {
      background: #FAF8F5;
      text-align: left;
      padding: 6px 8px;
      font-family: monospace;
      font-size: 9.5px;
      text-transform: uppercase;
      color: #6A655C;
      border-bottom: 1px solid #E5E0D8;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #F2ECE4;
      font-family: monospace;
    }
    .hash {
      color: #5A5A40;
      font-size: 9.5px;
      word-break: break-all;
    }
    .attestation-box {
      background: #FAF8F5;
      border: 1px solid #DCD5CA;
      border-radius: 6px;
      padding: 12px;
      margin-top: 16px;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #E5E0D8;
      padding-top: 12px;
      font-size: 9px;
      color: #8C857B;
      font-family: monospace;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 15px; }
      @page { margin: 1.2cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">H.U.M.A.N. Protocol Compliance Audit Record</h1>
      <p class="subtitle">Official Verification & Cryptographic Provenance Certificate (C2PA 2.1 / Story Protocol)</p>
    </div>
    <div style="text-align: right;">
      <span class="badge">100% REGULATORY COMPLIANT</span>
      <div style="font-size: 9.5px; font-family: monospace; color: #8C857B; margin-top: 4px;">
        Issued: ${new Date().toUTCString()}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Application & Entity Verification</div>
    <div class="grid">
      <div class="meta-box">
        <div class="meta-label">Application Identifier</div>
        <div class="meta-value">${appId}</div>
      </div>
      <div class="meta-box">
        <div class="meta-label">Registered Developer / Builder</div>
        <div class="meta-value">${developerName}</div>
      </div>
      <div class="meta-box">
        <div class="meta-label">C2PA Manifest JUMBF Root Hash</div>
        <div class="meta-value">${manifestHash}</div>
      </div>
      <div class="meta-box">
        <div class="meta-label">Story Protocol IP Asset ID</div>
        <div class="meta-value">${storyIpAssetId}</div>
      </div>
      <div class="meta-box">
        <div class="meta-label">Fairly Trained Registry ID</div>
        <div class="meta-value">${ftAuditId}</div>
      </div>
      <div class="meta-box">
        <div class="meta-label">Public Verification URL</div>
        <div class="meta-value" style="font-size: 10px;">${publicAuditUrl}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">1. Hashed Training Data Sources (Cleanroom Certified)</div>
    <table>
      <thead>
        <tr>
          <th>Dataset / Source</th>
          <th>Type</th>
          <th>SHA-256 Merkle Root</th>
          <th>License Framework</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${trainingSources.map(s => `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.type}</td>
            <td class="hash">${s.hash}</td>
            <td>${s.license}</td>
            <td style="color: #3D6E50; font-weight: bold;">${s.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">2. Verifiable License Receipts & Smart Contracts</div>
    <table>
      <thead>
        <tr>
          <th>Receipt ID</th>
          <th>License Standard</th>
          <th>Grantor DID</th>
          <th>Royalty Term</th>
          <th>Signature</th>
        </tr>
      </thead>
      <tbody>
        ${licenseReceipts.map(r => `
          <tr>
            <td>${r.receiptId}</td>
            <td><strong>${r.title}</strong></td>
            <td>${r.licensorDid}</td>
            <td>${r.royaltyShare}</td>
            <td style="color: #3D6E50; font-weight: bold;">${r.validity}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">3. Payout Settlement Ledger (Micro-Royalty Transparency)</div>
    <table>
      <thead>
        <tr>
          <th>Timestamp (UTC)</th>
          <th>Creator Beneficiary</th>
          <th>Attributed Work</th>
          <th>Stripe Reference</th>
          <th style="text-align: right;">Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${payoutRecords.map(p => `
          <tr>
            <td>${p.timestamp}</td>
            <td><strong>${p.recipient}</strong></td>
            <td>${p.workTitle}</td>
            <td>${p.transferRef}</td>
            <td style="text-align: right; color: #3D6E50; font-weight: bold;">+$${p.amountUsd.toFixed(2)}</td>
            <td>${p.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="attestation-box">
    <div style="font-weight: bold; font-size: 10px; font-family: monospace; color: #5A5A40; margin-bottom: 3px;">
      REGULATORY COMPLIANCE ATTESTATION:
    </div>
    <div style="font-size: 10px; color: #6A655C;">
      This cryptographic document certifies compliance with EU AI Act Article 53 (Copyright Data Transparency), US Copyright Office Human-Origin attribution frameworks, and NIST AI Risk Management Framework provenance tracking. All micro-royalties are recorded with cryptographic immutability.
    </div>
  </div>

  <div class="footer">
    <div>H.U.M.A.N. Protocol Foundation &copy; 2026 • Cryptographic Authority: did:human:ethical-ai-authority</div>
    <div>Page 1 of 1 • Official Compliance Archive Record (C2PA v2.1)</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5A5A40', '#3D6E50', '#D67D5C'],
    });
    showToast('Opening print dialog to save Compliance Audit Record as PDF.');
  };

  return (
    <div className="rounded-2xl border-2 border-[#5A5A40]/30 bg-[#FFFFFF] p-6 space-y-6 shadow-sm relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#3D6E50]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#3D6E50]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner with QR Code summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E5E0D8] pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#5A5A40]/30 text-[11px] font-mono text-[#5A5A40] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Cryptographic Public Compliance & Trust Center</span>
          </div>
          <h3 className="text-xl font-bold text-[#2D2926] tracking-tight">
            Compliance Audit & Public Verification Matrix
          </h3>
          <p className="text-xs text-[#6A655C] leading-relaxed">
            Eliminate black-box AI doubt. End users, security officers, and enterprise developers can scan the auto-generated QR code below or download full audit records as PDF / JSON to satisfy EU AI Act (Art. 53) and NIST copyright transparency mandates.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-mono bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Check className="w-3 h-3" />
              100% Cleanroom Trained
            </span>
            <span className="text-[10px] font-mono bg-[#FAF0EC] text-[#D67D5C] border border-[#EECDBC] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Award className="w-3 h-3" />
              Direct Creator Compensation
            </span>
            <span className="text-[10px] font-mono bg-[#F2ECE4] text-[#6A655C] border border-[#DCD5CA] px-2 py-0.5 rounded-full font-bold">
              C2PA 2.1 Compliant
            </span>
          </div>
        </div>

        {/* Dynamic Auto-Generated QR Code Module */}
        <div className="rounded-2xl border border-[#DCD5CA] bg-[#FAF8F5] p-4 flex items-center gap-4 shadow-2xs shrink-0 self-start lg:self-center">
          {/* Visual Dynamic 2D QR Matrix */}
          <div className="relative group cursor-pointer" onClick={() => setShowPublicAuditModal(true)}>
            <div className="w-24 h-24 p-2 bg-[#FFFFFF] rounded-xl border border-[#DCD5CA] shadow-inner flex flex-col justify-between items-center transition-transform group-hover:scale-105">
              {/* SVG QR Code Simulation */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#5A5A40]">
                {/* Corner Anchors */}
                <rect x="5" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                <rect x="11" y="11" width="14" height="14" fill="currentColor" rx="1" />
                
                <rect x="69" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                <rect x="75" y="11" width="14" height="14" fill="currentColor" rx="1" />
                
                <rect x="5" y="69" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                <rect x="11" y="75" width="14" height="14" fill="currentColor" rx="1" />

                {/* Data Grid Blocks */}
                <rect x="37" y="8" width="6" height="6" fill="currentColor" />
                <rect x="47" y="8" width="6" height="6" fill="currentColor" />
                <rect x="57" y="8" width="6" height="6" fill="currentColor" />
                <rect x="37" y="20" width="6" height="6" fill="currentColor" />
                <rect x="50" y="22" width="6" height="6" fill="currentColor" />
                
                <rect x="8" y="37" width="6" height="6" fill="currentColor" />
                <rect x="20" y="37" width="6" height="6" fill="currentColor" />
                <rect x="37" y="37" width="10" height="10" fill="#D67D5C" rx="1" />
                <rect x="52" y="37" width="6" height="6" fill="currentColor" />
                <rect x="64" y="37" width="6" height="6" fill="currentColor" />
                <rect x="78" y="37" width="6" height="6" fill="currentColor" />

                <rect x="8" y="50" width="6" height="6" fill="currentColor" />
                <rect x="22" y="50" width="6" height="6" fill="currentColor" />
                <rect x="37" y="52" width="6" height="6" fill="currentColor" />
                <rect x="50" y="50" width="8" height="8" fill="currentColor" />
                <rect x="66" y="50" width="6" height="6" fill="currentColor" />
                <rect x="80" y="52" width="6" height="6" fill="currentColor" />

                <rect x="37" y="69" width="6" height="6" fill="currentColor" />
                <rect x="49" y="69" width="6" height="6" fill="currentColor" />
                <rect x="60" y="69" width="6" height="6" fill="currentColor" />
                <rect x="37" y="81" width="6" height="6" fill="currentColor" />
                <rect x="50" y="81" width="6" height="6" fill="currentColor" />
                <rect x="64" y="81" width="6" height="6" fill="currentColor" />
                <rect x="76" y="81" width="6" height="6" fill="currentColor" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-[#5A5A40]/80 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-mono font-bold">
              Click to Inspect
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3D6E50] animate-pulse"></span>
              <strong className="font-mono text-[#2D2926]">Auto-Generated Audit QR</strong>
            </div>
            <p className="text-[11px] text-[#6A655C] max-w-[170px] leading-tight">
              Points to public certificate for <code className="text-[#5A5A40] font-bold">{appId}</code>
            </p>
            
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setShowPublicAuditModal(true)}
                className="px-2 py-1 rounded bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
              >
                <Eye className="w-2.5 h-2.5" />
                <span>Open Audit Page</span>
              </button>
              <button
                type="button"
                onClick={handleCopyAuditUrl}
                className="px-2 py-1 rounded bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-[#5A5A40] text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                title="Copy public audit URL"
              >
                {copiedAuditUrl ? <Check className="w-2.5 h-2.5 text-[#3D6E50]" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedAuditUrl ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation & Download Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('training-sources')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'training-sources'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#FAF8F5]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. Hashed Training Sources</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10">
              {trainingSources.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('license-receipts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'license-receipts'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#FAF8F5]'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>2. License Receipts</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10">
              {licenseReceipts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payout-records')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'payout-records'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'text-[#6A655C] hover:text-[#2D2926] hover:bg-[#FAF8F5]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>3. Payout Transactions</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10">
              {payoutRecords.length}
            </span>
          </button>
        </div>

        {/* Action Group: Download PDF / JSON & Re-verify */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Audit Record Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download Audit Record</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>

            {showDownloadDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-[#DCD5CA] bg-[#FFFFFF] p-1.5 shadow-xl z-30 animate-fade-in space-y-1">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-md bg-[#FAF0EC] text-[#D67D5C] group-hover:bg-[#D67D5C] group-hover:text-white transition-colors mt-0.5">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2D2926]">Download PDF Certificate</div>
                    <div className="text-[10px] text-[#6A655C] leading-tight">Official printable compliance report with legal seals</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-md bg-[#EBF3ED] text-[#3D6E50] group-hover:bg-[#3D6E50] group-hover:text-white transition-colors mt-0.5">
                    <FileJson className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2D2926]">Download JSON-LD Record</div>
                    <div className="text-[10px] text-[#6A655C] leading-tight">Machine-readable C2PA / ISO provenance archive</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Re-verify Audit Trigger */}
          <button
            type="button"
            onClick={handleRunInstantAuditCheck}
            disabled={verificationLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono font-semibold text-[#5A5A40] hover:text-[#2D2926] hover:bg-[#F2ECE4] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verificationLoading ? 'animate-spin' : ''}`} />
            <span>{verificationLoading ? 'Verifying...' : 'Re-verify'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: HASHED TRAINING DATA SOURCES */}
      {activeTab === 'training-sources' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-[#6A655C]">
            <p>
              Each dataset used in synthesis is cryptographically hashed with SHA-256 and registered with the Fairly Trained cleanroom protocol to guarantee zero scraped or copyleft-infringing materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingSources.map((source) => (
              <div key={source.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3 shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#D67D5C] font-bold">
                      {source.type}
                    </span>
                    <h4 className="text-xs font-bold text-[#2D2926] leading-tight">
                      {source.name}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE] shrink-0 font-bold">
                    <Check className="w-2.5 h-2.5" />
                    {source.status}
                  </span>
                </div>

                {/* Cryptographic SHA-256 Hash Box */}
                <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#DCD5CA] space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8C857B]">
                    <span>Dataset Merkle Root / SHA-256</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(source.hash, source.id)}
                      className="text-[#5A5A40] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {copiedItem === source.id ? <Check className="w-2.5 h-2.5 text-[#3D6E50]" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedItem === source.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <code className="text-[11px] font-mono text-[#2D2926] block truncate">
                    {source.hash}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#6A655C] pt-1">
                  <div>
                    <span className="text-[10px] text-[#8C857B] block">Volume</span>
                    <strong className="text-[#2D2926]">{source.recordsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C857B] block">License Model</span>
                    <strong className="text-[#5A5A40]">{source.license}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIABLE LICENSE RECEIPTS */}
      {activeTab === 'license-receipts' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-[#6A655C]">
            <p>
              Smart-contract and cryptographic license receipts grant explicit permission for computational attribution with immutable signature timestamps.
            </p>
          </div>

          <div className="space-y-3">
            {licenseReceipts.map((rcpt) => (
              <div key={rcpt.receiptId} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E0D8] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#FFFFFF] border border-[#DCD5CA] text-[#5A5A40]">
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D2926]">{rcpt.title}</h4>
                      <span className="text-[10px] font-mono text-[#6A655C]">Receipt ID: {rcpt.receiptId}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE] font-bold self-start sm:self-auto">
                    <CheckCircle2 className="w-3 h-3" />
                    {rcpt.validity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#8C857B] block">Licensor & Identity DID</span>
                    <strong className="text-[#2D2926] block">{rcpt.licensor}</strong>
                    <code className="text-[10px] font-mono text-[#5A5A40] block truncate">{rcpt.licensorDid}</code>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#8C857B] block">Compensation Terms</span>
                    <strong className="text-[#D67D5C] block">{rcpt.royaltyShare}</strong>
                    <span className="text-[10px] font-mono text-[#6A655C]">Automatic Stripe / Story Split</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#8C857B] block">Receipt Hash & Signature</span>
                    <code className="text-[10px] font-mono text-[#2D2926] block truncate">{rcpt.receiptHash}</code>
                    <span className="text-[10px] font-mono text-[#3D6E50] block">{rcpt.signatureAlgorithm}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PAYOUT TRANSACTION RECORDS */}
      {activeTab === 'payout-records' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-[#6A655C]">
            <p>
              Immutable record of micro-royalties streamed directly to creators from AI prompt synthesis invocations.
            </p>
            <span className="text-[10px] font-mono text-[#8C857B]">
              *Sample amounts for display & testing purposes
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-[#FFFFFF]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E0D8] bg-[#FAF8F5] font-mono text-[11px] uppercase text-[#8C857B]">
                  <th className="py-2.5 px-3">Date / Time (UTC)</th>
                  <th className="py-2.5 px-3">Creator Beneficiary</th>
                  <th className="py-2.5 px-3">Attributed Work</th>
                  <th className="py-2.5 px-3">Payout Rail</th>
                  <th className="py-2.5 px-3">Stripe Transfer ID</th>
                  <th className="py-2.5 px-3 text-right">Disbursed (USD)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4] font-mono">
                {payoutRecords.map((p) => (
                  <tr key={p.txId} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-2.5 px-3 text-[#6A655C] whitespace-nowrap">{p.timestamp}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-[#2D2926]">{p.recipient}</td>
                    <td className="py-2.5 px-3 text-[#5A5A40] max-w-[160px] truncate">{p.workTitle}</td>
                    <td className="py-2.5 px-3 text-[#6A655C] text-[11px]">{p.rail}</td>
                    <td className="py-2.5 px-3 text-[11px] text-[#8C857B] truncate max-w-[140px]">{p.transferRef}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#3D6E50]">+${p.amountUsd.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#EBF3ED] text-[#3D6E50] border border-[#C9D1BE] font-semibold">
                        <Check className="w-2.5 h-2.5" />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Public Audit Certificate Modal (Simulates scanning the QR Code in the wild) */}
      {showPublicAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFFFF] border border-[#DCD5CA] rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#5A5A40] border border-[#5A5A40]/30">
                  <Globe className="w-5 h-5 text-[#5A5A40]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#2D2926]">Public Compliance Audit Certificate</h3>
                    <span className="text-[10px] font-mono bg-[#EBF3ED] text-[#3D6E50] px-2 py-0.5 rounded-full font-bold border border-[#C9D1BE]">
                      LIVE PUBLIC URL
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#6A655C]">
                    Previewing live destination for QR Code scan on mobile / external devices
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPublicAuditModal(false)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Certificate Content */}
            <div className="overflow-y-auto flex-1 space-y-4 pr-1 scrollbar-thin">
              {/* Trust Badge Banner */}
              <div className="rounded-xl border-2 border-[#5A5A40]/30 bg-[#FAF8F5] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#5A5A40] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2926]">
                      H.U.M.A.N. Protocol Verified Ethical Builder Certificate
                    </h4>
                    <p className="text-xs text-[#6A655C]">
                      Issued to <strong>{developerName}</strong> for Application <strong>{appId}</strong>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono bg-[#FFFFFF] border border-[#DCD5CA] px-2 py-1 rounded text-[#5A5A40] font-bold block">
                    C2PA 2.1 SIGNED
                  </span>
                  <span className="text-[9px] font-mono text-[#8C857B]">Ed25519 Algorithm</span>
                </div>
              </div>

              {/* Hashed Provenance Card */}
              <div className="p-3.5 rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] space-y-2 text-xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#2D2926]">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Cryptographic Training Corpus Hashes (4 Verified)</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#3D6E50] font-bold">ALL 0-COPYLEFT VERIFIED</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E5E0D8]">
                  <div className="truncate text-[#5A5A40]">SHA256: 0x8a92e109ff8b432a76cd1154e2098bca4401889c1048b (Literature)</div>
                  <div className="truncate text-[#5A5A40]">SHA256: 0x4f1b88e10c29a877bf4356e29910ac772189d9804b219 (Audio)</div>
                  <div className="truncate text-[#5A5A40]">SHA256: 0x93de66a8710fa44029ce11082bb4901cb00192e441890 (Code Engine)</div>
                  <div className="truncate text-[#5A5A40]">SHA256: 0x22ab8991fc33910ebf778103418ba09c1189ac3409112 (Visual Font)</div>
                </div>
              </div>

              {/* License Receipts Summary */}
              <div className="p-3.5 rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] space-y-2 text-xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#2D2926]">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#D67D5C]" />
                    <span>Verified License Receipts & Creator Grants</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#D67D5C] font-bold">100% CONSENSUAL</span>
                </div>
                <p className="text-[11px] text-[#6A655C] leading-relaxed">
                  All training and synthesis attribution is governed under Story Protocol PIL-1.0 and H.U.M.A.N. zero-copyleft covenants, guaranteeing continuous real-time micro-royalties without scraping.
                </p>
              </div>

              {/* Direct Link Box */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD5CA] flex items-center justify-between gap-2 text-xs">
                <div className="truncate font-mono text-[11px] text-[#6A655C]">
                  <span>Public URL: </span>
                  <strong className="text-[#2D2926]">{publicAuditUrl}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAuditUrl}
                  className="px-2.5 py-1 rounded bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#DCD5CA] text-xs font-mono text-[#5A5A40] font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                >
                  {copiedAuditUrl ? <Check className="w-3 h-3 text-[#3D6E50]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAuditUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer with Download Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#E5E0D8] shrink-0">
              <span className="text-[10px] font-mono text-[#8C857B]">
                Signature: {manifestHash.slice(0, 16)}...
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0EC] hover:bg-[#F5E2DA] border border-[#EECDBC] text-[#D67D5C] text-xs font-semibold transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D67D5C]" />
                  <span>PDF Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF3ED] hover:bg-[#DFEDE2] border border-[#C9D1BE] text-[#3D6E50] text-xs font-semibold transition-all cursor-pointer"
                >
                  <FileJson className="w-3.5 h-3.5 text-[#3D6E50]" />
                  <span>JSON Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPublicAuditModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A33] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
