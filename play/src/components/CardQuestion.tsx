import React from 'react';
import { Typography } from '@mui/material';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface CardQuestionProps {
  questionText: string[];
  imageUrl: string;
}

export default function CardQuestion({
  questionText,
  imageUrl,
}: CardQuestionProps) {
  return (
    <BodyCardStyled elevation={5}>
      <BodyCardContainerStyled>
        <img
          style={{ width: '75%', height: 'auto' }}
          src={imageUrl}
          alt="Question"
        />
        <Typography variant="body1"> {questionText[0]} </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, whiteSpace: 'pre-line' }}
        >
          {`\n ${questionText[1]}`}
        </Typography>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
