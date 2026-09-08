import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
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
import { UserProps } from '../hooks/useUserState';
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
  // Figma width; height falls out of the label's line box plus its padding so
  // it tracks the type scale rather than being asserted.
  width: screenSize === ScreenSize.SMALL ? '100%' : 189,
  minWidth: 0,
  padding: `${theme.sizing.space2}px ${theme.sizing.space4}px`,
  // Half the derived height (54), so the ends are true semicircles.
  borderRadius: 27,
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

export default function Landing({ screenSize, user }: ScreenSizeProps & UserProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { signOut } = user;
  const isLarge = screenSize === ScreenSize.LARGE;

  /*
   * Starting over, not resuming. The wizard's last step commits a profile and
   * flips userStatus to LOGGEDIN, and AuthGuard quite correctly keeps a
   * signed-in user off /signup — so without signing out, a second run of the
   * flow bounces straight back here and the button looks dead. The wizard's own
   * state needs no reset: it is local to SignUpWizard, which unmounts on exit.
   */
  const handleGetStarted = () => {
    signOut();
    navigate('/signup');
  };

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
            alignItems: isLarge ? 'flex-start' : 'stretch',
            gap: isLarge
              ? `${theme.sizing.space12}px`
              : `${theme.sizing.space7}px`,
            // Figma y-offset for the hero; no near token on the scale.
            pt: isLarge ? '218px' : `${theme.sizing.space8}px`,
          }}
        >
          <Stack
            sx={{
              flex: '1 1 0',
              minWidth: 0,
              gap: `${theme.sizing.space6}px`,
            }}
          >
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
              onClick={handleGetStarted}
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
            {/* Figma: 640x594 at 1920, 648x601 at 744, 353x327 at 393. */}
            <ImageWithSkeleton
              src={heroClassroom}
              alt="Two students working through a worksheet at their desk"
              borderRadius={`${theme.sizing.heroImageRadius}px`}
              sx={{
                width: '100%',
                maxWidth: isLarge ? 640 : '100%',
                aspectRatio: heroAspectRatio(screenSize),
                objectFit: 'cover',
                // The Figma pattern transform crops just below the top.
                objectPosition: 'center 8%',
                borderRadius: `${theme.sizing.heroImageRadius}px`,
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
            // Figma y-offset for the section; no near token on the scale.
            pt: isLarge ? '330px' : `${theme.sizing.space12}px`,
            pb: isLarge
              ? `${theme.sizing.space14}px`
              : `${theme.sizing.space11}px`,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'designSystem.surface.atlanticNavy',
              mb: `${theme.sizing.space5}px`,
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
              // Row: gutter between the three cards. Column: the gap between one
              // card's bottom and the next "Step N" label.
              spacing={
                isLarge
                  ? `${theme.sizing.space5}px`
                  : `${theme.sizing.space4}px`
              }
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
                      mb: `${theme.sizing.space7}px`,
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
                        mb: `${theme.sizing.space4}px`,
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
                        borderRadius={`${theme.sizing.space1}px`}
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
