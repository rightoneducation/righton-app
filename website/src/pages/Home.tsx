import React, { useRef, useState, useEffect} from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Box, styled, Grid, useTheme } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import {
  StyledFlexBox,
  OpeningTextContainer,
  HomePageContainer,
} from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import OpeningText from '../components/homepage/OpeningText';
import GameCTAButtons from '../components/homepage/GameCTAButtons';
import WaegenList from '../components/homepage/WaegenList';

import RightOnMainImg from '../images/right-on-education.svg';
import fourtyImg from '../images/fourty.svg';
import nsfImg from '../images/nsf.svg';
import schmidtImg from '../images/schmidt.svg';
import toolsCompetitionImg from '../images/tools-competition.svg';
import velaImg from '../images/vela.svg';
import waltonFamilyImg from '../images/walton-family.svg';
import waegen from '../images/waegen.svg';
import gates from '../images/gates.svg';
import inwardCurveImg from '../images/inwardCurve.svg';
import bottomWaveLg from '../images/bottomWaveLg.svg';
import FeaturedVideo from '../components/homepage/FeaturedVideo';
import rightMainMobile from '../images/RightOn-MobileGraphic.png';
import { ScreenSize } from '../lib/WebsiteModels';
import CentralAndHost from '../components/homepage/CentralAndHost';
import PlayGames from '../components/homepage/Play';

const imageArr = [
  { image: fourtyImg, alt: 'sponsors-forty' },
  { image: gates, alt: 'sponsors-gates' },
  { image: toolsCompetitionImg, alt: 'sponsors-learning-engineering' },
  { image: nsfImg, alt: 'sponsors-nsf' },
  { image: schmidtImg, alt: 'sponsors-schmidt-futures' },
  { image: velaImg, alt: 'sponsors-vela' },
  { image: waltonFamilyImg, alt: 'sponsors-walton-family' },
];

const StyledSponsorDivider = styled(StyledFlexBox)(({ theme }) => ({
  backgroundColor: theme.palette.primary.secondaryDarkBlue,
  overflow: 'hidden',
  paddingTop: `${theme.sizing.smPadding}px`,
  paddingBottom: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, ${theme.palette.primary.secondaryDarkBlue} 0%, transparent 10%, transparent 90%, ${theme.palette.primary.secondaryDarkBlue} 100%)`,
    zIndex: 10,
    pointerEvents: 'none'
  }
}));

interface HomePageProps {
  screenSize: ScreenSize;
}

export function Home({ screenSize }: HomePageProps) { // eslint-disable-line
  const theme = useTheme();
  const containerPadding = theme.sizing.containerPadding[screenSize];

  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [duration, setDuration] = useState(20);
  const contentWidth = 2220; // width of the content in the track + gap between sets x1
  const controls = useAnimation(); 

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        const firstSet = trackRef.current.children[0];
        if (firstSet instanceof HTMLElement && firstSet.offsetWidth > 0) {
          setTrackWidth(firstSet.offsetWidth);
          const newDuration = 40 / (contentWidth / firstSet.offsetWidth);
          setDuration(newDuration);
          // Start animation after width is calculated
          controls.start({
            x: [-contentWidth, 0],
            transition: {
              repeat: Infinity,
              ease: "linear",
              duration: newDuration,
            },
          });
        } else {
          requestAnimationFrame(updateWidth); 
        }
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <HomePageContainer>
      <MathSymbolsBackground />
      <StyledFlexBox
        direction="column"
        align="center"
        gap={theme.sizing.xLgPadding}
        sx={{ padding: containerPadding }}
      >
        {/* Opening Text */}
        <OpeningTextContainer
          sx={{
            gap:
              screenSize === ScreenSize.SMALL
                ? `${theme.sizing.mdPadding}px`
                : `${theme.sizing.lgPadding}px`,
          }}
        >
          <OpeningText />
        </OpeningTextContainer>

        {/* Game Image */}
        <StyledFlexBox>
          <img
            src={
              screenSize === ScreenSize.SMALL ? rightMainMobile : RightOnMainImg
            }
            width="100%"
            height="100%"
            alt="right-on-education"
          />
        </StyledFlexBox>

        {/* Teachers CTA button */}
        <GameCTAButtons screenSize={screenSize} />
      </StyledFlexBox>

      {/* Sponsors Divider */}
      <StyledSponsorDivider>
        <div 
          style={{ 
            width: '100%', 
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            ref={trackRef}
            style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform', gap: '120px' }}
            animate={controls}
            onMouseEnter={() => controls.stop()}
            onMouseLeave={() =>
              controls.start({
                x: [-contentWidth, 0],
                transition: {
                  repeat: Infinity,
                  ease: "linear",
                  duration,
                },
              })
            }
          >
            {Array.from({ length: 3 }, (_, setIndex) =>
             <div key={`set-${setIndex}`} style={{ display: 'flex', gap: '120px' }}>
              {imageArr.map(({ image, alt }, imageIndex) => (
                <img 
                  key={`set-${setIndex}-${alt}`}
                  src={image} 
                  alt={alt} 
                  style={{ width: 'auto', height: '103px',  objectFit: 'contain', zIndex: 5 }}
                />
              ))}
              </div>
            )}
          </motion.div>
        </div>
      </StyledSponsorDivider>

      <StyledFlexBox
        direction="column"
        align="center"
        gap={theme.sizing.xLgPadding}
        sx={{ padding: containerPadding }}
      >
        {/* Central & Host */}
        <CentralAndHost screenSize={screenSize} />
        {/* Mobile Choices */}
        <PlayGames screenSize={screenSize} />
      </StyledFlexBox>

      {/* Features section */}
      <Box
        sx={{
          width: '100%',
          marginBottom: '-1px',
        }}
      >
        <Box
          component="img"
          src={inwardCurveImg}
          alt="inward-curve"
          sx={{ display: 'block', width: '100%' }}
        />
      </Box>

      <Grid
        spacing={theme.sizing.xSmPadding}
        container
        direction="column"
        alignItems="center"
        sx={{
          gap: `${theme.sizing.xLgPadding}px`,
          padding: containerPadding,
          backgroundColor: '#011849',
        }}
      >
        {/* Waegen Img */}
        <Grid container direction="row" alignItems="center">
          <Grid
            order={screenSize !== ScreenSize.LARGE ? 2 : 1}
            size={{ md: 12, lg: 6 }}
          >
            <StyledFlexBox sx={{ width: '100%' }} align="flex-end">
              <Box component="img" src={waegen} width="100%" alt="waegen" />
            </StyledFlexBox>
          </Grid>

          {/* Waegen text description */}
          <Grid
            order={screenSize !== ScreenSize.LARGE ? 1 : 2}
            size={{ md: 12, lg: 6 }}
          >
            <WaegenList screenSize={screenSize} />
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ width: '100%' }}>
        <Box
          component="img"
          src={bottomWaveLg}
          alt="wavy-bottom-lg-screen"
          sx={{ marginTop: '-1px', display: 'block', width: '100%' }}
        />
      </Box>

      {/* Feature Video */}
      <StyledFlexBox
        direction="column"
        align="center"
        sx={{ padding: containerPadding }}
        gap={theme.sizing.xLgPadding}
      >
        <FeaturedVideo screenSize={screenSize} />
      </StyledFlexBox>
    </HomePageContainer>
  );
}
