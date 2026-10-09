/**
 * Replay NextStepOption's activity call on frozen inputs, locally — no deploy, no
 * full eval. The inner loop for prompt and schema changes.
 *
 *   node seed/eval/scripts/replayActivity.mjs [--samples 3] [--cases a,b] [--full] [--save-baseline]
 *
 * Inputs are seed/eval/activity-cases/*.json: one captured activity-call input per
 * template, picked from runs where a known failure appeared, so every iteration
 * is tested on the cases that broke. Each case runs --samples times (the generator
 * is stochastic; one sample cannot tell a fix from luck). By default the Lambda
 * stops after the activity (`stopAfter: 'activity'`); --full also runs the closing
 * discussion and its review.
 *
 * Runs the LOCAL source of microcoachv2NextStepOption (copied to a temp folder
 * with the import-attribute keyword node 22 expects), against the real OpenAI API.
 * Outputs land in seed/eval/replays/<stamp>/, then checkActivityOutput.mjs scores
 * them against the saved baseline.
 *
 * Needs AWS credentials (the OpenAI key is read from Secrets Manager, `openai-api`).
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const LAMBDA_SRC = path.join(ROOT, 'amplify/backend/function/microcoachv2NextStepOption/src');
const CASES_DIR = path.join(ROOT, 'seed/eval/activity-cases');
const REPLAYS = path.join(ROOT, 'seed/eval/replays');
const CONCURRENCY = 5;

const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
const samples = Number(arg('--samples') ?? 3);
const only = arg('--cases')?.split(',') ?? null;
const full = process.argv.includes('--full');

// ── Load the local Lambda source ──────────────────────────────────────────────
// A temp copy inside the Lambda folder, so its node_modules resolve, with
// `assert { type: 'json' }` rewritten to `with` for node 22.
const tmp = path.join(LAMBDA_SRC, '.replay-tmp');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(path.join(tmp, 'util'), { recursive: true });
for (const f of ['index.mjs']) cpSync(path.join(LAMBDA_SRC, f), path.join(tmp, f));
for (const f of readdirSync(path.join(LAMBDA_SRC, 'util'))) cpSync(path.join(LAMBDA_SRC, 'util', f), path.join(tmp, 'util', f));
for (const f of ['index.mjs', ...readdirSync(path.join(tmp, 'util')).filter((x) => x.endsWith('.mjs')).map((x) => `util/${x}`)]) {
  const p = path.join(tmp, f);
  writeFileSync(p, readFileSync(p, 'utf8').replaceAll("assert { type: 'json' }", "with { type: 'json' }"));
}
symlinkSync(path.join(LAMBDA_SRC, 'node_modules'), path.join(tmp, 'node_modules'));
process.env.API_SECRET_NAME ??= 'openai-api';
process.env.REGION ??= 'us-east-1';

let handler;
try {
  ({ handler } = await import(pathToFileURL(path.join(tmp, 'index.mjs')).href));
} catch (err) {
  rmSync(tmp, { recursive: true, force: true });
  throw err;
}

// ── Run ───────────────────────────────────────────────────────────────────────
const cases = readdirSync(CASES_DIR)
  .filter((f) => f.endsWith('.json') && f !== 'baseline.json')
  .map((f) => JSON.parse(readFileSync(path.join(CASES_DIR, f), 'utf8')))
  .filter((c) => !only || only.includes(c.name));

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.join(REPLAYS, stamp);
mkdirSync(outDir, { recursive: true });

const jobs = cases.flatMap((c) => Array.from({ length: samples }, (_, i) => ({ c, sample: i + 1 })));
console.log(`Replaying ${cases.length} case(s) × ${samples} sample(s) = ${jobs.length} call(s)${full ? ' (full: activity + discussion + review)' : ' (activity only)'}…`);

const started = Date.now();
let done = 0;
async function runJob({ c, sample }) {
  const misconception = JSON.parse(c.input.misconception);
  const record = {
    case: c.name,
    sample,
    template: null,
    misconception: { title: misconception.title, description: misconception.description },
  };
  try {
    const raw = await handler({ input: { ...c.input, trace: true, ...(full ? {} : { stopAfter: 'activity' }) } });
    record.output = JSON.parse(raw);
    record.template = record.output.activityType;
  } catch (err) {
    record.error = err?.message ?? String(err);
  }
  writeFileSync(path.join(outDir, `${c.name}-${sample}.json`), JSON.stringify(record, null, 2));
  done += 1;
  process.stdout.write(`\r  ${done}/${jobs.length}`);
}

const queue = [...jobs];
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
  while (queue.length) await runJob(queue.shift());
}));
rmSync(tmp, { recursive: true, force: true });
console.log(`\n  done in ${Math.round((Date.now() - started) / 1000)}s → ${path.relative(process.cwd(), outDir)}\n`);

// ── Score ─────────────────────────────────────────────────────────────────────
const check = spawnSync('node', [
  path.join(HERE, 'checkActivityOutput.mjs'), '--replay', outDir,
  ...(process.argv.includes('--save-baseline') ? ['--save-baseline'] : []),
], { stdio: 'inherit' });
process.exit(check.status ?? 1);
