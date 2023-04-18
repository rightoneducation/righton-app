import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { IntroButton, JoinGameBackgroundContainer } from '../../lib/styledcomponents/StyledComponents';
import Logo from '../../img/rightOnLogo.svg';

const StackContainer = styled(Stack)(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: theme.breakpoints.values.xs,
})
);

export default function SplashScreen() {
  const theme = useTheme();
  return (
    <JoinGameBackgroundContainer>
    <StackContainer spacing = {5}>
       <img
              style = {{width: '214px', height: '118px', paddingTop: `${theme.sizing.extraLargePadding}px`}}
              src={Logo}
              alt="Question"
            />
    <Typography variant="h2" sx={{weight:700, textAlign: 'center'}}> Unlocking every student`s potential in math!</Typography>
      <IntroButton>
        <Typography variant="h2" sx={{textAlign: 'center'}}>Join Game</Typography>
      </IntroButton>
    </StackContainer>
    </JoinGameBackgroundContainer>
  );
}