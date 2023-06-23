import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import PaginationContainerStyled from '../../lib/styledcomponents/PaginationContainerStyled';
import HowToPlaySlide0Content from './howtoplayslides/HowToPlaySlide0Content';
import HowToPlaySlide1Content from './howtoplayslides/HowToPlaySlide1Content';
import HowToPlaySlide2Content from './howtoplayslides/HowToPlaySlide2Content';
import HowToPlaySlide3Content from './howtoplayslides/HowToPlaySlide3Content';
import HowToPlaySlide4Content from './howtoplayslides/HowToPlaySlide4Content';
import { LobbyMode } from '../../lib/PlayModels';

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

const BottomText = (mode: LobbyMode) => {
  const { t } = useTranslation();
  if (mode === LobbyMode.LOADING) return t('howtoplay.loading');
  if (mode === LobbyMode.ERROR) return '';
  return t('howtoplay.description');
};

interface HowToPlayProps {
  mode: LobbyMode;
}

export default function HowToPlay({ mode }: HowToPlayProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const slideArray = [
    <HowToPlaySlide0Content />,
    <HowToPlaySlide1Content />,
    <HowToPlaySlide2Content />,
    <HowToPlaySlide3Content />,
    <HowToPlaySlide4Content />
  ];

  return (
    <>
      <Typography
        data-testid="lobby-howtoplay" 
        variant="h2"
        sx={{
          textAlign: 'center',
          paddingTop: `${theme.sizing.mediumPadding}px`,
        }}
      >
        {t('howtoplay.title')}
      </Typography>
      <StackContainer
        style={{ position: 'absolute', justifyContent: 'center' }}
      >
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
          {slideArray.map((slide) => (
            <SwiperSlide key={uuidv4()}>
              {slide}
            </SwiperSlide>
          ))}
        </HowToPlaySwiper>
        <PaginationContainerStyled
          className="swiper-pagination-container"
          style={{ paddingTop: `${theme.sizing.largePadding}px` }}
        />
      </StackContainer>
      <Typography
        data-testid="lobby-howtoplay-statustext" 
        variant="h4"
        sx={{
          position: 'absolute',
          bottom: 0,
          color: `${theme.palette.primary.main}`,
          fontWeight: 400,
          textAlign: 'center',
          paddingBottom: `${theme.sizing.mediumPadding}px`,
        }}
      >
        {BottomText(mode)}
      </Typography>
    </>
  );
}
