import React from 'react';
import { Box, useTheme } from '@mui/material';
import { IQuestion } from '../lib/Models';
import { TooltipStyled } from '../lib/styledcomponents/generator/StyledTooltip';
import { QuestionContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { BaseCardStyled } from '../lib/styledcomponents/generator/StyledCards';
import { TextFieldStyled } from '../lib/styledcomponents/generator/StyledTextField';
import { CardHeaderTextStyled, FooterBoldStyled, FooterTextStyled, WrongAnswerNumberStyled, ExplanationTextStyled } from '../lib/styledcomponents/generator/StyledTypography';
import { ButtonStyled, ButtonWrongAnswerStyled } from '../lib/styledcomponents/generator/StyledButtons';


interface WrongAnswerCardProps {
  isCustomQuestion: boolean,
  labelText: string[],
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  formData: IQuestion,
  isSubmitted: boolean,
  isFormComplete: boolean,
  isQuestionGenerating: boolean,
  handleSubmitQuestion: () => void,
  handleGenerateSampleQuestion: () => void,
}

export const WrongAnswerCard = ({
  isCustomQuestion,
  labelText,
  handleInputChange,
  formData,
  isSubmitted,
  isFormComplete,
  isQuestionGenerating,
  handleSubmitQuestion,
  handleGenerateSampleQuestion
}: WrongAnswerCardProps ) => {
  const theme = useTheme();
  const inputs = [
    { label: 'Wrong Answer 1', name: 'wrongAnswer1' },
    { label: 'Wrong Answer 2', name: 'wrongAnswer2' },
    { label: 'Wrong Answer 3', name: 'wrongAnswer3' },
  ];

  return (
      <BaseCardStyled>
        <Box style={{ display: 'flex', flexDirection: 'column', paddingLeft: `${theme.sizing.smPadding}px`, paddingRight: `${theme.sizing.smPadding}px`, gap: '12px'}}>
          <CardHeaderTextStyled>
            Wrong Answer
          </CardHeaderTextStyled>
          <ExplanationTextStyled>
            Enter the wrong answer(s) that you want the explanation for. 
          </ExplanationTextStyled>
        </Box>
        <TextFieldStyled placeholder="Enter the correct answer here..." variant="outlined" name="correctAnswer" value={formData.correctAnswer} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event)}/>
        <ButtonWrongAnswerStyled onClick={handleSubmitQuestion}>
          Add a Wrong Answer
        </ButtonWrongAnswerStyled>
        <ButtonStyled onClick={handleSubmitQuestion}>
          Generate Explanation
        </ButtonStyled>
        {/* <CardHeaderTextStyled>
          Incorrect Answers
        </CardHeaderTextStyled>
        <Box style={{display: 'flex', flexDirection: 'column', gap: '16px'}}> 
          { inputs.map((input, index) => {
            return (
              <Box style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '16px'}}>
                <WrongAnswerNumberStyled>
                  {index + 1}
                </WrongAnswerNumberStyled>
                <TextFieldStyled placeholder="Enter an incorrect answer here..." variant="outlined" name={input.name} value={formData[input.name]} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event)}/>
              </Box> 
            )
          })}
        </Box>
        { !isFormComplete 
          ? <TooltipStyled title="Please fill out all fields to generate explanations" arrow placement="top">
              <span>
              <ButtonStyled onClick={handleSubmitQuestion} disabled={!isFormComplete}>
                Generate Explanations
              </ButtonStyled>
              </span>
            </TooltipStyled>
          : <ButtonStyled onClick={handleSubmitQuestion} disabled={!isFormComplete}>
              Generate Explanationss
            </ButtonStyled>
        }
        <Box style={{display: 'flex', justifyContent: 'center', gap: `${theme.sizing.xxSmPadding}px`}}>
          <FooterTextStyled>Don't have a question? </FooterTextStyled>
          <FooterBoldStyled style={{cursor: 'pointer'}} onClick={handleGenerateSampleQuestion}>Generate a sample</FooterBoldStyled>
        </Box> */}
    </BaseCardStyled>
  );
}