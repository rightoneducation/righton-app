import React from 'react';

/**
 * Drill-down modal for a specific learning gap trend.
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
            <div className="ip-modal-empty">Student-level breakdown not yet available.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningGapTrendDetailsModal;
