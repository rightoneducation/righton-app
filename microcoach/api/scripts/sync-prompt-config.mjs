#!/usr/bin/env node
/**
 * sync-prompt-config.js
 *
 * Writes only the relevant config section from prompt-config.json into each
 * Lambda's src/util/config.json so that all LLM tuning values are controlled
 * from a single file and each Lambda only receives its own config.
 *
 * Usage: yarn sync-config
 * Then:  amplify push -y
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const master = JSON.parse(readFileSync(resolve(root, 'prompt-config.json'), 'utf8'));

const lambdas = [
  { name: 'microcoachLLMAnalysis',    key: 'analysis' },
  { name: 'microcoachLLMGeneration',  key: 'nextStepOption' },
  { name: 'microcoachNextStepOption', key: 'nextStepOption' },
];

let ok = 0;
for (const { name, key } of lambdas) {
  const dest = resolve(root, 'amplify/backend/function', name, 'src/util/config.json');
  try {
    const slice = { [key]: master[key] };
    writeFileSync(dest, JSON.stringify(slice, null, 2) + '\n');
    console.log(`✓  ${name}  (${key})`);
    ok++;
  } catch (err) {
    console.error(`✗  ${name}: ${err.message}`);
  }
}

console.log(`\n${ok}/${lambdas.length} Lambdas updated.`);
if (ok > 0) console.log('Run "amplify push -y" to deploy the changes.');
