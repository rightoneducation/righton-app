import React, { useRef } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import { teamArr } from '../../lib/TeamData';
import LinkedInIcon from '../../images/LinkedIn.svg'

import 'swiper/css';
import 'swiper/css/pagination';
import FlipCard from './FlipCard';


interface IRightOnTeam {
  screenSize: ScreenSize;
}

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
        spacing={theme.sizing.xxSmPadding}
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
              
                <StyledFlexBox direction="row" align="flex-end" justify="center" gap={theme.sizing.xSmPadding}>
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
      width: `${theme.sizing.xxSmPadding}px`,
      height: `${theme.sizing.xxSmPadding}px`,
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
        spaceBetween={theme.sizing.mdPadding}
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