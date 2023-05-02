import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import InputTextFieldStyled from '../../lib/styledcomponents/InputTextFieldStyled';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import { InputPlaceholder } from '../../lib/PlayModels';
import Logo from '../../img/rightOnLogo.svg';

const StackContainer = styled(Stack)(({ theme }) => ({
  position: 'fixed',
  height: '100%',
  top: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: theme.breakpoints.values.xs,
}));

const PaddedContainer = styled(Box)(({ theme }) => ({
  paddingLeft: `${theme.sizing.smallPadding}px`,
  paddingRight: `${theme.sizing.smallPadding}px`,
}));

interface CongratsProps {
  score: number;
  isSmallDevice: boolean;
}

export default function Congrats({
  score,
  isSmallDevice,
}: CongratsProps) {
  const theme = useTheme();
  const introString = `You've earned a total of`;

  return (
    <BackgroundContainerStyled>
      <StackContainer spacing={isSmallDevice ? 2 : 5}>
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          {introString}
        </Typography>
        <PaddedContainer>
          <Typography variant="h1" sx={{ textAlign: 'center' }}>
            {`${score} points`}
          </Typography>
        </PaddedContainer>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
