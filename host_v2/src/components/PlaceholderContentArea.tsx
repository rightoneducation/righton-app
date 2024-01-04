import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Pagination from 'swiper';
import { useSpring, animated } from 'react-spring';
import { Swiper, SwiperSlide } from "swiper/react";
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled
} from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import 'swiper/css';
import 'swiper/css/pagination';
import ScrollBoxStyled from '../lib/styledcomponents/layout/ScrollBoxStyled';


interface PlaceholderContentAreaProps { } // eslint-disable-line

export default function PlaceholderContentArea({ }: PlaceholderContentAreaProps) {
  // eslint-disable-line
  // TODO: pass screen size in from parent components later but for now do it this way
  // this is only an initial check, wondering if we should use a listener in case the 
  // screen size changes on desktop or if this suffices (with no listener and only an initial check)
  const theme = useTheme();

  const mediaQuerySmall = window.matchMedia(`(max-width: ${theme.breakpoints.values.sm}px)`);
  const isSmallScreen = mediaQuerySmall.matches;

  const mediaQueryMedium = window.matchMedia(`(min-width:${theme.breakpoints.values.sm}px), max-width: ${theme.breakpoints.values.lg}px)`);
  const isMediumScreen = mediaQueryMedium.matches;

  const mediaQueryLarge = window.matchMedia(`(min-width: ${theme.breakpoints.values.lg}px)`);
  const isLargeScreen = mediaQueryLarge.matches;

  // TODO: 
  //      -enable scroll 
  const largeScreen =
    <BodyContentAreaTripleColumnStyled container style={{ paddingTop: '16px' }}>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <Card />
        <Card />
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <Card />
        <Card />
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <Card />
        <Card />
      </Grid>
    </BodyContentAreaTripleColumnStyled>

  // TODO: 
  //      -add edge of next slide to the right
  //      -resolve new keyword issue, preventing addition of bullets, pagination
  //      -enable scroll
  const mediumScreen =
    <BodyContentAreaDoubleColumnStyled>
      <Swiper slidesPerView={2}>
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaDoubleColumnStyled>

  // TODO: 
  //      -add edge of next slide to the right
  //      -resolve new keyword issue, preventing addition of bullets, pagination
  const smallScreen = <BodyContentAreaSingleColumnStyled>
    <Swiper spaceBetween={10}>
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
            <Card />
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
      </SwiperSlide></Swiper>
  </BodyContentAreaSingleColumnStyled>

  if (isLargeScreen) {
    return (
      largeScreen
    );
  } if (isMediumScreen) {
    return (
      mediumScreen
    );
  }
  return smallScreen;

}
