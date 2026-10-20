/**
 * Activity-output checks: one named rule per failure we have seen, reported as a
 * pass rate per template so a prompt change is judged on every rule at once.
 *
 *   node seed/eval/scripts/checkActivityOutput.mjs --replay <replays/stamp dir>
 *   node seed/eval/scripts/checkActivityOutput.mjs --run <eval run id or dir>
 *     [--save-baseline]   record these rates as seed/eval/activity-cases/baseline.json
 *
 * With a saved baseline, any rule whose pass rate dropped is listed and the exit
 * code is 1. A change is accepted only when its target rule improves and nothing
 * else drops (see the plan in the pipeline memory).
 *
 * Rules are deliberately concrete: each encodes something a reviewer actually
 * caught. Add a rule when a new failure shows up, before fixing the prompt.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { activityContentSchemaFor } from '../../../amplify/backend/function/microcoachv2NextStepOption/src/util/activityContent.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EVAL_ROOT = path.resolve(HERE, '..');
const BASELINE = path.join(EVAL_ROOT, 'activity-cases', 'baseline.json');

// The class window, from the generator's own config so the two cannot disagree.
const MAX_DURATION = JSON.parse(readFileSync(
  path.resolve(HERE, '../../../amplify/backend/function/microcoachv2NextStepOption/src/util/config.json'), 'utf8',
)).nextStepOption?.maxDurationMinutes ?? 15;

const EXAMPLE_TYPES = new Set(['INCORRECT_WORKED_EXAMPLES', 'FAVORITE_NO', 'MATH_DETECTIVE']);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Text with every $…$ / $$…$$ span removed. */
const outsideMath = (text) => String(text ?? '').replace(/\$\$[^$]*\$\$|\$[^$]*\$/g, ' ');

/** A comparable form of the math in a string: spacing, delimiters and spellings ignored. */
const mathKey = (text) => String(text ?? '')
  .replace(/\$|\\(?:left|right|[dt]?frac|quad|text|,|;|!)|[{}\s]/g, '')
  .replace(/\\leq?/g, '≤').replace(/\\geq?/g, '≥').replace(/\\neq?/g, '≠');

// Words that describe a student's work or point at an error, rather than state a
// problem. Any of these in a student-facing prompt is a leak.
// "shaded"/"shading" only as a description of done work ("shaded the region
// above"): "indicate which side should be shaded" is the task itself (v35 replay).
const STUDENT_WORK = /\b(student|students'?|selected|shaded (?:the|above|below|to)|shading (?:the|above|below|to)|drew|wrote|their (work|graph|answer|solution)|here is|here's|look at|examine|investigate|what went wrong|mistake|error|incorrect|wrong)\b/i;

// Words that name the rule a misconception breaks. One counts only when the
// misconception itself uses it, so "dashed" is a leak for a boundary-style
// misconception and not for a slope one.
const ANSWER_TERMS = ['dashed', 'solid', 'flip', 'reverse', 'reciprocal', 'test point', 'intersection', 'union', 'overlap', 'isolate', 'slope-intercept', 'strict', 'inclusive'];

// ── Inequality helpers (teacher-view label rules) ─────────────────────────────

const INEQ_OPS = /\\leq?|\\geq?|\\le\b|\\ge\b|≤|≥|<|>/g;
const HAS_INEQ = new RegExp(INEQ_OPS.source);
const isInclusive = (op) => /\\l|\\g|≤|≥/.test(op);
const mathSpans = (text) => [...String(text ?? '').matchAll(/\$\$([^$]*)\$\$|\$([^$]*)\$/g)].map((m) => m[1] ?? m[2]);

/** The one inequality symbol in a single-inequality problem, else null. */
function singleInequality(problem) {
  const ops = mathSpans(problem).flatMap((m) => m.match(INEQ_OPS) ?? []);
  return ops.length === 1 ? ops[0] : null;
}

/**
 * `y op mx + b` → { above, slope }: whether the solutions lie above the line, and
 * its slope. null for anything else (not solved for y, not linear in x).
 */
