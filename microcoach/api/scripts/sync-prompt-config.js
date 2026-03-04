#!/usr/bin/env node
/**
 * sync-prompt-config.js
 *
 * Copies prompt-config.json into each Lambda's src/util/config.json so that
 * all LLM tuning values are controlled from a single file.
 *
 * Usage: yarn sync-config
 * Then:  amplify push -y   (to deploy the updated Lambdas)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const masterConfig = JSON.parse(readFileSync(resolve(root, 'prompt-config.json'), 'utf8'));

const lambdas = [
  'microcoachLLMAnalysis',
  'microcoachLLMGeneration',
  'microcoachNextStepOption',
  'microcoachSubMisconceptions',
];

let ok = 0;
for (const lambda of lambdas) {
  const dest = resolve(root, 'amplify/backend/function', lambda, 'src/util/config.json');
  try {
    writeFileSync(dest, JSON.stringify(masterConfig, null, 2) + '\n');
    console.log(`✓  ${lambda}`);
    ok++;
  } catch (err) {
    console.error(`✗  ${lambda}: ${err.message}`);
  }
}

console.log(`\n${ok}/${lambdas.length} Lambdas updated.`);
if (ok > 0) console.log('Run "amplify push -y" to deploy the changes.');
