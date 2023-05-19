import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { JoinGameState } from '../../lib/PlayModels';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import RejoinModal from '../RejoinModal';
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
  paddingBottom: `${theme.sizing.mediumPadding}px`,
}));

interface SplashScreenProps {
  setJoinGameState: (gameState: JoinGameState) => void;
}

export default function SplashScreen({ setJoinGameState }: SplashScreenProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleModalButtonOnClick = () => {
    console.log("Click");
  };

  const [isModalVisible, setIsModalVisible] = React.useState(true);

  return (
    <BackgroundContainerStyled>
      <HeroContainer>
        <Box sx={{ position: 'absolute', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <RejoinModal 
            handleModalButtonOnClick={handleModalButtonOnClick}
            isModalVisible={isModalVisible} 
            setIsModalVisible={setIsModalVisible}
          />
        </Box>
        <StackContainer spacing={5}>
          <Stack sx={{ alignItems: 'center' }} spacing={2}>
            <img
              style={{
                width: '214px',
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
              onClick={() => setJoinGameState(JoinGameState.ENTER_GAME_CODE)}
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
