import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { InputObject } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import RichTextField from './RichTextEditor/RichTextEditor';

interface OpenAnswerCardProps {
  isSubmitted: boolean;
  handleSubmitAnswer: (result: InputObject) => void;
}

export default function OpenAnswerCard({
  isSubmitted,
  handleSubmitAnswer,
}: OpenAnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [result, setResult] = useState<InputObject>();

  return (
    <BodyCardStyled elevation={10} >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'left' }}>
           Enter your answer
         </Typography> 
        <RichTextField isSubmitted={isSubmitted} handleSubmitAnswer={handleSubmitAnswer} />
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
