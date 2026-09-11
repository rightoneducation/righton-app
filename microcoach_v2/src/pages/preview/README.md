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
yarn seed:eval --session ef3872a1   # produce a run
yarn preview:sync                   # publish every run to public/preview-runs/
```

Then refresh `/preview` and pick a run from the dropdown. Runs are grouped by
`--version` tag and numbered from 1 within each group, newest first. The
selection is remembered in localStorage, so a refresh keeps you on the same run.

`preview:sync` rebuilds `public/preview-runs/` from scratch each time, so runs
deleted from `seed/eval/runs/` disappear from the dropdown too. Runs missing an
`output.json` (a crashed run) are skipped rather than listed and then 404ing.

`public/preview-runs/` is gitignored — runs are ~2.6MB each and `yarn build`
copies `public/` wholesale into the production bundle.

If nothing has been synced, the page falls back to the bundled `run.json`
snapshot committed in this folder, so it always renders something.

## Files

- `Preview.tsx` — the page; `SECTIONS` at the top controls which fields land in which collapse
- `run.json` / `manifest.json` — bundled fallback snapshot, used only when nothing is synced
- `../../../scripts/sync-preview-runs.mjs` — publishes runs to `public/preview-runs/` and writes `index.json`

## Notes on the data

- `moveOptions[].tabs` is rendered structurally rather than dumped as JSON. All
  moves in the current run share the same four tab keys.
- LaTeX in `problem` / `incorrectWork` renders as monospace source — `katex` is
  not a dependency of this app (it lives in `play`).
- `activitySteps.incorrectWorkedExample1/2/3` duplicate
  `incorrectWorkedExamples[]` only about half the time. The numbered field is
  shown only when it differs from the corresponding array entry, badged
  "differs from examples[n]" — a match is noise, a mismatch is worth seeing.
