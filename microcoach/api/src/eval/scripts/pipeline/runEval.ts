/**
 * runEval.ts — the single entry point for eval runs.
 *
 *   yarn eval [options]
 *
 * Wraps the generation pipeline so the eval has one command with plain options,
 * rather than callers remembering which `yarn generate` flags put it in fixture
 * mode. Everything here is read-only with respect to the database: fixture mode is
 * always on, so no run can write to DynamoDB.
 *
 * Each run writes a directory under src/eval/runs/ — see ../../README.md.
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { MaskOptionEnum } from '../../types';

const SESSIONS_DIR = path.resolve(__dirname, '../../fixtures/sessions');
const GENERATE = path.resolve(__dirname, '../../../cli/generate.ts');

const CONDITIONS = Object.keys(MaskOptionEnum) as (keyof typeof MaskOptionEnum)[];

const arg = (flag: string): string | null => {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : null;
};
const has = (flag: string) => process.argv.includes(flag);

function availableSessions(): string[] {
  if (!fs.existsSync(SESSIONS_DIR)) return [];
  return fs
    .readdirSync(SESSIONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function main(): void {
  const sessions = availableSessions();
  if (has('--list')) {
    console.log(`\nSessions (${sessions.length}):\n  ${sessions.join('\n  ') || '(none found)'}`);
    console.log(`\nConditions (${CONDITIONS.length}):\n  ${CONDITIONS.join('\n  ')}\n`);
    return;
  }
  if (sessions.length === 0) {
    throw new Error(`No fixture sessions found in ${SESSIONS_DIR}`);
  }

  // Session selection — `all`, or a prefix so `--session ef38` works. Required
  // rather than defaulting: fanning out across every session should be something
  // you asked for, not something you got by omitting a flag.
  const wantedSession = arg('--session');
  if (!wantedSession) {
    throw new Error(
      `--session is required. Use "all" to run every session, or one of: ${sessions.join(', ')}`,
    );
  }
  const targets = wantedSession === 'all'
    ? sessions
    : sessions.filter((s) => s.startsWith(wantedSession));
  if (targets.length === 0) {
    throw new Error(`No session matching "${wantedSession}". Available: all, ${sessions.join(', ')}`);
  }

  // Condition selection — validated here so a typo fails before any model call
  // rather than being recorded in a manifest under a condition it never applied.
  const wantedCondition = (arg('--condition') ?? 'NONE').toUpperCase();
  let conditions: string[];
  if (wantedCondition === 'ALL') {
    conditions = CONDITIONS;
  } else {
    if (!CONDITIONS.includes(wantedCondition as any)) {
      throw new Error(`Unknown condition "${wantedCondition}". Valid: all, ${CONDITIONS.join(', ')}`);
    }
    conditions = [wantedCondition];
  }

  const graph = has('--live-graph') ? 'live' : 'fixture';
  const total = targets.length * conditions.length;

  console.log('=== MicroCoach Eval ===');
  console.log(`  sessions   : ${targets.join(', ')}`);
  console.log(`  conditions : ${conditions.join(', ')}`);
  console.log(`  graph      : ${graph}${graph === 'live' ? '  (re-querying Learning Commons)' : '  (replaying archive)'}`);
  console.log(`  runs       : ${total}\n`);

  let done = 0;
  const failures: string[] = [];

  for (const condition of conditions) {
    for (const session of targets) {
      done += 1;
      console.log(`\n──────── [${done}/${total}] ${session} · ${condition} ────────`);
      const result = spawnSync(
        'npx',
        ['ts-node', GENERATE, '--fixture', session, '--condition', condition, '--graph', graph],
        { stdio: 'inherit' },
      );
      // Keep going on failure — one bad session should not cost the whole matrix.
      if (result.status !== 0) failures.push(`${session}/${condition}`);
    }
  }

  console.log(`\n=== ${total - failures.length}/${total} runs completed ===`);
  if (failures.length) {
    console.log(`Failed: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('Output in src/eval/runs/');
}

try {
  main();
} catch (err: any) {
  console.error(`\n${err.message ?? err}\n`);
  process.exit(1);
}
