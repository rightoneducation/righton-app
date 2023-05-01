import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  GameSessionState,
  ITeam,
  IQuestion,
  IChoice,
  ModelHelper,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HeaderContent from '../components/HeaderContent';
import CardResults from '../components/ResultsCard';
import FooterContent from '../components/FooterContent';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import { BodyContentAreaPhaseResultsStyled } from '../lib/styledcomponents/layout/BodyContentAreaStyled';
import FooterStackContainerStyled from '../lib/styledcomponents/layout/FooterStackContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';

interface PhaseResultsProps {
  teams?: ITeam[];
  id: string;
  currentState: GameSessionState;
  teamAvatar: number;
  questions: IQuestion[];
  currentQuestionIndex?: number | null;
  teamId: string;
}

export default function PhaseResults({
  teams,
  id, // eslint-disable-line @typescript-eslint/no-unused-vars
  currentState,
  teamAvatar,
  questions,
  currentQuestionIndex,
  teamId, // eslint-disable-line @typescript-eslint/no-unused-vars
}: PhaseResultsProps) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const currentTeam = teams?.find((team) => team.id === teamId);
  const currentQuestion = questions[currentQuestionIndex ?? 0];
  let teamAnswers;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(  // eslint-disable-line @typescript-eslint/no-unused-vars
      currentTeam,
      currentQuestion.id
    );
  }

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const answerChoices = currentQuestion?.choices?.map((choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
  }));

  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderStackContainerStyled>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={()=> {}}
        />
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <BodyContentAreaPhaseResultsStyled container  >
         <CardResults 
          answers={answerChoices}
          selectedAnswer={selectedAnswer}
          isMobileDevice={isMobileDevice}
          currentState={currentState}
         />
        </BodyContentAreaPhaseResultsStyled>
      </BodyStackContainerStyled>
      <FooterStackContainerStyled>
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          newPoints={10}
          score={120}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
