"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const appsync_config_1 = require("./appsync-config");
const seedData_1 = require("./seedData");
const INGEST_PPQ = /* GraphQL */ `
  mutation IngestPPQ($input: IngestPPQInput!) {
    ingestPPQ(input: $input)
  }
`;
async function main() {
    console.log('=== Microcoach PPQ Ingest ===\n');
    console.log(`DATA_ROOT: ${seedData_1.DATA_ROOT}\n`);
    const gql = await (0, appsync_config_1.createGqlClient)();
    for (const classroom of seedData_1.CLASSROOMS) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`${classroom.key}  (grade ${classroom.grade}, ${classroom.state})`);
        console.log('─'.repeat(60));
        for (let i = 0; i < classroom.sessions.length; i++) {
            const session = classroom.sessions[i];
            const docxPath = path.join(seedData_1.DATA_ROOT, classroom.key, session.label, 'PPQ.docx');
            const jsonPath = path.join(seedData_1.DATA_ROOT, classroom.key, session.label, 'misconceptions.json');
            process.stdout.write(`\n  [${session.label}] Checking for PPQ.docx...`);
            let ppqText;
            try {
                const result = await mammoth_1.default.extractRawText({ path: docxPath });
                ppqText = result.value.trim();
                process.stdout.write(`  found (${ppqText.length} chars)\n`);
            }
            catch {
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
            let result;
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
            }
            catch (err) {
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
