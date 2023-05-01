import React, { useState } from 'react';
import {
  GameSessionState,
  IGameSession,
  ITeam,
  ITeamAnswer,
  IQuestion,
  IChoice,
  ModelHelper,
  isNullOrUndefined
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HeaderContent from '../components/HeaderContent';
import ResultsCard from '../components/ResultsCard';
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
  currentState: GameSessionState;
  teamAvatar: number;
  currentQuestionIndex?: number | null;
  teamId: string;
  gameSession: IGameSession;
}

export default function PhaseResults({
  teams,
  currentState,
  teamAvatar,
  currentQuestionIndex,
  teamId,
  gameSession,
}: PhaseResultsProps) {
  const currentQuestion = gameSession.questions[currentQuestionIndex ?? 0];
  const phaseNo = (currentState === GameSessionState.PHASE_1_RESULTS) ? 1 : 2;
  const currentTeam = teams?.find((team) => team.id === teamId);
  const originalScore = currentTeam?.score ?? 0;
  const [scoreFooter, setScoreFooter] = useState(originalScore); // eslint-disable-line @typescript-eslint/no-unused-vars

  // step 1: get all answers from player
  let teamAnswers;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId( 
      currentTeam,
      currentQuestion.id
    );
  }

  // step 2: get the answer the player has just selected this round
  const findSelectedAnswer = (answers: (ITeamAnswer | null)[]) => {
    const selectedAnswer = answers.find((teamAnswer: ITeamAnswer | null) => ((phaseNo === 1) ? (teamAnswer?.isChosen === true) : (teamAnswer?.isTrickAnswer === true)))
    return isNullOrUndefined(selectedAnswer) ? null : selectedAnswer
  }

  let selectedAnswer;
  if (currentTeam != null && !isNullOrUndefined(teamAnswers)) {
    selectedAnswer = findSelectedAnswer(teamAnswers)
  }

  // step 3: get all possible answers to the question 
  const answerChoices = currentQuestion?.choices?.map((choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
  }));

  // step 4: if phase 2, get the answer the player selected in phase 1 (then: send all this info down to results card to determine answer types on map)
  let prevAnswer = null;
  if (phaseNo === 2) {
    prevAnswer = teamAnswers?.find((teamAnswer: ITeamAnswer | null) => teamAnswer?.isChosen === true) ?? null;
  }
 
  // step 5: calculate new score for use in footer (todo: update gamesession object through api call) 
  const calculateNewScore = (session: IGameSession, question: IQuestion, team: ITeam) => {
    const newScore = ModelHelper.calculateBasicModeScoreForQuestion(session, question, team);
    return newScore;
  }
  
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
         <ResultsCard 
          phaseNo={phaseNo}
          gameSession={gameSession}
          answers={answerChoices}
          selectedAnswer={selectedAnswer ?? null}
          currentState={currentState}
          currentQuestionId={currentQuestion.id}
          prevAnswer = {prevAnswer}
         />
        </BodyContentAreaPhaseResultsStyled>
      </BodyStackContainerStyled>
      <FooterStackContainerStyled>
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          newPoints={calculateNewScore(gameSession, gameSession.questions[currentQuestionIndex ?? 0], currentTeam!)} // eslint-disable-line @typescript-eslint/no-non-null-assertion
          score={scoreFooter}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
