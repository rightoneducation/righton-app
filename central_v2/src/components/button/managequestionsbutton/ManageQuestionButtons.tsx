import React, { useState } from 'react';
import { AddMoreIconButton, QuestionCountButton } from '../../../lib/styledcomponents/CreateGameStyledComponent';
import VerticalMoreImg from '../../../images/buttonIconVerticalMore.svg';
import { buttonContentMap, ButtonType } from '../ButtonModels';

interface IManageButtonQuestions {
  questionCount: number;
  iconButtons: number[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  addMoreQuestions: () => void;
}

// vertical ellipsis image for button
const verticalEllipsis = <img src={VerticalMoreImg} alt="more-elipsis" />;
export default function ManageQuestionsButtons({
  questionCount,
  iconButtons,
  selectedIndex,
  setSelectedIndex,
  addMoreQuestions
}: IManageButtonQuestions) {
  
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
                }} key={`Question--${index + 1}`} onClick={() => setSelectedIndex(index)}>
             {index + 1}
           </AddMoreIconButton>
          ))}
          
          {/* Track current question */}
           <QuestionCountButton
           onClick={ () => setSelectedIndex(questionCount - 1)}
           endIcon={verticalEllipsis} 
           isDisabled={false}>
           Question {questionCount}
         </QuestionCountButton>
          
          {/* add new question */}
          <AddMoreIconButton onClick={addMoreQuestions}>
          <img
            alt="add-question"
            src={buttonContentMap[ButtonType.ADDSTEP].icon}
          />
        </AddMoreIconButton>
        </>
      );
}
