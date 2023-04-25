import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { GameSessionState } from '@righton/networking';
import CorrectStars from '../img/CorrectStars.svg';
import SelectedAnswerImage from '../img/selectedAnswerImage.svg';
import CorrectAnswerImage from '../img/correctAnswerImage.svg';
import { AnswerState } from '../lib/PlayModels';


type ResultSelectorProps = {
  isSubmitted: boolean;
};

const ResultSelectorDefault = styled(Container)(({ theme }) => ({
  width: '100%',
  minHeight: '42px',
  borderRadius: '22px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  backgroundColor: theme.palette.primary.lightGrey,
  maxWidth: '100%', // overwrite MUI default maxWidth
}));

const ResultSelectorCorrect = styled(ResultSelectorDefault)(({ theme }) => ({
  backgroundColor: theme.palette.primary.correctColor,
}));

const ResultSelectorSelected = styled(ResultSelectorDefault)(({ theme }) => ({
  backgroundColor: theme.palette.primary.darkPurple,
}));

interface ResultSelectorComponentProps {
  answerStatus: AnswerState;
  index: number;
  answerText: string;
  percentageText: string;
  currentState: GameSessionState;
}

export default function ResultSelector({
  answerStatus,
  index,
  answerText,
  percentageText,
  currentState,
} : ResultSelectorComponentProps) {
  const theme = useTheme();
  const letterCode = 'A'.charCodeAt(0) + index;
 
  const imageMap = {
    [AnswerState.DEFAULT]: '',
    [AnswerState.CORRECT]: CorrectAnswerImage,
    [AnswerState.SELECTED]: SelectedAnswerImage,
  };

  const buttonContents = (
    <>
      <Box style={{display: 'flex', alignItems: 'center'}}>
        <Typography
          variant="h5"
          sx={{
            paddingLeft: '1px',
            paddingTop: '2px',
            opacity: 0.5,
            color: (answerStatus === AnswerState.SELECTED ? theme.palette.primary.main : null),
          }}
        >
          {`${String.fromCharCode(letterCode)}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            paddingLeft: `${theme.sizing.extraSmallPadding}px`,
            paddingRight: `${theme.sizing.largePadding}px`,
            color: (answerStatus === AnswerState.SELECTED ? theme.palette.primary.main : null),
          }}
        >
          {answerText}
        </Typography>
      </Box>
      <Box style={{display: 'flex', alignItems: 'center'}}>
        { currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER && (
        <Typography
          variant="body2"
          sx={{
            paddingLeft: `${theme.sizing.extraSmallPadding}px`,
            paddingRight: `${theme.sizing.smallPadding}px`,
            color: (answerStatus === AnswerState.SELECTED ? theme.palette.primary.main : null),
          }}
        >
          {percentageText}
        </Typography>
        )}
        { answerStatus === AnswerState.CORRECT && (
          <img
            src={imageMap[answerStatus]}
            style={{
              position: 'absolute',
              right: `${theme.sizing.smallPadding}px`,
              width: `${theme.sizing.smallPadding}px`,
              height: `${theme.sizing.smallPadding}px`,
              paddingTop: '2px',
            }}
            alt="SelectedAnswerImage"
          />
          )}
      </Box>
    </>
  );

  switch (answerStatus) {
    case AnswerState.CORRECT:
      return (
        <ResultSelectorCorrect
        >
          {buttonContents}
        </ResultSelectorCorrect>
      );
    case AnswerState.SELECTED:
      return (
        <ResultSelectorSelected
        >
          {buttonContents}
        </ResultSelectorSelected>
      );
    case AnswerState.DEFAULT:
    default:
      return (
        <ResultSelectorDefault
        >
          {buttonContents}
        </ResultSelectorDefault>
      );
  }
}
