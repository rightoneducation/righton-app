import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useAnimate, motion } from 'framer-motion';
import { IGameSession, IQuestion, IHostTeamAnswers, GameSessionState, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IHostTeamAnswersHint, IPhase, IHostTeamAnswersPerPhase } from '@righton/networking';
import { IGraphClickInfo, Mistake, featuredMistakesSelectionValue, ScreenSize } from '../../lib/HostModels';
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaDoubleColumnStyledNoSwiper,
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
  isAnimating: boolean;
  graphClickInfo: IGraphClickInfo;
  setGraphClickInfo: (graphClickInfo: IGraphClickInfo) => void;
}

export default function GameInProgressContent({
  localGameSession,
  hostTeamAnswers,
  screenSize,
  currentQuestion,
  currentPhase,
  currentPhaseTeamAnswers,
  scope,
  isAnimating,
  graphClickInfo,
  setGraphClickInfo,
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


  const [isPopularMode, setIsPopularMode] = React.useState<boolean>(true);
  const handleGraphClick = ({ graph, selectedIndex }: IGraphClickInfo) => {
    setGraphClickInfo({graph, selectedIndex })
  }

  
  const leftCardsColumn = (
    <GameInProgressContentLeftColumn 
      currentQuestion={currentQuestion}
      localGameSession={localGameSession}
      isShortAnswerEnabled={isShortAnswerEnabled}
      currentPhase={currentPhase}
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
      setGraphClickInfo={setGraphClickInfo}
      currentPhase={currentPhase}
    />
  );
  
  const rightCardsColumn = (
    <GameInProgressContentRightColumn 
      currentQuestion={currentQuestion}
      currentPhase={currentPhase}
      responses={currentPhase === IPhase.ONE ? currentResponses : prevPhaseResponses}
      confidences={currentPhase === IPhase.ONE ? currentConfidences : prevPhaseConfidences}
      graphClickInfo={graphClickInfo}
      isConfidenceEnabled={isConfidenceEnabled}
      isShortAnswerEnabled={isShortAnswerEnabled}
      screenSize={screenSize}
      featuredMistakesSelectionValue={featuredMistakesSelectionValue}
      setGraphClickInfo={setGraphClickInfo}
      isPopularMode={isPopularMode}
      setIsPopularMode={setIsPopularMode}
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
            {!isAnimating && (
              <>
                <SwiperSlide>
                  {midCardsColumn}
                </SwiperSlide>
                {(isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || 
                   localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) && (
                    <SwiperSlide>
                      {rightCardsColumn}
                    </SwiperSlide>
                )}
              </>
            )}
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
          style={{ width: '100%', height: '100%', position: 'absolute', top: '0', display: 'flex', justifyContent: 'center'  }}
        >
          {(isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) ? (
            <BodyContentAreaDoubleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
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
                style={{height: '100%', width: '100%',  paddingLeft: `${theme.sizing.xLgPadding}px`, paddingRight: `${theme.sizing.xLgPadding}px`}}
              >
                <SwiperSlide>
                  {leftCardsColumn}
                </SwiperSlide>
                <SwiperSlide>
                  {midCardsColumn}
                </SwiperSlide>
                {(!isAnimating && (isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || 
                   localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) && 
                  <SwiperSlide>
                    {rightCardsColumn}
                  </SwiperSlide>)
                }
              </Swiper>
            </BodyContentAreaDoubleColumnStyled>
          ) : (
            <BodyContentAreaDoubleColumnStyledNoSwiper container gap={`${theme.sizing.mdPadding}px`}>
              {leftCardsColumn}
              {midCardsColumn}
            </BodyContentAreaDoubleColumnStyledNoSwiper>
          )}
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
            {midCardsColumn}
            {(isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) &&
              rightCardsColumn
            }
          </BodyContentAreaTripleColumnStyled>
        </motion.div>
      );
  }
}