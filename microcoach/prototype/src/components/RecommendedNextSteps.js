import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    if (priority === 'Critical') return 'priority-critical';
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
    // Layout constraint: show at most 2 recommended next-step components at a time.
    return (gapGroups || []).slice(0, 2);
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
                    <div className="data-visualization">
                      <div className="chart-container">
                        <h5 className="chart-title">Students Who Made Distribution Errors</h5>
                        <div className="chart-placeholder">
                        <div className="chart-bar" style={{height: '80%'}}></div>
                        <div className="chart-bar" style={{height: '60%'}}></div>
                        <div className="chart-bar" style={{height: '90%'}}></div>
                        <div className="chart-bar" style={{height: '40%'}}></div>
                        <div className="chart-bar" style={{height: '70%'}}></div>
                        <div className="chart-bar" style={{height: '85%'}}></div>
                        </div>
                        <div className="chart-labels">
                          <span>Q1</span>
                          <span>Q2</span>
                          <span>Q3</span>
                          <span>Q4</span>
                          <span>Q5</span>
                          <span>Q6</span>
                        </div>
                        <div className="chart-values">
                          <span>14</span>
                          <span>11</span>
                          <span>16</span>
                          <span>7</span>
                          <span>13</span>
                          <span>15</span>
                        </div>
                      </div>
                      
                      <div className="chart-stats">
                        <div className="stat-item">
                          <span className="stat-label">Error Rate</span>
                          <span className="stat-value">72%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Students Affected</span>
                          <span className="stat-value">18</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Most Problematic</span>
                          <span className="stat-value">Q6 (85%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="data-insights">
                      <h5>Key Insights</h5>
                      <ul>
                        <li>72% of students made the same distribution error across 6 questions</li>
                        <li>Q6 had the highest error rate at 85% (15 out of 18 students)</li>
                        <li>Pattern consistent across multiple problem types with similar structure</li>
                        <li>Indicates fundamental misunderstanding of negative distribution</li>
                      </ul>
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
                    <div className="problem-intro">
                      <div className="problem-eyebrow">Question 6</div>
                      <h5 className="problem-label">3(2x - 4) = 18</h5>
                      <p className="problem-context">This problem was used to assess students' understanding of distributing negative signs in multi-step equations.</p>
                    </div>

                    <div className="work-samples">
                      <div className="sample-grid">
                        <div className="sample-item incorrect">
                          <h6>Student A</h6>
                          <div className="sample-content">
                            <p>3(2x - 4) = 18</p>
                            <p>6x - 4 = 18</p>
                            <p>6x = 22</p>
                            <p>x = 22/6</p>
                          </div>
                          <div className="error-highlight">
                            <span className="error-label">Error:</span>
                            <span className="error-text">Forgot to distribute to -4</span>
                          </div>
                        </div>
                        
                        <div className="sample-item incorrect">
                          <h6>Student B</h6>
                          <div className="sample-content">
                            <p>3(2x - 4) = 18</p>
                            <p>6x - 4 = 18</p>
                            <p>6x = 22</p>
                            <p>x = 11/3</p>
                          </div>
                          <div className="error-highlight">
                            <span className="error-label">Error:</span>
                            <span className="error-text">Missed distribution, simplified incorrectly</span>
                          </div>
                        </div>

                        <div className="sample-item incorrect">
                          <h6>Student C</h6>
                          <div className="sample-content">
                            <p>3(2x - 4) = 18</p>
                            <p>6x - 4 = 18</p>
                            <p>6x = 14</p>
                            <p>x = 7/3</p>
                          </div>
                          <div className="error-highlight">
                            <span className="error-label">Error:</span>
                            <span className="error-text">Distributed incorrectly, subtracted instead of added</span>
                          </div>
                        </div>

                        <div className="sample-item incorrect">
                          <h6>Student D</h6>
                          <div className="sample-content">
                            <p>3(2x - 4) = 18</p>
                            <p>6x - 4 = 18</p>
                            <p>6x = 22</p>
                            <p>x = 3.67</p>
                          </div>
                          <div className="error-highlight">
                            <span className="error-label">Error:</span>
                            <span className="error-text">Missed distribution, decimal conversion error</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="breakdown-analysis">
                      <h5>Where Students Got Stuck</h5>
                      <div className="breakdown-steps">
                        <div className="breakdown-step">
                          <span className="step-number">1</span>
                          <span className="step-description">Identified the distribution needed</span>
                        </div>
                        <div className="breakdown-step">
                          <span className="step-number">2</span>
                          <span className="step-description">Multiplied coefficient by first term (2x)</span>
                        </div>
                        <div className="breakdown-step error-step">
                          <span className="step-number">3</span>
                          <span className="step-description">Forgot to distribute to second term (-4) - This is where 72% of students made their critical error</span>
                        </div>
                        <div className="breakdown-step">
                          <span className="step-number">4</span>
                          <span className="step-description">Continued solving with incorrect expression</span>
                        </div>
                      </div>
                    </div>

                    <div className="error-summary">
                      <h5>Common Error Patterns</h5>
                      <ul>
                        <li><strong>Partial Distribution:</strong> Students multiplied 3 by 2x but forgot to multiply 3 by -4</li>
                        <li><strong>Sign Confusion:</strong> Students treated the negative sign as attached only to the 4, not as part of the term being distributed</li>
                        <li><strong>Procedural Shortcut:</strong> Students applied a "multiply first, ignore negative" pattern that works in some contexts but not here</li>
                        <li><strong>Arithmetic Errors:</strong> Even when distribution was attempted, many made calculation mistakes with negative numbers</li>
                      </ul>
                    </div>
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
                    <div className="impact-analysis-full-width">
                      <div className="impact-card">
                        <h5>Long-term Consequences</h5>
                        <ul>
                          <li><strong>Algebraic Foundation Weakness:</strong> Students will struggle with factoring, polynomial operations, and simplifying complex expressions</li>
                          <li><strong>Function Transformation Difficulties:</strong> Understanding how functions change when multiplied by constants or shifted becomes nearly impossible</li>
                          <li><strong>Calculus Readiness Issues:</strong> Derivatives and integrals of polynomial functions require solid distribution skills</li>
                          <li><strong>Problem-Solving Confidence Erosion:</strong> Repeated failures with basic algebraic manipulation discourages students from pursuing STEM fields</li>
                          <li><strong>Test Performance Impact:</strong> Standardized tests heavily feature distribution problems, affecting college admissions and placement</li>
                        </ul>
                      </div>
                    </div>

                    <div className="learning-path">
                      <h5>Learning Path Forward</h5>
                      <div className="path-steps">
                        <div className="path-step">
                          <span className="path-number">1</span>
                          <span className="path-description">Master distribution with negatives</span>
                        </div>
                        <div className="path-step">
                          <span className="path-number">2</span>
                          <span className="path-description">Apply to multi-step equations</span>
                        </div>
                        <div className="path-step">
                          <span className="path-number">3</span>
                          <span className="path-description">Extend to polynomial operations</span>
                        </div>
                        <div className="path-step">
                          <span className="path-number">4</span>
                          <span className="path-description">Build foundation for advanced math</span>
                        </div>
                      </div>
                    </div>
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
          <div className="alternative-misconceptions-grid">
            {visibleGapGroups.map((group) => {
              const isFocusSkillsExpanded = !!focusSkillsExpandedByGroupId?.[group.id];
              const isSelectedGroup = selectedRecommendationGroup?.id === group.id;

              return (
                <div 
                  key={group.id} 
                  className={`alternative-misconception-card clickable-card ${isSelectedGroup ? 'selected-group' : ''}`}
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
                    <div className="rns-top-row">
                      <div className="rns-top-left">
                        <div className="alternative-title-row">
                          <h4 className="alternative-title">{group.title}</h4>
                        </div>
                      </div>

                      <div className="rns-top-right">
                        <div className="rns-top-right-controls">
                          <span className={`students-pill ${getPriorityClass(group.priority)}`}>
                            {group.studentCount} students ({group.studentPercent}%)
                          </span>
                          {isSelectedGroup && <span className="rns-selected-pill">Selected</span>}
                        </div>

                        {/* Occurrence pills removed (per updated UI spec). */}
                      </div>
                    </div>

                    {group.misconceptionSummary && (
                      <div className="rns-misconception-text">{group.misconceptionSummary}</div>
                    )}

                  </div>

                  {/* CCSS Standards Section - Change 1: Add to alternative cards */}
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
                      className="reasoning-btn"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEvidenceScreen(1);
                        setReasoningGroupId(group.id);
                      }}
                    >
                      View Reasoning
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}


      {console.log('[RNS] selectedGroup subMisconceptions:', selectedRecommendationGroup?.subMisconceptions)}
      {selectedRecommendationGroup?.subMisconceptions?.length > 0 && (
        <div className="sub-misconceptions-section">
          <div className="sub-misconceptions-header">
            <h4 className="sub-misconceptions-title">{selectedRecommendationGroup.title}</h4>
            <p className="sub-misconceptions-description">{selectedRecommendationGroup.misconceptionSummary}</p>
          </div>
          <div className="sub-misconceptions-carousel">
            <div className="sub-misconceptions-track">
              {selectedRecommendationGroup.subMisconceptions.map((sub, i) => (
                <div key={i} className="sub-misconception-card">
                  <div className="sub-misconception-header">
                    {sub.isCore && <span className="core-pill">[CORE]</span>}
                  </div>
                  <h5 className="sub-misconception-name">{sub.name}</h5>
                  <div className="sub-misconception-meta">
                    <span className={`${sub.frequency}-students-pill`}>
                      {sub.frequency.charAt(0).toUpperCase() + sub.frequency.slice(1)} students
                    </span>
                  </div>
                  <p className="sub-misconception-desc">{sub.description}</p>
                  {sub.example && (
                    <div className="sub-misconception-example">
                      <strong>Example:</strong>
                      <div className="example-content">
                        <span className="incorrect-example">{sub.example.incorrect}</span>
                        <span className="correct-example">(correct: {sub.example.correct})</span>
                      </div>
                    </div>
                  )}
                  <button
                    className="view-thinking-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEvidenceScreen(1);
                      setReasoningGroupId(selectedRecommendationGroup.id);
                    }}
                  >
                    See Student Thinking
                  </button>
                </div>
              ))}
            </div>
            <div className="carousel-controls">
              <button
                className="carousel-btn carousel-btn-prev"
                onClick={() => {
                  const track = document.querySelector('.sub-misconceptions-track');
                  if (track) track.scrollBy({ left: -340, behavior: 'smooth' });
                }}
                aria-label="Previous sub-misconception"
              >‹</button>
              <button
                className="carousel-btn carousel-btn-next"
                onClick={() => {
                  const track = document.querySelector('.sub-misconceptions-track');
                  if (track) track.scrollBy({ left: 340, behavior: 'smooth' });
                }}
                aria-label="Next sub-misconception"
              >›</button>
            </div>
          </div>
        </div>
      )}

      {selectedRecommendationGroup && (
        <div className="rns-next-step-section">
          <div className="alternative-label">Choose a Next Step</div>
          <p className="alternative-sublabel">
            Recommended next steps aligned to {selectedRecommendationGroup.title}
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
          <div className="ccss-standards-header">
            <h4 className="ccss-standards-title">Instructional context</h4>
            <button
              className="ccss-standards-toggle"
              onClick={() => toggleFocusSkillsExpanded(selectedRecommendationGroup.id)}
              aria-expanded={focusSkillsExpandedByGroupId?.[selectedRecommendationGroup.id] || false}
              aria-controls="ccss-standards-content"
            >
              {focusSkillsExpandedByGroupId?.[selectedRecommendationGroup.id] ? '−' : '+'}
            </button>
          </div>
          
          <div className="ccss-standards-content">
            {/* Assessed Standard (always visible, full width) */}
            {selectedRecommendationGroup.ccssStandards.targetObjective && (
              <div className="standards-column assessed-full-width">
                <h5 className="column-header assessed-header">Assessed Standard</h5>
                <div className="standards-list">
                  <button
                    className="standard-card assessed-card"
                    onClick={(e) => {
                      e.stopPropagation();
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

            {/* Prerequisite Gaps and At Risk Standards (only when expanded, side by side) */}
            {(focusSkillsExpandedByGroupId?.[selectedRecommendationGroup.id] || false) && (
              <div className="standards-grid side-by-side">
                {selectedRecommendationGroup.ccssStandards.prerequisiteGaps && selectedRecommendationGroup.ccssStandards.prerequisiteGaps.length > 0 && (
                  <div className="standards-column">
                    <h5 className="column-header prerequisite-header">Prerequisite Gaps</h5>
                    <div className="standards-list">
                      {selectedRecommendationGroup.ccssStandards.prerequisiteGaps.map((standard, idx) => (
                        <button
                          key={idx}
                          className="standard-card prerequisite-card"
                          onClick={(e) => {
                            e.stopPropagation();
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
                          onClick={(e) => {
                            e.stopPropagation();
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
            )}
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default RecommendedNextSteps;
