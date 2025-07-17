import React, { useRef } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import SinclairImg from '../../images/sinclair.svg';
import SinclairTitle from '../../images/SinclarTitle.svg';
import DrewImg from '../../images/Headshot_Drew.png'
import MahalaImg from '../../images/Headshot_Mahala.png'
import ChrisImg from '../../images/Headshot_Chris.png'
import DazImg from '../../images/Headshot_Daz.png'
import MikeImg from '../../images/Headshot_Mike.png'
import MuhammadImg from '../../images/Headshot_Muhammad.png'
import MarizzaImg from '../../images/Headshot_Marizza.png'
import ImanImg from '../../images/Headshot_Iman.png'

import KaterinaImg from '../../images/Headshot_Katerina.png'
import AnnaImg from '../../images/Headshot_Anna.png'

import 'swiper/css';
import 'swiper/css/pagination';
import FlipCard from './FlipCard';
import favoriteMistakeImg from '../../images/favoriteMistake.png'
import MistakeCard from './MistakeCard';

interface IRightOnTeam {
  screenSize: ScreenSize;
}

const teamArr = [
  {
    img: SinclairImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: 'https://www.linkedin.com/in/sinclairwu/',
  },
    {
    img: AnnaImg,
    name: 'Anna Roberds',
    title: 'Product Lead',
    linkedIn: 'https://www.rightoneducation.com/images/anna-name.png',
  },
  {
    img: DrewImg,
    name: 'Drew Hart',
    title: 'Development Lead',
    linkedIn: 'https://www.rightoneducation.com/images/drew-name.png',
  },
  {
    img: MahalaImg,
    name: 'Mahala Femovich',
    title: 'UX Intern',
    linkedIn: 'https://www.linkedin.com/in/mfemovich/',
  },
  {
    img: ChrisImg,
    name: 'Christopher Tran',
    title: 'UX Intern',
    linkedIn: 'https://www.linkedin.com/in/chrvtran/',
  },
  {
    img: DazImg,
    name: 'Daz Yang',
    title: 'UI Designer',
    linkedIn: 'https://www.rightoneducation.com/images/daz-name.png',
  },
  {
    img: MikeImg,
    name: 'Michael Hunter',
    title: 'Development Intern',
    linkedIn: 'www.linkedin.com/in/michael-h-hunter',
  },
  {
    img: MuhammadImg,
    name: 'Muhammad Quereshi',
    title: 'Development Intern',
    linkedIn: 'https://www.linkedin.com/in/muhammad-qureshi-22918218b/',
  },
  {
    img: ImanImg,
    name: 'Sinclair Wu',
    title: 'STEM Administrator',
    linkedIn: 'https://www.rightoneducation.com/images/iman-name.png',
  },
    {
    img: MarizzaImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: 'https://www.rightoneducation.com/images/marizza-name.png',
  },
  //   {
  //   img: RondaldImg,
  //   name: 'Sinclair Wu',
  //   title: 'Product Lead',
  //   linkedIn: 'https://www.rightoneducation.com/images/ronald-name.png',
  // },
    {
    img: KaterinaImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: 'https://www.rightoneducation.com/images/katerina-name.png',
  },
];

export default function RightonTeam({ screenSize }: IRightOnTeam) {
    const theme = useTheme()
  const swiperRef = useRef<SwiperRef>(null);
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
            <FlipCard 
            front={
            <>
            <Box
              width="252px"
              height="280px"
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
            </>
            }
            back={
              <>
            <Box
              width="252px"
              height="280px"
              // component="img"
              // src={favoriteMistakeImg}
              // alt={`${name}-${i}`}
            >
              <MistakeCard answer="I merged main with my broken branch!! So embarassing..." />
            </Box>
            <Box
              width="252px"
              height="70px"
              component="img"
              src={SinclairTitle}
              alt={`${name}-title`}
            />
            </>
            }
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Swiper layout for medium and below
  return (
    <Box width="100%" 
    sx={{
    '& .swiper-pagination-bullet': {
      width: '6px',
      height: '6px',
      backgroundColor: '#afafaf',
    },
    '& .swiper-pagination-bullet-active': {
      backgroundColor: '#494949',
    },

    }}
    >
      <Swiper
        modules={[Pagination]}
         pagination={{ clickable: true }}
        ref={swiperRef}
        spaceBetween={24}
        loop
        centeredSlidesBounds
        updateOnWindowResize
        navigation
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
             <FlipCard 
            front={
            <>
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
            </>
            }
            back={
              <>
            <Box
              width="252px"
              height="302px"
              component="img"
              src={favoriteMistakeImg}
              alt={`${name}-${i}`}
            />
            <Box
              width="252px"
              height="70px"
              component="img"
              src={SinclairTitle}
              alt={`${name}-title`}
            />
            </>
            }
            />
          </SwiperSlide>
        ))}
      </Swiper>
     
    </Box>
  );
}