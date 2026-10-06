/**
 * replayMisconception.mjs — run the CURRENT misconception prompt against inputs
 * recorded by past eval runs, N times each, without deploying anything.
 *
 * Why this exists: the generation prompt went unchanged from v15 to v20 — nine runs,
 * byte-identical `prompts/02-gen-misconception.txt` — while the output moved run to
 * run. With one sample per version there was no way to tell a prompt change from
 * resampling, so five tuning cycles were read off noise. This calls the model N times
 * on the same input and separates what the prompt reliably produces from what it
 * produces by chance.
 *
 * It imports the Lambda's own `buildPrompt`, `buildGenResponse` and `validateOutput`,
 * so what runs here is what the deployed function would run — minus the deploy. That
 * is also the limit: nothing downstream of generation is exercised, and agreement here
 * is necessary but not sufficient. A push and a full eval remain the only end-to-end
 * proof.
 *
 * Deliberately a standalone script, not a `util/` module: a calibration harness must
 * never be importable from generate.ts.
 *
 * Usage (from microcoach_v2/):
 *   node seed/eval/scripts/replayMisconception.mjs                      # v15..v20, N=3
 *   node seed/eval/scripts/replayMisconception.mjs --n 5
 *   node seed/eval/scripts/replayMisconception.mjs --runs v19,v20
 *   node seed/eval/scripts/replayMisconception.mjs --runs all --n 3
 *   node seed/eval/scripts/replayMisconception.mjs --prompt-only        # no model calls
 *   node seed/eval/scripts/replayMisconception.mjs --out /tmp/replay    # dump responses
 *   node seed/eval/scripts/replayMisconception.mjs --from /tmp/replay   # re-analyse, no calls
 *
 * Credentials: OPENAI_API_KEY if set, else API_SECRET_NAME out of Secrets Manager —
 * the same secret and the same key precedence the Lambda uses.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUNS_DIR = path.resolve(__dirname, '../runs');
const CALL_FILE = 'calls/02-gen-misconception.json';
const LAMBDA_SRC = path.resolve(__dirname, '../../../amplify/backend/function/microcoachv2LLMGenMisconception/src');
const STAGE_PARENT = path.resolve(__dirname, '../../../node_modules');

/**
 * Import the Lambda's module without editing it.
 *
 * The Lambda uses `import config from './util/config.json' assert { type: 'json' }`,
 * which the nodejs20 runtime wants and Node 22 rejects outright — a SyntaxError at
 * parse time, before any of the module body runs. Rewriting the deployed source to
 * the newer `with` spelling is a change we could not verify without a push, so the
 * copy is staged and rewritten instead. Nothing under amplify/ is touched, so a
 * stray file can never reach a deployment.
 *
 * Staged inside `microcoach_v2/node_modules/` on purpose, rather than in a temp
 * directory. The Lambda's imports are split across two trees — `@aws-sdk/*` and
 * `openai` resolve from `microcoach_v2/node_modules`, `zod` only from the monorepo
 * root — and from here Node's ordinary upward walk reaches both. A temp directory
 * would need symlinks to each, and a dangling node_modules symlink has broken
 * `amplify push` in this repo before. Being under node_modules also keeps it out of
 * git without a .gitignore entry.
 */
