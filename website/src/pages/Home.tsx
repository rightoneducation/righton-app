import React from 'react';
import {
  Box,
  Typography,
  styled,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import {
  StyledFlexBox,
  StyledText,
  StyledSubText,
  EmphasizeText,
  StyledHeaderText,
  OpeningTextContainer,
  HomePageContainer,
} from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import OpeningText from '../components/homepage/OpeningText';
import GameCTAButtons from '../components/homepage/GameCTAButtons';
import QuestionOfTheDay from '../components/homepage/QuestionOfTheDay';
import GameShowVideo from '../components/homepage/GameShowVideo';
import WaegenList from '../components/homepage/WaegenList';

import RightOnMainImg from '../images/right-on-education.svg';
import fourtyImg from '../images/fourty.svg';
import nsfImg from '../images/nsf.svg';
import schmidtImg from '../images/schmidt.svg';
import toolsCompetitionImg from '../images/tools-competition.svg';
import velaImg from '../images/vela.svg';
import waltonFamilyImg from '../images/walton-family.svg';
import gameScreen from '../images/desktopMobile.svg';
import waegen from '../images/waegen.svg';
import cubeImg from '../images/Relume.svg';
import arrowRight from '../images/arrow-right.svg';
import inwardCurveImg from '../images/inwardCurve.svg';
import waveLg from '../images/waveLg.svg';
import bottomWaveLg from '../images/bottomWaveLg.svg';
import gameViewMobileImg from '../images/gameViewMobile.svg';
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

const StyledSponsorDivider = styled(StyledFlexBox)({
  backgroundColor: 'rgba(2, 33, 95, 0.50)',
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none',
});

interface HomePageProps {
  screenSize: ScreenSize;
}

export function Home({ screenSize }: HomePageProps) {// eslint-disable-line
  const theme = useTheme();

  const containerPadding =
    screenSize === ScreenSize.LARGE // eslint-disable-line
      ? '96px 72px'
      : screenSize === ScreenSize.MEDIUM
        ? '60px 72px'
        : '60px 12px';

  return (
    <HomePageContainer>
      <MathSymbolsBackground />
      <StyledFlexBox
        direction="column"
        align="center"
        gap={72}
        sx={{ padding: containerPadding }}
      >
        {/* Opening Text */}
        <OpeningTextContainer
          sx={{ gap: screenSize === ScreenSize.SMALL ? '24px' : '48px' }}
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
          gap={screenSize === ScreenSize.SMALL ? 24 : 48}
          width="100%"
        >
          <GameCTAButtons screenSize={screenSize} />
        </StyledFlexBox>
      </StyledFlexBox>

      {/* Sponsors Divider */}
      <StyledSponsorDivider>
        <StyledFlexBox direction="row" align="flex-start" gap={24}>
          {imageArr.map(({ image, alt }, i) => (
            <Box key={alt} sx={{ width: '250px', zIndex: 5 }}>
              <img src={image} alt={alt} />
            </Box>
          ))}
        </StyledFlexBox>
      </StyledSponsorDivider>

      <StyledFlexBox
        direction="column"
        align="center"
        gap={72}
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
        spacing={9}
        container
        direction="column"
        alignItems="center"
        sx={{
          gap: '72px',
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
        gap={72}
      >
        <FeaturedVideo screenSize={screenSize} />
      </StyledFlexBox>

      {/* Youtube video */}
      {/* <StyledFlexBox
        direction={screenSize !== ScreenSize.LARGE ? 'column-reverse' : 'row'}
        align="center"
        sx={{ padding: containerPadding }}
        gap={72}
      >
        <GameShowVideo screenSize={screenSize} />
      </StyledFlexBox> */}
    </HomePageContainer>
  );
}
