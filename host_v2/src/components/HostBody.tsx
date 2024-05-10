// import React, { useEffect, useRef } from 'react';
// import { Box, Typography } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { Swiper, SwiperSlide, SwiperRef} from 'swiper/react';
// import { Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { ITeam } from '@righton/networking';
// // import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
// import CurrentStudents from './CurrentStudents';
// import NoPlayersLobby from './NoPlayersLobby';
// import QuestionList from './LobbyQuestionSwipe';
// // TEST
// const BodyStyled = styled(Box)({
//     margin: 'auto',
//     overflowY: 'scroll', // Enable vertical scrolling if needed
//     flexGrow: 1,
//     scrollbarWidth: 'none',
//     justifyContent: 'center',
// });


// export default function HostBody({ teams }: { teams: ITeam[] }) {
//     const swiperRef = useRef<SwiperRef>(null);
//     return (
//     <BodyStyled>
//       {/* <Swiper spaceBetween={4} slidesPerView="auto" style={{ height: 'auto' }}> */}
//       <Swiper
//             modules={[Pagination]}
//             // spaceBetween={4}
//             // centeredSlides
//             slidesPerView="auto"
//             pagination={{
//               el: '.swiper-pagination-container',
//               bulletClass: 'swiper-pagination-bullet',
//               bulletActiveClass: 'swiper-pagination-bullet-active',
//               clickable: true,
//               renderBullet(index: number, className: string,) {
//                 return `<span class="${className}" style="width:20px; height:6px; border-radius:2px" ></span>`;
//               },
//             }}
//             style={{display: 'flex', alignItems:'center', justifyContent: 'center', marginRight: '0px',boxSizing: 'border-box',}}
//             ref={swiperRef}
//           > 
//         <SwiperSlide style={{ height: '100%', marginRight: '0px', boxSizing: 'border-box',}}>
//           {/* <CurrentStudents teams={teams} /> */}
//           {teams.length === 0 ? <NoPlayersLobby /> : <CurrentStudents teams={teams} />}
//         </SwiperSlide>
//         <SwiperSlide>
//           <Typography style={{ marginTop: '48px' }}>
//             Page 2
//           </Typography>
//         </SwiperSlide>
//       </Swiper>
//     </BodyStyled>
//   );
// }
import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef} from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ITeam, IQuestion } from '@righton/networking';
import CurrentStudents from './CurrentStudents';
import NoPlayersLobby from './NoPlayersLobby';
import QuestionList from './LobbyQuestionSwipe'; // Import the QuestionList component

const BodyStyled = styled(Box)({
    // margin: 'auto',
    overflowY: 'scroll',
    flexGrow: 1,
    scrollbarWidth: 'none',
    justifyContent: 'center',
});

export default function HostBody({ teams, questions, title }: { teams: ITeam[], questions: IQuestion[], title: string}) {
    const swiperRef = useRef<SwiperRef>(null);
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
          {teams.length === 0 ? <NoPlayersLobby /> : <CurrentStudents teams={teams} />}
        </SwiperSlide>
        <SwiperSlide>
          <QuestionList questions={questions} title ={title}/> 
          {/* <Typography style={{ marginTop: '48px' }}>
             Page 2
           </Typography> */}
        </SwiperSlide>
      </Swiper>
    </BodyStyled>
  );
}
