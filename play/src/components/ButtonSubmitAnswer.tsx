import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  GamePlayButtonStyled,
  GamePlayButtonStyledDisabled,
} from '../lib/styledcomponents/GamePlayButtonStyled';

interface ButtonSubmitAnswerProps {
  isSelected: boolean;
  isSubmitted: boolean;
  handleRetrieveAnswer: () => void;
}

export default function ButtonSubmitAnswer({
  isSelected,
  isSubmitted,
  handleRetrieveAnswer,
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
        handleRetrieveAnswer();
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
