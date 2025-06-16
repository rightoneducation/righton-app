import React from 'react';
import { Box, Typography, styled, Grid, Button } from '@mui/material';
import RightOnMainImg from '../images/right-on-education.svg';
import mathSymbolsBackground from '../images/mathSymbolsBackgroundPink.svg';
import pinkMonster from '../images/pinkmonster.svg';
import fourtyImg from '../images/fourty.svg';
import nsfImg from '../images/nsf.svg';
import schmidtImg from '../images/schmidt.svg';
import toolsCompetitionImg from '../images/tools-competition.svg';
import velaImg from '../images/vela.svg';
import waltonFamilyImg from '../images/walton-family.svg';
import gameScreen from '../images/desktopMobile.svg';
import magicMathHat from '../images/mathSymbolsHat.svg';
import pinkCreature from '../images/pinkCreature.svg';
import WavyDivider from '../components/WavyDivider';
import gameChoicesMobile from '../images/gamechoicemobiles.svg';
import waegen from '../images/waegen.svg';
import cubeImg from '../images/Relume.svg'
import arrowRight from '../images/arrow-right.svg';

const imageArr = [
  { image: fourtyImg, alt: "sponsors-forty" },
  { image: toolsCompetitionImg, alt: "sponsors-learning-engineering" },
  { image: nsfImg, alt: "sponsors-nsf" },
  { image: schmidtImg, alt: "sponsors-schmidt-futures" },
  { image: velaImg, alt: "sponsors-vela" },
  { image: waltonFamilyImg, alt: "sponsors-walton-family" },
];

const waegenList = ["AI-Powered Insights to guide student understanding", "Generative AI builds explanations for any potential wrong answer", "Leveraging growing technologies to support teachers" ]

const StyledHeaderText = styled(Typography)(({theme}) => ({
fontSize: '60px',
fontFamily: 'Poppins',
color: 'white',
fontWeight: 500,
lineHeight: "120%",
letterSpacing: '-4%'
}));

const StyledSubText = styled(Typography)(({theme}) => ({
fontSize: '20px',
fontFamily: 'Poppins',
color: 'white',
fontWeight: 400,
lineHeight: "auto",
}));

const HomePageContainer = styled(Box)(({theme}) => ({
  width: '100%',
  boxSizing: 'border-box',
  background: 'transparent',
}));

const OpeningTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '48px',
}));

interface StyledBoxProps {
  direction?: 'row' | 'column';
  gap?: number;
  borderRadius?: number;
  align?: 
    | 'normal'
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'self-start'
    | 'self-end'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'safe center'
    | 'unsafe center';
  justify?: 
    | 'normal'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'left'
    | 'right'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'safe center'
    | 'unsafe center';
}

const StyledFlexBox = styled(Box, { 
  shouldForwardProp: (prop) => prop !== 'direction' 
  && prop !== 'gap' 
  && prop !== 'borderRadius' 
  && prop !== "justify"
  && prop !== "align"
})<StyledBoxProps>(({theme, direction, gap, borderRadius, justify, align }) => ({
display: 'flex',
flexDirection: direction ?? 'column',
gap: gap ? `${gap}px`: 0,
borderRadius: borderRadius ? `${borderRadius}px` : 0,
alignItems: align ?? 'normal',
justifyContent: justify ?? 'normal',
boxSizing: 'border-box',
zIndex: 5,
}));

export const CreateGameBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width:'100%',
  height: '100vh',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 1,
  zIndex: -1,
  backgroundColor: theme.palette.primary.extraDarkBlue,
  backgroundImage: `
  linear-gradient(rgba(2, 33, 95, 0.75), rgba(2, 33, 95, 1)),
  url(${mathSymbolsBackground})
  `,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
}));

const StyledText = styled(Typography)(({theme})=> ({
  fontFamily: 'Poppins',
  color: '#fff',
}))

const EmphasizeText = styled('span')(({theme}) => ({
  color: '#FF3A6A',
  fontSize: '20px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
}));


