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
  priority,
  studentCount,
  studentPercent,
  occurrence,
  misconceptionSummary,
  ccssStandards,
  successIndicators,
  move,
  activeTab,
  onChangeTab,
  onClose,
  actions
}) => {
  // State for collapsed CCSS sections
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  if (!isOpen) return null;

  const getPriorityClass = (p) => {
    if (p === 'Critical') return 'priority-critical';
    if (p === 'High') return 'priority-high';
    if (p === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  return (
    <div className="rns-modal-overlay" onClick={onClose}>
      <div className="rns-modal full-view-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="rns-modal-close-button"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          title="Close modal"
        >
          <svg
            className="rns-modal-close-icon"
            viewBox="0 0 20 20"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M6.4 15.4L10 11.8l3.6 3.6c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L11.4 10l3.6-3.6c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L10 8.6 6.4 5c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4L8.6 10 5 13.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0z"
            />
          </svg>
        </button>
        <div className="rns-modal-body">
          <div className="full-view-content">
            <div className="alternative-misconception-card">
              <div className="alternative-top">
                <div className="rns-top-row">
                  <div className="rns-top-left">
                    <div className="alternative-title-row">
                      <h4 className="alternative-title">{title}</h4>
                    </div>
                  </div>

                  <div className="rns-top-right">
                    <div className="rns-top-right-controls">
                      <span className={`students-pill ${getPriorityClass(priority)}`}>
                        {studentCount} students ({studentPercent}%)
                      </span>
                      <button
                        className="rns-collapse-toggle"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCollapsed(!isCollapsed);
                        }}
                        aria-label={isCollapsed ? 'Expand CCSS standards' : 'Collapse CCSS standards'}
                        aria-expanded={!isCollapsed}
                        title={isCollapsed ? 'Expand CCSS standards' : 'Collapse CCSS standards'}
                      >
                        <svg
                          className={`rns-collapse-icon ${isCollapsed ? 'collapsed' : 'expanded'}`}
                          viewBox="0 0 20 20"
                          width="18"
                          height="18"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {misconceptionSummary && (
                  <div className="rns-misconception-text">{misconceptionSummary}</div>
                )}

                {/* Learning objective box spans the full width of the card (under the description). */}
                {ccssStandards?.targetObjective && (
                  <div className="rns-learning-objective-box">
                    <div className="rns-learning-objective-label">Learning objective</div>
                    <div className="rns-learning-objective-row">
                      <span
                        className="alternative-ccss-tag target-objective clickable-standard"
                      >
                        {ccssStandards.targetObjective.standard}
                      </span>
                      <span className="rns-learning-objective-description">
                        {ccssStandards.targetObjective.description}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CCSS Standards Section - Change 1: Add to alternative cards */}
              {ccssStandards && (
                <div className={`alternative-ccss-section ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                  <div className="alternative-ccss-grid">
                    {ccssStandards.prerequisiteGaps && ccssStandards.prerequisiteGaps.length > 0 && (
                      <div className="alternative-ccss-card">
                        <h4 className="alternative-ccss-header">Prerequisite Gaps</h4>
                        <div className="alternative-ccss-gap-list">
                          {ccssStandards.prerequisiteGaps.map((gap, idx) => (
                            <div key={idx} className="alternative-ccss-gap-item">
                              <span 
                                className="alternative-ccss-tag prerequisite-gap clickable-standard"
                              >
                                {gap.standard}
                              </span>
                              <span className="alternative-ccss-description">
                                {gap.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {ccssStandards.impactedObjectives && ccssStandards.impactedObjectives.length > 0 && (
                      <div className="alternative-ccss-card">
                        <h4 className="alternative-ccss-header">Upcoming Skills</h4>
                        <div className="alternative-ccss-gap-list">
                          {ccssStandards.impactedObjectives.map((obj, idx) => (
                            <div key={idx} className="alternative-ccss-gap-item">
                              <span 
                                className="alternative-ccss-tag impacted-objective clickable-standard"
                              >
                                {obj.standard}
                              </span>
                              <span className="alternative-ccss-description">
                                {obj.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                  
                  {/* Display additional fields if they exist */}
                  <div className="rns-activity-option-details">
                    {move.targets && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Targets</span>
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


              {activeTab === 'student-groupings' && (
                <div className="tab-panel">
                  {move?.tabs?.studentGroupings?.groups?.map((grouping, idx) => (
                    <div key={idx} className="grouping-card">
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
                    <div className="high-flyers-card">
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

                  {move?.tabs?.studentGroupings?.aiRecommendation && (
                    <div className="ai-recommendation-card">
                      <h4 className="ai-recommendation-title">AI Recommendation</h4>
                      <p className="ai-recommendation-content">
                        {move?.tabs?.studentGroupings?.aiRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="tab-panel">
                  <div className="materials-section">
                    <h4 className="materials-title">Required Materials</h4>
                    <ul className="materials-list">
                      {move?.tabs?.materials?.required?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {move?.tabs?.materials?.optional?.length > 0 && (
                    <div className="materials-section">
                      <h4 className="materials-title">Optional Materials</h4>
                      <ul className="materials-list">
                        {move?.tabs?.materials?.optional?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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