async function importLambda() {
  const stage = fs.mkdtempSync(path.join(STAGE_PARENT, '.mc-replay-'));
  process.on('exit', () => { try { fs.rmSync(stage, { recursive: true, force: true }); } catch { /* best effort */ } });

  fs.cpSync(LAMBDA_SRC, stage, {
    recursive: true,
    filter: (src) => !src.split(path.sep).includes('node_modules'),
  });

  const entry = path.join(stage, 'index.mjs');
  const original = fs.readFileSync(entry, 'utf8');
  const rewritten = original.replace(/\bassert(\s*\{\s*type\s*:)/g, 'with$1');
  if (rewritten === original) {
    // Not fatal — it just means the Lambda moved to `with` and this shim is obsolete.
    console.warn('note: no `assert { type: ... }` found to rewrite; the staging shim may no longer be needed');
  }
  fs.writeFileSync(entry, rewritten);

  return {
    lambda: await import(pathToFileURL(entry).href),
    secrets: await import(pathToFileURL(path.join(stage, 'util/loadsecrets.mjs')).href),
  };
}

// Default window: the nine runs that shared one prompt. Those are the ones whose
// output we are trying to explain, so they are the ones worth re-sampling.
const DEFAULT_RUNS = ['v15', 'v16', 'v17', 'v18', 'v19', 'v20'];

const arg = (flag, fallback = null) => {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const has = (flag) => process.argv.includes(flag);

// Bound in main() from the staged copy. The Lambda's own implementations, so the
// prompt built here is the prompt the deployed function builds.
let buildPrompt;
let buildGenResponse;
let validateOutput;
let parseJson;
let MODEL;
let loadSecret;

async function resolveKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  // Same secret the Lambda's CloudFormation template sets for API_SECRET_NAME.
  const secretName = process.env.API_SECRET_NAME ?? 'openai-api';
  if (!secretName) {
    throw new Error('Set OPENAI_API_KEY, or API_SECRET_NAME for the Secrets Manager path');
  }
  const { openai_api: a, OPENAI_API_KEY: b, API: c } = JSON.parse(await loadSecret(secretName));
  const key = a ?? b ?? c;
  if (!key) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
  return key;
}

/**
 * Recorded inputs, newest last. 20 of the 38 run directories are empty skeletons —
 * `seed/eval/runs/` is gitignored and the payloads were pruned — so a missing call
 * file is normal and is skipped rather than treated as an error.
 */
function loadRecordedInputs(wanted) {
  if (!fs.existsSync(RUNS_DIR)) throw new Error(`No runs directory at ${RUNS_DIR}`);
  const all = fs.readdirSync(RUNS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const match = (dir) => {
    if (wanted === 'all') return true;
    const tag = dir.split('none-')[1] ?? dir;
    return wanted.some((w) => tag.startsWith(w));
  };

  const out = [];
  const skipped = [];
  for (const dir of all.filter(match)) {
    const file = path.join(RUNS_DIR, dir, CALL_FILE);
    if (!fs.existsSync(file)) { skipped.push(dir); continue; }
    const { input } = JSON.parse(fs.readFileSync(file, 'utf8'));
    out.push({
      tag: (dir.split('none-')[1] ?? dir).replace(/-2026-.*$/, ''),
      dir,
      // The handler receives these as JSON strings and parses them the same way.
      questions: parseJson(input.questions),
      context: parseJson(input.context ?? '{}') ?? {},
      learningScienceData: parseJson(input.learningScienceData ?? '{"standards":[]}') ?? { standards: [] },
    });
  }
  return { inputs: out, skipped };
}

/** One model call, mirroring the handler's messages and response_format exactly. */
async function callOnce(openai, model, prompt, schema) {
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(schema, 'genMisconception'),
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('Empty completion content');
  return { raw, usage: completion.usage ?? null };
}

const histogram = (rejected) => rejected.reduce((acc, r) => {
  acc[r.reason] = (acc[r.reason] ?? 0) + 1;
  return acc;
}, {});

const fmtHist = (h) => (Object.keys(h).length
  ? Object.entries(h).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' ')
  : '—');

/**
 * A misconception's identity, for comparing one sample against another.
 *
 * Not the title. The model rewords titles freely between samples — "Treated -6 as
 * slope", "Took coefficients as slope" and "Used x-coefficient as slope" are one
 * misconception in three wordings — so keying on the title reports near-total
 * instability even when the readings agree. The set of distractors a misconception
 * claims is structural and does not reword, and it is the identity the stable
 * clusters were found on in the first place (Q1B+Q1D, Q1B+Q5C+Q5D, Q1C+Q5A+Q5D).
 *
 * The tradeoff: two genuinely different readings of the same distractor set collapse
 * into one key. That is the v20 case exactly — "Set variable to zero" and "Swapped x
 * and y" both claim Q3A+Q3C — so the titles seen under each key are printed, and a
 * key with disagreeing titles is the thing worth looking at.
 */
const refKey = (m) => (m.wrongAnswers ?? [])
  .map((w) => `Q${w.questionNumber}${w.letter}`)
  .sort()
  .join(',');

/**
 * Per-distractor coverage: for each wrong option, how many attempts explained it and
 * how many misconceptions claimed it.
 *
 * The most robust view available. Titles reword between samples and distractor sets
 * regroup — the shading misconception appeared in all three baseline attempts under
 * two different keys (Q5C,Q5D and Q1B,Q5C,Q5D) — so neither title nor ref-set is a
 * stable identity on its own. An individual option either got explained or it did
 * not, and that survives both kinds of drift.
 *
 * `claims` above 1 is not automatically wrong: the prompt allows an option to sit
 * under two misconceptions "when its value is genuinely consistent with two different
 * errors". It is worth seeing, because that is also what over-attribution looks like.
 */
function coverage(attempts, questions) {
  const good = attempts.filter((a) => a.ok);
  const wrong = [];
  for (const q of questions) {
    for (const o of q.answerChoices ?? []) {
      if (!o.isCorrect) wrong.push({ ref: `Q${q.questionNumber}${o.letter}`, n: o.studentCount ?? 0 });
    }
  }
  const rows = wrong.map(({ ref, n }) => {
    const claims = good.map((a) => a.misconceptions.filter((m) => refKey(m).split(',').includes(ref)).length);
    return { ref, n, covered: claims.filter((c) => c > 0).length, claims };
  });
  console.log(`      per-distractor coverage (of ${good.length} attempts):`);
  for (const r of rows.sort((a, b) => b.n - a.n)) {
    const flag = r.covered < good.length ? ' ← not always explained' : '';
    console.log(`        ${r.ref.padEnd(5)} n=${String(r.n).padStart(2)}  covered ${r.covered}/${good.length}`
      + `  claims ${r.claims.join('/')}${flag}`);
  }
}

function report(attempts, questions) {
  attempts.forEach((a, i) => {
    if (!a.ok) { console.log(`   attempt ${i + 1}: FAILED — ${a.error}`); return; }
    const flags = a.admissionFlags ?? [];
    console.log(`   attempt ${i + 1}: ${String(a.misconceptions.length).padStart(2)} misconception(s)`
      + `  ·  rejected ${String(a.rejected.length).padStart(2)} [${fmtHist(histogram(a.rejected))}]`
      + `  ·  flagged ${String(flags.length).padStart(2)}`);
    for (const m of a.misconceptions) console.log(`        - ${m.title}  (${refKey(m)})`);
    // Report-only well-formedness hits. Nothing is dropped for these yet, so they are
    // the evidence for whether genMisconception.enforceAdmission can safely go true.
    for (const f of flags) console.log(`        ⚑ ${f.misconception} — ${f.hits.join('; ')}`);
  });

  const good = attempts.filter((a) => a.ok);
  if (good.length === 0) { console.log('   no successful attempts'); return; }

  const clusters = new Map();
  for (const a of good) {
    for (const m of a.misconceptions) {
      const k = refKey(m);
      if (!clusters.has(k)) clusters.set(k, { n: 0, titles: new Set() });
      clusters.get(k).n += 1;
      clusters.get(k).titles.add(m.title);
    }
  }
  const sorted = [...clusters.entries()].sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0]));
  const stable = sorted.filter(([, c]) => c.n >= good.length);
  const noise = sorted.filter(([, c]) => c.n < good.length);

  const sizes = good.map((a) => a.misconceptions.length);
  const rejTotals = good.map((a) => a.rejected.length);
  console.log(`   ── across ${good.length} attempt(s), keyed on distractor set`);
  console.log(`      count ${Math.min(...sizes)}..${Math.max(...sizes)}`
    + `  ·  rejected ${Math.min(...rejTotals)}..${Math.max(...rejTotals)}`
    + `  ·  ${stable.length} stable / ${noise.length} unstable of ${clusters.size} clusters`);

  const show = (rows, mark) => {
    for (const [k, c] of rows) {
      const titles = [...c.titles];
      console.log(`        ${mark} ${k.padEnd(18)} ${c.n}/${good.length}  ${titles[0]}`);
      // More than one wording under one distractor set: either harmless rewording or
      // two different readings of the same evidence. Worth eyeballing.
      for (const t of titles.slice(1)) console.log(`          ${' '.repeat(18)}      ↳ also: ${t}`);
    }
  };
  if (stable.length) { console.log('      stable:'); show(stable, '✓'); }
  if (noise.length) { console.log('      unstable:'); show(noise, '~'); }
  if (questions) coverage(attempts, questions);
}

