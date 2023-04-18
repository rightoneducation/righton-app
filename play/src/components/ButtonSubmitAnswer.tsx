import React from 'react';
import { Typography } from '@mui/material';
import {
  GamePlayButton,
  GamePlayDisabled,
} from '../lib/styledcomponents/StyledComponents';

interface ButtonSubmitAnswerProps {
  isSelected: boolean;
  isSubmitted: boolean;
  handleSubmitAnswer: (isSubmitted: boolean) => void;
}

export default function ButtonSubmitAnswer({
  isSelected,
  isSubmitted,
  handleSubmitAnswer,
}: ButtonSubmitAnswerProps) {
  const buttonText = isSubmitted ? 'Submitted' : 'Submit Answer';
  const buttonContents = (
    <Typography variant="button"> {buttonText} </Typography>
  );

  return isSelected && !isSubmitted ? (
    <GamePlayButton
      onClick={() => {
        handleSubmitAnswer(true);
      }}
    >
      {buttonContents}
    </GamePlayButton>
  ) : (
    <GamePlayDisabled disabled> {buttonContents} </GamePlayDisabled>
  );
}
