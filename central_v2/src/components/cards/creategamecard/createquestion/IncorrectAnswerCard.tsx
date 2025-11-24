import React from 'react';
import { Box, Fade, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CentralQuestionTemplateInput,
  AIButtonType,
  AIButton,
  WaegenInput,
} from '@righton/networking';
import { QuestionTitleStyled } from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  TextContainerStyled,
  BaseCardStyled,
} from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ErrorIcon,
} from '../../../../lib/styledcomponents/CentralStyledComponents';
import ErrorBox from '../../createquestion/ErrorBox';
import errorIcon from '../../../../images/errorIcon.svg';
import {
  ScreenSize,
} from '../../../../lib/CentralModels';
import { APIClientsContext } from '../../../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../../../hooks/context/useAPIClientsContext';

interface IncorrectAnswerCardProps {
  screenSize: ScreenSize;
  isClone: boolean;
  cardIndex: number;
  draftQuestion: CentralQuestionTemplateInput;
  isHighlight: boolean;
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
  isAISwitchEnabled: boolean;
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
  isAISwitchEnabled,
}: IncorrectAnswerCardProps) {
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const waegenInput: WaegenInput = {
    question: draftQuestion.questionCard.title,
    correctAnswer: draftQuestion.correctCard.answer,
    wrongAnswer: draftQuestion.incorrectCards[cardIndex].answer,
    discardedExplanations: JSON.stringify([draftQuestion.incorrectCards[cardIndex].explanation]),
  };

  const handleAIExplanationChange = (value: string) => {
    handleIncorrectExplanationChange(value, cardIndex);
  };

  return (
    <BaseCardStyled
      elevation={6}
      isCardComplete={draftQuestion.correctCard.isCardComplete}
      isClone={isClone}
      style={{
        ...(isAISwitchEnabled && {
          boxShadow: '0px 8px 16px -4px #5316B2',
        }),
      }}
    >
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
      <QuestionTitleStyled sx={{ color: '#47366C' }}>
        Explanation*
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
      <Fade in={isAISwitchEnabled} timeout={300} unmountOnExit>
        <Box
          style={{
            width: '100%',
          }}
        >
            <AIButton
              apiClients={apiClients}
              waegenInput={waegenInput}
              type={AIButtonType.WAE_GEN}
              handleClickOutput={(output) => handleAIExplanationChange(output)}
            />
        </Box>
      </Fade>
      {isCardErrored && <ErrorBox />}
    </BaseCardStyled>
  );
}
