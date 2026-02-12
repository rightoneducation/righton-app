import React, { useState } from 'react';
import './AIChatWindow.css';

const AIChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hi! I\'m your AI teaching assistant. How can I help you today? I can analyze student performance, suggest interventions, or answer questions about your class data.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('student') && input.includes('struggling')) {
      return 'Based on your data, I see that Alex K., Sarah M., and Jordan P. are showing overconfidence in areas where they\'re actually struggling. I recommend targeted interventions focusing on self-assessment skills and providing more challenging practice problems to help calibrate their confidence levels.';
    } else if (input.includes('geometry') || input.includes('angle')) {
      return 'I notice 85% of your students are struggling with geometry concepts, particularly angle calculations. The most common misconception is confusing interior vs exterior angles. I suggest using visual aids and hands-on activities with physical shapes to help students better understand these concepts.';
    } else if (input.includes('confidence')) {
      return 'Your confidence analysis shows significant misalignment between student confidence and actual performance in 67% of cases. I recommend implementing regular self-reflection activities and peer assessment to help students develop more accurate self-awareness of their abilities.';
    } else if (input.includes('improve') || input.includes('help')) {
      return 'Based on your recent 23% improvement after targeted interventions, I suggest continuing with personalized learning paths. Focus on the students showing confidence misalignment and consider implementing more frequent formative assessments to track progress.';
    } else {
      return 'I can help you analyze student performance patterns, suggest targeted interventions, create personalized learning recommendations, or explain any trends in your dashboard data. What specific area would you like to explore?';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-window">
      <div className="chat-header">
        <div className="chat-title">
          <span className="ai-icon">🤖</span>
          <span>AI Teaching Assistant</span>
        </div>
        <div className="chat-status">Online</div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about student performance, teaching strategies, or data insights..."
          rows="2"
          className="input-field"
        />
        <button 
          onClick={handleSendMessage}
          className="send-button"
          disabled={inputText.trim() === ''}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatWindow;
