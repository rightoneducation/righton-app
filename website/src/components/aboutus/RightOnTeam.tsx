import React, { useRef } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import SinclairTitle from '../../images/SinclarTitle.svg';

import SinclairImg from '../../images/Headshot_Sinclair.png';
import SinclairMistakeImg from '../../images/Headshot_Sinclair_Back.png';

import DrewImg from '../../images/Headshot_Drew.png';
import DrewMistakeImg from '../../images/Headshot_Drew_Back.png';

import MahalaImg from '../../images/Headshot_Mahala.png';
import MahalaMistakeImg from '../../images/Headshot_Mahala_Back.png';

import ChrisImg from '../../images/Headshot_Chris.png';
import ChrisMistakeImg from '../../images/Headshot_Chris_Back.png';

import DazImg from '../../images/Headshot_Daz.png';
import DazMistakeImg from '../../images/Headshot_Daz_Back.png';

import MikeImg from '../../images/Headshot_Mike.png';
import MikeMistakeImg from '../../images/Headshot_Mike_Back.png';

import MuhammadImg from '../../images/Headshot_Muhammad.png';
import MuhammadMistakeImg from '../../images/Headshot_Muhammad_Back.png';

import MarizzaImg from '../../images/Headshot_Marizza.png';
import MarizzaMistakeImg from '../../images/Headshot_Marizza_Back.png';

import ImanImg from '../../images/Headshot_Iman.png';
import ImanMistakeImg from '../../images/Headshot_Iman_Back.png';

import KaterinaImg from '../../images/Headshot_Katerina.png';
import KaterinaMistakeImg from '../../images/Headshot_Katerina_Back.png';

import AnnaImg from '../../images/Headshot_Anna.png';
import AnnaMistakeImg from '../../images/Headshot_Anna_Back.png';

import MozzieImg from '../../images/Headshot_Mozzie.png';
import MozzieMistakeImg from '../../images/Headshot_Mozzie_Back.png';

import RonaldImg from '../../images/Headshot_Ronald.png';

