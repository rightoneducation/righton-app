# Session Changes — 2026-04-17

End-to-end debug + refactor of the MicroCoach upload pipeline. Covers: evaluators flag, upload refactor to direct-to-S3, APIClient refactor, Amplify config cleanup, Secrets Manager / Lambda env var fixes, and the `normalizeCCSS` bug fix.

---

## 1. Disable evaluators via feature flag

Evaluators call a 3rd-party API for student-readiness validation and surface preview/regenerate UI. Temporarily disabled with a simple JS constant so we can re-enable in a few weeks.

### Files modified

- **`api/amplify/backend/function/microcoachTeacherUploadGen/src/index.mjs`**
  - Added `const EVALUATORS_ENABLED = false;` near the top (~line 26)
  - Gated the `invokeLambda('microcoachInitialEvaluator-${AMPLIFY_ENV}', ...)` call (line 537)
  - Existing email rendering already short-circuits when `evalResults` is null, so no change needed there

- **`prototype/src/components/ReviewPage.js`**
  - Added `const EVALUATORS_ENABLED = false;` at top
  - Passed `evaluatorEnabled={EVALUATORS_ENABLED}` prop to `<ReviewHeader>`
  - `handleRegenerate` early-returns when `!EVALUATORS_ENABLED`

- **`prototype/src/components/ReviewHeader.js`**
  - Added `evaluatorEnabled = false` prop
  - Gated bell UI: `{evaluatorEnabled && evaluationResults && (...)}` (line 134)

- **`docs/evaluators-flag-overview.md`** — documentation + enable/disable steps

### To re-enable

Flip both `EVALUATORS_ENABLED` flags to `true`, then rebuild api and redeploy.

---

## 2. Upload refactor — direct-to-S3 from browser

### Problem

Pipeline was failing with:
```
1525970 byte payload is too large for the Event invocation type (limit 1048576 bytes)
```

The sync handler was doing `InvokeCommand` with `InvocationType: 'Event'` on itself, passing the base64 docx + xlsx as part of the payload. Lambda's async invoke cap is **1 MB**, so once files got even moderately large the self-invoke failed.

### Fix — bypass AppSync entirely for file bytes

Files now upload directly from the browser to S3 via Amplify Storage. Only S3 **keys** flow through the GraphQL mutation. The Lambda fetches the files from S3 by key.

### Files modified

- **`api/amplify/backend/api/microcoach/schema.graphql`**
  ```graphql
  input TeacherUploadInput {
    classroomId: ID!
    docxKey: String!
    xlsxKey: String!
    organization: String
  }
  ```

- **`api/src/index.ts`** — updated `teacherUpload` signature:
  ```ts
  async teacherUpload(input: {
    classroomId: string;
    docxKey: string;
    xlsxKey: string;
    organization?: string;
  }) {
    const result = await this.callGraphQL<any>(teacherUpload, { input });
    return result.data?.teacherUpload;
  }
  ```

- **`api/amplify/backend/function/microcoachTeacherUpload/src/index.mjs`**
  - Import changed: `PutObjectCommand` → `GetObjectCommand`
  - Replaced `uploadFilesToS3` with `fetchFromS3`:
    ```js
    async function fetchFromS3(bucket, key) {
      const s3 = new S3Client({ region: process.env.REGION || 'us-east-1' });
      const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const chunks = [];
      for await (const chunk of response.Body) chunks.push(chunk);
      return Buffer.concat(chunks);
    }
    ```
  - `runPipeline` destructures `{ classroomId, docxKey, xlsxKey }` and fetches buffers from S3 at Step 1b
  - Sync handler validates `docxKey` / `xlsxKey` instead of base64 fields

---

## 3. Refactor: wrap `uploadData` inside APIClient

The frontend component was importing `aws-amplify/storage` directly. Moved that into the APIClient (which is symlinked into prototype) so there's a single boundary for API calls.

### Files modified

- **`api/src/index.ts`**
  - Added import: `import { uploadData } from 'aws-amplify/storage';`
  - Added method:
    ```ts
    async uploadTeacherFiles(params: {
      activityFile: File | Blob;
      studentDataFile: File | Blob;
      organization: string;
      classroomName: string;
    }): Promise<{ docxKey: string; xlsxKey: string }> {
      const DOCX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const XLSX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const sanitize = (s: string) => (s ?? '').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

      const datetime = new Date().toISOString().replace('T', '_').replace(/:/g, '-').slice(0, 19);
      const baseName = `${sanitize(params.organization)}_${sanitize(params.classroomName)}_${datetime}`;
      const docxKey = `public/${baseName}.docx`;
      const xlsxKey = `public/${baseName}.xlsx`;

      await Promise.all([
        uploadData({ path: docxKey, data: params.activityFile, options: { contentType: DOCX_CONTENT_TYPE } }).result,
        uploadData({ path: xlsxKey, data: params.studentDataFile, options: { contentType: XLSX_CONTENT_TYPE } }).result,
      ]);

      return { docxKey, xlsxKey };
    }
    ```

- **`prototype/src/components/UploadPage.js`**
  - Removed `import { uploadData } from 'aws-amplify/storage';`
  - Removed local `DOCX_CONTENT_TYPE`, `XLSX_CONTENT_TYPE`, `sanitize`
  - Replaced the inline upload block with:
    ```js
    const { docxKey, xlsxKey } = await apiClient.uploadTeacherFiles({
      activityFile,
      studentDataFile,
      organization,
      classroomName,
    });
    ```

### Deploy note

Must rebuild the api package so prototype picks up the new method:
```
cd api && yarn build
```

---

## 4. Cleanup — remove duplicate Amplify config from prototype

While debugging the "NoBucket" error I'd temporarily copied `aws-exports.js` into the prototype and called `Amplify.configure` in `prototype/src/index.js`. Since APIClient's constructor already calls `Amplify.configure(awsconfig)` with its own bundled `aws-exports.js`, the prototype-side config is redundant.

### Files modified

- Deleted **`prototype/src/aws-exports.js`**
- **`prototype/src/index.js`** — removed:
  ```js
  import { Amplify } from 'aws-amplify';
  import awsExports from './aws-exports';
  Amplify.configure(awsExports);
  ```

APIClient is now the single source of Amplify config.

---

## 5. Secrets Manager — update stale AppSync endpoint

### Problem

Backend Lambda failing with:
```
getaddrinfo ENOTFOUND w63ndi527jdofk4vpezx2rj4du.appsync-api.us-east-1.amazonaws.com
```

That AppSync endpoint no longer exists. The current one is `oq2kqzaotngnhdxfct6mgqs7yu.appsync-api.us-east-1.amazonaws.com`.

### Root cause

`api/amplify/backend/function/microcoachTeacherUpload/src/util/appsync-client.mjs:5-8` reads the AppSync endpoint + API key from AWS Secrets Manager secret named `microcoach` (from env var `APPSYNC_SECRET_NAME`). The stored `endpoint` field was stale.

### Fix (user action — not code)

Update the `microcoach` secret in us-east-1:

```
aws secretsmanager put-secret-value \
  --secret-id microcoach \
  --region us-east-1 \
  --secret-string '{"endpoint":"https://oq2kqzaotngnhdxfct6mgqs7yu.appsync-api.us-east-1.amazonaws.com/graphql","apiKey":"da2-qjtzkjgcqjahvbikozds5cmtse"}'
```

Lambda picks it up on next invocation — no redeploy.

---

## 6. Lambda env vars + IAM wiring

Several Lambdas were missing env vars (and in one case, IAM permissions). Resolved via `amplify update function` per Lambda (which adds env vars + IAM and redeploys on `amplify push`).