function solvedForY(math) {
  const m = String(math).replace(/\s+/g, '').match(/^y(\\leq?|\\geq?|\\le|\\ge|≤|≥|<|>)(.+)$/);
  if (!m || /y/.test(m[2])) return null;
  const above = /\\g|≥|>/.test(m[1]);
  const xTerm = m[2].match(/(^|[+-])(\\frac\{(\d+)\}\{(\d+)\}|\d*\.?\d*)x/);
  if (!xTerm) return /x/.test(m[2]) ? null : { above, slope: 0 };
  const sign = xTerm[1] === '-' ? -1 : 1;
  const size = xTerm[3] ? Number(xTerm[3]) / Number(xTerm[4]) : xTerm[2] === '' ? 1 : Number(xTerm[2]);
  return Number.isFinite(size) ? { above, slope: sign * size } : null;
}

/** Sentences of prose, never splitting inside $…$. */
function sentences(text) {
  const spans = [];
  const masked = String(text ?? '').replace(/\$\$[^$]*\$\$|\$[^$]*\$/g, (m) => `\u0000${spans.push(m) - 1}\u0000`);
  return masked.split(/(?<=[.!?;])\s+/).map((part) => part.replace(/\u0000(\d+)\u0000/g, (_, i) => spans[i]));
}

/** Teacher-only prose in the content, by template, plus the discussion's. */
function teacherNotes(c) {
  const f = c.facilitate ?? {};
  const notes = [];
  for (const ex of f.examples ?? []) {
    notes.push(ex.finalOutcome, ex.answer, ...(ex.stages ?? []).map((s) => s.answer),
      ...(ex.notice ?? []).map((n) => n.text), ...(ex.steps ?? []).map((s) => s.annotation?.text));
  }
  for (const st of f.strategies ?? []) notes.push(...(st.notes ?? []).map((n) => n.text));
  notes.push(f.resolution?.why, ...(f.arguments ?? []).map((a) => a.text));
  const d = c.discussion;
  if (d) notes.push(d.takeaway, ...(d.questions ?? []).map((q) => q.answer), ...(d.watchFors ?? []).map((w) => w.howToRespond));
  return notes.filter((n) => typeof n === 'string' && n.trim());
}

// Sentences the rule cannot read: about the student's (wrong) region, negated or
// about where an inequality is false, or about a system's overlap rather than one
// inequality's half-plane.
const ABOUT_WRONG_WORK = /\b(not|n't|fails?|student|students'?|they|their|chose|picked|instead|wrong|incorrect|mistak\w*|rather|error|misread|confus\w*|intersect\w*|both|overlap|system)\b/i;

function allStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

// ── Rules ─────────────────────────────────────────────────────────────────────

/**
 * Each rule: { id, applies(type), check(content, misconception) → null | reason }.
 * Example-level rules return the first failing example's reason.
 */
