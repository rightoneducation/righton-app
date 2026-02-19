import React, { useMemo } from 'react';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const hashString = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

/**
 * Drill-down modal for a specific learning gap trend.
 *
 * This is currently UI-driven/mock data (until real student mastery data is available).
 * We intentionally reuse the existing modal overlay styling selectors
 * (rns-modal-overlay / rns-modal) to keep visuals consistent across the app.
 */
const LearningGapTrendDetailsModal = ({
  isOpen,
  gapName,
  beforeCount,
  afterCount,
  improvementPoints,
  onClose
}) => {
  const details = useMemo(() => {
    if (!gapName) return null;

    const studentPool = [
      'Alex J.', 'Brianna M.', 'Carlos S.', 'Diana L.', 'Ethan K.', 'Fiona P.', 'George R.', 'Hannah T.',
      'Isaac W.', 'Julia B.', 'Kevin D.', 'Laura F.', 'Michael C.', 'Natalie G.', 'Oliver H.', 'Patricia N.',
      'Quentin O.', 'Rachel V.', 'Samuel A.', 'Tina E.', 'Victor M.', 'Wendy L.', 'Xavier M.', 'Yvonne N.',
      'Zachary O.', 'Emma L.', 'Jordan P.', 'Sarah K.', 'Mike R.', 'Taylor S.'
    ];

    // Generate deterministic-ish slices so the modal looks consistent per gap.
    const h = hashString(gapName);
    const rotate = h % studentPool.length;
    const rotated = [...studentPool.slice(rotate), ...studentPool.slice(0, rotate)];

    // Interpreting the synthetic trend:
    // - some students improved (gap count shrinks)
    // - some still need help (remaining gap count)
    // - some new to the gap (small churn)
    const improvedCount = clamp(beforeCount - afterCount, 0, beforeCount);
    const stillNeedHelpCount = clamp(afterCount, 0, 30);
    const newToGapCount = clamp((h % 3) - 1, 0, 2); // 0..2

    const improved = rotated.slice(0, improvedCount);
    const stillNeedHelp = rotated.slice(improvedCount, improvedCount + stillNeedHelpCount);
    const newToGap = rotated.slice(improvedCount + stillNeedHelpCount, improvedCount + stillNeedHelpCount + newToGapCount);

    return {
      improved,
      stillNeedHelp,
      newToGap
    };
  }, [gapName, beforeCount, afterCount]);

  if (!isOpen) return null;

  return (
    <div className="rns-modal-overlay" onClick={onClose}>
      <div className="rns-modal ip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rns-modal-header">
          <div>
            <div className="rns-modal-title">Learning gap details</div>
            <div className="rns-modal-subtitle">{gapName}</div>
          </div>

          <button className="rns-modal-close" onClick={onClose} aria-label="Close learning gap details">
            ×
          </button>
        </div>

        <div className="rns-modal-body">
          <div className="ip-modal-summary" aria-label="Trend summary">
            <div className="ip-modal-metric">
              <div className="ip-modal-metric-value">
                {beforeCount} → {afterCount}
              </div>
              <div className="ip-modal-metric-label">students needing support</div>
            </div>
            <div className="ip-modal-metric">
              <div className="ip-modal-metric-value">+{Math.round(improvementPoints)}%</div>
              <div className="ip-modal-metric-label">class mastery</div>
            </div>
          </div>

          <div className="ip-modal-sections">
            <div className="ip-modal-section">
              <h4 className="ip-modal-section-title">Students who improved</h4>
              <p className="ip-modal-section-subtitle">No longer flagged for this learning gap after interventions.</p>
              {details?.improved?.length ? (
                <ul className="ip-student-pills" aria-label="Students who improved">
                  {details.improved.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <div className="ip-modal-empty">No improvements detected yet.</div>
              )}
            </div>

            <div className="ip-modal-section">
              <h4 className="ip-modal-section-title">Students still needing help</h4>
              <p className="ip-modal-section-subtitle">Students continuing to show evidence of this gap.</p>
              {details?.stillNeedHelp?.length ? (
                <ul className="ip-student-pills warning" aria-label="Students still needing help">
                  {details.stillNeedHelp.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <div className="ip-modal-empty">No students currently flagged.</div>
              )}
            </div>

            <div className="ip-modal-section">
              <h4 className="ip-modal-section-title">Newly surfaced</h4>
              <p className="ip-modal-section-subtitle">Students who recently started showing this trend.</p>
              {details?.newToGap?.length ? (
                <ul className="ip-student-pills info" aria-label="Students newly surfaced">
                  {details.newToGap.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <div className="ip-modal-empty">No new students for this gap.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningGapTrendDetailsModal;
