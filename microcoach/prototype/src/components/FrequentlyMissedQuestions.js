import React, { useState } from 'react';
import QuestionDisplayModal from './QuestionDisplayModal';
import './FrequentlyMissedQuestions.css';

const FrequentlyMissedQuestions = ({ questions }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data if none provided
  const defaultQuestions = [
    {
      id: 1,
      icon: "🛑",
      text: "What is the sum of the interior angles of a stop sign?",
      expression: "(n-2) × 180° where n = 8",
      incorrectPercentage: 85,
      gradeLevel: "7.G.B.6",
      subject: "Geometry",
      difficulty: "Medium",
      correctAnswer: "1080°",
      explanation: "A stop sign is an octagon (8 sides). The sum of interior angles = (n-2) × 180° = (8-2) × 180° = 1080°"
    },
    {
      id: 2,
      icon: "🛑",
      text: "If a triangle has angles of 45° and 60°, what is the third angle?",
      expression: "180° - 45° - 60° = ?",
      incorrectPercentage: 72,
      gradeLevel: "7.G.A.2",
      subject: "Geometry",
      difficulty: "Easy",
      correctAnswer: "75°",
      explanation: "The sum of angles in a triangle is always 180°. So 180° - 45° - 60° = 75°"
    },
    {
      id: 3,
      icon: "🛑",
      text: "What is the area of a circle with radius 5 units?",
      expression: "A = πr² where r = 5",
      incorrectPercentage: 68,
      gradeLevel: "7.G.B.4",
      subject: "Geometry",
      difficulty: "Medium",
      correctAnswer: "25π square units",
      explanation: "Using the formula A = πr², where r = 5: A = π(5)² = 25π square units"
    },
    {
      id: 4,
      icon: "🛑",
      text: "Solve for x: 2x + 8 = 20",
      expression: "2x + 8 = 20",
      incorrectPercentage: 64,
      gradeLevel: "7.EE.B.4",
      subject: "Algebra",
      difficulty: "Easy",
      correctAnswer: "x = 6",
      explanation: "Subtract 8 from both sides: 2x = 12. Then divide by 2: x = 6"
    },
    {
      id: 5,
      icon: "🛑",
      text: "What is 15% of 80?",
      expression: "0.15 × 80 = ?",
      incorrectPercentage: 58,
      gradeLevel: "7.RP.A.3",
      subject: "Ratios & Proportions",
      difficulty: "Easy",
      correctAnswer: "12",
      explanation: "Convert 15% to decimal: 0.15. Then multiply: 0.15 × 80 = 12"
    }
  ];

  const questionData = questions || defaultQuestions;

  const handleSeeDetails = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <div className="frequently-missed-questions">
      <div className="questions-header">
        <h3 className="section-title">Frequently Missed Questions</h3>
        <p className="section-subtitle">Questions students struggle with most</p>
      </div>
      
      <div className="questions-list">
        {questionData.map((question) => (
          <div key={question.id} className="missed-question-item">
            <div className="question-icon-container">
              <span className="question-icon">{question.icon}</span>
            </div>
            
            <div className="question-content">
              <div className="question-text">{question.text}</div>
              {question.expression && (
                <div className="math-expression">{question.expression}</div>
              )}
              <div className="question-tags">
                <span className="grade-tag">{question.gradeLevel}</span>
                <span className="subject-tag">{question.subject}</span>
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
      
      <QuestionDisplayModal
        question={selectedQuestion}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default FrequentlyMissedQuestions;
