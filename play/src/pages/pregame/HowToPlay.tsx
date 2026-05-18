import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Typography, useMediaQuery } from '@mui/material';
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
import { ScreenSize } from '../../lib/PlayModels';

import 'swiper/css';
import 'swiper/css/pagination';

// design spec (Figma): non-systematic gaps
const TITLE_TO_IMAGE = '82px';
const DESCRIPTION_TO_BULLETS = '40px';

const PageColumn = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const CenteredGroup = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: theme.breakpoints.values.md,
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const HowToPlaySwiper = styled(Swiper)({
  width: '100%',
  '& .swiper-slide': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function HowToPlay() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  let screenSize = ScreenSize.MEDIUM;
  if (isLargeScreen) screenSize = ScreenSize.LARGE;
  else if (isSmallScreen) screenSize = ScreenSize.SMALL;

  const slideArray = [
    <HowToPlaySlide0Content />,
    <HowToPlaySlide1Content />,
    <HowToPlaySlide2Content />,
    <HowToPlaySlide3Content />,
    <HowToPlaySlide4Content />,
  ];

  const title = (
    <Typography
      data-testid="lobby-howtoplay"
      variant="h0"
      sx={{
        textAlign: 'center',
        ...(screenSize === ScreenSize.LARGE
          ? { paddingTop: '30px' }
          : { marginBottom: TITLE_TO_IMAGE }),
      }}
    >
      {t('howtoplay.title')}
    </Typography>
  );

  return (
    <PageColumn>
      {screenSize === ScreenSize.LARGE && title}
      <CenteredGroup>
        {screenSize !== ScreenSize.LARGE && title}
        <HowToPlaySwiper
          modules={[Pagination]}
          slidesPerView={1}
          speed={500}
          grabCursor
          longSwipesMs={100}
          longSwipesRatio={0.1}
          pagination={{
            el: '.swiper-pagination-container',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            clickable: true,
            renderBullet(index, className) {
              return `<span class="${className}" style="display:inline-block; width:30px; height:10px; border-radius:8px"></span>`;
            },
          }}
        >
          {slideArray.map((slide) => (
            <SwiperSlide key={uuidv4()}>{slide}</SwiperSlide>
          ))}
        </HowToPlaySwiper>
        <PaginationContainerStyled
          className="swiper-pagination-container"
          style={{ paddingTop: DESCRIPTION_TO_BULLETS }}
        />
      </CenteredGroup>
    </PageColumn>
  );
}
