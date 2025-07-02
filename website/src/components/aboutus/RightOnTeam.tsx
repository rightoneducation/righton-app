import React from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import SinclairImg from '../../images/sinclair.svg';
import SinclairTitle from '../../images/SinclarTitle.svg';
import 'swiper/css';
import 'swiper/css/pagination';


interface IRightOnTeam {
  screenSize: ScreenSize;
}

const teamArr = [
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: '#',
  },
];

export default function RightonTeam({ screenSize }: IRightOnTeam) {
  const isLarge = screenSize === ScreenSize.LARGE;

  if (isLarge) {
    // Grid layout for large screens and up
    return (
      <Grid
        container
        direction="row"
        spacing={6}
        sx={{
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE
          boxSizing: 'border-box',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {teamArr.map(({ img, name, title }, i) => (
          <Grid
            key={`${name}-${title}`}
            size={{ xs: 12, sm: 6, md: 6, lg: 3 }}
            height="372px"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Box
              width="252px"
              height="302px"
              component="img"
              src={img}
              alt={`${name}-${i}`}
            />
            <Box
              width="252px"
              height="70px"
              component="img"
              src={SinclairTitle}
              alt={`${name}-title`}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Swiper layout for medium and below
  return (
    <Box width="100%">
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView="auto"
        pagination={{
          el: '.swiper-pagination-container',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          renderBullet: (index: number, className: string) => {
            return `<span class="${className}" style="width:6px; height:6px; border-radius:50%; background:#ccc;"></span>`;
          },
        }}
        loop
        centeredSlides
        centeredSlidesBounds
        updateOnWindowResize
         breakpoints={{
    0: {
      slidesPerView: 1,
    },
    700: {
      slidesPerView: 2,
    },
    
  }}

      >
        {teamArr.map(({ img, name, title }, i) => (
          <SwiperSlide
            key={`${name}-${title}`}
            style={{
              width: '260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              width="252px"
              height="302px"
              component="img"
              src={img}
              alt={`${name}-${i}`}
            />
            <Box
              width="252px"
              height="70px"
              component="img"
              src={SinclairTitle}
              alt={`${name}-title`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Box className="swiper-pagination-container" display="flex" justifyContent="center" />
    </Box>
  );
}