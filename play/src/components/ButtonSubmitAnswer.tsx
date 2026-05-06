import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackendAnswer,
  GameSessionState,
  IChoice,
  ITeam,
  AnswerFactory,
  AnswerType,
  PlayButtonBlock,
  ButtonType,
} from '@righton/networking';

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
  const isEnabled = isSelected && !isSubmitted;
  // eslint-disable-next-line no-nested-ternary
  const buttonType = isSubmitted
    ? ButtonType.SUBMITTED
    : isHint
      ? ButtonType.HINT
      : ButtonType.SUBMIT;
  // eslint-disable-next-line no-nested-ternary
  const label = isSubmitted
    ? t('gameinprogress.button.submitted')
    : isHint
      ? t('gameinprogress.button.hint')
      : t('gameinprogress.button.submit');

  return (
    <PlayButtonBlock
      buttonType={buttonType}
      label={label}
      isEnabled={isEnabled}
      dataTestId={isEnabled ? 'answer-button-enabled' : 'answer-button-disabled'}
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
          selectedAnswer ?? '',
          false,
          null,
          null
        );
        handleSubmitAnswer(submitAnswer);
      }}
    />

  );
}
