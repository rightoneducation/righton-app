import React, { useState } from 'react';
import './AIPrompt.css';

const AIPrompt = () => {
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState([
    {
      id: 1,
      type: 'user',
      text: 'Can you analyze yesterday\'s homework assignment and suggest remediation strategies?',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 2,
      type: 'ai',
      text: 'Based on yesterday\'s homework assignment analysis:\n\n**Key Findings:**\n• 85% of students struggled with multi-step linear equations\n• Most common error: incorrect distribution of negative signs\n• Students who succeeded used systematic step-by-step approaches\n\n**Immediate Remediation Plan:**\n• Tomorrow: Visual balance scale lesson (15 min)\n• Group students by error patterns for targeted practice\n• Send home step-by-step reference guide\n\n**Target Students:** Alex K., Sarah M., Jordan P., and 18 others need intensive support\n**Timeline:** Implement tomorrow for maximum impact while concepts are fresh',
      timestamp: new Date(Date.now() - 280000)
    },
    {
      id: 3,
      type: 'user',
      text: 'What lesson plan template should I use for the quadratic functions remediation?',
      timestamp: new Date(Date.now() - 120000) // 2 minutes ago
    },
    {
      id: 4,
      type: 'ai',
      text: 'Here\'s a targeted lesson plan based on your Unit 4 Quiz #2 data:\n\n**Quadratic Vertex Remediation (45 min)**\n**Target:** 69% who failed vertex identification\n\n**Structure:**\n1. Hook (5 min): Real parabola examples (basketball shots)\n2. Direct Instruction (15 min): Vertex form vs standard form comparison\n3. Guided Practice (15 min): Graphing calculator exploration\n4. Differentiated Work (8 min): 3 levels based on quiz performance\n5. Exit Ticket (2 min): One vertex problem\n\n**Grouping:** High performers (Emma L., Taylor S.) mentor struggling students\n**Materials:** Graphing calculators, vertex form worksheets, real-world examples',
      timestamp: new Date(Date.now() - 100000)
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Add user message to conversation
    const userMessage = {
      id: conversation.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage = {
        id: conversation.length + 2,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestionClick = (type) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const aiResponse = generateSuggestionResponse(type);
      const aiMessage = {
        id: conversation.length + 1,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateSuggestionResponse = (type) => {
    switch (type) {
      case 'analyze-data':
        return 'Based on your recent data analysis:\n\n**Homework Assignment #3:**\n• 85% struggling with multi-step linear equations\n• Common error: distributing negative signs incorrectly\n• Recommendation: Focus on balance scale visualization\n\n**Unit 4 Quiz #2:**\n• 69% failed quadratic vertex identification\n• Students confuse vertex form vs standard form\n• Recommendation: Hands-on graphing with vertex exploration\n\n**Practice Set #4:**\n• Completion rate dropped 15% on rational number operations\n• Students avoiding word problems (32% attempt rate)\n• Recommendation: Scaffold with visual fraction models';
      
      case 'remediation-plan':
        return 'Here\'s a targeted remediation plan based on your data:\n\n**Week 1 - Linear Equations Focus:**\n• Day 1: Balance scale demonstration + guided practice\n• Day 2: Error analysis with student work samples\n• Day 3: Peer tutoring with mixed-ability pairs\n\n**Week 2 - Quadratic Functions:**\n• Day 1: Vertex form exploration with graphing calculators\n• Day 2: Real-world parabola connections\n• Day 3: Assessment and progress monitoring\n\n**Ongoing Support:**\n• Daily 5-minute warm-ups targeting weak areas\n• Weekly confidence check-ins\n• Parent communication for at-home practice';
      
      case 'lesson-templates':
        return 'Here are ready-to-use lesson templates:\n\n**Multi-Step Equations Remediation (45 min):**\n• Opening (5 min): Review balance principle\n• Direct Instruction (15 min): Step-by-step modeling\n• Guided Practice (15 min): Work through 3 problems together\n• Independent Practice (8 min): Differentiated worksheets\n• Closure (2 min): Exit ticket with one problem\n\n**Materials Needed:**\n• Balance scales or virtual manipulatives\n• Color-coded equation strips\n• Differentiated practice sheets (3 levels)\n\n**Assessment:**\n• Formative: Thumbs up/down during guided practice\n• Summative: Exit ticket analysis';
      
      case 'progress-tracking':
        return 'Track remediation effectiveness with these metrics:\n\n**Weekly Progress Indicators:**\n• Problem-solving accuracy rates\n• Time to completion improvements\n• Confidence level changes\n• Error pattern reduction\n\n**Data Collection Methods:**\n• Daily exit tickets (2-3 problems)\n• Weekly mini-assessments\n• Student self-reflection surveys\n• Peer assessment activities\n\n**Success Criteria:**\n• 80% accuracy on target skills\n• Confidence within 15 points of performance\n• Reduced time on similar problems\n• Fewer repeated error patterns';
      
      default:
        return 'I can help you analyze data, create remediation plans, provide lesson templates, or track progress. What would you like to explore?';
    }
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('homework') || input.includes('assignment')) {
      return 'Based on yesterday\'s homework assignment data:\n\n**Key Findings:**\n• 85% struggled with multi-step linear equations\n• Most common error: incorrect distribution of negative signs\n• Students who got it right used systematic step-by-step approach\n\n**Recommended Actions:**\n• Create visual balance scale lesson for tomorrow\n• Group students by error type for targeted practice\n• Send home practice sheet with step-by-step guide\n\n**Timeline:** Implement in next class period for maximum impact.';
    } else if (input.includes('quiz') || input.includes('assessment')) {
      return 'Your recent quiz data reveals:\n\n**Quadratic Functions Analysis:**\n• 69% failed vertex identification\n• Students confuse vertex form (a(x-h)² + k) with standard form\n• High performers: Emma L., Taylor S. (need advanced challenges)\n• Struggling: Alex K., Sarah M., Jordan P. (need remediation)\n\n**Remediation Plan:**\n• Use graphing calculators for vertex exploration\n• Create vertex form transformation activities\n• Implement peer tutoring with high performers helping strugglers';
    } else if (input.includes('lesson plan') || input.includes('remediation')) {
      return 'Here\'s a data-driven lesson plan template:\n\n**Target:** Multi-step equations (based on 85% struggle rate)\n**Duration:** 45 minutes\n\n**Structure:**\n1. Hook (5 min): Balance scale demonstration\n2. Instruction (15 min): Step-by-step modeling with color coding\n3. Guided Practice (15 min): Work through errors from homework\n4. Independent (8 min): Tiered worksheets by ability\n5. Closure (2 min): Exit ticket\n\n**Materials:** Balance scales, colored markers, differentiated worksheets\n**Assessment:** Exit ticket analysis for next day planning';
    } else if (input.includes('confidence') || input.includes('overconfident')) {
      return 'Confidence calibration strategy based on your data:\n\n**Overconfident Students (Alex K., Sarah M.):**\n• Provide self-assessment rubrics\n• Use peer review to expose gaps\n• Give challenging problems to reveal misconceptions\n\n**Underconfident Students (Emma L., Mike R.):**\n• Highlight their successful strategies publicly\n• Assign peer tutoring roles\n• Provide advanced challenge problems\n\n**Timeline:** Implement confidence activities weekly for 3 weeks, then reassess.';
    } else {
      return 'I can help you:\n• Analyze homework assignments, quizzes, and assessment data\n• Create targeted remediation plans based on specific student needs\n• Design lesson plans using your performance data\n• Track remediation progress over time\n\nWhat specific data would you like me to analyze?';
    }
  };

  return (
    <div className="ai-prompt">
      <div className="prompt-header">
        <h3 className="prompt-title">Remediation Assistant</h3>
        <p className="prompt-subtitle">Analyze your data and get targeted remediation strategies</p>
      </div>
      
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about remediation plans, analyze homework data, create lesson plans, etc."
            className="prompt-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={inputText.trim() === '' || isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Ask'}
          </button>
        </div>
      </form>
      
      <div className="suggestion-buttons">
        <button 
          className="suggestion-btn"
          onClick={() => handleSuggestionClick('analyze-data')}
          disabled={isLoading}
        >
          Analyze Recent Data
        </button>
        <button 
          className="suggestion-btn"
          onClick={() => handleSuggestionClick('remediation-plan')}
          disabled={isLoading}
        >
          Create Remediation Plan
        </button>
        <button 
          className="suggestion-btn"
          onClick={() => handleSuggestionClick('lesson-templates')}
          disabled={isLoading}
        >
          Get Lesson Templates
        </button>
        <button 
          className="suggestion-btn"
          onClick={() => handleSuggestionClick('progress-tracking')}
          disabled={isLoading}
        >
          Track Remediation Progress
        </button>
      </div>
    </div>
  );
};

export default AIPrompt;
