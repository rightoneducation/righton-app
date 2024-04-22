import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { ITeam } from '@righton/networking';
import CurrentStudents from './CurrentStudents';

// const windowHeight = window.innerHeight - 160 - 170 - 47; // Subtracting 160 pixels for the footer
// THIS IS NOT!!!! DYNAMIC!!!!!
const BodyStyled = styled(Box)({
    // height: `${windowHeight}px`, // Set height dynamically
    height: '400px',
    margin: 'auto',
    overflowY: 'auto', // Enable vertical scrolling if needed
    // scrollMarginTop: '610px',
    // scrollPaddingTop: '500px',
    backgroundAttachment: 'fixed',
    scrollSnapMarginTop: '300px',

});

export default function HostBody({ teams }: { teams: ITeam[] }) {
  return (
    <BodyStyled>
      <Swiper spaceBetween={4} slidesPerView="auto" style={{ height: '100%' }}>
        {/* <SwiperSlide style={{ height: `${windowHeight}px` }}> */}
        <SwiperSlide style={{ height: '500px' }}>
          <CurrentStudents teams={teams} />
        </SwiperSlide>
        <SwiperSlide>
          <Typography variant="h6" align="center" style={{ marginTop: '48px' }}>
            Page 2
          </Typography>
        </SwiperSlide>
      </Swiper>
    </BodyStyled>
  );
}