const RULES = [
  {
    id: 'contract',
    applies: () => true,
    check: (content, _m, type) => {
      const full = activityContentSchemaFor(type);
      const schema = content.discussion == null ? full.omit({ discussion: true }) : full;
      const result = schema.safeParse(content);
      return result.success ? null : result.error.issues.slice(0, 2).map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    },
  },
  {
    id: 'examples.count 1-3',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      const n = c.facilitate.examples?.length ?? 0;
      return n >= 1 && n <= 3 ? null : `${n} examples`;
    },
  },
  {
    id: 'problem is math only',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      for (const ex of c.facilitate.examples ?? []) {
        const words = outsideMath(ex.problem).replace(/\band\b|[,.;:]/gi, ' ').trim();
        if (words) return `"${ex.problem}"`;
      }
      return null;
    },
  },
  {
    id: 'prompt contains the math',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      for (const ex of c.facilitate.examples ?? []) {
        if (!mathKey(ex.prompt).includes(mathKey(ex.problem))) return `"${ex.prompt}"`;
      }
      return null;
    },
  },
  {
    id: 'prompt states math once',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      for (const ex of c.facilitate.examples ?? []) {
        const key = mathKey(ex.problem);
        if (key && mathKey(ex.prompt).split(key).length > 2) return `"${ex.prompt}"`;
      }
      return null;
    },
  },
  {
    id: 'prompt has no label',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      const ex = (c.facilitate.examples ?? []).find((e) => /^\s*problem\s*:/i.test(e.prompt));
      return ex ? `"${ex.prompt}"` : null;
    },
  },
  {
    id: 'prompt has no student work',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      for (const ex of c.facilitate.examples ?? []) {
        const hit = outsideMath(ex.prompt).match(STUDENT_WORK);
        if (hit) return `"${hit[0]}" in "${ex.prompt}"`;
      }
      return null;
    },
  },
  {
    id: 'prompt does not name the answer',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c, m) => {
      const about = `${m.title ?? ''} ${m.description ?? ''}`.toLowerCase();
      const terms = ANSWER_TERMS.filter((t) => about.includes(t));
      for (const ex of c.facilitate.examples ?? []) {
        const text = outsideMath(ex.prompt).toLowerCase();
        const hit = terms.find((t) => text.includes(t));
        if (hit) return `"${hit}" in "${ex.prompt}"`;
      }
      return null;
    },
  },
  {
    id: 'examples use different problems',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      const keys = (c.facilitate.examples ?? []).map((e) => mathKey(e.problem));
      return new Set(keys).size === keys.length ? null : 'repeated problem';
    },
  },
  {
    id: 'no over-escaped LaTeX',
    applies: () => true,
    check: (c) => {
      // \\begin{cases} and friends use \\\\ as their row break on purpose.
      const hit = allStrings(c).find((s) => !/\\begin\{/.test(s) && /\\\\(?=[a-zA-Z ])/.test(s));
      return hit ? `"${hit.slice(0, 80)}"` : null;
    },
  },
  {
    id: 'discussion counts (3 questions, 1-3 watch for)',
    applies: () => true,
    check: (c) => {
      if (c.discussion == null) return 'skip';
      const q = c.discussion.questions?.length ?? 0;
      const w = c.discussion.watchFors?.length ?? 0;
      return q === 3 && w >= 1 && w <= 3 ? null : `${q} questions, ${w} watch for`;
    },
  },
  // Planned since 2026-10-19: every step carries its minutes, and the steps plus
  // the longest discussion question (the teacher runs one) fit the class window.
  // Content from before then has no minutes and is skipped.
  {
    id: 'every step and question has minutes',
    applies: () => true,
    check: (c) => {
      const steps = c.howToRun ?? [];
      if (!steps.some((st) => st.minutes != null)) return 'skip';
      const missingStep = steps.findIndex((st) => !Number.isInteger(st.minutes));
      if (missingStep > -1) return `step ${missingStep + 1} has no minutes`;
      const qs = c.discussion?.questions ?? [];
      const missingQ = qs.findIndex((q) => !Number.isInteger(q.minutes));
      return missingQ > -1 ? `question ${missingQ + 1} has no minutes` : null;
    },
  },
  {
    id: `in-class minutes ≤ ${MAX_DURATION}`,
    applies: () => true,
    check: (c) => {
      const steps = c.howToRun ?? [];
      if (!steps.some((st) => st.minutes != null)) return 'skip';
      const stepMinutes = steps.reduce((sum, st) => sum + (st.minutes ?? 0), 0);
      const qs = c.discussion?.questions ?? [];
      // Without a discussion (replay stops after the activity) the reserve stands in.
      const discussion = qs.length ? Math.max(...qs.map((q) => q.minutes ?? 0)) : parseInt(c.durations?.discussion, 10) || 0;
      const total = stepMinutes + discussion;
      return total <= MAX_DURATION ? null : `${stepMinutes} + ${discussion} = ${total} min`;
    },
  },
  // One central idea a teacher can land in a few minutes (v32 review, Opp 4): the
  // v32 takeaway he cited ran five sentences of conditions and edge cases. The
  // bound is the one he pointed to as focused: 2 sentences, about 330 characters.
  {
    id: 'takeaway is one focused idea (≤2 sentences, ≤350 chars)',
    applies: () => true,
    check: (c) => {
      const t = c.discussion?.takeaway;
      if (t == null) return 'skip';
      const count = outsideMath(t).split(/(?<=[.!?])\s+/).filter((s) => s.trim()).length;
      return count <= 2 && t.length <= 350 ? null : `${count} sentences, ${t.length} chars`;
    },
  },
  // Teacher-view labels have to agree with the math: v32's Math Detective marked a
  // correct solid boundary for an inclusive inequality INCORRECT. Checked only
  // where it is unambiguous — a single-inequality problem and a line whose one
  // claim is the boundary style.
  {
    id: 'boundary-style labels match the symbol',
    applies: (t) => EXAMPLE_TYPES.has(t),
    check: (c) => {
      for (const [i, ex] of (c.facilitate.examples ?? []).entries()) {
        const op = singleInequality(ex.problem);
        if (!op) continue;
        const lines = [
          ...(ex.workSummary ?? ex.work ?? []).map((w) => ({ text: w.text, wrong: w.status === 'INCORRECT', right: w.status === 'CORRECT' })),
          ...(ex.steps ?? []).filter((s) => s.annotation).map((s) => ({ text: s.text, wrong: s.annotation.kind === 'ERROR', right: s.annotation.kind === 'CORRECT' })),
        ];
        for (const line of lines) {
          const prose = outsideMath(line.text).toLowerCase();
          if (/\$/.test(line.text) || /shad|slope|intercept|writes|rewrit|solv|test|region|side|\b(not|instead|should|rather|but|chose)\b/.test(prose)) continue;
          const saysInclusive = /\b(solid|included|inclusive|closed)\b/.test(prose);
          const saysStrict = /\b(dashed|excluded|open)\b/.test(prose);
          if (saysInclusive === saysStrict) continue;
          const styleIsRight = saysInclusive === isInclusive(op);
          if ((styleIsRight && line.wrong) || (!styleIsRight && line.right)) {
            return `Example ${i + 1}: "${line.text}" marked ${line.wrong ? 'wrong' : 'right'} for ${op}`;
          }
        }
      }
      return null;
    },
  },
  // v32's Math Detective described the region for $y>2x+4$ as "above/right": for a
  // positive slope, above is the upper-left. Checked in teacher-only sentences
  // that name one inequality solved for y and are not about the wrong answer.
  {
    id: 'direction words match the inequality',
    applies: () => true,
    check: (c) => {
      for (const note of teacherNotes(c)) {
        for (const sentence of sentences(note)) {
          const prose = outsideMath(sentence).toLowerCase();
          // "…below the line, where $y>2x+4$ is false" names the other side; a
          // sentence that also says where it is true still states the region.
          if (ABOUT_WRONG_WORK.test(prose) || (/\bfalse\b/.test(prose) && !/\btrue\b/.test(prose))) continue;
          const spans = mathSpans(sentence).filter((m) => HAS_INEQ.test(m));
          if (spans.some((m) => !solvedForY(m))) continue;
          const solved = [...new Set(spans.map(solvedForY).map((r) => JSON.stringify(r)))];
          if (solved.length !== 1) continue;
          const { above, slope } = JSON.parse(solved[0]);
          const has = (w) => new RegExp(`\\b${w}`).test(prose);
          const up = has('above') || has('upper');
          const down = has('below') || has('lower');
          if (up !== down && up !== above) return `"${sentence.slice(0, 140)}"`;
          if (slope !== 0 && has('left') !== has('right')) {
            const expected = above === slope > 0 ? 'left' : 'right';
            if (!has(expected)) return `"${sentence.slice(0, 140)}"`;
          }
        }
      }
      return null;
    },
  },
];

