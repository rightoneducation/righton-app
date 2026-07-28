# Call 1 — Learning Science Lookup

> Reference copy. The source of truth is the Lambda source under `api/amplify/backend/function/` — if this file and the code disagree, the code wins.

| | |
|---|---|
| **Lambda** | `microcoachGetLearningScience` |
| **Model** | N/A — queries the 3rd party learning science database via GraphQL, not an LLM |

No prompt. The function fetches structured data about a CCSS standard (prerequisites, downstream standards, learning components) and returns it as context for the other calls.

Per standard it returns `description`, `prerequisiteStandards[]`, `futureDependentStandards[]` (each `{ code, description }`), and `lvnFactors[]` (each `{ name, category, description }`, mapped from `factorsrelevantToStandard`). Call 2 uses the prerequisite and future lists to populate `prerequisiteGapCodes` / `impactedObjectiveCodes`; Call 4 renders all four into its Knowledge Graph and LVN Learning Science Factors sections, and uses `lvnFactors` to steer strategy-tag selection.
