import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ContentRow from '../components/ContentRow';
import LandingSkeleton from '../components/LandingSkeleton';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  StepPanel,
  StepCard,
  HeroImage,
  noScreenSize,
  ScreenSizeProps,
} from '../lib/styledcomponents/LandingStyledComponents';
import heroClassroom from '../images/heroClassroom.jpg';
import landingPagePattern from '../images/landingPagePattern.svg';
import landingPagePatternDetail from '../images/landingPagePatternDetail.svg';
import stepCard1 from '../images/landingPageStepCard1.png';
import stepCard2 from '../images/landingPageStepCard2.png';
import stepCard3 from '../images/landingPageStepCard3.png';

/*
 * Geometry below is read off three Figma exports: LandingPageMobile.svg (393),
 * LandingPageTablet.svg (744) and LandingPage.svg (1920). Values are quoted as
 * the frame coordinates they reproduce. Anything the loading skeleton also
 * needs lives in lib/styledcomponents/LandingStyledComponents.
 */

// Figma: the petal cluster sits flush to the left edge directly under the
// header, behind the hero copy. The body starts immediately below the header,
// so top 0 here is the header's bottom edge. It measures 313 wide on the 1920
// and 744 frames, 282 on the 393 frame.
const HeaderPattern = styled('img', {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ screenSize }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: screenSize === ScreenSize.SMALL ? 282 : 313,
  zIndex: 0,
  pointerEvents: 'none',
  userSelect: 'none',
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
  // Fixed, not a floor: with `minWidth` the label plus the arrow icon pushed
  // the button out to 201.
  width: screenSize === ScreenSize.SMALL ? '100%' : 189,
  minWidth: 0,
  height: 58,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: 29,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.mediumLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.darkBlue,
  },
}));

// Figma: the illustration sits centred at the foot of the card. The three
// exports have different intrinsic heights (304x300 / 259x221 / 282x277), so
// let them size themselves and push to the bottom rather than share a slot.
const StepIllustration = styled('img')(({ theme }) => ({
  marginTop: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingTop: theme.sizing.space6,
  maxWidth: '100%',
  height: 'auto',
  display: 'block',
}));

// Figma: a 124x106 petal fragment tucked into the bottom corner of the hero
// image and the step panel. Positioned against those elements rather than page
// coordinates so it survives content and breakpoint changes.
const PatternDetail = styled('img')({
  position: 'absolute',
  width: 124,
  zIndex: 0,
  pointerEvents: 'none',
  userSelect: 'none',
});

// Key stubs rather than copy: each maps to a howItWorks.<key>.{label,title,body}
// group in public/locales/{lng}/translation.json.
const STEPS = [
  { key: 'step1', image: stepCard1 },
  { key: 'step2', image: stepCard2 },
  { key: 'step3', image: stepCard3 },
] as const;

export default function Landing({ screenSize }: ScreenSizeProps) {
  const { t, ready } = useTranslation();
  const isLarge = screenSize === ScreenSize.LARGE;

  // The catalogue is fetched over HTTP, so hold the layout with a skeleton
  // rather than painting raw translation keys. Header and footer are owned by
  // AppContainer, so only the body needs holding.
  if (!ready) {
    return <LandingSkeleton screenSize={screenSize} />;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <HeaderPattern
        screenSize={screenSize}
        src={landingPagePattern}
        alt=""
        aria-hidden
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
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
              sx={{ color: 'designSystem.background.navyBlue' }}
            >
              {t('hero.title')}
            </Typography>
            <Typography
              variant="paragraph1"
              sx={{
                // Figma: copy block is 485 wide.
                maxWidth: isLarge ? 485 : '100%',
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

          <Box
            sx={{
              position: 'relative',
              flex: isLarge ? '0 0 640px' : '1 1 auto',
              width: '100%',
            }}
          >
            <HeroImage
              screenSize={screenSize}
              src={heroClassroom}
              alt="Two students working through a worksheet at their desk"
            />
            {/*
              Figma: overlaps the photo's bottom-right corner. LARGE only —
              below that the photo is full-bleed inside the gutter, so a
              negative offset would overflow the viewport horizontally.
            */}
            {isLarge && (
              <PatternDetail
                src={landingPagePatternDetail}
                alt=""
                aria-hidden
                sx={{ bottom: -70, right: -60 }}
              />
            )}
          </Box>
        </ContentRow>

        {/* How it works — Figma y 1302..2058 (1920) */}
        {/* Last section on the page, so it carries the run-out to the footer. */}
        <ContentRow
          narrow
          screenSize={screenSize}
          sx={{
            pt: isLarge ? '356px' : '80px',
            pb: isLarge ? '120px' : '64px',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'designSystem.surface.atlanticNavy',
              mb: '24px',
            }}
          >
            {t('howItWorks.title')}
          </Typography>

          <StepPanel screenSize={screenSize} sx={{ position: 'relative' }}>
            {/* Figma: overlaps the panel's bottom-left corner. LARGE only —
                the 20px gutter below that leaves no room for the overhang. */}
            {isLarge && (
              <PatternDetail
                src={landingPagePatternDetail}
                alt=""
                aria-hidden
                sx={{ bottom: -80, left: -61, transform: 'scaleX(-1)' }}
              />
            )}
            <Stack
              direction={isLarge ? 'row' : 'column'}
              // Row: 28px gutter between cards. Column: the Figma frames put 88
              // between one card's bottom and the next card's top, and that span
              // contains the "Step N" label (32px line + 36 margin) — so 20 here.
              spacing={isLarge ? '28px' : '20px'}
              alignItems="stretch"
            >
              {STEPS.map(({ key: stepKey, image }) => (
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
                      color: 'designSystem.surface.white',
                      mb: '36px',
                    }}
                  >
                    {t(`howItWorks.${stepKey}.label`)}
                  </Typography>
                  <StepCard screenSize={screenSize}>
                    {/* Figma card titles are 32px in a 36px line box (h2). */}
                    <Typography
                      variant="h2"
                      sx={{
                        color: 'designSystem.surface.black',
                        mb: '20px',
                      }}
                    >
                      {t(`howItWorks.${stepKey}.title`)}
                    </Typography>
                    <Typography
                      variant="paragraph2"
                      sx={{
                        color: 'designSystem.surface.black',
                      }}
                    >
                      {t(`howItWorks.${stepKey}.body`)}
                    </Typography>
                    <StepIllustration src={image} alt="" aria-hidden />
                  </StepCard>
                </Box>
              ))}
            </Stack>
          </StepPanel>
        </ContentRow>
      </Box>
    </Box>
  );
}
