import React, { useRef } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import SinclairTitle from '../../images/SinclarTitle.svg';

import DrewDefault from '../../images/headshots/drew/Headshot_Drew.png';
import DrewHover from '../../images/headshots/drew/Headshot_Drew_Hover.png';
import DrewBack from '../../images/headshots/drew/Headshot_Drew_Back.png';

import DazDefault from '../../images/headshots/daz/Headshot_Daz_Default.png';
import DazHover from '../../images/headshots/daz/Headshot_Daz_Hover.png';
import DazBack from '../../images/headshots/daz/Headshot_Daz_Back.png';

import ImanDefault from '../../images/headshots/iman/Headshot_Iman_Default.png';
import ImanHover from '../../images/headshots/iman/Headshot_Iman_Hover.png';
import ImanBack from '../../images/headshots/iman/Headshot_Iman_Back.png';

import MahalaDefault from '../../images/headshots/mahala/Headshot_Mahala_Default.png';
import MahalaHover from '../../images/headshots/mahala/Headshot_Mahala_Hover.png';
import MahalaBack from '../../images/headshots/mahala/Headshot_Mahala_Back.png';

import ChrisDefault from '../../images/headshots/chris/Headshot_Chris_Default.png';
import ChrisHover from '../../images/headshots/chris/Headshot_Chris_Hover.png';
import ChrisBack from '../../images/headshots/chris/Headshot_Chris_Back.png';

import MikeDefault from '../../images/headshots/mike/Headshot_Mike_Default.png';
import MikeHover from '../../images/headshots/mike/Headshot_Mike_Hover.png';
import MikeBack from '../../images/headshots/mike/Headshot_Mike_Back.png';

import MuhammadDefault from '../../images/headshots/muhammad/Headshot_Muhammad_Default.png';
import MuhammadHover from '../../images/headshots/muhammad/Headshot_Muhammad_Hover.png';
import MuhammadBack from '../../images/headshots/muhammad/Headshot_Muhammad_Back.png';

import MarizzaDefault from '../../images/headshots/marizz/Headshot_Marizza_Default.png';
import MarizzaHover from '../../images/headshots/marizz/Headshot_Marizza_Hover.png';
import MarizzaBack from '../../images/headshots/marizz/Headshot_Marizza_Back.png';

import KaterinaDefault from '../../images/headshots/katerina/Headshot_Katerina_Default.png';
import KaterinaHover from '../../images/headshots/katerina/Headshot_Katerina_Hover.png';
import KaterinaBack from '../../images/headshots/katerina/Headshot_Katerina_Back.png';

import AnnaDefault from '../../images/headshots/anna/Headshot_Anna_Default.png';
import AnnaHover from '../../images/headshots/anna/Headshot_Anna_Hover.png';
import AnnaBack from '../../images/headshots/anna/Headshot_Anna_Back.png';

import MozzieDefault from '../../images/headshots/mozzie/Headshot_Mozzie_Default.png';
import MozzieHover from '../../images/headshots/mozzie/Headshot_Mozzie_Hover.png';
import MozzieBack from '../../images/headshots/mozzie/Headshot_Mozzie_Back.png';

import RonaldDefault from '../../images/headshots/ronald/Headshot_Ronald_Default.png';
import RonaldHover from '../../images/headshots/ronald/Headshot_Ronald_Hover.png';
import RonaldBack from '../../images/headshots/ronald/Headshot_Ronald_Back.png';
// No Back image provided for Ronald

