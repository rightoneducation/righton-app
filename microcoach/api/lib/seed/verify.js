"use strict";
/**
 * verify.ts — validate that the seed upload completed correctly
 *
 * Run after `upload.ts`:
 *   cd api && npx ts-node src/seed/verify.ts
 *
 * Expected counts:
 *   Classrooms:       3
 *   Sessions:         3  (1 per classroom)
 *   Assessments:      6  (PPQ + POST_PPQ per session)
 *   Students:         617 (60 + 79 + 478)
 *   StudentResponses: ~823 (PPQ: 617; PostPPQ: ~206)
 *   Misconceptions:   9  (3 per session)
 *   Activities:       9  (1 per misconception)
 *   ContextData:      8  (3 classroom next steps + 5 reference next steps)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const appsync_config_1 = require("./appsync-config");
let gql;
// ── Status utilities ─────────────────────────────────────────────────────────
function elapsed(startMs) {
    const ms = Date.now() - startMs;
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}
// Query one table, printing "  Querying TableName..." and resolving to the items array.
// Handles pagination automatically and shows page counts on multi-page results.
async function queryTable(label, query, dataKey, limit = 1000) {
    var _a, _b;
    const labelPad = label.padEnd(20);
    process.stdout.write(`  Querying ${labelPad}...`);
    const start = Date.now();
    const items = [];
    let nextToken = null;
    let page = 0;
    do {
        page++;
        const vars = { limit };
        if (nextToken) {
            vars.nextToken = nextToken;
            process.stdout.write(` (page ${page})`);
        }
        const data = await gql(query, vars);
        const result = data === null || data === void 0 ? void 0 : data[dataKey];
        if (!result)
            break;
        items.push(...((_a = result.items) !== null && _a !== void 0 ? _a : []));
        nextToken = (_b = result.nextToken) !== null && _b !== void 0 ? _b : null;
    } while (nextToken);
    process.stdout.write(`  ✓  ${String(items.length).padStart(4)} records  (${elapsed(start)})\n`);
    return items;
}
// ── GraphQL queries ───────────────────────────────────────────────────────────
const Q = {
    classrooms: `query ListClassrooms($limit: Int, $nextToken: String) {
    listClassrooms(limit: $limit, nextToken: $nextToken) {
      items { id classroomName grade state } nextToken
    }
  }`,
    sessions: `query ListSessions($limit: Int, $nextToken: String) {
    listSessions(limit: $limit, nextToken: $nextToken) {
      items { id classroomId sessionLabel weekNumber ppqAssessmentId postPpqAssessmentId } nextToken
    }
  }`,
    assessments: `query ListAssessments($limit: Int, $nextToken: String) {
    listAssessments(limit: $limit, nextToken: $nextToken) {
      items { id type classroomId sessionId assessmentCode weekNumber } nextToken
    }
  }`,
    students: `query ListStudents($limit: Int, $nextToken: String) {
    listStudents(limit: $limit, nextToken: $nextToken) {
      items { id classroomId } nextToken
    }
  }`,
    studentResponses: `query ListStudentResponses($limit: Int, $nextToken: String) {
    listStudentResponses(limit: $limit, nextToken: $nextToken) {
      items { id assessmentId } nextToken
    }
  }`,
    misconceptions: `query ListMisconceptions($limit: Int, $nextToken: String) {
    listMisconceptions(limit: $limit, nextToken: $nextToken) {
      items { id sessionId classroomId title severity priority } nextToken
    }
  }`,
    activities: `query ListActivities($limit: Int, $nextToken: String) {
    listActivities(limit: $limit, nextToken: $nextToken) {
      items { id misconceptionId status type } nextToken
    }
  }`,
    contextData: `query ListContextData($limit: Int, $nextToken: String) {
    listContextData(limit: $limit, nextToken: $nextToken) {
      items { id type title gradeLevel isReference ccssStandards } nextToken
    }
  }`,
};
// ── Check helper ─────────────────────────────────────────────────────────────
function check(label, actual, expected) {
    const pass = actual >= expected;
    const icon = pass ? '✓' : '✗';
    const note = pass ? '' : `  ← expected at least ${expected}`;
    console.log(`  ${icon} ${label.padEnd(22)} ${String(actual).padStart(4)}${note}`);
    return pass;
}
// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    var _a, _b, _c;
    const totalStart = Date.now();
    gql = await (0, appsync_config_1.createGqlClient)();
    console.log('=== Microcoach Seed Verification ===\n');
    console.log('Querying all tables:\n');
    // Run queries sequentially so each line shows its own status
    const classrooms = await queryTable('Classrooms', Q.classrooms, 'listClassrooms');
    const sessions = await queryTable('Sessions', Q.sessions, 'listSessions');
    const assessments = await queryTable('Assessments', Q.assessments, 'listAssessments');
    const students = await queryTable('Students', Q.students, 'listStudents');
    const responses = await queryTable('StudentResponses', Q.studentResponses, 'listStudentResponses');
    const misconceptions = await queryTable('Misconceptions', Q.misconceptions, 'listMisconceptions');
    const activities = await queryTable('Activities', Q.activities, 'listActivities');
    const contextItems = await queryTable('ContextData', Q.contextData, 'listContextData');
    console.log(`\nQueried in ${elapsed(totalStart)}\n`);
    // ── Count checks ──────────────────────────────────────────────────────────
    console.log('Record count checks:\n');
    let allPass = true;
    allPass = check('Classrooms', classrooms.length, 3) && allPass;
    allPass = check('Sessions', sessions.length, 3) && allPass;
    allPass = check('Assessments', assessments.length, 6) && allPass;
    allPass = check('Students', students.length, 617) && allPass;
    allPass = check('StudentResponses', responses.length, 400) && allPass;
    allPass = check('Misconceptions', misconceptions.length, 9) && allPass;
    allPass = check('Activities', activities.length, 9) && allPass;
    allPass = check('ContextData', contextItems.length, 8) && allPass;
    // ── Per-classroom breakdown ───────────────────────────────────────────────
    console.log('\nPer-classroom breakdown:\n');
    for (const classroom of classrooms) {
        const cId = classroom.id;
        const cName = classroom.classroomName;
        const cSessions = sessions.filter((s) => s.classroomId === cId);
        const cStudents = students.filter((s) => s.classroomId === cId);
        const cAssessments = assessments.filter((a) => a.classroomId === cId);
        const ppqCount = cAssessments.filter((a) => a.type === 'PPQ').length;
        const postPpqCount = cAssessments.filter((a) => a.type === 'POST_PPQ').length;
        const sessionIds = cSessions.map((s) => s.id);
        const cMisconceptions = misconceptions.filter((m) => sessionIds.includes(m.sessionId));
        // Count responses per assessment type
        const ppqIds = cAssessments.filter((a) => a.type === 'PPQ').map((a) => a.id);
        const postPpqIds = cAssessments.filter((a) => a.type === 'POST_PPQ').map((a) => a.id);
        const ppqRespCount = responses.filter((r) => ppqIds.includes(r.assessmentId)).length;
        const postRespCount = responses.filter((r) => postPpqIds.includes(r.assessmentId)).length;
        // Check session → assessment links
        const cSession = cSessions[0];
        const ppqLinked = (cSession === null || cSession === void 0 ? void 0 : cSession.ppqAssessmentId) ? '✓' : '✗ missing';
        const postLinked = (cSession === null || cSession === void 0 ? void 0 : cSession.postPpqAssessmentId) ? '✓' : '✗ missing';
        console.log(`  ${cName}  (grade ${classroom.grade}, ${classroom.state})`);
        console.log(`    Sessions:              ${cSessions.length}`);
        console.log(`    Students:              ${cStudents.length}`);
        console.log(`    PPQ Assessment:        ${ppqCount}  (${ppqRespCount} responses)  session link: ${ppqLinked}`);
        console.log(`    PostPPQ Assessment:    ${postPpqCount}  (${postRespCount} responses)  session link: ${postLinked}`);
        console.log(`    Misconceptions:        ${cMisconceptions.length}`);
        console.log('');
    }
    // ── Assessment type summary ───────────────────────────────────────────────
    const ppqTotal = assessments.filter((a) => a.type === 'PPQ').length;
    const postPpqTot = assessments.filter((a) => a.type === 'POST_PPQ').length;
    console.log(`Assessments: ${ppqTotal} PPQ  +  ${postPpqTot} POST_PPQ`);
    // ── ContextData breakdown ─────────────────────────────────────────────────
    const refDocs = contextItems.filter((c) => c.isReference === true);
    const classroomDocs = contextItems.filter((c) => !c.isReference);
    console.log(`\nContextData: ${classroomDocs.length} classroom  +  ${refDocs.length} reference\n`);
    for (const item of contextItems) {
        const tag = item.isReference ? '[REF]' : '[CLS]';
        const grade = item.gradeLevel ? `Gr${item.gradeLevel}` : '   ';
        const stds = ((_a = item.ccssStandards) !== null && _a !== void 0 ? _a : []).join(', ');
        console.log(`  ${tag} ${grade}  ${item.title}  (${stds})`);
    }
    // ── Misconceptions list ───────────────────────────────────────────────────
    console.log('\nMisconceptions:\n');
    for (const m of misconceptions) {
        const sess = sessions.find((s) => s.id === m.sessionId);
        const label = (_b = sess === null || sess === void 0 ? void 0 : sess.sessionLabel) !== null && _b !== void 0 ? _b : (_c = m.sessionId) === null || _c === void 0 ? void 0 : _c.slice(0, 8);
        console.log(`  [${m.priority}] ${m.severity.padEnd(6)}  ${m.title}`);
        console.log(`         session: ${label}`);
    }
    // ── Final result ──────────────────────────────────────────────────────────
    console.log(`\n${'═'.repeat(50)}`);
    if (allPass) {
        console.log(`✓ All checks passed!  (${elapsed(totalStart)} total)`);
    }
    else {
        console.log(`✗ Some checks failed — review output above.  (${elapsed(totalStart)} total)`);
        process.exitCode = 1;
    }
    console.log('═'.repeat(50));
}
main().catch((err) => {
    console.error('\nVerify failed:', err);
    process.exit(1);
});
