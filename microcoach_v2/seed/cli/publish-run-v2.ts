/**
 * publish-run-v2.ts — write one eval run into the v2 app tables, so the app shows
 * exactly what the pipeline produced.
 *
 *   yarn seed:publish-v2 --run <runId|dir> [--session <id>] [--dry-run]
 *   yarn seed:publish-v2 --revert <manifest.json>
 *
 * An eval run (`yarn seed:eval --session <id>`) reads a frozen fixture and writes
 * nothing to the database. This takes that run's output.json and replaces the
 * matching v2 session's review data with it, so cards, evidence and activities all
 * come from the same pipeline run:
 *
 *   - MicroCoachSession: `questionStats` (per-question % correct, the question
 *     text, and per-option student names) and `studentWorksAnalyzed`, from the
 *     fixture's PPQ responses; status GENERATED.
 *   - MicroCoachMisconception: one row per ranked misconception the run retained,
 *     with prevalence, student work, skill context and response evidence built
 *     from the run and the fixture's responses. The session's old rows are deleted.
 *   - MicroCoachActivity: one row per generated activity, `phases` = the Wave 2
 *     content (src/lib/ActivityContentModels.ts). The old rows are deleted.
 *
 * The session defaults to the run's own session id: the eval fixtures were
 * extracted from sessions that also exist in v2 (ef3872a1 is Test Classroom).
 *
 * Fixture students are pseudonymised (S0239…), so they are mapped onto the v2
 * class's roster by position, both lists sorted by name. Test data only.
 *
 * Every row is recorded in a manifest beside the run before anything is written;
 * `--revert` deletes what was created and puts back what was deleted or changed.
 * Saved plans that pointed at a deleted activity lose that item; the app already
 * drops plan items whose activity no longer exists.
 *
 * Writes go through the AWS CLI rather than an SDK so the seed adds no dependency.
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { loadFixture } from '../eval/scripts/util/importEvalFixtures';
import { ccssDomainName } from '../../src/lib/ccssDomains';

const API_ID = process.env.V2_API_ID ?? 'virrpxwlvvgprntind5ze4vqxy';
const AMPLIFY_ENV = process.env.AMPLIFY_ENV ?? 'dev';
const REGION = process.env.AWS_REGION ?? 'us-east-1';
const RUNS_ROOT = path.resolve(__dirname, '../eval/runs');

const table = (model: string) => `${model}-${API_ID}-${AMPLIFY_ENV}`;

const arg = (name: string): string | null => {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
};
const DRY_RUN = process.argv.includes('--dry-run');

// ── DynamoDB through the CLI ──────────────────────────────────────────────────

type Item = Record<string, any>;

function aws(args: string[]): any {
  const out = execFileSync('aws', ['dynamodb', ...args, '--region', REGION, '--output', 'json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return out.trim() ? JSON.parse(out) : {};
}

function queryIndex(model: string, index: string, field: string, value: string): Item[] {
  const items: Item[] = [];
  let start: any = null;
  do {
    const res = aws([
      'query', '--table-name', table(model), '--index-name', index,
      '--key-condition-expression', `${field} = :v`,
      '--expression-attribute-values', JSON.stringify({ ':v': { S: value } }),
      ...(start ? ['--exclusive-start-key', JSON.stringify(start)] : []),
    ]);
    items.push(...(res.Items ?? []));
    start = res.LastEvaluatedKey ?? null;
  } while (start);
  return items;
}

function getItem(model: string, id: string): Item | null {
  return aws(['get-item', '--table-name', table(model), '--key', JSON.stringify({ id: { S: id } })]).Item ?? null;
}

function putItem(model: string, item: Item) {
  aws(['put-item', '--table-name', table(model), '--item', JSON.stringify(item)]);
}

function deleteItem(model: string, id: string) {
  aws(['delete-item', '--table-name', table(model), '--key', JSON.stringify({ id: { S: id } })]);
}

/** Plain value → DynamoDB attribute value. AWSJSON fields are stored as maps. */
function toDdb(value: any): any {
  if (value === null || value === undefined) return { NULL: true };
  if (typeof value === 'boolean') return { BOOL: value };
  if (typeof value === 'number') return { N: String(value) };
  if (typeof value === 'string') return { S: value };
  if (Array.isArray(value)) return { L: value.map(toDdb) };
  return { M: Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).map(([k, v]) => [k, toDdb(v)])) };
}

