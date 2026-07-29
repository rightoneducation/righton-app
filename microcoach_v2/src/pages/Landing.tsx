import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentRow from '../components/ContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import heroClassroom from '../images/heroClassroom.jpg';
import videoPoster from '../images/videoPoster.png';

/*
 * Geometry below is read off three Figma exports: LandingPageMobile.svg (393),
 * LandingPageTablet.svg (744) and LandingPage.svg (1920). Values are quoted as
 * the frame coordinates they reproduce.
 */

interface ScreenSizeProps {
  screenSize: ScreenSize;
}

const noScreenSize = (prop: PropertyKey) => prop !== 'screenSize';

const Page = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.designSystem.background.cream,
  minHeight: '100vh',
}));

// styled() erases MUI's polymorphic `component` prop, so re-declare it here to
// keep rendering these buttons as a router Link.
type RouterButtonProps = ButtonProps & {
  component?: React.ElementType;
  to?: string;
};

// Figma: 189x58 rx 29 fill #1B376F, but full-bleed (353 wide) on mobile.
const GetStartedButton = styled(Button, {
  shouldForwardProp: noScreenSize,
})<RouterButtonProps & ScreenSizeProps>(({ theme, screenSize }) => ({
  alignSelf: screenSize === ScreenSize.SMALL ? 'stretch' : 'flex-start',
  minWidth: screenSize === ScreenSize.SMALL ? 0 : 189,
  height: 58,
  padding: `0 ${theme.sizing.space6}px`,
  borderRadius: 29,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.mediumLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.darkBlue,
  },
}));

// Figma: 640x594 at 1920, 648x600.9 at 744, 353x327.3 at 393 — all rx 37.
const HeroImage = styled('img', {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  width: '100%',
  maxWidth: screenSize === ScreenSize.LARGE ? 640 : '100%',
  aspectRatio:
    screenSize === ScreenSize.LARGE // eslint-disable-line
      ? '640 / 594'
      : screenSize === ScreenSize.MEDIUM
        ? '648 / 600.873'
        : '353 / 327.327',
  objectFit: 'cover',
  // The Figma pattern transform crops just below the top of the source photo.
  objectPosition: 'center 8%',
  borderRadius: theme.sizing.heroImageRadius,
  display: 'block',
}));

// Figma: rx 32, inset 32 at 1920 and 20 on both smaller frames.
const StepPanel = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  borderRadius: theme.sizing.sectionRadius,
  padding:
    screenSize === ScreenSize.LARGE
      ? theme.sizing.space6
      : theme.sizing.space4,
  boxSizing: 'border-box',
}));

// Figma: rx 32, inset 32 at 1920 and 24 on both smaller frames. Only the
// desktop row needs a height floor to keep the three columns even; the mobile
// and tablet cards are content-sized (518/557/536 and 518/540/540).
const StepCard = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minHeight: screenSize === ScreenSize.LARGE ? 518 : undefined,
  backgroundColor: theme.palette.designSystem.background.offWhite,
  borderRadius: theme.sizing.sectionRadius,
  padding:
    screenSize === ScreenSize.LARGE
      ? theme.sizing.space6
      : theme.sizing.space5,
  boxSizing: 'border-box',
}));

