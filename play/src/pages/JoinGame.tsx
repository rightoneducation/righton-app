import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Container, Box, Grid, Typography, Button  } from '@mui/material';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';
import { IntroButton, IntroTextField, GamePlayButton, PaginationContainer } from '../lib/styledcomponents/StyledComponents';
import { AvatarMap } from '../lib/PlayModels';
import Logo from '../img/rightOnLogo.svg';
import Icon0 from '../img/MonsterIcon0.svg';
import Icon1 from '../img/MonsterIcon1.svg';
import Icon2 from '../img/MonsterIcon2.svg';
import Icon3 from '../img/MonsterIcon3.svg';
import Icon4 from '../img/MonsterIcon4.svg';
import Icon5 from '../img/MonsterIcon5.svg';
import Monster0 from '../img/Monster0.svg';
import Monster1 from '../img/Monster1.svg';
import Monster2 from '../img/Monster2.svg';
import Monster3 from '../img/Monster3.svg';
import Monster4 from '../img/Monster4.svg';
import Monster5 from '../img/Monster5.svg';

// interface JoinGameProps {

// }


const IntroContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  background: `${theme.palette.primary.radialGradient} no-repeat`,
  backgroundSize: `100%`,
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
})
);

const StackContainer = styled(Stack)(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: theme.breakpoints.values.xs,
})
);

const GridContainer = styled('div')(({theme}) => ({ // using CSS Grid here because mui Grid responsiveness produces changes in spacing when crossing breakpoints
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  spacing: `${theme.sizing.mediumPadding}px`,
})
);

const Avatar = styled('img')({
  height: '106px',
  width: 'auto',
  boxShadow: '0px 8px 20px rgba(26, 100, 136, 0.3)',
  borderRadius: '20px',
  borderColor: 'white',
  borderStyle: 'solid',

});

const Monster = styled('img')({
  width: '250px',
  height: 'auto',
});

