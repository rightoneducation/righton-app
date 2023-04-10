import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnswerButton = styled(Button)({
  width: '160px',
  height: '26px',
  borderRadius: '22px',
  textTransform: 'none',
  background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)',
  boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
  '&:hover': {
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)',
  },
});

const AnswerButtonDisabled = styled(AnswerButton)({
  background: '#909090',
  boxShadow: 'none',
  '&:hover': {
    background: '#909090',
  },
});

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
