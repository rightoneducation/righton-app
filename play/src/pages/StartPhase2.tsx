import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
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
  whiteSpace: 'pre-wrap'
}));

const title = 'Starting Phase 2...';
const subtitle = 'where the most popular wrong answer wins the most points!';
const title2 = 'Pick the answer you think tricked most of your classmates!';

export default function StartPhase2() {
  const theme = useTheme();
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
            {title}
          </TypographyStyled>
          <TypographyStyled
            variant="body2"
            sx={{
              color: `${theme.palette.primary.main}`,
            }}
          >
            {subtitle}
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
          {title2}
        </TypographyStyled>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}