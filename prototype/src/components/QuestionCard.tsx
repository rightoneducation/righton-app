import React from 'react';
import { Box, useTheme } from '@mui/material';
import { BaseCardStyled } from '../lib/styledcomponents/generator/StyledCards';
import { TextFieldStyled } from '../lib/styledcomponents/generator/StyledTextField';
import { CardHeaderTextStyled, FooterBoldStyled, FooterTextStyled, WrongAnswerNumberStyled } from '../lib/styledcomponents/generator/StyledTypography';
import { ButtonStyled } from '../lib/styledcomponents/generator/StyledButtons';


interface QuestionCardProps {
  isCustomQuestion: boolean,
  labelText: string[],
  handleSwitch: () => void,
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  formData: { [key: string]: string },
  isSubmitted: boolean,
  isFormComplete: boolean,
  isQuestionGenerating: boolean,
  handleSubmitQuestion: () => void,
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
}: QuestionCardProps ) => {
  const theme = useTheme();
  const wrongAnswerInputs = [
    { label: 'Wrong Answer 1', name: 'wrongAnswer1' },
    { label: 'Wrong Answer 2', name: 'wrongAnswer2' },
    { label: 'Wrong Answer 3', name: 'wrongAnswer3' },
  ];

  return (
    <BaseCardStyled>
      <CardHeaderTextStyled>
        Question
      </CardHeaderTextStyled>
      <TextFieldStyled placeholder="Enter the question here..." variant="outlined" />
      <CardHeaderTextStyled>
        Correct Answer
      </CardHeaderTextStyled>
      <TextFieldStyled placeholder="Enter the correct answer here..." variant="outlined" />
      <CardHeaderTextStyled>
        Incorrect Answers
      </CardHeaderTextStyled>
      <Box style={{display: 'flex', flexDirection: 'column', gap: '16px'}}> 
        { wrongAnswerInputs.map((input, index) => {
          return (
            <Box style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '16px'}}>
              <WrongAnswerNumberStyled>
                {index + 1}
              </WrongAnswerNumberStyled>
              <TextFieldStyled placeholder="Enter an incorrect answer here..." variant="outlined" />
            </Box> 
          )
        })}
      </Box>
      <ButtonStyled onClick={handleSubmitQuestion} disabled>
        Generate Explanations
      </ButtonStyled>
      <Box style={{display: 'flex', justifyContent: 'center', gap: `${theme.sizing.xxSmPadding}px`}}>
        <FooterTextStyled>Don't have a question? </FooterTextStyled>
        <FooterBoldStyled>Generate a sample</FooterBoldStyled>
      </Box>
{/* 
    {inputs.map((input, index) => {
      return (
        <React.Fragment key={input.name}>
        <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '15px', lineHeight: '30px'}}>
          {labelText[index]}
          </Typography>
          <TextFieldStyled
            fullWidth
            variant="filled"
            autoComplete="off"
            multiline
            minRows={2}
            maxRows={2}
            placeholder={`Enter ${input.label} here...`}
            onChange={handleInputChange}
            value={formData[input.name as keyof typeof formData]}
            name={input.name}
            disabled={isSubmitted}
            InputProps={{
              disableUnderline: true,
              style: {
                paddingTop: '9px',
              },
            }}
          />
      </React.Fragment>
      )}
      )
    }
    <ButtonSubmitQuestion 
      isSubmitted={isSubmitted}
      isFormComplete={isFormComplete}
      isQuestionGenerating={isQuestionGenerating}
      handleSubmitQuestion={handleSubmitQuestion}
    />  */}
  </BaseCardStyled>
  );
}