/**
 * Re-analyse saved responses instead of calling the model.
 *
 * `validateOutput` and the admission checks inside it are the part most likely to
 * need several passes to calibrate, and re-sampling to test a rule change would both
 * cost tokens and move the data underneath the change. This replays the stored raw
 * responses through the current `validateOutput`, so a rule can be tuned against a
 * fixed sample.
 */
async function analyseSaved(dir, wanted) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  const byTag = new Map();
  for (const f of files) {
    const tag = f.replace(/\.attempt\d+\.json$/, '');
    if (wanted !== 'all' && !wanted.some((w) => tag.startsWith(w))) continue;
    if (!byTag.has(tag)) byTag.set(tag, []);
    byTag.get(tag).push(path.join(dir, f));
  }
  if (byTag.size === 0) throw new Error(`No saved attempt files in ${dir}`);

  const { inputs } = loadRecordedInputs(wanted);
  console.log('='.repeat(78));
  console.log(`re-analysing saved responses from ${dir}  ·  no model calls`);
  console.log('='.repeat(78));

  for (const [tag, paths] of byTag) {
    // The questions are needed to re-run validateOutput; take them from the run the
    // responses were generated against, or from any input if that tag is gone.
    const input = inputs.find((i) => i.tag === tag) ?? inputs[inputs.length - 1];
    if (!input) throw new Error(`No recorded input available to validate ${tag} against`);
    console.log(`\n── ${tag} ${'─'.repeat(Math.max(0, 60 - tag.length))}`);
    const attempts = paths.map((p) => {
      try {
        const structured = JSON.parse(fs.readFileSync(p, 'utf8'));
        return { ok: true, ...validateOutput(structured, input.questions) };
      } catch (err) {
        return { ok: false, error: String(err?.message ?? err) };
      }
    });
    report(attempts, input.questions);
  }
}

