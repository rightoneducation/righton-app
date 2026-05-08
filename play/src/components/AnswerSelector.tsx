import React from 'react';
import { Button, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import CorrectAnswerImage from '../img/correctAnswerImage.svg';
import PlayerCorrectImage from '../img/PlayerCorrectImage.svg';
import { AnswerState } from '../lib/PlayModels';

type AnswerSelectorProps = {
  isSubmitted: boolean;
};

const AnswerSelectorDefault = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSubmitted',
})<AnswerSelectorProps>(({ isSubmitted, theme }) => ({
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '42px',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textTransform: 'none',
  border: `1px solid ${theme.palette.primary.darkGrey}`,
  backgroundColor: `${theme.palette.primary.main}`,
  '&:hover': {
    border: !isSubmitted
      ? `1px solid ${theme.palette.designSystem.surface.coolBlue}`
      : `1px solid ${theme.palette.primary.darkGrey}`,
  },
}));

const AnswerSelectorCorrect = styled(AnswerSelectorDefault)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.correctColor}`,
  backgroundColor: `${theme.palette.primary.correctColor}`,
}));

const AnswerSelectorSelected = styled(AnswerSelectorDefault, {
  shouldForwardProp: (prop) => prop !== 'isSubmitted',
})(({ isSubmitted, theme }) => ({
  border: !isSubmitted
    ? `1px solid ${theme.palette.designSystem.surface.coolBlue}`
    : `1px solid ${theme.palette.primary.darkGrey}`,
  backgroundColor: !isSubmitted
    ? alpha(theme.palette.designSystem.surface.coolBlue, 0.1)
    : `${theme.palette.primary.main}`,
  '&:hover': {
    border: !isSubmitted
      ? `1px solid ${theme.palette.designSystem.surface.coolBlue}`
      : `1px solid ${theme.palette.primary.darkGrey}`,
    backgroundColor: !isSubmitted
      ? alpha(theme.palette.designSystem.surface.coolBlue, 0.1)
      : `${theme.palette.primary.main}`,
  },
}));

interface AnswerSelectorComponentProps {
  answerStatus: AnswerState;
  index: number;
  answerText: string;
  isSubmitted: boolean;
  handleSelectAnswer: (answerText: string, multiChoiceCharacter: string) => void;
}

export default function AnswerSelector({
  answerStatus,
  index,
  answerText,
  isSubmitted,
  handleSelectAnswer,
}: AnswerSelectorComponentProps) {
  const theme = useTheme();
  const letterCode = 'A'.charCodeAt(0) + index;

  const buttonContents = (
    <>
      <Typography
        variant="h3"
        sx={{
          color: `${theme.palette.designSystem.surface.coolBlue}`,
          paddingLeft:
            !isSubmitted && answerStatus === AnswerState.SELECTED
              ? '1px'
              : '2px', // compensates for increased border thickness when selected
          paddingTop: '2px',
          opacity:
            isSubmitted ? 0.5 : 1,
        }}
      >
        {String.fromCharCode(letterCode)}
      </Typography>
      <Typography
        variant="paragraph"
        sx={{
          color: `${theme.palette.designSystem.surface.play}`,
          paddingLeft: `${theme.sizing.extraSmallPadding}px`,
          paddingRight: `${theme.sizing.largePadding}px`,
        }}
      >
        {answerText}
      </Typography>
    </>
  );

  switch (answerStatus) {
    case AnswerState.CORRECT:
      return (
        <AnswerSelectorCorrect
          onClick={() => handleSelectAnswer(answerText, String.fromCharCode(letterCode))}
          disabled
          variant="text"
          isSubmitted={isSubmitted}
        >
          {buttonContents}
        </AnswerSelectorCorrect>
      );
    case AnswerState.SELECTED:
      return (
        <AnswerSelectorSelected
          onClick={() => handleSelectAnswer(answerText, String.fromCharCode(letterCode))}
          disabled={isSubmitted}
          variant="text"
          isSubmitted={isSubmitted}
        >
          {buttonContents}
        </AnswerSelectorSelected>
      );
    case AnswerState.DEFAULT:
    default:
      return (
        <AnswerSelectorDefault
          onClick={() => handleSelectAnswer(answerText, String.fromCharCode(letterCode))}
          variant="text"
          disabled={isSubmitted}
          isSubmitted={isSubmitted}
        >
          {buttonContents}
        </AnswerSelectorDefault>
      );
  }
}