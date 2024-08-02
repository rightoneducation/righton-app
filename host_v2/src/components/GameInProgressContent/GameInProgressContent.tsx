import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { IGameSession, IQuestion, IHostTeamAnswers, GameSessionState, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IHostTeamAnswersHint, IPhase, IHostTeamAnswersPerPhase } from '@righton/networking';
import { IGraphClickInfo, Mistake, featuredMistakesSelectionValue, ScreenSize } from '../../lib/HostModels';
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import GameInProgressContentLeftColumn from './columns/GameInProgressContentLeftColumn';
import GameInProgressContentMidColumn from './columns/GameInProgressContentMidColumn';
import GameInProgressContentRightColumn from './columns/GameInProgressContentRightColumn';


interface GameInProgressContentProps {
  // props for Confidence Card (see Team, Answer, Player, and ConfidenceOption interfaces above)
  // confidenceData: ConfidenceOption[];
  // confidenceGraphClickIndex: number | null;
  // handleConfidenceGraphClick: (selectedIndex: number | null) => void;
  localGameSession: IGameSession;
  localHostTeamAnswers: IHostTeamAnswers;
  onSelectMistake: (answer: string, isSelected: boolean) => void;
  sortedMistakes: Mistake[];
  setSortedMistakes: (value: Mistake[]) => void;
  isPopularMode: boolean;
  setIsPopularMode: (value: boolean) => void;
  screenSize: ScreenSize;
  currentQuestion: IQuestion;
  currentPhase: IPhase;
  currentPhaseTeamAnswers: IHostTeamAnswersPerPhase | null;
} // eslint-disable-line

export default function GameInProgressContent({
  // confidenceData,
  // confidenceGraphClickIndex,
  // handleConfidenceGraphClick,
  localGameSession,
  localHostTeamAnswers,
  onSelectMistake,
  sortedMistakes,
  setSortedMistakes,
  isPopularMode,
  setIsPopularMode,
  screenSize,
  currentQuestion,
  currentPhase,
  currentPhaseTeamAnswers,
}: GameInProgressContentProps) {

  // currentResponses are used for the Real Time Responses Victory Graph
  const currentResponses = currentPhaseTeamAnswers?.responses ?? [] as IHostTeamAnswersResponse[];
  // currentConfidences are used for the Confidence Meter Victory Graph
  const currentConfidences = currentPhaseTeamAnswers?.confidences ?? [] as IHostTeamAnswersConfidence[];
  // currentHints are used for the Hints Progress Bar (Pre-GPT)
  const currentHints = currentPhaseTeamAnswers?.hints ?? [] as IHostTeamAnswersHint[];
  
  let prevPhaseResponses = [] as IHostTeamAnswersResponse[];
  let prevPhaseConfidences = [] as IHostTeamAnswersConfidence[];
  if (localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) {
    prevPhaseResponses= localHostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.phase1.responses ?? [] as IHostTeamAnswersResponse[];
    prevPhaseConfidences = localHostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.phase1.confidences ?? [] as IHostTeamAnswersConfidence[];
  }
  // these booleans turn on and off the respective feature cards in the render function below
  const {isConfidenceEnabled, isHintEnabled, isShortAnswerEnabled} = currentQuestion;

  const [graphClickInfo, setGraphClickInfo] = React.useState<IGraphClickInfo>({graph: null, selectedIndex: null});
  const handleGraphClick = ({ graph, selectedIndex }: IGraphClickInfo) => {
    setGraphClickInfo({graph, selectedIndex })
  }

  const leftCardsColumn = (
    <GameInProgressContentLeftColumn 
      currentQuestion={currentQuestion}
      responses={currentPhase === IPhase.ONE ? currentResponses : prevPhaseResponses}
      confidences={currentPhase === IPhase.ONE ? currentConfidences : prevPhaseConfidences}
      graphClickInfo={graphClickInfo}
      isConfidenceEnabled={isConfidenceEnabled}
      isShortAnswerEnabled={isShortAnswerEnabled}
      screenSize={screenSize}
      handleGraphClick={handleGraphClick}
    />
  );

  const midCardsColumn = (
    <GameInProgressContentMidColumn
      currentQuestion={currentQuestion}
      onSelectMistake={onSelectMistake}
      responses={currentResponses}
      sortedMistakes={sortedMistakes}
      setSortedMistakes={setSortedMistakes}
      isPopularMode={isPopularMode}
      setIsPopularMode={setIsPopularMode}
      featuredMistakesSelectionValue={featuredMistakesSelectionValue}
      isShortAnswerEnabled={isShortAnswerEnabled}
      isHintEnabled={isHintEnabled}
      currentHints={currentHints}
      numPlayers={localGameSession.teams.length}
      graphClickInfo={graphClickInfo}
      handleGraphClick={handleGraphClick}
    />
  );
  
  const rightCardsColumn = (
    <GameInProgressContentRightColumn 
      currentQuestion={currentQuestion}
      localGameSession={localGameSession}
      isShortAnswerEnabled={isShortAnswerEnabled}
    />
  );
  
  switch(screenSize) {
    case (ScreenSize.SMALL):
      return (
        <BodyContentAreaSingleColumnStyled>
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
            { isShortAnswerEnabled &&
              <SwiperSlide>
                {midCardsColumn}
              </SwiperSlide>
            }
            <SwiperSlide>
              {rightCardsColumn}
            </SwiperSlide>
          </Swiper>
        </BodyContentAreaSingleColumnStyled>
      );
    case (ScreenSize.MEDIUM):
      return (
        <BodyContentAreaDoubleColumnStyled>
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
              slidesPerView={2.1}
            >
              <SwiperSlide>
                {leftCardsColumn}
              </SwiperSlide>
              <SwiperSlide>
                {midCardsColumn}
              </SwiperSlide>
              <SwiperSlide>
                {rightCardsColumn}
              </SwiperSlide>
            </Swiper>
          ) : (
            <>
              {leftCardsColumn}
              {rightCardsColumn}
            </>
          )}
        </BodyContentAreaDoubleColumnStyled>
      );
    case (ScreenSize.LARGE):
    default:
      return (
        <BodyContentAreaTripleColumnStyled container>
          {leftCardsColumn}
          { localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER &&
            midCardsColumn
          }
          {rightCardsColumn}
        </BodyContentAreaTripleColumnStyled>
      );
  }
}
