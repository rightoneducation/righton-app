import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  LocalAnswer,
  GameSessionState,
  IChoice,
  AnswerType
} from '@righton/networking';
import {
  GamePlayButtonStyled,
  GamePlayButtonStyledDisabled,
} from '../lib/styledcomponents/GamePlayButtonStyled';

interface ButtonSubmitAnswerProps {
  isSelected: boolean;
  isSubmitted: boolean;
  isHint: boolean;
  isShortAnswerEnabled: boolean;
  selectedAnswer?: string | null;
  answers?: IChoice[] | undefined;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitAnswer: (answer: LocalAnswer) => void;
}

export default function ButtonSubmitAnswer({
  isSelected,
  isSubmitted,
  isHint,
  isShortAnswerEnabled,
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
  const hintButtonText = isSubmitted
    ? t('gameinprogress.button.submitted')
    : t('gameinprogress.button.hint');
  const buttonContents = (
    <Typography sx={{ textTransform: 'none' }} variant="button">
      {isHint ? hintButtonText : buttonText}
    </Typography>
  );
  return isSelected && !isSubmitted ? (
    <GamePlayButtonStyled
      data-testid="answer-button-enabled"
      onClick={() => {
        const answerText = selectedAnswer;
        const answer = new LocalAnswer({
          answerContent: {
            rawAnswer: answerText ?? '',
            normAnswer: [],
          },
          isShortAnswerEnabled,
          isSubmitted: true,
          currentState,
          currentQuestionIndex,
        });

        handleSubmitAnswer(answer);
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
