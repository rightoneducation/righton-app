import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import {
  IntroButton,
  IntroTextField,
  JoinGameBackgroundContainer,
} from '../../lib/styledcomponents/StyledComponents';
import Logo from '../../img/rightOnLogo.svg';

const StackContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: theme.breakpoints.values.xs,
}));

const PaddedContainer = styled(Box)(({ theme }) => ({
  paddingLeft: `${theme.sizing.smallPadding}px`,
  paddingRight: `${theme.sizing.smallPadding}px`,
}));

interface EnterPlayerNameProps {
  playerFirstName: string;
  playerLastName: string;
  handlePlayerFirstNameChange: (newValue: string) => void;
  handlePlayerLastNameChange: (newValue: string) => void;
  inputError: boolean;
}

export default function EnterPlayerName({
  playerFirstName,
  playerLastName,
  handlePlayerFirstNameChange,
  handlePlayerLastNameChange,
  inputError,
}: EnterPlayerNameProps) {
  const theme = useTheme();
  return (
    <JoinGameBackgroundContainer>
      <StackContainer spacing={5}>
        <img
          style={{
            width: '214px',
            height: '118px',
            paddingTop: `${theme.sizing.extraLargePadding}px`,
          }}
          src={Logo}
          alt="Question"
        />
        <PaddedContainer>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            {' '}
            Enter Your Name{' '}
          </Typography>
          <Grid container spacing={2} wrap="nowrap">
            <Grid item xs={6}>
              <IntroTextField
                fullWidth
                variant="filled"
                autoComplete="off"
                onChange={(newValue) => {
                  handlePlayerFirstNameChange(newValue.target.value);
                }}
                onFocus={(newValue) => {
                  if (newValue.target.value === 'First Name') {
                    handlePlayerFirstNameChange('');
                  }
                }}
                value={playerFirstName}
                InputProps={{
                  disableUnderline: true,
                  inputProps: {
                    style: {
                      color:
                        playerFirstName === 'First Name'
                          ? theme.palette.primary.darkGrey
                          : theme.palette.primary.extraDarkGrey,
                      paddingTop: '9px',
                      textAlign: 'center',
                      fontSize: `${theme.typography.h2.fontSize}px`,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <IntroTextField
                fullWidth
                variant="filled"
                autoComplete="off"
                onChange={(newValue) => {
                  handlePlayerLastNameChange(newValue.target.value);
                }}
                onFocus={(newValue) => {
                  if (newValue.target.value === 'Last Name') {
                    handlePlayerLastNameChange('');
                  }
                }}
                value={playerLastName}
                InputProps={{
                  disableUnderline: true,
                  inputProps: {
                    style: {
                      color:
                        playerLastName === 'Last Name'
                          ? theme.palette.primary.darkGrey
                          : theme.palette.primary.extraDarkGrey,
                      paddingTop: '9px',
                      textAlign: 'center',
                      fontSize: `${theme.typography.h2.fontSize}px`,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </PaddedContainer>
        <IntroButton>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Enter
          </Typography>
        </IntroButton>
        {inputError ? (
          <PaddedContainer>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                marginBottom: `${theme.sizing.smallPadding}px`,
              }}
            >
              {' '}
              Type in both your first and last name to enter the game.{' '}
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontWeight: 400, textAlign: 'center' }}
            >
              {' '}
              This will be used to identify you only during the game, and will
              not be stored.{' '}
            </Typography>
          </PaddedContainer>
        ) : null}
      </StackContainer>
    </JoinGameBackgroundContainer>
  );
}
