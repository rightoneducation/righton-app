import React from 'react';
import { Typography, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { CloudFrontDistributionUrl } from '@righton/networking';
import QuestionCardStyled from '../lib/styledcomponents/QuestionCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface QuestionCardProps {
  questionText: string;
  imageUrl: string;
}

const QuestionImage = styled('img')({
  width: '100%',
  height: '186px',
  minHeight: '186px',
  objectFit: 'cover',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
});

export default function QuestionCard({
  questionText,
  imageUrl,
}: QuestionCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <QuestionCardStyled elevation={10}>
      <BodyCardContainerStyled>
        <QuestionImage
          src={`${CloudFrontDistributionUrl}${imageUrl}`}
          alt="Question"
        />
        <Typography variant="body1" sx={{padding: `${theme.sizing.mdPadding}px`, whiteSpace: 'pre-line'}}> {questionText} </Typography>
      </BodyCardContainerStyled>
    </QuestionCardStyled>
  );
}
