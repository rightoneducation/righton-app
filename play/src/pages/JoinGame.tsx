import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography } from '@mui/material';
import Logo from '../img/rightOnLogo.svg'

// interface JoinGameProps {

// }

const GridContainer = styled(Grid)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
}));

const StackContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  background: `${theme.palette.primary.radialGradient} no-repeat`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
);

export default function JoinGame() {
  const theme = useTheme();
  return (
  <GridContainer container>
    <Grid item xs={0} sm={2}  sx={{backgroundColor: theme.palette.primary.accent}}/>
    <Grid item xs={12} sm={8} >
      <StackContainer>
        <img
          style = {{width: '214px', height: '118px', paddingTop: `${theme.sizing.mediumPadding}px`}}
          src={Logo}
          alt="Question"
        />
        <Typography variant="body1" sx={{weight:700}}> Unlocking every student`s potential in math!</Typography>
      </StackContainer>
    </Grid>
    <Grid item xs={0} sm={2} sx={{backgroundColor: theme.palette.primary.accent}}/>
  </GridContainer>
  )
}