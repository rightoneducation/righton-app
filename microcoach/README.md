# MicroCoach

MicroCoach is an AI-powered instructional coaching tool for K-12 math teachers. It analyzes classroom assessment data, identifies student misconceptions grounded in CCSS learning progressions, and generates targeted intervention activities (RTDs) for teachers to review, save, and execute.

### Project Description

MicroCoach lives inside the broader RightOn monorepo at `righton-app/microcoach/`. It is a Yarn workspace with two packages: `api/` (backend library, Amplify config, Lambda functions) and `prototype/` (React frontend dashboard). The tool walks teachers through three phases: Analyze (reviewing AI-generated gap analysis), Prepare (saving and managing next steps), and Reflect (tracking intervention patterns over time).

### Architecture

MicroCoach runs on AWS, deployed via Amplify. The data layer is AppSync/GraphQL backed by DynamoDB. The three computationally expensive operations — fetching learning science data, running LLM analysis, and generating RTD activities — are each handled by a dedicated Lambda function invoked as custom GraphQL mutations. API secrets (OpenAI key, external endpoint URL) are stored in AWS Secrets Manager and loaded at runtime inside the Lambda; they are never exposed to the client.

### Directory Structure

```
microcoach/
├── package.json          Yarn workspace root (defines api/ and prototype/ as workspaces)
├── api/                  Backend library, Amplify config, Lambda functions
│   ├── src/              APIClient TypeScript source + generated GraphQL operations
│   ├── lib/              Compiled output (imported by prototype via workspace symlink)
│   └── amplify/
│       └── backend/
│         ├── api/microcoach/
│         │   └── schema.graphql    <- GraphQL schema
│         └── function/
│             ├── microcoachGetLearningScience/src/index.mjs
│             ├── microcoachLLMAnalysis/src/index.mjs
│             └── microcoachLLMGeneration/src/index.mjs
└── prototype/            React dashboard (Create React App)
    └── src/
        ├── App.js        Main controller: data fetching, state, tab routing
        └── components/   UI components (RecommendedNextSteps, YourNextSteps, etc.)
```

### Workspace Symlinking

Yarn workspaces create symlinks at install time so the prototype can import the API library as a package without publishing to npm:

```
node_modules/@righton/microcoach-api -> ../../api
```

The prototype imports the compiled API client as:

```js
import { APIClient } from '@righton/microcoach-api';
```

Any changes to `api/src/` require `yarn build` inside `api/` to update `lib/` before they are reflected in the prototype.

### GraphQL Schema

The authoritative schema is at:

```
api/amplify/backend/api/microcoach/schema.graphql
```

Core models: `Classroom`, `Session`, `Student`, `Assessment`, `StudentResponse`, `Misconception`, `Activity`, `SavedNextStep`, `ContextData`.

Custom Lambda-backed mutations are defined in the schema as:

```graphql
getLearningScience(input: GetLearningScienceInput!): String
getAnalysis(input: GetAnalysisInput!): String
generateRTD(input: GenerateRTDInput!): String
```

### Lambda Functions

**microcoachGetLearningScience** — Accepts a CCSS standard code. Normalizes it to all plausible formats (e.g. `6.NS.A.1` / `6.NS.1`), queries an external CCSS standards framework GraphQL endpoint using AWS Signature V4 auth, and returns a normalized object with `prerequisiteStandards` (earlier-grade topics students must know first) and `futureDependentStandards` (later-grade topics that depend on this standard). Endpoint URL and API key are stored in Secrets Manager.

**microcoachLLMAnalysis** — Accepts aggregated classroom data (current session, session history, PPQ assessment) and learning science data. Strips individual student responses before sending to the LLM. Calls OpenAI GPT-4o with structured output via `zodResponseFormat`, validating the response against a Zod schema. Returns `synthesis`, `keyFindings`, `trends`, and `misconceptions[]` with fields including severity, priority, occurrence, evidence, `prerequisiteGapCodes`, and `impactedObjectiveCodes`.

**microcoachLLMGeneration** — Accepts a single misconception plus few-shot RTD lesson examples from the `ContextData` table. Calls OpenAI GPT-4o with a Zod-validated output schema. Returns a complete RTD Activity object including a multi-tab structure (Overview, ActivitySteps, Materials, StudentGroupings), duration, format, and AI reasoning.
