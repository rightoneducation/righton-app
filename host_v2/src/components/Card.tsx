import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface CardProps {
  bottomText?: string;
}

const BodyCardStyled = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  margin: '8px',
  padding: `${theme.sizing.smallPadding}px`,
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
}));

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