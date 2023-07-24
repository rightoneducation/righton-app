import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { InputObject } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import RichTextField from './RichTextEditor/RichTextEditor';

interface AnswerCardProps {
  answers: { text: string; isCorrectAnswer: boolean }[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: (answerText: string) => void;
  selectedAnswer: number | null;
}

export default function AnswerCard({
  answers,
  isSubmitted,
  handleSubmitAnswer,
  selectedAnswer,
}: AnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [result, setResult] = useState<InputObject>();

  return (
    <BodyCardStyled elevation={10} >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'left' }}>
           Enter your answer
         </Typography> 
        <RichTextField setResult={setResult} />
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
