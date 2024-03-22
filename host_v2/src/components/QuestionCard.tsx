import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface QuestionCardProps {
  questionText: string;
  imageUrl: string | undefined;
}

export default function QuestionCard({
  questionText,
  imageUrl,
}: QuestionCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled>
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'left' }}
        >
          {t('gamesession.questionCard.title')}
        </Typography>
        {imageUrl === undefined ? null : (
          <img
            style={{
              width: '75%',
              height: 'auto',
              paddingTop: `${theme.sizing.smallPadding}px`,
              paddingBottom: `${theme.sizing.smallPadding}px`,
            }}
            src={imageUrl}
            alt="Question"
          />
        )}
        <Typography variant="body1"> {questionText} </Typography>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
