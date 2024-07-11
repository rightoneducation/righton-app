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

const BodyStyled = styled(Box)({
    overflowY: 'scroll',
    flexGrow: 1,
    scrollbarWidth: 'none',
    justifyContent: 'center',
});

export default function HostBody({ teams, questions, title, handleDeleteTeam, screenSize }: 
  { teams: ITeam[], questions: IQuestion[], title: string, handleDeleteTeam: (id: string) => void, screenSize: ScreenSize}) {
  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>(null);
  switch(screenSize){
    case ScreenSize.SMALL:
      return (
        <BodyStyled>
          <Swiper
                modules={[Pagination]}
                slidesPerView="auto"
                pagination={{
                  el: '.swiper-pagination-container',
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  clickable: true,
                  renderBullet(index: number, className: string,) {
                    return `<span class="${className}" style="width:20px; height:6px; border-radius:2px" ></span>`;
                  },
                }}
                style={{display: 'flex', alignItems:'center', justifyContent: 'center', marginRight: '0px',boxSizing: 'border-box',}}
                ref={swiperRef}
              > 
            <SwiperSlide style={{ height: '100%', marginRight: '0px', boxSizing: 'border-box',}}>
              {teams.length === 0 ? <NoPlayersLobby /> : <CurrentStudents teams={teams} handleDeleteTeam={handleDeleteTeam}/>}
            </SwiperSlide>
            <SwiperSlide>
              <QuestionList questions={questions} title ={title}/> 
            </SwiperSlide>
          </Swiper>
        </BodyStyled>
      );
    case ScreenSize.LARGE:
      default:
        return (
          <StartGameContentAreaDoubleColumnStyled container>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%', paddingLeft: `${theme.sizing.mdPadding}px` }}>
              {teams.length === 0 ? <NoPlayersLobby /> : <CurrentStudents teams={teams} handleDeleteTeam={handleDeleteTeam}/>}
            </Grid>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%', paddingLeft: `${theme.sizing.mdPadding}px` }}>
              <QuestionList questions={questions} title ={title}/> 
            </Grid>
          </StartGameContentAreaDoubleColumnStyled>
        );
  }
}
