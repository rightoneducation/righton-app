import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { IGameSession, IHostTeamAnswers, GameSessionState, IHostTeamAnswersResponse, IHostTeamAnswersConfidence, IHostTeamAnswersHint } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { ConfidenceOption, IGraphClickInfo, Mistake, featuredMistakesSelectionValue, ScreenSize } from '../../lib/HostModels';
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from '../Card';
import Responses from '../ResponsesGraph/ResponsesCard';
import ConfidenceCard from '../ConfidenceGraph/ConfidenceCard';
import HintsCard from '../HintsGraph/HintsCard';
import QuestionCard from '../QuestionCard';
import AnswerCard from '../AnswerCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import PaginationContainerStyled from '../../lib/styledcomponents/PaginationContainerStyled';
import FeaturedMistakes from '../FeaturedMistakes';
import 'swiper/css';
import 'swiper/css/pagination';
import { GameInProgressContentColumnOne } from './columns/GameInProgressContentColumnOne';


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
  setIsPopularMode
}: GameInProgressContentProps) {
  const theme = useTheme(); // eslint-disable-line
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen  // eslint-disable-line
      ? ScreenSize.LARGE 
      : isMediumScreen 
        ? ScreenSize.MEDIUM 
        : ScreenSize.SMALL;
  const currentQuestion = localGameSession.questions[localGameSession.currentQuestionIndex];
  const currentPhase = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 'phase1' : 'phase2';
  const currentTeamAnswers = localHostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.[currentPhase];
  // currentResponses are used for the Real Time Responses Victory Graph
  const currentResponses = currentTeamAnswers?.responses ?? [] as IHostTeamAnswersResponse[];
  // currentConfidences are used for the Confidence Meter Victory Graph
  const currentConfidences = currentTeamAnswers?.confidences ?? [] as IHostTeamAnswersConfidence[];
  // currentHints are used for the Hints Progress Bar (Pre-GPT)
  const currentHints = currentTeamAnswers?.hints ?? [] as IHostTeamAnswersHint[];

  // these booleans turn on and off the respective feature cards in the render function below
  const {isConfidenceEnabled, isHintEnabled, isShortAnswerEnabled} = localGameSession.questions[localGameSession.currentQuestionIndex];

  const [graphClickInfo, setGraphClickInfo] = React.useState<IGraphClickInfo>({graph: null, selectedIndex: null});
  const handleGraphClick = ({ graph, selectedIndex }: IGraphClickInfo) => {
    console.log('handleGraphClick');
    setGraphClickInfo({graph, selectedIndex })
  }



  
  const phase1ShortAnswerColumn = (
    <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
      <ScrollBoxStyled>
        {isShortAnswerEnabled &&
          <FeaturedMistakes
            sortedMistakes={sortedMistakes}
            setSortedMistakes={setSortedMistakes}
            isPopularMode={isPopularMode}
            setIsPopularMode={setIsPopularMode}
            onSelectMistake={onSelectMistake}
            featuredMistakesSelectionValue={featuredMistakesSelectionValue}
          /> 
        }
        {isHintEnabled &&
          <HintsCard 
            hints={currentHints}
            numPlayers={localGameSession.teams.length}
            currentState={GameSessionState.CHOOSE_TRICKIEST_ANSWER}
          />
        }
      </ScrollBoxStyled>
    </Grid>
  );
  const phase1QuestionColumn = (
    <Grid item xs={12} sm={isShortAnswerEnabled  ? 4 : 6} sx={{ width: '100%', height: '100%' }}>
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
  );

  const largeScreen = (
    <BodyContentAreaTripleColumnStyled container>
      <GameInProgressContentColumnOne 
        currentQuestion={currentQuestion}
        currentResponses={currentResponses}
        currentConfidences={currentConfidences}
        graphClickInfo={graphClickInfo}
        isConfidenceEnabled={isConfidenceEnabled}
        isShortAnswerEnabled={isShortAnswerEnabled}
        screenSize={screenSize}
        handleGraphClick={handleGraphClick}
      />
      { localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER &&
        phase1ShortAnswerColumn
      }
      {phase1QuestionColumn}
    </BodyContentAreaTripleColumnStyled>
  );

  const mediumScreen = (
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
            {phase1AnsweringColumn}
          </SwiperSlide>
          <SwiperSlide>
            {phase1ShortAnswerColumn}
          </SwiperSlide>
          <SwiperSlide>
            {phase1QuestionColumn}
          </SwiperSlide>
        </Swiper>
      ) : (
        <>
          {phase1AnsweringColumn}
          {phase1QuestionColumn}
        </>
      )}
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
         {phase1AnsweringColumn}
        </SwiperSlide>
        {isShortAnswerEnabled &&
          <SwiperSlide>
            {phase1ShortAnswerColumn}
          </SwiperSlide>
        }
        <SwiperSlide>
          {phase1QuestionColumn}
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaSingleColumnStyled>
  );

  switch(screenSize) {
    case (ScreenSize.SMALL):
      return smallScreen;
    case (ScreenSize.MEDIUM):
      return mediumScreen;
    case (ScreenSize.LARGE):
    default:
      return largeScreen;
  }

  // if (isLargeScreen) {
  //   return largeScreen;
  // }
  // if (isMediumScreen) {
  //   return (
  //     <>
  //       {mediumScreen}
  //       <PaginationContainerStyled
  //         className="swiper-pagination-container"
  //         style={{ paddingTop: `${theme.sizing.lgPadding}px`, zIndex: 2 }}
  //       />
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     {smallScreen}
  //     <PaginationContainerStyled
  //       className="swiper-pagination-container"
  //       style={{ paddingTop: `${theme.sizing.lgPadding}px`, zIndex: 2 }}
  //     />
  //   </>
  // );
}
