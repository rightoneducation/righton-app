import React, { useEffect } from 'react';
import { Typography, Box, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Answer, CentralQuestionTemplateInput, AnswerType, AnswerPrecision } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import {
  QuestionTitleStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { 
  TextContainerStyled, 
  BaseCardStyled 
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ErrorIcon
} from '../../../lib/styledcomponents/CentralStyledComponents';
import CentralButton from '../../button/Button';
import { ButtonType } from '../../button/ButtonModels';
import ErrorBox from './ErrorBox';
import errorIcon from '../../../images/errorIcon.svg';
import SelectAnswerSetting from './SelectAnswerSetting';
import { ScreenSize, AnswerSettingsDropdownType } from '../../../lib/CentralModels';


interface DetailedQuestionSubCardProps {
  screenSize: ScreenSize;
  isClone: boolean;
  draftQuestion: CentralQuestionTemplateInput;
  isHighlight: boolean;
  handleCorrectAnswerChange: (correctAnswer: string, draftQuestion: CentralQuestionTemplateInput) => void;
  handleCorrectAnswerStepsChange: (steps: string[], draftQuestion: CentralQuestionTemplateInput) => void;
  handleAnswerSettingsChange: (draftQuestion: CentralQuestionTemplateInput, answerType: AnswerType,  answerPrecision?: AnswerPrecision, ) => void;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
  isAIError: boolean;
}

export default function DetailedQuestionSubCard({
  screenSize,
  isClone,
  draftQuestion,
  isHighlight, 
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

  const handleAnswerSettingsPrecisionTypeChange = (answerPrecision: AnswerPrecision) => {
    handleAnswerSettingsChange(draftQuestion, AnswerType.NUMBER, answerPrecision);
  };

  const answerStepsComponent = (step: string, index: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
          gap: `${theme.sizing.xSmPadding}px`,
        }}
        key={index}
      >
        <Typography
          sx={{
            minWidth: '12px',
            fontSize: `${theme.typography.h3.fontSize}px`,
            fontWeight: `${theme.typography.h3.fontWeight}`,
            color: `${theme.palette.primary.darkPurple}`,
          }}
        >
          {index + 1}
        </Typography>
        <TextContainerStyled
            multiline 
            variant="outlined" 
            value={draftQuestion.correctCard.answerSteps[index]}
            onChange={(e) => handleStepChange(index, e.target.value)}
            rows='4'
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'Rubik',
              },
             '& .MuiInputBase-input': {
              color: '#47366C',
              opacity: isCardErrored ? 1 : 0.5,
              '&::placeholder': {
                color: isCardErrored ? '#D0254D': '#384466',
                opacity: isCardErrored ? 1 : 0.5,
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
            placeholder={`Enter step ${index + 1}...`}
            error={(isCardErrored) && (!draftQuestion.correctCard.answerSteps[index] || draftQuestion.correctCard.answerSteps[index].length === 0)}
            InputProps={{
              startAdornment: 
              isCardErrored && (!draftQuestion.correctCard.answerSteps[index] || draftQuestion.correctCard.answerSteps[index].length === 0) &&
                <InputAdornment
                  position="start" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    mt: '10px',
                  }}
                >
                  <ErrorIcon src={errorIcon} alt='error icon'/>
                </InputAdornment>
            }}
          />
      </Box>
    );
  };
  
  return (
    <BaseCardStyled elevation={6} isHighlight={isHighlight} isCardComplete={draftQuestion.correctCard.isCardComplete} isClone={isClone}>
      <QuestionTitleStyled sx={{ color: "#47366C"}}>
        Correct Answer
      </QuestionTitleStyled>
      <TextContainerStyled
        multiline 
        variant="outlined" 
        rows='1'
        sx={{
              '& .MuiOutlinedInput-root': {
              fontFamily: 'Rubik',
              height: '43px',
            },
          '& .MuiInputBase-input': {
              color: '#47366C',
              opacity: isCardErrored ? 1 : 0.5,
                '&::placeholder': {
                  color: isCardErrored ? '#D0254D': '#384466',
                  opacity: isCardErrored ? 1 : 0.5,
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
        placeholder="Enter Correct Answer..." 
        value={draftQuestion.correctCard.answer}
        onChange={(e) => handleCorrectAnswerChange(e.target.value, draftQuestion)}
        error={(isCardSubmitted  || isAIError) && (!draftQuestion.correctCard.answer || draftQuestion.correctCard.answer.length === 0)}
        InputProps={{
          startAdornment: 
          (isCardSubmitted || isAIError) && (!draftQuestion.correctCard.answer || draftQuestion.correctCard.answer.length === 0) &&
            <InputAdornment
              position="start" 
              sx={{ 
                alignSelf: 'flex-start',
                mt: '5px'
              }}
            >
              <ErrorIcon src={errorIcon} alt='error icon'/>
            </InputAdornment>
        }}
      />
      <SelectAnswerSetting
          screenSize={screenSize}
          type={AnswerSettingsDropdownType.TYPE}
          isCardSubmitted={isCardSubmitted}
          answerSettingsType={draftQuestion.correctCard.answerSettings.answerType }
          onSetAnswerSettingsType={handleAnswerSettingsTypeChange}
          isCardError={isCardErrored}
      />
      { draftQuestion.correctCard.answerSettings.answerType === AnswerType.NUMBER &&
          <SelectAnswerSetting
          screenSize={screenSize}
          type={AnswerSettingsDropdownType.PRECISION}
          isCardSubmitted={isCardSubmitted}
          answerSettingsPrecisionType={draftQuestion.correctCard.answerSettings.answerPrecision}
          onSetAnswerSettingsPrecisionType={handleAnswerSettingsPrecisionTypeChange}
          isCardError={isCardErrored}
      />
      }
      <QuestionTitleStyled sx={{ color: "#47366C"}}>
        Solution Steps
      </QuestionTitleStyled>
      {draftQuestion.correctCard.answerSteps && 
        draftQuestion.correctCard.answerSteps.map((step, index) => 
          answerStepsComponent(step, index)
        )
      }
      { isCardErrored &&
          <ErrorBox/>
      }
      <Box style = {{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <CentralButton buttonType={ButtonType.ADDSTEP} isEnabled onClick={addStep}/>
      </Box>
    </BaseCardStyled>
  );
}
