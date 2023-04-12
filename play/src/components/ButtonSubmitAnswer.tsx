import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnswerButton = styled(Button)(({ theme }) => ({
  width: '160px',
  height: '26px',
  borderRadius: '22px',
  textTransform: 'none',
  background: `${theme.palette.primary.highlightGradient}`,
  boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
  '&:hover': {
    background: `${theme.palette.primary.highlightGradient}`,
  },
}));

const AnswerButtonDisabled = styled(AnswerButton)(({ theme }) => ({
  background: `${theme.palette.primary.extraDarkGrey}`,
  boxShadow: 'none',
  '&:hover': {
    background: `${theme.palette.primary.extraDarkGrey}`,
  },
}));

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
    <AnswerButton
      onClick={() => {
        handleSubmitAnswer(true);
      }}
    >
      {buttonContents}
    </AnswerButton>
  ) : (
    <AnswerButtonDisabled disabled> {buttonContents} </AnswerButtonDisabled>
  );
}
