/**
 * ingest-ppq.ts — extract misconceptions from PPQ.docx files via LLM
 *
 * For each classroom/session that has a PPQ.docx, extracts the raw text with
 * mammoth, sends it to the microcoachIngestPPQ Lambda via AppSync, and writes
 * the result to Data/{ClassroomN}/{SessionN}/misconceptions.json.
 *
 * upload.ts reads those JSON files automatically — no manual copy-paste needed.
 *
 * Run from the api/ directory:
 *   APPSYNC_SECRET_NAME=microcoach npx ts-node src/seed/ingest-ppq.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import mammoth from 'mammoth';
import { createGqlClient } from './appsync-config';
import { CLASSROOMS, DATA_ROOT } from './seedData';

const INGEST_PPQ = /* GraphQL */ `
  mutation IngestPPQ($input: IngestPPQInput!) {
    ingestPPQ(input: $input)
  }
`;

async function main() {
  console.log('=== Microcoach PPQ Ingest ===\n');
  console.log(`DATA_ROOT: ${DATA_ROOT}\n`);

  const gql = await createGqlClient();

  for (const classroom of CLASSROOMS) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`${classroom.key}  (grade ${classroom.grade}, ${classroom.state})`);
    console.log('─'.repeat(60));

    for (let i = 0; i < classroom.sessions.length; i++) {
      const session = classroom.sessions[i];
      const docxPath = path.join(DATA_ROOT, classroom.key, session.label, 'PPQ.docx');
      const jsonPath = path.join(DATA_ROOT, classroom.key, session.label, 'misconceptions.json');

      process.stdout.write(`\n  [${session.label}] Checking for PPQ.docx...`);

      let ppqText: string;
      try {
        const result = await mammoth.extractRawText({ path: docxPath });
        ppqText = result.value.trim();
        process.stdout.write(`  found (${ppqText.length} chars)\n`);
      } catch {
        process.stdout.write(`  not found — skipping\n`);
        continue;
      }

      if (!ppqText) {
        console.log(`  Empty text extracted — skipping`);
        continue;
      }

      // Session index determines first vs recurring
      const occurrence = i === 0 ? 'first' : 'recurring';

      process.stdout.write(`  Calling ingestPPQ Lambda (occurrence: ${occurrence})...`);

      let result: any;
      try {
        const data = await gql(INGEST_PPQ, {
          input: {
            ppqText,
            classroomKey: classroom.key,
            grade: classroom.grade,
            subject: classroom.subject,
            state: classroom.state,
            schoolYear: classroom.schoolYear,
            cohortSize: classroom.cohortSize,
            sessionLabel: session.label,
            weekNumber: session.weekNumber,
            occurrence,
          },
        });
        result = JSON.parse(data.ingestPPQ);
        process.stdout.write(`  done (${result.misconceptions.length} misconceptions)\n`);
      } catch (err: any) {
        console.error(`\n  ERROR calling Lambda: ${err.message}`);
        continue;
      }

      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf8');
      console.log(`  Wrote → ${path.relative(process.cwd(), jsonPath)}`);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('Ingest complete. Run: yarn upload');
  console.log('═'.repeat(60));
}

main().catch((err) => {
  console.error('\nIngest failed:', err);
  process.exit(1);
});
