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
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  StepPanel,
  StepCard,
  heroAspectRatio,
  noScreenSize,
  ScreenSizeProps,
} from '../lib/styledcomponents/LandingStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import heroClassroom from '../images/heroClassroom.jpg';
import landingPagePattern from '../images/landingPagePattern.svg';
import landingPagePatternDetail from '../images/landingPagePatternDetail.svg';
import stepCard1 from '../images/landingPageStepCard1.png';
import stepCard2 from '../images/landingPageStepCard2.png';
import stepCard3 from '../images/landingPageStepCard3.png';

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

type RouterButtonProps = ButtonProps & {
  component?: React.ElementType;
  to?: string;
};

const GetStartedButton = styled(Button, {
  shouldForwardProp: noScreenSize,
})<RouterButtonProps & ScreenSizeProps>(({ theme, screenSize }) => ({
  alignSelf: screenSize === ScreenSize.SMALL ? 'stretch' : 'flex-start',
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

// Wrapper rather than the <img> itself — ImageWithSkeleton supplies the
// element, this just positions it at the foot of the card.
const StepIllustration = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: theme.sizing.space6,
  width: '100%',
}));

const PatternDetail = styled('img')({
  position: 'absolute',
  width: 124,
  zIndex: 0,
  pointerEvents: 'none',
  userSelect: 'none',
});

const STEPS = [
  { key: 'step1', image: stepCard1 },
  { key: 'step2', image: stepCard2 },
  { key: 'step3', image: stepCard3 },
] as const;

export default function Landing({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const isLarge = screenSize === ScreenSize.LARGE;

  // Page-level readiness covers things the whole layout depends on — currently
  // just the copy. Images are not here: each one owns its loading state via
  // ImageWithSkeleton. Add a flag when this page grows an API dependency.
  const isReady = useAllReady(useI18nReady());

  if (!isReady) {
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
            {/* Figma: 640x594 at 1920, 648x600.9 at 744, 353x327.3 at 393. */}
            <ImageWithSkeleton
              src={heroClassroom}
              alt="Two students working through a worksheet at their desk"
              borderRadius="37px"
              sx={{
                width: '100%',
                maxWidth: isLarge ? 640 : '100%',
                aspectRatio: heroAspectRatio(screenSize),
                objectFit: 'cover',
                // The Figma pattern transform crops just below the top.
                objectPosition: 'center 8%',
                borderRadius: '37px',
              }}
            />
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
                    <StepIllustration>
                      <ImageWithSkeleton
                        src={image}
                        alt=""
                        borderRadius="8px"
                        sx={{ maxWidth: '100%', height: 'auto', mx: 'auto' }}
                      />
                    </StepIllustration>
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
