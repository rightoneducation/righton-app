import React, { useState } from 'react';
import {
  IGameSession,
  IChoice,
  GameSessionState,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import FinalResults from '../pages/FinalResults';
import StartPhase2 from '../pages/StartPhase2';
import { FinalResultsState, JoinBasicGameData } from '../lib/PlayModels';

interface ConnectedGameContainerProps {
  gameSession: IGameSession;
  currentState: GameSessionState;
  setCurrentState: (state: GameSessionState) => void;
  teamAvatar: number;
}

export default function GameInProgressContainer({gameSession, currentState, teamAvatar} : ConnectedGameContainerProps) {
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true); 
  const currentQuestion =   gameSession?.questions[gameSession?.currentQuestionIndex ?? 0];
  const teamId = '2d609343-de50-4830-b65e-71eb72bb9bef';
  const [finalResultsState, setFinalResultsState] = useState( // eslint-disable-line @typescript-eslint/no-unused-vars
  FinalResultsState.LEADERBOARD
);
  const leader = true;
  const [answerChoices, setAnswerChoices] = useState<{id: string, text: string, isCorrectAnswer: boolean, reason: string}[]>(currentQuestion?.choices!.map((choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  })));

  const handlePregameTimerFinished = () => {
    setIsPregameCountdown(false);
  };

  switch (currentState) {
  case GameSessionState.CHOOSE_CORRECT_ANSWER:
    return isPregameCountdown ? (
      <PregameCountdown
        handlePregameTimerFinished={handlePregameTimerFinished}
      />
    ) : (
      <GameInProgress
        {...gameSession}
        teamAvatar={teamAvatar}
        answerChoices={answerChoices}
        currentState={currentState}
        teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
      />
    );
  case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
  case GameSessionState.PHASE_1_DISCUSS:
  case GameSessionState.PHASE_2_DISCUSS:
    return (
      <GameInProgress
        {...gameSession}
        teamAvatar={teamAvatar}
        answerChoices={answerChoices}
        currentState={currentState}
        teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
      />
    );
  case GameSessionState.PHASE_1_RESULTS:
  case GameSessionState.PHASE_2_RESULTS:
    return (
      <PhaseResults
        {...gameSession}
        gameSession={gameSession}
        currentQuestionIndex={gameSession!.currentQuestionIndex ?? 0}
        currentState={currentState}
        teamAvatar={teamAvatar}
        teamId={teamId}
        answerChoices={answerChoices}
      />
    );
  case GameSessionState.PHASE_2_START:
    return <StartPhase2 />;
  case GameSessionState.FINAL_RESULTS:
  default: 
    return (
      <FinalResults
        {...gameSession}
        currentState={currentState}
        score={120}
        selectedAvatar={teamAvatar}
        teamId={teamId}
        leader={leader}
        finalResultsState={finalResultsState}
      />
    );
  }
}