import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isNullOrUndefined } from '@righton/networking';
import { PregameState, LocalModel } from '../../lib/PlayModels';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import RejoinModal from '../../components/RejoinModal';
import MagicHatHero from '../../img/MagicHatHero.svg';
import Logo from '../../img/rightOnLogo.svg';

const HeroContainer = styled(Box)({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${MagicHatHero})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const StackContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  maxWidth: theme.breakpoints.values.xs,
}));

const BottomBox = styled(Box)(({ theme }) => ({
  paddingBottom: `${theme.sizing.extraExtraLargePadding}px`,
}));

interface SplashScreenProps {
  rejoinGameObject: LocalModel | null;
  setPregameState: (gameState: PregameState) => void;
  handleRejoinSession: () => void;
  handleDontRejoinSession: () => void;
}

export default function SplashScreen({
  rejoinGameObject,
  setPregameState,
  handleRejoinSession,
  handleDontRejoinSession,
}: SplashScreenProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = React.useState(
    !isNullOrUndefined(rejoinGameObject)
  );

  return (
    <BackgroundContainerStyled>
      <HeroContainer>
        <RejoinModal
          handleRejoinSession={handleRejoinSession}
          handleDontRejoinSession={handleDontRejoinSession}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
        <StackContainer spacing={5}>
          <Stack sx={{ alignItems: 'center' }} spacing={2}>
            <img
              style={{
                width: `${theme.sizing.pregameMinColumnWidth}px`,
                height: '118px',
                paddingTop: `${theme.sizing.extraLargePadding}px`,
              }}
              src={Logo}
              alt="Question"
            />
            <Typography
              variant="h2"
              sx={{
                weight: 700,
                textAlign: `center`,
                paddingLeft: `${theme.sizing.mediumPadding}px`,
                paddingRight: `${theme.sizing.mediumPadding}px`,
              }}
            >
              {t('joingame.splash.title')}
            </Typography>
          </Stack>
          <BottomBox>
            <IntroButtonStyled
              onClick={() => setPregameState(PregameState.ENTER_GAME_CODE)}
              style={{
                background: `${theme.palette.primary.highlightGradient}`,
                boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
              }}
            >
              <Typography variant="h2" sx={{ textAlign: 'center' }}>
                {t('joingame.splash.button')}
              </Typography>
            </IntroButtonStyled>
          </BottomBox>
        </StackContainer>
      </HeroContainer>
    </BackgroundContainerStyled>
  );
}
