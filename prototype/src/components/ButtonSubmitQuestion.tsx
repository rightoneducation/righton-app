import React from 'react';
import { Typography } from '@mui/material';
import {
  GamePlayButtonStyled,
  GamePlayButtonStyledDisabled,
} from '../lib/GamePlayButtonStyled';

interface ButtonSubmitQuestionProps {
  isSubmitted: boolean;
  isFormComplete: boolean;
  isQuestionGenerating: boolean;
  handleSubmitQuestion: () => void;
}

export default function ButtonSubmitQuestion({
  isSubmitted,
  isFormComplete,
  isQuestionGenerating,
  handleSubmitQuestion
}: ButtonSubmitQuestionProps) {
  const buttonText = isSubmitted
    ? 'Submitted'
    : (isQuestionGenerating ? 'Generating...' :  (isFormComplete ? 'Submit' : 'Fill out all fields'));
    const buttonContents = (
      <Typography sx={{ textTransform: 'none' }} variant="button">
        {buttonText}
      </Typography>
    );
    
    return !isSubmitted ? (
      isFormComplete ? (
        <GamePlayButtonStyled
          data-testid="answer-button-enabled"
          onClick={handleSubmitQuestion}
          animate={isQuestionGenerating}
        >
          {buttonContents}
        </GamePlayButtonStyled>
      ) : (
        <GamePlayButtonStyledDisabled data-testid="answer-button-disabled" disabled animate={false}>
          {buttonContents}
        </GamePlayButtonStyledDisabled>
      )
    ) : (
      <GamePlayButtonStyledDisabled data-testid="answer-button-disabled" disabled animate={false}>
        {buttonContents}
      </GamePlayButtonStyledDisabled>
    );    
}
