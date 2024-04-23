import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { ITeam } from '@righton/networking';
import CurrentStudents from './CurrentStudents';

const windowHeight = window.innerHeight - 170 - 47; // Subtracting 160 pixels for the footer
// THIS IS NOT!!!! DYNAMIC!!!!!
const BodyStyled = styled(Box)({
    // height: `${windowHeight}px`, // Set height dynamically
    // height: '400px',
    margin: 'auto',
    overflowY: 'scroll', // Enable vertical scrolling if needed
    flexGrow: 1,
    scrollbarWidth: 'none',
});

export default function HostBody({ teams }: { teams: ITeam[] }) {
  return (
    <BodyStyled>
      <Swiper spaceBetween={4} slidesPerView="auto" style={{ height: 'auto' }}>
        <SwiperSlide style={{ height: '100%' }}>
          <CurrentStudents teams={teams} />
        </SwiperSlide>
        <SwiperSlide>
          <Typography style={{ marginTop: '48px' }}>
            Page 2
          </Typography>
        </SwiperSlide>
      </Swiper>
    </BodyStyled>
  );
}
