import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import PaginationContainerStyled from '../../lib/styledcomponents/PaginationContainerStyled';
import HowToPlaySlide0Content from './howtoplayslides/HowToPlaySlide0Content';
import HowToPlaySlide1Content from './howtoplayslides/HowToPlaySlide1Content';
import HowToPlaySlide2Content from './howtoplayslides/HowToPlaySlide2Content';
import HowToPlaySlide3Content from './howtoplayslides/HowToPlaySlide3Content';
import HowToPlaySlide4Content from './howtoplayslides/HowToPlaySlide4Content';

import 'swiper/css';
import 'swiper/css/pagination';

const StackContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  maxWidth: theme.breakpoints.values.sm,
  paddingBottom: `${theme.sizing.largePadding}px`,
}));

const HowToPlaySwiper = styled(Swiper)({
  // styles for swiper and swiper slides
  width: '100%',
  '& .swiper-slide': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function JoinGame() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <BackgroundContainerStyled>
      <StackContainer>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            paddingTop: `${theme.sizing.mediumPadding}px`,
          }}
        >
          {t('joingame.howtoplay.title')}
        </Typography>
        <Box style={{ width: '100%' }}>
          <HowToPlaySwiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{
              el: '.swiper-pagination-container',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
              clickable: true,
              renderBullet(index, className) {
                return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
              },
            }}
          >
            <SwiperSlide>
              <HowToPlaySlide0Content />
            </SwiperSlide>
            <SwiperSlide>
              <HowToPlaySlide1Content />
            </SwiperSlide>
            <SwiperSlide>
              <HowToPlaySlide2Content />
            </SwiperSlide>
            <SwiperSlide>
              <HowToPlaySlide3Content />
            </SwiperSlide>
            <SwiperSlide>
              <HowToPlaySlide4Content />
            </SwiperSlide>
          </HowToPlaySwiper>
          <PaginationContainerStyled
            className="swiper-pagination-container"
            style={{ paddingTop: `${theme.sizing.largePadding}px` }}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: `${theme.palette.primary.main}`,
            fontWeight: 400,
            textAlign: 'center',
            paddingBottom: `${theme.sizing.mediumPadding}px`,
          }}
        >
          {t('joingame.howtoplay.description')}
        </Typography>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}