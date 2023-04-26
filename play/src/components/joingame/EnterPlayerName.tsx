import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import InputTextFieldStyled from '../../lib/styledcomponents/InputTextFieldStyled';
import BackgroundContainerStyled from '../../lib/styledcomponents/BackgroundContainerStyled';
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

interface EnterPlayerNameProps {
  firstNameValue: string;
  setFirstNameValue: (newValue: string) => void;
  lastNameValue: string;
  setLastNameValue: (newValue: string) => void;
  isSmallDevice: boolean;
  inputError: boolean;
}

export default function EnterPlayerName({
  firstNameValue,
  setFirstNameValue,
  lastNameValue,
  setLastNameValue,
  isSmallDevice,
  inputError,
}: EnterPlayerNameProps) {
  const theme = useTheme();

  return (
    <BackgroundContainerStyled>
      <StackContainer spacing={isSmallDevice ? 2 : 5}>
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
            Enter Your Name
          </Typography>
          <Grid container spacing={2} wrap="nowrap">
            <Grid item xs={6}>
              <InputTextFieldStyled
                fullWidth
                variant="filled"
                autoComplete="off"
                placeholder={InputPlaceholder.FIRST_NAME}
                onChange={(event) => setFirstNameValue(event.target.value)}
                value={firstNameValue}
                InputProps={{
                  disableUnderline: true,
                  inputProps: {
                    style: {
                      color: theme.palette.primary.darkBlue,
                      paddingTop: '9px',
                      textAlign: 'center',
                      fontSize: `${theme.typography.h2.fontSize}px`,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextFieldStyled
                fullWidth
                variant="filled"
                autoComplete="off"
                placeholder={InputPlaceholder.LAST_NAME}
                onChange={(event) => setLastNameValue(event.target.value)}
                value={lastNameValue}
                InputProps={{
                  disableUnderline: true,
                  inputProps: {
                    style: {
                      color: theme.palette.primary.darkBlue,
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
        <IntroButtonStyled>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Enter
          </Typography>
        </IntroButtonStyled>
        {inputError ? (
          <PaddedContainer>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                marginBottom: `${theme.sizing.smallPadding}px`,
              }}
            >
              Type in both your first and last name to enter the game.
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontWeight: 400, textAlign: 'center' }}
            >
              This will be used to identify you only during the game, and will
              not be stored.
            </Typography>
          </PaddedContainer>
        ) : null}
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
