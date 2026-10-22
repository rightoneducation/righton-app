/* eslint-disable no-restricted-syntax, no-continue --
   a DOM walk with early outs reads clearest as plain loops. */
/*
 * Layout checks run inside the page (page.evaluate), so this function must be
 * self-contained: no imports, no outer references.
 *
 * What it looks for, all in what a person would see:
 *   clipped  text cut off by an ancestor with overflow hidden/clip (a tab strip
 *            squeezed by its sibling, a label taller than its box)
 *   edge     text sitting against the edge of a coloured surface (no inset)
 *   squeezed a scroll area inside an overlay that leaves little room to read
 *   overlap  two pieces of visible text drawn over each other
 *   target   a control smaller than 24px on a phone
 * Intended truncation (text-overflow: ellipsis) is listed separately.
 *
 * When an overlay is open (modal, dialog, menu), only its contents are
 * checked: the page under the scrim is not what the person is looking at.
 * Each flagged element gets data-qa-issue="<n>" so the caller can screenshot it.
 */

export interface LayoutIssue {
  kind: 'clipped' | 'edge' | 'squeezed' | 'overlap' | 'target';
  index: number;
  path: string;
  text: string;
  detail: string;
}

export interface LayoutResult {
  issues: LayoutIssue[];
  truncated: { path: string; text: string }[];
  overlayOpen: boolean;
}

