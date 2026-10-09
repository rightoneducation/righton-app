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
const STUDENT_WORK = /\b(student|students'?|selected|shaded|shading|drew|wrote|their (work|graph|answer|solution)|here is|here's|look at|examine|investigate|what went wrong|mistake|error|incorrect|wrong)\b/i;

// Words that name the rule a misconception breaks. One counts only when the
// misconception itself uses it, so "dashed" is a leak for a boundary-style
// misconception and not for a slope one.
const ANSWER_TERMS = ['dashed', 'solid', 'flip', 'reverse', 'reciprocal', 'test point', 'intersection', 'union', 'overlap', 'isolate', 'slope-intercept', 'strict', 'inclusive'];

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
