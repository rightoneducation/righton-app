import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Stack, Box, Container } from '@mui/material';
import {
  GameSessionState,
  ITeam,
  IQuestion,
  IChoice,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HeaderContent from '../components/HeaderContent';
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
  height: '68px',
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

const BodyColumnContainer = styled(Container)({
  position: 'absolute',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingLeft: '40px',
  paddingRight: '40px',
  zIndex: 2,
});

const FooterStackItem = styled(Stack)(({ theme }) => ({
  paddingBottom: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  height: '60px',
  width: '100vw',
  border: 'none',
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
  const currentTeam = teams ? teams?.find((team) => team.id === id) : undefined;
  const currentQuestion = questions[currentQuestionIndex ?? 0];

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
          currentState={gameSessionState}
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
        <BodyColumnContainer maxWidth="sm">
          <Typography
            variant="h2"
            sx={{ marginTop: '16px', marginBottom: '12px' }}
          >
            Body Header
          </Typography>
          <CardAnswer
            answers={answerChoices}
            isSubmitted={isSubmitted}
            handleSubmitAnswer={handleSubmitAnswer}
            currentState={currentState}
            selectedAnswer={selectedAnswer}
            handleSelectAnswer={handleSelectAnswer}
          />
        </BodyColumnContainer>
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
