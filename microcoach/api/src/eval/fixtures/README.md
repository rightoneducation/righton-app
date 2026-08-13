# Pilot fixtures

The four **March 2026 pilot sessions** — the only production runs that pair real
classroom data with a complete knowledge-graph payload *and* a complete generated
output. These are the substrate for evaluation work.

| id | classroom | cohort | responses | standards |
|---|---|---|---|---|
| `ef3872a1` | Classroom 1 | 28 | 54 | `A.REI.3`, `A.REI.12`, `8.EE.C.8` |
| `d82945f2` | Classroom 2 | 25 | 48 | same |
| `dcd8207e` | Classroom 3 | 20 | 38 | same |
| `65b68962` | Classroom 4 | 22 | 38 | same |

Totals: **16 misconceptions, 32 activities, 96 incorrect worked examples.**

## Why these and not the database

`dev` holds one test quiz (`ALG.08.PPQZ.W23.25-26.NY`) uploaded eight times across
three classrooms that were hand-created with `grade: 6` typed into a form, against
high-school algebra content. `test` is 15 classrooms at grades 4–7 all pointed at a
single Algebra-8 assessment. Neither can support measurement.

The pilot source spreadsheets are gone — `microcoach/Data/` was emptied — so this
extraction is the only surviving copy of the inputs.

## Provenance

Extracted 2026-08-10 from AWS `484006752749`, `us-east-1`, `main` tables. Activity
bodies were recovered from git commit `5d4538dbb` (`microcoach/Data/consoleoutput.json`,
committed and deleted the same day). Original extraction lives in
`righton-eval/data/dataset`.

Files here are **verbatim copies**. `index.json` records a `sha256` per file;
`verifyFixtures()` checks them and the runner refuses to start on a mismatch.

Students are pseudonymised (`S0001`…). Verified: 95 distinct students, zero real
names, zero `externalId`s.

## What each file contains

- `knowledgeGraphQueries[]` — the **raw** Learning Commons response per standard.
  Raw, so it re-normalizes with the *current* normalizer and yields fields the March
  pipeline discarded (`childStandards`, identifiers, learner-model descriptions).
- `input` — PPQ questions with correct answers and class percent correct, plus
  per-student responses.
- `output` — the DynamoDB rows as they exist (partial; activity bodies were never
  persisted).
- `recoveredOutput` — the complete generated payload, with evidence, worked examples,
  activity steps and student groupings. Useful as a comparator that costs no judge calls.

## Usage

```bash
cd microcoach/api
export AMPLIFY_ENV=dev
export APPSYNC_SECRET_NAME=microcoach

yarn generate --fixture ef3872a1            # one session, graph replayed
yarn generate --fixture all                 # all four
yarn generate --fixture ef3872a1 --graph live   # re-query Learning Commons instead
```

Fixture runs **never read from or write to DynamoDB** for session data — output is
captured to `eval/runs/<runId>/`. The only remote calls are the LLM Lambdas, plus the
reference-example query (shared library content, not session data) and the graph
Lambda under `--graph live`.

`--graph fixture` (the default) replays the archived response, which removes the live
API as a source of run-to-run variance. Use `--graph live` when you specifically want
to exercise `microcoachGetLearningScience` or check current API coverage.

## Regenerating

```bash
cp ~/righton-eval/data/dataset/sessions/*.json microcoach/api/src/eval/fixtures/sessions/
# then rebuild index.json (checksums + counts)
```
