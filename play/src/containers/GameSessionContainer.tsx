import React, { useState } from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
  GameSessionState,
  ModelHelper,
  ITeamAnswer,
  IChoice,
  IQuestion,
  isNullOrUndefined
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import MockGameSession from '../mock/MockGameSession.json';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import JoinGame from '../pages/JoinGame';
import FinalResults from '../pages/FinalResults';
import StartPhase2 from '../pages/StartPhase2';
import { JoinGameState, FinalResultsState } from '../lib/PlayModels';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState(
    // TODO: update exchange mock gamesession with subscription via @righton/networking
    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  // TODO: add gameSession subscription and update below states accordingly.  
  const [joinGameState, setjoinGameState] = useState<JoinGameState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    JoinGameState.SPLASH_SCREEN
  );
  const [gameState, setGameState] = useState<GameSessionState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionState.PHASE_2_RESULTS
  );
  const [finalResultsState, setFinalResultsState] = useState(
    // eslint-disable-line @typescript-eslint/no-unused-vars
    FinalResultsState.LEADERBOARD
  );
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true); // eslint-disable-line @typescript-eslint/no-unused-vars
  const selectedAvatar = 0;
  const leader = true;
  const teamId = '2d609343-de50-4830-b65e-71eb72bb9bef';
  const { teams } = gameSession;
  const currentQuestion = gameSession.questions[gameSession.currentQuestionIndex ?? 0];
  const currentTeam = teams?.find((team) => team.id === teamId);
  const phaseNo = (gameSession.currentState === GameSessionState.PHASE_1_RESULTS) ? 1 : 2;  

  const handlePregameTimerFinished = () => {
    setIsPregameCountdown(false);
  };

  // PHASE_DISCUSS or PHASE_RESULT - get answers for use in ResultSelector and Score Caclulations
  // part 1: get selectedAnswer (the answer the player selected this round)
  const getSelectedAnswer = () => {
    // step 1. get all answers to current question
    let teamAnswers;
    if (currentTeam != null) {
        teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(
        currentTeam,
        currentQuestion.id
      );
    }
    // step 2. get the answer the player selected this round 
    const findSelectedAnswer = (answers: (ITeamAnswer | null)[]) => {
      const selectedAnswer = answers.find((teamAnswer: ITeamAnswer | null) =>
        phaseNo === 1
          ? teamAnswer?.isChosen === true
          : teamAnswer?.isTrickAnswer === true
      );
      return isNullOrUndefined(selectedAnswer) ? null : selectedAnswer;
    };

    if (currentTeam != null && !isNullOrUndefined(teamAnswers)) {
     return findSelectedAnswer(teamAnswers); 
    }
    return null;
  }

  // part 2: get answerChoices (all possible answers to the question)
  const getAnswerChoices = (question: IQuestion) => {
    return question?.choices?.map((choice: IChoice) => ({
      id: uuidv4(),
      text: choice.text,
      isCorrectAnswer: choice.isAnswer,
    }));
  }

  switch (gameState) {
    case GameSessionState.TEAMS_JOINING:
      return <JoinGame joinGameState={joinGameState} />;
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return isPregameCountdown ? (
        <PregameCountdown
          handlePregameTimerFinished={handlePregameTimerFinished}
        />
      ) : (
        <GameInProgress
          {...gameSession}
          teamAvatar={teamAvatar}
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
        />
      );
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
      return (
        <GameInProgress
          {...gameSession}
          teamAvatar={teamAvatar}
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
        />
      );
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.PHASE_2_DISCUSS:
      return (
        <GameInProgress
          {...gameSession}
          teamAvatar={teamAvatar}
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
          selectedAnswer={getSelectedAnswer()}
          answerChoices={getAnswerChoices(currentQuestion) ?? []} 
        />
      );
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <PhaseResults
          currentTeam={currentTeam!}
          gameSession={gameSession}
          currentQuestion={currentQuestion}
          currentState={gameState}
          teamAvatar={teamAvatar}
          selectedAnswer={getSelectedAnswer()}
          answerChoices={getAnswerChoices(currentQuestion) ?? []}
          phaseNo={phaseNo}
        />
      );
    case GameSessionState.PHASE_2_START:
      return <StartPhase2 />;
    case GameSessionState.FINAL_RESULTS:
      return (
        <FinalResults
          {...gameSession}
          currentState={gameState}
          score={120}
          selectedAvatar={selectedAvatar}
          teamId={teamId}
          leader={leader}
          finalResultsState={finalResultsState}
        />
      );
    default:
      return (
        <GameInProgress
          {...gameSession}
          teamAvatar={teamAvatar}
          teamId={teamId}
          selectedAnswer={getSelectedAnswer()}
          answerChoices={getAnswerChoices(currentQuestion) ?? []}
        />
      );
  }
}