export function runLayoutChecks({ isPhone }: { isPhone: boolean }): LayoutResult {
  const OVERLAY_SELECTOR =
    '.ReactModal__Content, .MuiDialog-paper, .MuiPopover-paper, .MuiMenu-paper';
  const issues: LayoutIssue[] = [];
  const truncated: { path: string; text: string }[] = [];
  const flagged = new Set<string>();

  document.querySelectorAll('[data-qa-issue]').forEach((el) => el.removeAttribute('data-qa-issue'));

  const overlays = Array.from(document.querySelectorAll<HTMLElement>(OVERLAY_SELECTOR)).filter(
    (el) => el.getBoundingClientRect().width > 0,
  );
  const inScope = (el: Element) =>
    overlays.length === 0 || overlays.some((overlay) => overlay.contains(el));

  const describe = (el: Element): string => {
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && node !== document.body && parts.length < 4) {
      const cls = Array.from(node.classList)
        .filter((c) => /^Mui[A-Z]/.test(c) || /^[a-z]+-[a-z]/.test(c))
        .slice(0, 1)
        .join('.');
      const role = node.getAttribute('role');
      parts.unshift(`${node.tagName.toLowerCase()}${cls ? `.${cls}` : ''}${role ? `[role=${role}]` : ''}`);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const flag = (kind: LayoutIssue['kind'], el: Element, text: string, detail: string) => {
    const key = `${kind}|${describe(el)}|${text.slice(0, 40)}`;
    if (flagged.has(key)) return;
    flagged.add(key);
    const index = issues.length;
    if (!el.hasAttribute('data-qa-issue')) el.setAttribute('data-qa-issue', String(index));
    issues.push({ kind, index: Number(el.getAttribute('data-qa-issue')), path: describe(el), text: text.slice(0, 80), detail });
  };

  // An sr-only / visually-hidden box: 1px, clipped on purpose.
  const isVisuallyHidden = (el: Element) => {
    let node: Element | null = el;
    while (node && node !== document.body) {
      const r = node.getBoundingClientRect();
      const s = getComputedStyle(node);
      if ((r.width <= 1 || r.height <= 1) && (s.overflow === 'hidden' || s.clip !== 'auto')) return true;
      node = node.parentElement;
    }
    return false;
  };

  // Every visible text node in scope, with the union of its line boxes.
  // rect is the union of the node's line boxes; lines are kept for the overlap
  // check, where a union of a wrapped run would swallow inline neighbours.
  interface TextBox { node: Text; el: HTMLElement; rect: DOMRect; lines: DOMRect[]; text: string }
  const texts: TextBox[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const node = n as Text;
    const text = (node.textContent ?? '').trim();
    const el = node.parentElement;
    if (!text || !el || !inScope(el)) continue;
    const style = getComputedStyle(el);
    if (style.visibility !== 'visible' || style.display === 'none' || Number(style.opacity) === 0) continue;
    if (el.closest('[aria-hidden="true"], script, style, noscript, textarea, option')) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0);
    if (rects.length === 0) continue;
    if (isVisuallyHidden(el)) continue;
    const left = Math.min(...rects.map((r) => r.left));
    const top = Math.min(...rects.map((r) => r.top));
    const right = Math.max(...rects.map((r) => r.right));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    texts.push({ node, el, rect: new DOMRect(left, top, right - left, bottom - top), lines: rects, text });
  }

  // clipped: walk up to each ancestor that clips an axis. A scroll area
  // (auto/scroll) is meant to hide overflow, so that axis stops there.
  for (const box of texts) {
    let clipX = true;
    let clipY = true;
    let ancestor: HTMLElement | null = box.el;
    while (ancestor && ancestor !== document.body && (clipX || clipY)) {
      const s = getComputedStyle(ancestor);
      const r = ancestor.getBoundingClientRect();
      const innerLeft = r.left + ancestor.clientLeft;
      const innerTop = r.top + ancestor.clientTop;
      const cut: string[] = [];
      if (clipX && (s.overflowX === 'hidden' || s.overflowX === 'clip')) {
        const over = Math.max(innerLeft - box.rect.left, box.rect.right - (innerLeft + ancestor.clientWidth));
        if (over > 1) cut.push(`${Math.round(over)}px sideways`);
      }
      if (clipY && (s.overflowY === 'hidden' || s.overflowY === 'clip')) {
        const over = Math.max(innerTop - box.rect.top, box.rect.bottom - (innerTop + ancestor.clientHeight));
        if (over > 1) cut.push(`${Math.round(over)}px vertically`);
      }
      if (cut.length) {
        const isEllipsis = s.textOverflow === 'ellipsis' || getComputedStyle(box.el).textOverflow === 'ellipsis';
        if (isEllipsis) truncated.push({ path: describe(ancestor), text: box.text.slice(0, 80) });
        else flag('clipped', ancestor, box.text, `text cut off ${cut.join(', ')} (box ${Math.round(r.width)}x${Math.round(r.height)})`);
        break;
      }
      if (s.overflowX === 'auto' || s.overflowX === 'scroll') clipX = false;
      if (s.overflowY === 'auto' || s.overflowY === 'scroll') clipY = false;
      ancestor = ancestor.parentElement;
    }
  }

  // Fixed and sticky things (the Need help button, the header) float over the
  // page by design; outside an overlay they are left out of the overlap check.
  const isFixed = (el: Element) => {
    let node: Element | null = el;
    while (node && node !== document.body) {
      const { position } = getComputedStyle(node);
      if (position === 'fixed' || position === 'sticky') return true;
      node = node.parentElement;
    }
    return false;
  };
  // Only the part of each text that is actually painted: cut to every
  // ancestor that clips or scrolls. Text hidden that way is not drawn over
  // anything (clipping itself is reported above).
  const visiblePart = (box: TextBox, rect: DOMRect = box.rect) => {
    let { left, top, right, bottom } = rect;
    let node: HTMLElement | null = box.el;
    while (node && node !== document.body) {
      const st = getComputedStyle(node);
      if (st.overflowX !== 'visible' || st.overflowY !== 'visible') {
        const r = node.getBoundingClientRect();
        const innerLeft = r.left + node.clientLeft;
        const innerTop = r.top + node.clientTop;
        if (st.overflowX !== 'visible') {
          left = Math.max(left, innerLeft);
          right = Math.min(right, innerLeft + node.clientWidth);
        }
        if (st.overflowY !== 'visible') {
          top = Math.max(top, innerTop);
          bottom = Math.min(bottom, innerTop + node.clientHeight);
        }
      }
      node = node.parentElement;
    }
    return right > left && bottom > top ? { left, top, right, bottom } : null;
  };

  // edge: the nearest surface that reads as its own (a background different
  // from what is behind it); text closer than 3px to one of its edges.
  const parseColor = (c: string) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = '1'] = m[1].split(/[ ,/]+/).filter(Boolean);
    return { key: `${r},${g},${b}`, alpha: Number(a) };
  };
  const ownBackground = (el: Element) => {
    const c = parseColor(getComputedStyle(el).backgroundColor);
    return c && c.alpha > 0 ? c.key : null;
  };
  const backgroundBehind = (el: Element): string => {
    let node = el.parentElement;
    while (node) {
      const bg = ownBackground(node);
      if (bg) return bg;
      node = node.parentElement;
    }
    return '255,255,255';
  };
  for (const box of texts) {
    // Text that is truncated or scrolled out of view is not judged by its
    // full layout box (ellipsis keeps the full box; clipping is reported above).
    const shown = visiblePart(box);
    if (!shown) continue;
    const fullyShown =
      Math.abs(shown.left - box.rect.left) < 1 &&
      Math.abs(shown.right - box.rect.right) < 1 &&
      Math.abs(shown.top - box.rect.top) < 1 &&
      Math.abs(shown.bottom - box.rect.bottom) < 1;
    if (!fullyShown) continue;
    let surface: HTMLElement | null = box.el;
    while (surface && surface !== document.body) {
      const bg = ownBackground(surface);
      if (bg && bg !== backgroundBehind(surface)) break;
      surface = surface.parentElement;
    }
    if (!surface || surface === document.body) continue;
    const r = surface.getBoundingClientRect();
    // Only text that sits inside the surface; clipped text is reported above.
    if (box.rect.top < r.top - 1 || box.rect.bottom > r.bottom + 1) continue;
    const gaps = {
      top: box.rect.top - r.top,
      bottom: r.bottom - box.rect.bottom,
      left: box.rect.left - r.left,
      right: r.right - box.rect.right,
    };
    const tight = Object.entries(gaps).filter(([, gap]) => gap < 3);
    if (tight.length) {
      flag('edge', surface, box.text, `text ${tight.map(([side, gap]) => `${Math.round(gap)}px from ${side}`).join(', ')}`);
    }
  }

  // squeezed: a scroll area in an overlay with under 45% of the screen to read in.
  document.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (overlays.length === 0 || !inScope(el)) return;
    const s = getComputedStyle(el);
    if (s.overflowY !== 'auto' && s.overflowY !== 'scroll') return;
    if (el.scrollHeight <= el.clientHeight + 1) return;
    const share = el.clientHeight / window.innerHeight;
    if (share < 0.45) {
      flag('squeezed', el, (el.textContent ?? '').trim(), `scrolls ${el.scrollHeight}px of content in ${el.clientHeight}px (${Math.round(share * 100)}% of the screen)`);
    }
  });

  // overlap: visible text over other visible text.
  const candidates = texts
    .filter((box) => overlays.length > 0 || !isFixed(box.el))
    .flatMap((box) => {
      const shown = box.lines.flatMap((line) => {
        const part = visiblePart(box, line);
        return part ? [part] : [];
      });
      return shown.length ? [{ ...box, shown }] : [];
    });
  for (let i = 0; i < candidates.length; i += 1) {
    for (let j = i + 1; j < candidates.length; j += 1) {
      const a = candidates[i];
      const b = candidates[j];
      if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      let worst = { w: 0, h: 0 };
      for (const ra of a.shown) {
        for (const rb of b.shown) {
          const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (w > 4 && h > 4 && w * h > worst.w * worst.h) worst = { w, h };
        }
      }
      if (worst.w > 0) {
        flag('overlap', a.el, `${a.text} / ${b.text}`, `overlaps by ${Math.round(worst.w)}x${Math.round(worst.h)}px`);
      }
    }
  }

  // target: controls under 24px on a phone.
  if (isPhone) {
    document
      .querySelectorAll<HTMLElement>('button, a[href], [role="tab"], [role="button"], [role="menuitem"], input[type="checkbox"], input[type="radio"]')
      .forEach((el) => {
        if (!inScope(el) || el.closest('[aria-hidden="true"]')) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || isVisuallyHidden(el)) return;
        if (getComputedStyle(el).visibility !== 'visible') return;
        if (r.width < 24 || r.height < 24) {
          flag('target', el, (el.textContent || el.getAttribute('aria-label') || '').trim(), `${Math.round(r.width)}x${Math.round(r.height)}px`);
        }
      });
  }

  return { issues, truncated, overlayOpen: overlays.length > 0 };
}
