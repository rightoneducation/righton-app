import React, { ChangeEvent, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InputPlaceholder } from '../../lib/PlayModels';
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
  isSmallDevice: boolean;
  handleGameCodeClick: (gameSessionId: string) => Promise<boolean>;
}

export default function EnterGameCode({
  isSmallDevice,
  handleGameCodeClick,
}: EnterGameCodeProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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
    if (!isGameCodeSuccess) setShouldShowError(true);
    else setShouldShowError(false);
  };

  return (
    <BackgroundContainerStyled>
      <StackContainer sx={{ width: `${theme.sizing.pregameMinColumnWidth}px` }} spacing={isSmallDevice ? 4 : 5}>
        <img
          style={{
            width: `${theme.sizing.pregameMinColumnWidth}px`,
            height: '118px',
            paddingTop: `${theme.sizing.extraLargePadding}px`,
          }}
          src={Logo}
          alt="Question"
        />
        {/* container here to trim the spacing set by parent stack between text and input, typ */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="h2" sx={{ weight: 700, textAlign: 'center' }}>
            {t('joingame.gamecode.title')}
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
            {t('joingame.gamecode.button')}
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
              {t('joingame.gamecode.error1')}
            </Typography>
            <Typography variant="h2" sx={{ weight: 700, textAlign: 'center' }}>
              {t('joingame.gamecode.error2')}
            </Typography>
          </PaddedContainer>
        )}
      </StackContainer>
    </BackgroundContainerStyled>
  );
}