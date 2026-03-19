# Microcoach API — Seed Pipeline

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
