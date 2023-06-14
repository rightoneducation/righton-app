import React, { useState } from 'react';
import {
  ApiClient,
  IChoice,
  IGameSession,
  GameSessionState,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Navigate } from 'react-router-dom';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import FinalResultsContainer from '../containers/FinalResultsContainer';
import StartPhase2 from '../pages/StartPhase2';
import { LocalModel } from '../lib/PlayModels';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
  hasRejoined: boolean;
  gameSession: IGameSession;
  localModel: LocalModel;
}

export default function GameInProgressContainer({
  apiClient,
  hasRejoined,
  gameSession,
  localModel,
}: GameInProgressContainerProps) {
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(
    !hasRejoined
  );
  const { currentState } = gameSession;
  const currentQuestion =
    gameSession.questions[gameSession.currentQuestionIndex!]; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const currentTeam = gameSession.teams!.find( // eslint-disable-line @typescript-eslint/no-non-null-assertion
    (team) => team.id === localModel.teamId
  );
  // locally held score value for duration of gameSession, updates backend during each PHASE_X_RESULTS
  const [score, setScore] = useState(currentTeam?.score ?? 0);
  const leader = true;

  // this condition is used to display the pregamecountdown only on initial game start
  // this prevents a player from rejoining into the first screen and continually getting the pregame countdown
  // placed into a separate variable for readability in the switch statement
  const isGameFirstStarting = isPregameCountdown && !hasRejoined;
  const answerChoices =
    currentQuestion?.choices?.map((choice: IChoice) => ({ 
      id: uuidv4(),
      text: choice.text,
      isCorrectAnswer: choice.isAnswer,
      reason: choice.reason ?? '',
    })) ?? [];

  const handleUpdateScore = (inputScore: number) => {
    setScore(inputScore);
  };

  switch (currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return isGameFirstStarting ? ( 
        <PregameCountdown setIsPregameCountdown={setIsPregameCountdown} />
      ) : (
        <GameInProgress
          {...gameSession}
          apiClient={apiClient}
          teamMemberId={localModel.teamMemberId}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={localModel.teamId}
          score={score}
          hasRejoined={hasRejoined}
        />
      );
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.PHASE_2_DISCUSS:
      return (
        <GameInProgress
          {...gameSession}
          apiClient={apiClient}
          teamMemberId={localModel.teamMemberId}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={localModel.teamId}
          score={score}
          hasRejoined={hasRejoined}
        />
      );
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <PhaseResults
          {...gameSession}
          apiClient={apiClient}
          gameSession={gameSession}
          currentQuestionIndex={gameSession.currentQuestionIndex ?? 0} 
          teamAvatar={localModel.selectedAvatar}
          teamId={localModel.teamId}
          answerChoices={answerChoices}
          score={score}
          handleUpdateScore={handleUpdateScore}
          hasRejoined={hasRejoined}
        />
      );
    case GameSessionState.PHASE_2_START:
      return <StartPhase2 />;
    case GameSessionState.FINAL_RESULTS:
      return (
        <FinalResultsContainer
          {...gameSession}
          currentState={currentState}
          score={score}
          selectedAvatar={localModel.selectedAvatar}
          teamId={localModel.teamId}
          leader={leader}
        />
      );
    default:
      return <Navigate replace to="/" />;
  }
}
