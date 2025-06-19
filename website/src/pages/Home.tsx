import React from 'react';
import { Box, Typography, styled, Grid } from '@mui/material';
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

import RightOnMainImg from '../images/right-on-education.svg';
import fourtyImg from '../images/fourty.svg';
import nsfImg from '../images/nsf.svg';
import schmidtImg from '../images/schmidt.svg';
import toolsCompetitionImg from '../images/tools-competition.svg';
import velaImg from '../images/vela.svg';
import waltonFamilyImg from '../images/walton-family.svg';
import gameScreen from '../images/desktopMobile.svg';
import magicMathHat from '../images/mathSymbolsHat.svg';
import pinkCreature from '../images/pinkCreature.svg';
import waegen from '../images/waegen.svg';
import cubeImg from '../images/Relume.svg'
import arrowRight from '../images/arrow-right.svg';
import purpleCreatureImg from '../images/qotd-creature.svg';
import gameViewMobileImg from '../images/gameViewMobile.svg'
import gameChoicesMobileImg from '../images/gamechoicemobiles.svg';
import FeaturedVideo from '../components/homepage/FeaturedVideo';

const imageArr = [
  { image: fourtyImg, alt: "sponsors-forty" },
  { image: toolsCompetitionImg, alt: "sponsors-learning-engineering" },
  { image: nsfImg, alt: "sponsors-nsf" },
  { image: schmidtImg, alt: "sponsors-schmidt-futures" },
  { image: velaImg, alt: "sponsors-vela" },
  { image: waltonFamilyImg, alt: "sponsors-walton-family" },
];

const waegenList = ["AI-Powered Insights to guide student understanding", "Generative AI builds explanations for any potential wrong answer", "Leveraging growing technologies to support teachers" ];

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


