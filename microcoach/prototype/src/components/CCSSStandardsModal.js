import React from 'react';
import './CCSSStandardsModal.css';

const CCSSStandardsModal = ({ 
  isOpen, 
  onClose, 
  ccssStandards, 
  selectedStandard, 
  onStandardSelect 
}) => {
  if (!isOpen) return null;

  // Get all standards from the three categories
  const allStandards = [
    ...(ccssStandards?.prerequisiteGaps || []),
    ...(ccssStandards?.targetObjective ? [ccssStandards.targetObjective] : []),
    ...(ccssStandards?.impactedObjectives || [])
  ];

  // Default to the first standard if none selected
  const currentSelectedStandard = selectedStandard || allStandards[0];

  const getStandardType = (standard) => {
    if (ccssStandards?.prerequisiteGaps?.some(s => s.standard === standard.standard)) {
      return 'prerequisite-gap';
    }
    if (ccssStandards?.targetObjective?.standard === standard.standard) {
      return 'assessed-standard';
    }
    if (ccssStandards?.impactedObjectives?.some(s => s.standard === standard.standard)) {
      return 'at-risk-standard';
    }
    return 'unknown';
  };

  const getStandardTypeLabel = (type) => {
    switch (type) {
      case 'prerequisite-gap': return 'Prerequisite Gaps';
      case 'assessed-standard': return 'Assessed Standard';
      case 'at-risk-standard': return 'At Risk Standard';
      default: return 'Standard';
    }
  };

  return (
    <div className="ccss-modal-overlay" onClick={onClose}>
      <div className="ccss-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ccss-modal-header">
          <h3 className="ccss-modal-title">Standard Details</h3>
          <button
            className="ccss-modal-close"
            onClick={onClose}
            aria-label="Close standard details"
          >
            ×
          </button>
        </div>

        <div className="ccss-modal-body">
          {/* Knowledge Map Section */}
          <div className="knowledge-map-section">
            <h4 className="knowledge-map-title">Learning Progression</h4>
            
            <div className="knowledge-map">
              {/* Prerequisite Gaps */}
              {ccssStandards?.prerequisiteGaps && ccssStandards.prerequisiteGaps.length > 0 && (
                <div className="map-column">
                  <h5 className="map-column-header prerequisite-header">Prerequisite Gaps</h5>
                  <div className="map-standards">
                    {ccssStandards.prerequisiteGaps.map((standard, idx) => (
                      <button
                        key={idx}
                        className={`map-standard ${getStandardType(standard)} ${currentSelectedStandard.standard === standard.standard ? 'selected' : ''}`}
                        onClick={() => onStandardSelect(standard)}
                      >
                        <span className="standard-code">{standard.standard}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assessed Standard */}
              {ccssStandards?.targetObjective && (
                <div className="map-column">
                  <h5 className="map-column-header assessed-header">Assessed Standard</h5>
                  <div className="map-standards">
                    <button
                      className={`map-standard assessed-standard ${currentSelectedStandard.standard === ccssStandards.targetObjective.standard ? 'selected' : ''}`}
                      onClick={() => onStandardSelect(ccssStandards.targetObjective)}
                    >
                      <span className="standard-code">{ccssStandards.targetObjective.standard}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* At Risk Standards */}
              {ccssStandards?.impactedObjectives && ccssStandards.impactedObjectives.length > 0 && (
                <div className="map-column">
                  <h5 className="map-column-header at-risk-header">At Risk Standards</h5>
                  <div className="map-standards">
                    {ccssStandards.impactedObjectives.map((standard, idx) => (
                      <button
                        key={idx}
                        className={`map-standard ${getStandardType(standard)} ${currentSelectedStandard.standard === standard.standard ? 'selected' : ''}`}
                        onClick={() => onStandardSelect(standard)}
                      >
                        <span className="standard-code">{standard.standard}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Standard Information Section */}
          <div className="standard-info-section">
            <div className="standard-header">
              <h4 className="standard-title">{currentSelectedStandard.description}</h4>
              <div className="standard-meta">
                <span className={`standard-pill ${getStandardType(currentSelectedStandard)}`}>
                  {getStandardTypeLabel(getStandardType(currentSelectedStandard))}
                </span>
                <span className="standard-code-large">{currentSelectedStandard.standard}</span>
              </div>
            </div>

            <div className="standard-details">
              <div className="detail-section">
                <h6 className="detail-title">Why This Standard Matters</h6>
                <p className="detail-content">
                  {getStandardType(currentSelectedStandard) === 'prerequisite-gap' && 
                    "This foundational concept is essential for understanding the current misconception. Without mastery of this prerequisite, students will continue to struggle with more advanced topics."}
                  {getStandardType(currentSelectedStandard) === 'assessed-standard' && 
                    "This is the primary standard being assessed in the current unit. Mastery is critical for student success in this topic area."}
                  {getStandardType(currentSelectedStandard) === 'at-risk-standard' && 
                    "This standard builds directly on the current misconception. If the gap isn't addressed, students will struggle with these future topics."}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCSSStandardsModal;