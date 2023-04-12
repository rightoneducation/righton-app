import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, Typography, Stack } from '@mui/material';
import { BodyCard, BodyCardContainer } from '../lib/styledcomponents/BodyCardComponents';

interface CardQuestionProps {
  questionText: string[];
  imageUrl: string;
}

export default function CardQuestion({
  questionText,
  imageUrl,
}: CardQuestionProps) {
  const theme = useTheme();
  
  return (
    <BodyCard elevation={5}>
      <BodyCardContainer>
        <img style={{ width: '75%', height: 'auto' }} src={imageUrl} alt="Question"/>
        <Typography variant="body1"> {questionText[0]} </Typography>
        <Typography variant="body1" sx={{fontWeight:700,  whiteSpace: 'pre-line'}}> {`\n ${questionText[1]}`} </Typography>
      </BodyCardContainer>
    </BodyCard>
  );
}
