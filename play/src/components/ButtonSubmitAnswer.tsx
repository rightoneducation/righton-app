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
  handleSubmitAnswer: (isSubmitted: boolean) => void;
}

export default function ButtonSubmitAnswer({
  isSelected,
  isSubmitted,
  handleSubmitAnswer,
}: ButtonSubmitAnswerProps) {
  const { t } = useTranslation();
  const buttonText = isSubmitted ? t('gameinprogress.button.submitted') : t('gameinprogress.button.submit');
  const buttonContents = (
    <Typography variant="button"> {buttonText} </Typography>
  );

  return isSelected && !isSubmitted ? (
    <GamePlayButtonStyled
      onClick={() => {
        handleSubmitAnswer(true);
      }}
    >
      {buttonContents}
    </GamePlayButtonStyled>
  ) : (
    <GamePlayButtonStyledDisabled disabled> {buttonContents} </GamePlayButtonStyledDisabled>
  );
}
