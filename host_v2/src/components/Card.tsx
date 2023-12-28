import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface CardProps {
  bottomText?: string;
}

export default function Card({
  bottomText
}: CardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <Box display="inline" style={{ width: '100%' }}>
          <Typography
            variant="subtitle1"
            sx={{ width: '100%', textAlign: 'left' }}
          >
            {t('gamesession.card.title')}
          </Typography>
          <Typography variant="h4" sx={{ width: '100%', textAlign: 'left' }}>
            {t('gamesession.card.body')}
          </Typography>
          <Typography variant="h4" sx={{ width: '100%', textAlign: 'left' }}>
            {bottomText}
          </Typography>
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
