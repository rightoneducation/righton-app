import React from 'react';
import './QuestionBreakdownCard.css';

const QuestionBreakdownCard = ({ questions }) => {
  // Sample data if none provided
  const defaultQuestions = [
    {
      id: 1,
      text: "What is the primary function of mitochondria in cellular respiration and energy production?",
      incorrectPercentage: 80,
      thumbnail: "🧬"
    },
    {
      id: 2,
      text: "Explain the process of photosynthesis and its role in the carbon cycle...",
      incorrectPercentage: 65,
      thumbnail: "🌱"
    },
    {
      id: 3,
      text: "How do enzymes catalyze biochemical reactions and what factors affect their activity?",
      incorrectPercentage: 72,
      thumbnail: "⚗️"
    },
    {
      id: 4,
      text: "Describe the structure and function of DNA in heredity and protein synthesis...",
      incorrectPercentage: 58,
      thumbnail: "🧪"
    }
  ];

  const questionData = questions || defaultQuestions;

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="question-breakdown-card">
      <div className="questions-list">
        {questionData.map((question) => (
          <div key={question.id} className="question-item">
            <div className="question-content">
              <div className="question-header">
                <div className="stop-icon">🛑</div>
                <div className="question-text">
                  {truncateText(question.text)}
                </div>
              </div>
              
              <div className="question-footer">
                <div className="incorrect-percentage">
                  {question.incorrectPercentage}% Incorrect
                </div>
                <button className="see-details-link" onClick={() => console.log('See details clicked')}>
                  See Details
                </button>
              </div>
            </div>
            
            <div className="question-thumbnail">
              <div className="thumbnail-icon">
                {question.thumbnail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBreakdownCard;
