import React from 'react';

/**
 * Shared "Full View" modal used by both RecommendedNextSteps and YourNextSteps.
 *
 * Notes:
 * - This intentionally reuses the existing CSS selectors from RecommendedNextSteps.css
 *   (rns-modal-overlay, rns-modal, full-view-modal, etc.) to keep visuals consistent.
 */
const NextStepDetailsModal = ({
  isOpen,
  title,
  misconceptionSummary,
  ccssStandards,
  successIndicators,
  move,
  activeTab,
  onChangeTab,
  onClose,
  actions
}) => {
  if (!isOpen) return null;

  return (
    <div className="rns-modal-overlay" onClick={onClose}>
      <div className="rns-modal full-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rns-modal-body">
          <div className="full-view-content">
            <div className="nsdm-header">
              <h4 className="nsdm-title">{title}</h4>
              <button
                className="evidence-journey-close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {misconceptionSummary && (
              <div className="rns-misconception-text">{misconceptionSummary}</div>
            )}

            {/* Activity Card Header - Always visible above tabs */}
            {move && (
              <div className="activity-card-header">
                <div className="rns-activity-option" style={{ backgroundColor: '#F3F9FD', border: '1px solid #e5e5e5' }}>
                  <div className="rns-activity-option-title-row">
                    <div className="rns-activity-option-title">{move.title}</div>
                  </div>
                  <div className="rns-activity-option-meta">
                    <span>{move.time}</span>
                    <span className="meta-sep">|</span>
                    <span>{move.format}</span>
                  </div>

                  <div className="rns-activity-option-details">
                    {move.targets && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Targets</span>
                        <div className="nsdm-targets-meta">
                          {ccssStandards?.targetObjective?.standard && (
                            <span className="ccss-tag target-objective">
                              {ccssStandards.targetObjective.standard}
                            </span>
                          )}
                          {title && (
                            <span className="nsdm-misconception-label">{title}</span>
                          )}
                        </div>
                        <span className="rns-activity-option-field-value">{move.targets}</span>
                      </div>
                    )}

                    {move.instructionalMove && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Instructional Move</span>
                        <span className="rns-activity-option-field-value">{move.instructionalMove}</span>
                      </div>
                    )}

                    {move.strategyTag && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Strategy Tag</span>
                        <span className="rns-activity-option-field-value">{move.strategyTag}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="tab-navigation" role="tablist">
              <button
                className={`tab-button ${activeTab === 'overview' ? 'tab-active' : ''}`}
                onClick={() => onChangeTab?.('overview')}
                role="tab"
                aria-selected={activeTab === 'overview'}
                aria-controls="tab-panel-overview"
                id="tab-overview"
                type="button"
              >
                Overview
              </button>
              <button
                className={`tab-button ${activeTab === 'activity-steps' ? 'tab-active' : ''}`}
                onClick={() => onChangeTab?.('activity-steps')}
                role="tab"
                aria-selected={activeTab === 'activity-steps'}
                aria-controls="tab-panel-activity-steps"
                id="tab-activity-steps"
                type="button"
              >
                Activity Steps
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="tab-panel">
                  <div className="tab-section">
                    <h4 className="tab-section-title">STUDENT GROUPINGS</h4>
                    <div className="student-groupings-card">
                      {move?.tabs?.studentGroupings?.aiRecommendation && (
                        <div className="ai-recommendation-card blue-background">
                          <h4 className="ai-recommendation-title">Recommendation</h4>
                          <p className="ai-recommendation-content">
                            {move?.tabs?.studentGroupings?.aiRecommendation}
                          </p>
                        </div>
                      )}

                      {move?.tabs?.studentGroupings?.groups?.map((grouping, idx) => (
                        <div key={idx} className="grouping-card" style={{ marginTop: '16px' }}>
                          <div className="grouping-header">
                            <h4 className="grouping-title">{grouping.name}</h4>
                            <p className="grouping-description">{grouping.description}</p>
                          </div>
                          <div className="grouping-students">
                            <h5 className="grouping-subtitle">Students:</h5>
                            <ul className="student-list">
                              {grouping.students?.map((student, studentIdx) => (
                                <li key={studentIdx}>{student}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}

                      {move?.tabs?.studentGroupings?.highFlyers && (
                        <div className="high-flyers-card" style={{ marginTop: '16px' }}>
                          <div className="high-flyers-header">
                            <h4 className="high-flyers-title">High Flyers</h4>
                            <p className="high-flyers-description">
                              {move?.tabs?.studentGroupings?.highFlyers?.description}
                            </p>
                          </div>
                          <div className="high-flyers-students">
                            <h5 className="high-flyers-subtitle">Students:</h5>
                            <ul className="student-list">
                              {move?.tabs?.studentGroupings?.highFlyers?.students?.map((student, idx) => (
                                <li key={idx}>{student}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">What will students do</h4>
                    <p className="tab-section-content">{move?.tabs?.overview?.whatStudentsDo}</p>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">What you'll do</h4>
                    <p className="tab-section-content">{move?.tabs?.overview?.whatYouDo}</p>
                  </div>

                  {successIndicators && (
                    <div className="tab-section">
                      <h4 className="tab-section-title">Success indicators</h4>
                      <ul className="success-list">
                        {successIndicators.map((indicator, idx) => (
                          <li key={idx}>{indicator}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity-steps' && (
                <div className="tab-panel">
                  <div className="tab-section">
                    <h4 className="tab-section-title">Setup</h4>
                    <ul className="tab-list">
                      {move?.tabs?.activitySteps?.setup?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">Problem</h4>
                    <p className="tab-section-content">{move?.tabs?.activitySteps?.problem}</p>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">Core Activity</h4>
                    <ol className="tab-list">
                      {move?.tabs?.activitySteps?.coreActivity?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">Discussion Questions</h4>
                    <ul className="discussion-questions">
                      {move?.tabs?.activitySteps?.discussionQuestions?.map((question, idx) => (
                        <li key={idx}>
                          <strong>Q{idx + 1}:</strong> {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {actions ? <div className="panel-actions sticky-actions">{actions}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepDetailsModal;