### microcoachTeacherUpload
Missing: `STORAGE_MICROCOACHDOCS_BUCKETNAME` + `s3:GetObject` on the storage bucket.
Fix: `amplify update function` → pick this function → "Resource access permissions" → select `microcoachdocs` storage → grant **read** (this auto-injects the bucket name env var and adds the IAM statement).

Final env:
```
ENV                                = <auto>
REGION                             = <auto>
APPSYNC_SECRET_NAME                = microcoach
API_SECRET_NAME                    = microcoach    (unused, can remove)
NOTIFY_FROM_EMAIL                  = noreply@rightoneducation.com
NOTIFY_TO_EMAILS                   = drewjhart@gmail.com
STORAGE_MICROCOACHDOCS_BUCKETNAME  = microcoachdocs103045-dev
```

### microcoachTeacherUploadGen
Already complete:
```
APPSYNC_SECRET_NAME   = microcoach
NOTIFY_FROM_EMAIL     = noreply@rightoneducation.com
NOTIFY_TO_EMAILS      = drewjhart@gmail.com
FRONTEND_URL          = https://microcoach.rightoneducation.com
```

### microcoachIngestPPQ / microcoachLLMAnalysis / microcoachLLMVerify / microcoachNextStepOption
Each needed:
```
API_SECRET_NAME  = openai-api
```

### microcoachGetLearningScience
Needed:
```
API_SECRET_NAME       = <learning-science-api-secret>
ENDPOINT_SECRET_NAME  = <learning-science-endpoint-secret>
```
(Exact secret names resolved against Secrets Manager — the secrets hold `{"API": "..."}` and `{"ext-endpoint": "..."}` respectively.)

### microcoachInitialEvaluator
```
GOOGLE_API_SECRET_NAME = google-api
```

### microcoachRegenEvaluator
```
API_SECRET_NAME      = openai-api
APPSYNC_SECRET_NAME  = microcoach
```

---

## 7. Bug fix — `normalizeCCSS.mjs` dropped the dotted input form

### Problem

After wiring envs, `getLearningScience` was hitting the external knowledge-graph successfully but getting back empty arrays for valid CCSS codes like `HSA-REI.C.6`.

### Diagnosis

CloudWatch logs showed the Lambda calling the external API with normalized codes `['HSA-REI-C.6', 'CCSS.Math.Content.HSA-REI-C.6']` (hyphens), and the API returning an empty set. Curl tests against the external endpoint (see `docs/learning-science-endpoint-debug.md`) proved the DB stores codes in the dotted form:

| Form sent | Results |
|---|---|
| `HSA-REI-C.6` (hyphen, what Lambda sent) | 0 |
| `HSA-REI.C.6` (dotted, the original input) | 17 |
| `CCSS.Math.Content.HSA-REI.C.6` | 1 |

`normalizeCCSSCode` was converting the first dot to a hyphen and **never including the original dotted input** in the candidate list passed to the OR query.

### Fix

Minimum change: prepend the original `code` to the `candidates` array so the dotted form (which the DB actually stores) is one of the ORed filters.

**`api/amplify/backend/function/microcoachGetLearningScience/src/util/normalizeCCSS.mjs`**

```js
const candidates = [
  code,                                  // ← added
  normalized,
  `CCSS.Math.Content.HS${normalized}`
];
```

Everything else left alone.

---

## 8. Debug doc added

**`docs/learning-science-endpoint-debug.md`** — copy/pasteable curl tests for probing which CCSS code format the external knowledge-graph DB accepts. Useful again if the upstream format ever shifts.

---

## Deploy checklist

1. `cd api && amplify push` — pushes Lambda env vars + IAM changes + schema + Lambda source
2. `cd api && yarn build` — rebuild api package so prototype picks up `uploadTeacherFiles`
3. Restart prototype dev server (CRA) so it picks up the rebuilt lib
4. Update Secrets Manager secret `microcoach` with the current AppSync endpoint + API key (see section 5)
