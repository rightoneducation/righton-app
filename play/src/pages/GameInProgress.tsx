import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Stack, Box, Grid } from '@mui/material';
import {
  GameSessionState,
  ITeam,
  IQuestion,
  IChoice,
  ModelHelper,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import HeaderContent from '../components/HeaderContent';
import CardQuestion from '../components/CardQuestion';
import CardAnswer from '../components/CardAnswer';
import FooterContent from '../components/FooterContent';
import { PaginationContainer } from '../lib/styledcomponents/StyledComponents';
import 'swiper/css';
import 'swiper/css/pagination';

const StackContainer = styled(Stack)({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
});

const HeaderStackItem = styled(Stack)(({ theme }) => ({
  paddingTop: `${theme.sizing.mediumPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
  background: theme.palette.primary.backgroundGradient,
  border: 'none',
  width: '100vw',
  height: `${theme.sizing.headerHeight}px`,
}));

const BodyStackItem = styled(Stack)({
  position: 'relative',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  border: 'none',
});

const BodyBoxUpper = styled(Box)(({ theme }) => ({
  height: '120px',
  width: '100vw',
  background: theme.palette.primary.backgroundGradient,
  boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
  zIndex: 1,
}));

const BodyBoxLower = styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100vw',
  backgroundColor: theme.palette.primary.main,
  zIndex: 0,
}));

const BodyGridArea = styled(Grid)({
  position: 'absolute',
  top: '0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '824px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
});

const ScrollBox = styled(Box)(({ theme }) => ({
  height: `calc(100% - ${theme.sizing.footerHeight}px - ${theme.sizing.extraSmallPadding}px)`, // footer height & 8px grid spacing
  paddingBottom: `${theme.sizing.extraSmallPadding}px`, // added so box shadow shows around edge of card
  paddingLeft: `${theme.sizing.extraSmallPadding}px`,
  paddingRight: `${theme.sizing.extraSmallPadding}px`,
  overflow: 'auto',
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));

const FooterStackItem = styled(Stack)(({ theme }) => ({
  paddingBottom: `${theme.sizing.smallPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  width: '100vw',
  border: 'none',
  position: 'sticky',
  bottom: 0,
  zIndex: 3,
}));

interface GameInProgressProps {
  teams?: ITeam[];
  id: string;
  currentState: GameSessionState;
  teamAvatar: number;
  questions: IQuestion[];
  currentQuestionIndex?: number | null;
  teamId: string;
}

export default function GameInProgress({
  teams,
  id, // eslint-disable-line @typescript-eslint/no-unused-vars
  currentState,
  teamAvatar,
  questions,
  currentQuestionIndex,
  teamId, // eslint-disable-line @typescript-eslint/no-unused-vars
}: GameInProgressProps) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [gameSessionState, setCurrentState] = React.useState(currentState); // eslint-disable-line @typescript-eslint/no-unused-vars
  const currentTeam = teams?.find((team) => team.id === teamId);
  const currentQuestion = questions[currentQuestionIndex ?? 0];
  let teamAnswers;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(  // eslint-disable-line @typescript-eslint/no-unused-vars
      currentTeam,
      currentQuestion.id
    );
  }

  // this breaks down the question text from the gameSession to isolate the sentence with the question mark for formatting purposes in the component
  const divideQuestionString = (inputText: string) => {
    const qmarkLocation = inputText.lastIndexOf('?');
    let introText = '';
    let questionText = '';

    if (qmarkLocation !== -1) {
      const periodLocation = inputText.lastIndexOf('.');
      if (periodLocation !== -1 && periodLocation < qmarkLocation) {
        introText = inputText.substring(0, periodLocation + 1);
        questionText = inputText.substring(
          periodLocation + 1,
          qmarkLocation + 1
        );
      }
    }
    return [introText, questionText];
  };

  const questionText = divideQuestionString(currentQuestion?.text);

  const questionUrl = currentQuestion?.imageUrl;
  const [timerIsPaused, setTimerIsPaused] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const answerChoices = currentQuestion?.choices?.map((choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
  }));

  const handleTimerIsFinished = () => {
    setTimerIsPaused(true);
  };

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const questionContents = (
    <>
      <Typography
        variant="h2"
        sx={{
          marginTop: `${theme.sizing.smallPadding}px`,
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
        }}
      >
        Question
      </Typography>
      <ScrollBox>
        <CardQuestion
          questionText={questionText}
          imageUrl={questionUrl ?? ''}
        />
        {isMobileDevice ? (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              marginTop: `${theme.sizing.largePadding}px`,
              opacity: 0.5,
            }}
          >
            Scroll to the left to answer the question.
          </Typography>
        ) : null}
      </ScrollBox>
    </>
  );

  const answerContents = (
    <>
      <Typography
        variant="h2"
        sx={{
          marginTop: '16px',
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
        }}
      >
        Answer
      </Typography>
      <ScrollBox>
        <CardAnswer
          answers={answerChoices}
          isSubmitted={isSubmitted}
          handleSubmitAnswer={handleSubmitAnswer}
          currentState={currentState}
          selectedAnswer={selectedAnswer}
          handleSelectAnswer={handleSelectAnswer}
        />
      </ScrollBox>
    </>
  );

  return (
    <StackContainer
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderStackItem>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={handleTimerIsFinished}
        />
      </HeaderStackItem>
      <BodyStackItem>
        <BodyBoxUpper />
        <BodyBoxLower />
        <BodyGridArea container spacing={isMobileDevice ? 0 : 2}>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            {isMobileDevice ? (
              <Swiper
                modules={[Pagination]}
                spaceBetween={24}
                centeredSlides
                slidesPerView="auto"
                pagination={{
                  el: '.swiper-pagination-container',
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  clickable: true,
                  renderBullet(index, className) {
                    return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
                  },
                }}
                style={{ height: '100%' }}
              >
                <SwiperSlide
                  style={{
                    width: `calc(100% - ${
                      theme.sizing.extraLargePadding * 2
                    }px`,
                    height: '100%',
                  }}
                >
                  {questionContents}
                </SwiperSlide>
                <SwiperSlide
                  style={{
                    width: `calc(100% - ${
                      theme.sizing.extraLargePadding * 2
                    }px`,
                    height: '100%',
                  }}
                >
                  {answerContents}
                </SwiperSlide>
              </Swiper>
            ) : (
              questionContents
            )}
          </Grid>
          <Grid item xs={0} sm={6} sx={{ width: '100%' }}>
            {answerContents}
          </Grid>
        </BodyGridArea>
      </BodyStackItem>
      <FooterStackItem>
        {isMobileDevice ? (
          <PaginationContainer className="swiper-pagination-container" />
        ) : null}
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          newPoints={10}
          score={120}
        />
      </FooterStackItem>
    </StackContainer>
  );
}
