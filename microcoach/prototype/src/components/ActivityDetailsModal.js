import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Activity details modal.
 *
 * Uses the existing RecommendedNextSteps modal styling selectors
 * (`rns-modal-overlay`, `rns-modal`, `rns-modal-header`, etc.)
 * to keep the visual design consistent.
 */
const ActivityDetailsModal = ({
  isOpen,
  gapTitle,
  activity,
  onClose,
  actions
}) => {
  // Match the tabbed Recommended Activity experience from NextStepDetailsModal.
  const [activeTab, setActiveTab] = useState('overview');
  const initialFocusRef = useRef(null);

  // Reset tab when opening a new activity.
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab('overview');
  }, [isOpen, activity?.id]);

  // Basic focus management: focus first tab on open.
  useEffect(() => {
    if (!isOpen) return;
    // Defer to next tick to ensure DOM is painted.
    const t = window.setTimeout(() => initialFocusRef.current?.focus?.(), 0);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const hasTabs = useMemo(() => {
    const tabs = activity?.tabs;
    return !!(
      tabs?.overview ||
      tabs?.activitySteps ||
      tabs?.studentGroupings ||
      tabs?.materials
    );
  }, [activity]);

  // IMPORTANT: keep hooks un-conditional; gate rendering after hooks.
  if (!isOpen) return null;

  return (
    <div className="rns-modal-overlay" onClick={onClose}>
      <div className="rns-modal full-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rns-modal-header">
          <div>
            <div className="rns-modal-title">Activity details</div>
            <div className="rns-modal-subtitle">{gapTitle}</div>
          </div>

          <div className="rns-modal-header-actions">
            {actions}
            <button
              className="rns-modal-close"
              onClick={onClose}
              aria-label="Close activity details"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="rns-modal-body">
          <div className="full-view-content">
            <div className="full-view-header">
              <div className="full-view-header-content">
                <div className="full-view-header-eyebrow">Activity</div>
                <h4 className="full-view-header-title">{activity?.title}</h4>
                <div className="full-view-header-meta">
                  <span>{activity?.time}</span>
                  <span className="meta-sep">|</span>
                  <span>{activity?.format}</span>
                </div>
                <p className="full-view-header-subtitle">{activity?.summary}</p>
              </div>
            </div>

            {hasTabs && (
              <>
                <div className="tab-navigation" role="tablist" aria-label="Activity details tabs">
                  <button
                    ref={initialFocusRef}
                    className={`tab-button ${activeTab === 'overview' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                    role="tab"
                    aria-selected={activeTab === 'overview'}
                    aria-controls="activity-tab-panel-overview"
                    id="activity-tab-overview"
                    type="button"
                  >
                    Overview
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'activity-steps' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('activity-steps')}
                    role="tab"
                    aria-selected={activeTab === 'activity-steps'}
                    aria-controls="activity-tab-panel-activity-steps"
                    id="activity-tab-activity-steps"
                    type="button"
                  >
                    Activity Steps
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'student-groupings' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('student-groupings')}
                    role="tab"
                    aria-selected={activeTab === 'student-groupings'}
                    aria-controls="activity-tab-panel-student-groupings"
                    id="activity-tab-student-groupings"
                    type="button"
                  >
                    Student Groupings
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'materials' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('materials')}
                    role="tab"
                    aria-selected={activeTab === 'materials'}
                    aria-controls="activity-tab-panel-materials"
                    id="activity-tab-materials"
                    type="button"
                  >
                    Materials
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'overview' && (
                    <div className="tab-panel" id="activity-tab-panel-overview" role="tabpanel" aria-labelledby="activity-tab-overview">
                      <div className="tab-section">
                        <h4 className="tab-section-title">What will students do</h4>
                        <p className="tab-section-content">{activity?.tabs?.overview?.whatStudentsDo || '—'}</p>
                      </div>

                      <div className="tab-section">
                        <h4 className="tab-section-title">What you'll do</h4>
                        <p className="tab-section-content">{activity?.tabs?.overview?.whatYouDo || '—'}</p>
                      </div>

                      <div className="tab-section">
                        <h4 className="tab-section-title">Why this matters</h4>
                        <div className="importance-tooltip">
                          <span className="importance-text">{activity?.tabs?.overview?.importance || '—'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity-steps' && (
                    <div className="tab-panel" id="activity-tab-panel-activity-steps" role="tabpanel" aria-labelledby="activity-tab-activity-steps">
                      <div className="tab-section">
                        <h4 className="tab-section-title">Setup</h4>
                        {activity?.tabs?.activitySteps?.setup?.length ? (
                          <ul className="tab-list">
                            {activity.tabs.activitySteps.setup.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="tab-section-content">—</p>
                        )}
                      </div>

                      <div className="tab-section">
                        <h4 className="tab-section-title">Problem</h4>
                        <p className="tab-section-content">{activity?.tabs?.activitySteps?.problem || '—'}</p>
                      </div>

                      <div className="tab-section">
                        <h4 className="tab-section-title">Core Activity</h4>
                        {activity?.tabs?.activitySteps?.coreActivity?.length ? (
                          <ol className="tab-list">
                            {activity.tabs.activitySteps.coreActivity.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ol>
                        ) : (
                          <p className="tab-section-content">—</p>
                        )}
                      </div>

                      <div className="tab-section">
                        <h4 className="tab-section-title">Discussion Questions</h4>
                        {activity?.tabs?.activitySteps?.discussionQuestions?.length ? (
                          <ul className="discussion-questions">
                            {activity.tabs.activitySteps.discussionQuestions.map((q, idx) => (
                              <li key={idx}>
                                <strong>Q{idx + 1}:</strong> {q}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="tab-section-content">—</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'student-groupings' && (
                    <div className="tab-panel" id="activity-tab-panel-student-groupings" role="tabpanel" aria-labelledby="activity-tab-student-groupings">
                      {activity?.tabs?.studentGroupings?.groups?.length ? (
                        activity.tabs.studentGroupings.groups.map((g, idx) => (
                          <div key={idx} className="grouping-card">
                            <div className="grouping-header">
                              <h4 className="grouping-title">{g.name}</h4>
                              <p className="grouping-description">{g.description}</p>
                            </div>
                            <div className="grouping-students">
                              <h5 className="grouping-subtitle">Students:</h5>
                              <ul className="student-list">
                                {(g.students || []).map((s) => (
                                  <li key={s}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="tab-section">
                          <h4 className="tab-section-title">Student Groupings</h4>
                          <p className="tab-section-content">—</p>
                        </div>
                      )}

                      {activity?.tabs?.studentGroupings?.highFlyers && (
                        <div className="high-flyers-card">
                          <div className="high-flyers-header">
                            <h4 className="high-flyers-title">High Flyers</h4>
                            <p className="high-flyers-description">{activity.tabs.studentGroupings.highFlyers.description}</p>
                          </div>
                          <div className="high-flyers-students">
                            <h5 className="high-flyers-subtitle">Students:</h5>
                            <ul className="student-list">
                              {(activity.tabs.studentGroupings.highFlyers.students || []).map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {activity?.tabs?.studentGroupings?.aiRecommendation && (
                        <div className="ai-recommendation-card">
                          <h4 className="ai-recommendation-title">AI Recommendation</h4>
                          <p className="ai-recommendation-content">{activity.tabs.studentGroupings.aiRecommendation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="tab-panel" id="activity-tab-panel-materials" role="tabpanel" aria-labelledby="activity-tab-materials">
                      <div className="materials-section">
                        <h4 className="materials-title">Required Materials</h4>
                        {activity?.tabs?.materials?.required?.length ? (
                          <ul className="materials-list">
                            {activity.tabs.materials.required.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="tab-section-content">—</div>
                        )}
                      </div>

                      {activity?.tabs?.materials?.optional?.length ? (
                        <div className="materials-section">
                          <h4 className="materials-title">Optional Materials</h4>
                          <ul className="materials-list">
                            {activity.tabs.materials.optional.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Actions rendered in the header (top-right) to match desired UX. */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
