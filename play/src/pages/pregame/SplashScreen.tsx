import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isNullOrUndefined, PlayButton, ButtonType } from '@righton/networking';
import { PregameState, LocalModel, ScreenSize } from '../../lib/PlayModels';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
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

interface BottomBoxProps {
  screenSize: ScreenSize;
}

const PADDING_BOTTOM_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '160px',
  [ScreenSize.MEDIUM]: '120px',
  [ScreenSize.LARGE]: '110px',
};

const BottomBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<BottomBoxProps>(({ theme, screenSize }) => ({
  paddingBottom: PADDING_BOTTOM_BY_SIZE[screenSize],
}));


interface StackProps {
  screenSize: ScreenSize;
}

const PADDING_TOP_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '80px',
  [ScreenSize.MEDIUM]: '120px',
  [ScreenSize.LARGE]: '110px',
};

const PADDING_SIDE_BY_SIZE:  Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '40px',
  [ScreenSize.MEDIUM]: '80px',
  [ScreenSize.LARGE]: '0px',
};

const LogoTextStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<StackProps>(({ theme, screenSize }) => ({
    paddingTop: PADDING_TOP_BY_SIZE[screenSize],
    paddingLeft: PADDING_SIDE_BY_SIZE[screenSize],
    paddingRight: PADDING_SIDE_BY_SIZE[screenSize],
    alignItems: 'center'
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
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  let screenSize = ScreenSize.SMALL;
  if (isLargeScreen) screenSize = ScreenSize.LARGE;
  else if (isMediumScreen) screenSize = ScreenSize.MEDIUM;

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
          <LogoTextStack screenSize={screenSize} spacing={2}>
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
              variant="semiBoldParagraph"
              sx={{
                textAlign: `center`,
                paddingLeft: `${theme.sizing.mediumPadding}px`,
                paddingRight: `${theme.sizing.mediumPadding}px`,
              }}
            >
              {t('joingame.splash.title1')}
              <br />
              {t('joingame.splash.title2')}
            </Typography>
          </LogoTextStack>
          <BottomBox screenSize={screenSize}>
            <PlayButton
              buttonType={ButtonType.START}
              label={t('joingame.splash.button')}
              isEnabled
              onClick={() => setPregameState(PregameState.ENTER_GAME_CODE)}
            />
          </BottomBox>
        </StackContainer>
      </HeroContainer>
    </BackgroundContainerStyled>
  );
}
