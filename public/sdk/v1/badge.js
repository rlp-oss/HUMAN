/**
 * H.U.M.A.N. Initiative Web Component Badge SDK v1.0
 * Standalone Custom Element: <human-initiative-badge> & <human-protocol-badge>
 * Usage:
 *   <script type="module" src="https://cdn.humaninitiative.org/sdk/v1/badge.js"></script>
 *   <human-initiative-badge app-id="my-saas-app" theme="emerald" split-pct="50" show-qr="true"></human-initiative-badge>
 */

class HumanInitiativeBadgeElement extends HTMLElement {
  static get observedAttributes() {
    return ['app-id', 'theme', 'split-pct', 'show-qr', 'app-name', 'target-url'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const appId = this.getAttribute('app-id') || 'unregistered-app';
    const appName = this.getAttribute('app-name') || appId.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const theme = this.getAttribute('theme') || 'emerald';
    const splitPct = this.getAttribute('split-pct') || '50';
    const showQr = this.getAttribute('show-qr') === 'true' || this.getAttribute('show-qr') === '';
    const targetUrl = this.getAttribute('target-url') || `https://ais-dev-xbevwyvcnsn355pwprt5ih-321940249756.us-east1.run.app/mission?app=${encodeURIComponent(appId)}`;

    // Theme color mappings
    const themes = {
      emerald: {
        bg: '#0F1715',
        border: '#10B981',
        text: '#F0FDF4',
        accent: '#34D399',
        badgeBg: 'rgba(16, 185, 129, 0.15)',
        badgeText: '#A7F3D0'
      },
      dark: {
        bg: '#18181B',
        border: '#3F3F46',
        text: '#FAFAFA',
        accent: '#10B981',
        badgeBg: 'rgba(255, 255, 255, 0.1)',
        badgeText: '#E4E4E7'
      },
      light: {
        bg: '#F9F7F2',
        border: '#D1FAE5',
        text: '#1C1917',
        accent: '#059669',
        badgeBg: 'rgba(16, 185, 129, 0.12)',
        badgeText: '#065F46'
      }
    };

    const currentTheme = themes[theme] || themes.emerald;
    const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(targetUrl)}`;

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          box-sizing: border-box;
        }
        *, *:before, *:after {
          box-sizing: inherit;
        }
        .human-badge-container {
          display: inline-flex;
          flex-direction: column;
          background: ${currentTheme.bg};
          border: 1px solid ${currentTheme.border};
          color: ${currentTheme.text};
          border-radius: 12px;
          padding: 12px 14px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          max-width: 320px;
        }
        .human-badge-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
        }
        .header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .seal-icon {
          width: 22px;
          height: 22px;
          fill: ${currentTheme.accent};
          flex-shrink: 0;
        }
        .title-col {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .covenant-title {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.2;
          color: ${currentTheme.text};
        }
        .covenant-sub {
          font-size: 10px;
          color: ${currentTheme.accent};
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .split-pill {
          background: ${currentTheme.badgeBg};
          color: ${currentTheme.badgeText};
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          border: 1px solid ${currentTheme.border};
          white-space: nowrap;
        }
        .desc-text {
          font-size: 11px;
          line-height: 1.4;
          opacity: 0.85;
          margin-bottom: ${showQr ? '10px' : '0'};
        }
        .qr-section {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 8px;
          border: 1px dashed ${currentTheme.border};
        }
        .qr-image {
          width: 52px;
          height: 52px;
          border-radius: 4px;
          background: #fff;
          padding: 2px;
        }
        .qr-label {
          font-size: 10px;
          line-height: 1.3;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .qr-scan-title {
          font-weight: 700;
          color: ${currentTheme.accent};
        }
      </style>

      <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="human-badge-container">
        <div class="header-row">
          <svg class="seal-icon" viewBox="0 0 24 24">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 14.5l-3.5-3.5 1.41-1.41L11 13.67l5.09-5.09L17.5 10l-6.5 6.5z"/>
          </svg>
          <div class="title-col">
            <span class="covenant-title">${appName}</span>
            <span class="covenant-sub">H.U.M.A.N. Initiative Verified</span>
          </div>
          <div class="split-pill">${splitPct}% Covenant</div>
        </div>

        <div class="desc-text">
          50% of revenue from this service is automatically routed to creator restitution and community living floors.
        </div>

        ${showQr ? `
          <div class="qr-section">
            <img class="qr-image" src="${qrDataUrl}" alt="Verify on H.U.M.A.N. Ledger" />
            <div class="qr-label">
              <span class="qr-scan-title">Scan to Verify Provenance</span>
              <span>Cryptographic C2PA & Stripe Escrow Audit</span>
            </div>
          </div>
        ` : ''}
      </a>
    `;
  }
}

if (typeof window !== 'undefined') {
  if (!customElements.get('human-initiative-badge')) {
    customElements.define('human-initiative-badge', HumanInitiativeBadgeElement);
  }
  if (!customElements.get('human-protocol-badge')) {
    customElements.define('human-protocol-badge', HumanInitiativeBadgeElement);
  }
}

export { HumanInitiativeBadgeElement as HumanProtocolBadgeElement, HumanInitiativeBadgeElement };
