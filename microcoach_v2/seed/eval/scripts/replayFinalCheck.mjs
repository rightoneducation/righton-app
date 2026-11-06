/**
 * Replay only the final check on activities already written, locally: no deploy, no
 * generation. Tests it on known wrong math, three times each, and on a clean run.
 *
 *   node seed/eval/scripts/replayFinalCheck.mjs
 *
 * Runs the LOCAL Lambda source against the real OpenAI API, one call per activity.
 * Needs AWS credentials (the OpenAI key is read from Secrets Manager, `openai-api`).
 * Prints whether each known case was flagged, and every flag to read by hand.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const LAMBDA_SRC = path.join(ROOT, 'amplify/backend/function/microcoachv2NextStepOption/src');
const RUNS = path.join(ROOT, 'seed/eval/runs');
const CONCURRENCY = 5;

// The wrong math found by hand, by the words of each one. `v55` had none.
const MATH_CASES = {
  v45: ['through $(0,6)$ and $(-3,0)$'],
  v52: ['4 \\geq 0, True'],
  v56: ['I tested the point (1,3)', 'nearby point (1,2)', 'for example (1,1) or (0,-2)'],
  v57: ['testing $(1,1)$ instead of a boundary point'],
};
const CLEAN = ['v55'];
const SAMPLES = 3;

const tmp = path.join(LAMBDA_SRC, '.replay-tmp');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(path.join(tmp, 'util'), { recursive: true });
cpSync(path.join(LAMBDA_SRC, 'index.mjs'), path.join(tmp, 'index.mjs'));
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

const activitiesOf = (version) => {
  const run = readdirSync(RUNS).find((d) => d.includes(`-${version}-`));
  const dir = path.join(RUNS, run, 'calls');
  return readdirSync(dir).filter((f) => /-activity-/.test(f)).map((f) => {
    const call = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    return { version, file: f, input: call.input, content: call.output.content };
  });
};

const contains = (a, quote) => JSON.stringify(a.original ?? a.content).includes(JSON.stringify(quote).slice(1, -1));
const jobs = [
  ...Object.entries(MATH_CASES).flatMap(([version, quotes]) => activitiesOf(version)
    .filter((a) => quotes.some((q) => contains(a, q)))
    .flatMap((a) => Array.from({ length: SAMPLES }, () => a))),
  ...CLEAN.flatMap(activitiesOf),
];

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.join(ROOT, 'seed/eval/replays', `final-check-${stamp}`);
mkdirSync(outDir, { recursive: true });
console.log(`Checking ${jobs.length} activities…`);

const results = [];
const queue = [...jobs];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) {
    const job = queue.shift();
    const t0 = Date.now();
    try {
      const raw = await handler({ input: { ...job.input, debugStream: false, trace: true, finalCheckOnly: job.content } });
      results.push({ ...job, seconds: Math.round((Date.now() - t0) / 1000), ...JSON.parse(raw), original: job.content });
    } catch (err) {
      results.push({ ...job, error: err?.message ?? String(err) });
    }
    process.stdout.write(`\r  ${results.length}/${jobs.length}`);
  }
}));
rmSync(tmp, { recursive: true, force: true });
writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results.map(({ input, ...r }) => r), null, 2));

console.log(`\n\nKnown problems:`);
for (const [version, quotes] of Object.entries(MATH_CASES)) {
  for (const quote of quotes) {
    const tried = results.filter((r) => r.version === version && contains(r, quote));
    const hits = tried.flatMap((r) => r.flags ?? []).filter((f) => f.text.includes(quote));
    console.log(`  ${hits.length}/${tried.length} flagged: ${version} "${quote}"`);
  }
}
console.log('\nEvery flag:');
for (const r of results) {
  console.log(`\n${r.version} ${r.file} (${r.seconds ?? '?'} s)${r.error ? ` ERROR ${r.error}` : ''}`);
  const counted = (r._trace?.subCalls ?? []).find((c) => c.label === 'final-check-rows');
  if (counted) console.log(`  math: ${counted.rows} rows, ${counted.wrong} flagged`);
  for (const f of r.flags ?? []) console.log(`  ${f.id}\n    row: ${f.text}\n    why: ${f.why}`);
}
console.log(`\nSaved → ${path.relative(process.cwd(), outDir)}`);
