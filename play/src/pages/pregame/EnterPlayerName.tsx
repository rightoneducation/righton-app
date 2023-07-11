import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InputTextFieldStyled from '../../lib/styledcomponents/InputTextFieldStyled';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import { isNameValid } from '../../lib/HelperFunctions';
import { PregameState } from '../../lib/PlayModels';
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
  isSmallDevice: boolean;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  setPregameState: (gameState: PregameState) => void;
}

export default function EnterPlayerName({
  isSmallDevice,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  setPregameState,
}: EnterPlayerNameProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [shouldShowError, setShouldShowError] = useState<boolean>(false);

  const validateInput = () => {
    if (isNameValid(firstName) && isNameValid(lastName))
      setPregameState(PregameState.SELECT_AVATAR);
    else setShouldShowError(true);
  };

  return (
    <BackgroundContainerStyled>
      <StackContainer spacing={isSmallDevice ? 4 : 5}>
        <img
          style={{
            width: `${theme.sizing.pregameMinColumnWidth}px`,
            height: '118px',
            paddingTop: `${theme.sizing.extraLargePadding}px`,
          }}
          src={Logo}
          alt="Question"
        />
        <PaddedContainer>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            {t('joingame.playername.title')}
          </Typography>
          <Grid container spacing={2} wrap="nowrap">
            <Grid item xs={6}>
              <InputTextFieldStyled
                data-testid="playername-firstinputtextfield"
                fullWidth
                variant="filled"
                autoComplete="off"
                placeholder={t('joingame.playername.firstnamedefault') ?? ''}
                onChange={(event) => setFirstName(event.target.value)}
                onFocus={() => setShouldShowError(false)}
                value={firstName}
                InputProps={{
                  disableUnderline: true,
                  inputProps: {
                    style: {
                      color: theme.palette.primary.darkBlue,
                      paddingTop: '9px',
                      textAlign: 'center',
                      fontSize: `${theme.typography.h2.fontSize}px`,
                      fontFamily: 'Poppins'
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextFieldStyled
                data-testid="playername-lastinputtextfield"
                fullWidth
                variant="filled"
                autoComplete="off"
                placeholder={t('joingame.playername.lastnamedefault') ?? ''}
                onChange={(event) => setLastName(event.target.value)}
                onFocus={() => setShouldShowError(false)}
                value={lastName}
                InputProps={{
                  disableUnderline: true,
                  inputProps: {
                    style: {
                      color: theme.palette.primary.darkBlue,
                      paddingTop: '9px',
                      textAlign: 'center',
                      fontSize: `${theme.typography.h2.fontSize}px`,
                      fontFamily: 'Poppins'
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </PaddedContainer>
        <IntroButtonStyled 
          data-testid="playername-button" 
          onClick={validateInput}
        >
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            {t('joingame.playername.button')}
          </Typography>
        </IntroButtonStyled>
        <PaddedContainer>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              marginBottom: `${theme.sizing.smallPadding}px`,
            }}
          >
            {t('joingame.playername.description1')}
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontWeight: 400, textAlign: 'center' }}
          >
            {t('joingame.playername.description2')}
          </Typography>
          {shouldShowError && (
            <Typography
              data-testid="playername-invalidtext"
              variant="h2"
              sx={{ fontWeight: 400, textAlign: 'center' }}
            >
              Invalid Input.
            </Typography>
          )}
        </PaddedContainer>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
