import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BackendAnswer,
  GameSessionState,
  IChoice,
  ITeam,
  AnswerFactory,
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
  questionId: string,
  teamMemberAnswersId: string,
  currentTeam: ITeam | null,
  handleSubmitAnswer: (answer: BackendAnswer) => void;
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
  questionId,
  teamMemberAnswersId,
  currentTeam,
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
  console.log(isSelected);
  return isSelected && !isSubmitted ? (
    <GamePlayButtonStyled
      data-testid="answer-button-enabled"
      onClick={() => {
        const submitAnswer = new BackendAnswer(
          AnswerFactory.createAnswer(selectedAnswer ?? '', AnswerType.MULTICHOICE),
          true,
          isShortAnswerEnabled,
          currentState,
          currentQuestionIndex,
          questionId,
          teamMemberAnswersId,
          currentTeam?.id ?? '',
          currentTeam?.name ?? '',
        );

        handleSubmitAnswer(submitAnswer);
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