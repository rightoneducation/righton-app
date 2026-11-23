import { RefObject, useLayoutEffect, useState } from 'react';

/*
 * Crops text that can carry KaTeX to its first `maxLines` lines, at the lines
 * the browser actually laid out.
 *
 * -webkit-line-clamp's ellipsis can paint over a rendered formula (#2922), and
 * a fixed height (`5lh`) assumes every line is one nominal line tall: it clips
 * descenders, and cuts through a line that an inline fraction has made taller.
 * So the lines are measured instead. Text rects include descenders and each
 * KaTeX `.base` rect covers the whole formula, so the crop always falls below
 * the last kept line's lowest pixel. Callers draw their own "…" when `isCut`.
 *
 * `ref` must point at the uncropped content, not at the cropping box, so the
 * crop itself never changes the size being observed.
 */

interface LineCrop {
  /** Pixel height to crop to, or null when the text fits. */
  cropHeight: number | null;
  isCut: boolean;
}

interface LineBounds {
  top: number;
  bottom: number;
}

function collectRects(content: HTMLElement): DOMRect[] {
  const rects: DOMRect[] = [];
  const keep = (rect: DOMRect) => {
    if (rect.width > 0 && rect.height > 0) rects.push(rect);
  };

  // Plain text, outside any formula (KaTeX's own text is covered below, and
  // its MathML copy is visually hidden).
  const range = document.createRange();
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.parentElement?.closest('.katex')) {
      range.selectNodeContents(node);
      Array.from(range.getClientRects()).forEach(keep);
    }
  }

  // Each `.base` is an inline-block chunk of a formula (KaTeX breaks long
  // formulas into several), sized to its full height — the `.katex` span
  // itself is inline and only reports its font's height.
  content.querySelectorAll<HTMLElement>('.katex-html .base').forEach((base) => {
    Array.from(base.getClientRects()).forEach(keep);
  });

  return rects;
}

// Groups rects into lines by vertical centre: a tall fraction's rect can
// reach up past the line above, but its centre stays on its own line.
function groupLines(rects: DOMRect[]): LineBounds[] {
  const centre = (rect: DOMRect) => (rect.top + rect.bottom) / 2;
  const lines: LineBounds[] = [];
  [...rects]
    .sort((a, b) => centre(a) - centre(b))
    .forEach((rect) => {
      const line = lines[lines.length - 1];
      if (line && centre(rect) <= line.bottom) {
        line.top = Math.min(line.top, rect.top);
        line.bottom = Math.max(line.bottom, rect.bottom);
      } else {
        lines.push({ top: rect.top, bottom: rect.bottom });
      }
    });
  return lines;
}

export function measureLineCrop(content: HTMLElement, maxLines: number): LineCrop {
  const lines = groupLines(collectRects(content));
  if (lines.length <= maxLines) return { cropHeight: null, isCut: false };
  const contentTop = content.getBoundingClientRect().top;
  return {
    cropHeight: Math.ceil(lines[maxLines - 1].bottom - contentTop),
    isCut: true,
  };
}

export default function useLineCrop(
  ref: RefObject<HTMLElement>,
  maxLines: number,
): LineCrop {
  // Two primitives rather than one object, so a re-measure that finds the
  // same lines bails out instead of re-rendering.
  const [cropHeight, setCropHeight] = useState<number | null>(null);
  const [isCut, setIsCut] = useState(false);

  // Layout effect, so the first crop lands before paint. The observer then
  // re-measures only when the content's size changes (card width, fonts
  // loading) — not on re-renders.
  useLayoutEffect(() => {
    const content = ref.current;
    if (!content) return undefined;
    const measure = () => {
      const result = measureLineCrop(content, maxLines);
      setCropHeight(result.cropHeight);
      setIsCut(result.isCut);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [ref, maxLines]);

  return { cropHeight, isCut };
}
