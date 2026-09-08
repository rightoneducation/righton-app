/**
 * print-prompt.mjs — show the learning-science prompt section the pipeline builds.
 *
 * Offline: no AWS, no LLM, no cost. Reads a fixture's archived graph response and runs
 * the *real* normalizer and formatter the Lambdas use, so what you see here is what
 * the model would see.
 *
 * Usage (from api/):
 *   node src/eval/scripts/util/print-prompt.mjs                    # first session
 *   node src/eval/scripts/util/print-prompt.mjs --session ef3872a1
 *   node src/eval/scripts/util/print-prompt.mjs --stats            # counts only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeStandard } from '../../../../amplify/backend/function/microcoachv2GetLearningScience/src/util/normalizeStandard.mjs';
import { formatLearningScience } from '../../../../amplify/backend/function/microcoachv2LLMAnalysis/src/util/formatLearningScience.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DIR = path.resolve(__dirname, '../../fixtures');

const arg = (flag, fallback = null) => {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const has = (flag) => process.argv.includes(flag);

/** Session ids, discovered from the directory — same rule importEvalFixtures uses. */
function loadSession(wanted) {
  const ids = fs.existsSync(SESSION_DIR)
    ? fs.readdirSync(SESSION_DIR, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()
    : [];
  if (ids.length === 0) {
    console.error(`No fixture sessions in ${SESSION_DIR}`);
    process.exit(1);
  }
  const id = wanted ? ids.find((i) => i.startsWith(wanted)) : ids[0];
  if (!id) {
    console.error(`No session matching "${wanted}". Available: ${ids.join(', ')}`);
    process.exit(1);
  }
  // The graph response lives in kg.json; input.json holds the database rows.
  return { id, kg: JSON.parse(fs.readFileSync(path.join(SESSION_DIR, id, 'kg.json'), 'utf8')) };
}

const { id: file, kg } = loadSession(arg('--session'));

// Raw graph items exactly as the API returned them during the pilot.
const rawItems = [];
for (const q of kg.knowledgeGraphQueries ?? []) {
  for (const item of q.graphResponse?.data?.standardsFrameworkItems ?? []) rawItems.push(item);
}

if (rawItems.length === 0) {
  console.error(`Session ${file} has no matched graph responses.`);
  process.exit(1);
}

// The real pipeline path: normalize, then format.
const standards = rawItems.map(normalizeStandard);
const section = formatLearningScience({ standards });

const count = (fn) => standards.reduce((n, s) => n + fn(s), 0);
const stats = {
  standards: standards.length,
  learningComponents: count((s) => s.learningComponents.length),
  prerequisites: count((s) => s.prerequisiteStandards.length),
  downstream: count((s) => s.futureDependentStandards.length),
  childStandards: count((s) => s.childStandards.length),
  relatedStandards: count((s) => s.relatedStandards.length),
  lvnFactors: count((s) => s.lvnFactors.length),
  lvnStrategies: count((s) => s.lvnFactors.reduce((n, f) => n + f.strategies.length, 0)),
  lvnLearnerModels: count((s) => s.lvnFactors.reduce((n, f) => n + f.learnerModels.length, 0)),
  lvnInteractsWith: count((s) => s.lvnFactors.reduce((n, f) => n + f.interactsWith.length, 0)),
};

console.log('='.repeat(72));
console.log(`session ${file}   standards: ${standards.map((s) => s.code).join(', ')}`);
console.log('='.repeat(72));

console.log('\nWhat the normalizer produced:');
for (const [k, v] of Object.entries(stats)) {
  console.log(`  ${k.padEnd(20)} ${String(v).padStart(5)}`);
}
console.log(`\n  section size          ${section.length.toLocaleString()} chars  (~${Math.round(section.length / 4).toLocaleString()} tokens)`);

// Anything the API returned that never made it into the rendered text.
const missing = [];
const firstFactor = standards.flatMap((s) => s.lvnFactors)[0];
if (stats.learningComponents > 0 && !section.includes('Learning components')) missing.push('learningComponents');
if (stats.lvnStrategies > 0 && firstFactor?.strategies?.[0] && !section.includes(firstFactor.strategies[0].name)) missing.push('lvnStrategies');
if (stats.lvnLearnerModels > 0 && !section.includes('Learner models')) missing.push('lvnLearnerModels');
if (stats.lvnInteractsWith > 0 && !section.includes('Interacts with')) missing.push('lvnInteractsWith');
if (stats.childStandards > 0 && !section.includes('Child standards')) missing.push('childStandards');

console.log(missing.length === 0
  ? '\n  ✓ every populated field appears in the rendered section'
  : `\n  ✗ populated but NOT rendered: ${missing.join(', ')}`);

if (!has('--stats')) {
  console.log(`\n${'='.repeat(72)}`);
  console.log('PROMPT SECTION AS THE MODEL RECEIVES IT');
  console.log('='.repeat(72));
  console.log(`\n${section}\n`);
}