export function Home() { // eslint-disable-line
  return (
    <HomePageContainer>

      <CreateGameBackground />
      
      <StyledFlexBox direction="column" align="center" gap={72} sx={{ padding: '96px 72px',}}>

      {/* Opening Text */}
      <OpeningTextContainer>
        <StyledFlexBox>
          <StyledHeaderText>Everyone can be a math person!</StyledHeaderText>
        </StyledFlexBox>
        <StyledFlexBox sx={{ width: '820px' }}>
          <StyledSubText sx={{ textAlign: 'center' }}>RightOn! makes math fun, social, and low-pressure—where mistakes spark learning and every student feels confident to participate.</StyledSubText>
        </StyledFlexBox>
      </OpeningTextContainer>
      {/* Game Image */}
      <StyledFlexBox >
        <img src={RightOnMainImg} width="100%" height="100%" alt="right-on-education" />
      </StyledFlexBox>
      <StyledFlexBox direction="row" align="center" gap={48}>
        {/* Teachers CTA button */}
        <StyledFlexBox 
        direction="row" 
        align="center" 
        borderRadius={24} 
        gap={12} 
        width="356px" 
        sx={{ maxWidth: '356px', border: '1px solid white', padding: '12px 24px', cursor: 'pointer' }}>
          <StyledFlexBox>
            <img src={pinkCreature} alt="pink-righton-creature" width="60px" height="60px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={10}>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600 }}>
              Teachers
            </Typography>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500 }}>
              Create, edit, and host games
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
         {/* Students CTA button */}
         <StyledFlexBox 
         direction="row" 
         align="center" 
         borderRadius={24} 
         gap={12} 
         width="356px" 
         sx={{ maxWidth: '356px', border: '1px solid white', padding: '12px 24px', cursor: 'pointer'  }}>
          <StyledFlexBox>
           <img src={magicMathHat} alt="math-symbols-hat" width="60px" height="60px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={10}>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600 }}>
              Students
            </Typography>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500 }}>
              Join and play a game
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
      </StyledFlexBox>
      </StyledFlexBox>

      {/* Sponsors Divider */}
      <StyledFlexBox 
      direction="row"
      align="center"
      height="126px" 
      sx={{ 
        backgroundColor: (theme) => theme.palette.primary.extraDarkBlue,
        opacity: 0.9
,        overflowX: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', 
        }}>
       <StyledFlexBox direction="row" align="flex-start" gap={24}>
        {imageArr.map(({ image, alt },i) => (
          <Box key={alt} sx={{ width: '250px'}}>
            <img src={image} alt={alt}  />
          </Box>
        ))}
       </StyledFlexBox>
      </StyledFlexBox>
      {/* Question of the Day */}
       <StyledFlexBox direction="column" align="center" gap={72} sx={{ padding: '96px 72px',}}>

      <StyledFlexBox direction="column" align="center" gap={24}>
        <StyledFlexBox direction="column" align="center" gap={12}>
        <StyledText fontSize="16px">Activity</StyledText>
        <StyledText fontSize="40px" fontWeight={700}>Question of the Day</StyledText>
        </StyledFlexBox>
        <StyledText fontSize="16px">Test your knowledge, then test your judgment.</StyledText>
      </StyledFlexBox>
      <StyledFlexBox borderRadius={24} sx={{ backgroundColor: '#0037A4'}} height="483px" width="100%" />
       </StyledFlexBox>

{/* Features section */}


<Grid container direction="column" alignItems="center" sx={{  gap: '72px', padding: '96px 72px', backgroundColor: '#001642', }}>
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
       <Grid size={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

      <StyledFlexBox sx={{ width: '100%', border: '1px solid white'}}>
           <Box width="440px" height="420px"/>
          </StyledFlexBox>
   
    
    
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
  <StyledFlexBox align="center" justify="center" gap={24}>
    <StyledFlexBox align="center">
    <StyledText fontFamily="Poppins" fontSize="16px" fontWeight={600}>Media</StyledText>
    <StyledText fontFamily="Poppins" fontSize="40px" fontWeight={700} lineHeight={1.2}>Featured Videos</StyledText>
    </StyledFlexBox>
    <Box>
    <StyledText>
      Check out what&apos;s recently been happening iwth RightOn!
      </StyledText>
    </Box>
  </StyledFlexBox>

  <StyledFlexBox height="586px" width="1042px" sx={{ border: '1px solid white'}} />

</StyledFlexBox>


       
    </HomePageContainer>
  )
}