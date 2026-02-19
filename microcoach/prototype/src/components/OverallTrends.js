import React from 'react';
import ConfidenceLevelChart from './ConfidenceLevelChart';
import './OverallTrends.css';

const OverallTrends = () => {
  // Precision teaching philosophy data
  const trendsData = {
    keyInsights: [
      {
        finding: "72% of students make distribution errors in multi-step equations",
        targetStandard: "8.EE.7",
        targetDescription: "Solve linear equations in one variable",
        gapStandard: "6.EE.3",
        gapDescription: "Apply properties of operations to generate equivalent expressions"
      },
      {
        finding: "45% struggle with inverse operations in one-step equations",
        targetStandard: "8.EE.7",
        targetDescription: "Solve linear equations in one variable",
        gapStandard: "6.EE.7",
        gapDescription: "Solve real-world and mathematical problems by writing and solving equations"
      },
      {
        finding: "61% add denominators when working with algebraic fractions",
        targetStandard: "8.EE.2",
        targetDescription: "Use square root and cube root symbols to represent solutions to equations",
        gapStandard: "6.NS.1",
        gapDescription: "Interpret and compute quotients of fractions"
      },
      {
        finding: "38% have order of operations confusion with variables and exponents",
        targetStandard: "8.EE.1",
        targetDescription: "Know and apply the properties of integer exponents to generate equivalent numerical expressions",
        gapStandard: "7.EE.1",
        gapDescription: "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions"
      },
      {
        finding: "54% struggle with graphing linear equations from slope-intercept form",
        targetStandard: "8.EE.6",
        targetDescription: "Use similar triangles to explain why the slope m is the same between any two distinct points on a non-vertical line",
        gapStandard: "6.RP.3",
        gapDescription: "Use ratio and rate reasoning to solve real-world and mathematical problems"
      },
      {
        finding: "43% confuse negative exponents with negative coefficients",
        targetStandard: "8.EE.1",
        targetDescription: "Know and apply the properties of integer exponents to generate equivalent numerical expressions",
        gapStandard: "7.NS.2",
        gapDescription: "Apply and extend previous understandings of multiplication and division of fractions"
      },
      {
        finding: "67% make errors when solving systems of equations by substitution",
        targetStandard: "8.EE.8",
        targetDescription: "Analyze and solve pairs of simultaneous linear equations",
        gapStandard: "7.EE.4",
        gapDescription: "Use variables to represent quantities in a real-world or mathematical problem"
      },
      {
        finding: "39% struggle with scientific notation calculations",
        targetStandard: "8.EE.4",
        targetDescription: "Perform operations with numbers expressed in scientific notation",
        gapStandard: "6.EE.1",
        gapDescription: "Write and evaluate numerical expressions involving whole-number exponents"
      }
    ],
    studentPerformanceGroups: {
      highPerformers: [
        { 
          name: "Emma L.", 
          masteryScore: 94, 
          previousMastery: 89, 
          masteryChange: "+5",
          misconceptionScore: 87,
          previousMisconception: 82,
          misconceptionChange: "+5"
        },
        { 
          name: "Taylor S.", 
          masteryScore: 91, 
          previousMastery: 88, 
          masteryChange: "+3",
          misconceptionScore: 89,
          previousMisconception: 85,
          misconceptionChange: "+4"
        },
        { 
          name: "Mike R.", 
          masteryScore: 89, 
          previousMastery: 92, 
          masteryChange: "-3",
          misconceptionScore: 92,
          previousMisconception: 94,
          misconceptionChange: "-2"
        }
      ],
      averagePerformers: [
        { 
          name: "Jordan P.", 
          masteryScore: 76, 
          previousMastery: 71, 
          masteryChange: "+5",
          misconceptionScore: 68,
          previousMisconception: 63,
          misconceptionChange: "+5"
        },
        { 
          name: "Alex K.", 
          masteryScore: 74, 
          previousMastery: 82, 
          masteryChange: "-8",
          misconceptionScore: 59,
          previousMisconception: 71,
          misconceptionChange: "-12"
        },
        { 
          name: "Sarah M.", 
          masteryScore: 72, 
          previousMastery: 68, 
          masteryChange: "+4",
          misconceptionScore: 74,
          previousMisconception: 69,
          misconceptionChange: "+5"
        }
      ],
      strugglingStudents: [
        { 
          name: "Chris B.", 
          masteryScore: 58, 
          previousMastery: 45, 
          masteryChange: "+13",
          misconceptionScore: 52,
          previousMisconception: 38,
          misconceptionChange: "+14"
        },
        { 
          name: "Jamie L.", 
          masteryScore: 52, 
          previousMastery: 61, 
          masteryChange: "-9",
          misconceptionScore: 41,
          previousMisconception: 55,
          misconceptionChange: "-14"
        },
        { 
          name: "Sam T.", 
          masteryScore: 49, 
          previousMastery: 53, 
          masteryChange: "-4",
          misconceptionScore: 43,
          previousMisconception: 47,
          misconceptionChange: "-4"
        }
      ],
      biggestChanges: [
        { name: "Chris B.", masteryChange: "+13", misconceptionChange: "+14", topic: "Linear Equations" },
        { name: "Alex K.", masteryChange: "-8", misconceptionChange: "-12", topic: "Rational Numbers" },
        { name: "Jamie L.", masteryChange: "-9", misconceptionChange: "-14", topic: "Quadratic Functions" }
      ]
    },
    confidenceIssues: {
      overlyConfident: [
        { name: "Alex K.", topic: "Linear Equations" },
        { name: "Sarah M.", topic: "Quadratic Functions" },
        { name: "Jordan P.", topic: "Rational Numbers" }
      ],
      underlyConfident: [
        { name: "Emma L.", topic: "Data Analysis" },
        { name: "Mike R.", topic: "Polynomial Operations" },
        { name: "Taylor S.", topic: "Systems of Equations" }
      ]
    }
  };

  return (
    <div className="overall-trends">
      <div className="trends-content">
        <div className="first-row">
          <div className="performance-column">
            <div className="student-performance-groups">
              <h3 className="section-title">Student Groups</h3>
            <p className="performance-note">
              Scores based on RightOn! Activities: <strong>Mastery %</strong> (correct answers) | <strong>Misconception Understanding %</strong> (identifying wrong reasoning)
            </p>
            
            <div className="performance-group">
              <h4 className="group-title">High Performers (85%+)</h4>
              <div className="student-performance-list">
                {trendsData.studentPerformanceGroups.highPerformers.map((student, index) => (
                  <div key={index} className="student-performance-item">
                    <span className="student-name">{student.name}</span>
                    <div className="student-scores">
                      <div className="score-group">
                        <span className="score-label">Mastery:</span>
                        <span className="current-score">{student.masteryScore}%</span>
                        <span className={`score-change ${student.masteryChange.startsWith('+') ? 'positive' : 'negative'}`}>
                          {student.masteryChange}
                        </span>
                      </div>
                      <div className="score-group">
                        <span className="score-label">Misconception:</span>
                        <span className="current-score">{student.misconceptionScore}%</span>
                        <span className={`score-change ${student.misconceptionChange.startsWith('+') ? 'positive' : 'negative'}`}>
                          {student.misconceptionChange}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="performance-group">
              <h4 className="group-title">Average Performers (65-84%)</h4>
              <div className="student-performance-list">
                {trendsData.studentPerformanceGroups.averagePerformers.map((student, index) => (
                  <div key={index} className="student-performance-item">
                    <span className="student-name">{student.name}</span>
                    <div className="student-scores">
                      <div className="score-group">
                        <span className="score-label">Mastery:</span>
                        <span className="current-score">{student.masteryScore}%</span>
                        <span className={`score-change ${student.masteryChange.startsWith('+') ? 'positive' : 'negative'}`}>
                          {student.masteryChange}
                        </span>
                      </div>
                      <div className="score-group">
                        <span className="score-label">Misconception:</span>
                        <span className="current-score">{student.misconceptionScore}%</span>
                        <span className={`score-change ${student.misconceptionChange.startsWith('+') ? 'positive' : 'negative'}`}>
                          {student.misconceptionChange}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="performance-group">
              <h4 className="group-title">Struggling Students (&lt;65%)</h4>
              <div className="student-performance-list">
                {trendsData.studentPerformanceGroups.strugglingStudents.map((student, index) => (
                  <div key={index} className="student-performance-item">
                    <span className="student-name">{student.name}</span>
                    <div className="student-scores">
                      <div className="score-group">
                        <span className="score-label">Mastery:</span>
                        <span className="current-score">{student.masteryScore}%</span>
                        <span className={`score-change ${student.masteryChange.startsWith('+') ? 'positive' : 'negative'}`}>
                          {student.masteryChange}
                        </span>
                      </div>
                      <div className="score-group">
                        <span className="score-label">Misconception:</span>
                        <span className="current-score">{student.misconceptionScore}%</span>
                        <span className={`score-change ${student.misconceptionChange.startsWith('+') ? 'positive' : 'negative'}`}>
                          {student.misconceptionChange}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="biggest-changes">
              <h4 className="group-title">Biggest Changes</h4>
              <div className="changes-list">
                {trendsData.studentPerformanceGroups.biggestChanges.map((student, index) => (
                  <div key={index} className="change-item">
                    <span className="student-name">{student.name}</span>
                    <span className="change-topic">{student.topic}</span>
                    <div className="change-scores">
                      <span className={`score-change ${student.masteryChange.startsWith('+') ? 'positive' : 'negative'}`}>
                        M: {student.masteryChange}
                      </span>
                      <span className={`score-change ${student.misconceptionChange.startsWith('+') ? 'positive' : 'negative'}`}>
                        MC: {student.misconceptionChange}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
          
          <div className="confidence-column">
            <div className="confidence-analysis">
              <h3 className="section-title">Confidence Analysis</h3>
              <div className="confidence-chart-container">
                <ConfidenceLevelChart />
              </div>
              
              <div className="confidence-issues">
                <div className="confidence-section">
                  <h4 className="confidence-subtitle">Students Who Are Overly Confident</h4>
                  <div className="student-list">
                    {trendsData.confidenceIssues.overlyConfident.map((student, index) => (
                      <div key={index} className="student-item overly-confident">
                        <span className="student-name">{student.name}</span>
                        <span className="student-topic">{student.topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="confidence-section">
                  <h4 className="confidence-subtitle">Students Who Should Be More Confident</h4>
                  <div className="student-list">
                    {trendsData.confidenceIssues.underlyConfident.map((student, index) => (
                      <div key={index} className="student-item underly-confident">
                        <span className="student-name">{student.name}</span>
                        <span className="student-topic">{student.topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="synthesis-row">
          <div className="key-insights">
            <h3 className="section-title">Overall Trends</h3>
            
            <div className="trend-theme">
              <h4 className="theme-title">Algebraic Operations & Properties</h4>
              <div className="theme-insights">
                <div className="insight-item">
                  <span className="finding-text">72% of students make distribution errors in multi-step equations</span>
                </div>
                <div className="insight-item">
                  <span className="finding-text">38% have order of operations confusion with variables and exponents</span>
                </div>
                <div className="insight-item">
                  <span className="finding-text">43% confuse negative exponents with negative coefficients</span>
                </div>
              </div>
            </div>

            <div className="trend-theme">
              <h4 className="theme-title">Fraction & Rational Number Operations</h4>
              <div className="theme-insights">
                <div className="insight-item">
                  <span className="finding-text">61% add denominators when working with algebraic fractions</span>
                </div>
                <div className="insight-item">
                  <span className="finding-text">39% struggle with scientific notation calculations</span>
                </div>
              </div>
            </div>

            <div className="trend-theme">
              <h4 className="theme-title">Equation Solving Strategies</h4>
              <div className="theme-insights">
                <div className="insight-item">
                  <span className="finding-text">45% struggle with inverse operations in one-step equations</span>
                </div>
                <div className="insight-item">
                  <span className="finding-text">67% make errors when solving systems of equations by substitution</span>
                </div>
                <div className="insight-item">
                  <span className="finding-text">54% struggle with graphing linear equations from slope-intercept form</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallTrends;
