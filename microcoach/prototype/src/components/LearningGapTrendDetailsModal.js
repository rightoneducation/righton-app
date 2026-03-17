import React from 'react';

/**
 * Drill-down modal for a specific learning gap trend.
 * We intentionally reuse the existing modal overlay styling selectors
 * (rns-modal-overlay / rns-modal) to keep visuals consistent across the app.
 */
const StudentChips = ({ students, accentClass }) => (
  <div className={`ip-modal-chips ${accentClass}`}>
    {students.map((name) => (
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
  studentsImproved = [],
  studentsStillNeedHelp = [],
  studentsNewlySurfaced = [],
  onClose
}) => {

  if (!isOpen) return null;

  const hasStudentData = studentsImproved.length > 0 || studentsStillNeedHelp.length > 0 || studentsNewlySurfaced.length > 0;

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
            {!hasStudentData ? (
              <div className="ip-modal-empty">Student-level breakdown not yet available.</div>
            ) : (
              <>
                {studentsImproved.length > 0 && (
                  <div className="ip-modal-section">
                    <div className="ip-modal-section-header ip-modal-section-improved">
                      <span className="ip-modal-section-title">Students who improved</span>
                      <span className="ip-modal-section-count">{studentsImproved.length}</span>
                    </div>
                    <div className="ip-modal-section-desc">
                      No longer flagged for this learning gap after interventions.
                    </div>
                    <StudentChips students={studentsImproved} accentClass="ip-chips-improved" />
                  </div>
                )}

                {studentsStillNeedHelp.length > 0 && (
                  <div className="ip-modal-section">
                    <div className="ip-modal-section-header ip-modal-section-needhelp">
                      <span className="ip-modal-section-title">Students still needing help</span>
                      <span className="ip-modal-section-count">{studentsStillNeedHelp.length}</span>
                    </div>
                    <div className="ip-modal-section-desc">
                      Students continuing to show evidence of this gap.
                    </div>
                    <StudentChips students={studentsStillNeedHelp} accentClass="ip-chips-needhelp" />
                  </div>
                )}

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
