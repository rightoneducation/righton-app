import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { IntroButton, IntroTextField, GamePlayButton, PaginationContainer } from '../lib/styledcomponents/StyledComponents';
import { AvatarMap } from '../lib/PlayModels';
import HowToPlay from '../components/HowToPlay';
import AvatarSelect from '../components/AvatarSelect';
import Logo from '../img/rightOnLogo.svg';

import 'swiper/css';
import 'swiper/css/pagination';

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

const HowToPlayContainer = styled(StackContainer)(({theme}) => ({
  maxWidth: theme.breakpoints.values.sm,
}));





export default function JoinGame() {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [inputError, setInputError] = useState(true);
  const [gameCodeValue, setGameCodeValue] = useState("####");
  const [playerFirstName, setPlayerFirstName] = useState("First Name");
  const [playerLastName, setPlayerLastName] = useState("Last Name");
  const [avatar, setAvatar] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleAvatarSelected = (index: number) => {
    setSelectedAvatar(index);
  }


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
          <StackContainer style={{justifyContent: 'space-between', height: '100%', paddingBottom: `${theme.sizing.largePadding}px`}}>
            <AvatarSelect selectedAvatar={selectedAvatar} handleAvatarSelected={handleAvatarSelected} playerFirstName={playerFirstName} playerLastName={playerLastName} isMobileDevice={isMobileDevice} />
          </StackContainer>
        }
    </IntroContainer>
  )
}