import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Stack, Box, Container, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import {
  GameSessionState,
  ITeam,
  IQuestion,
  IChoice,
  ModelHelper
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HeaderContent from '../components/HeaderContent';
import CardQuestion from '../components/CardQuestion';
import CardAnswer from '../components/CardAnswer';
import FooterContent from '../components/FooterContent';

const StackContainer = styled(Stack)({
  height: '100vh',
  width: '100vw',
});

const HeaderStackItem = styled(Stack)(({ theme }) => ({
  paddingTop: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
  background: theme.palette.primary.mainGradient,
  border: 'none',
  width: '100vw',
  height: theme.sizing.headerHeight,
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
  background: theme.palette.primary.mainGradient,
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
  paddingLeft: '26px',
  paddingRight: '26px',
  maxWidth: '824px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
});

const ScrollBox= styled(Box)(({ theme }) => ({
  height: `calc(100% - ${theme.sizing.footerHeight} - 8px)`, // footer height & 8px grid spacing
  overflow: 'auto',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingBottom: '10px',
  '&::-webkit-scrollbar': { /* Chrome and Safari */
    display: 'none',
  },
  scrollbarWidth: 'none', /* Firefox */
    '-ms-overflow-style': 'none',  /* IE and Edge */
}));

const FooterStackItem = styled(Stack)(({ theme }) => ({
  paddingBottom: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  height: theme.sizing.footerHeight,
  width: '100vw',
  border: 'none',
  position: 'sticky',
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
  id,
  currentState,
  teamAvatar,
  questions,
  currentQuestionIndex,
  teamId, // eslint-disable-line @typescript-eslint/no-unused-vars
}: GameInProgressProps) {
  const [gameSessionState, setCurrentState] = React.useState(currentState); // eslint-disable-line @typescript-eslint/no-unused-vars
  const currentTeam = teams?.find(team => team.id === teamId);
  const currentQuestion = questions[currentQuestionIndex ?? 0];
  let teamAnswers;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(currentTeam, currentQuestion.id);
  }

  // this breaks down the question text from the gameSession to isolate the sentence with the question mark for formatting purposes in the component
  const divideQuestionString = (inputText: string) => { 
    const question = inputText.split(" ");
    const qmarkLocation = inputText.lastIndexOf("?");
    let introText = "";
    let questionText = "";

    if (qmarkLocation !== -1){
      const periodLocation = inputText.lastIndexOf(".");
      if (periodLocation !== -1 && periodLocation < qmarkLocation){
        introText = inputText.substring(0, periodLocation + 1);
        questionText = inputText.substring(periodLocation + 1, qmarkLocation + 1);
      }
    }
    return [introText, questionText];
  }

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
        <BodyGridArea container spacing={2}> 
            <Grid item xs={12} sm={6} sx={{height: '100%'}}> {/* TODO: use a mediaQuery to expand this to 12 on mobile and show carousel */}
            <Swiper className="mySwiper">
            <SwiperSlide>
              <Typography
                variant="h2"
                sx={{ marginTop: '16px', marginBottom: '12px', textAlign: 'center' }}
              >
                Question
              </Typography>
              <ScrollBox>
                <CardQuestion questionText={questionText} imageUrl={questionUrl ?? ""} />
              </ScrollBox>
            </SwiperSlide>
            <SwiperSlide>
                <Typography
                  variant="h2"
                  sx={{ marginTop: '16px', marginBottom: '12px', textAlign: 'center' }}
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
              </SwiperSlide>
              </Swiper>
              </Grid>
            <Grid item xs={0} sm={6} sx={{height: '100%'}}>
              <Typography
                variant="h2"
                sx={{ marginTop: '16px', marginBottom: '12px', textAlign: 'center' }}
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
            </Grid>
        </BodyGridArea>
      </BodyStackItem>
      <FooterStackItem>
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

GameInProgress.defaultProps = {
  teams: null,
};
