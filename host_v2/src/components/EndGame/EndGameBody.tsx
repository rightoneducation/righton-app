import React, { useEffect, useRef } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef} from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { IGameTemplate, ITeam } from '@righton/networking';
import { ScreenSize } from '../../lib/HostModels';
import CurrentStudents from '../CurrentStudents';
import SuggestedGames from './EndGameSuggestedGames';
import NoPlayersLobby from '../NoPlayersLobby';
import { EndGameContentAreaDoubleColumnStyled } from '../../lib/styledcomponents/layout/EndGameContentAreasStyled';
import 'swiper/css';
import 'swiper/css/pagination';

const BodyStyled = styled(Box)({
    paddingLeft: '28px',
    paddingRight: '32px',
    overflowY: 'scroll', // Enable vertical scrolling if needed
    flexGrow: 1,
    scrollbarWidth: 'none',
    justifyContent: 'center',
});

interface GameEndedHostBodyProps{
  selectedSuggestedGame: number | null;
  setSelectedSuggestedGame: (value: number) => void;
  teams: ITeam[];
  gameTemplates: IGameTemplate[] | null;
  currentQuestionIndex: number;
  screenSize: ScreenSize;
  handleDeleteTeam: (id: string) => void;
}

export default function GameEndedHostBody({ teams, setSelectedSuggestedGame, selectedSuggestedGame, gameTemplates, currentQuestionIndex, screenSize, handleDeleteTeam }: GameEndedHostBodyProps ) {
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
              <SwiperSlide style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginRight: '0px', boxSizing: 'border-box'}}>
                {teams.length === 0 ? <NoPlayersLobby /> : <CurrentStudents teams={teams} currentQuestionIndex={currentQuestionIndex} handleDeleteTeam={handleDeleteTeam}/>}
              </SwiperSlide>
              <SwiperSlide>
                <SuggestedGames gameTemplates = {gameTemplates} teams={teams} selectedSuggestedGame={selectedSuggestedGame} setSelectedSuggestedGame={setSelectedSuggestedGame}/>
              </SwiperSlide>
            </Swiper>
          </BodyStyled>
        );
      case ScreenSize.LARGE || ScreenSize.MEDIUM:
      default:
        return (
          <EndGameContentAreaDoubleColumnStyled container>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%', paddingLeft: `${theme.sizing.mdPadding}px` }}>
                {teams.length === 0 || !teams ? <NoPlayersLobby /> : <CurrentStudents teams={teams} currentQuestionIndex={currentQuestionIndex} handleDeleteTeam={handleDeleteTeam}/>}
            </Grid>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%', paddingLeft: `${theme.sizing.mdPadding}px` }}>
              <SuggestedGames gameTemplates = {gameTemplates} teams={teams} selectedSuggestedGame={selectedSuggestedGame} setSelectedSuggestedGame={setSelectedSuggestedGame}/>
            </Grid>
          </EndGameContentAreaDoubleColumnStyled>
        );
    }
}