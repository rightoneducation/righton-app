/**
 * importEvalFixtures.ts — load one frozen session from disk.
 *
 * A fixture is three files, mirroring where the data comes from in production:
 *
 *   fixtures/<id>/input.json   the rows `yarn upload` writes to the database
 *   fixtures/<id>/kg.json      what the Learning Commons query returns
 *   fixtures/<id>/meta.json    session id and provenance
 *
 * `input.json` matches the production write shape field-for-field, so loading is
 * mostly a re-nesting job: the pipeline reads `classroom.students.items` and
 * `session.assessments.items` because that is how AppSync returns them.
 *
 * Session selection lives in runEval.ts. This module loads exactly one.
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

const SESSION_DIR = path.resolve(__dirname, '../../fixtures');

// The graph normalizer is the Lambda's own module, imported dynamically so it is
// not statically resolved (it sits outside rootDir, and it is ESM). Using the real
// one rather than a copy means fixture replay can never drift from production.
const NORMALIZER_PATH = path.resolve(
  __dirname,
  '../../../../amplify/backend/function/microcoachv2GetLearningScience/src/util/normalizeStandard.mjs',
);

let cachedNormalize: ((item: any) => any) | null = null;

// ts-node compiles to CommonJS and would downlevel a plain `await import()` into
// `require()`, which cannot load an ESM module. Constructing the import through
// `new Function` keeps it a real dynamic import at runtime.
const esmImport = new Function('p', 'return import(p)') as (p: string) => Promise<any>;

/** Re-normalize archived raw graph items with the current production normalizer. */
export async function normalizeRawGraphItems(items: any[]): Promise<any[]> {
  if (!cachedNormalize) {
    const mod = await esmImport(pathToFileURL(NORMALIZER_PATH).href);
    cachedNormalize = (mod.normalizeStandard ?? mod.default?.normalizeStandard) as (i: any) => any;
    if (typeof cachedNormalize !== 'function') {
      throw new Error(`normalizeStandard not found in ${NORMALIZER_PATH}`);
    }
  }
  return items.map(cachedNormalize);
}

export interface Fixture {
  id: string;
  /** Shaped like a row from LIST_CLASSROOMS — students nested under `.items`. */
  classroom: any;
  /** Shaped like getSession(...) — assessments and misconceptions under `.items`. */
  currentSession: any;
  /** The PPQ assessment (not the POST_PPQ). */
  ppq: any;
  /** Shaped like studentResponsesByAssessmentId(...).items, scoped to the PPQ. */
  studentResponses: any[];
  /** Raw graph items, exactly as the Learning Commons API returned them. */
  rawGraphItems: any[];
  /** Prior sessions. The pilot has none; kept so the caller's shape is stable. */
  historySessions: any[];
}

/** Session ids, discovered from the directory rather than a manifest. */
export function availableFixtureIds(): string[] {
  if (!fs.existsSync(SESSION_DIR)) return [];
  return fs
    .readdirSync(SESSION_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function resolveId(idOrPrefix: string): string {
  const ids = availableFixtureIds();
  const hit = ids.filter((i) => i === idOrPrefix || i.startsWith(idOrPrefix));
  if (hit.length === 1) return hit[0];
  if (hit.length === 0) throw new Error(`No fixture matching "${idOrPrefix}". Available: ${ids.join(', ')}`);
  throw new Error(`"${idOrPrefix}" is ambiguous: ${hit.join(', ')}`);
}

function readJson(id: string, file: string): any {
  const p = path.join(SESSION_DIR, id, file);
  if (!fs.existsSync(p)) throw new Error(`Fixture ${id} is missing ${file}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function loadFixture(idOrPrefix: string): Fixture {
  const id = resolveId(idOrPrefix);
  const input = readJson(id, 'input.json');
  const kg = readJson(id, 'kg.json');
  const meta = readJson(id, 'meta.json');

  // `input.json` is keyed by DynamoDB table name, so each read below names the table
  // the equivalent production query would hit.
  const assessments: any[] = input.Assessment ?? [];
  const ppq = assessments.find((a) => a.type === 'PPQ') ?? null;
  if (!ppq) throw new Error(`Fixture ${id} has no PPQ assessment`);

  // The archive holds every response row for the session, PPQ and POST_PPQ alike.
  // Production fetches by `assessmentId: ppq.id`, so scope it the same way — an
  // unfiltered replay feeds post-test answers into the wrong-answer distribution.
  const studentResponses: any[] = (input.StudentResponse ?? [])
    .filter((sr: any) => sr.assessmentId === ppq.id);

  const rawGraphItems: any[] = (kg.knowledgeGraphQueries ?? []).flatMap(
    (q: any) => q.graphResponse?.data?.standardsFrameworkItems ?? [],
  );

  return {
    id,
    // `.items` nesting is the only reshaping needed — the fields themselves already
    // match what upload writes.
    classroom: { ...input.Classroom, students: { items: input.Student ?? [] } },
    currentSession: {
      ...input.Session,
      id: meta.sessionId,
      assessments: { items: assessments },
      misconceptions: { items: input.Misconception ?? [] },
    },
    ppq,
    studentResponses,
    rawGraphItems,
    historySessions: [],
  };
}
