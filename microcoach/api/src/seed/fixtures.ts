
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { pathToFileURL } from 'url';

const FIXTURE_DIR = path.resolve(__dirname, '../eval/fixtures');
const SESSION_DIR = path.join(FIXTURE_DIR, 'sessions');

// The graph normalizer is the Lambda's own module, imported dynamically so it is
// not statically resolved (it sits outside rootDir, and it is ESM). Using the real
// one rather than a copy means fixture replay can never drift from production.
const NORMALIZER_PATH = path.resolve(
  __dirname,
  '../../amplify/backend/function/microcoachGetLearningScience/src/util/normalizeStandard.mjs',
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

export interface FixtureSummary {
  id: string;
  file: string;
  sha256: string;
  classroom: string;
  grade: number;
  cohortSize: number;
  sessionLabel: string;
  weekNumber: number;
  topic: string;
  ccssStandards: string[];
  ppqAssessmentCode: string | null;
  postAssessmentCode: string | null;
  studentResponses: number;
  kgQueriesMatched: number;
  recoveredMisconceptions: number;
  recoveredActivities: number;
  recoveredWorkedExamples: number;
}

export interface Fixture {
  id: string;
  /** Shaped like a row from LIST_CLASSROOMS. */
  classroom: any;
  /** Shaped like getSession(...) — assessments and misconceptions nested under `.items`. */
  currentSession: any;
  /** The PPQ assessment (not the POST_PPQ). */
  ppq: any;
  /** Shaped like studentResponsesByAssessmentId(...).items. */
  studentResponses: any[];
  /** Raw graph items, exactly as the Learning Commons API returned them in March. */
  rawGraphItems: any[];
  /** The March pipeline's own output — a comparator that costs no judge calls. */
  referenceOutput: any[];
  /** Prior sessions. The pilot has none; kept so the caller's shape is stable. */
  historySessions: any[];
}

function readManifest(): { sessions: FixtureSummary[] } {
  const p = path.join(FIXTURE_DIR, 'index.json');
  if (!fs.existsSync(p)) throw new Error(`Fixture manifest missing at ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function listFixtures(): FixtureSummary[] {
  return readManifest().sessions;
}

/**
 * Verify every fixture still matches the checksum recorded when it was captured.
 * Cheap, and it turns "did this file drift?" into a question with an answer.
 */
export function verifyFixtures(): { id: string; ok: boolean }[] {
  return listFixtures().map((s) => {
    const raw = fs.readFileSync(path.join(FIXTURE_DIR, s.file));
    return { id: s.id, ok: crypto.createHash('sha256').update(raw).digest('hex') === s.sha256 };
  });
}

function resolveId(idOrPrefix: string): string {
  const ids = listFixtures().map((s) => s.id);
  const hit = ids.filter((i) => i === idOrPrefix || i.startsWith(idOrPrefix));
  if (hit.length === 1) return hit[0];
  if (hit.length === 0) throw new Error(`No fixture matching "${idOrPrefix}". Available: ${ids.join(', ')}`);
  throw new Error(`"${idOrPrefix}" is ambiguous: ${hit.join(', ')}`);
}

export function loadFixture(idOrPrefix: string): Fixture {
  const id = resolveId(idOrPrefix);
  const raw = fs.readFileSync(path.join(SESSION_DIR, `${id}.json`), 'utf8');
  const d = JSON.parse(raw);

  const assessments: any[] = d.input?.assessments ?? [];
  const ppq = assessments.find((a) => a.type === 'PPQ') ?? null;
  if (!ppq) throw new Error(`Fixture ${id} has no PPQ assessment`);

  // The archive holds every response row for the session, PPQ and POST_PPQ alike.
  // The live path fetches by `assessmentId: ppq.id`, so replaying the archive
  // unfiltered fed post-test answers into wrongAnswerDist and the confidence stats
  // on four of the five fixtures. Scope it, then give each row the `studentId` the
  // archive renamed to `student` — every consumer reads `sr.studentId`.
  const ppqResponses: any[] = (d.input?.studentResponses ?? [])
    .filter((sr: any) => sr.assessmentId === ppq.id)
    .map((sr: any) => ({ ...sr, studentId: sr.studentId ?? sr.student }));

  // Rebuild the roster from the responses. The archive carries no student records,
  // and an empty roster silently disables grouping (studentNameMap never resolves).
  // The pseudonymised id doubles as the display name, which keeps real names out of
  // the run artifacts written to disk.
  const students = [...new Set(ppqResponses.map((sr: any) => sr.studentId).filter(Boolean))]
    .map((sid) => ({ id: sid, name: sid, externalId: sid }));

  // The archive keeps the classroom's name under `name`; the DB row uses
  // `classroomName`. Provide both so downstream code reads either.
  const rc = d.recoveredOutput?.recoveredClassroom ?? {};
  const classroom = {
    id: d.classroom?.id ?? rc.id,
    classroomName: d.classroom?.name ?? rc.classroomName,
    name: d.classroom?.name ?? rc.classroomName,
    grade: d.classroom?.grade ?? rc.grade,
    subject: d.classroom?.subject ?? rc.subject ?? 'Math',
    cohortSize: d.classroom?.cohortSize ?? rc.cohortSize,
    state: rc.state,
    schoolYear: rc.schoolYear,
    students: { items: students },
  };

  const currentSession = {
    id: d.sessionId,
    classroomId: classroom.id,
    sessionLabel: d.session?.sessionLabel,
    weekNumber: d.session?.weekNumber,
    topic: d.session?.topic,
    ccssStandards: d.session?.ccssStandards ?? [],
    status: d.session?.status,
    assessments: { items: assessments },
    misconceptions: { items: d.output?.misconceptions ?? [] },
  };

  const rawGraphItems: any[] = [];
  for (const q of d.knowledgeGraphQueries ?? []) {
    for (const item of q.graphResponse?.data?.standardsFrameworkItems ?? []) rawGraphItems.push(item);
  }

  return {
    id,
    classroom,
    currentSession,
    ppq,
    studentResponses: ppqResponses,
    rawGraphItems,
    referenceOutput: d.recoveredOutput?.misconceptions ?? [],
    historySessions: [],
  };
}
