import React from 'react';
import './StudentQuestionList.css';

const StudentQuestionList = ({ themes }) => {
  // Sample data if none provided
  const defaultThemes = [
    {
      id: 1,
      title: "Theme 1: Many students have trouble with cellular respiration concepts",
      questions: [
        {
          id: 1,
          text: "I don't understand how ATP is produced in mitochondria",
          studentName: "Sarah M.",
          timestamp: "2 hours ago"
        },
        {
          id: 2,
          text: "What's the difference between aerobic and anaerobic respiration?",
          studentName: "Mike R.",
          timestamp: "3 hours ago"
        }
      ]
    },
    {
      id: 2,
      title: "Theme 2: Students struggling with photosynthesis process",
      questions: [
        {
          id: 3,
          text: "How do plants convert sunlight into chemical energy?",
          studentName: "Emma L.",
          timestamp: "1 hour ago"
        },
        {
          id: 4,
          text: "Why do leaves change color in autumn?",
          studentName: "Alex K.",
          timestamp: "4 hours ago"
        }
      ]
    },
    {
      id: 3,
      title: "Theme 3: Enzyme function and regulation questions",
      questions: [
        {
          id: 5,
          text: "What factors affect enzyme activity rates?",
          studentName: "Jordan P.",
          timestamp: "30 minutes ago"
        }
      ]
    }
  ];

  const themeData = themes || defaultThemes;

  return (
    <div className="student-question-list">
      {themeData.map((theme) => (
        <div key={theme.id} className="theme-section">
          <div className="theme-header">
            <h3 className="theme-title">{theme.title}</h3>
          </div>
          
          <div className="questions-container">
            {theme.questions.map((question) => (
              <div key={question.id} className="student-question-item">
                <div className="question-content">
                  <div className="question-text">
                    {question.text}
                  </div>
                  <div className="question-meta">
                    <span className="student-name">Asked by {question.studentName}</span>
                    <span className="timestamp">{question.timestamp}</span>
                  </div>
                </div>
                
                <div className="question-actions">
                  <button className="action-button primary">
                    Respond to Student
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentQuestionList;
