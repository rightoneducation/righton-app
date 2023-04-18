import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { JoinGameBackgroundContainer, PaginationContainer } from '../../lib/styledcomponents/StyledComponents';
import HowToPlay_Phase1Circle from '../../img/HowToPlay_Phase1Circle.svg';
import HowToPlay_Phase2Circle from '../../img/HowToPlay_Phase2Circle.svg';
import HowToPlay_OrangeMonster from '../../img/HowToPlay_OrangeMonster.svg';
import HowToPlay_RedMonster from '../../img/HowToPlay_RedMonster.svg';
import HowToPlay_GreenMonster from '../../img/HowToPlay_GreenMonster.svg';
import HowToPlay_PinkMonster from '../../img/HowToPlay_PinkMonster.svg';
import HowToPlay_PinkMonster2 from '../../img/HowToPlay_PinkMonster2.svg';
import HowToPlay_BlueMonster from '../../img/HowToPlay_BlueMonster.svg';
import HowToPlay1_Screenshot from '../../img/HowToPlay1_Screenshot.svg';
import 'swiper/css';
import 'swiper/css/pagination';


const StackContainer = styled(Stack)(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  maxWidth: theme.breakpoints.values.sm,
  paddingBottom: `${theme.sizing.largePadding}px`,
})
);

const HowToPlaySwiper = styled(Swiper)({ // styles for swiper and swiper slides
  width: '100%',
  '& .swiper-slide': {
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
}
});

const OverlayContainer = styled('div')(({ // container that floats over top of screenshot to position overlaid monsters and icons
  position: 'absolute', 
  height: '100%', 
  width: '100%',
}));

const OverLayImage = styled('img')({
  position: 'absolute',
});

const ScreenshotImage = styled('img')({
  width: '250px',
  height: 'auto',
});

export default function JoinGame() {
  const theme = useTheme();

  return (
    <JoinGameBackgroundContainer>
    <StackContainer>
    <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px` }}> How to Play! </Typography>
      <Box style={{width: '100%'}}>
        <HowToPlaySwiper modules={[Pagination]} slidesPerView={1} pagination={{
          el: '.swiper-pagination-container',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
          },
        }}>
          <SwiperSlide>
            <OverlayContainer>
              <OverLayImage src={HowToPlay_Phase1Circle} alt="monster"  sx={{ top: '40px', left: '210px', height: '70px', width: '70px'}}/>
              <OverLayImage src={HowToPlay_OrangeMonster} alt="monster" sx={{ bottom: '45px', left: '110px', width: '200px', height: 'auto'}}/>
            </OverlayContainer>
            <ScreenshotImage  src={HowToPlay1_Screenshot} alt="monster" />
            <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px`, width: '250px' }}> Read the multiple-choice question </Typography>
          </SwiperSlide>
          <SwiperSlide>
            <OverlayContainer>
              <OverLayImage src={HowToPlay_Phase1Circle} alt="monster"  sx={{ top: '40px', left: '210px', height: '70px', width: '70px'}}/>
              <OverLayImage src={HowToPlay_RedMonster} alt="monster" sx={{ bottom: '60px', left: '420px', width: '115px', height: 'auto'}}/>
            </OverlayContainer>
            <ScreenshotImage  src={HowToPlay1_Screenshot} alt="monster" />
            <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px`, width: '250px' }}> Gain points by choosing the correct answer... </Typography>
          </SwiperSlide>
          <SwiperSlide>
            <OverlayContainer>
              <OverLayImage src={HowToPlay_Phase1Circle} alt="monster"  sx={{ top: '40px', left: '210px', height: '70px', width: '70px'}}/>
              <OverLayImage src={HowToPlay_GreenMonster} alt="monster" sx={{ bottom: '80px', left: '180px', width: '90px', height: 'auto', zIndex: -1}}/>
              <OverLayImage src={HowToPlay_PinkMonster} alt="monster" sx={{ bottom: '80px', left: '430px', width: '90px', height: 'auto'}}/>
            </OverlayContainer>
            <ScreenshotImage  src={HowToPlay1_Screenshot} alt="monster" />
            <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px`, width: '250px' }}> Read step-by-step solutions </Typography>
          </SwiperSlide>
          <SwiperSlide>
            <OverlayContainer>
              <OverLayImage src={HowToPlay_Phase2Circle} alt="monster"  sx={{ top: '40px', left: '210px', height: '70px', width: '70px'}}/>
              <OverLayImage src={HowToPlay_PinkMonster2} alt="monster" sx={{ bottom: '90px', left: '400px', width: '90px', height: 'auto'}}/>
            </OverlayContainer>
            <ScreenshotImage src={HowToPlay1_Screenshot} alt="monster" />
            <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px`, width: '350px' }}> Gain more points by guessing the most popular incorrect answer! </Typography>
          </SwiperSlide>
          <SwiperSlide>
            <OverlayContainer>
              <OverLayImage src={HowToPlay_BlueMonster} alt="monster" sx={{ top: '30px', left: '370px', width: '140px', height: 'auto', zIndex: -1}}/>
            </OverlayContainer>
            <ScreenshotImage src={HowToPlay1_Screenshot} alt="monster" />
            <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px`, width: '350px' }}> Gain more points by guessing the most popular incorrect answer! </Typography>
          </SwiperSlide>
        </HowToPlaySwiper>
        <PaginationContainer className="swiper-pagination-container" style={{paddingTop: `${theme.sizing.largePadding}px`}} />
      </Box>
      <Typography variant="h4" sx={{color: `${theme.palette.primary.main}`, fontWeight:400, textAlign: 'center', paddingBottom: `${theme.sizing.mediumPadding}px` }}> Waiting for the game to start... </Typography> 
    </StackContainer>
    </JoinGameBackgroundContainer>
  )
}
