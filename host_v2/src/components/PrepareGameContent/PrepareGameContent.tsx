import React from 'react';
import { Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {motion} from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { IGameSession, IQuestion, IPhase, ITeam } from '@righton/networking';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import { ScreenSize } from '../../lib/HostModels';
import {
  BodyContentAreaSingleColumnStyled,
  BodyContentAreaDoubleColumnStyledNoSwiper,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import PrepareGameOptionsCard from './PrepareGameOptionsCard';
import CurrentStudentsCard from '../CurrentStudentsCard';
import GameInProgressContentRightColumn from '../GameInProgressContent/columns/GameInProgressContentLeftColumn';
import 'swiper/css';
import 'swiper/css/pagination';

interface PrepareGameContentProps {
  localGameSession: IGameSession;
  screenSize: ScreenSize;
  currentQuestion: IQuestion;
  isGameSettingMultiChoice: boolean;
  teams: ITeam[];
  questions:IQuestion[];
  currentQuestionIndex: number;
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
  isGameSettingMultiChoice,
  teams,
  questions,
  currentQuestionIndex,
  isShortAnswerEnabled,
  setIsShortAnswerEnabled,
  isConfidenceEnabled,
  setIsConfidenceEnabled,
  isHintEnabled,
  setIsHintEnabled,
}: PrepareGameContentProps) {
  const theme = useTheme();
  const leftCardsColumn = (
    <Grid item xs={12} sm sx={{ width: '100%', height: '100%' }}>
      <ScrollBoxStyled style={{gap: `${theme.sizing.mdPadding}px`}}>
        <PrepareGameOptionsCard
          isGameSettingMultiChoice={isGameSettingMultiChoice}
          isShortAnswerEnabled={isShortAnswerEnabled}
          setIsShortAnswerEnabled={setIsShortAnswerEnabled}
          isConfidenceEnabled={isConfidenceEnabled}
          setIsConfidenceEnabled={setIsConfidenceEnabled}
          isHintEnabled={isHintEnabled}
          setIsHintEnabled={setIsHintEnabled}
        />
        <CurrentStudentsCard teams={teams} currentQuestionIndex={currentQuestionIndex} gameCode={localGameSession.gameCode} questionsCount={questions.length} screenSize={screenSize} />
      </ScrollBoxStyled>
    </Grid>
  );
  const rightCardsColumn = (
    <GameInProgressContentRightColumn 
      currentQuestion={currentQuestion}
      localGameSession={localGameSession}
      currentPhase={IPhase.ONE}
    />
  );
  
  switch(screenSize) {
    case (ScreenSize.SMALL):
      return (
        <BodyContentAreaSingleColumnStyled container screenSize={screenSize} gap={`${theme.sizing.mdPadding}px`}>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center'  }}
        >
          <Swiper
            modules={[Pagination]}
            pagination={{
              el: '.swiper-pagination-container',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
              clickable: true,
              renderBullet(index: number, className: string) {
                return `<span class="${className}" style="width:30px; height:10px; border-radius:8px"></span>`;
              },
            }}
            slidesPerView='auto'
            spaceBetween="12px"
            style={{height: '100%', width: '100%',  paddingLeft: `${theme.sizing.mdPadding}px`, paddingRight: `${theme.sizing.mdPadding}px`}}
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
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: '0', display: 'flex', justifyContent: 'center'  }}
          >
            <BodyContentAreaDoubleColumnStyledNoSwiper container gap={`${theme.sizing.mdPadding}px`} screenSize={screenSize}>
              {leftCardsColumn}
              {rightCardsColumn}
              </BodyContentAreaDoubleColumnStyledNoSwiper>
          </motion.div>
      );
  }
}
