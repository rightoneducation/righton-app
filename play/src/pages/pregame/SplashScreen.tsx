import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isNullOrUndefined, PlayButton, ButtonType } from '@righton/networking';
import { PregameState, LocalModel, ScreenSize } from '../../lib/PlayModels';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import RejoinModal from '../../components/RejoinModal';
import MagicHatHero from '../../img/MagicHatHero.svg';
import Logo from '../../img/rightOnLogo.svg';

// --- Layout (fully derived from the asset's geometry) -----------------------
// The hat and the "Join Game" button are centered vertically as one compact
// group; the sparkle/magic portion of the hat asset bleeds up off the top of
// the screen and is clipped (not scrolled).
//
// We don't hardcode the hat size. Instead we solve for the hat size that makes
// the sparkles land exactly at the top of the screen *while the group stays
// centered*, so it tracks the viewport automatically:
//
//   image height = k * hat height            (k = how many hat-heights tall the asset is)
//   group height = hat + gap + button        (the centered stack)
//   reach the top  ⇒  hat = (H - gap - button) / (2k - 1)
//
// where H is the height we center within. We measure H with container-query
// units (cqh) off Root, NOT vh — Root is the fixed full-height container, and
// cqh stays correct on mobile where the URL bar makes vh unreliable.
const ASSET_W = 1090; // MagicHatHero.svg intrinsic width
const ASSET_H = 525; // MagicHatHero.svg intrinsic height
const HAT_IMG_RATIO = 5.45; // asset width / hat width — the hat is ~1/5.45 of the asset
const HAT_GAP = 60; // px between the bottom of the hat and the top of the button
const BUTTON_HEIGHT = 32; // px — matches PlayButton's height
const OVERSHOOT = 1.05; // scale the image ~5% past the top so sparkles fully clear the edge

// k = image height / hat height, derived from the asset ratio (≈ 2.625).
const IMG_TO_HAT_HEIGHT = (HAT_IMG_RATIO * ASSET_H) / ASSET_W;
// Divisor from solving "sparkles reach the top while centered" (≈ 4.25).
const CENTER_DIVISOR = 2 * IMG_TO_HAT_HEIGHT - 1;

// Hat width = (containerHeight - gap - button) / (2k - 1), auto-scaling with cqh.
const HAT_WIDTH = `calc((100cqh - ${HAT_GAP + BUTTON_HEIGHT}px) / ${CENTER_DIVISOR} * ${OVERSHOOT})`;

const Root = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  containerType: 'size', // establishes cqh/cqw for the derived hat sizing below
  overflow: 'hidden', // sparkles bleed off the top — clip rather than scroll
});

// Hat + button, centered vertically over the full screen.
const CenteredHero = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

// Hat slot: sized to the hat itself so the 60px gap is measured from the hat,
// not from the empty sparkle area. The full illustration is anchored to the
// slot's bottom-center and overflows upward.
const HatSlot = styled(Box)({
  position: 'relative',
  width: HAT_WIDTH,
  height: HAT_WIDTH,
  overflow: 'visible',
  flexShrink: 0,
});

const HatImage = styled('img')({
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: `calc(${HAT_WIDTH} * ${HAT_IMG_RATIO})`,
  height: 'auto',
  pointerEvents: 'none',
});

interface StackProps {
  screenSize: ScreenSize;
}

const PADDING_TOP_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '80px',
  [ScreenSize.MEDIUM]: '120px',
  [ScreenSize.LARGE]: '110px',
};

const PADDING_SIDE_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '40px',
  [ScreenSize.MEDIUM]: '80px',
  [ScreenSize.LARGE]: '0px',
};

// Logo + subtitle restored to their original location near the top of the
// screen. Pinned (absolute) so they keep that placement independent of the
// centered hat + button, and layered above the hat/magic image.
const LogoTextStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<StackProps>(({ theme, screenSize }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  margin: '0 auto',
  maxWidth: theme.breakpoints.values.xs,
  alignItems: 'center',
  zIndex: 1, // always above the hat/magic image
  paddingTop: PADDING_TOP_BY_SIZE[screenSize],
  paddingLeft: PADDING_SIDE_BY_SIZE[screenSize],
  paddingRight: PADDING_SIDE_BY_SIZE[screenSize],
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
      <Root>
        <RejoinModal
          handleRejoinSession={handleRejoinSession}
          handleDontRejoinSession={handleDontRejoinSession}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
        <CenteredHero>
          <HatSlot>
            <HatImage src={MagicHatHero} alt="" />
          </HatSlot>
          <Box sx={{ height: `${HAT_GAP}px`, flexShrink: 0 }} />
          <PlayButton
            buttonType={ButtonType.START}
            label={t('joingame.splash.button')}
            isEnabled
            onClick={() => setPregameState(PregameState.ENTER_GAME_CODE)}
          />
        </CenteredHero>
        <LogoTextStack screenSize={screenSize} spacing={2}>
          <img
            style={{
              width: `${theme.sizing.pregameMinColumnWidth}px`,
              height: '118px',
            }}
            src={Logo}
            alt="RightOn"
          />
          <Typography
            variant="semiBoldParagraph"
            sx={{
              textAlign: 'center',
              paddingLeft: `${theme.sizing.mdPadding}px`,
              paddingRight: `${theme.sizing.mdPadding}px`,
            }}
          >
            {t('joingame.splash.title1')}
            <br />
            {t('joingame.splash.title2')}
          </Typography>
        </LogoTextStack>
      </Root>
    </BackgroundContainerStyled>
  );
}
