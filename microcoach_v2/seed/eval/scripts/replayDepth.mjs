/**
 * replayDepth.mjs — run the LOCAL ScoresCalc (its depth prompt and scoring) on the
 * input a past eval run recorded, N times, without deploying anything.
 *
 * Why this exists: Conceptual Depth is the rubric's one model-judged metric, and on
 * a fixed input it moved between levels from call to call (v32: two misconceptions
 * spanning 0-2, so the top 3 changed between calls on the same data). One call per
 * version cannot tell a prompt change from that spread, so this samples it. It is
 * the depth counterpart of replayMisconception.mjs.
 *
 * It imports the Lambda's own handler, so what runs is what the deployed function
 * would run with the local source. ScoresCalc reads its JSON with readFileSync, so
 * unlike LLMGenMisconception it needs no staging shim.
 *
 * Usage (from microcoach_v2/):
 *   node seed/eval/scripts/replayDepth.mjs                     # latest run, N=5
 *   node seed/eval/scripts/replayDepth.mjs --run v33 --n 5
 *   node seed/eval/scripts/replayDepth.mjs --from seed/eval/replays/depth-<stamp>   # re-analyse, no calls
 *
 * Credentials: API_SECRET_NAME if set, else the deployed function's own setting
 * (microcoachv2ScoresCalc-$AMPLIFY_ENV, default dev), read with the AWS SDK.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUNS_DIR = path.resolve(__dirname, '../runs');
const REPLAYS_DIR = path.resolve(__dirname, '../replays');
const CALL_FILE = 'calls/03-rubric-score.json';
const HANDLER = path.resolve(__dirname, '../../../amplify/backend/function/microcoachv2ScoresCalc/src/index.mjs');

const arg = (flag, fallback = null) => {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

// The newest run dir whose name contains `want` and that recorded a scoring call.
function findRun(want) {
  const dirs = fs.readdirSync(RUNS_DIR)
    .filter((d) => (!want || d.includes(want)) && fs.existsSync(path.join(RUNS_DIR, d, CALL_FILE)))
    .map((d) => ({ d, t: fs.statSync(path.join(RUNS_DIR, d)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (!dirs.length) throw new Error(`No run matching "${want ?? ''}" has ${CALL_FILE}`);
  return dirs[0].d;
}

async function ensureSecretName() {
  if (process.env.API_SECRET_NAME) return;
  const { LambdaClient, GetFunctionConfigurationCommand } = await import('@aws-sdk/client-lambda');
  const name = `microcoachv2ScoresCalc-${process.env.AMPLIFY_ENV ?? 'dev'}`;
  const client = new LambdaClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  const cfg = await client.send(new GetFunctionConfigurationCommand({ FunctionName: name }));
  const secret = cfg.Environment?.Variables?.API_SECRET_NAME;
  if (!secret) throw new Error(`${name} has no API_SECRET_NAME`);
  process.env.API_SECRET_NAME = secret;
}

const unwrap = (raw) => {
  let s = raw;
  while (typeof s === 'string') s = JSON.parse(s);
  return s;
};

// Most common value and how often it occurred.
const mode = (values) => {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
};

function report(original, samples) {
  const byTitle = (s) => new Map(s.scored.map((x) => [x.title, x]));
  const base = byTitle(original);
  const runs = samples.map(byTitle);
  const titles = [...base.keys()].sort((a, b) => base.get(a).priorityRank - base.get(b).priorityRank);
  const needed = Math.ceil(samples.length * 0.8);

  console.log(`\n${'misconception'.padEnd(42)} reach  run  ${samples.map((_, i) => String(i + 1).padStart(2)).join(' ')}   same in ≥${needed}/${samples.length}`);
  let consistent = 0;
  for (const t of titles) {
    const depths = runs.map((r) => r.get(t)?.inputs?.conceptualDepth ?? '–');
    const [, n] = mode(depths);
    if (n >= needed) consistent += 1;
    const reach = Math.round((base.get(t).inputs?.studentPercent ?? 0) * 100);
    console.log(`${t.slice(0, 42).padEnd(42)} ${String(reach).padStart(4)}%  ${String(base.get(t).inputs?.conceptualDepth ?? '–').padStart(3)}  ${depths.map((d) => String(d).padStart(2)).join(' ')}   ${n >= needed ? '✓' : '✗'}`);
  }

  const topSets = runs.map((r) => [...r.values()].filter((x) => x.retained).map((x) => x.title).sort().join(' | '));
  const focus = runs.map((r) => [...r.values()].find((x) => x.isRecommendedFocus)?.title ?? '—');
  const distinct = new Set(topSets);
  console.log(`\nconsistent depth: ${consistent}/${titles.length}   distinct top-3 sets: ${distinct.size} of ${samples.length}`);
  for (const s of distinct) console.log(`   ${topSets.filter((x) => x === s).length}×  ${s}`);
  const focusCounts = [...new Set(focus)].map((f) => `${f} ×${focus.filter((x) => x === f).length}`);
  console.log(`Recommended Focus: ${focusCounts.join(', ')}`);
}

async function main() {
  const fromDir = arg('--from');
  if (fromDir) {
    const files = fs.readdirSync(fromDir).filter((f) => /^sample-\d+\.json$/.test(f)).sort();
    const original = JSON.parse(fs.readFileSync(path.join(fromDir, 'original.json'), 'utf8'));
    report(original, files.map((f) => unwrap(fs.readFileSync(path.join(fromDir, f), 'utf8'))));
    return;
  }

  const run = findRun(arg('--run'));
  const N = Number(arg('--n', '5'));
  if (!Number.isInteger(N) || N < 1) throw new Error(`--n must be a positive integer, got ${arg('--n')}`);
  const call = JSON.parse(fs.readFileSync(path.join(RUNS_DIR, run, CALL_FILE), 'utf8'));
  const outDir = arg('--out') ?? path.join(REPLAYS_DIR, `depth-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'original.json'), JSON.stringify(call.output));

  await ensureSecretName();
  const { handler } = await import(pathToFileURL(HANDLER).href);

  console.log(`replay depth  ·  ${run}  ·  N=${N}  ·  local ScoresCalc  →  ${path.relative(process.cwd(), outDir)}`);
  const samples = [];
  for (let i = 1; i <= N; i += 1) {
    // No seed on purpose: the spread between calls is the measurement.
    const result = unwrap(await handler({ input: call.input }));
    if (result?.ok === false) throw new Error(`call ${i} failed: ${result.error?.message}`);
    fs.writeFileSync(path.join(outDir, `sample-${i}.json`), JSON.stringify(result));
    samples.push(result);
    process.stdout.write(`  call ${i} done\n`);
  }
  // The handler logs a score table per call; the summary below is the comparison.
  report(call.output, samples);
}

main().catch((err) => {
  console.error(`\nreplayDepth failed: ${err?.message ?? err}`);
  process.exit(1);
});
