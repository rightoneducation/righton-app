# Orchestrator parity

The generation pipeline has two orchestrators running the same steps:

| | file | used by |
|---|---|---|
| **CLI** | `api/src/seed/generate-next-steps.ts` | `yarn generate`, all eval runs |
| **Lambda** | `api/amplify/backend/function/microcoachTeacherUploadGen/src/index.mjs` | the production teacher upload flow |

They are not a shared module. `buildNextSteps` and its helpers are **duplicated
verbatim** between them, so anything touching those must be changed in both places in
the same commit.

## What is duplicated (change both)

`buildNextSteps`, `computeMisconceptionReach`, `computeConfidenceStats`,
`computeWrongAnswerDist`, `getStudentPerformanceData`, `getStudentGroups`,
`injectStudentsIntoGroups`, `parseQuestionNumbers`, `formatLabel`.

As of the last audit these were semantically identical — the only differences were
TypeScript type annotations and formatting.

## What is NOT duplicated (change once)

Anything inside `microcoachLLMAnalysis`, `microcoachNextStepOption`,
`microcoachGetLearningScience` or `microcoachIngestPPQ`. Both orchestrators invoke the
same deployed Lambdas, so prompt and schema changes reach both automatically.

## Deliberate differences

These are not drift; do not "fix" them without deciding to.

| | CLI | Lambda |
|---|---|---|
| CCSS collection | PPQ ∪ session standards | also ∪ per-question ∪ ingested-misconception standards — **strictly more graph calls** |
| current session | highest `weekNumber` | `sessionId` argument if it matches, else highest `weekNumber` |
| history | `sorted.slice(0, -1)` | `sorted.filter(s => s.id !== current.id)` |
| `trace` flag | sent to all three Lambdas | never sent — no `_trace`, no token accounting |
| graph masking | applies `maskQuery` per `--condition` | none; always the full payload |
| run capture | writes `eval/runs/<id>/` | none |
| fixture mode | yes (`--fixture`), never writes | no |
| `UPDATE_SESSION` | `{id, pregeneratedNextSteps, status}` | also `publishStatus: 'DRAFT'` |
| classroom source | `LIST_CLASSROOMS` (filterable) | `GET_CLASSROOM` by `event.classroomId` |
| after generation | — | evaluator block (gated off) + SES emails |

**Consequence for the eval:** the Lambda is not a substitute for the CLI when running
the ablation matrix. It neither masks the graph nor records what it sent.

## Contracts that both consumers must tolerate

The planner branch of `microcoachNextStepOption` returns
`{ok, assignments, _trace?}`. It previously returned a **bare array**. Both
orchestrators accept either shape, because `amplify/backend/**` is ahead of
`#current-cloud-backend/**` and the deployed Lambda may still use the old contract.
Do not remove the array fallback until a push has confirmed the deployed version.

## Coupled deploy

`schema.graphql` declares `IngestPPQInput.grade` as nullable and neither caller sends
it, but the **deployed** build schema still has `grade: Int!` and the **deployed**
`microcoachTeacherUpload` still sends it. Each side is internally consistent, so
production works today. The schema change and the Lambda change must go out in the
**same push** — whichever lands alone breaks ingest.
