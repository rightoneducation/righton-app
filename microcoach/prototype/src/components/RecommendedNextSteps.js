import React, { useMemo, useState } from 'react';
import './RecommendedNextSteps.css';

// Mock: learning-gap groups and their respective next step activities.
// This is intentionally frontend-only scaffolding that we can later swap to real API/CSV-backed data.
export const buildMockGapGroups = () => {
  return [
    {
      id: 'gapgroup-1',
      title: 'Negative signs & distribution errors',
      priority: 'Critical',
      studentCount: 18,
      studentPercent: 72,
      occurrence: '1st occurrence',
      misconceptionSummary: 'Students are making conceptual errors when distributing negative signs in multi-step equations. They treat the negative sign as attached to only one term rather than applying it to all terms within parentheses. For example, in 3(2x - 4), students incorrectly calculate 6x - 4 instead of 6x - 12, showing they don\'t understand that the negative sign must be distributed to both terms.',
      successIndicators: [
        'Correctly distribute negative signs to all terms within parentheses',
        'Accurately combine like terms with proper sign handling',
        'Apply inverse operations correctly in multi-step equations'
      ],
      evidence: {
        source: 'Daily Practice Problems',
        mostCommonError: '3(2x - 4) → 6x - 4 (missed distribution to -4)',
        sampleStudentWork: [
          'Student A: 3(2x - 4) = 18 → 6x - 4 = 18 → 6x = 22',
          'Student B: 3(2x - 4) = 18 → 6x - 12 = 18 → 6x = 30 → x = 5 ✓'
        ],
        aiThinkingPattern: 'Students appear to treat the negative as "attached" to the 4, rather than a term that also must be multiplied.'
      },
      move: {
        id: 'move-1',
        title: 'Whole-class worked example + error spotlight',
        time: '20–30 min',
        format: 'Whole class → pairs',
        summary: 'Solve one canonical problem together and explicitly compare the common incorrect step to the correct one.',
        aiReasoning: 'A single high-frequency misconception suggests a worked example with targeted error analysis will give the fastest correction.',
        // New tab content
        tabs: {
          overview: {
            whatStudentsDo: 'Students will observe a worked example of distributing negative signs, then identify and correct common errors in similar problems.',
            whatYouDo: 'Model the correct distribution process step-by-step, explicitly highlighting where the negative sign applies to all terms.',
            importance: 'This misconception prevents students from correctly solving multi-step equations, which is foundational for all higher-level algebra.'
          },
          activitySteps: {
            setup: [
              'Prepare whiteboard or digital display with example problems',
              'Create error analysis worksheet with common mistakes',
              'Prepare student response cards or digital polling'
            ],
            problem: '3(2x - 4) = 18',
            coreActivity: [
              'Solve the problem correctly step-by-step on the board',
              'Show the common incorrect approach (6x - 4 = 18)',
              'Have students identify where the error occurs',
              'Practice additional problems in pairs with error analysis'
            ],
            discussionQuestions: [
              'Why does the negative sign need to be distributed to both terms?',
              'What happens if we only distribute to the first term?',
              'How can we check our work to ensure we distributed correctly?'
            ]
          },
          studentGroupings: {
            groups: [
              {
                name: 'Distribution Confusion (12 students)',
                description: 'Students who multiply the coefficient by only the first term inside parentheses',
                students: ['Alex J.', 'Brianna M.', 'Carlos S.', 'Diana L.', 'Ethan K.', 'Fiona P.', 'George R.', 'Hannah T.', 'Isaac W.', 'Julia B.', 'Kevin D.', 'Laura F.']
              },
              {
                name: 'Sign Neglect (6 students)',
                description: 'Students who forget to distribute the negative sign entirely',
                students: ['Michael C.', 'Natalie G.', 'Oliver H.', 'Patricia N.', 'Quentin O.', 'Rachel V.']
              }
            ],
            highFlyers: {
              students: ['Samuel A.', 'Tina E.', 'Victor M.'],
              description: 'These students can work on extension problems involving multiple distributions or create their own error analysis examples.'
            },
            aiRecommendation: 'Start with whole-class instruction, then have high flyers work with struggling students in pairs. Focus on the Distribution Confusion group first, as they have the most fundamental misunderstanding.'
          },
          materials: {
            required: [
              'Whiteboard or digital display',
              'Error analysis worksheets',
              'Student response cards or digital polling tools',
              'Practice problems with answer key'
            ],
            optional: [
              'Algebra tiles for visual representation',
              'Online interactive distribution tools',
              'Exit tickets for formative assessment'
            ]
          }
        }
      }
    },
    {
      id: 'gapgroup-2',
      title: 'Adding fractions & finding common denominators',
      priority: 'High',
      studentCount: 9,
      studentPercent: 36,
      occurrence: '2nd occurrence',
      misconceptionSummary: 'Students are making procedural errors when adding fractions by incorrectly adding both numerators and denominators. They apply the rule "add tops and bottoms" which works for some operations but not fraction addition. For example, in x/3 + x/4, students incorrectly calculate 2x/7 instead of finding the common denominator and getting 7x/12, showing they don\'t understand the fundamental concept of equivalent fractions.',
      successIndicators: [
        'Correctly find common denominators before adding fractions',
        'Accurately convert fractions to equivalent forms with common denominators',
        'Properly add numerators while keeping the common denominator'
      ],
      evidence: {
        source: 'Algebraic Fractions Assessment',
        mostCommonError: 'x/3 + x/4 → 2x/7',
        sampleStudentWork: [
          'Student C: x/3 + x/4 = (x+x)/(3+4) = 2x/7',
          'Student D: x/3 + x/4 = 4x/12 + 3x/12 = 7x/12 ✓'
        ],
        aiThinkingPattern: 'Students are over-generalizing "add tops and bottoms" from other fraction contexts.'
      },
      move: {
        id: 'move-2',
        title: 'Visual fraction model + LCD routine',
        time: '20 min',
        format: 'Whole class',
        summary: 'Use bar models to justify LCD before symbolic steps.',
        aiReasoning: 'Models make denominator meaning explicit and reduce procedural "shortcutting."',
        // New tab content
        tabs: {
          overview: {
            whatStudentsDo: 'Students will use visual fraction models to understand why common denominators are necessary, then practice the LCD procedure.',
            whatYouDo: 'Demonstrate fraction addition using bar models, explicitly showing why denominators must be the same before adding.',
            importance: 'Without understanding common denominators, students cannot add fractions correctly, which is essential for algebraic operations and higher math.'
          },
          activitySteps: {
            setup: [
              'Prepare fraction bar templates or digital fraction models',
              'Create practice problems with varying denominators',
              'Prepare guided notes with LCD procedure'
            ],
            problem: 'x/3 + x/4',
            coreActivity: [
              'Show fraction bars representing 1/3 and 1/4',
              'Demonstrate why we need twelfths to add them',
              'Guide students through finding LCD of 3 and 4',
              'Practice converting fractions to equivalent forms',
              'Add the numerators while keeping the common denominator'
            ],
            discussionQuestions: [
              'Why can\'t we add 1/3 + 1/4 directly?',
              'What does the common denominator represent?',
              'How do we know our answer is in simplest form?'
            ]
          },
          studentGroupings: {
            groups: [
              {
                name: 'Denominator Addition (5 students)',
                description: 'Students who add both numerators and denominators together',
                students: ['Andrew L.', 'Bethany R.', 'Christopher M.', 'Danielle S.', 'Eric T.']
              },
              {
                name: 'Random Denominator (4 students)',
                description: 'Students who pick one of the denominators without finding LCD',
                students: ['Faith K.', 'Gregory P.', 'Haley W.', 'Ian B.']
              }
            ],
            highFlyers: {
              students: ['Julia C.', 'Kevin D.', 'Laura E.'],
              description: 'These students can work on problems with three or more fractions or create visual models for the class.'
            },
            aiRecommendation: 'Use visual models extensively with the Denominator Addition group. Have high flyers create their own fraction addition problems for the class to solve.'
          },
          materials: {
            required: [
              'Fraction bar templates or digital fraction models',
              'Practice worksheets with answer key',
              'Guided notes with LCD procedure',
              'Colored pencils or markers'
            ],
            optional: [
              'Fraction manipulatives',
              'Online fraction addition games',
              'Exit tickets for assessment'
            ]
          }
        }
      }
    },
    {
      id: 'gapgroup-3',
      title: 'Order of operations confusion',
      priority: 'Medium',
      studentCount: 7,
      studentPercent: 28,
      occurrence: '3rd occurrence',
      misconceptionSummary: 'Students are making procedural errors when applying order of operations, particularly with exponents and multiplication. They often evaluate expressions left-to-right instead of following PEMDAS rules. For example, in 2x² + 3x when x=4, students incorrectly calculate 2×4² + 3×4 = 8² + 12 = 64 + 12 = 76 instead of 2×16 + 12 = 32 + 12 = 44.',
      successIndicators: [
        'Correctly apply order of operations (PEMDAS) in multi-step expressions',
        'Evaluate exponents before multiplication and addition',
        'Use parentheses to clarify operation order when needed'
      ],
      evidence: {
        source: 'Order of Operations Quiz',
        mostCommonError: '2x² + 3x → 2×4² + 3×4 = 8² + 12 = 76 (evaluating left-to-right)',
        sampleStudentWork: [
          'Student E: 2(4)² + 3(4) = 8² + 12 = 64 + 12 = 76',
          'Student F: 2(4)² + 3(4) = 2(16) + 12 = 32 + 12 = 44 ✓'
        ],
        aiThinkingPattern: 'Students are applying operations in left-to-right order rather than following the correct hierarchy of operations.'
      },
      move: {
        id: 'move-3',
        title: 'Order of operations error analysis debate',
        time: '15 min',
        format: 'Whole class',
        summary: 'Present both correct and incorrect solutions side by side. Have students debate which is right and explain their reasoning using mathematical evidence.',
        aiReasoning: 'Explicit comparison of correct vs incorrect approaches helps students internalize the proper order of operations.',
        // New tab content
        tabs: {
          overview: {
            whatStudentsDo: 'Students will analyze correct and incorrect solutions, identify the errors, and defend the correct approach using mathematical reasoning.',
            whatYouDo: 'Present side-by-side solutions, facilitate debate, and guide students to discover the correct order of operations.',
            importance: 'Order of operations is fundamental to all mathematical calculations and prevents ambiguity in expressions.'
          },
          activitySteps: {
            setup: [
              'Prepare problem sets with common order of operations errors',
              'Create debate format with clear roles',
              'Prepare visual aids showing correct order'
            ],
            problem: '2x² + 3x when x=4',
            coreActivity: [
              'Show both correct and incorrect solutions side by side',
              'Have students identify where the error occurs',
              'Facilitate debate between "correct" and "incorrect" approaches',
              'Guide students to discover why exponents come before multiplication',
              'Practice additional problems with immediate feedback'
            ],
            discussionQuestions: [
              'Why does 2(4)² equal 32 and not 64?',
              'What would happen if we always went left to right?',
              'How do parentheses change the order of operations?'
            ]
          },
          studentGroupings: {
            groups: [
              {
                name: 'Left-to-Right (4 students)',
                description: 'Students who evaluate expressions strictly from left to right',
                students: ['Jack M.', 'Karen L.', 'Mark R.', 'Nancy S.']
              },
              {
                name: 'Exponent Confusion (3 students)',
                description: 'Students who don\'t understand that exponents apply only to their base',
                students: ['Oliver P.', 'Patricia W.', 'Quentin B.']
              }
            ],
            highFlyers: {
              students: ['Rachel C.', 'Steven D.', 'Tina E.'],
              description: 'These students can create their own order of operations problems with intentional errors for classmates to find.'
            },
            aiRecommendation: 'Focus on the Left-to-Right group with explicit PEMDAS instruction. Use the Exponent Confusion group for targeted practice with exponent rules.'
          },
          materials: {
            required: [
              'Problem sets with common errors',
              'Debate format guidelines',
              'Visual aids showing correct order',
              'Practice worksheets'
            ],
            optional: [
              'Order of operations games',
              'Digital interactive tools',
              'Exit tickets for assessment'
            ]
          }
        }
      }
    },
    {
      id: 'gapgroup-4',
      title: 'Variable isolation errors',
      priority: 'Medium',
      studentCount: 6,
      studentPercent: 24,
      occurrence: '4th occurrence',
      misconceptionSummary: 'Students are making conceptual errors when isolating variables in equations. They often perform inverse operations incorrectly or forget to apply operations to both sides of the equation. For example, in 4x = 12, students incorrectly calculate x = 12 × 4 = 48 instead of x = 12 ÷ 4 = 3.',
      successIndicators: [
        'Correctly apply inverse operations to isolate variables',
        'Perform the same operation on both sides of the equation',
        'Verify solutions by substitution'
      ],
      evidence: {
        source: 'Equation Solving Assessment',
        mostCommonError: '4x = 12 → x = 12 × 4 = 48 (multiplying instead of dividing)',
        sampleStudentWork: [
          'Student G: 4x = 12 → x = 12 × 4 = 48',
          'Student H: 4x = 12 → x = 12 ÷ 4 = 3 ✓'
        ],
        aiThinkingPattern: 'Students are confusing inverse operations and not maintaining equation balance.'
      },
      move: {
        id: 'move-4',
        title: 'Balance scale visualization + algebraic connection',
        time: '20 min',
        format: 'Small groups',
        summary: 'Use physical or visual balance scales to demonstrate equation solving, then connect to algebraic notation.',
        aiReasoning: 'Concrete representations help students understand the abstract concept of equation balance and inverse operations.',
        // New tab content
        tabs: {
          overview: {
            whatStudentsDo: 'Students will use balance scale models to understand equation balance, then translate this understanding to algebraic notation.',
            whatYouDo: 'Demonstrate equation solving with balance scales, explicitly showing that operations must be performed on both sides.',
            importance: 'Understanding equation balance is fundamental to solving all types of equations and maintaining mathematical equality.'
          },
          activitySteps: {
            setup: [
              'Prepare balance scale models or digital balance simulations',
              'Create equation cards for practice',
              'Prepare guided practice worksheets'
            ],
            problem: '4x = 12',
            coreActivity: [
              'Show balance scale with 4x on one side and 12 on the other',
              'Demonstrate dividing both sides by 4 to isolate x',
              'Connect physical action to algebraic notation',
              'Practice additional problems in small groups',
              'Verify solutions by substitution'
            ],
            discussionQuestions: [
              'Why must we do the same thing to both sides of the equation?',
              'What does the balance scale represent?',
              'How do we know our solution is correct?'
            ]
          },
          studentGroupings: {
            groups: [
              {
                name: 'Inverse Operation Confusion (4 students)',
                description: 'Students who apply the wrong inverse operation',
                students: ['Uma J.', 'Victor K.', 'Wendy L.', 'Xavier M.']
              },
              {
                name: 'One-Sided Operations (2 students)',
                description: 'Students who forget to apply operations to both sides',
                students: ['Yvonne N.', 'Zachary O.']
              }
            ],
            highFlyers: {
              students: ['Alice P.', 'Brian Q.', 'Catherine R.'],
              description: 'These students can work on multi-step equations or create balance scale models for the class.'
            },
            aiRecommendation: 'Use extensive visual aids with the Inverse Operation Confusion group. Pair high flyers with struggling students for peer teaching.'
          },
          materials: {
            required: [
              'Balance scale models or digital simulations',
              'Equation practice cards',
              'Guided practice worksheets',
              'Algebra tiles (optional)'
            ],
            optional: [
              'Interactive equation solving apps',
              'Exit tickets for assessment',
              'Extension problems for advanced students'
            ]
          }
        }
      }
    }
  ];
};

