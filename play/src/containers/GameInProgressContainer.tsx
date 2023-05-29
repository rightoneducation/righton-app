import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  ApiClient,
  IChoice,
  IQuestion,
  GameSessionState,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HowToPlay from '../pages/pregame/HowToPlay';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import FinalResultsContainer from './FinalResultsContainer';
import StartPhase2 from '../pages/StartPhase2';
import { LocalSessionModel, PregameModel } from '../lib/PlayModels';
import useSubscribeGameSession from '../hooks/useSubscribeGameSession';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export function GameInProgressContainer({apiClient}:GameInProgressContainerProps) {
  const pregameModel = useLoaderData() as PregameModel;
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true);
  // subscribes to gameSession using useSubscribeGameSession hook (uses useSyncExternalStore)
  const gameSession = useSubscribeGameSession(pregameModel.gameSessionId, apiClient);
  const currentState  = gameSession ? gameSession.currentState : GameSessionState.TEAMS_JOINING;
  const currentQuestion =
    gameSession?.questions[gameSession.currentQuestionIndex ?? 0];
  const currentTeam = gameSession?.teams?.find((team) => team.id === pregameModel.teamId);
  // locally held score value for duration of gameSession, updates backend during each PHASE_X_RESULTS
  const [score, setScore] = useState(currentTeam?.score ?? 0);
  const leader = true;
  const answerChoices = currentQuestion?.choices!.map((choice: IChoice) => ({ // eslint-disable-line @typescript-eslint/no-non-null-assertion
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  })) ?? [];

  const addTeamAnswerToTeamMember = async (
    question: IQuestion,
    answerText: string,
    gameSessionState: GameSessionState
  ) => {
    try {
      await apiClient.addTeamAnswer(
        pregameModel.teamMemberId,
        question.id,
        answerText,
        gameSessionState === GameSessionState.CHOOSE_CORRECT_ANSWER,
        gameSessionState !== GameSessionState.CHOOSE_CORRECT_ANSWER
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateTeamScore = async (inputTeamId: string, inputScore: number) => {
    try {
      await apiClient.updateTeam({ id: inputTeamId, score: inputScore });
    } catch (error) {
      console.error(error);
    }
  };
  
  const handlePregameTimerFinished = () => {
    setIsPregameCountdown(false);
  };

  const handleUpdateScore = (inputScore: number) => {
    updateTeamScore(pregameModel.teamId, inputScore);
    setScore(inputScore);
  };

  try { // eslint-disable-line no-useless-catch
    throw new Error("Division by zero");

} catch (error) {
  throw error;
}
  switch (currentState) {
    case GameSessionState.TEAMS_JOINING:
      return <HowToPlay />;
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return isPregameCountdown ? (
        <PregameCountdown
          handlePregameTimerFinished={handlePregameTimerFinished}
        />
      ) : (
        <GameInProgress
          {...gameSession}
          teamAvatar={pregameModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={pregameModel.teamId}
          score={score}
          addTeamAnswerToTeamMember={addTeamAnswerToTeamMember}
        />
      );
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.PHASE_2_DISCUSS:
      return (
        <GameInProgress
          {...gameSession}
          teamAvatar={pregameModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={pregameModel.teamId}
          score={score}
          addTeamAnswerToTeamMember={addTeamAnswerToTeamMember}
        />
      );
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <PhaseResults
          {...gameSession}
          gameSession={gameSession}
          currentQuestionIndex={gameSession!.currentQuestionIndex ?? 0} // eslint-disable-line @typescript-eslint/no-non-null-assertion
          teamAvatar={pregameModel.selectedAvatar}
          teamId={pregameModel.teamId}
          answerChoices={answerChoices}
          score={score}
          handleUpdateScore={handleUpdateScore}
        />
      );
    case GameSessionState.PHASE_2_START:
      return <StartPhase2 />;
    case GameSessionState.FINAL_RESULTS:
    default:
      return (
        <FinalResultsContainer
          {...gameSession}
          currentState={currentState}
          score={score}
          selectedAvatar={pregameModel.selectedAvatar}
          teamId={pregameModel.teamId}
          leader={leader}
        />
      );
  }
}

// preloads game data from local storage
export const GameInProgressLoader = async () => {
  const pregameModel = JSON.parse(window.localStorage.getItem('rightOn') ?? '');
  if (pregameModel === null) {
    throw Error('Local data error');
  }
  return pregameModel;
};