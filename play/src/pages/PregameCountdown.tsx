import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import BackgroundContainerStyled from '../lib/styledcomponents/layout/BackgroundContainerStyled';
import RadialTimer from '../components/RadialTimer';

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

const subtitle1 = 'Your question will appear soon.';
const subtitle2 = 'Pick the correct answer!';

export default function StartPhase2() {
  const theme = useTheme();
  return (
    <BackgroundContainerStyled>
      <StackContainer spacing={5}>
        <RadialTimer
          inputColors={[
            'rgb(126, 90, 175)',
            'rgb(148, 98, 179)',
            'rgb(169, 104, 180)',
            'rgb(186, 107, 177)',
            'rgb(202, 109, 172)',
            'rgb(218, 112, 168)',
            'rgb(237, 115, 166)',
            'rgb(255, 120, 165)',
          ]}
          radius={110}
          timerStartInSeconds={5}     
        />
        <TypographyStyled variant="h2">
          {subtitle1}
        </TypographyStyled>
        <TypographyStyled variant="h2">
          {subtitle2}
        </TypographyStyled>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
