import React, { useState } from 'react';
import { IQuestionTemplate } from '@righton/networking';
import { AddMoreIconButton, QuestionCountButton } from '../../../lib/styledcomponents/CreateGameStyledComponent';
import VerticalMoreImg from '../../../images/buttonIconVerticalMore.svg';
import { buttonContentMap, ButtonType } from '../ButtonModels';

interface IManageButtonQuestions {
  questions: {
    questionTemplate: IQuestionTemplate;
    gameQuestionId: string;
  }[];
  iconButtons: number[];
  selectedIndex: number;
  isCreate: boolean;
  setSelectedIndex: (index: number) => void;
  addMoreQuestions?: () => void;
}

// vertical ellipsis image for button
const verticalEllipsis = <img src={VerticalMoreImg} alt="more-elipsis" />;
export default function ManageQuestionsButtons({
  questions,
  iconButtons,
  selectedIndex,
  isCreate,
  setSelectedIndex,
  addMoreQuestions
}: IManageButtonQuestions) {
    return (
      <>          
        { questions && questions.map((question, index) => { 
            return (
              <QuestionCountButton
                sx={{ 
                  ...(iconButtons.length > 1 && selectedIndex === questions.length && {
                      backgroundColor: (theme) => theme.palette.primary.mediumBlue
                  }),
                }}
                onClick={ () => setSelectedIndex(index)}
                isDisabled={false}
              >
                { index === selectedIndex && 'Question' } {index + 1}
                { index === selectedIndex && verticalEllipsis}
              </QuestionCountButton>
            )
          })
        }
        { isCreate && 
          <AddMoreIconButton onClick={addMoreQuestions}>
            <img
              alt="add-question"
              src={buttonContentMap[ButtonType.ADDSTEP].icon}
            />
          </AddMoreIconButton>
        }
      </>
    );
}
