# Microcoach API

Two independent pipelines live here.

| | what it does | where |
|---|---|---|
| **CLI** | Loads real data into the database and generates next steps from it | `src/cli/` — below |
| **Eval** | Replays frozen fixtures through the same generation pipeline to measure it | `src/eval/` — see [src/eval/README.md](src/eval/README.md) |

The CLI **writes to the database**. The eval never does.

---

## CLI pipeline

Run from `api/`. Requires `APPSYNC_SECRET_NAME=<SECRETNAME>` exported in your shell.

```bash
yarn cleanup   # delete all DB records (idempotent)
yarn ingest    # PPQ.docx → LLM → misconceptions.json per classroom
yarn upload    # Excel + misconceptions.json → AppSync DB
yarn verify    # check record counts and structure
yarn generate  # DB + student responses → pregeneratedNextSteps per session
yarn validate  # quality-check pregeneratedNextSteps, use --verbose for full list of checks
yarn post-analyze # ingests Post-PPQ docs and updates student performance data to determine improvements
```

Run in order each week after new PPQ data is added to `Data/`.

### Relationship to production

These scripts mirror two Lambdas, by hand:

- `src/cli/ingest.ts` + `src/cli/upload.ts` ↔ `microcoachTeacherUpload`
- `src/cli/generate.ts` ↔ `microcoachTeacherUploadGen`

Changes to the shared logic — `buildNextSteps`, `reconcileWrongAnswers`, the student
helpers — must be made in both. See [docs/orchestrator-parity.md](../docs/orchestrator-parity.md)
for what is duplicated, what is deliberately different, and what needs a coupled deploy.

The three LLM Lambdas (`microcoachGetLearningScience`, `microcoachLLMAnalysis`,
`microcoachNextStepOption`) are **not** duplicated — both the CLI and production invoke
the same deployed functions, so prompt and schema changes there need an `amplify push`
and no mirroring.
