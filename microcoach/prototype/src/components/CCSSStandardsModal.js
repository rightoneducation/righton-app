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

  const getSampleProblem = (standard) => {
    // Sample problems for different standards
    const problems = {
      '6.EE.3': {
        problem: 'Simplify: 3(x + 4) - 2x',
        answer: 'x + 12',
        explanation: 'Students must distribute the 3 to both terms inside parentheses, then combine like terms.'
      },
      '7.NS.1': {
        problem: 'Calculate: -5 + 3 - (-2)',
        answer: '0',
        explanation: 'Students must understand that subtracting a negative is the same as adding a positive.'
      },
      '8.EE.7': {
        problem: 'Solve: 2(3x - 4) = 10',
        answer: 'x = 3',
        explanation: 'Students must distribute, then solve the resulting two-step equation.'
      },
      '8.EE.8': {
        problem: 'Solve the system: y = 2x + 1, y = -x + 4',
        answer: 'x = 1, y = 3',
        explanation: 'Students must set the equations equal and solve for x, then substitute to find y.'
      },
      'A.SSE.1': {
        problem: 'Interpret: 5(2x - 3) + 4',
        answer: 'Five times the quantity of two x minus three, plus four',
        explanation: 'Students must understand how each part of the expression relates to the whole.'
      },
      '5.NF.1': {
        problem: 'Add: 1/3 + 1/4',
        answer: '7/12',
        explanation: 'Students must find a common denominator before adding fractions.'
      },
      '5.NF.2': {
        problem: 'Solve: Sarah ate 1/3 of a pizza and John ate 1/4. How much did they eat together?',
        answer: '7/12 of the pizza',
        explanation: 'Students must add fractions with unlike denominators to solve real-world problems.'
      },
      '6.NS.1': {
        problem: 'Calculate: 2/3 ÷ 1/4',
        answer: '8/3 or 2 2/3',
        explanation: 'Students must multiply by the reciprocal when dividing fractions.'
      },
      '4.NF.1': {
        problem: 'Show that 2/3 = 4/6 using multiplication',
        answer: '2/3 × 2/2 = 4/6',
        explanation: 'Students must understand that multiplying numerator and denominator by the same number creates an equivalent fraction.'
      },
      '4.NF.2': {
        problem: 'Compare: 3/4 and 2/3',
        answer: '3/4 > 2/3',
        explanation: 'Students must find common denominators or convert to decimals to compare.'
      },
      '6.EE.1': {
        problem: 'Evaluate: 2³ + 4 × 2',
        answer: '16',
        explanation: 'Students must follow order of operations: exponents first, then multiplication, then addition.'
      },
      '6.EE.2': {
        problem: 'Write an expression for: "three times a number plus five"',
        answer: '3x + 5',
        explanation: 'Students must translate words into algebraic expressions.'
      },
      '7.EE.3': {
        problem: 'Solve: 0.5x + 2 = 7',
        answer: 'x = 10',
        explanation: 'Students must solve multi-step equations with rational numbers.'
      },
      '5.OA.1': {
        problem: 'Evaluate: 3 × (4 + 2)²',
        answer: '108',
        explanation: 'Students must follow order of operations: parentheses first, then exponents, then multiplication.'
      },
      '5.OA.2': {
        problem: 'Write: "Add 8 and 7, then multiply by 2"',
        answer: '2 × (8 + 7)',
        explanation: 'Students must use parentheses to group operations that should be performed first.'
      },
      '6.EE.5': {
        problem: 'Is x = 4 a solution to: 3x = 12?',
        answer: 'Yes',
        explanation: 'Students must substitute the value and check if the equation is true.'
      },
      '6.EE.7': {
        problem: 'Solve: x + 5 = 12',
        answer: 'x = 7',
        explanation: 'Students must isolate the variable by performing inverse operations.'
      },
      '7.EE.4': {
        problem: 'Write and solve: "Five less than twice a number is 11"',
        answer: '2x - 5 = 11; x = 8',
        explanation: 'Students must translate words into equations and solve for the variable.'
      },
      '3.OA.4': {
        problem: 'Find the unknown: 8 × ? = 40',
        answer: '5',
        explanation: 'Students must understand the relationship between multiplication and division.'
      },
      '3.OA.6': {
        problem: 'Rewrite: 24 ÷ 6 = ? as a multiplication problem',
        answer: '6 × ? = 24',
        explanation: 'Students must understand that division is the inverse of multiplication.'
      }
    };
    
    return problems[standard.standard] || {
      problem: `Sample problem for ${standard.standard}`,
      answer: 'Answer would depend on specific standard',
      explanation: 'This is a sample problem to demonstrate mastery of the standard.'
    };
  };

  const currentProblem = getSampleProblem(currentSelectedStandard);

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

              <div className="sample-problem-section">
                <h6 className="detail-title">Sample Assessment Problem</h6>
                <div className="problem-container">
                  <div className="problem-statement">
                    <strong>Problem:</strong> {currentProblem.problem}
                  </div>
                  <div className="problem-answer">
                    <strong>Answer:</strong> {currentProblem.answer}
                  </div>
                  <div className="problem-explanation">
                    <strong>Explanation:</strong> {currentProblem.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCSSStandardsModal;