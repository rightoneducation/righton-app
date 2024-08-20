import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useAnimate, motion } from 'framer-motion';
import { Grid } from '@mui/material';
import { IGameSession, IQuestion, IHostTeamAnswers, GameSessionState, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IHostTeamAnswersHint, IPhase, IHostTeamAnswersPerPhase } from '@righton/networking';
import { IGraphClickInfo, Mistake, featuredMistakesSelectionValue, ScreenSize } from '../../lib/HostModels';
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import GameInProgressContentLeftColumn from './columns/GameInProgressContentLeftColumn';
import GameInProgressContentMidColumn from './columns/GameInProgressContentMidColumn';
import GameInProgressContentRightColumn from './columns/GameInProgressContentRightColumn';
import 'swiper/css';
import 'swiper/css/pagination';


interface GameInProgressContentProps {
  localGameSession: IGameSession;
  hostTeamAnswers: IHostTeamAnswers;
  screenSize: ScreenSize;
  currentQuestion: IQuestion;
  currentPhase: IPhase;
  currentPhaseTeamAnswers: IHostTeamAnswersPerPhase | null;
  scope?: React.RefObject<HTMLDivElement>;
}

export default function GameInProgressContent({
  localGameSession,
  hostTeamAnswers,
  screenSize,
  currentQuestion,
  currentPhase,
  currentPhaseTeamAnswers,
  scope,
}: GameInProgressContentProps) {
  const theme = useTheme();
  // currentResponses are used for the Real Time Responses Victory Graph
  const currentResponses = currentPhaseTeamAnswers?.responses ?? [] as IHostTeamAnswersResponse[];
  // currentConfidences are used for the Confidence Meter Victory Graph
  const currentConfidences = currentPhaseTeamAnswers?.confidences ?? [] as IHostTeamAnswersConfidence[];
  // currentHints are used for the Hints Progress Bar (Pre-GPT)
  const currentHints = currentPhaseTeamAnswers?.hints ?? [] as IHostTeamAnswersHint[];
  let prevPhaseResponses = [] as IHostTeamAnswersResponse[];
  let prevPhaseConfidences = [] as IHostTeamAnswersConfidence[];
  if (localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS || localGameSession.currentState === GameSessionState.PHASE_2_START) {
    prevPhaseResponses= hostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.phase1.responses ?? [] as IHostTeamAnswersResponse[];
    prevPhaseConfidences = hostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.phase1.confidences ?? [] as IHostTeamAnswersConfidence[];
  }
  let sortedMistakes: any = [];
  // in shortAnswerMode
  if (localGameSession.questions[localGameSession.currentQuestionIndex].isShortAnswerEnabled) {
    const responses = hostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.[currentPhase].responses ?? [];
    const totalAnswers = responses.reduce((acc, response) => acc + response.count, 0) ?? 0;
    const mistakes = responses.map((response) => !response.isCorrect && response.multiChoiceCharacter !== '–' ? {
      answer: response.rawAnswer,
      percent: (response.count/totalAnswers)*100,
      isSelected: false
    } : null).filter((mistake) => mistake !== null
  );
    sortedMistakes = mistakes.sort((a: any, b: any) => b.percent - a.percent);
  }
  // these booleans turn on and off the respective feature cards in the render function below
  const {isConfidenceEnabled, isHintEnabled, isShortAnswerEnabled} = currentQuestion;

  const [graphClickInfo, setGraphClickInfo] = React.useState<IGraphClickInfo>({graph: null, selectedIndex: null});
  const handleGraphClick = ({ graph, selectedIndex }: IGraphClickInfo) => {
    setGraphClickInfo({graph, selectedIndex })
  }
  
  const rightCardsColumn = (
    <GameInProgressContentRightColumn 
      currentQuestion={currentQuestion}
      localGameSession={localGameSession}
    />
  );


  const midCardsColumn = (
    <GameInProgressContentMidColumn
      currentQuestion={currentQuestion}
      responses={currentResponses}
      featuredMistakesSelectionValue={featuredMistakesSelectionValue}
      isShortAnswerEnabled={isShortAnswerEnabled}
      isConfidenceEnabled={isConfidenceEnabled}
      isHintEnabled={isHintEnabled}
      currentHints={currentHints}
      confidences={currentConfidences}
      numPlayers={localGameSession.teams.length}
      graphClickInfo={graphClickInfo}
      handleGraphClick={handleGraphClick}
      currentPhase={currentPhase}
    />
  );
  
  const leftCardsColumn = (
    <GameInProgressContentLeftColumn 
      currentQuestion={currentQuestion}
      currentPhase={currentPhase}
      responses={currentPhase === IPhase.ONE ? currentResponses : prevPhaseResponses}
      confidences={currentPhase === IPhase.ONE ? currentConfidences : prevPhaseConfidences}
      graphClickInfo={graphClickInfo}
      isConfidenceEnabled={isConfidenceEnabled}
      isShortAnswerEnabled={isShortAnswerEnabled}
      screenSize={screenSize}
      featuredMistakesSelectionValue={featuredMistakesSelectionValue}
      handleGraphClick={handleGraphClick}
    />
  );
  
  const needAnimate = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER && localGameSession.currentQuestionIndex !== 0;
  switch(screenSize) {
    case (ScreenSize.SMALL):
      return (
        <BodyContentAreaSingleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
          <motion.div
          ref={scope}
          initial={{ x: needAnimate ? '100vw' : '0%',}}
          animate={{x: 0}}
          transition={needAnimate ? { duration: 1, ease: 'easeIn' } : undefined}
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
            slidesPerView='auto'
            spaceBetween={`${theme.sizing.mdPadding}px`}
            style={{height: '100%', width: '100%',  paddingLeft: `${theme.sizing.xLgPadding}px`, paddingRight: `${theme.sizing.xLgPadding}px`}}
          >
            <SwiperSlide>
              {leftCardsColumn}
            </SwiperSlide>
            <SwiperSlide>
              {rightCardsColumn}
            </SwiperSlide>
            {(isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) &&
              <SwiperSlide>
                {midCardsColumn}
              </SwiperSlide>
            }
          </Swiper>
          </motion.div>
        </BodyContentAreaSingleColumnStyled>
      );
    case (ScreenSize.MEDIUM):
      return (
        <motion.div
          ref={scope}
          initial={{ x: needAnimate ? '100vw' : '0%',}}
          animate={{x: 0}}
          transition={needAnimate ? { duration: 1, ease: 'easeIn' } : undefined}
          style={{ width: '100%', height: '100%', position: 'absolute', top: '0' }}
        >
          <BodyContentAreaDoubleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
            {isShortAnswerEnabled ? (
              <Swiper
                modules={[Pagination]}
                pagination={{
                  el: '.swiper-pagination-container',
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  clickable: true,
                  renderBullet(index: number, className: string) {
                    return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
                  },
                }}
                slidesPerView={
                  (isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) ?
                    2.1
                    : 
                    2.0
                }
                spaceBetween={`${theme.sizing.mdPadding}px`}
                style={{height: '100%', width: '100%'}}
              >
                <SwiperSlide>
                  {leftCardsColumn}
                </SwiperSlide>
                {(isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) &&
                  <SwiperSlide>
                    {midCardsColumn}
                  </SwiperSlide>
                }
                <SwiperSlide>
                  {midCardsColumn}
                </SwiperSlide>
              </Swiper>
            ) : (
              <>
                {leftCardsColumn}
                {rightCardsColumn}
              </>
            )}
            </BodyContentAreaDoubleColumnStyled>
          </motion.div>
      );
    case (ScreenSize.LARGE):
    default:
      return (
        <motion.div
          ref={scope}
          initial={{ x: needAnimate ? '100vw' : '0%',}}
          animate={{x: 0}}
          transition={needAnimate ? { duration: 1, ease: 'easeIn' } : undefined}
          exit={{ x: 0, y: 0,  }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: '0', display: 'flex', justifyContent: 'center'  }}
        >
          <BodyContentAreaTripleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
            {leftCardsColumn}
            {rightCardsColumn}
            { (isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) &&
              midCardsColumn
            }
            {rightCardsColumn}
          </BodyContentAreaTripleColumnStyled>
        </motion.div>
      );
  }
}