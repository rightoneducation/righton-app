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
import { QuestionTitleStyled } from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  TextContainerStyled,
  BaseCardStyled,
} from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ErrorIcon,
  RemoveQuestionIcon,
} from '../../../../lib/styledcomponents/CentralStyledComponents';
import CentralButton from '../../../button/Button';
import { ButtonType } from '../../../button/ButtonModels';
import ErrorBox from '../../createquestion/ErrorBox';
import errorIcon from '../../../../images/errorIcon.svg';
import {
  ScreenSize,
  AnswerSettingsDropdownType,
} from '../../../../lib/CentralModels';
import removeIcon from '../../../../images/buttonRemoveQuestion.svg';

interface IncorrectAnswerCardProps {
  screenSize: ScreenSize;
  isClone: boolean;
  cardIndex: number;
  draftQuestion: CentralQuestionTemplateInput;
  isHighlight: boolean;
  handleIncorrectAnswerChange: (
    answer: string,
    draftQuestion: CentralQuestionTemplateInput,
  ) => void;
  handleIncorrectExplanationChange: (
    explanation: string,
    draftQuestion: CentralQuestionTemplateInput,
  ) => void;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
  isAIError: boolean;
}

export default function IncorrectAnswerCard({
  screenSize,
  cardIndex,
  isClone,
  draftQuestion,
  isHighlight,
  handleIncorrectAnswerChange,
  handleIncorrectExplanationChange,
  isCardSubmitted,
  isCardErrored,
  isAIError,
}: IncorrectAnswerCardProps) {
  const theme = useTheme();

  return (
    <BaseCardStyled
      elevation={6}
      isHighlight={isHighlight}
      isCardComplete={draftQuestion.correctCard.isCardComplete}
      isClone={isClone}
    >
      <QuestionTitleStyled sx={{ color: '#47366C' }}>
        Incorrect Answer {cardIndex+1}
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
            opacity: isCardErrored ? 1 : 0.5,
            '&::placeholder': {
              color: isCardErrored ? '#D0254D' : '#47366C',
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
        placeholder="Enter incorrect answer here..."
        value={draftQuestion.incorrectCards[cardIndex].answer}
        onChange={(e) =>
          handleIncorrectAnswerChange(e.target.value, draftQuestion)
        }
        error={
          (isCardSubmitted || isAIError) &&
          (!draftQuestion.incorrectCards[cardIndex].answer ||
            draftQuestion.incorrectCards[cardIndex].answer.length === 0)
        }
        InputProps={{
          startAdornment: (isCardSubmitted || isAIError) &&
            (!draftQuestion.incorrectCards[cardIndex].answer ||
              draftQuestion.incorrectCards[cardIndex].answer.length === 0) && (
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
      <QuestionTitleStyled sx={{ color: '#47366C' }}>
        Solution Explanation
      </QuestionTitleStyled>
      <TextContainerStyled
        multiline
        variant="outlined"
        rows="5"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'Rubik',
          },
          '& .MuiInputBase-input': {
            color: '#47366C',
            opacity: isCardErrored ? 1 : 0.5,
            '&::placeholder': {
              color: isCardErrored ? '#D0254D' : '#47366C',
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
        placeholder="Enter explanation here..."
        value={draftQuestion.incorrectCards[cardIndex].answer}
        onChange={(e) =>
          handleIncorrectExplanationChange(e.target.value, draftQuestion)
        }
        error={
          (isCardSubmitted || isAIError) &&
          (!draftQuestion.incorrectCards[cardIndex].explanation ||
            draftQuestion.incorrectCards[cardIndex].explanation.length === 0)
        }
        InputProps={{
          startAdornment: (isCardSubmitted || isAIError) &&
            (!draftQuestion.incorrectCards[cardIndex].explanation ||
              draftQuestion.incorrectCards[cardIndex].explanation.length === 0) && (
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
      {isCardErrored && <ErrorBox />}
    </BaseCardStyled>
  );
}
