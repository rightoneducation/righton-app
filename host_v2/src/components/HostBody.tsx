import React, { useEffect, useRef } from 'react';
import { Box, Grid} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef} from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Pagination } from 'swiper/modules';
import { ITeam, IQuestion } from '@righton/networking';
import { ScreenSize } from '../lib/HostModels';
import CurrentStudents from './CurrentStudents';
import ResultsStudents from './ResultsStudents';
import NoPlayersLobby from './NoPlayersLobby';
import QuestionList from './LobbyQuestionSwipe';
import {
  StartGameContentAreaDoubleColumnStyled,
} from '../lib/styledcomponents/layout/StartGameContentAreasStyled';
import 'swiper/css';
import 'swiper/css/pagination';

 const BodyContentAreaDoubleColumnStyled = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  maxWidth: `200px`,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
  paddingTop: `${theme.sizing.mdPadding}px`,
}));

// content area of body that floats above background layers above - Single Column Page
const BodyContentAreaSingleColumnStyled = styled(
  BodyContentAreaDoubleColumnStyled,
)(({ theme }) => ({
  justifyContent: 'center',
  maxWidth: `${theme.breakpoints.values.md}px`,
  flexGrow: 1,
}));

interface HostBodyProps {
  teams: ITeam[],
  questions: IQuestion[],
  title: string,
  currentQuestionIndex: number,
  screenSize: ScreenSize,
  onSlideChange?: (index: number) => void,
  // StartGame (lobby) renders CurrentStudents; the results screens (Leaderboard,
  // InterimLeaderboard) opt into the forked ResultsStudents via isResults.
  isResults?: boolean,
  // seconds to hold ResultsStudents' card grow animation until the page's entrance animations
  // finish; forwarded to the students component. Only meaningful with isResults.
  entranceDelay?: number,
}

export default function HostBody({
  teams,
  questions,
  title,
  currentQuestionIndex,
  screenSize,
  onSlideChange,
  isResults = false,
  entranceDelay = 0,
}: HostBodyProps) {
  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>(null);
  const StudentsComponent = isResults ? ResultsStudents : CurrentStudents;
  // derive a 3-way layout size so mid screens (md–lg) get a real two-column layout with the
  // 32px medium padding (matching GameInProgress/PrepareGame) instead of the cramped large
  // padding. children keep the page-provided screenSize so their internal rendering is
  // unchanged.
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const layoutSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  switch(layoutSize){
    case ScreenSize.SMALL:
      return (
        <BodyContentAreaSingleColumnStyled>
          <Swiper
                modules={[Pagination]}
                slidesPerView='auto'
                pagination={{
                  el: '.swiper-pagination-container',
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  clickable: true,
                  renderBullet(index: number, className: string,) {
                    return `<span class="${className}" style="width:30px; height:10px; border-radius:8px" ></span>`;
                  },
                }}
                ref={swiperRef}
                onSlideChange={(swiper: SwiperClass) => onSlideChange?.(swiper.activeIndex)}
                spaceBetween={`${theme.sizing.xSmPadding}px`}
                style={{height: '100%', width: '100%',  paddingLeft: `${theme.sizing.mdPadding}px`, paddingRight: `${theme.sizing.mdPadding}px`}}
              > 
            <SwiperSlide style={{width: '100%', height: '100%'}}>
              {teams.length === 0 || !teams ? <NoPlayersLobby questionsCount={questions.length} screenSize={screenSize} /> : <StudentsComponent teams={teams} currentQuestionIndex={currentQuestionIndex} entranceDelay={entranceDelay}/>}
            </SwiperSlide>
            <SwiperSlide style={{width: '100%', height: '100%'  }}>
              <QuestionList questions={questions} title ={title}/> 
            </SwiperSlide>
          </Swiper>
        </BodyContentAreaSingleColumnStyled>
      );
    case ScreenSize.LARGE:
      default:
        return (
          <StartGameContentAreaDoubleColumnStyled container screenSize={layoutSize} style={{gap: '12px'}}>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
                {teams.length === 0 || !teams ? <NoPlayersLobby questionsCount={questions.length} screenSize={screenSize} /> : <StudentsComponent teams={teams} currentQuestionIndex={currentQuestionIndex} entranceDelay={entranceDelay} />}
            </Grid>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%'}}>
              <QuestionList questions={questions} title ={title}/> 
            </Grid>
          </StartGameContentAreaDoubleColumnStyled>
        );
  }
}
