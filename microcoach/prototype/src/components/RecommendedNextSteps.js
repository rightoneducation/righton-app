import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sortStudentNames } from '../util/sortStudentNames';
import Tooltip from '@mui/material/Tooltip';
import './RecommendedNextSteps.css';
import './SharedButtons.css';

import NextStepDetailsModal from './NextStepDetailsModal';


const RecommendedNextSteps = ({ onAddNextStep, existingNextSteps = [], gapGroups: gapGroupsProp }) => {
  const [gapGroups, setGapGroups] = useState(() => gapGroupsProp ?? []);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const [reasoningGroupId, setReasoningGroupId] = useState(null);
  // Which recommendation card is currently active for the standalone next-step section.
  const [selectedRecommendationGroupId, setSelectedRecommendationGroupId] = useState(null);
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

  const getFrequencyTooltip = (frequency) => {
    if (frequency === 'many') return 'Many students: >60% of class';
    if (frequency === 'medium' || frequency === 'some') return 'Some students: 30–60% of class';
    if (frequency === 'few') return 'Few students: <30% of class';
    return '';
  };

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
              Save to Next Steps
            </button>
          ) : null
        }
      />

      {reasoningGroup && (
        <div className="rns-modal-overlay" onClick={() => setReasoningGroupId(null)}>
          <div className="rns-modal view-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="view-details-header">
              <h3 className="view-details-title">{reasoningGroup.title}</h3>
              <button
                className="evidence-journey-close"
                onClick={() => setReasoningGroupId(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="view-details-body">

              {/* Correct Answer and Solution
              <div className="vd-section">
                <h4 className="vd-section-header">Correct Answer and Solution</h4>
                {reasoningGroup.example?.correct && (
                  <div className="vd-example-answer">
                    <span className="vd-example-answer-label">Example</span>
                    <span className="vd-example-answer-value">{reasoningGroup.example.correct}</span>
                  </div>
                )}
                {reasoningGroup.correctAnswerSolution?.length > 0 ? (
                  <ol className="vd-solution-steps">
                    {reasoningGroup.correctAnswerSolution.map((step, idx) => (
                      <li key={idx} className="vd-solution-step">{step}</li>
                    ))}
                  </ol>
                ) : !reasoningGroup.example && (
                  <p className="no-data-text">No correct answer data available.</p>
                )}
              </div>
          
              {/* Wrong Answer Explanation 
              <div className="vd-section">
                <h4 className="vd-section-header">Wrong Answer Explanation</h4>
                {reasoningGroup.wrongAnswerExplanations?.length > 0 ? (
                  <div className="vd-wrong-answers">
                    {reasoningGroup.wrongAnswerExplanations.map((item, idx) => (
                      <div key={idx} className="vd-wrong-answer-row">
                        <span className="vd-wrong-answer-badge">{item.answer}</span>
                        <p className="vd-wrong-answer-explanation">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {reasoningGroup.evidence?.mostCommonError && (
                      <div className="vd-field">
                        <span className="vd-field-label">Most Common Error</span>
                        <p className="vd-field-value">{reasoningGroup.evidence.mostCommonError}</p>
                      </div>
                    )}
                    {reasoningGroup.evidence?.aiThinkingPattern && (
                      <div className="vd-field">
                        <span className="vd-field-label">Thinking Pattern</span>
                        <p className="vd-field-value">{reasoningGroup.evidence.aiThinkingPattern}</p>
                      </div>
                    )}
                    {!reasoningGroup.evidence && (
                      <p className="no-data-text">No wrong answer explanation available.</p>
                    )}
                  </>
                )}
              </div> */}

              {/* Instructional Context */}
              {reasoningGroup.ccssStandards && (
                <div className="vd-section">
                  <h4 className="vd-section-header">Instructional Context</h4>
                  <div className="ccss-standards-content">
                    {reasoningGroup.ccssStandards.targetObjective && (
                      <div className="standards-column assessed-full-width">
                        <h5 className="column-header assessed-header">Focus Skill</h5>
                        <div className="standards-list">
                          <div className="standard-card assessed-card">
                            <span className="standard-code">{reasoningGroup.ccssStandards.targetObjective.standard}</span>
                            <span className="standard-description">{reasoningGroup.ccssStandards.targetObjective.description}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="standards-grid side-by-side">
                      {reasoningGroup.ccssStandards.prerequisiteGaps?.length > 0 && (
                        <div className="standards-column">
                          <h5 className="column-header prerequisite-header">Prerequisite Gaps</h5>
                          <div className="standards-list">
                            {reasoningGroup.ccssStandards.prerequisiteGaps.map((standard, idx) => (
                              <div key={idx} className="standard-card prerequisite-card">
                                <span className="standard-code">{standard.standard}</span>
                                <span className="standard-description">{standard.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {reasoningGroup.ccssStandards.impactedObjectives?.length > 0 && (
                        <div className="standards-column">
                          <h5 className="column-header at-risk-header">Upcoming Skills</h5>
                          <div className="standards-list">
                            {reasoningGroup.ccssStandards.impactedObjectives.map((standard, idx) => (
                              <div key={idx} className="standard-card at-risk-card">
                                <span className="standard-code">{standard.standard}</span>
                                <span className="standard-description">{standard.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Student Responses */}
              <div className="vd-section">
                <h4 className="vd-section-header">Student Responses</h4>
                {(reasoningGroup.studentGroups?.buildingUnderstanding?.length > 0 ||
                  reasoningGroup.studentGroups?.understoodConcept?.length > 0) ? (
                  <div className="vd-student-groups">
                    {reasoningGroup.studentGroups.buildingUnderstanding?.length > 0 && (
                      <div className="vd-student-group">
                        <div className="vd-student-group-header">
                          <span className="vd-student-group-label building">Building Understanding</span>
                          <span className="vd-student-group-count">
                            {reasoningGroup.studentGroups.buildingUnderstanding.length} students
                          </span>
                        </div>
                        <p className="vd-student-group-sub">Incorrect answers</p>
                        <div className="vd-student-pills">
                          {sortStudentNames(reasoningGroup.studentGroups.buildingUnderstanding).map((name) => (
                            <span key={name} className="vd-student-pill">{name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {reasoningGroup.studentGroups.understoodConcept?.length > 0 && (
                      <div className="vd-student-group">
                        <div className="vd-student-group-header">
                          <span className="vd-student-group-label understood">Understood Concept</span>
                          <span className="vd-student-group-count">
                            {reasoningGroup.studentGroups.understoodConcept.length} students
                          </span>
                        </div>
                        <p className="vd-student-group-sub">Correct answers</p>
                        <div className="vd-student-pills">
                          {sortStudentNames(reasoningGroup.studentGroups.understoodConcept).map((name) => (
                            <span key={name} className="vd-student-pill">{name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="no-data-text">No student response data available.</p>
                )}
              </div>

            </div>

            <div className="view-details-footer">
              <button className="nav-btn" onClick={() => setReasoningGroupId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                            <Tooltip
                              title={getFrequencyTooltip(group.frequency)}
                              arrow
                              placement="top"
                              slotProps={{
                                tooltip: { sx: { backgroundColor: '#1B376F', fontSize: '12px' } },
                                arrow: { sx: { color: '#1B376F' } },
                              }}
                            >
                              <span className={`${freq}-students-pill`}>
                                {freq.charAt(0).toUpperCase() + freq.slice(1)} students
                              </span>
                            </Tooltip>
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

                    <div className="alternative-actions">
                      <button
                        className="view-thinking-btn"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReasoningGroupId(group.id);
                        }}
                      >
                        View Details
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
                    setSelectedMoveIdByGroupId((prev) => ({
                      ...prev,
                      [selectedRecommendationGroup.id]: opt.id
                    }));
                  }}
                  onKeyDown={alreadyAdded ? undefined : (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
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
                    <button
                      className="view-thinking-btn"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openActivityDetails(selectedRecommendationGroup, opt);
                      }}
                    >
                      View Details
                    </button>
                    {alreadyAdded ? (
                      <span className="rns-activity-added-pill" aria-label="Saved">
                        Saved
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
                        <span>Save to Next Steps</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default RecommendedNextSteps;
