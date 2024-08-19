import React, { useEffect, useRef } from 'react';
import { CircularProgress, Box, Typography, Grid } from '@mui/material';
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

const BodyContentAreaDoubleColumnStyled = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  maxWidth: `${theme.breakpoints.values.md}px`,
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
  overflow: 'auto',
}));

interface GameEndedHostBodyProps{
  selectedSuggestedGame: string | null;
  setSelectedSuggestedGame: (value: string) => void;
  teams: ITeam[];
  gameTemplates: IGameTemplate[];
  currentQuestionIndex: number;
  screenSize: ScreenSize;
  searchText: string;
  handleUpdateSearchText: (value: string) => void;
}

export default function GameEndedHostBody({ 
  teams, 
  setSelectedSuggestedGame, 
  selectedSuggestedGame, 
  gameTemplates, 
  currentQuestionIndex, 
  screenSize, 
  searchText,
  handleUpdateSearchText
}: GameEndedHostBodyProps ) {
    const theme = useTheme();
    const swiperRef = useRef<SwiperRef>(null);   
    switch(screenSize){
      case ScreenSize.SMALL:
        return (
          <BodyContentAreaSingleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
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
              ref={swiperRef}
              spaceBetween={`${theme.sizing.mdPadding}px`}
              style={{height: '100%', width: '100%', paddingLeft: `${theme.sizing.xLgPadding}px`, paddingRight: `${theme.sizing.xLgPadding}px`}}
            > 
              <SwiperSlide style={{width: '100%', height: '100%'}}>
                {teams.length === 0 ? <NoPlayersLobby /> : <CurrentStudents teams={teams} currentQuestionIndex={currentQuestionIndex} />}
              </SwiperSlide>
              <SwiperSlide style={{width: '100%', height: '100%'}}>
                <SuggestedGames gameTemplates={gameTemplates} teams={teams} selectedSuggestedGame={selectedSuggestedGame} setSelectedSuggestedGame={setSelectedSuggestedGame} searchText={searchText} handleUpdateSearchText={handleUpdateSearchText}/>
              </SwiperSlide>
            </Swiper>
          </BodyContentAreaSingleColumnStyled>
        );
      case ScreenSize.LARGE || ScreenSize.MEDIUM:
      default:
        return (
          <EndGameContentAreaDoubleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
                {teams.length === 0 || !teams ? <NoPlayersLobby /> : <CurrentStudents teams={teams} currentQuestionIndex={currentQuestionIndex} />}
            </Grid>
            <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
               <SuggestedGames gameTemplates={gameTemplates} teams={teams} selectedSuggestedGame={selectedSuggestedGame} setSelectedSuggestedGame={setSelectedSuggestedGame} searchText={searchText} handleUpdateSearchText={handleUpdateSearchText}/>
            </Grid>
          </EndGameContentAreaDoubleColumnStyled>
        );
    }
}