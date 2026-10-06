/**
 * Does any instructional need prescribe an activity?
 *
 * The need stage states the mathematical understanding students must build; what
 * the teacher or students DO is decided two stages later, at template selection
 * and activity generation. When the need prescribes actions, the later stages are
 * being steered by a decision that was made too early — the failure the Wave 2
 * feedback reported, found by eye in one run and worth a number in every run.
 *
 * Detection is by surface pattern, so it flags for review rather than proving a
 * leak. Mathematical verbs students perform on objects ("substitute", "rewrite",
 * "compare the two forms") are deliberately NOT flagged: the need is allowed to
 * name mathematical work. What is flagged is pedagogical staging — instructing the
 * teacher, assigning a task, grouping students, or naming a classroom routine.
 */

export interface NeedSeparationFlag {
  title: string;
  hits: string[];
}

export interface NeedSeparationReport {
  checked: number;
  flagged: NeedSeparationFlag[];
}

// Grouped by what each pattern catches, so a false positive is easy to retire.
const PRESCRIPTIVE: Array<{ label: string; re: RegExp }> = [
  // Addressing the teacher.
  { label: 'have students', re: /\bhave (?:the )?students\b/i },
  { label: 'ask students', re: /\bask (?:the )?students\b/i },
  { label: 'give/provide students', re: /\b(?:give|provide|present) (?:the )?students\b/i },
  { label: 'require students', re: /\brequir\w* (?:that )?(?:the )?students\b/i },
  { label: 'let/get students', re: /\b(?:let|get) (?:the )?students (?:to )?\w+/i },
  // Assigning a task rather than naming an understanding.
  { label: 'students should/must do', re: /\bstudents (?:should|must|need to) (?:do|complete|practice|work through)\b/i },
  // Grouping and staging.
  { label: 'grouping', re: /\bin (?:pairs|partners|small (?:teams|groups)|groups)\b/i },
  { label: 'discussion staging', re: /\b(?:whole[- ]class|class) discussion\b/i },
  // Named classroom routines.
  { label: 'named routine', re: /\b(?:warm-?up|exit ticket|gallery walk|card sort|think-?pair-?share|do now|bell ringer)\b/i },
  // Solution strategies handed to the student — the need says what to understand,
  // not which method to use.
  { label: 'strategy hint', re: /\btest a (?:convenient |specific )?point\b/i },
  // Activity vocabulary.
  { label: 'activity noun', re: /\b(?:activity|worked example|task card|worksheet|lesson)\b/i },
];

/**
 * `misconceptions` is the post-need list from generate.ts step 5 — anything with
 * an `instructionalNeed.text`. Items without one are skipped, not counted.
 */
export function checkNeedSeparation(misconceptions: any[]): NeedSeparationReport {
  const flagged: NeedSeparationFlag[] = [];
  let checked = 0;

  for (const m of misconceptions ?? []) {
    const text = m?.instructionalNeed?.text;
    if (typeof text !== 'string' || !text.trim()) continue;
    checked += 1;
    const hits = PRESCRIPTIVE.filter((p) => p.re.test(text)).map((p) => p.label);
    if (hits.length) flagged.push({ title: m.title, hits });
  }

  return { checked, flagged };
}
