import React from 'react';
import { Typography } from '@mui/material';
import {
  GamePlayButtonStyled,
  GamePlayButtonStyledDisabled,
} from '../lib/GamePlayButtonStyled';

interface ButtonSaveQuestionsProps {
  isSubmitted: boolean;
  isQuestionRegenerating: boolean;
  handleSaveQuestion: () => void;
}

export default function ButtonSaveQuestion({
  isSubmitted,
  isQuestionRegenerating,
  handleSaveQuestion: handleSaveQuestion
}: ButtonSaveQuestionsProps) {
  const buttonText = isSubmitted
    ? 'Saving...'
    : (isQuestionRegenerating ? 'Regenerating...' : 'Save Question');
    const buttonContents = (
      <Typography sx={{ textTransform: 'none' }} variant="button">
        {buttonText}
      </Typography>
    );
    
    return !isSubmitted ? (
      !isQuestionRegenerating? (
        <GamePlayButtonStyled
          data-testid="answer-button-enabled"
          onClick={handleSaveQuestion}
          animate={false}
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
