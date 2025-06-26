import React from 'react';
import { Box, Typography, styled, Grid, useMediaQuery, useTheme } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import {
  StyledFlexBox,
  StyledText,
  StyledSubText,
  EmphasizeText,
  StyledHeaderText,
  OpeningTextContainer,
  HomePageContainer
} from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents'
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
import cubeImg from '../images/Relume.svg'
import arrowRight from '../images/arrow-right.svg';
import waveLg from '../images/waveLg.svg';
import bottomWaveLg from '../images/bottomWaveLg.svg';
import gameViewMobileImg from '../images/gameViewMobile.svg'
import FeaturedVideo from '../components/homepage/FeaturedVideo';
import rightMainMobile from '../images/RightOn-MobileGraphic.svg';
import { ScreenSize } from '../lib/WebsiteModels';

const imageArr = [
  { image: fourtyImg, alt: "sponsors-forty" },
  { image: toolsCompetitionImg, alt: "sponsors-learning-engineering" },
  { image: nsfImg, alt: "sponsors-nsf" },
  { image: schmidtImg, alt: "sponsors-schmidt-futures" },
  { image: velaImg, alt: "sponsors-vela" },
  { image: waltonFamilyImg, alt: "sponsors-walton-family" },
];



const StyledSponsorDivider = styled(StyledFlexBox)({
  backgroundColor: "rgba(2, 33, 95, 0.50)",        
        overflowX: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', 
})


interface HomePageProps {
  screenSize: ScreenSize;
}

