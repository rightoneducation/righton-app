import React, { ChangeEvent, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { InputPlaceholder } from '../../lib/PlayModels';
import { isGameCodeValid } from '../../lib/HelperFunctions';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import InputTextFieldStyled from '../../lib/styledcomponents/InputTextFieldStyled';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
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
  handleGameCodeClick: (gameSessionId: string) => Promise<boolean>;
}

export default function EnterGameCode({
  handleGameCodeClick,
}: EnterGameCodeProps) {
  const theme = useTheme();
  const [gameCodeValue, setGameCodeValue] = useState<string>('');
  const [shouldShowError, setShouldShowError] = useState<boolean>(false);

  // parsing the input value due to mui textfield limitations see: https://mui.com/material-ui/react-text-field/
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const numericValue = newValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setGameCodeValue(numericValue);
  };

  const validateInput = async (inputGameCodeValue: string) => {
    const isGameCodeSuccess = await handleGameCodeClick(inputGameCodeValue);
    if (!isGameCodeSuccess)
      setShouldShowError(true);
    else
      setShouldShowError(false);
  };

  return (
    <BackgroundContainerStyled>
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
        {/* container here to trim the spacing set by parent stack between text and input, typ */}
        <Box>
          <Typography variant="h2" sx={{ weight: 700, textAlign: 'center' }}>
            Enter Game Code
          </Typography>
          <InputTextFieldStyled
            fullWidth
            variant="filled"
            autoComplete="off"
            placeholder={InputPlaceholder.GAME_CODE}
            onChange={handleChange}
            value={gameCodeValue}
            InputProps={{
              disableUnderline: true,
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 4,
                style: {
                  color: theme.palette.primary.darkBlue,
                  paddingTop: '9px',
                  textAlign: 'center',
                  fontSize: `${theme.typography.h2.fontSize}px`,
                },
              },
            }}
          />
        </Box>
        <IntroButtonStyled onClick={() => validateInput(gameCodeValue)}>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Join
          </Typography>
        </IntroButtonStyled>
        {shouldShowError && (
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
        )}
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
