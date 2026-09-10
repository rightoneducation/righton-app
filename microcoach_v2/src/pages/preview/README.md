# Preview scratchpad

Renders a pipeline run's `output.json` as cards at `/preview`, so a run can be
eyeballed without going through the product UI.

Not wired to `IPipelineOutput` or the product components on purpose — it renders
whatever the pipeline actually emitted, so it stays useful while the output shape
is still being settled. Fields it doesn't recognise land in the "Uncategorized"
card rather than disappearing.

## Refresh the data

From `microcoach_v2/`:

```bash
D=$(ls -dt seed/eval/runs/*/ | head -1)
cp "${D}output.json"   src/pages/preview/run.json
cp "${D}manifest.json" src/pages/preview/manifest.json
```

Then `yarn start` and open `/preview`.

## Files

- `Preview.tsx` — the page; `GROUPS` at the top controls which fields land in which card
- `run.json` — the run being previewed (currently `classroom-1-session1-none-2026-09-10T01-59-20`)
- `manifest.json` — drives the sticky header (token counts, link health, silent fallbacks)
