import React, { useEffect, useRef } from 'react';
import { Box, Grid} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef} from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ITeam, IQuestion } from '@righton/networking';
import { ScreenSize } from '../lib/HostModels';
import CurrentStudents from './CurrentStudents';
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
  screenSize: ScreenSize
  handleDeleteTeam: (id: string) => void, 
}

export default function HostBody({ 
  teams, 
  questions, 
  title, 
  currentQuestionIndex, 
  screenSize,
  handleDeleteTeam, 
}: HostBodyProps) {
  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>(null);
  switch(screenSize){
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
                    return `<span class="${className}" style="width:20px; height:6px; border-radius:2px" ></span>`;
                  },
                }}
                ref={swiperRef}
                spaceBetween={`${theme.sizing.mdPadding}px`}
                style={{height: '100%', paddingLeft: `${theme.sizing.xLgPadding}px`, paddingRight: `${theme.sizing.xLgPadding}px`}}
              > 
            <SwiperSlide style={{width: '100%', height: '100%'}}>
              {teams.length === 0 || !teams ? <NoPlayersLobby /> : <CurrentStudents teams={teams} currentQuestionIndex={currentQuestionIndex} handleDeleteTeam={handleDeleteTeam}/>}
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
          <StartGameContentAreaDoubleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
                {teams.length === 0 || !teams ? <NoPlayersLobby /> : <CurrentStudents teams={teams} currentQuestionIndex={currentQuestionIndex} handleDeleteTeam={handleDeleteTeam}/>}
            </Grid>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%'}}>
              <QuestionList questions={questions} title ={title}/> 
            </Grid>
          </StartGameContentAreaDoubleColumnStyled>
        );
  }
}
