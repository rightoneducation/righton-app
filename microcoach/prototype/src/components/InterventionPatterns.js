import React, { useMemo } from 'react';
import './InterventionPatterns.css';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const hashString = (str) => {
  // Small deterministic hash for stable UI “mock” analytics.
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const formatPercent = (n) => `${Math.round(n)}%`;

const ARROW = '→';

const LearningGapTrendCard = ({
  gapName,
  beforeCount,
  beforePercent,
  afterCount,
  afterPercent,
  improvementPoints
}) => {
  return (
    <div className="ip-gap-card">
      <div className="ip-gap-left">
        <div className="ip-gap-name">{gapName}</div>
        <div className="ip-gap-meta">
          <span>
            <span className="ip-gap-meta-strong">
              {beforeCount} {ARROW} {afterCount} students
            </span>
            <span className="ip-gap-meta-sep"> | </span>
            <span>
              {formatPercent(beforePercent)} {ARROW} {formatPercent(afterPercent)} class mastery
            </span>
          </span>
        </div>
      </div>

      <div
        className="ip-gap-right"
        aria-label={`Class mastery change: ${Math.round(improvementPoints)} percentage points`}
      >
        <div className="ip-gap-change">
          +{Math.round(improvementPoints)}%
        </div>
        <div className="ip-gap-change-label">class mastery</div>
      </div>
    </div>
  );
};

const normalizeGaps = (item) => {
  // Backward/forward compatible parsing:
  // - Newer items: `gaps: string[]`
  // - Older/buggy items: gaps missing, but `gapGroupTitle` exists
  // - Sometimes a single string sneaks in
  const raw = item?.gaps;
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) return [raw.trim()];
  if (typeof item?.gapGroupTitle === 'string' && item.gapGroupTitle.trim()) {
    return [item.gapGroupTitle.trim()];
  }
  return [];
};

const InterventionPatterns = ({ nextSteps = [] }) => {
  const gapTrends = useMemo(() => {
    // We treat each *learning gap string* surfaced in “Recommended Next Steps” as its own row.
    // Since we don’t have backend assessment data yet, we generate stable, deterministic
    // “before → after” impact numbers based on whether interventions were completed.
    // In the intervention patterns tab we should reflect *completed* next steps only.
    // (Planned items represent intent; completed items represent interventions actually run.)
    const items = (nextSteps || [])
      .filter((x) => x?.status === 'completed')
      .map((x) => ({ ...x, __normalizedGaps: normalizeGaps(x) }))
      .filter((x) => x.__normalizedGaps.length > 0);

    const byGap = new Map();
    items.forEach((item) => {
      item.__normalizedGaps.forEach((g) => {
        const prev = byGap.get(g) || [];
        prev.push(item);
        byGap.set(g, prev);
      });
    });

    const rows = [...byGap.entries()].map(([gapName, records]) => {
      // Simulate a stable class size (until real mastery data is wired in).
      const classSize = 30;

      // Baseline record is the earliest created. It represents the number of students who *do not*
      // yet understand the concept (gap count).
      const baseline = [...records].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))[0];
      const derivedGapCount = (baseline?.studentCount ??
        Math.round((classSize * clamp(baseline?.studentPercent ?? 0, 0, 100)) / 100));
      const beforeCount = clamp(derivedGapCount, 0, classSize);

      const completedCount = records.filter((r) => r.status === 'completed').length;
      const noise = hashString(gapName) % 2; // 0..1 (deterministic)

      // The more completed interventions, the more the gap count shrinks.
      const reduction = clamp(completedCount * 2 + noise, 0, beforeCount);
      const afterCount = clamp(beforeCount - reduction, 0, classSize);

      // Class mastery = % who understand = (classSize - gapCount) / classSize
      const beforePercent = ((classSize - beforeCount) / classSize) * 100;
      const afterPercent = ((classSize - afterCount) / classSize) * 100;
      const improvementPoints = clamp(afterPercent - beforePercent, 0, 100);

      return {
        gapName,
        beforeCount,
        beforePercent,
        afterCount,
        afterPercent,
        improvementPoints,
        // Sort by lowest mastery first (largest need)
        sortKey: beforePercent
      };
    });

    // Show the “biggest needs” first (lowest mastery first).
    rows.sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
    return rows;
  }, [nextSteps]);

  return (
    <div className="intervention-patterns">
      <div className="ip-header">
        <h3 className="ip-title">Trends in Learning Goals</h3>
      </div>

      {gapTrends.length === 0 ? (
        <div className="ip-empty">
          No learning gaps yet — add a few items to <strong>Your Next Steps</strong>.
        </div>
      ) : (
        <div className="ip-trends" aria-label="Trends in learning goals">
          {gapTrends.map((row) => (
            <LearningGapTrendCard key={row.gapName} {...row} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterventionPatterns;
