// Copied from seed/eval/scripts/util/checkNeedSeparation.ts: a Lambda can't import
// from seed/. A surface-pattern flag for logs: does a need prescribe an activity,
// rather than the understanding students must build?
const PRESCRIPTIVE = [
  { label: 'have students', re: /\bhave (?:the )?students\b/i },
  { label: 'ask students', re: /\bask (?:the )?students\b/i },
  { label: 'give/provide students', re: /\b(?:give|provide|present) (?:the )?students\b/i },
  { label: 'require students', re: /\brequir\w* (?:that )?(?:the )?students\b/i },
  { label: 'let/get students', re: /\b(?:let|get) (?:the )?students (?:to )?\w+/i },
  { label: 'students should/must do', re: /\bstudents (?:should|must|need to) (?:do|complete|practice|work through)\b/i },
  { label: 'grouping', re: /\bin (?:pairs|partners|small (?:teams|groups)|groups)\b/i },
  { label: 'discussion staging', re: /\b(?:whole[- ]class|class) discussion\b/i },
  { label: 'named routine', re: /\b(?:warm-?up|exit ticket|gallery walk|card sort|think-?pair-?share|do now|bell ringer)\b/i },
  { label: 'strategy hint', re: /\btest a (?:convenient |specific )?point\b/i },
  { label: 'activity noun', re: /\b(?:activity|worked example|task card|worksheet|lesson)\b/i },
];

export function checkNeedSeparation(misconceptions) {
  const flagged = [];
  for (const m of misconceptions ?? []) {
    const text = m?.instructionalNeed?.text;
    if (typeof text !== 'string' || !text.trim()) continue;
    const hits = PRESCRIPTIVE.filter((p) => p.re.test(text)).map((p) => p.label);
    if (hits.length) flagged.push({ title: m.title, hits });
  }
  return flagged;
}