import SinclairDefault from '../../images/headshots/sinclair/Headshot_Sinclair_Default.png';
import SinclairHover from '../../images/headshots/sinclair/Headshot_Sinclair_Hover.png';
import SinclairBack from '../../images/headshots/sinclair/Headshot_Sinclair_Back.png';

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
    defaultImg: AnnaDefault,
    hoverImg: AnnaHover,
    backImg: AnnaBack,
    name: 'Anna Roberds',
    title: 'Math Educator',
    title2: 'Curriculum Program Manager',
    linkedIn: 'https://www.rightoneducation.com/images/anna-name.png',
  },
  {
    defaultImg: ChrisDefault,
    hoverImg: ChrisHover,
    backImg: ChrisBack,
    name: 'Christopher Tran',
    title: 'UX Intern',
    linkedIn: 'https://www.linkedin.com/in/chrvtran/',
  },
  {
    defaultImg: DazDefault,
    hoverImg: DazHover,
    backImg: DazBack,
    name: 'Daz Yang',
    title: 'UI Designer',
    title2: 'Front-End Developer',
    linkedIn: 'https://www.linkedin.com/in/dazyang',
  },
  {
    defaultImg: DrewDefault,
    hoverImg: DrewHover,
    backImg: DrewBack,
    name: 'Drew Hart',
    title: 'Development Lead',
    linkedIn: 'https://www.rightoneducation.com/images/drew-name.png',
  },
  {
    defaultImg: ImanDefault,
    hoverImg: ImanHover,
    backImg: ImanBack,
    name: 'Iman Brodsky',
    title: 'STEM Administrator',
    title2: 'Curriculum Specialist',
    linkedIn: 'https://www.linkedin.com/in/imanhoward/',
  },
  {
    defaultImg: KaterinaDefault,
    hoverImg: KaterinaHover,
    backImg: KaterinaBack,
    name: 'Katerina Schenke, PhD',
    title: 'Educator Researcher',
    title2: 'Learning Scientist',
    linkedIn: 'https://www.linkedin.com/in/katerina-schenke-phd-37b827b7/',
  },
  {
    defaultImg: MahalaDefault,
    hoverImg: MahalaHover,
    backImg: MahalaBack,
    name: 'Mahala Femovich',
    title: 'UX Intern',
    linkedIn: 'https://www.linkedin.com/in/mfemovich/',
  },
  {
    defaultImg: MarizzaDefault,
    hoverImg: MarizzaHover,
    backImg: MarizzaBack,
    name: 'Marizza Baily',
    title: 'Math Educator',
    title2: 'Content & Pedagogy',
    linkedIn: 'https://www.linkedin.com/in/l-marizza-bailey-5b981143/',
  },
  {
    defaultImg: MikeDefault,
    hoverImg: MikeHover,
    backImg: MikeBack,
    name: 'Michael Hunter',
    title: 'Development Intern',
    linkedIn: 'www.linkedin.com/in/michael-h-hunter',
  },
  {
    defaultImg: MozzieDefault,
    hoverImg: MozzieHover,
    backImg: MozzieBack,
    name: 'Mozzie Dosalmas, PhD',
    title: 'Math Educator',
    title2: 'Content & Pedagogy',
    linkedIn: 'https://www.linkedin.com/in/l-marizza-bailey-5b981143/',
  },
  {
    defaultImg: MuhammadDefault,
    hoverImg: MuhammadHover,
    backImg: MuhammadBack,
    name: 'Muhammad Quereshi',
    title: 'Development Intern',
    linkedIn: 'https://www.linkedin.com/in/muhammad-qureshi-22918218b/',
  },
  {
    defaultImg: RonaldDefault,
    hoverImg: RonaldHover,
    // No backImg provided
    name: 'Ronald Towns',
    title: 'STEM Administrator',
    title2: 'Math PD',
    linkedIn: 'https://www.rightoneducation.com/images/ronald-name.png',
  },
  {
    defaultImg: SinclairDefault,
    hoverImg: SinclairHover,
    backImg: SinclairBack,
    name: 'Sinclair Wu',
    title: 'Product Lead',
     linkedIn: 'https://www.linkedin.com/in/sinclairwu/',
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
           defaultImg,
           hoverImg,
           backImg,
           name, 
           title, 
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
               <Box
                  sx={{ 
                    width: '252px', 
                    height: '302px',
                    cursor: 'pointer',
                    position: 'relative',
                    '.default-img': { opacity: 1 },
                    '.hover-img': { opacity: 0},
                    '&:hover .default-img': { opacity: 0, transition: 'opacity 0.2s 0.1s', },
                    '&:hover .hover-img': { opacity: 1, transition: 'opacity 0.2s 0.1s', },
                  }}
                  className="team-img-container"
                >
                  {/* Default images */}
                  <img
                    src={defaultImg}
                    alt="headShot_img"
                    style={{
                      width: '252px',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 2,
                    
                    }}
                    className="default-img"
                  />
                  {/* Hover images */}
                  <img
                    src={hoverImg}
                    alt="hover_flap"
                    style={{
                      width: '252px',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 2,
                      transition: 'opacity 0.2s',
                    }}
                    className="hover-img"
                  />
                </Box>

              {/* member name & title(s) */}
              <StyledFlexBox
                width="252px"
                height="70px"
                gap={5}
              >
                {/* member img */}
              
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
              src={backImg}
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
        {teamArr.map(({ defaultImg, hoverImg, backImg, name, title, title2}, i) => (
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
              src={defaultImg}
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
              src={backImg}
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