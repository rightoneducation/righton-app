/**
 * UpGrade experiment simulation — 25 students joining and playing through a hint
 *
 * Run cache-OFF baseline:  k6 run k6-upgrade-simulation.js --out json=results-cacheoff.json
 * Run cache-ON:            k6 run k6-upgrade-simulation.js --out json=results-cacheon.json
 * Compare:                 k6 run k6-upgrade-simulation.js (summary only)
 *
 * Each VU = one student. Flow: join (init+assign) → wait for game to reach hint → mark+log.
 * Students stagger their joins by 3s (VU 1 joins immediately, VU 25 joins after 72s),
 * mirroring a real classroom login flow.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const initTrend   = new Trend('upgrade_init_ms',   true);
const assignTrend = new Trend('upgrade_assign_ms',  true);
const markTrend   = new Trend('upgrade_mark_ms',    true);
const logTrend    = new Trend('upgrade_log_ms',     true);

export const options = {
  scenarios: {
    classroom: {
      executor: 'per-vu-iterations',
      vus: 25,
      iterations: 1,
      maxDuration: '10m',
    },
  },
  thresholds: {
    upgrade_assign_ms: ['p(95)<2000'],
    upgrade_mark_ms:   ['p(95)<2000'],
  },
};

const BASE    = 'https://edudata.rightoneducation.com/api';
const HEADERS = { 'Content-Type': 'application/json' };

// Simulated game time before hint card opens (seconds)
const GAME_TIME_S = 30;

export default function () {
  // Stagger joins: each student waits 3s after the previous one
  sleep((__VU - 1) * 3);

  const userId  = `k6-student-${__VU}-${__ITER}`;
  const headers = { ...HEADERS, 'User-Id': userId };

  // ── 1. Init ─────────────────────────────────────────────────────────────
  const initRes = http.post(`${BASE}/v6/init`, '{}', { headers });
  initTrend.add(initRes.timings.duration);
  check(initRes, { 'init 200': (r) => r.status === 200 });

  // ── 2. Assign ────────────────────────────────────────────────────────────
  const assignRes = http.post(
    `${BASE}/v6/assign`,
    JSON.stringify({ context: 'righton-play' }),
    { headers }
  );
  assignTrend.add(assignRes.timings.duration);
  check(assignRes, { 'assign 200': (r) => r.status === 200 });

  // Parse assignment so mark can reference it
  let conditionData = null;
  try {
    const assignments = JSON.parse(assignRes.body);
    if (Array.isArray(assignments) && assignments.length > 0) {
      const a = assignments[0];
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

  // ── Wait for teacher to advance to hint question ─────────────────────────
  sleep(GAME_TIME_S);

  // ── 3. Mark (HintCard render) ────────────────────────────────────────────
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

  // ── 4. Log (hint submitted) ──────────────────────────────────────────────
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
