import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { IGameSession, IHostTeamAnswers, GameSessionState, IHostTeamAnswersResponse, IHostTeamAnswersConfidence } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { ConfidenceOption, IGraphClickInfo, Mistake, featuredMistakesSelectionValue } from '../lib/HostModels';
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled,
} from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import Responses from './Responses';
import ConfidenceCard from './ConfidenceCard';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';
import ScrollBoxStyled from '../lib/styledcomponents/layout/ScrollBoxStyled';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import FeaturedMistakes from './FeaturedMistakes';
import 'swiper/css';
import 'swiper/css/pagination';


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
}: GameInProgressContentProps) {
  const theme = useTheme(); // eslint-disable-line
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const currentQuestion = localGameSession.questions[localGameSession.currentQuestionIndex];
  const currentPhase = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 'phase1' : 'phase2';
  const currentTeamAnswers = localHostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.[currentPhase];

  // currentResponses is used for the Real Time Responses Victory Graph
  const currentResponses = currentTeamAnswers?.responses ?? [] as IHostTeamAnswersResponse[];
  // currentConfidences is used for the Confidence Meter Victory Graph
  const currentConfidences = currentTeamAnswers?.confidences ?? [] as IHostTeamAnswersConfidence[];


  const [graphClickInfo, setGraphClickInfo] = React.useState<IGraphClickInfo>({graph: null, selectedIndex: null});
  const handleGraphClick = ({ graph, selectedIndex }: IGraphClickInfo) => {
    setGraphClickInfo({graph, selectedIndex })
  }

  const largeScreen = (
    <BodyContentAreaTripleColumnStyled container>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <Responses 
            currentQuestion={currentQuestion}
            currentResponses={currentResponses}
            statePosition={0}
            graphClickInfo={graphClickInfo}
            isShortAnswerEnabled
            handleGraphClick={handleGraphClick}
          />
           <ConfidenceCard 
            currentConfidences={currentConfidences}
            graphClickInfo={graphClickInfo}
            handleGraphClick={handleGraphClick}
          />
        </ScrollBoxStyled>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <FeaturedMistakes
            sortedMistakes={sortedMistakes}
            setSortedMistakes={setSortedMistakes}
            isPopularMode={isPopularMode}
            setIsPopularMode={setIsPopularMode}
            onSelectMistake={onSelectMistake}
            featuredMistakesSelectionValue={featuredMistakesSelectionValue}
          />
          <Card />
        </ScrollBoxStyled>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <QuestionCard 
           questionText={currentQuestion.text}
           imageUrl={currentQuestion.imageUrl}
           currentQuestionIndex={localGameSession.currentQuestionIndex}
           currentState={localGameSession.currentState}
          />
          { currentQuestion.choices.map((choice, index) => 
            <AnswerCard 
              isCorrectAnswer={choice.isAnswer}
              answerIndex={index}
              answerContent={choice.text}
              instructions={currentQuestion.instructions}
              answerReason={choice.reason}
              key={uuidv4()}
            />
          )}
        </ScrollBoxStyled>
      </Grid>
    </BodyContentAreaTripleColumnStyled>
  );

  const mediumScreen = (
    <BodyContentAreaDoubleColumnStyled>
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
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Responses 
                currentQuestion={currentQuestion}
                currentResponses={currentResponses}
                statePosition={0}
                graphClickInfo={graphClickInfo}
                isShortAnswerEnabled
                handleGraphClick={handleGraphClick}
              />
               <ConfidenceCard 
                currentConfidences={currentConfidences}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
              />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <FeaturedMistakes
                onSelectMistake={onSelectMistake}
                sortedMistakes={sortedMistakes}
                setSortedMistakes={setSortedMistakes}
                isPopularMode={isPopularMode}
                setIsPopularMode={setIsPopularMode}
                featuredMistakesSelectionValue={featuredMistakesSelectionValue}
              />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaDoubleColumnStyled>
  );

  const smallScreen = (
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
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <Responses 
                currentQuestion={currentQuestion}
                currentResponses={currentResponses}
                statePosition={0}
                graphClickInfo={graphClickInfo}
                isShortAnswerEnabled={false}
                handleGraphClick={handleGraphClick}
              />
              <ConfidenceCard 
                currentConfidences={currentConfidences}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
              />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <FeaturedMistakes
                onSelectMistake={onSelectMistake}
                sortedMistakes={sortedMistakes}
                setSortedMistakes={setSortedMistakes}
                isPopularMode={isPopularMode}
                setIsPopularMode={setIsPopularMode}
                featuredMistakesSelectionValue={featuredMistakesSelectionValue}
              />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaSingleColumnStyled>
  );

  if (isLargeScreen) {
    return largeScreen;
  }
  if (isMediumScreen) {
    return (
      <>
        {mediumScreen}
        <PaginationContainerStyled
          className="swiper-pagination-container"
          style={{ paddingTop: `${theme.sizing.lgPadding}px`, zIndex: 2 }}
        />
      </>
    );
  }
  return (
    <>
      {smallScreen}
      <PaginationContainerStyled
        className="swiper-pagination-container"
        style={{ paddingTop: `${theme.sizing.lgPadding}px`, zIndex: 2 }}
      />
    </>
  );
}
