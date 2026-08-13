# MicroCoach Eval

Measures what the Learning Commons knowledge graph contributes to pipeline output, by
withholding one part of it at a time and comparing the results.

One command, run from `api/`:

```bash
yarn eval
```

**No database access.** Every run reads frozen fixtures from disk and writes only to
`src/eval/runs/`. It cannot touch DynamoDB, so it is safe to run against any environment.

---

## Options

| flag | default | what it does |
|---|---|---|
| `--session <id\|all>` | **required** | One session, or `all`. Accepts a prefix, so `--session ef38` works. |
| `--condition <NAME\|all>` | `NONE` | One condition, or `all`. |
| `--live-graph` | off | Re-query Learning Commons instead of replaying the archived response. |
| `--list` | — | Show available sessions and conditions, then exit. |

`--session` has no default on purpose — fanning out across every session should be
something you asked for, not something you got by omitting a flag. The full matrix
needs both dimensions opened explicitly.

```bash
yarn eval --list                                 # what's available
yarn eval --session ef3872a1                     # one session, condition NONE
yarn eval --session all                          # every session, condition NONE
yarn eval --session ef3872a1 --condition all     # one session, every condition
yarn eval --session all --condition all          # the full matrix — 55 runs
```

### Conditions

Each condition deletes one part of the graph payload before it reaches the prompts.
`NONE` is the baseline every other condition is compared against.

| condition | withholds |
|---|---|
| `NONE` | nothing — the baseline |
| `NO_PREREQ` | prerequisite standards |
| `NO_DOWNSTREAM` | future-dependent standards |
| `NO_CHILD` | child standards |
| `NO_RELATED` | related standards |
| `NO_LC` | learning components |
| `NO_LVN_FULL` | all learning-variability factors |
| `NO_LVN_STRATEGY` | LVN strategies only |
| `NO_LVN_LEARNERMODELS` | LVN learner models only |
| `NO_LVN_INTERACTSWITH` | LVN interacts-with only |
| `FULL` | everything — no graph data at all |

`--live-graph` is off by default deliberately: replaying the archived response keeps the
input identical across every run, so a score difference can be attributed to the
condition rather than to the partner API changing underneath the matrix.

---

## What a run produces

```
src/eval/runs/<classroom>-<session>-<condition>-<timestamp>/
  output.json        the next-step array — this is what gets scored
  manifest.json      condition, git sha, tokens, model list, link-health counters
  calls/             every Lambda request and response, in order
  prompts/           the resolved prompt text for each model call
  kg-snapshot.json   the full graph payload
  kg-injected.json   what the prompts actually received, after masking
```

`kg-snapshot.json` stays unmasked on purpose. Graph-derived rubric rows score against
the full payload, so masking the record too would make a withheld condition score zero
by construction rather than by measurement.

### Reading the manifest before scoring

`manifest.json` carries the health of the run, not just its cost:

- `sourceMisconceptionMatched` — how many outputs linked back to an ingested misconception
- `wrongAnswerLinked` / `wrongAnswerRefs` — whether the frequency chain held
- `silentFallbacks` — validators that failed and returned their input unchanged

A condition that scored badly because the ablation hurt it is indistinguishable, in
`output.json` alone, from one where the identity chain broke. Check the manifest before
aggregating.

---

## Fixtures

`src/eval/fixtures/sessions/<id>/` — one folder per session, three files:

| file | contents | production equivalent |
|---|---|---|
| `input.json` | classroom, session, assessments, student responses, misconceptions | the rows `yarn upload` writes to the database |
| `kg.json` | the archived Learning Commons responses | what the graph query returns at generate time |
| `meta.json` | session id and provenance | none — harness metadata |

`input.json` matches the fields production writes, field for field, with one deliberate
exception: student identifiers are pseudonyms (`S0239`) rather than the real UUIDs.

Five sessions are available. Four are the same Algebra W27 assessment given to different
classrooms; the fifth (`8beae1eb`) is a grade-6 W19 session with no source document and
no confidence data — so anything scoring wrong-answer links or student confidence is
unscoreable there.

---

## Layout

```
src/eval/
  types.ts                     shared eval types, including the condition enum
  fixtures/sessions/<id>/      frozen input
  runs/<runId>/                run output
  scripts/pipeline/
    runEval.ts                 entry point for `yarn eval`
    importEvalFixtures.ts      loads a fixture from disk
    exportEvalOutputs.ts       writes the run directory
    maskQuery.ts               applies a condition to the graph payload
    computeReach.ts            student counts from response data
    print-prompt.mjs           offline prompt inspector
  scripts/scoring/
    scoreMisconception.ts      misconception rubric
    scoreNextStep.ts           activity rubric
```
