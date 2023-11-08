import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ITeamAnswerContent,
  GameSessionState,
  INormAnswer,
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
  selectedAnswer?: number | null;
  answers?: IChoice[] | undefined;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitAnswer: (answer: ITeamAnswerContent) => void;
}

export default function ButtonSubmitAnswer({
  isSelected,
  isSubmitted,
  isHint,
  selectedAnswer,
  answers,
  currentState,
  currentQuestionIndex,
  handleSubmitAnswer,
}: ButtonSubmitAnswerProps) {
  const { t } = useTranslation();
  const buttonText = isSubmitted // eslint-disable-line no-nested-ternary
    ? t('gameinprogress.button.submitted')
    : (isHint 
      ? t('gameinprogress.button.submitHint') 
      : t('gameinprogress.button.submit'));
  const buttonContents = (
    <Typography sx={{ textTransform: 'none' }} variant="button">
      {buttonText}
    </Typography>
  );
  return isSelected && !isSubmitted ? (
    <GamePlayButtonStyled
      data-testid="answer-button-enabled"
      onClick={() => {
        const answerText = answers?.[selectedAnswer ?? 0]?.text;
        const answer = {
          rawAnswer: answerText ?? '',
          normAnswer: 
            {
              [AnswerType.NUMBER]: [],
              [AnswerType.STRING]: [],
              [AnswerType.EXPRESSION]: [],
            } as INormAnswer,
          multiChoiceAnswerIndex: selectedAnswer,
          isSubmitted: true,
          currentState,
          currentQuestionIndex,
        } as ITeamAnswerContent;

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