import LinkedInIcon from '../../images/LinkedIn.svg'


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
    mistakeImg: SinclairMistakeImg,
    name: 'Sinclair Wu',
    title: 'Product Lead',
    linkedIn: 'https://www.linkedin.com/in/sinclairwu/',
  },
    {
    img: AnnaImg,
    mistakeImg: AnnaMistakeImg,
    name: 'Anna Roberds',
    title: 'Math Educator',
    title2: 'Curriculum Program Manager',
    linkedIn: 'https://www.rightoneducation.com/images/anna-name.png',
  },
  {
    img: DrewImg,
    mistakeImg: DrewMistakeImg,
    name: 'Drew Hart',
    title: 'Development Lead',
    linkedIn: 'https://www.rightoneducation.com/images/drew-name.png',
  },
    {
    img: DazImg,
    mistakeImg: DazMistakeImg,
    name: 'Daz Yang',
    title: 'UI Designer',
    title2: 'Front-End Developer',
    linkedIn: 'https://www.linkedin.com/in/dazyang',
  },
  {
    img: MahalaImg,
    mistakeImg: MahalaMistakeImg,
    name: 'Mahala Femovich',
    title: 'UX Intern',
    linkedIn: 'https://www.linkedin.com/in/mfemovich/',
  },
  {
    img: ChrisImg,
    mistakeImg: ChrisMistakeImg,
    name: 'Christopher Tran',
    title: 'UX Intern',
    linkedIn: 'https://www.linkedin.com/in/chrvtran/',
  },

  {
    img: MikeImg,
    mistakeImg: MikeMistakeImg,
    name: 'Michael Hunter',
    title: 'Development Intern',
    linkedIn: 'www.linkedin.com/in/michael-h-hunter',
  },
  {
    img: MuhammadImg,
    mistakeImg: MuhammadMistakeImg,
    name: 'Muhammad Quereshi',
    title: 'Development Intern',
    linkedIn: 'https://www.linkedin.com/in/muhammad-qureshi-22918218b/',
  },
  {
    img: ImanImg,
    mistakeImg: ImanMistakeImg,
    name: 'Sinclair Wu',
    title: 'STEM Administrator',
    title2: 'Curriculum Specialist',
    linkedIn: 'https://www.linkedin.com/in/imanhoward/',
  },
    {
    img: MozzieImg,
    mistakeImg: MozzieMistakeImg,
    name: 'Mozzie Dosalmas, PhD',
    title: 'Math Educator',
    title2: 'Content & Pedagogy',
    linkedIn: 'https://www.linkedin.com/in/l-marizza-bailey-5b981143/',
  },
      {
    img: MarizzaImg,
    mistakeImg: MarizzaMistakeImg,
    name: 'Marizza Baily',
    title: 'Math Educator',
    title2: 'Content & Pedagogy',
    linkedIn: 'https://www.linkedin.com/in/l-marizza-bailey-5b981143/',
  },
    {
    img: RonaldImg,
    mistakeImg: favoriteMistakeImg,
    name: 'Ronald Towns',
    title: 'STEM Administrator',
    title2: 'Math PD',
    linkedIn: 'https://www.rightoneducation.com/images/ronald-name.png',
  },
    {
    img: KaterinaImg,
    mistakeImg: KaterinaMistakeImg,
    name: 'Katerina Schenke, PhD',
    title: 'Educator Researcher',
    title2: 'Learning Scientist',
    linkedIn: 'https://www.linkedin.com/in/katerina-schenke-phd-37b827b7/',
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
          
        }}
      >
        {teamArr.map(({
           img, 
           name, 
           title, 
           mistakeImg,
           title2,
          }, i) => (
          <Grid
            key={`${name}-${title}`}
            size={{ xs: 12, sm: 6, md: 6, lg: 3 }}
            height="372px"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <FlipCard 
            front={
            <>
            {/* member img */}
            <Box
            onMouseOver={() => {}}
            onMouseLeave={() => {}}
              width="252px"
              component="img"
              src={img}
              alt={`${name}-${i}`}
            />

            {/* member name & title(s) */}
            <StyledFlexBox
              width="252px"
              height="70px"
              gap={5}
            >
              <StyledFlexBox direction="row" align="flex-end" justify="center" gap={10}>
              <StyledText fontFamily="Poppins" fontSize="17px" fontWeight={600}>
                {name}
              </StyledText>
              <Box component="img" src={LinkedInIcon} alt="linkedIn_icon" height="25px" />
              </StyledFlexBox>

              <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title}</StyledText>
              {title2 && <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title2}</StyledText>}
            </StyledFlexBox>
            </>
            }
            back={
              <>
           <Box
              width="252px"
              component="img"
              src={mistakeImg}
              alt={`${name}-${i}`}
            />
           <Box
              width="252px"
              height="70px"
            >
              <StyledFlexBox direction="row" align="center" justify="center" gap={5}>
              <StyledText fontFamily="Poppins" fontSize="17px" fontWeight={600}>
                {name}
              </StyledText>
              <Box component="img" src={LinkedInIcon} alt="linkedIn_icon" height="25px" />
              </StyledFlexBox>

              <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title}</StyledText>
              {title2 && <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title2}</StyledText>}
            </Box>
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
        {teamArr.map(({ img, name, title, title2, mistakeImg }, i) => (
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
              component="img"
              src={img}
              alt={`${name}-${i}`}
            />
            {/* member name & title(s) */}
            <Box
              width="252px"
              height="70px"
            >
              <StyledFlexBox direction="row" align="center" justify="center" gap={5}>
              <StyledText fontFamily="Poppins" fontSize="17px" fontWeight={600}>
                {name}
              </StyledText>
              <Box component="img" src={LinkedInIcon} alt="linkedIn_icon" height="25px" />
              </StyledFlexBox>

              <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title}</StyledText>
              {title2 && <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title2}</StyledText>}
            </Box>
            </>
            }
            back={
              <>
              {/* member image */}
           <Box
              width="252px"
              component="img"
              src={mistakeImg}
              alt={`${name}-${i}`}
            />
            {/* member name & title(s) */}
            <Box
              width="252px"
              height="70px"
            >
              <StyledFlexBox direction="row" align="center" justify="center" gap={5}>
              <StyledText fontFamily="Poppins" fontSize="17px" fontWeight={600}>
                {name}
              </StyledText>
              <Box component="img" src={LinkedInIcon} height="25px" alt="linkedIn_icon" />
              </StyledFlexBox>

              <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title}</StyledText>
              {title2 && <StyledText textAlign="center" fontFamily="Poppins" fontSize="17px" fontWeight={200}>{title2}</StyledText>}
            </Box>
            </>
            }
            />
          </SwiperSlide>
        ))}
      </Swiper>
     
    </Box>
  );
}