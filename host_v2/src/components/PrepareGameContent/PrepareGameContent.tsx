import React from 'react';
import { Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {motion} from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { IGameSession, IQuestion, IHostTeamAnswers, GameSessionState, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IHostTeamAnswersHint, IPhase, IHostTeamAnswersPerPhase } from '@righton/networking';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import { IGraphClickInfo, Mistake, featuredMistakesSelectionValue, ScreenSize } from '../../lib/HostModels';
import {
  BodyContentAreaSingleColumnStyled,
  BodyContentAreaDoubleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import EnableShortAnswerCard from './EnableShortAnswerCard';
import EnableConfidenceCard from './EnableConfidenceCard';
import EnableHintsCard from './EnableHintsCard';
import GameInProgressContentRightColumn from '../GameInProgressContent/columns/GameInProgressContentRightColumn';
import 'swiper/css';
import 'swiper/css/pagination';

interface PrepareGameContentProps {
  localGameSession: IGameSession;
  screenSize: ScreenSize;
  currentQuestion: IQuestion;
  isShortAnswerEnabled: boolean;
  setIsShortAnswerEnabled: (value: boolean) => void;
  isConfidenceEnabled: boolean;
  setIsConfidenceEnabled: (value: boolean) => void;
  isHintEnabled: boolean;
  setIsHintEnabled: (value: boolean) => void;
}

export default function PrepareGameContent({
  localGameSession,
  screenSize,
  currentQuestion,
  isShortAnswerEnabled,
  setIsShortAnswerEnabled,
  isConfidenceEnabled,
  setIsConfidenceEnabled,
  isHintEnabled,
  setIsHintEnabled,
}: PrepareGameContentProps) {
  const theme = useTheme();
  console.log(currentQuestion);
  const leftCardsColumn = (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%', paddingLeft: `${theme.sizing.mdPadding}px` }}>
      <ScrollBoxStyled>
        <EnableShortAnswerCard
          isShortAnswerEnabled={isShortAnswerEnabled}
          setIsShortAnswerEnabled={setIsShortAnswerEnabled}
        />
        <EnableConfidenceCard
          isConfidenceEnabled={isConfidenceEnabled}
          setIsConfidenceEnabled={setIsConfidenceEnabled}
        />
        <EnableHintsCard
          isHintEnabled={isHintEnabled}
          setIsHintEnabled={setIsHintEnabled}
        />
      </ScrollBoxStyled>
    </Grid>
  );

  const rightCardsColumn = (
    <GameInProgressContentRightColumn 
      currentQuestion={currentQuestion}
      localGameSession={localGameSession}
    />
  );
  
  switch(screenSize) {
    case (ScreenSize.SMALL):
      return (
        <BodyContentAreaSingleColumnStyled>
          <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
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
              {leftCardsColumn}
            </SwiperSlide>
            <SwiperSlide>
              {rightCardsColumn}
            </SwiperSlide>
          </Swiper>
          </motion.div>
        </BodyContentAreaSingleColumnStyled>
      );
    case (ScreenSize.MEDIUM):
    case (ScreenSize.LARGE):
    default:
      return (
        <PrepGameLargeBox>
          <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Grid container style={{width: '100%', maxWidth: `${theme.breakpoints.values.lg}px`}}>
              {leftCardsColumn}
              {rightCardsColumn}
            </Grid>
          </motion.div>
        </PrepGameLargeBox>
      );
  }
}
