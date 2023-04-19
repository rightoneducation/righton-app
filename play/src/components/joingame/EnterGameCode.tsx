import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
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

interface EnterGameCodeProps {
  gameCodeValue: string;
  handleGameCodeChange: (newValue: string) => void;
  inputError: boolean;
}

export default function EnterGameCode({
  gameCodeValue,
  handleGameCodeChange,
  inputError,
}: EnterGameCodeProps) {
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
        <Box>
          {/* container here to trim the spacing set by parent stack between text and input, typ */}
          <Typography variant="h2" sx={{ weight: 700, textAlign: 'center' }}>
            Enter Game Code
          </Typography>
          <IntroTextField
            fullWidth
            variant="filled"
            autoComplete="off"
            onChange={(newValue) => {
              handleGameCodeChange(newValue.target.value);
            }}
            onFocus={(newValue) => {
              if (newValue.target.value === '####') {
                handleGameCodeChange('');
              }
            }}
            value={gameCodeValue}
            InputProps={{
              disableUnderline: true,
              inputProps: {
                style: {
                  color:
                    gameCodeValue === '####'
                      ? theme.palette.primary.darkGrey
                      : theme.palette.primary.extraDarkGrey,
                  paddingTop: '9px',
                  textAlign: 'center',
                  fontSize: `${theme.typography.h2.fontSize}px`,
                },
              },
            }}
          />
        </Box>
        <IntroButton>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Join
          </Typography>
        </IntroButton>
        {inputError ? (
          <PaddedContainer>
            <Typography
              variant="h2"
              sx={{
                weight: 700,
                textAlign: 'center',
                marginBottom: `${theme.sizing.smallPadding}px`,
              }}
            >
              We are unable to join this game.
            </Typography>
            <Typography variant="h2" sx={{ weight: 700, textAlign: 'center' }}>
              Check the Game Code and try again.
            </Typography>
          </PaddedContainer>
        ) : null}
      </StackContainer>
    </JoinGameBackgroundContainer>
  );
}
