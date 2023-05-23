import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BackgroundContainerStyled from '../lib/styledcomponents/layout/BackgroundContainerStyled';
import MagicHat from '../img/MagicHat.svg';

const StackContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  maxWidth: theme.breakpoints.values.xs,
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textAlign: `center`,
  paddingLeft: `${theme.sizing.mediumPadding}px`,
  paddingRight: `${theme.sizing.mediumPadding}px`,
  whiteSpace: 'pre-wrap',
}));

export default function StartPhase2() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <BackgroundContainerStyled>
      <StackContainer spacing={5}>
        <Stack sx={{ alignItems: 'center' }} spacing={2}>
          <TypographyStyled
            variant="h1"
            sx={{
              weight: 700,
            }}
          >
            {t('gameinprogress.startphase2.title')}
          </TypographyStyled>
          <TypographyStyled
            variant="body2"
            sx={{
              color: `${theme.palette.primary.main}`,
            }}
          >
            {t('gameinprogress.startphase2.subtitle1')}
          </TypographyStyled>
        </Stack>
        <img
          style={{
            width: '214px',
            height: '118px',
            paddingTop: `${theme.sizing.extraLargePadding}px`,
          }}
          src={MagicHat}
          alt="Question"
        />
        <TypographyStyled variant="h2">
          {t('gameinprogress.startphase2.subtitle2')}
        </TypographyStyled>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