// ── Loading ───────────────────────────────────────────────────────────────────

/** Records: { template, misconception: { title, description }, content, label }. */
function loadReplay(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'summary.json')
    .map((f) => {
      const r = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
      return r.error
        ? { template: r.template, misconception: r.misconception, content: null, label: f, error: r.error }
        : { template: r.output.activityType, misconception: r.misconception, content: r.output.content, label: f };
    });
}

function loadRun(runArg) {
  const dir = existsSync(runArg) && statSync(runArg).isDirectory() ? runArg : path.join(EVAL_ROOT, 'runs', runArg);
  const out = JSON.parse(readFileSync(path.join(dir, 'output.json'), 'utf8'));
  return out
    .filter((n) => n.retained !== false && Number.isInteger(n.priorityRank))
    .flatMap((n) => (n.moveOptions ?? []).map((mo) => ({
      template: mo.activityType ?? mo.content?.facilitate?.type,
      misconception: { title: n.title, description: n.misconceptionSummary },
      content: mo.content,
      label: `#${n.priorityRank} ${mo.templateId}`,
    })));
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function checkRecords(records) {
  const rates = {}; // rule → template → { pass, total }
  const failures = [];
  for (const r of records) {
    if (!r.content) {
      failures.push({ label: r.label, rule: 'generation', reason: r.error ?? 'no content' });
      continue;
    }
    for (const rule of RULES) {
      if (!rule.applies(r.template)) continue;
      const reason = rule.check(r.content, r.misconception ?? {}, r.template);
      if (reason === 'skip') continue;
      const cell = ((rates[rule.id] ??= {})[r.template] ??= { pass: 0, total: 0 });
      cell.total += 1;
      if (reason == null) cell.pass += 1;
      else failures.push({ label: r.label, rule: rule.id, reason });
    }
  }
  return { rates, failures };
}

function printTable(rates) {
  const templates = [...new Set(Object.values(rates).flatMap((t) => Object.keys(t)))].sort();
  const short = (t) => ({ INCORRECT_WORKED_EXAMPLES: 'SLIP', FAVORITE_NO: 'MFN', MATH_DETECTIVE: 'MD', COMPARE_THE_THINKING: 'CTT', MAKE_YOUR_CASE: 'MYC' }[t] ?? t);
  console.log(`${'rule'.padEnd(46)}${templates.map((t) => short(t).padStart(8)).join('')}`);
  for (const rule of RULES) {
    if (!rates[rule.id]) continue;
    const cells = templates.map((t) => {
      const c = rates[rule.id][t];
      return (c ? `${c.pass}/${c.total}` : '·').padStart(8);
    });
    console.log(`${rule.id.padEnd(46)}${cells.join('')}`);
  }
}

function compareToBaseline(rates) {
  if (!existsSync(BASELINE)) return [];
  const base = JSON.parse(readFileSync(BASELINE, 'utf8')).rates;
  const drops = [];
  for (const [rule, byTemplate] of Object.entries(rates)) {
    for (const [template, c] of Object.entries(byTemplate)) {
      const b = base?.[rule]?.[template];
      if (b && b.total && c.total && c.pass / c.total < b.pass / b.total) {
        drops.push(`${rule} / ${template}: ${b.pass}/${b.total} → ${c.pass}/${c.total}`);
      }
    }
  }
  return drops;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
  const records = arg('--replay') ? loadReplay(arg('--replay')) : arg('--run') ? loadRun(arg('--run')) : null;
  if (!records) {
    console.error('usage: checkActivityOutput.mjs --replay <dir> | --run <runId|dir> [--save-baseline]');
    process.exit(2);
  }
  const { rates, failures } = checkRecords(records);
  printTable(rates);
  if (failures.length) {
    console.log(`\nFailures (${failures.length}):`);
    for (const f of failures) console.log(`  ${f.label} — ${f.rule}: ${f.reason}`);
  }
  if (process.argv.includes('--save-baseline')) {
    writeFileSync(BASELINE, JSON.stringify({ savedAt: new Date().toISOString(), source: arg('--replay') ?? arg('--run'), rates }, null, 2));
    console.log(`\nBaseline saved → ${path.relative(process.cwd(), BASELINE)}`);
  } else {
    const drops = compareToBaseline(rates);
    if (drops.length) {
      console.log(`\nWorse than baseline:\n${drops.map((d) => `  ${d}`).join('\n')}`);
      process.exit(1);
    }
  }
}
