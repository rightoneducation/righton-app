import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled
} from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import 'swiper/css';
import 'swiper/css/pagination';
import ScrollBoxStyled from '../lib/styledcomponents/layout/ScrollBoxStyled';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import PopularMistakeCard from './PopularMistakeCard';


// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption {
  instructions: string[] | null;
  reason: string | null;
  content: string;
}

interface QuestionData {
  text: string;
  imageUrl: string | undefined;
}

interface PlaceholderContentAreaProps { questionData: QuestionData, answerOptions: AnswerOption[] } // eslint-disable-line

export default function PlaceholderContentArea({ questionData, answerOptions }: PlaceholderContentAreaProps) {
  // eslint-disable-line

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const largeScreen =
    <BodyContentAreaTripleColumnStyled container>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <Card />
          <Card />
        </ScrollBoxStyled>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <Card />
          <PopularMistakeCard />
        </ScrollBoxStyled>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <Card />
          <Card />
        </ScrollBoxStyled>
      </Grid>
    </BodyContentAreaTripleColumnStyled>

  const mediumScreen =
    <BodyContentAreaDoubleColumnStyled>
      <Swiper
        modules={[Pagination]}
        pagination={{
          el: '.swiper-pagination-container',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          clickable: true,
          renderBullet(index: number, className: string) {
            return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
          },
        }}
        slidesPerView={2.1}
      >
        <SwiperSlide >
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide >
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <PopularMistakeCard />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide >
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaDoubleColumnStyled>

  const smallScreen =
    <BodyContentAreaSingleColumnStyled>
      <Swiper
        modules={[Pagination]}
        pagination={{
          el: '.swiper-pagination-container',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          clickable: true,
          renderBullet(index: number, className: string) {
            return `<span class="${className}" style="width:20px; height:6px; border-radius:0;"></span>`;
          },
        }}
        slidesPerView={1.1}
      >
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <PopularMistakeCard />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaSingleColumnStyled>

  if (isLargeScreen) {
    return (
      largeScreen
    );
  } if (isMediumScreen) {
    return (
      <>
        {mediumScreen}
        <PaginationContainerStyled
          className="swiper-pagination-container"
          style={{ paddingTop: `${theme.sizing.largePadding}px`, zIndex: 2 }}
        />
      </>
    );
  }
  return (
    <>
      {smallScreen}
      <PaginationContainerStyled
        className="swiper-pagination-container"
        style={{ paddingTop: `${theme.sizing.largePadding}px`, zIndex: 2 }}
      />
    </>
  );

}
