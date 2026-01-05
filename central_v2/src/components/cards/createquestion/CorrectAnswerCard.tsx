import React, { useEffect } from 'react';
import { Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import {
  Answer,
  CentralQuestionTemplateInput,
  AnswerType,
  AnswerPrecision,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { QuestionTitleStyled } from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  TextContainerStyled,
  BaseCardStyled,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ErrorIcon,
  RemoveQuestionIcon,
} from '../../../lib/styledcomponents/CentralStyledComponents';
import ErrorBox from './ErrorBox';
import errorIcon from '../../../images/errorIcon.svg';
import {
  ScreenSize,
} from '../../../lib/CentralModels';
import removeIcon from '../../../images/buttonRemoveQuestion.svg';

interface DetailedQuestionSubCardProps {
  screenSize: ScreenSize;
  isClone: boolean;
  draftQuestion: CentralQuestionTemplateInput;
  handleCorrectAnswerChange: (
    correctAnswer: string,
    draftQuestion: CentralQuestionTemplateInput,
  ) => void;
  handleCorrectAnswerStepsChange: (
    steps: string[],
    draftQuestion: CentralQuestionTemplateInput,
  ) => void;
  handleAnswerSettingsChange: (
    draftQuestion: CentralQuestionTemplateInput,
    answerType: AnswerType,
    answerPrecision?: AnswerPrecision,
  ) => void;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
  isAIError: boolean;
}

export default function DetailedQuestionSubCard({
  screenSize,
  isClone,
  draftQuestion,
  handleCorrectAnswerChange,
  handleCorrectAnswerStepsChange,
  handleAnswerSettingsChange,
  isCardSubmitted,
  isCardErrored,
  isAIError,
}: DetailedQuestionSubCardProps) {
  const theme = useTheme();
  const addStep = () => {
    const newSteps = [...draftQuestion.correctCard.answerSteps, ''];
    handleCorrectAnswerStepsChange(newSteps, draftQuestion);
  };

  const handleStepChange = (index: number, value: string): void => {
    const newSteps = [...draftQuestion.correctCard.answerSteps];
    newSteps[index] = value;
    handleCorrectAnswerStepsChange(newSteps, draftQuestion);
  };

  const handleAnswerSettingsTypeChange = (answerType: AnswerType) => {
    handleAnswerSettingsChange(draftQuestion, answerType);
  };

  const handleAnswerSettingsPrecisionTypeChange = (
    answerPrecision: AnswerPrecision,
  ) => {
    handleAnswerSettingsChange(
      draftQuestion,
      AnswerType.NUMBER,
      answerPrecision,
    );
  };

  const handleDeleteStep = (index: number): void => {
    const newSteps = draftQuestion.correctCard.answerSteps.filter(
      (step, i) => i !== index,
    );
    handleCorrectAnswerStepsChange(newSteps, draftQuestion);
  };

  const answerStepsComponent = (step: string, index: number) => {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
        key={index}
      >
        <Typography
          sx={{
            fontFamily: 'Rubik',
            fontSize: '16px',
            fontWeight: '400',
          }}
        >
          Step {index + 1}
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: `${theme.sizing.xSmPadding}px`,
            gap: `${theme.sizing.xSmPadding}px`,
          }}
          key={index}
        >
          <TextContainerStyled
            multiline
            variant="outlined"
            value={draftQuestion.correctCard.answerSteps[index]}
            onChange={(e) => handleStepChange(index, e.target.value)}
            rows="4"
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'Rubik',
              },
              '& .MuiInputBase-input': {
                color: '#47366C',
                opacity:  isCardErrored && isCardSubmitted ? 1 : 0.5,
                '&::placeholder': {
                  color:  isCardErrored && isCardSubmitted? '#D0254D' : '#47366C',
                  opacity:  isCardErrored && isCardSubmitted? 1 : 0.5,
                },
                '&:focus': {
                  color: '#47366C',
                  opacity: 1,
                },
                '&:focus::placeholder': {
                  color: '#47366C',
                  opacity: 1,
                },
              },
            }}
            placeholder={`Enter Step ${index + 1} of getting to the solution...`}
            error={
              isCardSubmitted &&
              (!draftQuestion.correctCard.answerSteps[index] ||
                draftQuestion.correctCard.answerSteps[index].length === 0)
            }
            InputProps={{
              startAdornment: isCardSubmitted &&
                (!draftQuestion.correctCard.answerSteps[index] ||
                  draftQuestion.correctCard.answerSteps[index].length === 0) && (
                  <InputAdornment
                    position="start"
                    sx={{
                      alignSelf: 'flex-start',
                      mt: '10px',
                    }}
                  >
                    <ErrorIcon src={errorIcon} alt="error icon" />
                  </InputAdornment>
                ),

              endAdornment: index !== 0 && (
                <InputAdornment
                  position="end"
                  sx={{
                    alignSelf: 'flex-start',
                    mt: '10px',
                  }}
                >
                  <IconButton onClick={() => handleDeleteStep(index)}>
                    <img src={removeIcon} alt="remove icon" height={20} width={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <BaseCardStyled
      elevation={6}
      isCardComplete={draftQuestion.correctCard.isCardComplete}
      isClone={isClone}
      style={{ gap: `${theme.sizing.mdPadding}px` }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px` }}>
        <QuestionTitleStyled sx={{ color: '#148700' }}>
          Correct Answer*
        </QuestionTitleStyled>
        <TextContainerStyled
          multiline
          variant="outlined"
          rows="1"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'Rubik',
              height: '43px',
            },
            '& .MuiInputBase-input': {
              color: '#47366C',
              opacity:  isCardErrored && isCardSubmitted ? 1 : 0.5,
              '&::placeholder': {
                color:  isCardErrored && isCardSubmitted ? '#D0254D' : '#47366C',
                opacity:  isCardErrored && isCardSubmitted ? 1 : 0.5,
              },
              '&:focus': {
                color: '#47366C',
                opacity: 1,
              },
              '&:focus::placeholder': {
                color: '#47366C',
                opacity: 1,
              },
            },
          }}
          placeholder="Enter Your Correct Answer Here"
          value={draftQuestion.correctCard.answer}
          onChange={(e) =>
            handleCorrectAnswerChange(e.target.value, draftQuestion)
          }
          error={
            (isCardSubmitted || isAIError) &&
            (!draftQuestion.correctCard.answer ||
              draftQuestion.correctCard.answer.length === 0)
          }
          InputProps={{
            startAdornment: (isCardSubmitted || isAIError) &&
              (!draftQuestion.correctCard.answer ||
                draftQuestion.correctCard.answer.length === 0) && (
                <InputAdornment
                  position="start"
                  sx={{
                    alignSelf: 'flex-start',
                    mt: '5px',
                  }}
                >
                  <ErrorIcon src={errorIcon} alt="error icon" />
                </InputAdornment>
              ),
          }}
        />
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px` }}>
        <QuestionTitleStyled sx={{ color: '#47366C' }}>
          Solution Explanation*
        </QuestionTitleStyled>
        {draftQuestion.correctCard.answerSteps &&
          draftQuestion.correctCard.answerSteps.map((step, index) =>
            answerStepsComponent(step, index),
          )}
      
        { isCardErrored && isCardSubmitted && <ErrorBox />}
        <Box style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={addStep}>
          <Typography
            sx={{
              fontFamily: 'Rubik',
              fontSize: '16px',
              fontWeight: '400',
              textDecoration: 'underline',
            }}
          >
            Add Step
          </Typography>
        </Box>
      </Box>
    </BaseCardStyled>
  );
}