const toItem = (row: Record<string, any>): Item =>
  Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined).map(([k, v]) => [k, toDdb(v)]));

// ── Revert ────────────────────────────────────────────────────────────────────

interface Manifest {
  runId: string;
  sessionId: string;
  createdAt: string;
  created: Array<{ table: string; id: string }>;
  deleted: Array<{ table: string; item: Item }>;
  updated: Array<{ table: string; item: Item }>;
}

function revert(manifestPath: string) {
  const m: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const c of [...m.created].reverse()) deleteItem(c.table, c.id);
  for (const d of m.deleted) putItem(d.table, d.item);
  for (const u of m.updated) putItem(u.table, u.item);
  console.log(`Reverted ${m.runId} on session ${m.sessionId}: ${m.created.length} deleted, ${m.deleted.length + m.updated.length} restored.`);
}

// ── Builders ──────────────────────────────────────────────────────────────────

const TITLE_CASE_STOPWORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of',
  'on', 'or', 'the', 'to', 'up', 'via', 'with',
]);

function titleCase(value: string): string {
  return value.split(/(\s+)/).map((word, i) => {
    if (/^\s+$/.test(word)) return word;
    const lower = word.toLowerCase();
    if (i > 0 && TITLE_CASE_STOPWORDS.has(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

const normalizeCode = (code: string) => String(code ?? '').replace(/\s/g, '').toLowerCase();

function prevalenceFor(needing: number, understood: number, noResponse: number, total: number) {
  const share = total ? needing / total : 0;
  const level = share < 1 / 3 ? 'FEW' : share < 2 / 3 ? 'SOME' : 'MOST';
  const label = { FEW: 'Few students', SOME: 'Some students', MOST: 'Most students' }[level];
  return {
    level,
    label,
    studentsNeedingSupport: needing,
    studentsUnderstood: understood,
    studentsNoResponse: noResponse,
    totalAnalyzed: total,
    supportSummaryLabel: `${needing} of ${total} students need support`,
    understoodSummaryLabel: `${understood} students understood the concept`,
    shortCountLabel: `${needing} of ${total} students`,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const revertPath = arg('--revert');
  if (revertPath) {
    revert(revertPath);
    return;
  }

  const runArg = arg('--run');
  if (!runArg) throw new Error('usage: publish-run-v2 --run <runId|dir> [--session <id>] [--dry-run] | --revert <manifest>');
  const runDir = fs.existsSync(runArg) ? path.resolve(runArg) : path.join(RUNS_ROOT, runArg);
  const runManifest = JSON.parse(fs.readFileSync(path.join(runDir, 'manifest.json'), 'utf8'));
  const nextSteps: any[] = JSON.parse(fs.readFileSync(path.join(runDir, 'output.json'), 'utf8'));
  const sessionId: string = arg('--session') ?? runManifest.sessionId;

  // ── Inputs: the fixture behind the run, and the v2 rows it replaces ─────────
  // Fixture folders are named by the session id's first 8 characters.
  const fixture = loadFixture(String(runManifest.sessionId).slice(0, 8));
  const session = getItem('MicroCoachSession', sessionId);
  if (!session) throw new Error(`v2 session ${sessionId} not found in ${table('MicroCoachSession')}`);
  const classId: string = session.classId.S;

  const roster = queryIndex('MicroCoachStudent', 'byClass', 'classId', classId)
    .map((s) => ({ id: s.id.S as string, name: s.name.S as string }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const fixtureStudents = [...(fixture.classroom?.students?.items ?? [])]
    .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
  const nameOf = new Map<string, string>();
  fixtureStudents.forEach((s: any, i: number) => {
    if (roster[i]) nameOf.set(s.id, roster[i].name);
  });
  if (fixtureStudents.length !== roster.length) {
    console.warn(`⚠ fixture has ${fixtureStudents.length} students, v2 class has ${roster.length}; unmatched students are left out`);
  }

  // Each student's PPQ answer per question, under their v2 name.
  const answers = new Map<string, Map<number, { response: string; isCorrect: boolean }>>();
  for (const sr of fixture.studentResponses ?? []) {
    const name = nameOf.get(sr.studentId);
    if (!name) continue;
    const byQ = new Map<number, { response: string; isCorrect: boolean }>();
    for (const qr of sr.questionResponses ?? []) {
      byQ.set(Number(qr.questionNumber), { response: String(qr.response ?? '').toUpperCase(), isCorrect: Boolean(qr.isCorrect) });
    }
    answers.set(name, byQ);
  }
  const responders = [...answers.keys()].sort();
  const total = responders.length;
  const choseOption = (q: number, letter: string) =>
    responders.filter((n) => answers.get(n)?.get(q)?.response === letter.toUpperCase());

  // ── Session: question stats from the same responses ─────────────────────────
  const questions = [...(fixture.ppq?.questions ?? [])].sort((a: any, b: any) => a.questionNumber - b.questionNumber);
  const questionStats = questions.map((q: any) => {
    const answered = responders.filter((n) => answers.get(n)?.has(Number(q.questionNumber)));
    const correct = answered.filter((n) => answers.get(n)?.get(Number(q.questionNumber))?.isCorrect).length;
    return {
      questionNumber: Number(q.questionNumber),
      percentCorrect: answered.length ? Math.round((correct / answered.length) * 10000) / 10000 : (q.classPercentCorrect ?? 0),
      questionText: q.questionText ?? null,
      options: (q.answerChoices ?? []).map((o: any) => {
        const chose = choseOption(Number(q.questionNumber), o.letter);
        return {
          letter: o.letter,
          text: o.content ?? null,
          percentChosen: answered.length ? Math.round((chose.length / answered.length) * 10000) / 10000 : 0,
          isCorrect: Boolean(o.isCorrect),
          studentNames: chose,
        };
      }),
    };
  });

  // ── Misconceptions and activities ───────────────────────────────────────────
  const now = new Date().toISOString();
  const ranked = nextSteps
    .filter((n) => n.retained !== false && Number.isInteger(n.priorityRank))
    .sort((a, b) => a.priorityRank - b.priorityRank);
  if (!ranked.length) throw new Error('the run has no ranked, retained misconceptions to publish');

  const newMisconceptions: Item[] = [];
  const newActivities: Item[] = [];
  for (const n of ranked) {
    const misconceptionId = uuidv4();
    const wrongAnswers: any[] = n.wrongAnswers ?? [];
    const linkedQs = [...new Set<number>(wrongAnswers.map((w) => Number(w.questionNumber)))].sort((a, b) => a - b);

    const buckets = wrongAnswers.map((w) => {
      const students = choseOption(Number(w.questionNumber), w.letter);
      const ref = `Q${w.questionNumber}, Answer ${w.letter}`;
      return {
        optionLetter: w.letter,
        optionSummary: ref,
        errorTag: ref,
        interpretation: w.explanation ?? '',
        studentCount: students.length,
        students,
      };
    }).sort((a, b) => b.studentCount - a.studentCount);
    const needing = [...new Set(buckets.flatMap((b) => b.students))].sort();
    const answeredLinked = responders.filter((name) => linkedQs.some((q) => answers.get(name)?.has(q)));
    const understood = answeredLinked.filter((name) => !needing.includes(name));
    const noResponse = roster.map((s) => s.name).filter((name) => !answeredLinked.includes(name));

    const skillNames = new Map<string, string>((n.skillNames ?? []).map((s: any) => [normalizeCode(s.code), s.name]));
    const skill = (code: string, description: string) => ({
      code,
      name: skillNames.get(normalizeCode(code)) ?? null,
      description: description ?? '',
      domainName: ccssDomainName(code),
    });
    const target = n.ccssStandards?.targetObjective ?? {};
    const titleCased = titleCase(n.title);

    newMisconceptions.push(toItem({
      __typename: 'MicroCoachMisconception',
      id: misconceptionId,
      sessionId,
      classId,
      rank: n.priorityRank,
      badge: n.isRecommendedFocus ? 'RECOMMENDED_FOCUS' : 'CORE',
      title: n.title,
      titleCased,
      shortLabel: titleCased.split(/\s+/).slice(0, 3).join(' '),
      description: n.misconceptionSummary ?? '',
      prevalence: prevalenceFor(needing.length, understood.length, noResponse.length, roster.length),
      detailStatus: 'COMPLETE',
      studentWork: {
        tabLabel: 'Student work',
        sectionTitle: 'Errors in order of frequency',
        errorsByFrequency: buckets,
        understoodConcept: {
          sectionTitle: 'Understood Concept',
          subLabel: 'Correct answers',
          countChip: `${understood.length} students`,
          studentCount: understood.length,
          students: understood,
        },
        noResponse: { studentCount: noResponse.length, students: noResponse },
      },
      skillContext: {
        tabLabel: 'Skill context',
        sectionTitle: 'Examples of common errors',
        focusSkill: {
          ...skill(target.standard, target.description),
          groupLabel: 'Focus Skill',
          learningComponents: target.learningComponents ?? [],
        },
        prerequisiteGaps: {
          groupLabel: 'Prerequisite Gaps',
          skills: (n.ccssStandards?.prerequisiteGaps ?? []).map((s: any) => skill(s.standard, s.description)),
        },
        upcomingSkills: {
          groupLabel: 'Upcoming Skills',
          skills: (n.ccssStandards?.impactedObjectives ?? []).map((s: any) => skill(s.standard, s.description)),
        },
      },
      responseEvidence: linkedQs.map((q) => ({
        questionNumber: q,
        answers: wrongAnswers.filter((w) => Number(w.questionNumber) === q).map((w) => w.letter),
      })),
      createdAt: now,
      updatedAt: now,
    }));

    for (const move of n.moveOptions ?? []) {
      if (!move.content || !move.activityType) continue;
      newActivities.push(toItem({
        __typename: 'MicroCoachActivity',
        id: uuidv4(),
        misconceptionId,
        sessionId,
        classId,
        activityType: move.activityType,
        title: move.title,
        isSelected: false,
        selectLabel: move.selectLabel ?? 'Selected activity',
        detailStatus: move.detailStatus ?? 'COMPLETE',
        routine: move.routine,
        durationMinutes: move.durationMinutes ?? undefined,
        durationLabel: move.durationLabel ?? undefined,
        grouping: { level: 'WHOLE_CLASS', label: 'whole class' },
        targets: move.targets ?? undefined,
        instructionalMove: move.instructionalMove ?? undefined,
        strategyTag: move.strategyTag ?? undefined,
        phases: move.content,
        createdAt: now,
        updatedAt: now,
      }));
    }
  }

  const updatedSession: Item = {
    ...session,
    questionStats: toDdb(questionStats),
    studentWorksAnalyzed: toDdb(total),
    status: toDdb('GENERATED'),
    updatedAt: toDdb(now),
  };

  // ── Old rows to replace ─────────────────────────────────────────────────────
  const oldMisconceptions = queryIndex('MicroCoachMisconception', 'bySession', 'sessionId', sessionId);
  const oldActivities = queryIndex('MicroCoachActivity', 'bySession', 'sessionId', sessionId);

  console.log(`Run ${runManifest.runId} → session ${sessionId} (class ${classId})`);
  console.log(`  session: questionStats for ${questionStats.length} question(s), ${total} responders`);
  console.log(`  replace ${oldMisconceptions.length} misconception(s) and ${oldActivities.length} activit(ies) with:`);
  for (const m of newMisconceptions) {
    const acts = newActivities.filter((a) => a.misconceptionId.S === m.id.S);
    console.log(`    #${m.rank.N} ${m.title.S} — ${acts.map((a) => a.activityType.S).join(', ') || 'no activities'}`);
  }
  if (DRY_RUN) {
    console.log('\nDRY RUN — nothing written.');
    return;
  }

  // Manifest first, so a run that fails part-way can still be reverted.
  const manifestPath = path.join(runDir, `publish-v2-manifest-${now.replace(/[:.]/g, '-')}.json`);
  const manifest: Manifest = {
    runId: runManifest.runId,
    sessionId,
    createdAt: now,
    created: [
      ...newMisconceptions.map((m) => ({ table: 'MicroCoachMisconception', id: m.id.S })),
      ...newActivities.map((a) => ({ table: 'MicroCoachActivity', id: a.id.S })),
    ],
    deleted: [
      ...oldMisconceptions.map((item) => ({ table: 'MicroCoachMisconception', item })),
      ...oldActivities.map((item) => ({ table: 'MicroCoachActivity', item })),
    ],
    updated: [{ table: 'MicroCoachSession', item: session }],
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  for (const a of oldActivities) deleteItem('MicroCoachActivity', a.id.S);
  for (const m of oldMisconceptions) deleteItem('MicroCoachMisconception', m.id.S);
  for (const m of newMisconceptions) putItem('MicroCoachMisconception', m);
  for (const a of newActivities) putItem('MicroCoachActivity', a);
  putItem('MicroCoachSession', updatedSession);

  console.log(`\nPublished. Undo with: yarn seed:publish-v2 --revert ${path.relative(process.cwd(), manifestPath)}`);
}

main();
