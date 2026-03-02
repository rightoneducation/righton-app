/**
 * cleanup.ts — delete all records from all Microcoach tables
 *
 * Run AFTER `amplify push` and BEFORE `upload.ts` if tables have stale data:
 *   cd api && npx ts-node src/seed/cleanup.ts
 *
 * Deletion order (child records first to avoid orphans):
 *   1. StudentResponse
 *   2. Activity
 *   3. Misconception
 *   4. Assessment
 *   5. Session
 *   6. Student
 *   7. SavedNextStep
 *   8. Classroom
 *   9. ContextData
 */

import { createGqlClient, GqlFn } from './appsync-config';

let gql: GqlFn;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Status utilities ─────────────────────────────────────────────────────────

const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let _spinTimer: ReturnType<typeof setInterval> | null = null;
let _spinIdx = 0;

function startSpinner(msg: string) {
  _spinIdx = 0;
  _spinTimer = setInterval(() => {
    process.stdout.write(`\r  ${SPIN[_spinIdx % SPIN.length]} ${msg}`);
    _spinIdx++;
  }, 80);
}

function stopSpinner(finalMsg?: string) {
  if (_spinTimer) {
    clearInterval(_spinTimer);
    _spinTimer = null;
  }
  if (finalMsg) {
    process.stdout.write(`\r  ✓ ${finalMsg}\n`);
  } else {
    process.stdout.write('\r' + ' '.repeat(72) + '\r');
  }
}

