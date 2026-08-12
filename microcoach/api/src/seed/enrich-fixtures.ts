/**
 * Backfills the misconception → wrong-answer linkage onto the archived fixtures.
 *
 * Why this exists rather than simply re-running `yarn ingest`: a full re-ingest mints
 * new misconceptions with new ids and reworded titles. The fixtures are archives of a
 * specific March 2026 pipeline run, and their misconception ids are the join key the
 * whole identity chain rests on. Re-ingesting would discard exactly the records the
 * archive was captured from. So this does two things instead:
 *
 *   1. Attaches answer-choice text to the assessment questions   (deterministic)
 *   2. Asks the ingest Lambda, in link-only mode, to attribute   (one model call)
 *      options to the misconceptions that already exist
 *
 * Nothing here writes to DynamoDB or AppSync. It rewrites fixture JSON on disk and
 * refreshes the checksums in index.json.
 *
 *   yarn enrich-fixtures                 # all fixtures that have a source document
 *   yarn enrich-fixtures --fixture ef38  # one
 *   yarn enrich-fixtures --dry-run       # report, write nothing
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { pathToFileURL } from 'url';
import mammoth from 'mammoth';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const AMPLIFY_ENV = process.env.AMPLIFY_ENV ?? 'dev';
const FIXTURE_DIR = path.resolve(__dirname, '../eval/fixtures');
const SESSION_DIR = path.join(FIXTURE_DIR, 'sessions');
const DATA_ROOT = path.resolve(__dirname, '../../../Data');

const PARSER_PATH = path.resolve(
  __dirname,
  '../../amplify/backend/function/microcoachIngestPPQ/src/util/parsePpqTable.mjs',
);

// Same trick as fixtures.ts: ts-node emits CommonJS and would downlevel a plain
// `await import()` into `require()`, which cannot load ESM.
const esmImport = new Function('p', 'return import(p)') as (p: string) => Promise<any>;

/**
 * Which source document backs which fixture. The archive records `classroom.name`
 * and `session.sessionLabel`, which is exactly the Data/ directory layout.
 */
function docxPathFor(d: any): string | null {
  const classroom = String(d.classroom?.name ?? '').replace(/\s+/g, '');
  const label = String(d.session?.sessionLabel ?? '');
  if (!classroom || !label) return null;
  const p = path.join(DATA_ROOT, classroom, label, 'PPQ.docx');
  return fs.existsSync(p) ? p : null;
}

async function invokeLambda(functionName: string, payload: unknown): Promise<any> {
  const client = new LambdaClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  const resp = await client.send(new InvokeCommand({
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(payload)),
  }));
  if (resp.FunctionError) {
    throw new Error(`Lambda ${functionName} error: ${Buffer.from(resp.Payload as Uint8Array).toString('utf8')}`);
  }
  const out = JSON.parse(Buffer.from(resp.Payload as Uint8Array).toString('utf8'));
  return typeof out === 'string' ? JSON.parse(out) : out;
}

