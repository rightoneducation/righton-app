/**
 * A run's review report, as markdown: the document the pipeline's reviewer reads
 * and comments on (pasted into the Google Doc behind /preview's Add Comments).
 *
 *   yarn seed:report --run <runId | run dir> [--notes <md>] [--out <path>]
 *
 * Sections, in order: run header; optional notes (--notes, e.g. what changed since
 * the last reviewed run); Quiz; Misconceptions (rubric, ranking, each retained
 * misconception with its need, template picks and activity summaries, then the
 * ones not carried forward); Activities (full Wave 2 content); an empty Comments
 * section. A SWAP.md in the run directory (an activity re-generated after the
 * run) is quoted under the header so the substitution is visible.
 *
 * Reads only the run directory and the fixture behind it; writes report.md into
 * the run directory unless --out says otherwise.
 */
import * as fs from 'fs';
import * as path from 'path';
import { loadFixture } from './util/importEvalFixtures';

const RUNS_ROOT = path.resolve(__dirname, '../runs');
const RUBRIC = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '../../../amplify/backend/function/microcoachv2ScoresCalc/src/misconceptionRubric.json'),
  'utf8',
));

const arg = (name: string): string | null => {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : null;
};

// ── Formatting helpers ─────────────────────────────────────────────────────────

const pct = (x: number | null | undefined) => (typeof x === 'number' ? `${Math.round(x * 100)}%` : '—');
const round2 = (x: number) => Math.round(x * 100) / 100;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** A table cell: no line breaks or pipes. */
const cell = (s: unknown) => String(s ?? '—').replace(/\n+/g, ' ').replace(/\|/g, '\\|');
const table = (head: string[], rows: unknown[][]) => [
  `| ${head.join(' | ')} |`,
  `|${head.map(() => '---').join('|')}|`,
  ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`),
];

const GROUPING_LABEL: Record<string, string> = { INDIVIDUAL: 'Individual', PAIRS: 'Pairs', WHOLE_CLASS: 'Whole Class' };
const STATUS_MARK: Record<string, string> = { CORRECT: '✓', INCORRECT: '✗', NEUTRAL: '·' };
const TEMPLATE_LABEL: Record<string, string> = {
  INCORRECT_WORKED_EXAMPLES: 'Spot the Slip',
  FAVORITE_NO: 'My Favorite No',
  MATH_DETECTIVE: 'Math Detective',
  COMPARE_THE_THINKING: 'Compare the Thinking',
  MAKE_YOUR_CASE: 'Make Your Case',
};
const METRIC_FROM: Record<string, (m: any) => string> = {
  frequency: (m) => `${pct(m.rubric?.inputs?.studentPercent ?? m.studentPercent)} of class`,
  learningProgressionInfluence: (m) => `${m.rubric?.inputs?.downstreamCount ?? '—'} downstream standard(s)`,
  studentConfidence: (m) => `mean ${m.rubric?.inputs?.meanConfidence ?? m.meanConfidence ?? '—'} of 5`,
  conceptualDepth: () => 'model judgement',
  lcMisconceptionEvalScore: () => 'Learning Commons evaluator',
};

// ── Sections ───────────────────────────────────────────────────────────────────

function header(manifest: any, retained: any[], swapNote: string | null, guardFires: string[]): string[] {
  const version = manifest.version ?? manifest.runId.replace(/^.*?-none-/, '').replace(/-\d{4}-\d{2}-\d{2}T.*$/, '');
  const needsFlagged = (manifest.needSeparationFlags ?? []).length;
  const out = [
    `# MicroCoach pipeline run — ${version || manifest.runId}`,
    '',
    `**Classroom:** ${manifest.classroomName}  `,
    `**Session:** ${manifest.sessionLabel}  `,
    `**Run:** ${manifest.runId}  `,
    `**Started:** ${manifest.startedAt}  `,
    `**Condition:** ${manifest.condition}  `,
    `**Models:** ${(manifest.models ?? []).join(', ')}  `,
    `**Rubric:** ${manifest.rubricVersion}  `,
    `**Code:** ${manifest.gitSha}`,
    '',
    `**Summary:** ${manifest.questionCount} questions · ${manifest.distractorCount} distractors · ${manifest.studentCount} students → ${manifest.misconceptionCount} misconceptions scored → top ${manifest.misconceptionsRetained} carried forward → ${manifest.instructionalNeedsGenerated} instructional needs → ${manifest.templatePicks} activity templates → ${manifest.activityCount} activities`,
    '',
    `**Recommended Focus:** ${manifest.recommendedFocus}  `,
    `**Retained / dropped:** ${manifest.misconceptionsRetained} / ${manifest.misconceptionsDropped} (rubric cap)  `,
    `**Standard matched:** ${manifest.targetStandardMatched}/${manifest.misconceptionCount}  `,
    `**Needs prescribing an activity:** ${needsFlagged}/${manifest.needSeparationChecked ?? retained.length}  `,
    `**In-pipeline guards fired:** ${guardFires.length ? guardFires.join('; ') : 'none'}`,
  ];
  if (swapNote) out.push('', '> **Re-generated after the run.** ' + swapNote.replace(/^Copy of [^\n]*\n+/, '').trim().replace(/\n+/g, ' '));
  return out;
}