const RecommendedNextSteps = ({ onAddNextStep, existingNextSteps = [] }) => {
  const [gapGroups, setGapGroups] = useState(buildMockGapGroups);
  const [toast, setToast] = useState(null);
  const [reasoningGroupId, setReasoningGroupId] = useState(null);
  const [fullViewGroupId, setFullViewGroupId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [evidenceScreen, setEvidenceScreen] = useState(1);
  const [aiPromptGroupId, setAiPromptGroupId] = useState(null);
  const [aiPromptText, setAiPromptText] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationChanges, setRegenerationChanges] = useState(null);

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


  const handleAdd = (group) => {
    const move = group.move;
    if (!move) return;

    if (existingIndex.has(`${group.id}:${move.id}`)) {
      setToast('Already in "Your Next Steps"');
      window.setTimeout(() => setToast(null), 1400);
      return;
    }

    onAddNextStep?.(group, move);
    setToast('Added to "Your Next Steps"');
    window.setTimeout(() => setToast(null), 1400);
  };

  const handleRefineWithAI = (group) => {
    setAiPromptGroupId(group.id);
    setAiPromptText('');
    setRegenerationChanges(null);
  };

  const handleAIPromptSubmit = () => {
    if (!aiPromptText.trim()) return;
    
    setIsRegenerating(true);
    setToast('Regenerating activity...');
    
    // Simulate AI processing time
    setTimeout(() => {
      const group = gapGroups.find(g => g.id === aiPromptGroupId);
      if (group) {
        // Mock AI regeneration with changes tracking
        const originalTitle = group.move.title;
        const originalSummary = group.move.summary;
        const originalTime = group.move.time;
        const originalFormat = group.move.format;
        
        // Generate new content based on prompt
        const newTitle = generateNewTitle(aiPromptText, originalTitle);
        const newSummary = generateNewSummary(aiPromptText, originalSummary);
        const newTime = generateNewTime(aiPromptText, originalTime);
        const newFormat = generateNewFormat(aiPromptText, originalFormat);
        
        // Track changes for display
        const changes = [];
        if (newTitle !== originalTitle) changes.push(`Updated activity title: "${newTitle}"`);
        if (newSummary !== originalSummary) changes.push(`Modified activity summary`);
        if (newTime !== originalTime) changes.push(`Changed time allocation: ${newTime}`);
        if (newFormat !== originalFormat) changes.push(`Updated format: ${newFormat}`);
        
        setGapGroups((prev) =>
          prev.map((g) => 
            g.id === aiPromptGroupId 
              ? {
                  ...g,
                  move: {
                    ...g.move,
                    title: newTitle,
                    summary: newSummary,
                    time: newTime,
                    format: newFormat
                  }
                }
              : g
          )
        );
        
        setRegenerationChanges(changes);
        setIsRegenerating(false);
        setToast('Activity regenerated successfully');
        window.setTimeout(() => setToast(null), 2000);
      }
    }, 1500);
  };

  const generateNewTitle = (prompt, originalTitle) => {
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('simplify') || promptLower.includes('shorter')) {
      return originalTitle.includes('Whole-class') ? 'Quick whole-class error spotlight' : 
             originalTitle.includes('Visual') ? 'Simple visual fraction model' :
             originalTitle.includes('Error analysis') ? 'Quick error analysis' :
             originalTitle.includes('Balance scale') ? 'Simple balance scale demo' :
             `${originalTitle} (simplified)`;
    }
    if (promptLower.includes('extend') || promptLower.includes('longer')) {
      return originalTitle.includes('Whole-class') ? 'Extended whole-class worked example + error spotlight' : 
             originalTitle.includes('Visual') ? 'Comprehensive visual fraction model + LCD routine' :
             originalTitle.includes('Error analysis') ? 'Extended order of operations error analysis debate' :
             originalTitle.includes('Balance scale') ? 'Extended balance scale visualization + algebraic connection' :
             `${originalTitle} (extended)`;
    }
    if (promptLower.includes('technology') || promptLower.includes('digital')) {
      return originalTitle.includes('Whole-class') ? 'Digital whole-class worked example + error spotlight' : 
             originalTitle.includes('Visual') ? 'Interactive visual fraction model + LCD routine' :
             originalTitle.includes('Error analysis') ? 'Digital order of operations error analysis debate' :
             originalTitle.includes('Balance scale') ? 'Virtual balance scale visualization + algebraic connection' :
             `${originalTitle} (digital)`;
    }
    return `${originalTitle} (refined)`;
  };

  const generateNewSummary = (prompt, originalSummary) => {
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('simplify') || promptLower.includes('shorter')) {
      return originalSummary.includes('Solve one canonical problem') ? 'Solve one problem together and compare correct vs incorrect steps.' :
             originalSummary.includes('Use bar models') ? 'Use bar models to justify LCD before symbolic steps.' :
             originalSummary.includes('Present both correct') ? 'Present correct and incorrect solutions side by side.' :
             originalSummary.includes('Use physical') ? 'Use balance scales to demonstrate equation solving.' :
             `${originalSummary} (simplified)`;
    }
    if (promptLower.includes('extend') || promptLower.includes('longer')) {
      return originalSummary.includes('Solve one canonical problem') ? 'Solve multiple problems together and compare correct vs incorrect steps with detailed explanations.' :
             originalSummary.includes('Use bar models') ? 'Use bar models to justify LCD before symbolic steps, then extend to complex fractions.' :
             originalSummary.includes('Present both correct') ? 'Present correct and incorrect solutions side by side, then facilitate detailed debate and practice.' :
             originalSummary.includes('Use physical') ? 'Use balance scales to demonstrate equation solving, then connect to algebraic notation with multiple examples.' :
             `${originalSummary} (extended)`;
    }
    if (promptLower.includes('technology') || promptLower.includes('digital')) {
      return originalSummary.includes('Solve one canonical problem') ? 'Solve one problem together digitally and compare correct vs incorrect steps using interactive tools.' :
             originalSummary.includes('Use bar models') ? 'Use digital bar models to justify LCD before symbolic steps.' :
             originalSummary.includes('Present both correct') ? 'Present correct and incorrect solutions digitally side by side.' :
             originalSummary.includes('Use physical') ? 'Use digital balance scales to demonstrate equation solving.' :
             `${originalSummary} (digital)`;
    }
    return `${originalSummary} (refined)`;
  };

  const generateNewTime = (prompt, originalTime) => {
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('simplify') || promptLower.includes('shorter')) {
      return originalTime.includes('20–30') ? '15–20 min' :
             originalTime.includes('20') ? '15 min' :
             originalTime.includes('15') ? '10 min' :
             originalTime.includes('20 min') ? '15 min' :
             '15 min';
    }
    if (promptLower.includes('extend') || promptLower.includes('longer')) {
      return originalTime.includes('20–30') ? '30–45 min' :
             originalTime.includes('20') ? '30 min' :
             originalTime.includes('15') ? '25 min' :
             originalTime.includes('20 min') ? '30 min' :
             '30 min';
    }
    return originalTime;
  };

  const generateNewFormat = (prompt, originalFormat) => {
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('technology') || promptLower.includes('digital')) {
      return originalFormat.includes('Whole class') ? 'Whole class → digital pairs' :
             originalFormat.includes('Whole class') ? 'Whole class → digital groups' :
             originalFormat.includes('Small groups') ? 'Small groups → digital collaboration' :
             'Whole class → digital';
    }
    return originalFormat;
  };

  const handleAddFromAIPrompt = () => {
    const group = gapGroups.find(g => g.id === aiPromptGroupId);
    if (group) {
      handleAdd(group);
      setAiPromptGroupId(null);
      setAiPromptText('');
      setRegenerationChanges(null);
    }
  };

  const reasoningGroup = useMemo(() => {
    if (!reasoningGroupId) return null;
    return gapGroups.find((g) => g.id === reasoningGroupId) ?? null;
  }, [gapGroups, reasoningGroupId]);

  const aiPromptGroup = useMemo(() => {
    if (!aiPromptGroupId) return null;
    return gapGroups.find((g) => g.id === aiPromptGroupId) ?? null;
  }, [gapGroups, aiPromptGroupId]);

  const mainMisconception = gapGroups[0];
  const alternativeMisconceptions = gapGroups.slice(1);

  return (
    <div className="recommended-next-steps">
      {reasoningGroup && (
        <div className="rns-modal-overlay" onClick={() => setReasoningGroupId(null)}>
          <div className="rns-modal evidence-journey-modal" onClick={(e) => e.stopPropagation()}>
            <div className="evidence-journey-header">
              <div className="evidence-journey-title-section">
                <h3 className="evidence-journey-title">Evidence Journey</h3>
                <p className="evidence-journey-subtitle">{reasoningGroup.title}</p>
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
                        <h5 className="chart-title">Students Displaying Distribution Error Pattern</h5>
                        <div className="chart-placeholder">
                          <div className="chart-bar" style={{height: '80%'}}></div>
                          <div className="chart-bar" style={{height: '60%'}}></div>
                          <div className="chart-bar" style={{height: '90%'}}></div>
                          <div className="chart-bar" style={{height: '40%'}}></div>
                          <div className="chart-bar" style={{height: '70%'}}></div>
                          <div className="chart-bar" style={{height: '85%'}}></div>
                          <div className="chart-bar" style={{height: '50%'}}></div>
                          <div className="chart-bar" style={{height: '95%'}}></div>
                          <div className="chart-bar" style={{height: '30%'}}></div>
                          <div className="chart-bar" style={{height: '75%'}}></div>
                        </div>
                        <div className="chart-labels">
                          <span>Q1</span>
                          <span>Q2</span>
                          <span>Q3</span>
                          <span>Q4</span>
                          <span>Q5</span>
                          <span>Q6</span>
                          <span>Q7</span>
                          <span>Q8</span>
                          <span>Q9</span>
                          <span>Q10</span>
                        </div>
                        <div className="chart-values">
                          <span>14</span>
                          <span>11</span>
                          <span>16</span>
                          <span>7</span>
                          <span>13</span>
                          <span>15</span>
                          <span>9</span>
                          <span>17</span>
                          <span>5</span>
                          <span>14</span>
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
                          <span className="stat-value">Q8 (95%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="data-insights">
                      <h5>Key Insights</h5>
                      <ul>
                        <li>72% of students made the same distribution error across 10 questions</li>
                        <li>Q8 had the highest error rate at 95% (17 out of 18 students)</li>
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
                      <h5 className="problem-label">Problem: 3(2x - 4) = 18</h5>
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
                    <div className="impact-analysis">
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

                    <div className="success-metrics">
                      <h5>Expected Outcomes</h5>
                      <div className="metrics-grid">
                        <div className="metric-item">
                          <span className="metric-label">Error Reduction</span>
                          <span className="metric-value">72% → 10%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Confidence Boost</span>
                          <span className="metric-value">Significant</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Foundation Strength</span>
                          <span className="metric-value">Solid</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="evidence-journey-footer">
              <div className="navigation-controls">
                <button
                  className="nav-btn prev-btn"
                  onClick={() => setEvidenceScreen(Math.max(1, evidenceScreen - 1))}
                  disabled={evidenceScreen === 1}
                >
                  ← Back
                </button>
                
                <div className="screen-indicator">
                  <span>Screen {evidenceScreen} of 3</span>
                </div>

                <button
                  className="nav-btn next-btn"
                  onClick={() => setEvidenceScreen(Math.min(3, evidenceScreen + 1))}
                  disabled={evidenceScreen === 3}
                >
                  Next →
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
                        <span className="occurrence-pill">
                          {group.occurrence}
                        </span>
                      </div>

                      {group.misconceptionSummary && (
                        <div className="misconception-summary">
                          {group.misconceptionSummary}
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
                          setReasoningGroupId(group.id);
                        }}
                      >
                        View Reasoning
                      </button>
                      <button className="add-btn" onClick={() => {
                        setFullViewGroupId(null);
                        handleAdd(group);
                      }}>
                        Add to Your Next Steps
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* AI Prompt Modal for Refine with AI */}
      {aiPromptGroupId && (
        <div className="rns-modal-overlay" onClick={() => setAiPromptGroupId(null)}>
          <div className="rns-modal ai-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ai-prompt-header">
              <div>
                <div className="ai-prompt-title">Refine with AI</div>
                <div className="ai-prompt-subtitle">{gapGroups.find(g => g.id === aiPromptGroupId)?.title}</div>
              </div>

              <button
                className="ai-prompt-close"
                onClick={() => setAiPromptGroupId(null)}
                aria-label="Close AI prompt"
              >
                ×
              </button>
            </div>

            <div className="ai-prompt-body">
              {/* Full Activity Content - Same as Full View Modal */}
              <div className="gap-group-top">
                <div className="gap-group-title-row">
                  <h4 className="gap-group-title">{aiPromptGroup?.title}</h4>
                </div>

                <div className="gap-group-meta-row">
                  <span className={`students-pill ${getPriorityClass(aiPromptGroup?.priority)}`}>
                    {aiPromptGroup?.studentCount} students ({aiPromptGroup?.studentPercent}%)
                  </span>
                  <span className="occurrence-pill">
                    {aiPromptGroup?.occurrence}
                  </span>
                </div>

                {aiPromptGroup?.misconceptionSummary && (
                  <div className="misconception-summary">
                    {aiPromptGroup?.misconceptionSummary}
                  </div>
                )}
              </div>

              {/* Header section for AI prompt modal - Same as Full View */}
              <div className="full-view-header">
                <div className="full-view-header-content">
                  <div className="full-view-header-eyebrow">Recommended Activity</div>
                  <h4 className="full-view-header-title">{aiPromptGroup?.move?.title}</h4>
                  <div className="full-view-header-meta">
                    <span>{aiPromptGroup?.move?.time}</span>
                    <span className="meta-sep">|</span>
                    <span>{aiPromptGroup?.move?.format}</span>
                  </div>
                  <p className="full-view-header-subtitle">{aiPromptGroup?.move?.summary}</p>
                </div>
              </div>

              {/* Tab Navigation - Same as Full View */}
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

              {/* Tab Content - Same as Full View */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="tab-panel">
                    <div className="tab-section">
                      <h4 className="tab-section-title">What will students do</h4>
                      <p className="tab-section-content">{aiPromptGroup?.move?.tabs?.overview?.whatStudentsDo}</p>
                    </div>
                    
                    <div className="tab-section">
                      <h4 className="tab-section-title">What you'll do</h4>
                      <p className="tab-section-content">{aiPromptGroup?.move?.tabs?.overview?.whatYouDo}</p>
                    </div>

                    {aiPromptGroup?.successIndicators && (
                      <div className="tab-section">
                        <h4 className="tab-section-title">Success indicators</h4>
                        <ul className="success-list">
                          {aiPromptGroup?.successIndicators.map((indicator, idx) => (
                            <li key={idx}>{indicator}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="tab-section">
                      <h4 className="tab-section-title">Why this matters</h4>
                      <div className="importance-tooltip">
                        <span className="importance-text">{aiPromptGroup?.move?.tabs?.overview?.importance}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity-steps' && (
                  <div className="tab-panel">
                    <div className="tab-section">
                      <h4 className="tab-section-title">Setup</h4>
                      <ul className="tab-list">
                        {aiPromptGroup?.move?.tabs?.activitySteps?.setup?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="tab-section">
                      <h4 className="tab-section-title">Problem</h4>
                      <p className="tab-section-content">{aiPromptGroup?.move?.tabs?.activitySteps?.problem}</p>
                    </div>

                    <div className="tab-section">
                      <h4 className="tab-section-title">Core Activity</h4>
                      <ol className="tab-list">
                        {aiPromptGroup?.move?.tabs?.activitySteps?.coreActivity?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="tab-section">
                      <h4 className="tab-section-title">Discussion Questions</h4>
                      <ul className="discussion-questions">
                        {aiPromptGroup?.move?.tabs?.activitySteps?.discussionQuestions?.map((question, idx) => (
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
                    {aiPromptGroup?.move?.tabs?.studentGroupings?.groups?.map((grouping, idx) => (
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

                    {aiPromptGroup?.move?.tabs?.studentGroupings?.highFlyers && (
                      <div className="high-flyers-card">
                        <div className="high-flyers-header">
                          <h4 className="high-flyers-title">High Flyers</h4>
                          <p className="high-flyers-description">
                            {aiPromptGroup?.move?.tabs?.studentGroupings?.highFlyers?.description}
                          </p>
                        </div>
                        <div className="high-flyers-students">
                          <h5 className="high-flyers-subtitle">Students:</h5>
                          <ul className="student-list">
                            {aiPromptGroup?.move?.tabs?.studentGroupings?.highFlyers?.students?.map((student, idx) => (
                              <li key={idx}>{student}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {aiPromptGroup?.move?.tabs?.studentGroupings?.aiRecommendation && (
                      <div className="ai-recommendation-card">
                        <h4 className="ai-recommendation-title">AI Recommendation</h4>
                        <p className="ai-recommendation-content">
                          {aiPromptGroup?.move?.tabs?.studentGroupings?.aiRecommendation}
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
                        {aiPromptGroup?.move?.tabs?.materials?.required?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {aiPromptGroup?.move?.tabs?.materials?.optional?.length > 0 && (
                      <div className="materials-section">
                        <h4 className="materials-title">Optional Materials</h4>
                        <ul className="materials-list">
                          {aiPromptGroup?.move?.tabs?.materials?.optional?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Regeneration Changes Display */}
              {regenerationChanges && regenerationChanges.length > 0 && (
                <div className="changes-section">
                  <h4 className="section-title">Changes Made</h4>
                  <div className="changes-card">
                    <ul className="changes-list">
                      {regenerationChanges.map((change, idx) => (
                        <li key={idx} className="change-item">
                          <span className="change-icon">✓</span>
                          <span className="change-text">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* AI Prompt Card - Fixed to bottom */}
            <div className="ai-prompt-card">
              <div className="prompt-section">
                <h4 className="section-title">AI Prompt</h4>
                <div className="prompt-input-container">
                  <textarea
                    value={aiPromptText}
                    onChange={(e) => setAiPromptText(e.target.value)}
                    placeholder="Enter your prompt to refine this activity. For example: 'Make this activity shorter for a 15-minute class period' or 'Add more technology integration' or 'Simplify for struggling learners'"
                    className="prompt-textarea"
                    rows="4"
                  />
                  <div className="prompt-actions">
                    <button
                      className="regenerate-btn"
                      onClick={handleAIPromptSubmit}
                      disabled={!aiPromptText.trim() || isRegenerating}
                    >
                      {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                    </button>
                    <button
                      className="add-btn"
                      onClick={handleAddFromAIPrompt}
                      disabled={isRegenerating}
                    >
                      Add to Your Next Steps
                    </button>
                  </div>
                </div>
              </div>
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
          <div key={mainMisconception.id} className="gap-group-card main-misconception">
            <div className="gap-group-top">
              <div className="gap-group-title-row">
                <h4 className="gap-group-title">{mainMisconception.title}</h4>
              </div>

              <div className="gap-group-meta-row">
                <span className={`students-pill ${getPriorityClass(mainMisconception.priority)}`}>
                  {mainMisconception.studentCount} students ({mainMisconception.studentPercent}%)
                </span>
                <span className="occurrence-pill">
                  {mainMisconception.occurrence}
                </span>
              </div>

              {mainMisconception.misconceptionSummary && (
                <div className="misconception-summary">
                  {mainMisconception.misconceptionSummary}
                </div>
              )}
            </div>

            {/* Recommended Activity Card - Change 1 */}
            <div className="recommended-activity-card">
              {/* Header section for main misconception - Change 1 */}
              <div className="main-misconception-header">
                <div className="main-misconception-header-content">
                  <div className="main-misconception-header-eyebrow">Recommended Activity</div>
                  <h4 className="main-misconception-header-title">{mainMisconception.move?.title}</h4>
                  <div className="main-misconception-header-meta">
                    <span>{mainMisconception.move?.time}</span>
                    <span className="meta-sep">|</span>
                    <span>{mainMisconception.move?.format}</span>
                  </div>
                  <p className="main-misconception-header-subtitle">{mainMisconception.move?.summary}</p>
                </div>
                <div className="main-misconception-header-actions">
                  <button 
                    className="refine-btn"
                    onClick={() => handleRefineWithAI(mainMisconception)}
                  >
                    Refine with AI
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
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

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="tab-panel">
                    <div className="tab-section">
                      <h4 className="tab-section-title">What will students do</h4>
                      <p className="tab-section-content">{mainMisconception.move?.tabs?.overview?.whatStudentsDo}</p>
                    </div>
                    
                    <div className="tab-section">
                      <h4 className="tab-section-title">What you'll do</h4>
                      <p className="tab-section-content">{mainMisconception.move?.tabs?.overview?.whatYouDo}</p>
                    </div>

                    {mainMisconception.successIndicators && (
                      <div className="tab-section">
                        <h4 className="tab-section-title">Success indicators</h4>
                        <ul className="success-list">
                          {mainMisconception.successIndicators.map((indicator, idx) => (
                            <li key={idx}>{indicator}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="tab-section">
                      <h4 className="tab-section-title">Why this matters</h4>
                      <div className="importance-tooltip">
                        <span className="importance-text">{mainMisconception.move?.tabs?.overview?.importance}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity-steps' && (
                  <div className="tab-panel">
                    <div className="tab-section">
                      <h4 className="tab-section-title">Setup</h4>
                      <ul className="tab-list">
                        {mainMisconception.move?.tabs?.activitySteps?.setup?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="tab-section">
                      <h4 className="tab-section-title">Problem</h4>
                      <p className="tab-section-content">{mainMisconception.move?.tabs?.activitySteps?.problem}</p>
                    </div>

                    <div className="tab-section">
                      <h4 className="tab-section-title">Core Activity</h4>
                      <ol className="tab-list">
                        {mainMisconception.move?.tabs?.activitySteps?.coreActivity?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="tab-section">
                      <h4 className="tab-section-title">Discussion Questions</h4>
                      <ul className="discussion-questions">
                        {mainMisconception.move?.tabs?.activitySteps?.discussionQuestions?.map((question, idx) => (
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
                    {mainMisconception.move?.tabs?.studentGroupings?.groups?.map((group, idx) => (
                      <div key={idx} className="grouping-card">
                        <div className="grouping-header">
                          <h4 className="grouping-title">{group.name}</h4>
                          <p className="grouping-description">{group.description}</p>
                        </div>
                        <div className="grouping-students">
                          <h5 className="grouping-subtitle">Students:</h5>
                          <ul className="student-list">
                            {group.students.map((student, studentIdx) => (
                              <li key={studentIdx}>{student}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}

                    {mainMisconception.move?.tabs?.studentGroupings?.highFlyers && (
                      <div className="high-flyers-card">
                        <div className="high-flyers-header">
                          <h4 className="high-flyers-title">High Flyers</h4>
                          <p className="high-flyers-description">
                            {mainMisconception.move?.tabs?.studentGroupings?.highFlyers?.description}
                          </p>
                        </div>
                        <div className="high-flyers-students">
                          <h5 className="high-flyers-subtitle">Students:</h5>
                          <ul className="student-list">
                            {mainMisconception.move?.tabs?.studentGroupings?.highFlyers?.students?.map((student, idx) => (
                              <li key={idx}>{student}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {mainMisconception.move?.tabs?.studentGroupings?.aiRecommendation && (
                      <div className="ai-recommendation-card">
                        <h4 className="ai-recommendation-title">AI Recommendation</h4>
                        <p className="ai-recommendation-content">
                          {mainMisconception.move?.tabs?.studentGroupings?.aiRecommendation}
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
                        {mainMisconception.move?.tabs?.materials?.required?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {mainMisconception.move?.tabs?.materials?.optional?.length > 0 && (
                      <div className="materials-section">
                        <h4 className="materials-title">Optional Materials</h4>
                        <ul className="materials-list">
                          {mainMisconception.move?.tabs?.materials?.optional?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

            {/* Actions */}
            <div className="panel-actions">
              <button
                className="reasoning-btn"
                onClick={() => setReasoningGroupId(mainMisconception.id)}
              >
                View Reasoning
              </button>
              <button 
                className="refine-btn"
                onClick={() => handleRefineWithAI(mainMisconception)}
              >
                Refine with AI
              </button>
              <button className="add-btn" onClick={() => handleAdd(mainMisconception)}>
                Add to Your Next Steps
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
                    <span className="occurrence-pill">
                      {group.occurrence}
                    </span>
                  </div>
                </div>

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
                      setReasoningGroupId(group.id);
                    }}
                  >
                    View Reasoning
                  </button>
                  <button 
                    className="refine-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefineWithAI(group);
                    }}
                  >
                    Refine with AI
                  </button>
                  <button 
                    className="add-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(group);
                    }}
                  >
                    Add to Your Next Steps
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