export default function JoinGame() {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [inputError, setInputError] = useState(true);
  const [gameCodeValue, setGameCodeValue] = useState("####");
  const [playerFirstName, setPlayerFirstName] = useState("First Name");
  const [playerLastName, setPlayerLastName] = useState("Last Name");
  const [avatar, setAvatar] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  interface AvatarMap {
    [key: number]: {
      icon: string, 
      monster?: string
    };
  }
  
  const monsterMap: AvatarMap = {
    0: { icon: Icon0, monster: Monster0 },
    1: { icon: Icon1, monster: Monster1 },
    2: { icon: Icon2, monster: Monster2 },
    3: { icon: Icon3, monster: Monster3 },
    4: { icon: Icon4, monster: Monster4 },
    5: { icon: Icon5, monster: Monster5 },
  };


  const avatarSelect = true;

  const IntroScreen = (
    <>
      <Typography variant="h2" sx={{weight:700, textAlign: 'center'}}> Unlocking every student`s potential in math!</Typography>
        <IntroTextField 
          fullWidth 
          variant="filled" 
          InputProps={{ 
            disableUnderline: true,
            inputProps: {
              style: {
              paddingTop: '9px'
              }
            }
          }} />
        <IntroButton>
          <Typography variant="h2" sx={{textAlign: 'center'}}>Join Game</Typography>
        </IntroButton>
      </>
  );
  
  const GameCodeScreen = (
    <>
    <Box> {/* container here to trim the spacing set by parent stack between text and input, typ */}
      <Typography variant="h2" sx={{weight:700, textAlign: 'center'}}> Enter Game Code </Typography>
      <IntroTextField 
          fullWidth 
          variant="filled" 
          autoComplete="off"
          onChange={(newValue) => {
            setGameCodeValue(newValue.target.value);
          }}
          onFocus = {(newValue) => {
            if (newValue.target.value === "####") {
              setGameCodeValue("");
            }
          }}
          value= {gameCodeValue}
          InputProps={{ 
            disableUnderline: true,
            inputProps: {
              style: {
              color: (gameCodeValue === "####" ? theme.palette.primary.darkGrey : theme.palette.primary.extraDarkGrey),
              paddingTop: '9px',
              textAlign: 'center',
              fontSize: `${theme.typography.h2.fontSize}px`,
              }
            }
          }} />
          </Box>
         <IntroButton>
          <Typography variant="h2" sx={{textAlign: 'center'}}>Join</Typography>
        </IntroButton>
        {inputError ? 
        <Box>
          <Typography variant="h2" sx={{weight:700, textAlign: 'center', marginBottom: `${theme.sizing.smallPadding}px`}}> We are unable to join this game. </Typography>
          <Typography variant="h2" sx={{weight:700, textAlign: 'center'}}> Check the Game Code and try again. </Typography>
        </Box>
        :
        null}
    </>
  );

  const PlayerNameScreen = (
    <>
    <Box>
      <Typography variant="h2" sx={{textAlign: 'center'}}> Enter Your Name </Typography>
      <Grid container spacing = {2} wrap='nowrap'> 
        <Grid item xs={6}> 
          <IntroTextField 
              fullWidth 
              variant="filled" 
              autoComplete="off"
              onChange={(newValue) => {
                setPlayerFirstName(newValue.target.value);
              }}
              onFocus = {(newValue) => {
                if (newValue.target.value === "First Name") {
                  setPlayerFirstName("");
                }
              }}
              value= {playerFirstName}
              InputProps={{ 
                disableUnderline: true,
                inputProps: {
                  style: {
                  color: (playerFirstName === "First Name" ? theme.palette.primary.darkGrey : theme.palette.primary.extraDarkGrey),
                  paddingTop: '9px',
                  textAlign: 'center',
                  fontSize: `${theme.typography.h2.fontSize}px`,
                  }
                }
                }} />
            </Grid>
            <Grid item xs={6}>
              <IntroTextField 
              fullWidth 
              variant="filled" 
              autoComplete="off"
              onChange={(newValue) => {
                setPlayerLastName(newValue.target.value);
              }}
              onFocus = {(newValue) => {
                if (newValue.target.value === "Last Name") {
                  setPlayerLastName("");
                }
              }}
              value= {playerLastName}
              InputProps={{ 
                disableUnderline: true,
                inputProps: {
                  style: {
                  color: (playerLastName === "Last Name" ? theme.palette.primary.darkGrey : theme.palette.primary.extraDarkGrey),
                  paddingTop: '9px',
                  textAlign: 'center',
                  fontSize: `${theme.typography.h2.fontSize}px`,
                  }
                }
              }} />
            </Grid>
          </Grid>
          </Box>
         <IntroButton>
          <Typography variant="h2" sx={{textAlign: 'center'}}>Enter</Typography>
        </IntroButton>
        {inputError ? 
        <Box>
          <Typography variant="h2" sx={{textAlign: 'center', marginBottom: `${theme.sizing.smallPadding}px`}}> Type in both your first and last name to enter the game.  </Typography>
          <Typography variant="h2" sx={{fontWeight:400, textAlign: 'center'}}> This will be used to identify you only during the game, and will not be stored. </Typography>
        </Box>
        :
        null}
    </>
  );
  
  const avatarSelectScreen = (
    <>
      <Stack spacing={2}>
        <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px` }}> Choose Your Avatar! </Typography>
        <GridContainer> 
          { Object.keys(monsterMap).map((value, index) => (
            <Box key={uuidv4()} sx={{height: '118px', width: '98px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
              <Avatar src={monsterMap[index].icon} onClick={() => {setSelectedAvatar(index)}} alt="avatar" sx={{ borderWidth: (index === selectedAvatar) ? '6px' : '0px'}}/>
            </Box>
          ))
        }
        </GridContainer>
      </Stack>
      <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: 0, minHeight: '270px'}}> 
        <Monster src={monsterMap[selectedAvatar || 0].monster} alt="monster" sx={{width: isMobileDevice? '200px' : '250px'}}/>
      </Box>
      <Box marginBottom={`${theme.sizing.mediumPadding}px`} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
        <Typography variant="h2" sx={{textAlign: 'center'}}> {`${playerFirstName} ${playerLastName}`} </Typography>
        <GamePlayButton> Choose </GamePlayButton>
      </Box>
    </>
  );

  const howToPlayScreen = (
    <>
      <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px` }}> How to Play! </Typography>
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        centeredSlides
        slidesPerView="auto"
        pagination={{
          el: '.swiper-pagination-container',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
          },
        }}
        style={{ height: '100%' }}
      >
        <SwiperSlide style={{ height: '100%'}}>
            sup
        </SwiperSlide>
        <SwiperSlide style={{ height: '100%'}}>
          sup
        </SwiperSlide>
        <PaginationContainer className="swiper-pagination-container" />
      </Swiper>
      <Typography variant="h4" sx={{color: `${theme.palette.primary.main}`, fontWeight:400, textAlign: 'center', paddingBottom: `${theme.sizing.mediumPadding}px` }}> Waiting for the game to start... </Typography>
    </> 
  );

  return (

    <IntroContainer>
        {!avatarSelect ? 
          <StackContainer spacing = {5}>
            <img
              style = {{width: '214px', height: '118px', paddingTop: `${theme.sizing.extraLargePadding}px`}}
              src={Logo}
              alt="Question"
            />
            {PlayerNameScreen}
          </StackContainer>
        :
          <StackContainer sx={{justifyContent: 'space-between', height: '100%', paddingBottom: `${theme.sizing.largePadding}px`}}>
            {avatarSelectScreen}
          </StackContainer>
        }
    </IntroContainer>
  )
}