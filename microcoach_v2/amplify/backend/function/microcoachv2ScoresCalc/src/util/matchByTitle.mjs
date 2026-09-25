/**
 * Pair a model's returned rows back onto the items they were asked about.
 *
 * Every stage that reasons over a list joins the result back by title, because the
 * title is the only stable identifier the model sees. That join used to require the
 * returned string to equal the input title exactly, with position checked only when
 * the titles already agreed — so position never actually rescued a mismatch.
 *
 * It broke the way this kind of join always eventually breaks: the prompts head each
 * item `### Misconception 1: <title>`, and one run the model copied the heading
 * rather than the title. Seven depth scores and three template selections were
 * dropped for items that had been answered correctly and in order.
 *
 * So: normalize away the heading prefix, try the title, and fall back to position
 * when the counts line up — the prompts all say "in the same order", so a full-length
 * in-order reply is trustworthy. A position-only match is reported rather than
 * assumed, since that is the branch that could silently mis-pair.
 */

/**
 * Comparison key for a title: drops a leading "Misconception 3:" / "Need 2 -" style
 * prefix, collapses whitespace, casefolds.
 */
export const titleKey = (s) => String(s ?? '')
  .replace(/^\s*(?:misconception|need)\s*\d*\s*[:.\-–—]\s*/i, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

/**
 * Index in `inputs` that `returnedTitle` refers to, or null.
 *
 * `pos` is where the row sat in the model's reply. `returnedCount` is how many rows
 * it returned in total; the positional fallback only applies when that equals the
 * number of items asked about.
 *
 * Returns `{ index, matchedBy }` where matchedBy is 'title', 'position' or null.
 * Callers should count the 'position' cases and surface them.
 */
export function matchByTitle(returnedTitle, inputs, pos, returnedCount) {
  const list = inputs ?? [];
  const t = titleKey(returnedTitle);

  // Position and title agree — the ordinary case.
  if (list[pos] && titleKey(list[pos].title) === t) return { index: pos, matchedBy: 'title' };

  // Title matches something else in the list: the model reordered its reply.
  if (t) {
    const i = list.findIndex((m) => titleKey(m?.title) === t);
    if (i >= 0) return { index: i, matchedBy: 'title' };
  }

  // Title is unusable, but the reply is complete and in order, so position holds.
  if (returnedCount === list.length && pos >= 0 && pos < list.length) {
    return { index: pos, matchedBy: 'position' };
  }

  return { index: null, matchedBy: null };
}
