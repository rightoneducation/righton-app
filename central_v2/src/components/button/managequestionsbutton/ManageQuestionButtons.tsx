import React, { useState } from 'react';
import { AddMoreIconButton, QuestionCountButton } from '../../../lib/styledcomponents/CreateGameStyledComponent';
import VerticalMoreImg from '../../../images/buttonIconVerticalMore.svg';
import { buttonContentMap, ButtonType } from '../ButtonModels';

// vertical ellipsis image for button
const verticalEllipsis = <img src={VerticalMoreImg} alt="more-elipsis" />;
export default function ManageQuestionsButtons() {
    const [questionCount, setQuestionCount] = useState(1); 
    const [iconButtons, setIconButtons] = useState([1]); 
  
    const handleAddMoreClick = () => {
      setQuestionCount(prevCount => prevCount + 1); 
      setIconButtons(prev => [...prev, prev.length + 1]); 
    };

    return (
        <>
          {/* add new button representing question count */}
          {questionCount > 1 && iconButtons.slice(1).map((_, index) => (
             <AddMoreIconButton sx={{ 
                fontFamily: 'Poppins', 
                fontSize: '16px', 
                width: '40px', 
                height: '40px',
                fontWeight: 600
                }} key={`Question--${index + 1}`} onClick={() => console.log("question set")}>
             {index + 1}
           </AddMoreIconButton>
          ))}
          
          {/* Track current question */}
           <QuestionCountButton endIcon={verticalEllipsis} isDisabled={false}>
           Question {questionCount}
         </QuestionCountButton>
          
          {/* add new question */}
          <AddMoreIconButton onClick={handleAddMoreClick}>
          <img
            alt="add-question"
            src={buttonContentMap[ButtonType.ADDSTEP].icon}
          />
        </AddMoreIconButton>
        </>
      );
}
