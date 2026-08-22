/**
 * Safe local storage manager with IndexedDB fallback and automatic quota recovery.
 * Prevents "Setting the value of '...' exceeded the quota" exceptions.
 */

const DB_NAME = 'human_protocol_db';
const STORE_NAME = 'key_val_store';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase | null> | null = null;

function getIDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

// In-memory fallback cache
const memoryCache = new Map<string, any>();

export async function idbSet<T>(key: string, value: T): Promise<void> {
  memoryCache.set(key, value);
  const db = await getIDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function idbGet<T>(key: string): Promise<T | null> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  const db = await getIDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        if (req.result !== undefined) {
          memoryCache.set(key, req.result);
          resolve(req.result as T);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Safely retrieve JSON from localStorage with memory fallback
 */
export function safeGetJSON<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    if (memoryCache.has(key)) {
      return memoryCache.get(key) as T;
    }
  } catch (e) {
    console.warn(`safeGetJSON failed for key ${key}:`, e);
    if (memoryCache.has(key)) {
      return memoryCache.get(key) as T;
    }
  }
  return fallback;
}

/**
 * Safely save JSON to localStorage. If quota is exceeded, handles it gracefully
 * and persists to IndexedDB and memoryCache without crashing.
 */
export function safeSetJSON<T>(key: string, value: T): boolean {
  memoryCache.set(key, value);
  // Also asynchronously persist to IndexedDB
  idbSet(key, value).catch(() => {});

  if (typeof window === 'undefined') return true;

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err: any) {
    console.warn(`localStorage quota exceeded for key "${key}". Falling back to IndexedDB.`, err);

    // Attempt recovery: Clean up any oversized historical items
    try {
      // If it's logos, try to purge or shrink
      if (key === 'human_custom_app_logos') {
        localStorage.removeItem('human_custom_app_logos');
      }
    } catch {
      // ignore
    }
    return false;
  }
}

/**
 * Safely remove an item
 */
export function safeRemove(key: string): void {
  memoryCache.delete(key);
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn(`safeRemove failed for key ${key}:`, e);
  }
}
