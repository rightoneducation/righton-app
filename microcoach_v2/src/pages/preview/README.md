# Preview scratchpad

Renders a pipeline run's `output.json` as cards at `/preview`, so a run can be
eyeballed without going through the product UI.

Structured around the pipeline's own stages, one collapsible section per step:

| section | shows | default |
|---|---|---|
| **Misconception** | what it is — summary, reasoning, example, standards | open |
| **Evidence** | how it surfaced — counts, wrong answers, error rates, provenance | collapsed |
| **Activities** | the moves generated for it, one card each, with the `tabs` content broken out into Overview / Activity steps / Materials / Groupings | collapsed |
| **Uncategorized** | any field not yet assigned to a section | collapsed |
| **Raw JSON** | the whole element | collapsed |

Not wired to `IPipelineOutput` or the product components on purpose — it renders
whatever the pipeline actually emitted, so it stays useful while the output shape
is still being settled. Fields it doesn't recognise land in the "Uncategorized"
section rather than disappearing.

## Loading runs

```bash
yarn seed:eval --session ef3872a1 --version <tag>   # produce a run — it is published automatically
```

Then refresh `/preview` and pick the run from the dropdown. Every eval run writes one
row to the **temporary** `MicroCoachPipelineRun` table (`schema.graphql`, bottom) and
the page loads the list and the selected run from there over the API key, so nothing
has to be synced or rebuilt. Runs are grouped by `--version` tag and numbered from 1
within each group, newest first. The selection is remembered in localStorage, so a
refresh keeps you on the same run.

An MUI `CircularProgress` covers the wait; an empty table shows a one-line empty state.

## Files

- `Preview.tsx` — the page; `SECTIONS` at the top controls which fields land in which collapse
- `../../api/APIClients/pipelineRun/PipelineRunAPIClient.ts` — `listRuns()` (summary columns only) and `getRun(id)`, both over `authMode: 'apiKey'`
- `../../api/Parsers/PipelineRunParser.ts`, `../../api/Models/IPipelineRun.ts` — AWS row → page shape

Teardown set: the three api files above, the `MicroCoachPipelineRun` block in
`schema.graphql`, the publish block in `seed/cli/generate.ts`, and this page.

## Notes on the data

- `moveOptions[].tabs` is rendered structurally rather than dumped as JSON. All
  moves in the current run share the same four tab keys.
- LaTeX in `problem` / `incorrectWork` renders as monospace source — `katex` is
  not a dependency of this app (it lives in `play`).
- `activitySteps.incorrectWorkedExample1/2/3` duplicate
  `incorrectWorkedExamples[]` only about half the time. The numbered field is
  shown only when it differs from the corresponding array entry, badged
  "differs from examples[n]" — a match is noise, a mismatch is worth seeing.
