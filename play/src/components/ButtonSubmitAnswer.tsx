import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IAnswerContent, GameSessionState } from '@righton/networking';
import {
  GamePlayButtonStyled,
  GamePlayButtonStyledDisabled,
} from '../lib/styledcomponents/GamePlayButtonStyled';

interface ButtonSubmitAnswerProps {
  isSelected: boolean;
  isSubmitted: boolean;
  selectedAnswer?: number | null;
  answers?: { text: string; isCorrectAnswer: boolean }[] | undefined;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitAnswer: (answer: IAnswerContent) => void;
}

export default function ButtonSubmitAnswer({
  isSelected,
  isSubmitted,
  selectedAnswer,
  answers,
  currentState,
  currentQuestionIndex,
  handleSubmitAnswer,
}: ButtonSubmitAnswerProps) {
  const { t } = useTranslation();
  const buttonText = isSubmitted
    ? t('gameinprogress.button.submitted')
    : t('gameinprogress.button.submit');
  const buttonContents = (
    <Typography sx={{ textTransform: 'none' }} variant="button">
      {' '}
      {buttonText}{' '}
    </Typography>
  );
  return isSelected && !isSubmitted ? (
    <GamePlayButtonStyled
      data-testid="answer-button-enabled"
      onClick={() => {
        const answerText = answers?.[selectedAnswer ?? 0]?.text;
        handleSubmitAnswer({answerTexts: [answerText ?? ''], answerTypes: [0], multiChoiceAnswerIndex: selectedAnswer, isSubmitted, currentState, currentQuestionIndex});
      }}
    >
      {buttonContents}
    </GamePlayButtonStyled>
  ) : (
    <GamePlayButtonStyledDisabled data-testid="answer-button-disabled" disabled>
      {buttonContents}
    </GamePlayButtonStyledDisabled>
  );
}
