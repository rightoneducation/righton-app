/**
 * print-prompt.mjs — show the learning-science prompt section the pipeline builds.
 *
 * Offline: no AWS, no LLM, no cost. Reads an archived pilot graph response and runs
 * the *real* normalizer and formatter the Lambdas use, so what you see here is what
 * the model would see.
 *
 * Usage (from microcoach/):
 *   node eval/print-prompt.mjs                       # first pilot session
 *   node eval/print-prompt.mjs --session ef3872a1
 *   node eval/print-prompt.mjs --stats               # counts only, skip the prose
 *   node eval/print-prompt.mjs --data <dir>          # override dataset location
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { normalizeStandard } from '../../../../amplify/backend/function/microcoachGetLearningScience/src/util/normalizeStandard.mjs';
import { formatLearningScience } from '../../../../amplify/backend/function/microcoachLLMAnalysis/src/util/formatLearningScience.mjs';

const arg = (flag, fallback = null) => {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const has = (flag) => process.argv.includes(flag);

const DEFAULT_DIRS = [
  path.join(os.homedir(), 'righton-eval/data/dataset/sessions'),
  path.join(os.homedir(), 'Desktop/Data/dataset/sessions'),
];

function resolveDataDir() {
  const override = arg('--data');
  if (override) return override;
  const found = DEFAULT_DIRS.find((d) => fs.existsSync(d));
  if (!found) {
    console.error('Could not find the pilot dataset. Looked in:');
    DEFAULT_DIRS.forEach((d) => console.error(`  ${d}`));
    console.error('Pass --data <dir> to point at it.');
    process.exit(1);
  }
  return found;
}

function loadSession(dir, wanted) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  if (files.length === 0) {
    console.error(`No session files in ${dir}`);
    process.exit(1);
  }
  const file = wanted ? files.find((f) => f.startsWith(wanted)) : files[0];
  if (!file) {
    console.error(`No session matching "${wanted}". Available: ${files.map((f) => f.replace('.json', '')).join(', ')}`);
    process.exit(1);
  }
  return { file, data: JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) };
}

const dir = resolveDataDir();
const { file, data } = loadSession(dir, arg('--session'));

// Raw graph items exactly as the API returned them during the pilot.
const rawItems = [];
for (const q of data.knowledgeGraphQueries ?? []) {
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
console.log(`session ${file.replace('.json', '')}   standards: ${standards.map((s) => s.code).join(', ')}`);
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
