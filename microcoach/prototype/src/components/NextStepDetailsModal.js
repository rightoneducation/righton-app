import React from 'react';

/**
 * Shared “Full View” modal used by both RecommendedNextSteps and YourNextSteps.
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
  successIndicators,
  move,
  activeTab,
  onChangeTab,
  onClose,
  actions
}) => {
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
        <div className="rns-modal-header">
          <div>
            <div className="rns-modal-title">Full View</div>
            <div className="rns-modal-subtitle">{title}</div>
          </div>

          <button
            className="rns-modal-close"
            onClick={onClose}
            aria-label="Close full view"
          >
            ×
          </button>
        </div>

        <div className="rns-modal-body">
          <div className="full-view-content">
            <div className="gap-group-top">
              <div className="gap-group-title-row">
                <h4 className="gap-group-title">{title}</h4>
              </div>

              <div className="gap-group-meta-row">
                <span className={`students-pill ${getPriorityClass(priority)}`}>
                  {studentCount} students ({studentPercent}%)
                </span>
                {occurrence && <span className="occurrence-pill">{occurrence}</span>}
              </div>

              {misconceptionSummary && (
                <div className="misconception-summary">{misconceptionSummary}</div>
              )}
            </div>

            <div className="full-view-header">
              <div className="full-view-header-content">
                <div className="full-view-header-eyebrow">Recommended Activity</div>
                <h4 className="full-view-header-title">{move?.title}</h4>
                <div className="full-view-header-meta">
                  <span>{move?.time}</span>
                  <span className="meta-sep">|</span>
                  <span>{move?.format}</span>
                </div>
                <p className="full-view-header-subtitle">{move?.summary}</p>
              </div>
            </div>

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
              <button
                className={`tab-button ${activeTab === 'student-groupings' ? 'tab-active' : ''}`}
                onClick={() => onChangeTab?.('student-groupings')}
                role="tab"
                aria-selected={activeTab === 'student-groupings'}
                aria-controls="tab-panel-student-groupings"
                id="tab-student-groupings"
                type="button"
              >
                Student Groupings
              </button>
              <button
                className={`tab-button ${activeTab === 'materials' ? 'tab-active' : ''}`}
                onClick={() => onChangeTab?.('materials')}
                role="tab"
                aria-selected={activeTab === 'materials'}
                aria-controls="tab-panel-materials"
                id="tab-materials"
                type="button"
              >
                Materials
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="tab-panel">
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

                  <div className="tab-section">
                    <h4 className="tab-section-title">Why this matters</h4>
                    <div className="importance-tooltip">
                      <span className="importance-text">{move?.tabs?.overview?.importance}</span>
                    </div>
                  </div>
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
                          {grouping.students.map((student, studentIdx) => (
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

            {actions ? <div className="panel-actions">{actions}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepDetailsModal;
