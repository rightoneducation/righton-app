import React, { useEffect, useMemo, useRef, useState } from 'react';
import './RecommendedNextSteps.css';

const RecommendedNextSteps = ({ onAddNextStep, existingNextSteps = [], gapGroups: gapGroupsProp }) => {
  const [gapGroups, setGapGroups] = useState(gapGroupsProp ?? []);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const [reasoningGroupId, setReasoningGroupId] = useState(null);
  const [fullViewGroupId, setFullViewGroupId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [evidenceScreen, setEvidenceScreen] = useState(1);
  const [cameFromFullView, setCameFromFullView] = useState(false);

  const existingIndex = useMemo(() => {
    // Used only for subtle UI cues (do we already have something saved for this gap group?)
    const set = new Set(existingNextSteps.map((x) => `${x.gapGroupId}:${x.moveId}`));
    return set;
  }, [existingNextSteps]);

  const getPriorityClass = (priority) => {
    if (priority === 'Critical') return 'priority-critical';
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  useEffect(() => {
    if (gapGroupsProp) setGapGroups(gapGroupsProp);
  }, [gapGroupsProp]);

  useEffect(() => {
    return () => {
      const timeoutId = toastTimeoutRef.current;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);


  const handleAdd = (group) => {
    const move = group.move;
    if (!move) return;

    if (existingIndex.has(`${group.id}:${move.id}`)) {
      setToast('Already in "Your Next Steps"');
      // Trigger animation for existing toast
      const toastElement = document.querySelector('.rns-toast');
      if (toastElement) {
        toastElement.classList.add('show');
        setTimeout(() => {
          toastElement.classList.add('removing');
          setTimeout(() => setToast(null), 300);
        }, 1400);
      } else {
        window.setTimeout(() => setToast(null), 1400);
      }
      return;
    }

    onAddNextStep?.(group, move);
    setToast('Added to "Your Next Steps"');
    
    // Remove the added group from the list and promote the next most critical one
    setGapGroups(prevGroups => {
      // Filter out the group that was just added
      const filteredGroups = prevGroups.filter(g => g.id !== group.id);
      
      // If there are remaining groups, the next one becomes the new main misconception
      // If no groups remain, keep the current state (empty)
      return filteredGroups;
    });
    
    // Trigger animation for new toast
    setTimeout(() => {
      const toastElement = document.querySelector('.rns-toast');
      if (toastElement) {
        toastElement.classList.add('show');
        setTimeout(() => {
          toastElement.classList.add('removing');
          setTimeout(() => setToast(null), 300);
        }, 2000);
      }
    }, 50);
  };

  const reasoningGroup = useMemo(() => {
    if (!reasoningGroupId) return null;
    return gapGroups.find((g) => g.id === reasoningGroupId) ?? null;
  }, [gapGroups, reasoningGroupId]);

  const mainMisconception = gapGroups[0];
  const alternativeMisconceptions = gapGroups.slice(1);

  return (
    <div className="recommended-next-steps">
      {reasoningGroup && (
        <div className="rns-modal-overlay" onClick={() => setReasoningGroupId(null)}>
          <div className="rns-modal evidence-journey-modal" onClick={(e) => e.stopPropagation()}>
            <div className="evidence-journey-header">
              <div className="evidence-journey-title-section">
                <h3 className="evidence-journey-title">{reasoningGroup.title}</h3>
                <p className="evidence-journey-subtitle">Evidence Journey</p>
              </div>
              
              <div className="evidence-journey-progress">
                <div className="progress-steps">
                  <div className={`progress-step ${evidenceScreen >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">What Happened</span>
                  </div>
                  <div className="progress-line"></div>
                  <div className={`progress-step ${evidenceScreen >= 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Where & How</span>
                  </div>
                  <div className="progress-line"></div>
                  <div className={`progress-step ${evidenceScreen >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Why It Matters</span>
                  </div>
                </div>
              </div>

              <button
                className="evidence-journey-close"
                onClick={() => setReasoningGroupId(null)}
                aria-label="Close evidence journey"
              >
                ×
              </button>
            </div>

            <div className="evidence-journey-body">
              {evidenceScreen === 1 && (
                <div className="evidence-screen screen-1">
                  <div className="screen-header">
                    <h4 className="screen-title">What Happened</h4>
                    <p className="screen-subtitle">Data visualization and analysis</p>
                  </div>

                  <div className="screen-content">
                    {(() => {
                      const flaggedQs = new Set(
                        (reasoningGroup.evidence?.source || '')
                          .match(/Q(\d+)/gi)
                          ?.map((q) => q.toUpperCase()) ?? []
                      );
                      const bars = reasoningGroup.questionErrorRates ?? [];
                      return (
                        <div className="data-visualization">
                          <div className="chart-container">
                            <h5 className="chart-title">Error Rate by Question</h5>
                            <div className="chart-placeholder">
                              {bars.map((q) => (
                                <div
                                  key={q.label}
                                  className={`chart-bar${flaggedQs.has(q.label.toUpperCase()) ? ' chart-bar-flagged' : ''}`}
                                  style={{ height: `${q.errorRate}%` }}
                                  title={`${q.label}: ${q.errorRate}% error rate`}
                                />
                              ))}
                            </div>
                            <div className="chart-labels">
                              {bars.map((q) => (
                                <span key={q.label} className={flaggedQs.has(q.label.toUpperCase()) ? 'chart-label-flagged' : ''}>
                                  {q.label}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="chart-stats">
                            <div className="stat-item">
                              <span className="stat-label">Students Affected</span>
                              <span className="stat-value">{reasoningGroup.studentCount} ({reasoningGroup.studentPercent}%)</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Questions Flagged</span>
                              <span className="stat-value">{reasoningGroup.evidence?.source || '—'}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Occurrence</span>
                              <span className="stat-value">{reasoningGroup.occurrence || '—'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="misconception-description">
                      <h5>Misconception</h5>
                      <p>{reasoningGroup.misconceptionSummary}</p>
                    </div>

                    {reasoningGroup.evidence?.aiThinkingPattern && (
                      <div className="thinking-pattern">
                        <h5>AI Thinking Pattern</h5>
                        <p>{reasoningGroup.evidence.aiThinkingPattern}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {evidenceScreen === 2 && (
                <div className="evidence-screen screen-2">
                  <div className="screen-header">
                    <h4 className="screen-title">Where & How</h4>
                    <p className="screen-subtitle">Work samples and breakdown</p>
                  </div>

                  <div className="screen-content">
                    {reasoningGroup.evidence?.mostCommonError && (
                      <div className="most-common-error">
                        <h5>Most Common Error</h5>
                        <p>{reasoningGroup.evidence.mostCommonError}</p>
                      </div>
                    )}

                    <div className="work-samples">
                      <h5>Student Work Samples</h5>
                      {reasoningGroup.evidence?.sampleStudentWork?.length > 0 ? (
                        <div className="sample-list">
                          {reasoningGroup.evidence.sampleStudentWork.map((sample, idx) => (
                            <div className="sample-item" key={idx}>
                              <h6>Sample {idx + 1}</h6>
                              <div className="sample-content">
                                <p>{sample}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-samples">No sample work recorded.</p>
                      )}
                    </div>

                    {reasoningGroup.evidence?.aiThinkingPattern && (
                      <div className="ai-analysis">
                        <h5>AI Analysis</h5>
                        <p>{reasoningGroup.evidence.aiThinkingPattern}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {evidenceScreen === 3 && (
                <div className="evidence-screen screen-3">
                  <div className="screen-header">
                    <h4 className="screen-title">Why It Matters</h4>
                    <p className="screen-subtitle">Impact and consequences</p>
                  </div>

                  <div className="screen-content">
                    {reasoningGroup.move?.tabs?.overview?.importance && (
                      <div className="why-matters">
                        <h5>Why This Matters</h5>
                        <p>{reasoningGroup.move.tabs.overview.importance}</p>
                      </div>
                    )}

                    {reasoningGroup.move?.aiReasoning && (
                      <div className="ai-reasoning">
                        <h5>AI Reasoning for Intervention</h5>
                        <p>{reasoningGroup.move.aiReasoning}</p>
                      </div>
                    )}

                    {reasoningGroup.successIndicators?.length > 0 && (
                      <div className="success-indicators">
                        <h5>Success Indicators</h5>
                        <ul className="success-checklist">
                          {reasoningGroup.successIndicators.map((indicator, idx) => (
                            <li key={idx} className="success-indicator-item">{indicator}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reasoningGroup.ccssStandards?.targetObjective?.standard && (
                      <div className="target-standard">
                        <h5>Target Standard</h5>
                        <div className="target-standard-row">
                          <span className="ccss-tag target-objective">{reasoningGroup.ccssStandards.targetObjective.standard}</span>
                          {reasoningGroup.ccssStandards.targetObjective.description && (
                            <span className="standard-description">{reasoningGroup.ccssStandards.targetObjective.description}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="evidence-journey-footer">
              <div className="navigation-controls">
                {evidenceScreen === 1 ? (
                  <button
                    className="back-btn"
                    onClick={() => {
                      setReasoningGroupId(null);
                      if (cameFromFullView) {
                        setFullViewGroupId(reasoningGroup.id);
                      }
                    }}
                  >
                    ← Back
                  </button>
                ) : (
                  <button
                    className="nav-btn prev-btn"
                    onClick={() => setEvidenceScreen(Math.max(1, evidenceScreen - 1))}
                    disabled={evidenceScreen === 1}
                  >
                    ← What Happened
                  </button>
                )}
                
                <button
                  className="nav-btn next-btn"
                  onClick={() => setEvidenceScreen(Math.min(3, evidenceScreen + 1))}
                  disabled={evidenceScreen === 3}
                >
                  {evidenceScreen === 1 ? 'Where & How →' : 'Why It Matters →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {fullViewGroupId && (
        <div className="rns-modal-overlay" onClick={() => setFullViewGroupId(null)}>
          <div className="rns-modal full-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rns-modal-header">
              <div>
                <div className="rns-modal-title">Full View</div>
                <div className="rns-modal-subtitle">{gapGroups.find(g => g.id === fullViewGroupId)?.title}</div>
              </div>

              <button
                className="rns-modal-close"
                onClick={() => setFullViewGroupId(null)}
                aria-label="Close full view"
              >
                ×
              </button>
            </div>

            <div className="rns-modal-body">
              {(() => {
                const group = gapGroups.find(g => g.id === fullViewGroupId);
                if (!group) return null;

                return (
                  <div className="full-view-content">
                    <div className="gap-group-top">
                      <div className="gap-group-title-row">
                        <h4 className="gap-group-title">{group.title}</h4>
                      </div>

                      <div className="gap-group-meta-row">
                        <span className={`students-pill ${getPriorityClass(group.priority)}`}>
                          {group.studentCount} students ({group.studentPercent}%)
                        </span>
                    {group.occurrence && <span className="occurrence-pill">{group.occurrence}</span>}
                      </div>

                      {group.misconceptionSummary && (
                        <div className="misconception-summary">
                          {group.misconceptionSummary}
                        </div>
                      )}

                      {/* CCSS Standards Section for Full View Modal */}
                      {group.ccssStandards && (
                        <div className="ccss-standards-section">
                          <div className="ccss-standards-grid">
                            <div className="ccss-card">
                              <h4 className="tab-section-title">Students are struggling with...</h4>
                              <div className="ccss-content">
                                <span className="ccss-tag target-objective">
                                  {group.ccssStandards.targetObjective.standard}
                                </span>
                                <span className="ccss-description">
                                  {group.ccssStandards.targetObjective.description}
                                </span>
                              </div>
                            </div>
                            
                            {group.ccssStandards.prerequisiteGaps && group.ccssStandards.prerequisiteGaps.length > 0 && (
                              <div className="ccss-card">
                                <h4 className="tab-section-title">The underlying issue may be...</h4>
                                <div className="ccss-content">
                                  {group.ccssStandards.prerequisiteGaps.map((gap, idx) => (
                                    <div key={idx} className="ccss-gap-item">
                                      <span className="ccss-tag prerequisite-gap">
                                        {gap.standard}
                                      </span>
                                      <span className="ccss-description">
                                        {gap.description}
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

                    {/* Header section for full view - Change 1 */}
                    <div className="full-view-header">
                      <div className="full-view-header-content">
                        <div className="full-view-header-eyebrow">Recommended Activity</div>
                        <h4 className="full-view-header-title">{group.move?.title}</h4>
                        <div className="full-view-header-meta">
                          <span>{group.move?.time}</span>
                          <span className="meta-sep">|</span>
                          <span>{group.move?.format}</span>
                        </div>
                        <p className="full-view-header-subtitle">{group.move?.summary}</p>
                      </div>
                    </div>

                    {/* Tab Navigation for Full View */}
                    <div className="tab-navigation" role="tablist">
                      <button
                        className={`tab-button ${activeTab === 'overview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                        role="tab"
                        aria-selected={activeTab === 'overview'}
                        aria-controls="tab-panel-overview"
                        id="tab-overview"
                      >
                        Overview
                      </button>
                      <button
                        className={`tab-button ${activeTab === 'activity-steps' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('activity-steps')}
                        role="tab"
                        aria-selected={activeTab === 'activity-steps'}
                        aria-controls="tab-panel-activity-steps"
                        id="tab-activity-steps"
                      >
                        Activity Steps
                      </button>
                      <button
                        className={`tab-button ${activeTab === 'student-groupings' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('student-groupings')}
                        role="tab"
                        aria-selected={activeTab === 'student-groupings'}
                        aria-controls="tab-panel-student-groupings"
                        id="tab-student-groupings"
                      >
                        Student Groupings
                      </button>
                      <button
                        className={`tab-button ${activeTab === 'materials' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('materials')}
                        role="tab"
                        aria-selected={activeTab === 'materials'}
                        aria-controls="tab-panel-materials"
                        id="tab-materials"
                      >
                        Materials
                      </button>
                    </div>

                    {/* Tab Content for Full View */}
                    <div className="tab-content">
                      {activeTab === 'overview' && (
                        <div className="tab-panel">
                          <div className="tab-section">
                            <h4 className="tab-section-title">What will students do</h4>
                            <p className="tab-section-content">{group.move?.tabs?.overview?.whatStudentsDo}</p>
                          </div>
                          
                          <div className="tab-section">
                            <h4 className="tab-section-title">What you'll do</h4>
                            <p className="tab-section-content">{group.move?.tabs?.overview?.whatYouDo}</p>
                          </div>

                          {group.successIndicators && (
                            <div className="tab-section">
                              <h4 className="tab-section-title">Success indicators</h4>
                              <ul className="success-list">
                                {group.successIndicators.map((indicator, idx) => (
                                  <li key={idx}>{indicator}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="tab-section">
                            <h4 className="tab-section-title">Why this matters</h4>
                            <div className="importance-tooltip">
                              <span className="importance-text">{group.move?.tabs?.overview?.importance}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'activity-steps' && (
                        <div className="tab-panel">
                          <div className="tab-section">
                            <h4 className="tab-section-title">Setup</h4>
                            <ul className="tab-list">
                              {group.move?.tabs?.activitySteps?.setup?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="tab-section">
                            <h4 className="tab-section-title">Problem</h4>
                            <p className="tab-section-content">{group.move?.tabs?.activitySteps?.problem}</p>
                          </div>

                          <div className="tab-section">
                            <h4 className="tab-section-title">Core Activity</h4>
                            <ol className="tab-list">
                              {group.move?.tabs?.activitySteps?.coreActivity?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="tab-section">
                            <h4 className="tab-section-title">Discussion Questions</h4>
                            <ul className="discussion-questions">
                              {group.move?.tabs?.activitySteps?.discussionQuestions?.map((question, idx) => (
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
                          {group.move?.tabs?.studentGroupings?.groups?.map((grouping, idx) => (
                            <div key={idx} className="grouping-card">
                              <div className="grouping-header">
                                <h4 className="grouping-title">{grouping.name}</h4>
                                <p className="grouping-description">{grouping.description}</p>
                              </div>
                              {grouping.students?.length > 0 && (
                                <div className="grouping-students">
                                  <h5 className="grouping-subtitle">Students:</h5>
                                  <ul className="student-list">
                                    {grouping.students.map((student, studentIdx) => (
                                      <li key={studentIdx}>{student}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}

                          {group.move?.tabs?.studentGroupings?.highFlyers && (
                            <div className="high-flyers-card">
                              <div className="high-flyers-header">
                                <h4 className="high-flyers-title">High Flyers</h4>
                                <p className="high-flyers-description">
                                  {group.move?.tabs?.studentGroupings?.highFlyers?.description}
                                </p>
                              </div>
                              <div className="high-flyers-students">
                                <h5 className="high-flyers-subtitle">Students:</h5>
                                <ul className="student-list">
                                  {group.move?.tabs?.studentGroupings?.highFlyers?.students?.map((student, idx) => (
                                    <li key={idx}>{student}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {group.move?.tabs?.studentGroupings?.aiRecommendation && (
                            <div className="ai-recommendation-card">
                              <h4 className="ai-recommendation-title">AI Recommendation</h4>
                              <p className="ai-recommendation-content">
                                {group.move?.tabs?.studentGroupings?.aiRecommendation}
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
                              {group.move?.tabs?.materials?.required?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          {group.move?.tabs?.materials?.optional?.length > 0 && (
                            <div className="materials-section">
                              <h4 className="materials-title">Optional Materials</h4>
                              <ul className="materials-list">
                                {group.move?.tabs?.materials?.optional?.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions for Full View */}
                    <div className="panel-actions">
                      <button
                        className="reasoning-btn"
                        onClick={() => {
                          setFullViewGroupId(null);
                          setCameFromFullView(true);
                          setReasoningGroupId(group.id);
                        }}
                      >
                        View Reasoning
                      </button>
                      <button className="add-btn" onClick={() => {
                        setFullViewGroupId(null);
                        handleAdd(group);
                      }}>
                        Add to Saved Next Steps
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}


      <div className="rns-header">
        <div>
          <h3 className="rns-title">Recommended Next Steps</h3>
          <p className="rns-subtitle">
            AI-surfaced learning gap groups and 4 instructional moves you can choose from.
          </p>
        </div>
      </div>

      {toast && <div className="rns-toast" role="status">{toast}</div>}

      <div className="rns-groups">
        {/* Main (Critical) Misconception */}
        {mainMisconception && (
          <div 
            key={mainMisconception.id} 
            className="gap-group-card main-misconception clickable-card"
            onClick={() => setFullViewGroupId(mainMisconception.id)}
            role="button"
            tabIndex={0}
            aria-label={`View full details for ${mainMisconception.title}`}
          >
            <div className="gap-group-top">
              <div className="gap-group-title-row">
                <h4 className="gap-group-title">{mainMisconception.title}</h4>
              </div>

              <div className="gap-group-meta-row">
                <span className={`students-pill ${getPriorityClass(mainMisconception.priority)}`}>
                  {mainMisconception.studentCount} students ({mainMisconception.studentPercent}%)
                </span>
                {mainMisconception.occurrence && (
                  <span className="occurrence-pill">{mainMisconception.occurrence}</span>
                )}
              </div>

              {mainMisconception.misconceptionSummary && (
                <div className="misconception-summary">
                  {mainMisconception.misconceptionSummary}
                </div>
              )}

              {/* CCSS Standards Section - Change 1: Move under misconception description */}
              {mainMisconception.ccssStandards && (
                <div className="ccss-standards-section">
                  <div className="ccss-standards-grid">
                    {mainMisconception.ccssStandards.prerequisiteGaps && mainMisconception.ccssStandards.prerequisiteGaps.length > 0 && (
                      <div className="ccss-card">
                        <h4 className="tab-section-title">The underlying issue may be...</h4>
                        <div className="ccss-gap-list">
                          {mainMisconception.ccssStandards.prerequisiteGaps.map((gap, idx) => (
                            <div key={idx} className="ccss-gap-item">
                              <span className="ccss-tag prerequisite-gap">
                                {gap.standard}
                              </span>
                              <span className="ccss-description">
                                {gap.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="ccss-card">
                      <h4 className="tab-section-title">Students are struggling with...</h4>
                      <div className="ccss-objective-row">
                        <span className="ccss-tag target-objective">
                          {mainMisconception.ccssStandards.targetObjective.standard}
                        </span>
                        <span className="ccss-description">
                          {mainMisconception.ccssStandards.targetObjective.description}
                        </span>
                      </div>
                    </div>

                    {mainMisconception.ccssStandards.impactedObjectives && mainMisconception.ccssStandards.impactedObjectives.length > 0 && (
                      <div className="ccss-card">
                        <h4 className="tab-section-title">Future topics that may be impacted...</h4>
                        <div className="ccss-gap-list">
                          {mainMisconception.ccssStandards.impactedObjectives.map((obj, idx) => (
                            <div key={idx} className="ccss-gap-item">
                              <span className="ccss-tag impacted-objective">
                                {obj.standard}
                              </span>
                              <span className="ccss-description">
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

            {/* Main card body: add outer padding around the recommended activity section */}
            <div className="main-misconception-body">
              {/* Recommended Activity Card - Simplified to match alternative cards */}
              <div className="alternative-activity">
                <div className="alternative-label">Recommended activity</div>
                <div className="alternative-activity-title">{mainMisconception.move?.title}</div>
                <div className="alternative-meta">
                  <span>{mainMisconception.move?.time}</span>
                  <span className="meta-sep">|</span>
                  <span>{mainMisconception.move?.format}</span>
                </div>
                <div className="alternative-summary">{mainMisconception.move?.summary}</div>
              </div>

              <div className="alternative-actions">
                <button
                  className="reasoning-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCameFromFullView(false);
                    setReasoningGroupId(mainMisconception.id);
                  }}
                >
                  View Reasoning
                </button>
                <button 
                  className="add-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(mainMisconception);
                  }}
                >
                  Add to Saved Next Steps
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Misconceptions Grid */}
        {alternativeMisconceptions.length > 0 && (
          <div className="alternative-misconceptions-grid">
            {alternativeMisconceptions.map((group) => (
              <div 
                key={group.id} 
                className="alternative-misconception-card clickable-card"
                onClick={() => setFullViewGroupId(group.id)}
                role="button"
                tabIndex={0}
                aria-label={`View full details for ${group.title}`}
              >
                <div className="alternative-top">
                  <div className="alternative-title-row">
                    <h4 className="alternative-title">{group.title}</h4>
                  </div>

                  <div className="alternative-meta-row">
                    <span className={`students-pill ${getPriorityClass(group.priority)}`}>
                      {group.studentCount} students ({group.studentPercent}%)
                    </span>
                    {group.occurrence && <span className="occurrence-pill">{group.occurrence}</span>}
                  </div>
                </div>

                {/* CCSS Standards Section - Change 1: Add to alternative cards */}
                {group.ccssStandards && (
                  <div className="alternative-ccss-section">
                    <div className="alternative-ccss-grid">
                      {group.ccssStandards.prerequisiteGaps && group.ccssStandards.prerequisiteGaps.length > 0 && (
                        <div className="alternative-ccss-card">
                          <h4 className="alternative-ccss-header">The underlying issue may be...</h4>
                          <div className="alternative-ccss-gap-list">
                            {group.ccssStandards.prerequisiteGaps.map((gap, idx) => (
                              <div key={idx} className="alternative-ccss-gap-item">
                                <span className="alternative-ccss-tag prerequisite-gap">
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

                      <div className="alternative-ccss-card">
                        <h4 className="alternative-ccss-header">Students are struggling with...</h4>
                        <div className="alternative-ccss-content">
                          <span className="alternative-ccss-tag target-objective">
                            {group.ccssStandards.targetObjective.standard}
                          </span>
                          <span className="alternative-ccss-description">
                            {group.ccssStandards.targetObjective.description}
                          </span>
                        </div>
                      </div>

                      {group.ccssStandards.impactedObjectives && group.ccssStandards.impactedObjectives.length > 0 && (
                        <div className="alternative-ccss-card">
                          <h4 className="alternative-ccss-header">Future topics that may be impacted...</h4>
                          <div className="alternative-ccss-gap-list">
                            {group.ccssStandards.impactedObjectives.map((obj, idx) => (
                              <div key={idx} className="alternative-ccss-gap-item">
                                <span className="alternative-ccss-tag impacted-objective">
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

                <div className="alternative-activity">
                  <div className="alternative-label">Recommended activity</div>
                  <div className="alternative-activity-title">{group.move?.title}</div>
                  <div className="alternative-meta">
                    <span>{group.move?.time}</span>
                    <span className="meta-sep">|</span>
                    <span>{group.move?.format}</span>
                  </div>
                  <div className="alternative-summary">{group.move?.summary}</div>
                </div>

                <div className="alternative-actions">
                  <button
                    className="reasoning-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCameFromFullView(false);
                      setReasoningGroupId(group.id);
                    }}
                  >
                    View Reasoning
                  </button>
                  <button 
                    className="add-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(group);
                    }}
                  >
                    Add to Saved Next Steps
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedNextSteps;