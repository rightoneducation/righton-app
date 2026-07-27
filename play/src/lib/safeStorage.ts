/**
 * safeStorage — a throw-proof wrapper around window.localStorage.
 *
 * Some devices refuse localStorage access entirely (MDM-locked iPads, Safari
 * "Block All Cookies", quota-0 private mode, partitioned iframes). On those,
 * a raw window.localStorage call THROWS, which — on the identity/join path —
 * dead-ends the router loader on an error screen or, worse, throws AFTER a team
 * is created (orphaning it). This wrapper guarantees the calls never throw.
 *
 * Design: a module-singleton in-memory Map mirrors every write. Reads prefer
 * real storage and only fall back to the mirror when real storage is
 * null/throwing. So when storage is healthy the behavior is identical to today
 * (real value wins, mirror is invisible); when it's blocked, identity survives
 * for the life of the page-load via the mirror.
 *
 * Known limitation: the mirror is per page-load. A blocked-storage student who
 * HARD-RELOADS mid-game loses it and re-enters via game code. That's inherent to
 * a device that won't persist anything, and mirrors the scoring hook's existing
 * "localStorage loss can reset the running total" limitation. It is strictly an
 * improvement over today's crash — no change at all for users with working storage.
 */

const memory = new Map<string, string>();

const hasWindow = typeof window !== 'undefined';

export const safeStorage = {
  getItem(key: string): string | null {
    if (hasWindow) {
      try {
        const value = window.localStorage.getItem(key);
        // Real storage wins whenever it actually holds the value.
        if (value !== null) return value;
      } catch {
        /* fall through to the in-memory mirror */
      }
    }
    return memory.has(key) ? (memory.get(key) as string) : null;
  },

  setItem(key: string, value: string): void {
    // Always mirror first so a subsequent read succeeds even if the real write throws.
    memory.set(key, value);
    if (hasWindow) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        /* best effort — the mirror already holds it */
      }
    }
  },

  removeItem(key: string): void {
    memory.delete(key);
    if (hasWindow) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* best effort */
      }
    }
  },
};

export default safeStorage;
