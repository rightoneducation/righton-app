import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import UnselectedAnswerImage from '../img/unselectedAnswerImage.svg';
import CorrectAnswerImage from '../img/correctAnswerImage.svg';
import SelectedAnswer from '../img/SelectedAnswer.svg';
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
  borderRadius: '22px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textTransform: 'none',
  border: `1px solid ${theme.palette.primary.darkGrey}`,
  backgroundColor: isSubmitted
    ? `${theme.palette.primary.lightGrey}`
    : `${theme.palette.primary.main}`,
}));

const AnswerSelectorCorrect = styled(AnswerSelectorDefault)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.correctColor}`,
  backgroundColor: `${theme.palette.primary.correctColor}`,
}));

const AnswerSelectorSelected = styled(AnswerSelectorDefault, {
  shouldForwardProp: (prop) => prop !== 'isSubmitted',
})(({ isSubmitted, theme }) => ({
  border: isSubmitted
    ? `1px solid ${theme.palette.primary.blue}`
    : `2px solid ${theme.palette.primary.blue}`,
  backgroundColor: isSubmitted
    ? `${theme.palette.primary.lightGrey}`
    : `${theme.palette.primary.main}`,
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
  const imageMap = {
    [AnswerState.DEFAULT]: UnselectedAnswerImage,
    [AnswerState.CORRECT]: CorrectAnswerImage,
    [AnswerState.SELECTED]: SelectedAnswer,
    [AnswerState.PREVIOUS]: SelectedAnswer,
    [AnswerState.PLAYER_SELECTED_CORRECT]: PlayerCorrectImage,
  };

  const selectorImage = [
    <img
      src={imageMap[answerStatus]}
      key={uuidv4()}
      style={{
        position: 'absolute',
        right: isSubmitted ? `17px` : `16px`,
        width: `16px`,
        height: `16px`,
        paddingTop: '2px',
        opacity: isSubmitted && answerStatus === AnswerState.SELECTED ? 0.5 : 1,
      }}
      alt="SelectedAnswerImage"
    />,
  ];

  const buttonContents = (
    <>
      <Typography
        variant="h5"
        sx={{
          paddingLeft:
            !isSubmitted && answerStatus === AnswerState.SELECTED
              ? '1px'
              : '2px', // compensates for increased border thickness when selected
          paddingTop: '2px',
          opacity:
            isSubmitted || answerStatus === AnswerState.CORRECT ? 0.5 : 1,
        }}
      >
        {String.fromCharCode(letterCode)}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          paddingLeft: `${theme.sizing.extraSmallPadding}px`,
          paddingRight: `${theme.sizing.largePadding}px`,
        }}
      >
        {answerText}
      </Typography>
      {!isSubmitted
        ? selectorImage
        : answerStatus !== AnswerState.DEFAULT && selectorImage}
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