export function Home({screenSize}: HomePageProps) { // eslint-disable-line
  const theme = useTheme()


      const containerPadding = screenSize === ScreenSize.LARGE ? // eslint-disable-line
      "96px 72px": screenSize === ScreenSize.MEDIUM ? "60px 72px": "60px 12px";
    

  return (
    <HomePageContainer>
      <MathSymbolsBackground />
      <StyledFlexBox direction="column" align="center" gap={72} sx={{ padding: containerPadding }}>
      {/* Opening Text */}
      <OpeningTextContainer sx={{gap: screenSize === ScreenSize.SMALL ? '24px': '48px'}}>
      <OpeningText />
      </OpeningTextContainer>

      {/* Game Image */}
      <StyledFlexBox>
        <img src={screenSize === ScreenSize.SMALL ? rightMainMobile : RightOnMainImg} width="100%" height="100%" alt="right-on-education" />
      </StyledFlexBox>

      {/* Teachers CTA button */}
      <StyledFlexBox direction={screenSize === ScreenSize.LARGE ? "row":"column" } align="center" gap={screenSize === ScreenSize.SMALL ? 24 : 48}>
       <GameCTAButtons screenSize={screenSize}/>
      </StyledFlexBox>
      </StyledFlexBox>

      {/* Sponsors Divider */}
      <StyledSponsorDivider>
       <StyledFlexBox direction="row" align="flex-start" gap={24}>
        {imageArr.map(({ image, alt },i) => (
          <Box key={alt} sx={{ width: '250px', zIndex: 5}}>
            <img src={image} alt={alt}  />
          </Box>
        ))}
       </StyledFlexBox>
      </StyledSponsorDivider>

      {/* Question of the Day */}
       <StyledFlexBox 
       direction="column" 
       align="center" 
       gap={72} 
       sx={{ padding: containerPadding }}>
        <StyledFlexBox 
              borderRadius={12} 
              width="100%"
              gap={48}
              sx={{ backgroundColor: '#224996' }}>
              <QuestionOfTheDay screenSize={screenSize} />  
              </StyledFlexBox>
       </StyledFlexBox>

{/* Features section */}
<Box sx={{ 
    width: '100%',
    marginBottom: "-1px"
  }}>
    <Box component="img" src={waveLg} alt="wavy-lg-screen" sx={{ display: 'block', width: '100%' }} />
  </Box>
  
<Grid container direction="column" alignItems="center" sx={{ 
  gap: '72px', 
  padding: containerPadding, 
  backgroundColor: '#011849',
  }}>
  {/* Central & Host */}
  <Grid 
  container 
  direction={screenSize === ScreenSize.LARGE ? "row":"column"} 
  justifyContent="center" 
  alignItems="center" 
  spacing={6} 
  width="100%">
    <Grid size={{md: 12, lg: 6}}> 
      <StyledFlexBox 
      gap={24}
       sx={{ width: '100%' }}
      >
            <StyledFlexBox>
              <StyledText fontWeight={700} fontSize="40px">Central & Host</StyledText>
            </StyledFlexBox>

             <StyledFlexBox  sx={{ width: '100%'}}>
              <StyledText
              fontSize={screenSize !== ScreenSize.LARGE ? "16px" : "20px"} 
              lineHeight={1.2}>
                Teachers can choose from our <EmphasizeText sx={{  fontSize: screenSize !== ScreenSize.LARGE ? "16px" : "20px" }}>standard-aligned games</EmphasizeText> or create and edit their own game questions—for in-class practice, test preparation, warm-up, or exit ticket.
              </StyledText>
              <br />
              <br />
              <StyledText 
              fontSize={screenSize !== ScreenSize.LARGE ? "16px" : "20px"}
              lineHeight={1.2}>
                <EmphasizeText sx={{  fontSize: screenSize !== ScreenSize.LARGE ? "16px" : "20px" }}>Host games instantly</EmphasizeText> to launch and play with students in real time.
              </StyledText>
             </StyledFlexBox>

          </StyledFlexBox>
          </Grid>

    <Grid 
    size={{md: 12, lg: 6}}>
      <StyledFlexBox align={screenSize === ScreenSize.MEDIUM ? "center": "normal"} sx={{ width: '100%' }}>
        <Box 
        component="img"
        width={screenSize === ScreenSize.SMALL ? "353px": '595px' }
        src={gameScreen} alt="righton-gamescreen" />
          
          </StyledFlexBox>
    </Grid>
  </Grid>
  {/* Mobile Choices */}
    <Grid spacing={6} container direction="row" alignItems="center">
       <Grid 
       order={screenSize !== ScreenSize.LARGE ? 2: 1} 
       size={{ md: 12, lg: 5 }} 
       sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

      <StyledFlexBox align={screenSize !== ScreenSize.LARGE ? "center":"flex-end"} sx={{ width: '100%', }}>
           <Box width={screenSize === ScreenSize.SMALL ? "353px":"440px"} height={screenSize === ScreenSize.SMALL ?"337px":"420px"}>
            <Box 
            width="100%"
            component="img" 
            src={gameViewMobileImg} alt="mobile-game-play" />
           
           </Box>
          </StyledFlexBox>
   
    
       </Grid>


    <Grid 
    order={screenSize !== ScreenSize.LARGE ? 1 : 2} 
    size={{ md: 12, lg: 7 }} 
    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <StyledFlexBox gap={24} sx={{ }}>
            <StyledFlexBox>
              <StyledText fontWeight={700} fontSize="40px">Play</StyledText>
            </StyledFlexBox>
             <StyledFlexBox>
              <StyledText 
              fontSize={screenSize !== ScreenSize.LARGE ? "16px" : "20px"} 
              lineHeight={screenSize !== ScreenSize.LARGE ? "auto" : 1.2}>
               Students go through <EmphasizeText sx={{ fontSize: screenSize !== ScreenSize.LARGE ? "16px" : "20px" }}>two phases</EmphasizeText>: first picking the correct answer, then choosing the trickiest incorrect answer.
              </StyledText>
             </StyledFlexBox>

          </StyledFlexBox>
    </Grid>
       
   
  </Grid>
</Grid>

<Grid spacing={9} container direction="column" alignItems="center" sx={{  gap: '72px', padding: containerPadding, backgroundColor: '#011849' }}>
    {/* Waegen Img */}
   <Grid container direction="row" alignItems="center">
       <Grid 
       order={screenSize !== ScreenSize.LARGE ? 2 : 1} 
       size={{ md: 12, lg: 6}}>
      <StyledFlexBox sx={{ width: '100%' }} align="flex-end">
           <Box component="img" src={waegen} width="100%" alt="waegen" />
          </StyledFlexBox>
       </Grid>

       {/* Waegen text description */}
       <Grid 
       order={screenSize !== ScreenSize.LARGE ? 1 : 2} 
       size={{ md: 12, lg: 6 }} >
        <WaegenList screenSize={screenSize}/>
       </Grid>
  </Grid>
</Grid>
<Box sx={{ width: '100%' }}>
    <Box 
    component="img" 
    src={bottomWaveLg} 
    alt="wavy-bottom-lg-screen" 
    sx={{ marginTop: "-1px", display: 'block', width: '100%' }} />
</Box>

{/* Feature Video */}
<StyledFlexBox direction="column" align="center" sx={{ padding: containerPadding }} gap={72}>
 <FeaturedVideo screenSize={screenSize}/>
</StyledFlexBox>

{/* Youtube video */}
<StyledFlexBox 
direction={screenSize !== ScreenSize.LARGE ? "column-reverse":"row"} 
align="center" 
sx={{ padding: containerPadding }} 
gap={72}>
  <GameShowVideo screenSize={screenSize}/>
</StyledFlexBox>
       
    </HomePageContainer>
  )
}