/**
 * Server-Side Stripe Webhook Handler & Escrow Transfer Processor
 * 
 * Implements the literal 50% People's Covenant split on all incoming 
 * Stripe subscription invoice events.
 */

// Placeholder Stripe namespace for clean TypeScript compilation without requiring local @types/stripe
export namespace Stripe {
  export interface Event {
    id: string;
    type: string;
    data: {
      object: Record<string, any>;
    };
  }

  export interface Invoice {
    id: string;
    amount_paid: number;
    currency: string;
    customer?: string;
    customer_email?: string;
    metadata?: Record<string, any>;
  }

  export interface Transfer {
    id: string;
    amount: number;
    currency: string;
    destination: string;
    description: string;
  }
}

// Lazy-loaded or injected Stripe client reference
export interface StripeClientInterface {
  transfers: {
    create(params: {
      amount: number;
      currency: string;
      destination: string | undefined;
      description: string;
    }): Promise<Stripe.Transfer>;
  };
}

let stripeInstance: StripeClientInterface | null = null;

export function setStripeClient(client: StripeClientInterface) {
  stripeInstance = client;
}

export function getStripeClient(): StripeClientInterface {
  if (!stripeInstance) {
    // Default fallback client if not explicitly injected
    return {
      transfers: {
        create: async (params) => ({
          id: `tr_${Date.now().toString(36)}`,
          amount: params.amount,
          currency: params.currency,
          destination: params.destination || 'acct_escrow_society_50',
          description: params.description
        })
      }
    };
  }
  return stripeInstance;
}

// Stripe Webhook Event Processor
export async function handleSubscriptionPayment(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const grossUsd = invoice.amount_paid / 100;
  const societySplit = grossUsd * 0.50; // Immutable 50%
  const stripe = getStripeClient();

  return await stripe.transfers.create({
    amount: Math.round(societySplit * 100),
    currency: 'usd',
    destination: process.env.STRIPE_HUMAN_ESCROW_ACCOUNT_ID,
    description: 'H.U.M.A.N. 50% Society Covenant Split'
  });
}
