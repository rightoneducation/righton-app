import React from 'react';
import './QuestionDisplayModal.css';

const QuestionDisplayModal = ({ question, isOpen, onClose }) => {
  // Sample data if none provided
  const defaultQuestion = {
    id: 1,
    image: "",
    text: "Solve for x: 3x + 7 = 22",
    gradeLevel: "8.EE.C.7",
    subject: "Algebra",
    difficulty: "Medium",
    correctAnswer: "x = 5",
    explanation: "Subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5",
    studentData: [
      { name: "Alex K.", answer: "x = 5", correct: true, confidence: 85 },
      { name: "Sarah M.", answer: "x = 5", correct: true, confidence: 92 },
      { name: "Jamie L.", answer: "x = 3", correct: false, confidence: 45 },
      { name: "Chris B.", answer: "x = 5", correct: true, confidence: 78 },
      { name: "Taylor M.", answer: "x = 5", correct: true, confidence: 95 },
      { name: "Jordan P.", answer: "x = 4", correct: false, confidence: 60 },
      { name: "Sam R.", answer: "x = 5", correct: true, confidence: 70 },
      { name: "Casey L.", answer: "x = 2", correct: false, confidence: 35 }
    ]
  };

  const questionData = question || defaultQuestion;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="question-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="question-content">
          <div className="question-details">
            <div className="question-text">
              {questionData.text}
            </div>
            
            <div className="question-metadata">
              <span className="grade-level-tag">{questionData.gradeLevel}</span>
              <span className="subject-tag">{questionData.subject}</span>
              <span className="difficulty-tag">{questionData.difficulty}</span>
            </div>
            
            <div className="question-answer">
              <div className="answer-label">Correct Answer:</div>
              <div className="answer-value">{questionData.correctAnswer}</div>
            </div>
            
            <div className="question-explanation">
              <div className="explanation-label">Explanation:</div>
              <div className="explanation-text">{questionData.explanation}</div>
            </div>
            
            <div className="student-responses">
              <div className="responses-label">Student Responses:</div>
              <div className="responses-table">
                <div className="table-header">
                  <span>Student</span>
                  <span>Answer</span>
                  <span>Correct</span>
                  <span>Confidence</span>
                </div>
                {questionData.studentData && questionData.studentData.map((student, index) => (
                  <div key={index} className="table-row">
                    <span className="student-name">{student.name}</span>
                    <span className="student-answer">{student.answer}</span>
                    <span className={`correct-status ${student.correct ? 'correct' : 'incorrect'}`}>
                      {student.correct ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="confidence-level">{student.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="action-btn clone-btn">Clone</button>
          <button className="action-btn view-btn">View</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplayModal;
