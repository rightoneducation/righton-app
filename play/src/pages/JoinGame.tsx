import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { IntroButton, IntroTextField } from '../lib/styledcomponents/StyledComponents';
import Logo from '../img/rightOnLogo.svg'

// interface JoinGameProps {

// }


const IntroContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  background: `${theme.palette.primary.radialGradient} no-repeat`,
  backgroundSize: `100%`,
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
})
);

const StackContainer = styled(Stack)(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: theme.breakpoints.values.xs,

})
);

export default function JoinGame() {
  const theme = useTheme();
  return (
    <IntroContainer>
      <StackContainer spacing = {5}>
        <img
          style = {{width: '214px', height: '118px', paddingTop: `${theme.sizing.extraLargePadding}px`}}
          src={Logo}
          alt="Question"
        />
        <Typography variant="h2" sx={{weight:700, textAlign: 'center'}}> Unlocking every student`s potential in math!</Typography>
        <IntroTextField 
          fullWidth 
          variant="filled" 
          InputProps={{ 
            disableUnderline: true,
            inputProps: {
              style: {
               paddingTop: '9px'
              }
            }
          }} />
        <IntroButton>
          <Typography variant="h2" sx={{textAlign: 'center'}}>Join Game</Typography>
        </IntroButton>
     </StackContainer>
    </IntroContainer>
  )
}