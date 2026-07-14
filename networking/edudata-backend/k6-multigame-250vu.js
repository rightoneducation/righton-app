/**
 * UpGrade multi-game classroom simulation
 *
 * Models N simultaneous game sessions, each with 25 students.
 * Each game: students join staggered (3s apart) → game plays → hint card opens → mark+log burst.
 * The mark burst is where concurrent DB pressure shows — all students in all games
 * hit mark within seconds of each other when the teacher advances to the hint question.
 *
 * Tune GAMES to scale up pressure. At 5 games = 125 concurrent marks. At 10 = 250.
 *
 * Run cache-OFF:  k6 run k6-multigame-simulation.js --out=json=results-multi-cacheoff.json
 * Run cache-ON:   k6 run k6-multigame-simulation.js --out=json=results-multi-cacheon.json
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// ── Configuration ─────────────────────────────────────────────────────────────
const GAMES             = 10;  // simultaneous game sessions
const STUDENTS_PER_GAME = 25; // students per game
const JOIN_STAGGER_S    = 3;  // seconds between students joining within a game
const GAME_TIME_S       = 30; // seconds of gameplay before hint card opens

const BASE    = 'https://edudata.rightoneducation.com/api';
const HEADERS = { 'Content-Type': 'application/json' };

// ── Custom metrics ─────────────────────────────────────────────────────────────
const initTrend   = new Trend('upgrade_init_ms',   true);
const assignTrend = new Trend('upgrade_assign_ms',  true);
const markTrend   = new Trend('upgrade_mark_ms',    true);
const logTrend    = new Trend('upgrade_log_ms',     true);

export const options = {
  scenarios: {
    classroom: {
      executor: 'per-vu-iterations',
      vus: GAMES * STUDENTS_PER_GAME,
      iterations: 1,
      maxDuration: '15m',
    },
  },
  thresholds: {
    upgrade_assign_ms: ['p(95)<3000'],
    upgrade_mark_ms:   ['p(95)<3000'],
  },
};

export default function () {
  // Assign each VU to a game and a seat within that game
  const gameIndex    = Math.floor((__VU - 1) / STUDENTS_PER_GAME);
  const studentIndex = (__VU - 1) % STUDENTS_PER_GAME;

  // All games start simultaneously — students within each game join staggered
  sleep(studentIndex * JOIN_STAGGER_S);

  const userId  = `k6-game${gameIndex}-student${studentIndex}`;
  const headers = { ...HEADERS, 'User-Id': userId };

  // ── 1. Init ───────────────────────────────────────────────────────────────
  const initRes = http.post(`${BASE}/v6/init`, '{}', { headers });
  initTrend.add(initRes.timings.duration);
  check(initRes, { 'init 200': (r) => r.status === 200 });

  // ── 2. Assign ─────────────────────────────────────────────────────────────
  const assignRes = http.post(
    `${BASE}/v6/assign`,
    JSON.stringify({ context: 'righton-play' }),
    { headers }
  );
  assignTrend.add(assignRes.timings.duration);
  check(assignRes, { 'assign 200': (r) => r.status === 200 });

  let conditionData = null;
  try {
    const assignments = JSON.parse(assignRes.body);
    if (Array.isArray(assignments) && assignments.length > 0) {
      const a         = assignments[0];
      const condition = Array.isArray(a.assignedCondition)
        ? a.assignedCondition[0]
        : a.assignedCondition;
      conditionData = {
        target:            a.target,
        site:              a.site,
        experimentType:    a.experimentType,
        assignedCondition: condition,
      };
    }
  } catch (_) {}

  // ── Wait for teacher to advance to hint — all students converge here ───────
  // Later-joining students have less to wait so everyone hits mark together
  const waitRemaining = GAME_TIME_S - (studentIndex * JOIN_STAGGER_S) + JOIN_STAGGER_S;
  sleep(Math.max(waitRemaining, 1));

  // ── 3. Mark (hint card opens — concurrent burst across all games) ─────────
  if (conditionData) {
    const markRes = http.post(
      `${BASE}/v6/mark`,
      JSON.stringify({ status: 'condition applied', data: conditionData }),
      { headers }
    );
    markTrend.add(markRes.timings.duration);
    check(markRes, { 'mark 200': (r) => r.status === 200 });
  }

  sleep(2);

  // ── 4. Log (hint submitted) ───────────────────────────────────────────────
  const logRes = http.post(
    `${BASE}/v6/log`,
    JSON.stringify({
      value: [{
        timestamp: new Date().toISOString(),
        metrics: { attributes: { hintSubmitted: 1 }, groupedMetrics: [] },
      }],
    }),
    { headers }
  );
  logTrend.add(logRes.timings.duration);
  check(logRes, { 'log 200': (r) => r.status === 200 });
}
