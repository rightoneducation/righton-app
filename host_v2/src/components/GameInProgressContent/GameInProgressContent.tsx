import React from 'react';
import { useTheme } from '@mui/material/styles';
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
  localGameSession: IGameSession;
  hostTeamAnswers: IHostTeamAnswers;
  screenSize: ScreenSize;
  currentQuestion: IQuestion;
  currentPhase: IPhase;
  currentPhaseTeamAnswers: IHostTeamAnswersPerPhase | null;
}

export default function GameInProgressContent({
  localGameSession,
  hostTeamAnswers,
  screenSize,
  currentQuestion,
  currentPhase,
  currentPhaseTeamAnswers,
}: GameInProgressContentProps) {
  const theme = useTheme();
  // currentResponses are used for the Real Time Responses Victory Graph
  const currentResponses = currentPhaseTeamAnswers?.responses ?? [] as IHostTeamAnswersResponse[];
  // currentConfidences are used for the Confidence Meter Victory Graph
  const currentConfidences = currentPhaseTeamAnswers?.confidences ?? [] as IHostTeamAnswersConfidence[];
  // currentHints are used for the Hints Progress Bar (Pre-GPT)
  const currentHints = currentPhaseTeamAnswers?.hints ?? [] as IHostTeamAnswersHint[];
  console.log(currentResponses);
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
      responses={currentResponses}
      featuredMistakesSelectionValue={featuredMistakesSelectionValue}
      isShortAnswerEnabled={isShortAnswerEnabled}
      isHintEnabled={isHintEnabled}
      currentHints={currentHints}
      numPlayers={localGameSession.teams.length}
      graphClickInfo={graphClickInfo}
      handleGraphClick={handleGraphClick}
      currentPhase={currentPhase}
    />
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
        <BodyContentAreaSingleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
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
            style={{height: '100%', paddingLeft: `${theme.sizing.xLgPadding}px`, paddingRight: `${theme.sizing.xLgPadding}px`}}
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
              {rightCardsColumn}
            </SwiperSlide>
          </Swiper>
        </BodyContentAreaSingleColumnStyled>
      );
    case (ScreenSize.MEDIUM):
      return (
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
              slidesPerView={2.1}
              spaceBetween={`${theme.sizing.mdPadding}px`}
              style={{height: '100%', paddingLeft: `${theme.sizing.xLgPadding}px`, paddingRight: `${theme.sizing.xLgPadding}px`}}
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
                {rightCardsColumn}
              </SwiperSlide>
            </Swiper>
        </BodyContentAreaDoubleColumnStyled>
      );
    case (ScreenSize.LARGE):
    default:
      return (
        <BodyContentAreaTripleColumnStyled container gap={`${theme.sizing.mdPadding}px`}>
          {leftCardsColumn}
          { (isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS) &&
            midCardsColumn
          }
          {rightCardsColumn}
        </BodyContentAreaTripleColumnStyled>
      );
  }
}
