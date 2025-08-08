import React from 'react';
import {
  Box,
  styled,
  Grid,
  useTheme,
} from '@mui/material';
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
import inwardCurveImg from '../images/inwardCurve.svg';
import bottomWaveLg from '../images/bottomWaveLg.svg';
import FeaturedVideo from '../components/homepage/FeaturedVideo';
import rightMainMobile from '../images/RightOn-MobileGraphic.svg';
import { ScreenSize } from '../lib/WebsiteModels';
import CentralAndHost from '../components/homepage/CentralAndHost';
import PlayGames from '../components/homepage/Play';

const imageArr = [
  { image: fourtyImg, alt: 'sponsors-forty' },
  { image: toolsCompetitionImg, alt: 'sponsors-learning-engineering' },
  { image: nsfImg, alt: 'sponsors-nsf' },
  { image: schmidtImg, alt: 'sponsors-schmidt-futures' },
  { image: velaImg, alt: 'sponsors-vela' },
  { image: waltonFamilyImg, alt: 'sponsors-walton-family' },
];

const StyledSponsorDivider = styled(StyledFlexBox)(({ theme }) => ({
  backgroundColor: theme.palette.primary.secondaryDarkBlue,
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}));

interface HomePageProps {
  screenSize: ScreenSize;
}

export function Home({ screenSize }: HomePageProps) {// eslint-disable-line
  const theme = useTheme();
  const containerPadding = theme.sizing.containerPadding[screenSize]; 

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
          sx={{ gap: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : `${theme.sizing.lgPadding}px` }}
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
        <StyledFlexBox
          direction={screenSize === ScreenSize.LARGE ? 'row' : 'column'}
          align="center"
          justify="center"
          gap={screenSize === ScreenSize.SMALL ? theme.sizing.mdPadding : theme.sizing.lgPadding}
          width="100%"
        >
          <GameCTAButtons screenSize={screenSize} />
        </StyledFlexBox>
      </StyledFlexBox>

      {/* Sponsors Divider */}
      <StyledSponsorDivider>
        <StyledFlexBox direction="row" align="center" gap={24}>
          {imageArr.map(({ image, alt }, i) => (
            <Box key={alt} sx={{ width: `${theme.sizing.sponsorImageWidth}px`, zIndex: 5 }}>
              <img src={image} alt={alt} />
            </Box>
          ))}
        </StyledFlexBox>
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
