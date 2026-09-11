#!/usr/bin/env node
/**
 * sync-preview-runs.mjs
 *
 * Copies each eval run's output.json + manifest.json into public/preview-runs/
 * and writes an index.json, so the /preview page can hydrate from any run
 * without a rebuild — the dev server serves public/ statically.
 *
 * Usage: yarn preview:sync
 * Then:  refresh /preview and pick a run from the dropdown.
 *
 * public/preview-runs/ is gitignored: runs are ~2.6MB each and `yarn build`
 * copies public/ wholesale into the production bundle.
 */

import { readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RUNS_SRC = join(root, 'seed', 'eval', 'runs');
const RUNS_DST = join(root, 'public', 'preview-runs');

if (!existsSync(RUNS_SRC)) {
  console.error(`No runs directory at ${RUNS_SRC} — run \`yarn seed:eval --session <id>\` first.`);
  process.exit(1);
}

// A run is only usable if it has output.json; a crashed run leaves a partial
// directory behind and should be skipped rather than listed and then 404ing.
const dirs = readdirSync(RUNS_SRC, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .filter((name) => existsSync(join(RUNS_SRC, name, 'output.json')));

if (dirs.length === 0) {
  console.error(`No complete runs found in ${RUNS_SRC} (looked for output.json).`);
  process.exit(1);
}

// Rebuilt from scratch so runs deleted from seed/eval/runs/ don't linger here.
rmSync(RUNS_DST, { recursive: true, force: true });
mkdirSync(RUNS_DST, { recursive: true });

const entries = dirs.map((id) => {
  const srcDir = join(RUNS_SRC, id);
  const dstDir = join(RUNS_DST, id);
  mkdirSync(dstDir, { recursive: true });
  copyFileSync(join(srcDir, 'output.json'), join(dstDir, 'output.json'));

  let manifest = {};
  const manifestPath = join(srcDir, 'manifest.json');
  if (existsSync(manifestPath)) {
    copyFileSync(manifestPath, join(dstDir, 'manifest.json'));
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    } catch {
      console.warn(`  ! ${id}: manifest.json is not valid JSON, indexing without it`);
    }
  }

  let misconceptionCount = manifest.misconceptionCount ?? null;
  if (misconceptionCount === null) {
    try {
      const output = JSON.parse(readFileSync(join(srcDir, 'output.json'), 'utf8'));
      misconceptionCount = Array.isArray(output) ? output.length : null;
    } catch {
      misconceptionCount = null;
    }
  }

  return {
    id,
    classroom: manifest.classroomName ?? '',
    session: manifest.sessionLabel ?? '',
    condition: manifest.condition ?? '',
    version: manifest.version ?? null,
    startedAt: manifest.startedAt ?? '',
    misconceptionCount,
  };
});

// Newest first, so the dropdown's #1 is the run you just produced. startedAt is
// ISO, and the directory name carries the timestamp, so either sorts correctly.
entries.sort((a, b) => (b.startedAt || b.id).localeCompare(a.startedAt || a.id));

// Numbering restarts per version, so each group in the dropdown reads 1, 2, 3.
// Entries are already globally newest-first, so first-seen order within a group
// is newest-first too. `n` is a display ordinal only — it is not unique across
// the index, and nothing should key off it (use `id`).
const seenPerVersion = new Map();
entries.forEach((entry) => {
  const key = entry.version ?? '(untagged)';
  const next = (seenPerVersion.get(key) ?? 0) + 1;
  seenPerVersion.set(key, next);
  entry.n = next;
});

writeFileSync(join(RUNS_DST, 'index.json'), `${JSON.stringify(entries, null, 2)}\n`);

console.log(`Synced ${entries.length} run(s) to public/preview-runs/`);

// Printed grouped, matching the dropdown — a flat list would repeat 1, 1, 2, 2
// now that numbering restarts per version.
const groups = new Map();
entries.forEach((entry) => {
  const key = entry.version ?? '(untagged)';
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(entry);
});
groups.forEach((list, version) => {
  console.log(`  ${version}`);
  list.forEach((e) => {
    console.log(`    ${e.n}. ${e.id}${e.condition ? `  (${e.condition})` : ''}`);
  });
});
