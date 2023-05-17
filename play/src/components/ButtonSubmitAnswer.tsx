import React from 'react';
import { Typography } from '@mui/material';
import {
  GamePlayButtonStyled,
  GamePlayButtonStyledDisabled,
} from '../lib/styledcomponents/GamePlayButtonStyled';

interface ButtonSubmitAnswerProps {
  isSelected: boolean;
  isSubmitted: boolean;
  selectedAnswer: number | null;
  answers: { text: string; isCorrectAnswer: boolean }[] | undefined;
  handleSubmitAnswer: (answer: string) => void;
}

export default function ButtonSubmitAnswer({
  isSelected,
  isSubmitted,
  selectedAnswer,
  answers,
  handleSubmitAnswer,
}: ButtonSubmitAnswerProps) {
  const buttonText = isSubmitted ? 'Submitted' : 'Submit Answer';
  const buttonContents = (
    <Typography variant="button"> {buttonText} </Typography>
  );

  return isSelected && !isSubmitted ? (
    <GamePlayButtonStyled
      onClick={() => {
        const answerText = answers?.[selectedAnswer ?? 0]?.text;
        handleSubmitAnswer(answerText ?? '');
      }}
    >
      {buttonContents}
    </GamePlayButtonStyled>
  ) : (
    <GamePlayButtonStyledDisabled disabled> {buttonContents} </GamePlayButtonStyledDisabled>
  );
}