// Figma: the poster sits under a 50% #4A6FA5 frosted wash.
// The tablet frame draws this card at gutter 20 / rx 17.3 — the desktop card
// scaled by 0.514 and never re-fitted — so it takes the shared gutter and
// radius here and keeps only the design's aspect ratio.
const VideoFrame = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio:
    screenSize === ScreenSize.LARGE // eslint-disable-line
      ? '1370 / 700'
      : screenSize === ScreenSize.MEDIUM
        ? '704 / 398.554'
        : '353 / 240',
  borderRadius: theme.sizing.sectionRadius,
  overflow: 'hidden',
  // #468CAC is a one-off hairline in the export, not a design-system token.
  border: '1px solid #468CAC',
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  backgroundImage: `url(${videoPoster})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const VideoWash = styled(Box)({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(74, 111, 165, 0.5)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
});

// Figma: 133px circle centred in the video frame; scaled down on mobile so it
// doesn't crowd a 240px-tall card.
const PlayButton = styled(Button, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ screenSize }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: screenSize === ScreenSize.SMALL ? 72 : 133,
  height: screenSize === ScreenSize.SMALL ? 72 : 133,
  minWidth: 0,
  padding: 0,
  borderRadius: '50%',
  color: '#FFFFFF',
  border: '2px solid rgba(255, 255, 255, 0.9)',
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
}));

/**
 * Reserves the illustration area at the foot of each step card. Swap for an
 * <img> once the three step illustration SVGs land in src/images.
 */
const IllustrationSlot = styled(Box)({
  marginTop: 'auto',
  width: '100%',
  height: 231,
});

// Key stubs rather than copy: each maps to a howItWorks.<key>.{label,title,body}
// group in public/locales/{lng}/translation.json.
const STEP_KEYS = ['step1', 'step2', 'step3'] as const;

export default function Landing() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;

  const isLarge = screenSize === ScreenSize.LARGE;

  return (
    <Page>
      <Header screenSize={screenSize} />

      <Box component="main">
        {/* Hero — Figma y 352..946 (1920) */}
        <ContentRow
          screenSize={screenSize}
          sx={{
            display: 'flex',
            flexDirection: isLarge ? 'row' : 'column',
            alignItems: isLarge ? 'center' : 'stretch',
            gap: isLarge ? '80px' : '40px',
            pt: isLarge ? '218px' : '48px',
          }}
        >
          <Stack sx={{ flex: '1 1 0', minWidth: 0, gap: '32px' }}>
            <Typography
              variant="title"
              sx={{ fontWeight: 700, color: 'designSystem.background.navyBlue' }}
            >
              {t('hero.title')}
            </Typography>
            <Typography
              variant="paragraph1"
              sx={{
                // Figma: copy block is 485 wide with a 42px line box.
                maxWidth: isLarge ? 485 : '100%',
                lineHeight: '42px',
                color: 'designSystem.surface.black',
              }}
            >
              {t('hero.body')}
            </Typography>
            <GetStartedButton
              component={RouterLink}
              to="/signup"
              screenSize={screenSize}
              disableElevation
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 20 }} />}
            >
              {t('hero.getstarted')}
            </GetStartedButton>
          </Stack>

          <Box sx={{ flex: isLarge ? '0 0 640px' : '1 1 auto', width: '100%' }}>
            <HeroImage
              screenSize={screenSize}
              src={heroClassroom}
              alt="Two students working through a worksheet at their desk"
            />
          </Box>
        </ContentRow>

        {/* How it works — Figma y 1302..2058 (1920) */}
        <ContentRow
          screenSize={screenSize}
          sx={{ pt: isLarge ? '356px' : '80px' }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              color: 'designSystem.surface.atlanticNavy',
              mb: '24px',
            }}
          >
            {t('howItWorks.title')}
          </Typography>

          <StepPanel screenSize={screenSize}>
            <Stack
              direction={isLarge ? 'row' : 'column'}
              // Row: 28px gutter between cards. Column: the Figma frames put 88
              // between one card's bottom and the next card's top, and that span
              // contains the "Step N" label (32px line + 36 margin) — so 20 here.
              spacing={isLarge ? '28px' : '20px'}
              alignItems="stretch"
            >
              {STEP_KEYS.map((stepKey) => (
                <Box
                  key={stepKey}
                  sx={{
                    flex: '1 1 0',
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'designSystem.surface.white',
                      mb: '36px',
                    }}
                  >
                    {t(`howItWorks.${stepKey}.label`)}
                  </Typography>
                  <StepCard screenSize={screenSize}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        lineHeight: isLarge ? '36px' : '32px',
                        color: 'designSystem.surface.black',
                        mb: '20px',
                      }}
                    >
                      {t(`howItWorks.${stepKey}.title`)}
                    </Typography>
                    <Typography
                      variant="paragraph2"
                      sx={{
                        fontWeight: 400,
                        color: 'designSystem.surface.black',
                      }}
                    >
                      {t(`howItWorks.${stepKey}.body`)}
                    </Typography>
                    {/* TODO: step illustration SVG goes here. */}
                    <IllustrationSlot />
                  </StepCard>
                </Box>
              ))}
            </Stack>
          </StepPanel>
        </ContentRow>

        {/* See it in action — Figma y 2309..3190 (1920) */}
        <ContentRow
          screenSize={screenSize}
          sx={{
            pt: isLarge ? '251px' : '80px',
            pb: isLarge ? '120px' : '64px',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              color: 'designSystem.surface.atlanticNavy',
              mb: '24px',
            }}
          >
            {t('seeItInAction.title')}
          </Typography>
          <Typography
            variant="paragraph1"
            sx={{
              lineHeight: '42px',
              color: 'designSystem.surface.black',
              mb: '44px',
            }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color: 'designSystem.foreground.accentBlue',
              }}
            >
              {t('seeItInAction.lead')}
            </Box>{' '}
            {t('seeItInAction.body')}
          </Typography>

          <VideoFrame screenSize={screenSize}>
            <VideoWash />
            {/* TODO: wire to the walkthrough video once the source is available. */}
            <PlayButton
              screenSize={screenSize}
              aria-label={t('seeItInAction.playlabel')}
            >
              <PlayArrowIcon
                sx={{ fontSize: screenSize === ScreenSize.SMALL ? 36 : 64 }}
              />
            </PlayButton>
          </VideoFrame>
        </ContentRow>
      </Box>

      <Footer screenSize={screenSize} />
    </Page>
  );
}
