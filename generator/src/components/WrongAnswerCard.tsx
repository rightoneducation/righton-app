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
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void,
  formData: IQuestion,
  isSubmitted: boolean,
  isFormComplete: boolean,
  isQuestionGenerating: boolean,
  handleSubmitQuestion: () => void,
  handleAddWrongAnswer: () => void,
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
  handleAddWrongAnswer,
}: WrongAnswerCardProps ) => {
  const theme = useTheme();
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
      {formData.wrongAnswers.map((wrongAnswer, index) => {
        return <TextFieldStyled placeholder="Enter incorrect answer..." variant="outlined" name="wrongAnswer" value={wrongAnswer} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event, index)}/>
      })}
      <ButtonWrongAnswerStyled onClick={handleAddWrongAnswer} disabled={formData.wrongAnswers.length > 3}>
        Add a Wrong Answer
      </ButtonWrongAnswerStyled>
      <ButtonStyled onClick={handleSubmitQuestion}>
        Generate Explanation
      </ButtonStyled>
    </BaseCardStyled>
  );
}