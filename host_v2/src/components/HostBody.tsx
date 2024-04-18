// import React from 'react';
// import { Typography, Grid, Box } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import {
//     ITeam,
//   } from '@righton/networking';
// import CurrentStudents from './CurrentStudents';


// interface HostBodyProps {
//     teams: ITeam[]
// }

// const BodyStyled = styled(Box)({
//     // height: '473px',
//     height: '473px',
//     overflow: 'auto', // Enable vertical scrolling if needed
//   });

// export default function HostBody({teams}: HostBodyProps ) {
//     return (
//     <BodyStyled>
//         <Swiper spaceBetween={4} slidesPerView="auto" style={{ height: '100%' }}>
//           <SwiperSlide style={{
//                 height: '100%',
//               }}>
//             <CurrentStudents teams={teams}/>
//           </SwiperSlide>
//           <SwiperSlide>
//             <Typography variant="h6" align="center" style={{ marginTop: '48px' }}>
//               Page 2
//             </Typography>
//           </SwiperSlide>
//         </Swiper>
//         </BodyStyled>
//   );
// }

import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { ITeam } from '@righton/networking';
import CurrentStudents from './CurrentStudents';

const windowHeight = window.innerHeight - 160 - 170 - 47; // Subtracting 160 pixels for the footer

const BodyStyled = styled(Box)({
  height: `${windowHeight}px`, // Set height dynamically
  overflowY: 'auto', // Enable vertical scrolling if needed
});

export default function HostBody({ teams }: { teams: ITeam[] }) {
  return (
    <BodyStyled>
      <Swiper spaceBetween={4} slidesPerView="auto" style={{ height: '100%' }}>
        <SwiperSlide style={{ height: `${windowHeight}px` }}>
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
