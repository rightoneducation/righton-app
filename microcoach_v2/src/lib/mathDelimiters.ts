/*
 * Where the math is in a generated string. One parser for the screen
 * (components/MathText, through KaTeX) and the PDFs (lib/mathText, as plain
 * text), so both agree on what counts as math.
 *
 * Delimiters: $$…$$ and \[…\] (display), $…$ and \(…\) (inline).
 *
 * Inline $…$ follows the closing half of Pandoc's rule, because generated and
 * standards text also carries prices ("We paid $75 for 15 hamburgers, which is
 * a rate of $5"):
 *   - the closing $ comes right after a non-space,
 *   - and is not followed by a digit.
 * Under that rule "$75 … of $5" is two prices, not one formula, while every
 * $…$ the pipeline writes ($y > 2x + 4$, $x_0$, $\frac{1}{2}$) still matches.
 * Pandoc's opening half (no space after the opening $) is left out: the
 * pipeline writes "$ (0,4)$", and prices are already ruled out by the close.
 * A backslash-escaped \$ is a literal dollar sign and never opens or closes.
 */

export type MathPart =
  | { type: 'text'; content: string }
  | { type: 'math'; content: string; display: boolean };

// Alternatives in priority order: $$ before $ so the outer $ cannot take the
// first half of a display pair.
const DELIMITERS = new RegExp(
  [
    String.raw`(?<!\\)\$\$([\s\S]+?)(?<!\\)\$\$`, // $$…$$
    String.raw`\\\[([\s\S]+?)\\\]`, // \[…\]
    String.raw`\\\(([\s\S]+?)\\\)`, // \(…\)
    // $…$: not escaped; the close follows a non-space and precedes no digit.
    String.raw`(?<![\\$])\$(?!\$)((?:\\\$|[^$\n])*?[^\s\\$])\$(?![\d$])`,
  ].join('|'),
  'g',
);

/** The string as runs of text and math, in order; text keeps `\$` as `$`. */
export function splitMath(text: string): MathPart[] {
  const parts: MathPart[] = [];
  const pushText = (content: string) => {
    if (!content) return;
    const plain = content.replace(/\\\$/g, '$');
    const last = parts[parts.length - 1];
    if (last?.type === 'text') last.content += plain;
    else parts.push({ type: 'text', content: plain });
  };

  let lastIndex = 0;
  const regex = new RegExp(DELIMITERS.source, 'g');
  for (let match = regex.exec(text); match; match = regex.exec(text)) {
    pushText(text.slice(lastIndex, match.index));
    const [, displayDollars, displayBracket, inlineParen, inlineDollar] = match;
    const display = displayDollars ?? displayBracket;
    parts.push({
      type: 'math',
      content: (display ?? inlineParen ?? inlineDollar ?? '').trim(),
      display: display !== undefined,
    });
    lastIndex = regex.lastIndex;
  }
  pushText(text.slice(lastIndex));
  return parts;
}
