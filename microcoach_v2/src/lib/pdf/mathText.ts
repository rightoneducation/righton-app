/**
 * LaTeX in generated content, as plain text the PDF can draw.
 *
 * The screen renders `$…$` through KaTeX (MathText); @react-pdf has no math
 * renderer, so without this a handout prints "$-6x+3y>12$" as written. Every
 * content string in the handouts goes through here.
 *
 * Output is limited to glyphs the PDF's Rubik covers (checked with fontTools):
 * ≥ ≤ ≠ × · − ½ ² ³ √ ∞ are in it; arrows, set symbols and Greek letters are
 * not, so those become ASCII or words rather than missing-glyph boxes. A
 * command this doesn't know drops to its bare name rather than leaking markup.
 */

const SYMBOLS: Record<string, string> = {
  geq: '≥',
  ge: '≥',
  leq: '≤',
  le: '≤',
  neq: '≠',
  ne: '≠',
  times: '×',
  cdot: '·',
  div: '÷',
  pm: '±',
  infty: '∞',
  sqrt: '√',
  approx: '≈',
  // Not in Rubik: ASCII or words.
  Rightarrow: '=>',
  implies: '=>',
  rightarrow: '->',
  to: '->',
  Leftrightarrow: '<=>',
  iff: '<=>',
  cap: 'and',
  cup: 'or',
  in: 'in',
  mid: '|',
  lt: '<',
  gt: '>',
  ldots: '...',
  dots: '...',
  cdots: '...',
  degree: '°',
  circ: '°',
};

// Spacing and sizing commands that render as (at most) a space.
const SPACES = new Set(['quad', 'qquad', ',', ';', ':', '!', ' ', 'left', 'right', 'big', 'Big', 'displaystyle', 'textstyle']);

const SUPERSCRIPTS: Record<string, string> = { '2': '²', '3': '³', '1': '¹', '0': '⁰' };

/** `\frac{a}{b}` and friends → `a/b`, parenthesising a multi-term side. */
function replaceFractions(text: string): string {
  const side = (s: string) => (/^[\w.]+$/.test(s.trim()) ? s.trim() : `(${s.trim()})`);
  let out = text;
  // Innermost first, so nested fractions resolve.
  const pattern = /\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/;
  for (let i = 0; i < 20 && pattern.test(out); i += 1) {
    out = out.replace(pattern, (_m, a: string, b: string) => {
      if (a.trim() === '1' && b.trim() === '2') return '½';
      return `${side(a)}/${side(b)}`;
    });
  }
  return out;
}

/** One math span's LaTeX (without its `$` delimiters) as plain text. */
function plainMath(tex: string): string {
  let out = replaceFractions(tex);
  // \text{…}, \mathrm{…}, \operatorname{…}: keep the words.
  // Literal braces (set notation) survive the brace strip below.
  out = out.replace(/\\\{/g, '\uE000').replace(/\\\}/g, '\uE001');
  out = out.replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\s*\{([^{}]*)\}/g, ' $1 ');
  out = out.replace(/\\sqrt\s*\{([^{}]*)\}/g, (_m, inner: string) => `√(${inner})`);
  // Environments (cases, aligned): rows on one line, separated by commas.
  out = out.replace(/\\begin\{[a-z*]+\}|\\end\{[a-z*]+\}/g, ' ');
  out = out.replace(/\\\\(\[[^\]]*\])?/g, ', ');
  out = out.replace(/&/g, ' ');
  // Superscripts: x^2 → x², x^{10} → x^10.
  out = out.replace(/\^(?:\{([0-3])\}|([0-3])(?!\d))/g, (_m, a: string | undefined, b: string | undefined) => SUPERSCRIPTS[a ?? b ?? ''] ?? '');
  out = out.replace(/\^\{([^{}]*)\}/g, '^$1');
  out = out.replace(/_\{([^{}]*)\}/g, '$1').replace(/_(\w)/g, '$1');
  // Remaining commands.
  out = out.replace(/\\([a-zA-Z]+|[,;:! ])/g, (_m, name: string) => {
    if (SPACES.has(name)) return ' ';
    if (name in SYMBOLS) return ` ${SYMBOLS[name]} `;
    return name;
  });
  out = out.replace(/[{}]/g, '').replace(/\uE000/g, '{').replace(/\uE001/g, '}');
  // ASCII hyphen as a minus between or before numbers/letters reads fine in Rubik.
  return out.replace(/\s{2,}/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/\s+([,.;])/g, '$1').trim();
}

/**
 * A content string with every `$…$` / `$$…$$` span replaced by plain text.
 * Text outside math is left alone.
 */
export default function mathText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/\$\$([^$]*)\$\$|\$([^$]*)\$/g, (_m, display: string | undefined, inline: string | undefined) =>
      plainMath(display ?? inline ?? ''))
    // Glyphs outside Rubik that reach the PDF from outside the math: the
    // screen's marks and arrows (the catalogue's "← (Error: …)", "✓", "✗").
    .replace(/[←✓✗✔✘]/g, '')
    .replace(/→/g, '->')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
