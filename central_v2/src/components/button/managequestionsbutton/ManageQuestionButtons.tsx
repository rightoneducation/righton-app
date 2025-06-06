import React, { useState } from 'react';
import { IQuestionTemplate } from '@righton/networking';
import { Box } from '@mui/material';
import { TDraftQuestionsList } from '../../../lib/CreateGameModels';
import { AddMoreIconButton, QuestionCountButton } from '../../../lib/styledcomponents/CreateGameStyledComponent';
import VerticalMoreImg from '../../../images/buttonIconVerticalMore.svg';
import DeleteIcon from '../../../images/buttonIconDelete.svg';
import { buttonContentMap, ButtonType } from '../ButtonModels';

interface IManageButtonQuestions {
  questions: {
    questionTemplate: IQuestionTemplate;
    gameQuestionId: string;
  }[] | TDraftQuestionsList[];
  iconButtons: number[];
  selectedIndex: number;
  isCreate: boolean;
  setSelectedIndex: (index: number) => void;
  addMoreQuestions?: () => void;
  handleDeleteQuestion?: (index: number) => void;
}

// vertical ellipsis image for button
const verticalEllipsis = <img src={VerticalMoreImg} alt="more-elipsis" />;
export default function ManageQuestionsButtons({
  questions,
  iconButtons,
  selectedIndex,
  isCreate,
  setSelectedIndex,
  addMoreQuestions,
  handleDeleteQuestion
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
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap'
                }}
                isDisabled={false}
              >
                <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', minWidth: '40px', minHeight: '40px'}}onClick={ () => {setSelectedIndex(index)}}>
                  { index === selectedIndex && 'Question' } {index + 1}
                  { index === selectedIndex && verticalEllipsis}
                </Box>
                { index === selectedIndex && isCreate && handleDeleteQuestion && (
                    <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px'}} onClick={() => handleDeleteQuestion(index)}>
                      <img src={DeleteIcon} style={{height: '20px', width: '20px'}} alt="delete-question" />
                    </Box>
                  )
                }
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
