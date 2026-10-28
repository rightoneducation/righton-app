import { useEffect } from 'react';

// Locks held right now, across every caller: overlapping modals stack, and the
// page scrolls again only when the last one lets go.
let lockCount = 0;
let overflowBeforeLock = '';
let paddingBeforeLock = '';

/**
 * Holds the page behind still while `active`. The lock is an effect, so its
 * cleanup always releases it: on close, on unmount, and through StrictMode's
 * extra mount. No click handler or close path has to remember to undo it.
 *
 * Hiding the overflow also hides a classic scrollbar (Edge on Windows), which
 * would widen the page and shift it sideways. The body is padded by the
 * scrollbar's width while locked, as MUI's own Modal does for the dialogs.
 */
// eslint-disable-next-line import/prefer-default-export
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return undefined;
    const { body, documentElement } = document;
    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      overflowBeforeLock = body.style.overflow;
      paddingBeforeLock = body.style.paddingRight;
      if (scrollbarWidth > 0) {
        const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${padding + scrollbarWidth}px`;
      }
      body.style.overflow = 'hidden';
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.overflow = overflowBeforeLock;
        body.style.paddingRight = paddingBeforeLock;
      }
    };
  }, [active]);
}
