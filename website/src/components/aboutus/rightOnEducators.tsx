import React, { useRef } from 'react';
import {
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import { Swiper, SwiperSlide, useSwiper, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import { educatorData } from '../../lib/TeamData';
import linkedInIcon from '../../images/LinkedIn.svg';

import 'swiper/css';
import 'swiper/css/pagination';

interface IRightOnEducators {
  screenSize: ScreenSize;
}

export default function RightOnEducators({ screenSize }: IRightOnEducators) {
  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <Box
      width="100%"
      sx={{
        '& .swiper-pagination-bullet': {
          width: `${theme.sizing.xxSmPadding}px`,
          height: `${theme.sizing.xxSmPadding}px`,
          backgroundColor: '#afafaf',
        },
        '& .swiper-pagination-bullet-active': {
          backgroundColor: '#494949',
        },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {screenSize === ScreenSize.LARGE && (
        <Typography
          component={Button}
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          sx={{
            height: '110px',
            width: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#494949',
            color: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            left: -50,
            top: 300,
            zIndex: 10,
          }}
          fontSize="24px"
        >
          &lt;
        </Typography>
      )}

      <Swiper
        style={{
          paddingBottom: '48px',
          maxWidth: screenSize === ScreenSize.LARGE ? '1200px' : '100%',
          margin: '0 auto',
        }}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        ref={swiperRef}
        loop
        initialSlide={Math.floor(educatorData.length / 2) - 3}
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          700: {
            slidesPerView: 1.9,
            spaceBetween: 24,
            centeredSlides: true,
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            loopAddBlankSlides: false,
          },
        }}
      >
        {educatorData.map(
          ({ name, title, description, cardShade, gradient, img }, i) => (
            <SwiperSlide
              key={name}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* card base */}
              <StyledFlexBox
                width={screenSize === ScreenSize.LARGE ? '370px' : '100%'}
                height="690px"
                sx={{
                  background: cardShade,
                  borderRadius: '24px',
                  boxShadow: '10px 10px 10px rgba(0,0,0,.25)',
                }}
              >
                {/* Teacher image  */}
                <StyledFlexBox
                  align="center"
                  sx={{
                    paddingTop: '30px',
                    background: gradient,
                    borderRadius: '24px',
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    width="240px"
                    height="240px"
                    sx={{ borderRadius: '50%' }}
                  />
                </StyledFlexBox>

                {/* name, professional title & linkedin */}
                <StyledFlexBox
                  sx={{
                    padding: '18px 22px 0px 26px',
                    background: cardShade,
                    width: '100%',
                    borderRadius: '24px',
                  }}
                >
                  <StyledFlexBox
                    direction="row"
                    justify="space-between"
                    align="flex-start"
                    sx={{ width: '100%' }}
                  >
                    <StyledFlexBox direction="column" sx={{ width: '100%' }}>
                      <Typography
                        color="#fff"
                        fontFamily="Roboto"
                        fontSize="24px"
                        lineHeight={1.3}
                        fontWeight={600}
                      >
                        {name}
                      </Typography>
                      <Typography
                        color="#fff"
                        fontFamily="Roboto"
                        fontSize="20px"
                        lineHeight={1.3}
                        fontWeight={400}
                      >
                        {title}
                      </Typography>
                    </StyledFlexBox>
                    <Box component="img" src={linkedInIcon} alt="linkedIn" />
                  </StyledFlexBox>

                  {/* Educator description */}
                  <Divider
                    flexItem
                    sx={{
                      width: '100%',
                      background: '#fff',
                      marginBottom: '6px',
                    }}
                  />
                  <Typography
                    color="#fff"
                    fontFamily="Roboto"
                    fontSize="18px"
                    lineHeight="22px"
                    fontWeight={400}
                  >
                    {description}
                  </Typography>
                </StyledFlexBox>
              </StyledFlexBox>
            </SwiperSlide>
          ),
        )}
      </Swiper>
      {/* Right Arrow */}
      {screenSize === ScreenSize.LARGE && (
        <Typography
          component={Button}
          onClick={() => swiperRef.current?.swiper.slideNext()}
          sx={{
            height: '110px',
            width: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#494949',
            color: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            right: -50,
            top: 300,
            zIndex: 10,
          }}
          fontSize="24px"
        >
          &gt;
        </Typography>
      )}
      <Box
        className="swiper-pagination-container"
        display="flex"
        justifyContent="center"
        mt={2}
      />
    </Box>
  );
}
