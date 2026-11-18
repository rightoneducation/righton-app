/**
 * Where math sits in a generated string, by the app's rules. Copied from
 * src/lib/mathDelimiters.ts (DELIMITERS, STRAY_COMMAND), which this lambda can't
 * import: change both together.
 */

// $$ before $ so the outer $ cannot take the first half of a display pair.
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

/** Commands the app renders even without delimiters, with their {…} arguments. */
export const STRAY_COMMAND =
  /(?<!\\)\\(?:leq|geq|neq|le|ge|ne|lt|gt|times|div|cdot|pm|approx|infty|Rightarrow|implies|rightarrow|sqrt|frac|dfrac|tfrac)(?![a-zA-Z])(?:\s*\{(?:[^{}]|\{[^{}]*\})*\})*/g;

/** Applies `fn` to the text between delimited math, leaving the math as written. */
export function mapOutsideMath(text, fn) {
  let out = '';
  let end = 0;
  for (const match of text.matchAll(DELIMITERS)) {
    out += fn(text.slice(end, match.index)) + match[0];
    end = match.index + match[0].length;
  }
  return out + fn(text.slice(end));
}

/**
 * LaTeX spacing (\; \, \: \!) outside math shows as those characters: the app
 * renders only STRAY_COMMAND there (v68: "-6x+3y>12 \;=>\; y>2x+4"). Outside
 * math it only meant a space, so it becomes one.
 */
export const stripStraySpacing = (text) =>
  mapOutsideMath(text, (plain) => plain.replace(/\s*(?<!\\)\\[;,:!]\s*/g, ' '));

/**
 * A span with a space before its closing $ ("$ (x,y) $") isn't math to the app,
 * so both dollar signs show (v68: 12 strings, v69: 9). The space is dropped. An
 * opening $ before a digit is left alone, so "$5 and $ off" stays a price.
 */
export const tightenPaddedMath = (text) =>
  mapOutsideMath(text, (plain) =>
    plain.replace(/(?<![\\$])\$(?![\d$])\s*([^$\n]*?[^\s$\\])\s+\$(?![\d$])/g, (_, inner) => `$${inner}$`));

/** A $ the app would show as a character: not in math, not escaped, not a price. */
export const rawDollars = (text) =>
  String(text ?? '').replace(DELIMITERS, ' ').match(/(?<!\\)\$(?!\d)/g) ?? [];

/** LaTeX outside math that the app would show raw: what's left once STRAY_COMMAND is taken out. */
export const unrenderedLatex = (text) =>
  mapOutsideMath(String(text ?? ''), (plain) => plain.replace(STRAY_COMMAND, ' '))
    .replace(DELIMITERS, ' ')
    .match(/(?<!\\)\\(?:[a-zA-Z]+|[;,:!])/g) ?? [];