export function Home() { // eslint-disable-line
  return (
    <HomePageContainer>
      <MathSymbolsBackground />
      <StyledFlexBox direction="column" align="center" gap={72} sx={{ padding: '96px 72px',}}>
      {/* Opening Text */}
      <OpeningTextContainer>
      <OpeningText />
      </OpeningTextContainer>

      {/* Game Image */}
      <StyledFlexBox>
        <img src={RightOnMainImg} width="100%" height="100%" alt="right-on-education" />
      </StyledFlexBox>

      {/* Teachers CTA button */}
      <StyledFlexBox direction="row" align="center" gap={48}>
       <GameCTAButtons />
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
       <StyledFlexBox direction="column" align="center" gap={72} sx={{ padding: '96px 72px',}}>
        <QuestionOfTheDay />
       </StyledFlexBox>

{/* Features section */}
<Box sx={{ 
  height: "250px",
   '--mask': ` radial-gradient(389.08px at 50% 522px,#000 99%,#0000 101%) calc(50% - 348px) 0/696px 100%,
    radial-gradient(389.08px at 50% -348px,#0000 99%,#000 101%) 50% 174px/696px 100% repeat-x;`,
    WebkitMask: 'var(--mask)',
    mask: 'var(--mask)',
    backgroundColor: '#001642',
  }}/>
  
<Grid container direction="column" alignItems="center" sx={{ 
  gap: '72px', 
  padding: '96px 72px', 
  backgroundColor: '#001642',
  }}>
  {/* Central & Host */}
  <Grid container direction="row" justifyContent="center"  alignItems="center" spacing={6} width="100%">
    <Grid size={{xs: 12, md: 6}}> 
      <StyledFlexBox gap={24}>
            <StyledFlexBox>
              <StyledText fontWeight={700} fontSize="40px">Central & Host</StyledText>
            </StyledFlexBox>
             <StyledFlexBox>
              <StyledText fontSize="20px" lineHeight={1.2}>
                Teachers can choose from our <EmphasizeText>standard-aligned games</EmphasizeText> or create and edit their own game questions—for in-class practice, test preparation, warm-up, or exit ticket.
              </StyledText>
              <br />
              <br />
              <StyledText fontSize="20px" lineHeight={1.2}>
                <EmphasizeText>Host games instantly</EmphasizeText> to launch and play with students in real time.
              </StyledText>
             </StyledFlexBox>

          </StyledFlexBox>
          </Grid>

    <Grid size={{xs: 12, md: 6}}>
      <StyledFlexBox sx={{ width: '100%' }}>
           <img src={gameScreen} width="594px" height="350px" alt="game-screen" />
          </StyledFlexBox>
    </Grid>
  </Grid>
  {/* Mobile Choices */}
    <Grid container direction="row" alignItems="center">
       <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

      <StyledFlexBox align="flex-end" sx={{ width: '100%', }}>
           <Box width="440px" height="420px">
            <img src={gameViewMobileImg} width="100%" height="100%" alt="mobile-game-play" />
           </Box>
          </StyledFlexBox>
   
    
       </Grid>


    <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <StyledFlexBox gap={24} sx={{ padding: '59px 65px'}}>
            <StyledFlexBox>
              <StyledText fontWeight={700} fontSize="40px">Play</StyledText>
            </StyledFlexBox>
             <StyledFlexBox>
              <StyledText fontSize="20px" lineHeight={1.2}>
               Students go through <EmphasizeText>two phases</EmphasizeText>: first picking the correct answer, then choosing the trickiest incorrect answer.
              </StyledText>
             </StyledFlexBox>

          </StyledFlexBox>
    </Grid>
       
   
  </Grid>
</Grid>

<Grid container direction="column" alignItems="center" sx={{  gap: '72px', padding: '96px 72px', backgroundColor: '#001642' }}>
    {/* Waegen */}
   <Grid container direction="row" alignItems="center">
       <Grid size={{ xs: 12, md: 6}} >
      <StyledFlexBox sx={{ width: '100%' }} align="flex-end">
           <img src={waegen} width="100%" alt="waegen" />
          </StyledFlexBox>
       </Grid>
       <Grid size={{ xs: 12, md: 6 }} >
      <StyledFlexBox gap={48} sx={{ padding: '59px 65px'}} align="flex-start">
            <StyledFlexBox gap={24}>
              <Box>
              <StyledText lineHeight={1.2} fontWeight={700} fontSize="40px">Wrong Answer Explanation Generator</StyledText>
              </Box>
              <StyledText fontSize="20px" lineHeight={1.2}><EmphasizeText>RightOn!</EmphasizeText> transforms classroom dynamics by encouraging open discussions about mistakes. This approach fosters a growth mindset and can be supported by generative AI to explain wrong answers, <EmphasizeText>helping students learn from errors</EmphasizeText>.</StyledText>
            </StyledFlexBox>
           
             <StyledFlexBox>
              <StyledFlexBox direction="column" gap={24}>
             {/* add list here */}
             {waegenList.map((item,i) => (
              <StyledFlexBox key={item} gap={19} direction="row" align="center" >
                <Box><img src={cubeImg} width="29px" height="29px" alt="cube-info" /></Box>
                <Box><Typography sx={{ color: 'white' }} fontSize="19px" lineHeight={1.5} fontFamily="Roboto">{item}</Typography></Box>
              </StyledFlexBox>
             ))}
              </StyledFlexBox>
             </StyledFlexBox>

              {/* Add button here */}
              <StyledFlexBox align="flex-start">
             <StyledFlexBox 
             direction="row" 
             align="center" 
             justify="center" 
             gap={10} 
             sx={{ border: '1px solid white', borderRadius: '23px', padding: '12px 24px', cursor: 'pointer' }}>
              <StyledText>Try our WAE Genertor</StyledText>
              <img src={arrowRight} alt="arrow-right" />
             </StyledFlexBox>
              </StyledFlexBox>

          </StyledFlexBox>
       </Grid>
  </Grid>
</Grid>

{/* Feature Video */}
<StyledFlexBox direction="column" align="center" sx={{ padding: '96px 72px'}} gap={72}>
 <FeaturedVideo />
</StyledFlexBox>

{/* Youtube video */}
<StyledFlexBox direction="row" align="center" sx={{ padding: '96px 72px'}} gap={72}>
  <Box>
  <Box sx={{ width: '648px', height: '363px' }}>
   <iframe width="648" height="363" src="https://www.youtube.com/embed/_dNfmPa6CRo?si=HSKOwRl12TDC3w5M" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </Box>  
    </Box>

  <StyledFlexBox gap={48} align="flex-start">
      <StyledFlexBox gap={24}>
    <StyledText fontSize="24px"><EmphasizeText sx={{ fontSize: '24px'}}>RightOn!</EmphasizeText> Game Show</StyledText>
    <StyledText>
      Students across the country met online to <EmphasizeText>live-stream</EmphasizeText> a game show for youth where the best wrong answers win!
    </StyledText>
  </StyledFlexBox>
    <StyledFlexBox 
             direction="row" 
             align="center" 
             justify="center" 
             gap={10} 
             sx={{ border: '1px solid white', borderRadius: '23px', padding: '12px 24px', cursor: 'pointer' }}>
              <StyledText>View game show questions</StyledText>
              <img src={arrowRight} alt="arrow-right" />
             </StyledFlexBox>
  </StyledFlexBox>

</StyledFlexBox>
       
    </HomePageContainer>
  )
}