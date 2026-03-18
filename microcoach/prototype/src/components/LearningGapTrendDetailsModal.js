import React from 'react';

/**
 * Drill-down modal for a specific learning gap trend.
 * We intentionally reuse the existing modal overlay styling selectors
 * (rns-modal-overlay / rns-modal) to keep visuals consistent across the app.
 */

/** Convert "Last, First M." → "First M. Last". Passes through names already in First Last format. */
function formatName(name) {
  if (!name || !name.includes(',')) return name;
  const comma = name.indexOf(',');
  const last = name.slice(0, comma).trim();
  const first = name.slice(comma + 1).trim();
  return `${first} ${last}`;
}

/** Sort names by first name, then last name. Input may be either "Last, First" or "First Last". */
function sortByFirstName(names) {
  return [...names].map(formatName).sort((a, b) => a.localeCompare(b));
}

const StudentChips = ({ students, accentClass }) => (
  <div className={`ip-modal-chips ${accentClass}`}>
    {sortByFirstName(students).map((name) => (
      <span key={name} className="ip-modal-chip">{name}</span>
    ))}
  </div>
);

const LearningGapTrendDetailsModal = ({
  isOpen,
  gapName,
  beforeCount,
  afterCount,
  improvementPoints,
  classMasteryBefore,
  classMasteryAfter,
  studentsImproved = [],
  studentsStillNeedHelp = [],
  studentsNewlySurfaced = [],
  onClose
}) => {

  if (!isOpen) return null;

  // Derive mastery counts from mastery percentages + needing-help counts.
  // comparable = total students who took both assessments.
  // masteryCount = comparable - needingHelp
  let masteryBefore = null;
  let masteryAfter = null;
  if (classMasteryBefore != null && classMasteryAfter != null) {
    const pctBefore = classMasteryBefore / 100;
    const pctAfter = classMasteryAfter / 100;
    const comparable = pctBefore < 1
      ? Math.round(beforeCount / (1 - pctBefore))
      : beforeCount; // everyone was mastering before — comparable = beforeCount (edge case)
    masteryBefore = comparable - beforeCount;
    masteryAfter = comparable - afterCount;
  }

  const hasMasteryData = masteryBefore != null && masteryAfter != null;
  const hasStudentData = studentsImproved.length > 0 || studentsStillNeedHelp.length > 0 || studentsNewlySurfaced.length > 0;

  return (
    <div className="rns-modal-overlay" onClick={onClose}>
      <div className="rns-modal ip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rns-modal-header">
          <div>
            <div className="rns-modal-title">Class Progress</div>
            <div className="rns-modal-subtitle">{gapName}</div>
          </div>

          <button className="rns-modal-close" onClick={onClose} aria-label="Close class progress details">
            ×
          </button>
        </div>

        <div className="rns-modal-body">
          <div className="ip-modal-summary" aria-label="Trend summary">
            <div className="ip-modal-metric ip-modal-metric-full">
              <div className="ip-modal-metric-headline">
                <span className="ip-modal-metric-value">
                  {hasMasteryData ? `${masteryBefore} → ${masteryAfter}` : `${beforeCount} → ${afterCount}`}
                </span>
                <span className="ip-modal-metric-label">
                  {hasMasteryData ? 'Students demonstrating mastery' : 'Students needing support'}
                </span>
              </div>
              {hasMasteryData && (
                <div className="ip-modal-metric-secondary">
                  {classMasteryBefore}% → {classMasteryAfter}% Class mastery improvement
                </div>
              )}
            </div>
          </div>

          <div className="ip-modal-sections">
            {!hasStudentData ? (
              <div className="ip-modal-empty">Student-level breakdown not yet available.</div>
            ) : (
              <>
                <div className="ip-modal-section">
                  <div className="ip-modal-section-header ip-modal-section-improved">
                    <span className="ip-modal-section-title">Students who improved</span>
                    <span className={`ip-modal-section-count${studentsImproved.length === 0 ? ' ip-modal-section-count-zero' : ''}`}>
                      {studentsImproved.length}
                    </span>
                  </div>
                  <div className="ip-modal-section-desc">
                    {studentsImproved.length === 0
                      ? 'No students have improved on this standard yet.'
                      : 'These students have improved on this standard.'}
                  </div>
                  {studentsImproved.length > 0 && (
                    <StudentChips students={studentsImproved} accentClass="ip-chips-improved" />
                  )}
                </div>

                <div className="ip-modal-section">
                  <div className="ip-modal-section-header ip-modal-section-needhelp">
                    <span className="ip-modal-section-title">Students to support next</span>
                    <span className={`ip-modal-section-count${studentsStillNeedHelp.length === 0 ? ' ip-modal-section-count-zero' : ''}`}>
                      {studentsStillNeedHelp.length}
                    </span>
                  </div>
                  <div className="ip-modal-section-desc">
                    {studentsStillNeedHelp.length === 0
                      ? 'All students have mastered this standard — great work!'
                      : 'These students are still developing mastery of this standard.'}
                  </div>
                  {studentsStillNeedHelp.length > 0 && (
                    <StudentChips students={studentsStillNeedHelp} accentClass="ip-chips-needhelp" />
                  )}
                </div>

                {studentsNewlySurfaced.length > 0 && (
                  <div className="ip-modal-section">
                    <div className="ip-modal-section-header ip-modal-section-newsurfaced">
                      <span className="ip-modal-section-title">Newly surfaced</span>
                      <span className="ip-modal-section-count">{studentsNewlySurfaced.length}</span>
                    </div>
                    <div className="ip-modal-section-desc">
                      Students who recently started showing this trend.
                    </div>
                    <StudentChips students={studentsNewlySurfaced} accentClass="ip-chips-newsurfaced" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningGapTrendDetailsModal;
