import React, { useEffect, useMemo, useRef, useState } from 'react';
import Collapse from '@mui/material/Collapse';
import './RecommendedNextSteps.css';
import './SharedButtons.css';
import CCSSStandardsModal from './CCSSStandardsModal';
import NextStepDetailsModal from './NextStepDetailsModal';


const RecommendedNextSteps = ({ onAddNextStep, existingNextSteps = [], gapGroups: gapGroupsProp }) => {
  const [gapGroups, setGapGroups] = useState(() => gapGroupsProp ?? []);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const [reasoningGroupId, setReasoningGroupId] = useState(null);
  const [evidenceScreen, setEvidenceScreen] = useState(1);
  const [ccssModalOpen, setCcssModalOpen] = useState(false);
  const [selectedCcssStandard, setSelectedCcssStandard] = useState(null);
  const [ccssModalGroup, setCcssModalGroup] = useState(null);
  // Focus Skills sub-section expansion state per group.
  // Collapsed (default): show only Focus Skills.
  // Expanded: also show Prerequisite Gaps + Upcoming Skills.
  const [focusSkillsExpandedByGroupId, setFocusSkillsExpandedByGroupId] = useState({});
  // Which recommendation card is currently active for the standalone next-step section.
  const [selectedRecommendationGroupId, setSelectedRecommendationGroupId] = useState(null);
  // Instructional Context section expand/collapse — separate from card-level focus skills state.
  const [isInstructionalContextExpanded, setIsInstructionalContextExpanded] = useState(false);
  // Which activity option is selected per gap group.
  const [selectedMoveIdByGroupId, setSelectedMoveIdByGroupId] = useState({});

  // Activity details modal state.
  const [activityDetailsOpen, setActivityDetailsOpen] = useState(false);
  const [activityDetailsGroup, setActivityDetailsGroup] = useState(null);
  const [activityDetailsMove, setActivityDetailsMove] = useState(null);
  const [activityDetailsActiveTab, setActivityDetailsActiveTab] = useState('overview');

  const existingIndex = useMemo(() => {
    // Used only for subtle UI cues (do we already have something saved for this gap group?)
    const set = new Set(existingNextSteps.map((x) => `${x.gapGroupId}:${x.moveId}`));
    return set;
  }, [existingNextSteps]);

  const getPriorityClass = (priority) => {
    if (priority === 'Critical') return 'priority-critical'; // legacy — kept for static seed data
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  useEffect(() => {
    const timeoutId = toastTimeoutRef.current;
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (gapGroupsProp) setGapGroups(gapGroupsProp);
  }, [gapGroupsProp]);


  const handleAdd = (group, explicitMove = null) => {
    const options = Array.isArray(group?.moveOptions) ? group.moveOptions : [];
    const selectedMoveId = selectedMoveIdByGroupId?.[group.id] ?? options?.[0]?.id;
    const move = explicitMove ?? options.find((m) => m.id === selectedMoveId) ?? options?.[0];
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

  const visibleGapGroups = useMemo(() => {
    return (gapGroups || []).slice(0, 4);
  }, [gapGroups]);

  const toggleFocusSkillsExpanded = (groupId) => {
    setFocusSkillsExpandedByGroupId((prev) => ({
      ...prev,
      [groupId]: !prev?.[groupId]
    }));
  };

  const getSelectedMoveForGroup = (group) => {
    const options = Array.isArray(group?.moveOptions) ? group.moveOptions : [];
    const selectedMoveId = selectedMoveIdByGroupId?.[group.id] ?? options?.[0]?.id;
    return options.find((m) => m.id === selectedMoveId) ?? options?.[0] ?? null;
  };

  const openActivityDetails = (group, move) => {
    setActivityDetailsGroup(group);
    setActivityDetailsMove(move);
    setActivityDetailsOpen(true);
    setActivityDetailsActiveTab('overview');
  };

  const closeActivityDetails = () => {
    setActivityDetailsOpen(false);
    setActivityDetailsGroup(null);
    setActivityDetailsMove(null);
    setActivityDetailsActiveTab('overview');
  };

  const selectedRecommendationGroup = useMemo(() => {
    return (
      visibleGapGroups.find((group) => group.id === selectedRecommendationGroupId) ??
      visibleGapGroups[0] ??
      null
    );
  }, [visibleGapGroups, selectedRecommendationGroupId]);

  useEffect(() => {
    setIsInstructionalContextExpanded(false);
  }, [selectedRecommendationGroup?.id]);

  return (
    <div className="recommended-next-steps">
      {/* Use the same modal as Saved Next Steps (View details) */}
      <NextStepDetailsModal
        isOpen={activityDetailsOpen}
        title={activityDetailsGroup?.title}
        priority={activityDetailsGroup?.priority}
        studentCount={activityDetailsGroup?.studentCount}
        studentPercent={activityDetailsGroup?.studentPercent}
        occurrence={activityDetailsGroup?.occurrence}
        misconceptionSummary={activityDetailsGroup?.misconceptionSummary}
        ccssStandards={activityDetailsGroup?.ccssStandards}
        successIndicators={activityDetailsGroup?.successIndicators}
        move={activityDetailsMove}
        activeTab={activityDetailsActiveTab}
        onChangeTab={setActivityDetailsActiveTab}
        onClose={closeActivityDetails}
        actions={
          activityDetailsGroup &&
          activityDetailsMove &&
          !existingIndex.has(`${activityDetailsGroup.id}:${activityDetailsMove.id}`) ? (
            <button
              className="add-btn"
              type="button"
              onClick={() => {
                handleAdd(activityDetailsGroup, activityDetailsMove);
                closeActivityDetails();
              }}
            >
              Save to List
            </button>
          ) : null
        }
      />

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
                    {reasoningGroup.questionErrorRates?.length > 0 && (
                      <div className="data-visualization">
                        <div className="chart-container">
                          <h5 className="chart-title">Error Rate by Question</h5>
                          <div className="chart-placeholder">
                            {reasoningGroup.questionErrorRates.map((q) => (
                              <div
                                key={q.label}
                                className="chart-bar"
                                style={{ height: `${Math.max(q.errorRate, 4)}%` }}
                                title={`${q.label}: ${q.errorRate}%`}
                              ></div>
                            ))}
                          </div>
                          <div className="chart-labels">
                            {reasoningGroup.questionErrorRates.map((q) => (
                              <span key={q.label}>{q.label}</span>
                            ))}
                          </div>
                          <div className="chart-values">
                            {reasoningGroup.questionErrorRates.map((q) => (
                              <span key={q.label}>{q.errorRate}%</span>
                            ))}
                          </div>
                        </div>

                        <div className="chart-stats">
                          <div className="stat-item">
                            <span className="stat-label">Frequency</span>
                            <span className="stat-value">
                              {reasoningGroup.frequency
                                ? reasoningGroup.frequency.charAt(0).toUpperCase() + reasoningGroup.frequency.slice(1) + ' students'
                                : '—'}
                            </span>
                          </div>
                          {reasoningGroup.evidence?.source && (
                            <div className="stat-item">
                              <span className="stat-label">Questions</span>
                              <span className="stat-value">{reasoningGroup.evidence.source}</span>
                            </div>
                          )}
                          {(() => {
                            const rates = reasoningGroup.questionErrorRates;
                            const max = rates.reduce((a, b) => b.errorRate > a.errorRate ? b : a, rates[0]);
                            return max ? (
                              <div className="stat-item">
                                <span className="stat-label">Highest Error</span>
                                <span className="stat-value">{max.label} ({max.errorRate}%)</span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    )}

                    <div className="data-insights">
                      <h5>Key Insights</h5>
                      {reasoningGroup.aiReasoning
                        ? <p>{reasoningGroup.aiReasoning}</p>
                        : reasoningGroup.evidence?.mostCommonError
                          ? <p>{reasoningGroup.evidence.mostCommonError}</p>
                          : <p>{reasoningGroup.misconceptionSummary}</p>
                      }
                    </div>
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
                    {reasoningGroup.example && (
                      <div className="problem-intro">
                        <div className="problem-eyebrow">Example Error</div>
                        <h5 className="problem-label">{reasoningGroup.example.incorrect}</h5>
                        <p className="problem-context">Correct form: {reasoningGroup.example.correct}</p>
                      </div>
                    )}

                    {reasoningGroup.evidence?.sampleStudentWork?.length > 0 && (
                      <div className="work-samples">
                        <div className="sample-grid">
                          {reasoningGroup.evidence.sampleStudentWork.map((sample, idx) => (
                            <div key={idx} className="sample-item incorrect">
                              <h6>Student {String.fromCharCode(65 + idx)}</h6>
                              <div className="sample-content">
                                <p>{sample}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reasoningGroup.evidence?.aiThinkingPattern && (
                      <div className="breakdown-analysis">
                        <h5>Underlying Thinking Pattern</h5>
                        <p className="thinking-pattern-text">{reasoningGroup.evidence.aiThinkingPattern}</p>
                      </div>
                    )}

                    {reasoningGroup.evidence?.mostCommonError && (
                      <div className="error-summary">
                        <h5>Most Common Error</h5>
                        <p>{reasoningGroup.evidence.mostCommonError}</p>
                      </div>
                    )}

                    {!reasoningGroup.example && !reasoningGroup.evidence && (
                      <p className="no-data-text">No detailed work samples available for this misconception.</p>
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
                    {reasoningGroup.ccssStandards?.impactedObjectives?.length > 0 && (
                      <div className="long-term-consequences">
                        <h5 className="consequences-heading">Long-term Consequences</h5>
                        <div className="consequence-list">
                          {reasoningGroup.ccssStandards.impactedObjectives.map((obj, idx) => (
                            <div key={idx} className="consequence-item">
                              <span className="consequence-standard">{obj.standard}</span>
                              <span className="consequence-description">{obj.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reasoningGroup.successIndicators?.length > 0 && (
                      <div className="learning-path">
                        <h5 className="learning-path-heading">Learning Path Forward</h5>
                        <div className="path-steps">
                          {reasoningGroup.successIndicators.map((indicator, idx) => (
                            <div key={idx} className="path-step">
                              <span className="path-number">{idx + 1}</span>
                              <span className="path-description">{indicator}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!reasoningGroup.ccssStandards?.impactedObjectives?.length &&
                     !reasoningGroup.successIndicators?.length && (
                      <p className="no-data-text">No impact data available for this misconception.</p>
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
                    ← {evidenceScreen === 3 ? 'Where & How' : 'What Happened'}
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

      <CCSSStandardsModal
        isOpen={ccssModalOpen}
        onClose={() => {
          setCcssModalOpen(false);
          setCcssModalGroup(null);
          setSelectedCcssStandard(null);
        }}
        ccssStandards={ccssModalGroup?.ccssStandards}
        selectedStandard={selectedCcssStandard}
        onStandardSelect={setSelectedCcssStandard}
      />


      <div className="rns-header">
        <div>
          <h3 className="rns-title">Understand Your Students' Thinking</h3>
          <p className="rns-subtitle">
            Insights and misconception patterns from your classroom data
          </p>
        </div>
      </div>

      {toast && <div className="rns-toast" role="status">{toast}</div>}

      <div className="rns-groups">
        {/* All recommendations are rendered with the same (smaller) card size/format. */}
        {gapGroups.length > 0 && (
          <div className="misconceptions-carousel-wrapper">
            <div className="alternative-misconceptions-grid">
              {visibleGapGroups.map((group) => {
                const isFocusSkillsExpanded = !!focusSkillsExpandedByGroupId?.[group.id];
                const isSelectedGroup = selectedRecommendationGroup?.id === group.id;

                return (
                  <div
                    key={group.id}
                    className={`alternative-misconception-card clickable-card ${isSelectedGroup ? 'selected-group' : ''} ${group.isCore ? 'core-group' : ''}`}
                    onClick={() => setSelectedRecommendationGroupId(group.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedRecommendationGroupId(group.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${group.title} to view next steps`}
                  >
                    <div className="alternative-top">
                      <div className="card-pills-row">
                        {group.isCore && <span className="core-pill">CORE</span>}
                      </div>

                      <h4 className="alternative-title">{group.title}</h4>

                      <div className="card-frequency-row">
                        {group.frequency && (() => {
                          const freq = group.frequency === 'medium' ? 'some' : group.frequency;
                          return (
                            <span className={`${freq}-students-pill`}>
                              {freq.charAt(0).toUpperCase() + freq.slice(1)} students
                            </span>
                          );
                        })()}
                      </div>

                      {group.misconceptionSummary && (
                        <div className="rns-misconception-text">{group.misconceptionSummary}</div>
                      )}

                      {group.example && (
                        <div className="sub-misconception-example">
                          <div className="example-content">
                            <div className="incorrect-example">
                              <span className="example-label">Incorrect</span>
                              <span className="example-value">{group.example.incorrect}</span>
                            </div>
                            <div className="correct-example">
                              <span className="example-label">Correct</span>
                              <span className="example-value">{group.example.correct}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CCSS Standards Section */}
                    {group.ccssStandards && isFocusSkillsExpanded && (
                      <div className="alternative-ccss-section">
                        <div className="alternative-ccss-grid">
                          {group.ccssStandards.prerequisiteGaps && group.ccssStandards.prerequisiteGaps.length > 0 && (
                            <div className="alternative-ccss-card">
                              <h4 className="alternative-ccss-header">Prerequisite Gaps</h4>
                              <div className="alternative-ccss-gap-list">
                                {group.ccssStandards.prerequisiteGaps.map((gap, idx) => (
                                  <div key={idx} className="alternative-ccss-gap-item">
                                    <span
                                      className="alternative-ccss-tag prerequisite-gap clickable-standard"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCcssModalGroup(group);
                                        setSelectedCcssStandard(gap);
                                        setCcssModalOpen(true);
                                      }}
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

                          {group.ccssStandards.impactedObjectives && group.ccssStandards.impactedObjectives.length > 0 && (
                            <div className="alternative-ccss-card">
                              <h4 className="alternative-ccss-header">Upcoming Skills</h4>
                              <div className="alternative-ccss-gap-list">
                                {group.ccssStandards.impactedObjectives.map((obj, idx) => (
                                  <div key={idx} className="alternative-ccss-gap-item">
                                    <span
                                      className="alternative-ccss-tag impacted-objective clickable-standard"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCcssModalGroup(group);
                                        setSelectedCcssStandard(obj);
                                        setCcssModalOpen(true);
                                      }}
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

                    <div className="alternative-actions">
                      <button
                        className="view-thinking-btn"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEvidenceScreen(1);
                          setReasoningGroupId(group.id);
                        }}
                      >
                        See Student Thinking
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="carousel-controls">
              <button
                className="carousel-btn carousel-btn-prev"
                onClick={() => {
                  const grid = document.querySelector('.alternative-misconceptions-grid');
                  if (grid) grid.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                aria-label="Previous misconception"
              >‹</button>
              <button
                className="carousel-btn carousel-btn-next"
                onClick={() => {
                  const grid = document.querySelector('.alternative-misconceptions-grid');
                  if (grid) grid.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                aria-label="Next misconception"
              >›</button>
            </div>
          </div>
        )}

      {selectedRecommendationGroup && (
        <div className="rns-next-step-section">
          <div className="alternative-label">Choose a Next Step</div>
          <p className="alternative-sublabel">
            {selectedRecommendationGroup.isCore
              ? <>Recommended next steps for the core misconception: <strong>{selectedRecommendationGroup.title}</strong></>
              : <>Recommended next steps for: <strong>{selectedRecommendationGroup.title}</strong></>
            }
          </p>
          <div className="rns-activity-options" role="radiogroup" aria-label="Choose a Next Step">
            {(selectedRecommendationGroup.moveOptions || []).slice(0, 3).map((opt) => {
              const selectedMove = getSelectedMoveForGroup(selectedRecommendationGroup);
              const isSelected = selectedMove?.id === opt.id;
              const alreadyAdded = existingIndex.has(`${selectedRecommendationGroup.id}:${opt.id}`);

              return (
                <div
                  key={opt.id}
                  className={`rns-activity-option ${isSelected ? 'selected' : ''} ${alreadyAdded ? 'disabled' : ''}`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={alreadyAdded ? 'true' : undefined}
                  tabIndex={alreadyAdded ? -1 : 0}
                  onClick={alreadyAdded ? undefined : () => {
                    openActivityDetails(selectedRecommendationGroup, opt);
                    setSelectedMoveIdByGroupId((prev) => ({
                      ...prev,
                      [selectedRecommendationGroup.id]: opt.id
                    }));
                  }}
                  onKeyDown={alreadyAdded ? undefined : (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openActivityDetails(selectedRecommendationGroup, opt);
                      setSelectedMoveIdByGroupId((prev) => ({
                        ...prev,
                        [selectedRecommendationGroup.id]: opt.id
                      }));
                    }
                  }}
                >
                  <div className="rns-activity-option-title-row">
                    <div className="rns-activity-option-title">{opt.title}</div>
                  </div>
                  <div className="rns-activity-option-meta">
                    <span>{opt.time}</span>
                    <span className="meta-sep">|</span>
                    <span>{opt.format}</span>
                  </div>

                  {/* Display additional fields if they exist */}
                  <div className="rns-activity-option-details">
                    {opt.targets && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Targets</span>
                        <span className="rns-activity-option-field-value">{opt.targets}</span>
                      </div>
                    )}

                    {opt.instructionalMove && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Instructional Move</span>
                        <span className="rns-activity-option-field-value">{opt.instructionalMove}</span>
                      </div>
                    )}

                    {opt.strategyTag && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Strategy Tag</span>
                        <span className="rns-activity-option-field-value">{opt.strategyTag}</span>
                      </div>
                    )}
                  </div>

                  <div className="rns-activity-option-actions">
                    {alreadyAdded ? (
                      <span className="rns-activity-added-pill" aria-label="Already added to your next steps">
                        Already added
                      </span>
                    ) : (
                      <button
                        className="add-btn rns-activity-add-btn"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(selectedRecommendationGroup, opt);
                        }}
                      >
                        <svg
                          className="rns-bookmark-icon"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2Z"
                          />
                        </svg>
                        <span>Save to List</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New CCSS Standards Section - Based on sketch design */}
      {selectedRecommendationGroup && selectedRecommendationGroup.ccssStandards && (
        <div className="ccss-standards-section">
          <div
            className="ccss-standards-header"
            onClick={() => setIsInstructionalContextExpanded((prev) => !prev)}
            role="button"
            aria-expanded={isInstructionalContextExpanded}
            aria-controls="ccss-standards-content"
          >
            <span
              className={`ccss-standards-arrow ${isInstructionalContextExpanded ? 'expanded' : ''}`}
              aria-hidden="true"
            />
            <h4 className="ccss-standards-title">Instructional Context</h4>
          </div>

          <Collapse in={isInstructionalContextExpanded}>
          <div className="ccss-standards-content">
            {/* Assessed Standard (always visible, full width) */}
            {selectedRecommendationGroup.ccssStandards.targetObjective && (
              <div className="standards-column assessed-full-width">
                <h5 className="column-header assessed-header">Focus Skill</h5>
                <div className="standards-list">
                  <button
                    className="standard-card assessed-card"
                    onClick={() => {
                      setCcssModalGroup(selectedRecommendationGroup);
                      setSelectedCcssStandard(selectedRecommendationGroup.ccssStandards.targetObjective);
                      setCcssModalOpen(true);
                    }}
                  >
                    <span className="standard-code">{selectedRecommendationGroup.ccssStandards.targetObjective.standard}</span>
                    <span className="standard-description">{selectedRecommendationGroup.ccssStandards.targetObjective.description}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Prerequisite Gaps and At Risk Standards (side by side) */}
            <div className="standards-grid side-by-side">
                {selectedRecommendationGroup.ccssStandards.prerequisiteGaps && selectedRecommendationGroup.ccssStandards.prerequisiteGaps.length > 0 && (
                  <div className="standards-column">
                    <h5 className="column-header prerequisite-header">Prerequisite Gaps</h5>
                    <div className="standards-list">
                      {selectedRecommendationGroup.ccssStandards.prerequisiteGaps.map((standard, idx) => (
                        <button
                          key={idx}
                          className="standard-card prerequisite-card"
                          onClick={() => {
                            setCcssModalGroup(selectedRecommendationGroup);
                            setSelectedCcssStandard(standard);
                            setCcssModalOpen(true);
                          }}
                        >
                          <span className="standard-code">{standard.standard}</span>
                          <span className="standard-description">{standard.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecommendationGroup.ccssStandards.impactedObjectives && selectedRecommendationGroup.ccssStandards.impactedObjectives.length > 0 && (
                  <div className="standards-column">
                    <h5 className="column-header at-risk-header">Upcoming Skills</h5>
                    <div className="standards-list">
                      {selectedRecommendationGroup.ccssStandards.impactedObjectives.map((standard, idx) => (
                        <button
                          key={idx}
                          className="standard-card at-risk-card"
                          onClick={() => {
                            setCcssModalGroup(selectedRecommendationGroup);
                            setSelectedCcssStandard(standard);
                            setCcssModalOpen(true);
                          }}
                        >
                          <span className="standard-code">{standard.standard}</span>
                          <span className="standard-description">{standard.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          </div>
          </Collapse>
        </div>
      )}

      </div>
    </div>
  );
};

export default RecommendedNextSteps;
