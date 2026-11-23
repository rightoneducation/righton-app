import { RefObject, useEffect, useState } from 'react';

/*
 * Whether a height-capped, overflow-hidden element is hiding some of its
 * content. Used where text that can carry KaTeX is cut to a few lines: the
 * browser's own line-clamp ellipsis can paint over a rendered formula, so
 * those places crop without one and draw their own "…" outside the text.
 *
 * A ResizeObserver reports once when it starts observing, then whenever the
 * box changes size (card width, fonts loading, a row opening), so no separate
 * first measurement or resize listener is needed.
 */
export default function useIsCut(ref: RefObject<HTMLElement>): boolean {
  const [isCut, setIsCut] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(() => {
      setIsCut(element.scrollHeight > element.clientHeight);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isCut;
}
