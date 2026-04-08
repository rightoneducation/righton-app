import React, { useState } from 'react';
import { sortStudentNames } from '../util/sortStudentNames';
import MathText from './MathText';

// Known technical field names → user-friendly labels.
// Numbered patterns handle any trailing digit (e.g. incorrectWorkedExample1, 2, 3…).
// Order: longer/more-specific patterns first to avoid partial matches.
const FIELD_REPLACEMENTS = [
  [/incorrectWorkedExamples/, () => 'Incorrect Worked Examples'],
  [/incorrectWorkedExample(\d+)/, (_, n) => `Incorrect Worked Example ${n}`],
  [/coreActivity/, () => 'Core Activity'],
  [/discussionQuestions/, () => 'Discussion Questions'],
  [/studentGroupings/, () => 'Student Groupings'],
  [/whatStudentsDo/, () => 'What Students Do'],
  [/whatYouDo/, () => "What You'll Do"],
  [/aiRecommendation/, () => 'AI Recommendation'],
  [/highFlyers/, () => 'High Flyers'],
];

const FIELD_PATTERN = new RegExp(
  '(' + FIELD_REPLACEMENTS.map(([re]) => re.source).join('|') + ')',
  'g'
);

function getLabel(matched) {
  for (const [re, labelFn] of FIELD_REPLACEMENTS) {
    const m = new RegExp('^' + re.source + '$').exec(matched);
    if (m) return labelFn(...m);
  }
  return matched;
}

