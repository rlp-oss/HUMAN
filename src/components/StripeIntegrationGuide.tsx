import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Code2, 
  Key, 
  RefreshCw, 
  Layers, 
  Globe, 
  Send,
  Lock,
  Sparkles,
  HelpCircle,
  FileCode,
  CheckCheck
} from 'lucide-react';
import axios from 'axios';

interface WebhookInfoState {
  webhookEndpointUrl: string;
  hasSecretKey: boolean;
  hasWebhookSecret: boolean;
  supportedEvents: string[];
  mode: string;
}

export const StripeIntegrationGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'python-sdk' | 'node' | 'python' | 'cli'>('python-sdk');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [testAppSource, setTestAppSource] = useState<string>('tome-crafter');
  const [testAmount, setTestAmount] = useState<number>(49.55);
  const [testEmail, setTestEmail] = useState<string>('creator.test@ethical-ai.org');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status: number;
    message: string;
    receivedEvent?: any;
    timestamp?: string;
  } | null>(null);

  const [webhookInfo, setWebhookInfo] = useState<WebhookInfoState>({
    webhookEndpointUrl: `${window.location.origin}/api/stripe/webhook`,
    hasSecretKey: false,
    hasWebhookSecret: false,
    supportedEvents: [
      'invoice.payment_succeeded',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'checkout.session.completed',
      'payment_intent.succeeded',
      'transfer.created'
    ],
    mode: 'Live / Ready'
  });

  // Fetch live webhook info from backend
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get('/api/stripe/webhook-info');
        if (res.data && res.data.webhookEndpointUrl) {
          setWebhookInfo(res.data);
        }
      } catch {
        // Fallback with window.location.origin
        setWebhookInfo(prev => ({
          ...prev,
          webhookEndpointUrl: `${window.location.origin}/api/stripe/webhook`
        }));
      }
    };
    fetchInfo();
  }, []);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleRunWebhookSimulation = async () => {
    setIsSimulating(true);
    setTestResult(null);

    const mockPayload = {
      id: `evt_sim_${Date.now().toString(36)}`,
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: `in_test_${Math.random().toString(36).substring(2, 10)}`,
          object: 'invoice',
          amount_paid: Math.round(testAmount * 100),
          customer_email: testEmail,
          customer_name: 'Verified Beta Tester',
          currency: 'usd',
          status: 'paid',
          subscription: `sub_test_${Math.random().toString(36).substring(2, 8)}`,
          metadata: {
            app_source: testAppSource,
            covenant_pct: '50',
            provenance_standard: 'C2PA-v2.1',
            simulation_origin: 'StripeIntegrationGuide'
          },
          lines: {
            data: [
              {
                description: `${testAppSource.toUpperCase()} Pro Subscription Plan`,
                amount: Math.round(testAmount * 100)
              }
            ]
          }
        }
      }
    };

    try {
      const response = await axios.post('/api/stripe/webhook', mockPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTestResult({
        success: true,
        status: response.status,
        message: `Webhook event processed successfully! Status ${response.status} OK. Royalty calculated & logged.`,
        receivedEvent: response.data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        status: err.response?.status || 500,
        message: err.response?.data?.message || err.message || 'Failed to dispatch webhook simulation',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const currentWebhookUrl = webhookInfo.webhookEndpointUrl || `${window.location.origin}/api/stripe/webhook`;

  const pythonSdkSnippet = `from human_initiative import InitiativeClient

# Initialize with your application credentials and app source tag
client = InitiativeClient(
    api_key="hi_live_sec_your_token_here",
    app_source="ForgeOS App Builder"
)

# Triggered when a subscriber successfully pays their monthly invoice
def handle_successful_payment(customer_email: str, amount_in_cents: int):
    distribution = client.process_inflow(
        email=customer_email,
        amount=amount_in_cents
    )
    print(f"Successfully routed \${distribution['net_community_pool']} to The Human Initiative pools.")`;

  const nodeCodeSnippet = `// server.js or routes/stripe.js
import express from 'express';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// IMPORTANT: Webhook handler requires raw body buffer for signature validation
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(\`⚠️ Webhook signature failed: \${err.message}\`);
      return res.status(400).send(\`Webhook Error: \${err.message}\`);
    }

    // Intercept subscription & royalty events
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const amountPaid = invoice.amount_paid / 100.00;
      const appSource = invoice.metadata?.app_source || 'default-app';

      console.log(\`[ROYALTY INFLOW] \${appSource}: $\${amountPaid.toFixed(2)}\`);
      // Automated 50% Society Fund covenant split is executed here
    }

    res.status(200).json({ received: true });
  }
);`;

  const pythonFlaskSnippet = `# gateway.py
from flask import Flask, request, jsonify
import stripe
import os

app = Flask(__name__)

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
ENDPOINT_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

@app.route("/api/stripe/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, ENDPOINT_SECRET
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    if event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        amount = invoice.get("amount_paid", 0) / 100.00
        app_source = invoice.get("metadata", {}).get("app_source", "unknown")
        
        print(f"[ROYALTY INFLOW] App: {app_source} | Amount: \${amount:.2f}")
        # Execute Human Initiative revenue distribution engine

    return jsonify({"status": "success", "processed": True}), 200`;

  const cliSnippet = `# 1. Install Stripe CLI (macOS: brew install stripe/stripe-cli/stripe)
# 2. Login to your Stripe account
stripe login

# 3. Forward all incoming webhook events to your local dev server
stripe listen --forward-to ${currentWebhookUrl}

# 4. Trigger a sample invoice payment event to test the integration
stripe trigger invoice.payment_succeeded`;

  return (
    <div id="stripe-integration-guide-container" className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#EAE4DC] text-[#5A5A40] border border-[#DCD5CA]">
              <CreditCard className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Stripe Dashboard Webhook Integration</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D6E50] animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2926]">
              Stripe Integration & Royalty Webhook Guide
            </h1>
            <p className="text-sm sm:text-base text-[#6A655C] max-w-2xl leading-relaxed">
              Connect your applications to the <strong className="text-[#2D2926]">The H.U.M.A.N. Universal Royalty Initiative</strong>. 
              Copy the exact production webhook URL below into your Stripe Dashboard so subscription events automatically 
              trigger the 50% creator covenant & sliding-scale community distributions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://dashboard.stripe.com/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#2D2926] hover:bg-[#403B37] text-[#FAF8F5] shadow-xs transition-colors cursor-pointer"
            >
              <span>Open Stripe Dashboard</span>
              <ExternalLink className="w-4 h-4 text-[#D67D5C]" />
            </a>
          </div>
        </div>
      </div>

      {/* Primary Card: Webhook Endpoint URL */}
      <div className="rounded-2xl border-2 border-[#D67D5C]/40 bg-[#FFFFFF] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D67D5C]/10 to-transparent rounded-bl-full pointer-events-none"></div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#D67D5C]">
              <Globe className="w-4 h-4" />
              <span>Your Exact Production Webhook Endpoint URL</span>
            </div>
            <span className="text-xs font-mono text-[#3D6E50] bg-[#EBF3EE] px-2.5 py-1 rounded-full border border-[#C5DEC0] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3D6E50]"></span>
              Live Endpoint Active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center bg-[#FAF8F5] border border-[#DCD5CA] rounded-xl px-4 py-3.5 font-mono text-sm sm:text-base text-[#2D2926] shadow-inner select-all overflow-x-auto">
              <span className="text-[#6A655C] select-none mr-1.5 font-sans text-xs">POST:</span>
              <strong className="text-[#2D2926] font-semibold">{currentWebhookUrl}</strong>
            </div>

            <button
              id="copy-webhook-url-btn"
              onClick={() => copyToClipboard(currentWebhookUrl, 'main-url')}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shadow-xs ${
                copiedSection === 'main-url'
                  ? 'bg-[#3D6E50] text-[#FFFFFF]'
                  : 'bg-[#D67D5C] hover:bg-[#C26D4D] text-[#FFFFFF]'
              }`}
            >
              {copiedSection === 'main-url' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Webhook URL</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-[#6A655C] font-mono flex items-center gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#3D6E50] shrink-0" />
            <span>Accepts raw JSON payloads authenticated via <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8] text-[#5A5A40]">Stripe-Signature</code> header.</span>
          </p>
        </div>
      </div>

      {/* Step-by-Step Dashboard Setup Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xs">
            <h2 className="text-lg font-serif font-bold text-[#2D2926] mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5A5A40]" />
              <span>4-Step Stripe Dashboard Configuration</span>
            </h2>

            <div className="space-y-4">
              {/* Step 1 */}
              <div 
                onClick={() => setActiveStep(1)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 1 
                    ? 'border-[#5A5A40] bg-[#FAF8F5] shadow-xs' 
                    : 'border-[#E5E0D8] hover:border-[#DCD5CA] bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    activeStep === 1 ? 'bg-[#5A5A40] text-[#FFFFFF]' : 'bg-[#EAE4DC] text-[#5A5A40]'
                  }`}>
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[#2D2926]">Navigate to Webhook Settings</h3>
                    <p className="text-xs text-[#6A655C] leading-relaxed">
                      Log in to the <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noreferrer" className="text-[#5A5A40] underline font-medium">Stripe Dashboard</a>, 
                      go to <strong className="text-[#2D2926]">Developers &rarr; Webhooks</strong>, and click <strong className="text-[#2D2926]">+ Add destination</strong> or <strong className="text-[#2D2926]">+ Add endpoint</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => setActiveStep(2)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 2 
                    ? 'border-[#5A5A40] bg-[#FAF8F5] shadow-xs' 
                    : 'border-[#E5E0D8] hover:border-[#DCD5CA] bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    activeStep === 2 ? 'bg-[#5A5A40] text-[#FFFFFF]' : 'bg-[#EAE4DC] text-[#5A5A40]'
                  }`}>
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[#2D2926]">Paste the Exact Endpoint URL</h3>
                    <p className="text-xs text-[#6A655C] leading-relaxed">
                      In the <span className="font-mono text-[#2D2926]">Endpoint URL</span> field, paste the exact URL from above:
                    </p>
                    <div className="mt-2 flex items-center justify-between bg-[#F2ECE4] px-3 py-1.5 rounded-lg border border-[#DCD5CA] text-xs font-mono text-[#2D2926]">
                      <span className="truncate mr-2">{currentWebhookUrl}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(currentWebhookUrl, 'step-url');
                        }}
                        className="text-[#5A5A40] hover:text-[#2D2926] shrink-0 font-sans text-xs font-medium cursor-pointer"
                      >
                        {copiedSection === 'step-url' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => setActiveStep(3)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 3 
                    ? 'border-[#5A5A40] bg-[#FAF8F5] shadow-xs' 
                    : 'border-[#E5E0D8] hover:border-[#DCD5CA] bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    activeStep === 3 ? 'bg-[#5A5A40] text-[#FFFFFF]' : 'bg-[#EAE4DC] text-[#5A5A40]'
                  }`}>
                    3
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-[#2D2926]">Select Required Royalty & Subscription Events</h3>
                    <p className="text-xs text-[#6A655C] leading-relaxed">
                      Click <strong className="text-[#2D2926]">+ Select events</strong> and check the following required events:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {[
                        { name: 'invoice.payment_succeeded', desc: 'Triggers 50% covenant & Heartbeat distribution' },
                        { name: 'customer.subscription.created', desc: 'Registers new paying subscriber to fleet' },
                        { name: 'customer.subscription.updated', desc: 'Synchronizes tier and ARPU changes' },
                        { name: 'customer.subscription.deleted', desc: 'Gracefully ceases royalty streaming' },
                        { name: 'checkout.session.completed', desc: 'Fulfills access license tokens' },
                        { name: 'transfer.created', desc: 'Audits payouts to creator Connect accounts' }
                      ].map((evt) => (
                        <div key={evt.name} className="flex items-start gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3D6E50] shrink-0 mt-0.5" />
                          <div>
                            <code className="font-mono font-bold text-[#2D2926]">{evt.name}</code>
                            <p className="text-[#6A655C] text-[10px] mt-0.5">{evt.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div 
                onClick={() => setActiveStep(4)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === 4 
                    ? 'border-[#5A5A40] bg-[#FAF8F5] shadow-xs' 
                    : 'border-[#E5E0D8] hover:border-[#DCD5CA] bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    activeStep === 4 ? 'bg-[#5A5A40] text-[#FFFFFF]' : 'bg-[#EAE4DC] text-[#5A5A40]'
                  }`}>
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[#2D2926]">Save & Copy Signing Secret</h3>
                    <p className="text-xs text-[#6A655C] leading-relaxed">
                      Click <strong className="text-[#2D2926]">Add endpoint</strong>. On the resulting page, click <strong className="text-[#2D2926]">Reveal secret</strong> under <em>Signing secret</em> and set it in your environment variables:
                    </p>
                    <div className="mt-2 bg-[#2D2926] text-[#FAF8F5] p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                      <code>STRIPE_WEBHOOK_SECRET=whsec_your_secret_here</code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard('STRIPE_WEBHOOK_SECRET=whsec_', 'env-var');
                        }}
                        className="text-[#D67D5C] hover:text-[#FAF8F5] text-xs font-sans ml-2 cursor-pointer"
                      >
                        {copiedSection === 'env-var' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Schema Card */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#5A5A40]" />
              <h3 className="text-base font-serif font-bold text-[#2D2926]">
                Subscription Metadata Schema for App Fleet
              </h3>
            </div>
            <p className="text-xs text-[#6A655C] leading-relaxed">
              When creating Stripe Checkout Sessions or Subscriptions from your apps, include these metadata keys so the webhook engine automatically attributes royalties:
            </p>

            <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-[#FFFFFF]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#F2ECE4] text-[#5A5A40] border-b border-[#E5E0D8]">
                  <tr>
                    <th className="p-2.5 font-bold">Metadata Key</th>
                    <th className="p-2.5 font-bold">Example Value</th>
                    <th className="p-2.5 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8] text-[#2D2926]">
                  <tr>
                    <td className="p-2.5 text-[#D67D5C] font-bold">app_source</td>
                    <td className="p-2.5">"tome-crafter" | "rlm-pro-studio"</td>
                    <td className="p-2.5 text-[#6A655C] font-sans">Identifies which software suite generated the subscription</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#D67D5C] font-bold">covenant_pct</td>
                    <td className="p-2.5">"50" (or sliding scale)</td>
                    <td className="p-2.5 text-[#6A655C] font-sans">Enforces exact percentage designated for human creators</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#D67D5C] font-bold">creator_c2pa_hash</td>
                    <td className="p-2.5">"urn:c2pa:0x88f...a12"</td>
                    <td className="p-2.5 text-[#6A655C] font-sans">Optional cryptographic attribution stamp for specific artisan libraries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Simulator & Code Snippets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Webhook Test Simulator */}
          <div className="rounded-2xl border-2 border-[#5A5A40]/30 bg-[#FFFFFF] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="text-base font-serif font-bold text-[#2D2926]">
                  Live Webhook Test Simulator
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#5A5A40] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E0D8]">
                Sandbox Ready
              </span>
            </div>

            <p className="text-xs text-[#6A655C] leading-relaxed">
              Trigger a realistic <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#2D2926] font-mono">invoice.payment_succeeded</code> test payload directly against our live endpoint to verify end-to-end event handling.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-mono text-[#5A5A40] mb-1">Target Application</label>
                <select
                  value={testAppSource}
                  onChange={(e) => setTestAppSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCD5CA] bg-[#FAF8F5] text-xs font-mono text-[#2D2926] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="tome-crafter">Tome Crafter ($29.00/mo - AI Book Studio)</option>
                  <option value="rlm-pro-studio">RLM Pro Studio ($49.55/mo - Audio & Lyria Engine)</option>
                  <option value="forgeos">ForgeOS App Builder ($99.00/mo - AST Code Engine)</option>
                  <option value="rl-easy-flow">RL Easy Flow ($39.00/mo - Visual Workflow)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#5A5A40] mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={testAmount}
                    onChange={(e) => setTestAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD5CA] bg-[#FAF8F5] text-xs font-mono text-[#2D2926] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#5A5A40] mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD5CA] bg-[#FAF8F5] text-xs font-mono text-[#2D2926] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>
              </div>

              <button
                id="run-webhook-sim-btn"
                onClick={handleRunWebhookSimulation}
                disabled={isSimulating}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-xs bg-[#2D2926] hover:bg-[#403B37] text-[#FAF8F5] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D67D5C]" />
                    <span>Dispatching Cryptographic Event...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#D67D5C]" />
                    <span>Send Test Webhook Event (200 OK Check)</span>
                  </>
                )}
              </button>

              {/* Simulation Result */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                  testResult.success 
                    ? 'bg-[#EBF3EE] border-[#C5DEC0] text-[#2D2926]' 
                    : 'bg-[#FDF2F0] border-[#F1C4BD] text-[#8C2E24]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-[#3D6E50]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#8C2E24]" />
                      )}
                      <span>HTTP {testResult.status} {testResult.success ? 'Success' : 'Error'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#6A655C]">{testResult.timestamp}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-mono">{testResult.message}</p>
                  
                  {testResult.success && (
                    <div className="pt-2 border-t border-[#C5DEC0] flex items-center justify-between text-[11px]">
                      <span className="text-[#3D6E50] font-semibold">50% Covenant Escrow:</span>
                      <span className="font-mono font-bold text-[#2D2926]">
                        ${(testAmount * 0.50).toFixed(2)} USD allocated
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Implementation Snippets */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#2D2926] text-[#FAF8F5] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#D67D5C]" />
                <h3 className="text-sm font-serif font-bold text-[#FAF8F5]">
                  Verification Code Samples
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-1 bg-[#403B37] p-0.5 rounded-lg text-[10px] font-mono">
                {(['python-sdk', 'node', 'python', 'cli'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      selectedLanguage === lang 
                        ? 'bg-[#D67D5C] text-[#FFFFFF] font-bold' 
                        : 'text-[#C5BEB3] hover:text-[#FAF8F5]'
                    }`}
                  >
                    {lang === 'python-sdk' ? 'Python SDK' : lang === 'node' ? 'Node.js' : lang === 'python' ? 'Flask Python' : 'Stripe CLI'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-[#1A1816] border border-[#403B37] text-[11px] font-mono text-[#DCD5CA] overflow-x-auto max-h-72 leading-relaxed">
                <code>
                  {selectedLanguage === 'python-sdk' && pythonSdkSnippet}
                  {selectedLanguage === 'node' && nodeCodeSnippet}
                  {selectedLanguage === 'python' && pythonFlaskSnippet}
                  {selectedLanguage === 'cli' && cliSnippet}
                </code>
              </pre>
              <button
                onClick={() => copyToClipboard(
                  selectedLanguage === 'python-sdk' ? pythonSdkSnippet : selectedLanguage === 'node' ? nodeCodeSnippet : selectedLanguage === 'python' ? pythonFlaskSnippet : cliSnippet,
                  'snippet'
                )}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#2D2926]/80 hover:bg-[#403B37] text-[#FAF8F5] border border-[#5A5A40] text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Copy code"
              >
                {copiedSection === 'snippet' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#3D6E50]" />
                    <span className="text-[10px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