async function main() {
  const argv = process.argv.slice(2);
  const only = argv.includes('--fixture') ? argv[argv.indexOf('--fixture') + 1] : null;
  const dryRun = argv.includes('--dry-run');

  const mod = await esmImport(pathToFileURL(PARSER_PATH).href);
  const { parsePpqTable, reconcileQuestionNumbers } = mod;

  console.log('=== Fixture Enrichment ===');
  console.log(`  env: ${AMPLIFY_ENV}${dryRun ? '  (dry run — nothing will be written)' : ''}\n`);

  const manifest = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, 'index.json'), 'utf8'));
  const summaries: any[] = manifest.sessions ?? [];
  const targets = only ? summaries.filter((s) => s.id.startsWith(only)) : summaries;
  if (!targets.length) throw new Error(`No fixture matching "${only}"`);

  for (const summary of targets) {
    const file = path.join(SESSION_DIR, `${summary.id}.json`);
    const d = JSON.parse(fs.readFileSync(file, 'utf8'));
    process.stdout.write(`  ${summary.id}  ${d.classroom?.name} / ${d.session?.sessionLabel}  `);

    const docx = docxPathFor(d);
    if (!docx) {
      console.log('— no source document, skipping');
      continue;
    }

    const ppq = (d.input?.assessments ?? []).find((a: any) => a.type === 'PPQ');
    if (!ppq) { console.log('— no PPQ assessment, skipping'); continue; }

    // 1. Parse the table and reconcile document numbering to stored numbering.
    //    Both steps throw rather than guess; a mismatch here would misattribute
    //    every option that follows.
    const { value: ppqText } = await mammoth.extractRawText({ path: docx });
    const table = parsePpqTable(ppqText);
    const qNumMap: Map<number, number> = reconcileQuestionNumbers(table, ppq.questions);

    // 2. Attach answer-choice text to the stored questions. Deterministic.
    const byStoredNum = new Map<number, any>();
    for (const q of table) byStoredNum.set(qNumMap.get(q.docxQuestion)!, q);
    ppq.questions = ppq.questions.map((q: any) => {
      const src = byStoredNum.get(q.questionNumber);
      return src
        ? { ...q, docxQuestion: src.docxQuestion, answerChoices: src.options }
        : q;
    });

    // 3. Attribute options to the misconceptions that already exist.
    const existing = (d.output?.misconceptions ?? []).map((m: any) => ({
      id: m.id, title: m.title, description: m.description,
    }));
    if (!existing.length) { console.log('— no misconceptions, skipping'); continue; }

    const result = await invokeLambda(`microcoachIngestPPQ-${AMPLIFY_ENV}`, {
      input: { ppqText, existingMisconceptions: existing },
    });

    // A deployed Lambda that predates link-only mode ignores `existingMisconceptions`,
    // runs a normal ingest, and returns no `links`. Left unchecked that writes an
    // empty attribution onto every misconception and reports success — a silent
    // wrong answer. Fail instead, and say what to do about it.
    if (!Array.isArray(result?.links)) {
      throw new Error(
        `microcoachIngestPPQ-${AMPLIFY_ENV} returned no "links" — the deployed function ` +
        `predates link-only mode. Run "amplify push" before enriching. ` +
        `Got keys: ${Object.keys(result ?? {}).join(', ') || '(none)'}`
      );
    }

    // Translate document numbering to stored numbering before it lands on disk, so
    // no consumer has to know the document's numbering scheme exists.
    const linkById = new Map<string, any[]>(
      (result.links ?? []).map((l: any) => [
        l.id,
        (l.wrongAnswers ?? []).map((w: any) => ({
          questionNumber: qNumMap.get(w.docxQuestion),
          letter: w.letter,
        })).filter((w: any) => w.questionNumber != null),
      ])
    );

    d.output.misconceptions = d.output.misconceptions.map((m: any) => ({
      ...m, wrongAnswers: linkById.get(m.id) ?? [],
    }));

    const linked = d.output.misconceptions.filter((m: any) => m.wrongAnswers.length).length;
    const refs = d.output.misconceptions.reduce((n: number, m: any) => n + m.wrongAnswers.length, 0);
    const stats = result.wrongAnswerLinkStats ?? {};
    console.log(
      `✓ ${refs} option refs across ${linked}/${existing.length} misconceptions` +
      (stats.rejected?.length ? `  (${stats.rejected.length} rejected)` : '')
    );
    for (const m of d.output.misconceptions) {
      const refsStr = m.wrongAnswers.map((w: any) => `Q${w.questionNumber}${w.letter}`).join(' ') || '(none)';
      console.log(`      ${m.title}: ${refsStr}`);
    }

    if (dryRun) continue;

    d.provenance = {
      ...(d.provenance ?? {}),
      enrichedAt: new Date().toISOString(),
      enrichedFrom: path.relative(DATA_ROOT, docx),
    };

    const body = JSON.stringify(d, null, 2);
    fs.writeFileSync(file, body, 'utf8');
    summary.sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    summary.wrongAnswerRefs = refs;
  }

  if (!dryRun) {
    fs.writeFileSync(path.join(FIXTURE_DIR, 'index.json'), JSON.stringify(manifest, null, 2), 'utf8');
    console.log('\n  index.json checksums refreshed');
  }
  console.log('\nDone. Run: yarn generate --fixture <id>');
}

main().catch((err) => {
  console.error('\nEnrichment failed:', err.message ?? err);
  process.exit(1);
});