async function main() {
  const { lambda, secrets } = await importLambda();
  ({ buildPrompt, buildGenResponse, validateOutput, parseJson, MODEL } = lambda);
  ({ loadSecret } = secrets);

  const fromDir = arg('--from');
  if (fromDir) {
    const r = arg('--runs');
    await analyseSaved(fromDir, r === 'all' || !r ? 'all' : r.split(',').map((s) => s.trim()));
    return;
  }

  const runsArg = arg('--runs');
  const wanted = runsArg === 'all' ? 'all' : (runsArg ? runsArg.split(',').map((s) => s.trim()) : DEFAULT_RUNS);
  const N = Number(arg('--n', '3'));
  const model = arg('--model', MODEL);
  const outDir = arg('--out');
  const promptOnly = has('--prompt-only');

  if (!Number.isInteger(N) || N < 1) throw new Error(`--n must be a positive integer, got ${arg('--n')}`);
  if (outDir) fs.mkdirSync(outDir, { recursive: true });

  const { inputs, skipped } = loadRecordedInputs(wanted);
  if (inputs.length === 0) {
    console.error(`No recorded inputs matched. Skipped ${skipped.length} empty run dir(s).`);
    process.exit(1);
  }

  // Collapse inputs that build the same prompt. All four pilot fixtures share one
  // assessment, so every recorded run of this session yields a byte-identical prompt —
  // replaying each would be N calls per duplicate for no extra information. The most
  // recent tag in each group represents it, and the rest are named in the header so
  // the collapse is visible rather than silent.
  const groups = new Map();
  for (const input of inputs) {
    const prompt = buildPrompt(input.questions, input.context, input.learningScienceData);
    const key = crypto.createHash('md5').update(prompt).digest('hex');
    if (!groups.has(key)) groups.set(key, { prompt, members: [] });
    groups.get(key).members.push(input);
  }
  const distinct = [...groups.entries()].map(([key, g]) => ({
    key,
    prompt: g.prompt,
    input: g.members[g.members.length - 1],
    members: g.members.map((m) => m.tag),
  }));

  console.log('='.repeat(78));
  console.log(`replay  model ${model}  N=${N}  ·  ${inputs.length} recorded input(s) → ${distinct.length} distinct prompt(s)`);
  if (skipped.length) console.log(`        skipped ${skipped.length} run dir(s) with no ${CALL_FILE}`);
  console.log('='.repeat(78));

  const openai = promptOnly ? null : new OpenAI({ apiKey: await resolveKey() });
  // N>=3 is the project's own process rule. One sample cannot separate a prompt
  // change from resampling, which is the whole reason this script exists.
  if (!promptOnly && N < 3) console.warn(`\n⚠ N=${N}: below the N>=3 rule — treat the result as indicative only\n`);

  for (const { prompt, input, members, key } of distinct) {
    const schema = buildGenResponse(input.context?.ccssStandards);

    console.log(`\n── ${input.tag} ${'─'.repeat(Math.max(0, 60 - input.tag.length))}`);
    console.log(`   prompt ${prompt.length.toLocaleString()} chars (~${Math.round(prompt.length / 4).toLocaleString()} tokens)`
      + `  ·  md5 ${key.slice(0, 8)}`
      + `  ·  ${input.questions.length} questions`
      + `  ·  standards ${(input.context?.ccssStandards ?? []).join(', ') || '—'}`);
    if (members.length > 1) {
      console.log(`   same prompt as: ${members.filter((m) => m !== input.tag).join(', ')}`);
    }

    if (outDir) fs.writeFileSync(path.join(outDir, `${input.tag}.prompt.txt`), prompt);
    if (promptOnly) continue;

    const attempts = [];
    for (let i = 0; i < N; i += 1) {
      // No seed on purpose: the spread between attempts is the measurement.
      try {
        const { raw, usage } = await callOnce(openai, model, prompt, schema);
        const structured = schema.parse(JSON.parse(raw));
        const result = validateOutput(structured, input.questions);
        attempts.push({ ok: true, ...result, usage });
        if (outDir) fs.writeFileSync(path.join(outDir, `${input.tag}.attempt${i + 1}.json`), raw);
      } catch (err) {
        attempts.push({ ok: false, error: String(err?.message ?? err) });
      }
    }

    report(attempts, input.questions);
  }

  console.log(`\n${'='.repeat(78)}`);
  console.log('Replay exercises buildPrompt + validateOutput only. Downstream stages and the');
  console.log('deployed Lambda are not covered — a push and a full eval remain the only');
  console.log('end-to-end proof.');
}

main().catch((err) => {
  console.error(`\nreplayMisconception failed: ${err?.message ?? err}`);
  process.exit(1);
});
