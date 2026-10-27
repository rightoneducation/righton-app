import { useEffect } from 'react';

// Locks held right now, across every caller: overlapping modals stack, and the
// page scrolls again only when the last one lets go.
let lockCount = 0;
let overflowBeforeLock = '';

/**
 * Holds the page behind still while `active`. The lock is an effect, so its
 * cleanup always releases it: on close, on unmount, and through StrictMode's
 * extra mount. No click handler or close path has to remember to undo it.
 */
// eslint-disable-next-line import/prefer-default-export
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return undefined;
    const { body } = document;
    if (lockCount === 0) {
      overflowBeforeLock = body.style.overflow;
      body.style.overflow = 'hidden';
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) body.style.overflow = overflowBeforeLock;
    };
  }, [active]);
}
