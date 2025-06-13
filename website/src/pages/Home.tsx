import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import RightOnMainImg from '../images/right-on-education.svg';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';
import pinkMonster from '../images/pinkmonster.svg';
import fourtyImg from '../images/fourty.svg';
import nsfImg from '../images/nsf.svg';
import schmidtImg from '../images/schmidt.svg';
import toolsCompetitionImg from '../images/tools-competition.svg';
import velaImg from '../images/vela.svg';
import waltonFamilyImg from '../images/walton-family.svg';
import gameScreen from '../images/gamescreen.svg';
import WavyDivider from '../components/WavyDivider';

const imageArr = [
  { image: fourtyImg, alt: "sponsors-forty" },
  { image: toolsCompetitionImg, alt: "sponsors-learning-engineering" },
  { image: nsfImg, alt: "sponsors-nsf" },
  { image: schmidtImg, alt: "sponsors-schmidt-futures" },
  { image: velaImg, alt: "sponsors-vela" },
  { image: waltonFamilyImg, alt: "sponsors-walton-family" },
]

const StyledHeaderText = styled(Typography)(({theme}) => ({
fontSize: '60px',
fontFamily: 'Poppins',
color: 'white',
fontWeight: 600,
lineHeight: "120%",
letterSpacing: '-4%'
}));

const StyledSubText = styled(Typography)(({theme}) => ({
fontSize: '20px',
fontFamily: 'Poppins',
color: 'white',
fontWeight: 500,
lineHeight: "auto",
}));

const HomePageContainer = styled(Box)(({theme}) => ({
  width: '100%',
  background: theme.palette.primary.extraDarkBlue,
  boxSizing: 'border-box',
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
}));

export const CreateGameBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.1,
  zIndex: 0,
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  backgroundImage: `
    linear-gradient(to bottom, rgba(2, 33, 95, 0.25), rgba(2, 33, 95, 1)),
    url(${mathSymbolsBackground})
  `,
  backgroundSize: '100%'
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
      <StyledFlexBox sx={{ zIndex: 5 }}>
        <img src={RightOnMainImg} width="100%" height="100%" alt="right-on-education" />
      </StyledFlexBox>
      <StyledFlexBox direction="row" align="center" gap={48}>
        {/* Teachers CTA button */}
        <StyledFlexBox direction="row" align="center" borderRadius={24} gap={12} width="356px" sx={{ border: '1px solid white', padding: '12px 24px' }}>
          <StyledFlexBox align="center" justify="center" height="60px" width="60px" borderRadius={14} sx={{ background: 'linear-gradient(#3E2D84 100%, #32285A)' }}>
            <img src={pinkMonster} alt="pink-monster" width="40px" height="40px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={8}>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 700 }}>
              Teachers
            </Typography>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 600 }}>
              Create, edit, and host games
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
         {/* Students CTA button */}
         <StyledFlexBox direction="row" align="center" borderRadius={24} gap={12} width="356px" sx={{ border: '1px solid white', padding: '12px 24px' }}>
          <StyledFlexBox align="center" justify="center" height="60px" width="60px" borderRadius={14} sx={{ background: 'linear-gradient(#3E2D84 100%, #32285A)' }}>
            <img src={pinkMonster} alt="pink-monster" width="40px" height="40px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={8}>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 700 }}>
              Students
            </Typography>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 600 }}>
              Join and play a game
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
      </StyledFlexBox>
      </StyledFlexBox>

      {/* Sponsors Divider */}
      <StyledFlexBox direction="row" height="126px" sx={{ 
        border: '1px solid white',
        backgroundColor: (theme) => theme.palette.primary.extraDarkBlue, 
        overflowX: 'auto',
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

       <StyledFlexBox sx={{ 
        backgroundColor: '#001642', 
        padding: '96px 72px',
    //      '--mask': `
    //   radial-gradient(402.49px at 50% 540px, #000 99%, #0000 101%) calc(50% - 360px) 0 / 720px 100%,
    //   radial-gradient(402.49px at 50% -360px, #0000 99%, #000 101%) 50% 180px / 720px 100% repeat-x
    // `,
    // WebkitMask: 'var(--mask)',
    // mask: 'var(--mask)',
      }} 
        direction="column" 
        align="center" 
        gap={72}>
        {/* central & Host */}
        <StyledFlexBox direction="row" justify="center" >
          <StyledFlexBox gap={24} sx={{ padding: '59px 65px'}}>
            <StyledFlexBox align="center">
              <StyledText fontWeight={700} fontSize="40px">Central & Host</StyledText>
            </StyledFlexBox>
             <StyledFlexBox>
              <StyledText fontSize="20px">
                Teachers can choose from our <EmphasizeText>standard-aligned games</EmphasizeText> or create and edit their own game questions—for in-class practice, test preparation, warm-up, or exit ticket.
              </StyledText>
             </StyledFlexBox>

          </StyledFlexBox>

           <StyledFlexBox sx={{ width: '100%'}}>
           <img src={gameScreen} width="100%" height="100%" alt="game-screen" />
          </StyledFlexBox>
        </StyledFlexBox>


       </StyledFlexBox>

       
    </HomePageContainer>
  )
}