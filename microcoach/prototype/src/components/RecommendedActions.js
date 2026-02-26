import React, { useState } from 'react';
import './RecommendedActions.css';

const RecommendedActions = ({ showCompleted = false }) => {
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actions, setActions] = useState([
    {
      id: 1,
      priority: "Critical",
      title: "Distributing negative signs in multi-step equations",
      description: "Many students are struggling to distribute negative signs correctly in equations like 3(2x - 4) = 18, writing 6x - 4 instead of 6x - 12. This indicates confusion about the distributive property with negative terms.",
      action: "Whole-Class Problem Solving - Work through one problem together as a class",
      timeframe: "Next class period",
      affectedStudents: "Most of class (72%)",
      dataSource: "Daily Practice Problems",
      remediationType: "Grade-Level Support",
      ccssStandard: "8.EE.7",
      targetObjective: {
        standard: "8.EE.7",
        description: "Solve linear equations in one variable"
      },
      prerequisiteGaps: [
        {
          standard: "6.EE.3",
          description: "Apply properties of operations to generate equivalent expressions",
          gapDescription: "Students struggle with distributive property basics"
        },
        {
          standard: "7.NS.1",
          description: "Apply properties of operations with rational numbers",
          gapDescription: "Confusion with negative number operations"
        }
      ]
    },
    {
      id: 2,
      priority: "Critical",
      title: "Adding and subtracting integers in algebraic expressions",
      description: "Students are making sign errors when combining like terms, such as calculating 3x + (-5x) = 8x instead of -2x. This suggests gaps in integer operation understanding.",
      action: "Concrete-Representational-Abstract Progression - Use number lines and manipulatives",
      timeframe: "This week",
      affectedStudents: "Emma L., Jordan P., Alex M., and 8 others",
      dataSource: "Combining Like Terms Quiz",
      remediationType: "Below Grade-Level Gap",
      ccssStandard: "7.NS.1",
      targetObjective: {
        standard: "8.EE.1",
        description: "Know and apply the properties of integer exponents to generate equivalent numerical expressions"
      },
      prerequisiteGaps: [
        {
          standard: "7.NS.1",
          description: "Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers",
          gapDescription: "Students struggle with integer operations and sign rules"
        }
      ]
    },
    {
      id: 3,
      priority: "High",
      title: "Adding fractions with variables in denominators",
      description: "Students are incorrectly adding fractions by adding denominators: x/3 + x/4 = 2x/7. This shows fundamental fraction operation misconceptions affecting algebraic work.",
      action: "Error Analysis in Small Groups - Analyze incorrect solutions together",
      timeframe: "Next 2 class periods",
      affectedStudents: "Sarah K., Mike R., and 6 others",
      dataSource: "Algebraic Fractions Assessment",
      remediationType: "Below Grade-Level Gap",
      ccssStandard: "6.NS.1",
      targetObjective: {
        standard: "8.EE.2",
        description: "Use square root and cube root symbols to represent solutions to equations"
      },
      prerequisiteGaps: [
        {
          standard: "6.NS.1",
          description: "Interpret and compute quotients of fractions",
          gapDescription: "Students struggle with basic fraction operations and common denominators"
        },
        {
          standard: "7.EE.1",
          description: "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients",
          gapDescription: "Confusion about how fraction operations apply to algebraic expressions"
        }
      ]
    },
    {
      id: 4,
      priority: "Medium",
      title: "Solving one-step equations with fractions",
      description: "Students struggle with equations like x/4 = 12, showing uncertainty about whether to multiply or divide both sides by 4. This affects their ability to solve more complex equations.",
      action: "Multiple Representation Web - Connect equations, models, and real-world contexts",
      timeframe: "Next week",
      affectedStudents: "Mixed ability groups (45%)",
      dataSource: "One-Step Equations Practice",
      remediationType: "Grade-Level Support",
      ccssStandard: "8.EE.7",
      targetObjective: {
        standard: "8.EE.7",
        description: "Solve linear equations in one variable"
      },
      prerequisiteGaps: [
        {
          standard: "6.EE.7",
          description: "Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q",
          gapDescription: "Students struggle with inverse operations and understanding what it means to 'undo' operations"
        }
      ]
    },
    {
      id: 5,
      priority: "Medium",
      title: "Order of operations with variables and exponents",
      description: "Students are incorrectly evaluating expressions like 2x² + 3x when x = 4, getting incorrect results. This shows confusion about exponent evaluation order.",
      action: "Misconception Confrontation - Compare correct vs incorrect solutions",
      timeframe: "Next week",
      affectedStudents: "Taylor S., David L., and 4 others",
      dataSource: "Expression Evaluation Homework",
      remediationType: "Below Grade-Level Gap",
      ccssStandard: "7.EE.1",
      targetObjective: {
        standard: "8.EE.1",
        description: "Know and apply the properties of integer exponents to generate equivalent numerical expressions"
      },
      prerequisiteGaps: [
        {
          standard: "7.EE.1",
          description: "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients",
          gapDescription: "Students struggle with order of operations, especially with exponents and variables"
        },
        {
          standard: "6.EE.1",
          description: "Write and evaluate numerical expressions involving whole-number exponents",
          gapDescription: "Basic exponent evaluation confusion affects algebraic work"
        }
      ]
    }
  ]);

  const [completedActions, setCompletedActions] = useState([]);
  const [completingAction, setCompletingAction] = useState(null);
  const [dismissingAction, setDismissingAction] = useState(null);

  const handleViewInterventions = (actionId) => {
    const action = actions.find(a => a.id === actionId);
    setSelectedAction(action);
    setShowInterventionModal(true);
  };

  const handleCloseInterventionModal = () => {
    setShowInterventionModal(false);
    setSelectedAction(null);
  };

  const handleDismiss = (actionId) => {
    const action = actions.find(a => a.id === actionId);
    setDismissingAction(actionId);
    
    setTimeout(() => {
      setActions(actions.filter(a => a.id !== actionId));
      setCompletedActions([...completedActions, { ...action, completedAt: new Date(), status: 'dismissed' }]);
      setDismissingAction(null);
    }, 600);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return '#CC5500';
      case 'High':
        return '#1B376F';
      case 'Medium':
        return '#6B7280';
      case 'Low':
        return '#9CA3AF';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="recommended-actions">
      <div className="actions-header">
        <div className="header-content">
          <h3 className="actions-title">Recommended Next Steps</h3>
        </div>
        {!showCompleted && completedActions.length > 0 && (
          <button 
            className="view-completed-btn"
            onClick={() => setShowCompletedModal(true)}
          >
            View Past Actions ({completedActions.length})
          </button>
        )}
      </div>
      
      <div className="actions-scroll-container">
        <div className="actions-grid">
          {showCompleted ? (
            completedActions.map((action) => (
              <div key={action.id} className={`action-card completed-card ${action.status}`}>
                <div className="completion-indicator">
                  {action.status === 'completed' ? '✓' : '✕'}
                </div>
                <div className="card-priority">
                  <span 
                    className={`priority-badge ${action.priority === 'Critical' ? 'critical-priority' : ''}`}
                    style={{ backgroundColor: getPriorityColor(action.priority) }}
                  >
                    {action.priority}
                  </span>
                </div>
                
                <div className="card-content">
                  <h4 className="card-title">{action.title}</h4>
                  <p className="card-description">{action.description}</p>
                  
                  <div className="card-details">
                    <div className="card-meta">
                      <span className="meta-label">Action:</span>
                      <span className="meta-value">{action.action}</span>
                    </div>
                    <div className="card-meta">
                      <span className="meta-label">Status:</span>
                      <span className="meta-value">{action.status === 'completed' ? 'Completed' : 'Dismissed'}</span>
                    </div>
                    <div className="card-meta">
                      <span className="meta-label">Time:</span>
                      <span className="meta-value">{action.completedAt.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            actions.map((action) => (
              <div key={action.id} className={`action-card ${
                completingAction === action.id ? 'completing' : 
                dismissingAction === action.id ? 'dismissing' : ''
              }`}>
                {completingAction === action.id && (
                  <div className="feedback-overlay">
                    <div className="checkmark">✓</div>
                  </div>
                )}
                {dismissingAction === action.id && (
                  <div className="feedback-overlay dismiss">
                    <div className="dismiss-x">✕</div>
                  </div>
                )}
                
                <div className="card-priority">
                  <span 
                    className={`priority-badge ${action.priority === 'Critical' ? 'critical-priority' : ''}`}
                    style={{ backgroundColor: getPriorityColor(action.priority) }}
                  >
                    {action.priority}
                  </span>
                </div>
                
                <div className="card-content">
                  <h4 className="card-title">{action.title}</h4>
                  <p className="card-description">{action.description}</p>
                  
                  {/* Related Learning Objectives */}
                  {action.targetObjective && (
                    <div className="card-section">
                      <span className="section-label">Related Learning Objectives</span>
                      <div className="objective-item-row">
                        <span className="ccss-tag target-objective">
                          {action.targetObjective.standard}
                        </span>
                        <span className="section-value objective-description">
                          {action.targetObjective.description}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Prerequisite Gaps */}
                  {action.prerequisiteGaps && action.prerequisiteGaps.length > 0 && (
                    <div className="card-section">
                      <span className="section-label">Prerequisite Gaps Identified</span>
                      <div className="gap-descriptions">
                        {action.prerequisiteGaps.map((gap, index) => (
                          <div key={index} className="gap-item-row">
                            <span className="ccss-tag prerequisite-gap">
                              {gap.standard}
                            </span>
                            <span className="section-value gap-description">
                              {gap.gapDescription}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="card-section target-students">
                    <span className="section-label">Target Students</span>
                    <span className="section-value">{action.affectedStudents}</span>
                  </div>
                  
                  <div className="card-section recommended-activity">
                    <span className="section-label">Recommended Activity</span>
                    <span className="section-value">{action.action}</span>
                  </div>
                  
                  <div className="card-buttons">
                    <button 
                      className="card-btn view-next-steps-btn"
                      onClick={() => handleViewInterventions(action.id)}
                    >
                      View activity
                    </button>
                    <button 
                      className="card-btn not-needed-btn"
                      onClick={() => handleDismiss(action.id)}
                      disabled={completingAction === action.id || dismissingAction === action.id}
                    >
                      Not Needed
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Intervention Details Modal */}
      {showInterventionModal && selectedAction && (
        <div className="modal-overlay" onClick={handleCloseInterventionModal}>
          <div className="intervention-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedAction.title}</h3>
              <button 
                className="close-btn"
                onClick={handleCloseInterventionModal}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="intervention-content">
                {selectedAction.id === 1 && (
                  <div className="activity-section">
                    <h4>Recommended Activity: Solve this problem as a class together</h4>
                    
                    <div className="problem-section">
                      <h5>Problem:</h5>
                      <div className="problem-display">
                        <p><strong>Solve for x:</strong> 3(2x - 4) = 18</p>
                      </div>
                    </div>

                    <div className="teacher-summary-section">
                      <h5>What You Can Do:</h5>
                      <div className="process-steps">
                        <div className="process-step">
                          <span className="process-number">1.</span>
                          <span className="process-text">Present the problem to the class: 3(2x - 4) = 18</span>
                        </div>
                        <div className="process-step">
                          <span className="process-number">2.</span>
                          <span className="process-text">Call on students to help solve each step, focusing on the distribution</span>
                        </div>
                        <div className="process-step">
                          <span className="process-number">3.</span>
                          <span className="process-text">When students make the common error (6x - 4), pause and discuss why this is incorrect</span>
                        </div>
                        <div className="process-step">
                          <span className="process-number">4.</span>
                          <span className="process-text">Guide them to the correct distribution: 3(2x - 4) = 6x - 12</span>
                        </div>
                        <div className="process-step">
                          <span className="process-number">5.</span>
                          <span className="process-text">Complete the problem together and verify the solution</span>
                        </div>
                      </div>
                    </div>

                    <div className="microsteps-section">
                      <h5>Breakdown of the Process:</h5>
                      <div className="microsteps-list">
                        <div className="microstep">
                          <span className="step-number">1.</span>
                          <div className="step-content">
                            <strong>Distribute the 3:</strong> 3(2x - 4) = 6x - 12
                            <div className="error-note class-specific">⚠️ Common Error in Your Class: Your class tends to write 6x - 4 (forgetting to distribute to both terms)</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">2.</span>
                          <div className="step-content">
                            <strong>Rewrite equation:</strong> 6x - 12 = 18
                            <div className="error-note possible">Possible common error: Sign confusion when moving terms</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">3.</span>
                          <div className="step-content">
                            <strong>Add 12 to both sides:</strong> 6x = 30
                            <div className="error-note possible">Possible common error: Adding instead of subtracting, or vice versa</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">4.</span>
                          <div className="step-content">
                            <strong>Divide by 6:</strong> x = 5
                            <div className="error-note possible">Possible common error: Arithmetic mistakes in division</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">5.</span>
                          <div className="step-content">
                            <strong>Check solution:</strong> 3(2(5) - 4) = 3(10 - 4) = 3(6) = 18 ✓
                            <div className="error-note possible">Possible common error: Students often skip this verification step</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="discussion-questions-section">
                      <h5>Discussion Questions (Focus on Distribution Error):</h5>
                      <div className="questions-list">
                        <div className="question-group">
                          <ul>
                            <li>
                              "What does it mean to distribute? Can you show me with your hands?"
                              <br /><em>Helps students visualize the concept physically</em>
                            </li>
                            <li>
                              "If I have 3 groups of (2x - 4), how many total x's do I have? How many -4's?"
                              <br /><em>Reinforces that distribution applies to ALL terms</em>
                            </li>
                            <li>
                              "What happens to the negative sign when we distribute?"
                              <br /><em>Addresses the specific error your class makes</em>
                            </li>
                            <li>
                              "Why do we multiply 3 by BOTH terms inside the parentheses?"
                              <br /><em>Prevents the common mistake of only distributing to the first term</em>
                            </li>
                            <li>
                              "What's the difference between 6x - 4 and 6x - 12?"
                              <br /><em>Directly contrasts the wrong and right answers</em>
                            </li>
                            <li>
                              "How can we check if our distribution is correct?"
                              <br /><em>Builds verification habits</em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="high-flyers-section">
                      <h5>High Flyers</h5>
                      <div className="high-flyers-list">
                        <div className="high-flyer-student">Emma L.</div>
                        <div className="high-flyer-student">Taylor S.</div>
                        <div className="high-flyer-student">Mike R.</div>
                      </div>
                      <p className="high-flyers-note">These students have mastered this concept and can help explain or demonstrate solutions to the class. You can call on them in discussions or group them strategically.</p>
                    </div>
                  </div>
                )}

                {selectedAction.id === 2 && (
                  <div className="activity-section">
                    <h4>Use number lines and manipulatives to build understanding</h4>
                    
                    <div className="problem-section">
                      <h5>Problem:</h5>
                      <div className="problem-display">
                        <p><strong>Combine like terms:</strong> 3x + (-5x) = ?</p>
                      </div>
                    </div>

                    <div className="teacher-summary-section">
                      <h5>What You Should Do:</h5>
                      <p className="teacher-summary">Use concrete manipulatives and number lines to help students visualize integer operations with variables. Start with concrete representations, move to visual models, then connect to abstract algebraic notation. Focus on the sign rules that are causing confusion.</p>
                    </div>

                    <div className="microsteps-section">
                      <h5>Concrete-Representational-Abstract Progression:</h5>
                      <div className="microsteps-list">
                        <div className="microstep">
                          <span className="step-number">1.</span>
                          <div className="step-content">
                            <strong>Concrete (Manipulatives):</strong> Use positive and negative tiles to represent 3x and -5x
                            <div className="error-note class-specific">⚠️ Common Error in Your Class: Students add instead of subtract when they see negative signs</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">2.</span>
                          <div className="step-content">
                            <strong>Representational (Visual):</strong> Draw number line showing movement from 3x to -5x
                            <div className="error-note possible">Possible common error: Confusion about direction of movement on number line</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">3.</span>
                          <div className="step-content">
                            <strong>Abstract (Symbolic):</strong> Connect to algebraic notation: 3x + (-5x) = -2x
                            <div className="error-note possible">Possible common error: Writing 8x instead of -2x</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="discussion-questions-section">
                      <h5>Discussion Questions (Focus on Integer Operations):</h5>
                      <div className="questions-list">
                        <div className="question-group">
                          <ul>
                            <li>
                              "What does it mean to have negative x's? How can we show this with our tiles?"
                              <br /><em>Helps students understand negative coefficients</em>
                            </li>
                            <li>
                              "If I start with 3 positive x's and take away 5 x's, what happens?"
                              <br /><em>Reinforces the subtraction concept</em>
                            </li>
                            <li>
                              "How is 3x + (-5x) different from 3x - 5x?"
                              <br /><em>Addresses notation confusion</em>
                            </li>
                            <li>
                              "Can you show me on the number line what happens when we combine these terms?"
                              <br /><em>Visual representation of the operation</em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="high-flyers-section">
                      <h5>Students Who Don't Need This Activity</h5>
                      <div className="high-flyers-list">
                        <div className="high-flyer-student">Sarah K.</div>
                        <div className="high-flyer-student">Mike R.</div>
                        <div className="high-flyer-student">David L.</div>
                      </div>
                      <p className="high-flyers-note">These students have mastered integer operations. Give them extension problems with more complex expressions or have them help explain concepts to struggling classmates.</p>
                    </div>
                  </div>
                )}

                {selectedAction.id === 3 && (
                  <div className="activity-section">
                    <h4>Analyze incorrect solutions in small groups</h4>
                    
                    <div className="problem-section">
                      <h5>Problem:</h5>
                      <div className="problem-display">
                        <p><strong>Add the fractions:</strong> x/3 + x/4 = ?</p>
                      </div>
                    </div>

                    <div className="teacher-summary-section">
                      <h5>What You Should Do:</h5>
                      <p className="teacher-summary">Give groups incorrect solutions to analyze. Students work together to find errors, explain why they're wrong, and provide correct solutions. This builds critical thinking and helps students recognize common mistakes.</p>
                    </div>

                    <div className="microsteps-section">
                      <h5>Error Analysis Activity Steps:</h5>
                      <div className="microsteps-list">
                        <div className="microstep">
                          <span className="step-number">1.</span>
                          <div className="step-content">
                            <strong>Present Incorrect Solution:</strong> x/3 + x/4 = 2x/7 (adding denominators)
                            <div className="error-note class-specific">⚠️ Common Error in Your Class: Students add denominators instead of finding common denominators</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">2.</span>
                          <div className="step-content">
                            <strong>Groups Identify Error:</strong> Students discuss what's wrong with the solution
                            <div className="error-note possible">Possible difficulty: Students may not immediately see the error</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">3.</span>
                          <div className="step-content">
                            <strong>Correct Solution:</strong> x/3 + x/4 = 4x/12 + 3x/12 = 7x/12
                            <div className="error-note possible">Possible common error: Mistakes in finding LCD or converting fractions</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="discussion-questions-section">
                      <h5>Discussion Questions (Focus on Fraction Operations):</h5>
                      <div className="questions-list">
                        <div className="question-group">
                          <ul>
                            <li>
                              "What's wrong with adding x/3 + x/4 = 2x/7?"
                              <br /><em>Gets students to identify the specific error</em>
                            </li>
                            <li>
                              "Why can't we just add denominators like we add numerators?"
                              <br /><em>Addresses the fundamental misconception</em>
                            </li>
                            <li>
                              "How is adding fractions with variables different from adding regular fractions?"
                              <br /><em>Connects to prior knowledge</em>
                            </li>
                            <li>
                              "What's the correct way to add these fractions?"
                              <br /><em>Guides toward the right method</em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="high-flyers-section">
                      <h5>Students Who Don't Need This Activity</h5>
                      <div className="high-flyers-list">
                        <div className="high-flyer-student">Emma L.</div>
                        <div className="high-flyer-student">Jordan P.</div>
                        <div className="high-flyer-student">Alex M.</div>
                      </div>
                      <p className="high-flyers-note">These students understand fraction operations. Have them create their own incorrect solutions for other groups to analyze, or work on more complex algebraic fraction problems.</p>
                    </div>
                  </div>
                )}

                {selectedAction.id === 4 && (
                  <div className="activity-section">
                    <h4>Connect equations, models, and real-world contexts</h4>
                    
                    <div className="problem-section">
                      <h5>Problem:</h5>
                      <div className="problem-display">
                        <p><strong>Solve for x:</strong> x/4 = 12</p>
                      </div>
                    </div>

                    <div className="teacher-summary-section">
                      <h5>What You Should Do:</h5>
                      <p className="teacher-summary">Show students the same equation in multiple ways: algebraic symbols, visual models, tables, and real-world contexts. Help them see connections between different representations and understand inverse operations.</p>
                    </div>

                    <div className="microsteps-section">
                      <h5>Multiple Representation Web:</h5>
                      <div className="microsteps-list">
                        <div className="microstep">
                          <span className="step-number">1.</span>
                          <div className="step-content">
                            <strong>Algebraic:</strong> x/4 = 12, so x = 12 × 4 = 48
                            <div className="error-note class-specific">⚠️ Common Error in Your Class: Students unsure whether to multiply or divide both sides</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">2.</span>
                          <div className="step-content">
                            <strong>Visual Model:</strong> Draw 4 equal groups, each containing 12 items
                            <div className="error-note possible">Possible difficulty: Students may struggle to connect visual to algebraic</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">3.</span>
                          <div className="step-content">
                            <strong>Real-World Context:</strong> "If 4 friends split x dollars equally and each gets $12, how much money was there originally?"
                            <div className="error-note possible">Possible common error: Setting up the equation incorrectly from word problems</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="discussion-questions-section">
                      <h5>Discussion Questions (Focus on Inverse Operations):</h5>
                      <div className="questions-list">
                        <div className="question-group">
                          <ul>
                            <li>
                              "What operation is being done to x in the equation x/4 = 12?"
                              <br /><em>Helps students identify the operation</em>
                            </li>
                            <li>
                              "What's the opposite of dividing by 4?"
                              <br /><em>Introduces inverse operations concept</em>
                            </li>
                            <li>
                              "How can we 'undo' the division to solve for x?"
                              <br /><em>Connects to the solution method</em>
                            </li>
                            <li>
                              "Does our answer make sense when we check it?"
                              <br /><em>Builds verification habits</em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="high-flyers-section">
                      <h5>Students Who Don't Need This Activity</h5>
                      <div className="high-flyers-list">
                        <div className="high-flyer-student">Sarah K.</div>
                        <div className="high-flyer-student">Mike R.</div>
                        <div className="high-flyer-student">Taylor S.</div>
                      </div>
                      <p className="high-flyers-note">These students understand inverse operations. Have them work on multi-step equations or create their own word problems for classmates to solve.</p>
                    </div>
                  </div>
                )}

                {selectedAction.id === 5 && (
                  <div className="activity-section">
                    <h4>Compare correct vs incorrect solutions</h4>
                    
                    <div className="problem-section">
                      <h5>Problem:</h5>
                      <div className="problem-display">
                        <p><strong>Evaluate when x = 4:</strong> 2x² + 3x</p>
                      </div>
                    </div>

                    <div className="teacher-summary-section">
                      <h5>What You Should Do:</h5>
                      <p className="teacher-summary">Present both correct and incorrect solutions side by side. Have students debate which is right and explain their reasoning. Use mathematical evidence to resolve disagreements and explicitly address the order of operations misconception.</p>
                    </div>

                    <div className="microsteps-section">
                      <h5>Misconception Confrontation:</h5>
                      <div className="microsteps-list">
                        <div className="microstep">
                          <span className="step-number">1.</span>
                          <div className="step-content">
                            <strong>Present Incorrect Solution:</strong> 2x² + 3x = 2(4)² + 3(4) = 8² + 12 = 64 + 12 = 76
                            <div className="error-note class-specific">⚠️ Common Error in Your Class: Students evaluate (2×4)² instead of 2×(4²)</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">2.</span>
                          <div className="step-content">
                            <strong>Present Correct Solution:</strong> 2x² + 3x = 2(4²) + 3(4) = 2(16) + 12 = 32 + 12 = 44
                            <div className="error-note possible">Possible difficulty: Students may not see the difference initially</div>
                          </div>
                        </div>
                        <div className="microstep">
                          <span className="step-number">3.</span>
                          <div className="step-content">
                            <strong>Debate and Resolve:</strong> Students vote and explain which solution is correct
                            <div className="error-note possible">Possible common error: Confusion about order of operations with exponents</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="discussion-questions-section">
                      <h5>Discussion Questions (Focus on Order of Operations):</h5>
                      <div className="questions-list">
                        <div className="question-group">
                          <ul>
                            <li>
                              "What's the difference between 2x² and (2x)²?"
                              <br /><em>Addresses the core misconception</em>
                            </li>
                            <li>
                              "Which operation do we do first: the exponent or the multiplication?"
                              <br /><em>Reinforces order of operations</em>
                            </li>
                            <li>
                              "How can we remember the correct order when we have variables and exponents?"
                              <br /><em>Builds strategies for future problems</em>
                            </li>
                            <li>
                              "What happens if we use parentheses to show the order clearly?"
                              <br /><em>Connects to explicit notation</em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="high-flyers-section">
                      <h5>Students Who Don't Need This Activity</h5>
                      <div className="high-flyers-list">
                        <div className="high-flyer-student">Emma L.</div>
                        <div className="high-flyer-student">Jordan P.</div>
                        <div className="high-flyer-student">Sarah K.</div>
                      </div>
                      <p className="high-flyers-note">These students understand order of operations. Give them more complex expressions with multiple variables and operations, or have them create misconception examples for class discussion.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Actions Modal */}
      {showCompletedModal && (
        <div className="modal-overlay" onClick={() => setShowCompletedModal(false)}>
          <div className="completed-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Past Actions</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCompletedModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {completedActions.length === 0 ? (
                <p className="no-actions">No completed actions yet.</p>
              ) : (
                <div className="completed-actions-list">
                  {completedActions.map((action) => (
                    <div key={action.id} className={`completed-action-item ${action.status}`}>
                      <div className="action-status-icon">
                        {action.status === 'completed' ? '✓' : '✕'}
                      </div>
                      <div className="action-info">
                        <h4 className="action-title">{action.title}</h4>
                        <p className="action-description">{action.description}</p>
                        <div className="action-meta">
                          <span className="status-text">
                            {action.status === 'completed' ? 'Completed' : 'Dismissed'}
                          </span>
                          <span className="time-text">
                            {action.completedAt.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedActions;
