# Call 1 — Learning Science Lookup

> Reference copy. The source of truth is the Lambda source under `api/amplify/backend/function/` — if this file and the code disagree, the code wins.

| | |
|---|---|
| **Lambda** | `microcoachGetLearningScience` |
| **Model** | N/A — queries the 3rd party learning science database via GraphQL, not an LLM |

No prompt. The function fetches structured data about a CCSS standard (prerequisites, downstream standards, learning components) and returns it as context for the other calls.
