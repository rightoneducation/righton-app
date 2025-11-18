import React, { useEffect } from 'react';
import { Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CentralQuestionTemplateInput,
} from '@righton/networking';
import { QuestionTitleStyled } from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  TextContainerStyled,
  BaseCardStyled,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ErrorIcon,
} from '../../../lib/styledcomponents/CentralStyledComponents';
import ErrorBox from './ErrorBox';
import errorIcon from '../../../images/errorIcon.svg';
import {
  ScreenSize,
} from '../../../lib/CentralModels';

interface IncorrectAnswerCardProps {
  screenSize: ScreenSize;
  isClone: boolean;
  cardIndex: number;
  draftQuestion: CentralQuestionTemplateInput;
  handleIncorrectAnswerChange: (
    answer: string,
    index: number
  ) => void;
  handleIncorrectExplanationChange: (
    explanation: string,
    index: number
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
      isCardComplete={draftQuestion.correctCard.isCardComplete}
      isClone={isClone}
      style={{paddingLeft: `${theme.sizing.mdPadding}px`, paddingRight: `${theme.sizing.mdPadding}px`, paddingTop: '14px', paddingBottom: '14px', gap: `${theme.sizing.mdPadding}px`}}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px` }}>
        <QuestionTitleStyled sx={{ color: '#47366C' }}>
          Incorrect Answer {cardIndex+1}*
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
          placeholder="Enter incorrect answer..."
          value={draftQuestion.incorrectCards[cardIndex].answer}
          onChange={(e) =>
            handleIncorrectAnswerChange(e.target.value, cardIndex)
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
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px` }}>
        <QuestionTitleStyled sx={{ color: '#47366C' }}>
          Solution Explanation*
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
              opacity: isCardErrored && isCardSubmitted ? 1 : 0.5,
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
          placeholder="Explain why this answer is incorrect..."
          value={draftQuestion.incorrectCards[cardIndex].explanation}
          onChange={(e) =>
            handleIncorrectExplanationChange(e.target.value, cardIndex)
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
      </Box>
      {(!draftQuestion.incorrectCards[cardIndex].explanation ||
        draftQuestion.incorrectCards[cardIndex].explanation.length === 0) && isCardSubmitted && <ErrorBox />}
    </BaseCardStyled>
  );
}