function quiz(fixture: any): string[] {
  const questions = [...(fixture.ppq?.questions ?? [])].sort((a: any, b: any) => a.questionNumber - b.questionNumber);
  const standards = (fixture.ppq?.ccssStandards ?? []).join(', ');
  const out = ['## Quiz', ''];
  for (const q of questions) {
    const rows = (fixture.studentResponses ?? [])
      .map((sr: any) => (sr.questionResponses ?? []).find((r: any) => Number(r.questionNumber) === Number(q.questionNumber)))
      .filter(Boolean);
    const correct = rows.filter((r: any) => r.isCorrect).length;
    out.push(`**Q${q.questionNumber}.** ${q.questionText}  `);
    out.push(`Standard: ${standards} · correct: ${q.correctAnswer} · class correct: ${rows.length ? pct(correct / rows.length) : pct(q.classPercentCorrect)}`, '');
    for (const o of q.answerChoices ?? []) {
      const n = rows.filter((r: any) => String(r.response ?? '').toUpperCase() === o.letter).length;
      out.push(`- ${o.letter}. ${o.content}${o.isCorrect ? ' *(correct)*' : n ? ` — ${plural(n, 'student')}` : ''}`);
    }
    out.push('');
  }
  return out;
}

function rubricIntro(scored: any[]): string[] {
  const metrics = RUBRIC.metrics.filter((m: any) => m.enabled !== false);
  const max = metrics.reduce((s: number, m: any) => s + 3 * m.weight, 0);
  const describe: Record<string, string> = {
    frequency: `share of the class that selected a linked response, scored continuously and reaching the maximum at ${pct(RUBRIC.metrics.find((m: any) => m.id === 'frequency')?.scale?.saturateAt)}, the start of the rubric's top band`,
    learningProgressionInfluence: "how many standards the misconception's standard builds towards",
    studentConfidence: 'mean 1–5 self-rating on the linked wrong answers',
    conceptualDepth: "model judgement against the rubric's four written levels",
  };
  const out = [
    '## Misconceptions',
    '',
    `Scored on the Wave 2 Misconception Rubric. Each factor is scored 0–3, then weighted; the columns below are the weighted contributions, which add up to the **Score** out of ${max}. The highest score is the Recommended Focus and the top ${RUBRIC.selection.cap} are carried into instructional needs and activities.`,
    '',
    ...table(['Factor', 'Measured from', 'Weight', 'Contributes'],
      metrics.map((m: any) => [m.label, describe[m.id] ?? '—', `×${m.weight}`, `0–${3 * m.weight}`])),
    '',
    `Progression influence is weighted at a third of the others: the count is taken at the standard level in this pilot and only two of its four levels are reachable on the standards fetched here, so at equal weight a one-level difference there cancelled a two-level difference in share of class. The Learning Commons Misconception Evaluator is defined in the rubric but not yet integrated, so the maximum is ${max}. Ties are broken on conceptual depth, then share of class, then mean confidence, then the order the model returned.`,
    '',
  ];
  const ids = metrics.map((m: any) => m.id);
  out.push(...table(
    ['#', 'Misconception', 'Freq', 'Progression', 'Confidence', 'Depth', 'Score', 'Carried'],
    scored.map((m) => [
      `${m.priorityRank}${m.isRecommendedFocus ? ' ★' : ''}`,
      m.title,
      ...ids.map((id: string) => m.rubric?.weighted?.[id] ?? '—'),
      `${round2(m.rubric?.total ?? 0)} / ${m.rubric?.maxPossible ?? max}`,
      m.retained ? 'yes' : '—',
    ]),
  ));
  // Responses linked to more than one misconception.
  const seen = new Map<string, number>();
  for (const m of scored) for (const w of m.wrongAnswers ?? []) {
    const k = `Q${w.questionNumber}·${w.letter}`;
    seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  const shared = [...seen].filter(([, n]) => n > 1).map(([k]) => k);
  out.push('', '★ = Recommended Focus.', '');
  out.push(`A response can be linked to more than one misconception, so these groups are not mutually exclusive and the percentages do not sum to 100%.${shared.length ? ` In this run ${shared.join(', ')} ${shared.length === 1 ? 'is' : 'are'} linked to more than one.` : ''}`, '');
  return out;
}

function misconceptionHead(m: any, focus: boolean, dropped: boolean): string[] {
  const std = m.ccssStandards?.targetObjective?.standard;
  return [
    `### #${m.priorityRank} ${m.title}${focus ? ' — Recommended Focus' : ''}${dropped ? ' (not carried forward)' : ''}`,
    '',
    `Selected one or more linked responses: ${m.studentCount} unique students (${pct(m.studentPercent)}) · linked responses: ${m.linkedResponses} · mean confidence: ${m.meanConfidence ?? '—'} of 5 · evidence basis: ${m.evidenceBasis ?? '—'}`,
    '',
    `**Misconception.** ${m.misconceptionSummary}`,
    '',
    `**Mathematical connection.** ${m.learningScienceConnection}`,
    '',
    `**Wrong answers linked:** ${(m.wrongAnswers ?? []).map((w: any) => `Q${w.questionNumber}·${w.letter}`).join(', ') || '—'}`,
    '',
    `**Standard:** ${std ?? '—'}${m.standardSource ? ` (assigned by ${m.standardSource})` : ''}`,
    '',
  ];
}

function rubricTable(m: any): string[] {
  const metrics = RUBRIC.metrics.filter((x: any) => x.enabled !== false);
  return [
    ...table(['Metric', 'Contributes', 'Measured from', 'Derivation'], [
      ...metrics.map((x: any) => {
        const score = m.rubric?.scores?.[x.id];
        const weighted = m.rubric?.weighted?.[x.id];
        return [x.label, `${weighted ?? '—'}/${3 * x.weight}`, METRIC_FROM[x.id]?.(m) ?? '—', `${score ?? '—'}/3 × ${x.weight}`];
      }),
      ['**Score**', `**${round2(m.rubric?.total ?? 0)} / ${m.rubric?.maxPossible ?? '—'}**`, `rank #${m.priorityRank}`, ''],
    ]),
    '',
    `**Depth rationale.** ${m.rubric?.conceptualDepthWhy ?? '—'}`,
    '',
  ];
}

function needAndPicks(m: any): string[] {
  const need = m.instructionalNeed ?? {};
  const r = m.rationale ?? {};
  const sel = m.selectedTemplates ?? {};
  const out = [
    `**Instructional need.** ${need.text ?? '—'}`,
    '',
    `**Teacher role:** ${need.teacherRole ?? '—'}`,
    '',
    '**Evidence used:**',
    ...(need.evidenceUsed ?? []).map((e: string) => `- ${e}`),
    '',
    ...table(['Field', 'Value'], [
      ['Prevalence', r.prevalence],
      ['Confidence signal', r.confidenceSignal],
      ['Prerequisite gaps', (r.prerequisiteGaps ?? []).join(', ')],
      ['Forward impact', (r.forwardImpact ?? []).join(', ')],
      ['Recurrence', r.recurrence],
    ]),
    '',
    `**Why this need.** ${r.whyThisNeed ?? '—'}`,
    '',
    `**Activity templates selected** — distinct instructional moves: ${sel.distinctInstructionalMoves === false ? 'no' : 'yes'}`,
    '',
  ];
  for (const p of sel.picks ?? []) {
    out.push(`**${p.templateId}** — instructional fit ${p.instructionalFit}/3  `, `Move: ${p.instructionalApproach}`, '', p.rationale, '');
  }
  if (sel.noFitReason) out.push(`No fit: ${sel.noFitReason}`, '');
  if ((sel.considered ?? []).length) {
    out.push('Considered and passed over:', ...sel.considered.map((c: any) => `- ${c.templateId} — ${c.whyNot}`), '');
  }
  out.push('**Activities generated**', '');
  for (const mo of m.moveOptions ?? []) {
    const c = mo.content;
    out.push(
      `- **${mo.title ?? TEMPLATE_LABEL[mo.activityType] ?? mo.templateId}** — ${mo.durationLabel ?? '—'} · strategy: ${mo.strategyTag ?? '—'}  `,
      `  Move: ${mo.instructionalMove ?? '—'}  `,
      `  Mathematical takeaway: ${c?.discussion?.takeaway ?? '—'}  `,
      '  Full activity: see Activities.',
    );
  }
  out.push('');
  return out;
}

// ── Activities: the Wave 2 content, per template ───────────────────────────────

function facilitate(f: any): string[] {
  const out: string[] = [];
  switch (f?.type) {
    case 'INCORRECT_WORKED_EXAMPLES':
      f.examples.forEach((e: any, i: number) => {
        out.push(`*Example ${i + 1}.* ${e.prompt}  `, `Slip (teacher): ${e.slip}`, '');
        for (const s of e.steps) {
          const a = s.annotation;
          out.push(`${s.step}. ${s.text}${a ? `  \n   ${a.kind === 'ERROR' ? '✗ Error' : '✓ Correct'}${a.text ? `: ${a.text}` : ''}` : ''}`);
        }
        out.push('', `Outcome (teacher): ${e.finalOutcome}`, '');
      });
      break;
    case 'FAVORITE_NO':
      f.examples.forEach((e: any, i: number) => {
        out.push(`*Example ${i + 1}.* ${e.prompt}`, '', 'Student work:');
        out.push(...e.work.map((w: any) => `- ${STATUS_MARK[w.status] ?? ''} ${w.text}`));
        out.push('', ...e.notice.map((n: any) => `- **${n.kind === 'PRESERVE' ? 'Preserve' : 'Revise'}:** ${n.text}`));
        out.push('', `Source (teacher): ${e.sourceNote}`, '');
      });
      break;
    case 'MATH_DETECTIVE':
      f.examples.forEach((e: any, i: number) => {
        out.push(`*Example ${i + 1}.* ${e.prompt}`, '', 'Student work:');
        out.push(...e.workSummary.map((w: any) => `- ${STATUS_MARK[w.status] ?? ''} ${w.text}`), '');
        for (const s of e.stages) {
          out.push(`**${s.kind[0]}${s.kind.slice(1).toLowerCase()}.** ${s.ask}  `, `Answer (teacher): ${s.answer}`, '');
        }
      });
      break;
    case 'COMPARE_THE_THINKING':
      out.push(`**Problem:** ${f.problem}`, '', `Comparison: ${f.comparison === 'BOTH_CORRECT' ? 'both correct' : 'correct vs. incorrect'}`, '');
      for (const s of f.strategies) {
        out.push(`*Strategy ${s.label}* — ${s.verdict ?? 'unlabelled'} (teacher)`, '');
        for (const st of s.steps) {
          out.push(`${st.step}. ${st.text}${st.highlight === 'ERROR' ? ' ✗' : st.highlight === 'SUCCESS' ? ' ✓' : ''}`);
        }
        out.push('', ...s.notes.map((n: any) => `- ${n.heading ? `**${n.heading}:** ` : ''}${n.text}`), '');
      }
      break;
    case 'MAKE_YOUR_CASE':
      out.push(
        `**Claim:** ${f.claim}`, '',
        `**Resolution (teacher):** ${f.resolution.verdict} — ${f.resolution.why}`, '',
        'Student steps:', ...f.studentSteps.map((s: string, i: number) => `${i + 1}. ${s}`), '',
        'Examples to bring in:', ...f.examples.map((e: any) => `- ${e.prompt} — ${e.answer}`), '',
        'Arguments (teacher reference):', ...f.arguments.map((a: any) => `- **${a.stance === 'SUPPORT' ? 'Support' : 'Challenge'}:** ${a.text}`), '',
      );
      break;
    default:
      out.push('*No facilitation content.*', '');
  }
  return out;
}

function activity(mo: any): string[] {
  const c = mo.content;
  const out = [
    `#### ${mo.title ?? TEMPLATE_LABEL[mo.activityType] ?? mo.templateId}`,
    '',
    `${mo.durationLabel ?? '—'} · strategy: ${mo.strategyTag ?? '—'} · before class ${c?.durations?.beforeClass ?? '—'} · activity ${c?.durations?.facilitate ?? '—'} · discussion ${c?.durations?.discussion ?? '—'}`,
    '',
  ];
  if (mo.routine) out.push(`**${mo.routine.name}** (${mo.routine.subtitle}). ${mo.routine.description}`, '');
  out.push(
    `**Instructional move.** ${mo.instructionalMove ?? '—'}`, '',
    `**Targets.** ${mo.targets ?? '—'}`, '',
  );
  if (!c) return [...out, '*No Wave 2 content.*', ''];
  out.push(
    `**Why this activity.** ${c.whyThisActivity}`, '',
    `**Before class** (${c.durations.beforeClass})`, '',
    ...c.beforeClass.steps.map((s: string, i: number) => `${i + 1}. ${s}`), '',
    `Grouping: ${c.beforeClass.groupingRationale}`, '',
    `**How to run it** (${c.durations.facilitate})`, '',
    ...c.howToRun.map((s: any, i: number) => {
      const g = (s.groupings ?? []).map((k: string) => GROUPING_LABEL[k] ?? k).join(' or ');
      return `${i + 1}. **${s.title}**${g ? ` (${g})` : ''} — ${s.body}`;
    }), '',
    `**Facilitate — ${TEMPLATE_LABEL[c.facilitate?.type] ?? c.facilitate?.type}**`, '',
    ...facilitate(c.facilitate),
    `**Closing discussion** (${c.durations.discussion})`, '',
  );
  if (c.discussion) {
    c.discussion.questions.forEach((q: any, i: number) => out.push(`${i + 1}. ${q.question}  `, `   Answer (teacher): ${q.answer}`));
    out.push('', '*Watch for*', '');
    for (const w of c.discussion.watchFors) {
      out.push(`- **${w.watchFor}**  `, `  Try asking: ${w.tryAsking}  `, `  Respond with: ${w.howToRespond}`);
    }
    out.push('', `**Takeaway.** ${c.discussion.takeaway}`, '');
  }
  const issues = mo.discussionReview?.issues ?? [];
  if (issues.length) {
    out.push(`*Accuracy review corrected ${plural(issues.length, 'issue')} in the closing discussion:*`);
    out.push(...issues.map((i: any) => `- ${i.component ? `${i.component}: ` : ''}${i.problem ?? JSON.stringify(i)}`), '');
  }
  return out;
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  const runArg = arg('--run');
  if (!runArg) {
    console.error('usage: yarn seed:report --run <runId | run dir> [--notes <md>] [--out <path>]');
    process.exit(2);
  }
  const runDir = fs.existsSync(runArg) ? path.resolve(runArg) : path.join(RUNS_ROOT, runArg);
  const manifest = JSON.parse(fs.readFileSync(path.join(runDir, 'manifest.json'), 'utf8'));
  const output: any[] = JSON.parse(fs.readFileSync(path.join(runDir, 'output.json'), 'utf8'));
  const fixture = loadFixture(String(manifest.sessionId).slice(0, 8));
  const swapPath = path.join(runDir, 'SWAP.md');
  const swapNote = fs.existsSync(swapPath) ? fs.readFileSync(swapPath, 'utf8') : null;

  // Each in-pipeline guard that fired, from the activity calls' sub-call traces.
  const guardFires: string[] = [];
  const callsDir = path.join(runDir, 'calls');
  for (const f of fs.existsSync(callsDir) ? fs.readdirSync(callsDir).filter((x) => /activity/.test(x)) : []) {
    const call = JSON.parse(fs.readFileSync(path.join(callsDir, f), 'utf8'));
    const out = typeof call.output === 'string' ? JSON.parse(call.output) : call.output;
    for (const sc of out?._trace?.subCalls ?? []) {
      if (sc.label === 'answerable-fallback') guardFires.push(`answerable fallback in ${f.replace(/\.json$/, '')} ("${sc.before}")`);
      if (sc.label === 'retry-incomplete-system') {
        guardFires.push(`incomplete-system retry in ${f.replace(/\.json$/, '')} (${sc.fixed ? 'fixed by the retry' : 'still incomplete after the retry'})`);
      }
    }
  }

  const scored = output.filter((m) => Number.isInteger(m.priorityRank)).sort((a, b) => a.priorityRank - b.priorityRank);
  const retained = scored.filter((m) => m.retained !== false);
  const dropped = scored.filter((m) => m.retained === false);

  const md: string[] = [...header(manifest, retained, swapNote, guardFires), ''];
  const notes = arg('--notes');
  if (notes) md.push('---', '', fs.readFileSync(notes, 'utf8').trim(), '', '---', '');
  md.push(...quiz(fixture), ...rubricIntro(scored));
  for (const m of retained) {
    md.push(...misconceptionHead(m, m.isRecommendedFocus, false), ...rubricTable(m), ...needAndPicks(m));
  }
  if (dropped.length) {
    md.push('## Not carried forward', '', `Scored and ranked, but below the cap of ${RUBRIC.selection.cap}. No instructional need, templates or activities are generated for these.`, '');
    for (const m of dropped) md.push(...misconceptionHead(m, false, true), ...rubricTable(m));
  }
  md.push('## Activities', '', 'Full content for every generated activity, grouped by the misconception it targets: before class, how to run it, the facilitation artifact for its template, and the closing discussion. Lines marked (teacher) appear in the teacher view only.', '');
  for (const m of retained) {
    md.push(`### #${m.priorityRank} ${m.title}`, '');
    for (const mo of m.moveOptions ?? []) md.push(...activity(mo));
  }
  md.push('## Comments', '', '');

  const outPath = arg('--out') ?? path.join(runDir, 'report.md');
  fs.writeFileSync(outPath, md.join('\n'));
  console.log(`Report → ${outPath}`);
}

main();