function formatText(text) {
  if (!text || typeof text !== 'string') return text;
  const parts = [];
  let lastIndex = 0;
  let match;
  FIELD_PATTERN.lastIndex = 0;
  while ((match = FIELD_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<strong key={match.index}>{getLabel(match[0])}</strong>);
    lastIndex = FIELD_PATTERN.lastIndex;
  }
  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/**
 * Shared "Full View" modal used by both RecommendedNextSteps and YourNextSteps.
 *
 * Notes:
 * - This intentionally reuses the existing CSS selectors from RecommendedNextSteps.css
 *   (rns-modal-overlay, rns-modal, full-view-modal, etc.) to keep visuals consistent.
 */
/**
 * Renders a worked example's incorrectWork string with error lines highlighted.
 * Lines containing ← are the "teacher" annotation lines.
 * teacherView=true  → show annotations highlighted in orange
 * teacherView=false → strip the ← annotation and show just the math line
 */
function WorkedExampleText({ text, teacherView }) {
  if (!text) return null;
  const lines = text.split('\n');
  // Find the last non-empty line index — that's the final answer, hidden in student view
  let lastNonEmptyIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== '') { lastNonEmptyIdx = i; break; }
  }

  return (
    <span style={{ display: 'block', whiteSpace: 'pre-wrap' }}>
      {lines.map((line, i) => {
        const isAnswer = i === lastNonEmptyIdx;
        const hasAnnotation = line.includes('←');

        // Student view: hide the final answer line entirely
        if (!teacherView && isAnswer) return null;

        if (hasAnnotation) {
          if (!teacherView) {
            // Strip the annotation — keep only the math portion before the ←
            const mathPart = line.split('←')[0].trimEnd();
            return <span key={i} style={{ display: 'block' }}><MathText text={mathPart} /></span>;
          }
          // Teacher view: highlight the whole line
          return (
            <span key={i} style={{ display: 'block', backgroundColor: '#FFF3CD', borderLeft: '3px solid #E8A200', paddingLeft: '6px', marginLeft: '-6px', color: '#7A4600', fontWeight: 600 }}>
              <MathText text={line} />
            </span>
          );
        }

        // Teacher view: highlight the answer line so it's easy to spot
        if (teacherView && isAnswer) {
          console.log("Printing line Part: ", line);
          return (
            <span key={i} style={{ display: 'block', fontWeight: 700, color: '#1B376F' }}>
              <MathText text={line} />
            </span>
          );
        }

        return <span key={i} style={{ display: 'block' }}><MathText text={line} /></span>;
      })}
    </span>
  );
}

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
  const [teacherView, setTeacherView] = useState(true);

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

            {ccssStandards?.targetObjective?.learningComponents?.length > 0 && (
              <div className="nsdm-learning-components">
                Related Learning Components: {ccssStandards.targetObjective.learningComponents.join(', ')}
              </div>
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
                        <span className="rns-activity-option-field-value"><MathText text={move.targets} /></span>
                      </div>
                    )}

                    {move.instructionalMove && (
                      <div className="rns-activity-option-field">
                        <span className="rns-activity-option-field-label">Instructional Move</span>
                        <span className="rns-activity-option-field-value"><MathText text={move.instructionalMove} /></span>
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
                            {formatText(move?.tabs?.studentGroupings?.aiRecommendation)}
                          </p>
                        </div>
                      )}

                      {move?.tabs?.studentGroupings?.groups?.map((grouping, idx) => (
                        <div key={idx} className="grouping-card" style={{ marginTop: '16px' }}>
                          <div className="grouping-header">
                            <h4 className="grouping-title">{grouping.name}</h4>
                            <p className="grouping-description">{formatText(grouping.description)}</p>
                          </div>
                          {grouping.students?.length > 0 && (
                            <div className="grouping-students">
                              <h5 className="grouping-subtitle">Students:</h5>
                              <ul className="student-list">
                                {sortStudentNames(grouping.students).map((student, studentIdx) => (
                                  <li key={studentIdx}>{student}</li>
                                ))}
                              </ul>
                            </div>
                          )}
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
                          {move?.tabs?.studentGroupings?.highFlyers?.students?.length > 0 && (
                            <div className="high-flyers-students">
                              <h5 className="high-flyers-subtitle">Students:</h5>
                              <ul className="student-list">
                                {sortStudentNames(move.tabs.studentGroupings.highFlyers.students).map((student, idx) => (
                                  <li key={idx}>{student}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">What will students do</h4>
                    <ul className="tab-section-bullets">
                      {(move?.tabs?.overview?.whatStudentsDo ?? []).map((bullet, i) => (
                        <li key={i}><strong>{formatText(bullet.label)}:</strong> <MathText text={bullet.detail} /></li>
                      ))}
                    </ul>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">What you'll do</h4>
                    <ul className="tab-section-bullets">
                      {(move?.tabs?.overview?.whatYouDo ?? []).map((bullet, i) => (
                        <li key={i}><strong>{formatText(bullet.label)}:</strong> <MathText text={bullet.detail} /></li>
                      ))}
                    </ul>
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
                        <li key={idx}>{formatText(item)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">Problem</h4>
                    <p className="tab-section-content"><MathText text={move?.tabs?.activitySteps?.problem} /></p>
                  </div>

                  {move?.tabs?.activitySteps?.incorrectWorkedExamples?.length > 0 && (
                    <div className="tab-section">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h4 className="tab-section-title" style={{ margin: 0 }}>Incorrect Worked Examples</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <button
                            onClick={() => setTeacherView(false)}
                            style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              border: '1px solid #C0C8D8',
                              background: !teacherView ? '#1B376F' : '#fff',
                              color: !teacherView ? '#fff' : '#555',
                              cursor: 'pointer',
                              fontWeight: !teacherView ? 600 : 400,
                            }}
                          >
                            Student
                          </button>
                          <button
                            onClick={() => setTeacherView(true)}
                            style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              border: '1px solid #C0C8D8',
                              background: teacherView ? '#1B376F' : '#fff',
                              color: teacherView ? '#fff' : '#555',
                              cursor: 'pointer',
                              fontWeight: teacherView ? 600 : 400,
                            }}
                          >
                            Teacher
                          </button>
                        </div>
                      </div>
                      {move.tabs.activitySteps.incorrectWorkedExamples.map((ex, i) => (
                        <div key={i} className="worked-example">
                          <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Incorrect Worked Example {i + 1}
                          </p>
                          <p className="worked-example-problem"><MathText text={ex.problem} /></p>
                          <p className="worked-example-work" style={{ whiteSpace: 'normal' }}>
                            <WorkedExampleText text={ex.incorrectWork} teacherView={teacherView} />
                          </p>
                        </div>
                      ))}
                      <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
                        {teacherView
                          ? 'Highlighted lines show where the misconception error occurs. Final answer shown in bold.'
                          : 'Student view hides the error annotation and final answer.'}
                      </p>
                    </div>
                  )}

                  <div className="tab-section">
                    <h4 className="tab-section-title">Core Activity</h4>
                    <ol className="tab-list">
                      {move?.tabs?.activitySteps?.coreActivity?.map((item, idx) => (
                        <li key={idx}><MathText text={item} /></li>
                      ))}
                    </ol>
                  </div>

                  <div className="tab-section">
                    <h4 className="tab-section-title">Discussion Questions</h4>
                    <ul className="discussion-questions">
                      {move?.tabs?.activitySteps?.discussionQuestions?.map((question, idx) => (
                        <li key={idx}>
                          <strong>Q{idx + 1}:</strong> <MathText text={question} />
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
