/**
 * Contract check: does activity content in the app's shape parse against the
 * schema NextStepOption generates with?
 *
 * The app reads src/lib/ActivityContentModels.ts; the Lambda writes against the
 * zod schemas in microcoachv2NextStepOption/src/util/activityContent.mjs. Nothing
 * ties the two across the CRA/Lambda boundary, so this parses known-good,
 * app-shaped content (the hand-seeded activities) against the Lambda's schema.
 * A failure means the two have drifted.
 *
 *   node seed/eval/scripts/checkContentContract.mjs <file.json>
 *
 * <file.json> is an array of { type, content }, where `type` is the
 * activityType and `content` the stored `phases`.
 */
import { readFileSync } from 'node:fs';
import { activityContentSchemaFor } from '../../../amplify/backend/function/microcoachv2NextStepOption/src/util/activityContent.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node checkContentContract.mjs <file.json>');
  process.exit(2);
}

let failures = 0;
for (const [i, { type, content }] of JSON.parse(readFileSync(file, 'utf8')).entries()) {
  const schema = activityContentSchemaFor(type);
  if (!schema) {
    console.log(`✗ #${i + 1} ${type}: no schema for this type`);
    failures += 1;
    continue;
  }
  const result = schema.safeParse(content);
  if (result.success) {
    console.log(`✓ #${i + 1} ${type}`);
  } else {
    failures += 1;
    console.log(`✗ #${i + 1} ${type}`);
    for (const issue of result.error.issues) console.log(`    ${issue.path.join('.')}: ${issue.message}`);
  }
}
process.exit(failures ? 1 : 0);
