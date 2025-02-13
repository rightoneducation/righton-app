import React from 'react';
import { Box, useTheme } from '@mui/material';
import { QuestionContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { BaseCardStyled } from '../lib/styledcomponents/generator/StyledCards';
import { TextFieldStyled } from '../lib/styledcomponents/generator/StyledTextField';
import { CardHeaderTextStyled, FooterBoldStyled, FooterTextStyled, WrongAnswerNumberStyled, ExplanationTextStyled } from '../lib/styledcomponents/generator/StyledTypography';
import { ButtonStyled } from '../lib/styledcomponents/generator/StyledButtons';


interface QuestionCardProps {
  isCustomQuestion: boolean,
  labelText: string[],
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  formData: { [key: string]: string },
  isSubmitted: boolean,
  isFormComplete: boolean,
  isQuestionGenerating: boolean,
  handleSubmitQuestion: () => void,
  handleGenerateSampleQuestion: () => void,
}

export const QuestionCard = ({
  isCustomQuestion,
  labelText,
  handleInputChange,
  formData,
  isSubmitted,
  isFormComplete,
  isQuestionGenerating,
  handleSubmitQuestion,
  handleGenerateSampleQuestion
}: QuestionCardProps ) => {
  const theme = useTheme();
  const inputs = [
    { label: 'Wrong Answer 1', name: 'wrongAnswer1' },
    { label: 'Wrong Answer 2', name: 'wrongAnswer2' },
    { label: 'Wrong Answer 3', name: 'wrongAnswer3' },
  ];

  return (
    <QuestionContainer>
      <BaseCardStyled>
        <CardHeaderTextStyled>
          Question
        </CardHeaderTextStyled>
        { !isCustomQuestion ? 
          <ExplanationTextStyled>
            {formData.question}
          </ExplanationTextStyled>
        : <TextFieldStyled placeholder="Enter the question here..." variant="outlined" name="question" value={formData.question} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event)}/>
        }
        <CardHeaderTextStyled>
          Correct Answer
        </CardHeaderTextStyled>
        <TextFieldStyled placeholder="Enter the correct answer here..." variant="outlined" name="correctAnswer" value={formData.correctAnswer} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event)}/>
        <CardHeaderTextStyled>
          Incorrect Answers
        </CardHeaderTextStyled>
        <Box style={{display: 'flex', flexDirection: 'column', gap: '16px'}}> 
          { inputs.map((input, index) => {
            return (
              <Box style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '16px'}}>
                <WrongAnswerNumberStyled>
                  {index + 1}
                </WrongAnswerNumberStyled>
                <TextFieldStyled placeholder="Enter an incorrect answer here..." variant="outlined" name={input.name} value={formData.Answer} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event)}/>
              </Box> 
            )
          })}
        </Box>
        <ButtonStyled onClick={handleSubmitQuestion}>
          Generate Explanations
        </ButtonStyled>
        <Box style={{display: 'flex', justifyContent: 'center', gap: `${theme.sizing.xxSmPadding}px`}}>
          <FooterTextStyled>Don't have a question? </FooterTextStyled>
          <FooterBoldStyled style={{cursor: 'pointer'}} onClick={handleGenerateSampleQuestion}>Generate a sample</FooterBoldStyled>
        </Box>
    </BaseCardStyled>
  </QuestionContainer>
  );
}