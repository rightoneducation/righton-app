import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef} from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ITeam } from '@righton/networking';
// import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import SuggestedGames from './SuggestedGames';
import NoPlayersLobby from './NoPlayersLobby';
// TEST
interface TestTeamProp{
  name: string
}
const BodyStyled = styled(Box)({
    // margin: 'auto',
    paddingLeft: '28px',
    paddingRight: '32px',
    overflowY: 'scroll', // Enable vertical scrolling if needed
    flexGrow: 1,
    scrollbarWidth: 'none',
    justifyContent: 'center',
});

interface GameEndedHostBodyProps{
  setIsGameSelected: (value: boolean) => void; 
  teams: TestTeamProp[]
  isGameSelected: boolean
}

export default function GameEndedHostBody({ teams, setIsGameSelected, isGameSelected }: GameEndedHostBodyProps ) {
    const swiperRef = useRef<SwiperRef>(null);
    console.log(isGameSelected)
    return (
    <BodyStyled>
      {/* <Swiper spaceBetween={4} slidesPerView="auto" style={{ height: 'auto' }}> */}
      <Swiper
            modules={[Pagination]}
            // spaceBetween={4}
            // centeredSlides
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
        <SwiperSlide style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginRight: '0px', boxSizing: 'border-box',
        
}}>
          {/* <CurrentStudents teams={teams} /> */}
          {teams.length === 0 ? <NoPlayersLobby /> : <SuggestedGames teams={teams} isGameSelected = {isGameSelected} setIsGameSelected={setIsGameSelected}/>}
        </SwiperSlide>
        <SwiperSlide>
          <Typography style={{ marginTop: '48px' }}>
            Page 2
          </Typography>
        </SwiperSlide>
      </Swiper>
    </BodyStyled>
  );
}
// width: Fill (316px)px;
// height: Hug (1,108px)px;
// padding: 16px 12px 16px 12px;
// gap: 12px;
// opacity: 0px;