function elapsed(startMs: number): string {
  const ms = Date.now() - startMs;
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// Overwrite current line with progress, finish with newline when done=true
function progress(msg: string, done = false) {
  const padded = msg.padEnd(72);
  if (done) {
    process.stdout.write(`\r${padded}\n`);
  } else {
    process.stdout.write(`\r${padded}`);
  }
}

// ── List helpers ─────────────────────────────────────────────────────────────

async function listAll(
  label: string,
  listQuery: string,
  dataKey: string,
  limit = 1000
): Promise<{ id: string }[]> {
  startSpinner(`Fetching ${label}...`);
  const fetchStart = Date.now();
  const items: { id: string }[] = [];
  let nextToken: string | null = null;

  do {
    const vars: Record<string, any> = { limit };
    if (nextToken) vars.nextToken = nextToken;
    const data = await gql(listQuery, vars);
    const result = data?.[dataKey];
    if (!result) break;
    items.push(...(result.items ?? []));
    nextToken = result.nextToken ?? null;
    if (nextToken) {
      process.stdout.write(`\r  ${SPIN[_spinIdx % SPIN.length]} Fetching ${label}... (${items.length} so far)`);
    }
  } while (nextToken);

  stopSpinner(`${label.padEnd(20)} ${items.length} records  (${elapsed(fetchStart)})`);
  return items;
}

// ── Delete helpers ───────────────────────────────────────────────────────────

async function deleteAll(
  items: { id: string }[],
  deleteMutation: string,
  label: string
): Promise<void> {
  if (items.length === 0) {
    console.log(`  ${label.padEnd(20)} 0 records — skipping`);
    return;
  }

  const deleteStart = Date.now();
  for (let i = 0; i < items.length; i++) {
    progress(`  Deleting ${label} [${i + 1}/${items.length}]`);
    await gql(deleteMutation, { input: { id: items[i].id } })
      .catch((e: Error) => console.warn(`\n  ✗ delete warning: ${e.message}`));
    await sleep(50);
  }
  progress(`  ✓ ${label.padEnd(18)} ${items.length} deleted  (${elapsed(deleteStart)})`, true);
}

// ── GraphQL queries & mutations ───────────────────────────────────────────────

const LIST_STUDENT_RESPONSES = `
  query ListStudentResponses($limit: Int, $nextToken: String) {
    listStudentResponses(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_ACTIVITIES = `
  query ListActivities($limit: Int, $nextToken: String) {
    listActivities(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_MISCONCEPTIONS = `
  query ListMisconceptions($limit: Int, $nextToken: String) {
    listMisconceptions(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_ASSESSMENTS = `
  query ListAssessments($limit: Int, $nextToken: String) {
    listAssessments(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_SESSIONS = `
  query ListSessions($limit: Int, $nextToken: String) {
    listSessions(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_STUDENTS = `
  query ListStudents($limit: Int, $nextToken: String) {
    listStudents(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_SAVED_NEXT_STEPS = `
  query ListSavedNextSteps($limit: Int, $nextToken: String) {
    listSavedNextSteps(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_CLASSROOMS = `
  query ListClassrooms($limit: Int, $nextToken: String) {
    listClassrooms(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;
const LIST_CONTEXT_DATA = `
  query ListContextData($limit: Int, $nextToken: String) {
    listContextData(limit: $limit, nextToken: $nextToken) { items { id } nextToken }
  }
`;

const DELETE_STUDENT_RESPONSE = `mutation DeleteStudentResponse($input: DeleteStudentResponseInput!) { deleteStudentResponse(input: $input) { id } }`;
const DELETE_ACTIVITY         = `mutation DeleteActivity($input: DeleteActivityInput!) { deleteActivity(input: $input) { id } }`;
const DELETE_MISCONCEPTION    = `mutation DeleteMisconception($input: DeleteMisconceptionInput!) { deleteMisconception(input: $input) { id } }`;
const DELETE_ASSESSMENT       = `mutation DeleteAssessment($input: DeleteAssessmentInput!) { deleteAssessment(input: $input) { id } }`;
const DELETE_SESSION          = `mutation DeleteSession($input: DeleteSessionInput!) { deleteSession(input: $input) { id } }`;
const DELETE_STUDENT          = `mutation DeleteStudent($input: DeleteStudentInput!) { deleteStudent(input: $input) { id } }`;
const DELETE_SAVED_NEXT_STEP  = `mutation DeleteSavedNextStep($input: DeleteSavedNextStepInput!) { deleteSavedNextStep(input: $input) { id } }`;
const DELETE_CLASSROOM        = `mutation DeleteClassroom($input: DeleteClassroomInput!) { deleteClassroom(input: $input) { id } }`;
const DELETE_CONTEXT_DATA     = `mutation DeleteContextData($input: DeleteContextDataInput!) { deleteContextData(input: $input) { id } }`;

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const totalStart = Date.now();
  gql = await createGqlClient();
  console.log('=== Microcoach Database Cleanup ===\n');

  // Fetch counts sequentially so each table shows progress
  console.log('Scanning tables:\n');
  const studentResponses = await listAll('StudentResponse',  LIST_STUDENT_RESPONSES, 'listStudentResponses');
  const activities       = await listAll('Activity',         LIST_ACTIVITIES,        'listActivities');
  const misconceptions   = await listAll('Misconception',    LIST_MISCONCEPTIONS,    'listMisconceptions');
  const assessments      = await listAll('Assessment',       LIST_ASSESSMENTS,       'listAssessments');
  const sessions         = await listAll('Session',          LIST_SESSIONS,          'listSessions');
  const students         = await listAll('Student',          LIST_STUDENTS,          'listStudents');
  const savedNextSteps   = await listAll('SavedNextStep',    LIST_SAVED_NEXT_STEPS,  'listSavedNextSteps');
  const classrooms       = await listAll('Classroom',        LIST_CLASSROOMS,        'listClassrooms');
  const contextData      = await listAll('ContextData',      LIST_CONTEXT_DATA,      'listContextData');

  const total =
    studentResponses.length + activities.length + misconceptions.length +
    assessments.length + sessions.length + students.length +
    savedNextSteps.length + classrooms.length + contextData.length;

  console.log(`\nTotal: ${total} records found`);

  if (total === 0) {
    console.log('\nDatabase is already empty. Nothing to do.');
    return;
  }

  console.log('\nDeleting (child tables first):\n');

  await deleteAll(studentResponses, DELETE_STUDENT_RESPONSE, 'StudentResponse');
  await deleteAll(activities,       DELETE_ACTIVITY,         'Activity');
  await deleteAll(misconceptions,   DELETE_MISCONCEPTION,    'Misconception');
  await deleteAll(assessments,      DELETE_ASSESSMENT,       'Assessment');
  await deleteAll(sessions,         DELETE_SESSION,          'Session');
  await deleteAll(students,         DELETE_STUDENT,          'Student');
  await deleteAll(savedNextSteps,   DELETE_SAVED_NEXT_STEP,  'SavedNextStep');
  await deleteAll(classrooms,       DELETE_CLASSROOM,        'Classroom');
  await deleteAll(contextData,      DELETE_CONTEXT_DATA,     'ContextData');

  console.log(`\n=== Cleanup Complete  (${elapsed(totalStart)} total) ===`);
}

main().catch((err) => {
  console.error('\nCleanup failed:', err);
  process.exit(1);
});
