import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, Typography, Stack } from '@mui/material';

const BodyCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  backgroundColor: theme.palette.primary.main,
}));

const CardContainer = styled(Stack)({
  marginTop: '24px',
  marginLeft: '16px',
  marginRight: '16px',
  marginBottom: '24px',
  alignItems: 'center',
});

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
      <CardContainer>
        <img style={{ width: '75%', height: 'auto' }} src={imageUrl} alt="Question"/>
        <Typography variant="body1"> {questionText[0]} </Typography>
        <Typography variant="body1" sx={{fontWeight:700}}> {`\n ${questionText[1]}`} </Typography>
      </CardContainer>
    </BodyCard>
  );
}
