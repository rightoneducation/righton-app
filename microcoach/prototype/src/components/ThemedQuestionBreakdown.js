import React, { useState } from 'react';
import QuestionDisplayModal from './QuestionDisplayModal';
import './ThemedQuestionBreakdown.css';

const ThemedQuestionBreakdown = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample themed data
  const themedData = {
    questionBreakdown: [
      {
        id: 1,
        theme: "Linear Equations - Multi-step Problems",
        description: "Students seem to have trouble with distributing coefficients and combining like terms when solving multi-step equations.",
        questions: [
          {
            id: 1,
            icon: "X",
            text: "Solve for x: 3(2x - 4) = 18",
            incorrectPercentage: 85,
            performanceData: { attempted: 120, correct: 18, avgTime: "2:45" }
          },
          {
            id: 2,
            icon: "X",
            text: "Solve: 2x + 7 = 4x - 3",
            incorrectPercentage: 78,
            performanceData: { attempted: 98, correct: 22, avgTime: "3:12" }
          },
          {
            id: 3,
            icon: "X",
            text: "Find x when 5x - 8 = 2x + 10",
            incorrectPercentage: 72,
            performanceData: { attempted: 134, correct: 37, avgTime: "1:58" }
          }
        ]
      },
      {
        id: 2,
        theme: "Quadratic Functions - Graphing",
        description: "Students seem to have trouble with identifying vertex form and understanding parabola transformations.",
        questions: [
          {
            id: 4,
            icon: "🛑",
            text: "Solve for x: 2x + 8 = 20",
            incorrectPercentage: 64,
            performanceData: { attempted: 156, correct: 56, avgTime: "2:23" }
          },
          {
            id: 5,
            icon: "🛑",
            text: "Graph linear equation y = 3x - 4",
            incorrectPercentage: 69,
            performanceData: { attempted: 89, correct: 28, avgTime: "4:15" }
          }
        ]
      },
      {
        id: 3,
        theme: "Rational Numbers - Operations",
        description: "Students seem to have trouble with converting between fractions, decimals, and percentages, especially with mixed operations.",
        questions: [
          {
            id: 6,
            icon: "🛑",
            text: "What is 15% of 80?",
            incorrectPercentage: 58,
            performanceData: { attempted: 167, correct: 70, avgTime: "1:34" }
          },
          {
            id: 7,
            icon: "🛑",
            text: "Convert 3/8 to percentage",
            incorrectPercentage: 61,
            performanceData: { attempted: 143, correct: 56, avgTime: "2:01" }
          }
        ]
      }
    ],
    studentQuestions: [
      {
        id: 1,
        theme: "Linear Equation Concepts",
        description: "Students seem to have trouble understanding the balance principle and why operations must be performed on both sides.",
        questions: [
          {
            id: 1,
            text: "I don't understand why a stop sign has 8 sides but the angles don't add up to 360°",
            studentName: "Sarah M.",
            timestamp: "2 hours ago",
            responses: 3
          },
          {
            id: 2,
            text: "How do I remember the difference between interior and exterior angles?",
            studentName: "Alex K.",
            timestamp: "3 hours ago",
            responses: 1
          }
        ]
      },
      {
        id: 2,
        theme: "Algebraic Thinking",
        description: "Students seem to have trouble connecting abstract algebraic concepts to real-world applications and understanding variable manipulation.",
        questions: [
          {
            id: 3,
            text: "Why do we move numbers to the other side of the equation?",
            studentName: "Emma L.",
            timestamp: "1 hour ago",
            responses: 2
          },
          {
            id: 4,
            text: "Can you show me a real-world example of linear equations?",
            studentName: "Jordan P.",
            timestamp: "4 hours ago",
            responses: 5
          }
        ]
      },
      {
        id: 3,
        theme: "Percentage Applications",
        description: "Students seem to have trouble determining when to use percentages versus other number formats and applying percentage calculations in context.",
        questions: [
          {
            id: 5,
            text: "When do I use percentages vs decimals vs fractions?",
            studentName: "Mike R.",
            timestamp: "30 minutes ago",
            responses: 0
          }
        ]
      }
    ]
  };

  const handleSeeDetails = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <div className="themed-question-breakdown">
      <div className="breakdown-header">
        <h2 className="breakdown-title">Question Analysis by Theme</h2>
        <p className="breakdown-subtitle">Performance data and student inquiries organized by learning themes</p>
      </div>
      
      <div className="breakdown-columns">
        <div className="questions-column">
          <h3 className="column-title">Question Breakdown</h3>
          <p className="column-subtitle">Performance data by theme</p>
          
          {themedData.questionBreakdown.map((theme) => (
            <div key={theme.id} className="theme-section">
              <div className="theme-header">
                <h4 className="theme-title">{theme.theme}</h4>
                {theme.description && (
                  <p className="theme-description">{theme.description}</p>
                )}
              </div>
              
              <div className="questions-list">
                {theme.questions.map((question) => (
                  <div key={question.id} className="question-item">
                    <div className="question-icon-container">
                      <span className="question-icon">{question.icon}</span>
                    </div>
                    
                    <div className="question-content">
                      <div className="question-text">{question.text}</div>
                      <div className="performance-metrics">
                        <span className="metric">
                          <strong>{question.performanceData.attempted}</strong> attempted
                        </span>
                        <span className="metric">
                          <strong>{question.performanceData.correct}</strong> correct
                        </span>
                        <span className="metric">
                          Avg: <strong>{question.performanceData.avgTime}</strong>
                        </span>
                      </div>
                    </div>
                    
                    <div className="question-stats">
                      <div className="incorrect-percentage">
                        {question.incorrectPercentage}%
                      </div>
                      <div className="incorrect-label">Incorrect</div>
                    </div>
                    
                    <div className="question-actions">
                      <button 
                        className="see-details-btn"
                        onClick={() => handleSeeDetails(question)}
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="student-questions-column">
          <h3 className="column-title">Student Questions</h3>
          <p className="column-subtitle">Organized by theme</p>
          
          {themedData.studentQuestions.map((theme) => (
            <div key={theme.id} className="theme-section">
              <div className="theme-header">
                <h4 className="theme-title">{theme.theme}</h4>
                {theme.description && (
                  <p className="theme-description">{theme.description}</p>
                )}
              </div>
              
              <div className="student-questions-list">
                {theme.questions.map((question) => (
                  <div key={question.id} className="student-question-item">
                    <div className="question-content">
                      <div className="question-text">{question.text}</div>
                      <div className="question-meta">
                        <span className="student-name">Asked by {question.studentName}</span>
                        <span className="timestamp">{question.timestamp}</span>
                        <span className="responses">{question.responses} responses</span>
                      </div>
                    </div>
                    
                    <div className="question-actions">
                      <button className="respond-btn">
                        Respond
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <QuestionDisplayModal
        question={selectedQuestion}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ThemedQuestionBreakdown;
