/**
 * Cross-Tab Atomic State Synchronization & Storage Lock Service
 * 
 * Uses Web Locks API (navigator.locks) and BroadcastChannel API
 * to prevent race conditions during theme updates, token adjustments,
 * and ledger state synchronization across multiple open browser tabs.
 */

// Initialize BroadcastChannel with fallback for non-browser or older environments
let channel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel('human_initiative_sync');
  } catch (err) {
    console.warn('BroadcastChannel initialization failed:', err);
  }
}

// Atomic Cross-Tab State Lock
export async function updateUniversalToken(key: string, value: any): Promise<void> {
  if (typeof window === 'undefined') return;

  if ('locks' in navigator && navigator.locks) {
    await navigator.locks.request('human_storage_lock', async () => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        if (channel) {
          channel.postMessage({ type: 'SYNC_UPDATE', key, value });
        }
      } catch (e) {
        console.error('Failed to update storage within lock:', e);
      }
    });
  } else {
    // Fallback for browsers without navigator.locks
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (channel) {
        channel.postMessage({ type: 'SYNC_UPDATE', key, value });
      }
    } catch (e) {
      console.error('Failed to update storage in fallback mode:', e);
    }
  }
}

/**
 * Hook or subscriber for listening to cross-tab updates
 */
export function subscribeToUniversalTokenSync(
  callback: (data: { type: string; key: string; value: any }) => void
): () => void {
  if (!channel) return () => {};

  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'SYNC_UPDATE') {
      callback(event.data);
    }
  };

  channel.addEventListener('message', handleMessage);
  return () => {
    if (channel) {
      channel.removeEventListener('message', handleMessage);
    }
  };
}
