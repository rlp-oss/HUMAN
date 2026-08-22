/**
 * Real-Time Sub-200ms Cross-Fleet Royalty Broadcast Service
 * Broadcasts verified payment events across open tabs & connected apps.
 */
export interface RoyaltySplitEvent {
  eventId: string;
  sourceAppId: string;
  sourceAppName: string;
  grossUsd: number;
  societySplitUsd: number;
  timestamp: number;
}

type RoyaltyListener = (event: RoyaltySplitEvent) => void;

class RoyaltyBroadcastEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<RoyaltyListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('human_royalty_feed');
        this.channel.onmessage = (msg: MessageEvent<RoyaltySplitEvent>) => {
          if (msg.data && msg.data.eventId) {
            this.notifyListeners(msg.data);
          }
        };
      } catch (err) {
        console.warn('Royalty broadcast channel init failed:', err);
      }
    }
  }

  public broadcastPayment(payment: Omit<RoyaltySplitEvent, 'eventId' | 'timestamp'>) {
    const eventPayload: RoyaltySplitEvent = {
      ...payment,
      eventId: `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(eventPayload);
      } catch (e) {
        console.warn('Failed to broadcast royalty event:', e);
      }
    }
    this.notifyListeners(eventPayload);
  }

  public subscribe(callback: RoyaltyListener): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(event: RoyaltySplitEvent) {
    this.listeners.forEach(fn => {
      try {
        fn(event);
      } catch (err) {
        console.error('Error in royalty listener:', err);
      }
    });
  }
}

export const royaltyBroadcaster = new RoyaltyBroadcastEngine();
