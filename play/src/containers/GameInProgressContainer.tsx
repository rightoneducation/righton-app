import React, { useState } from 'react';
import {
  IGameSession,
  IChoice,
  IQuestion,
  GameSessionState,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import FinalResults from '../pages/FinalResults';
import StartPhase2 from '../pages/StartPhase2';
import { FinalResultsState, JoinBasicGameData } from '../lib/PlayModels';

interface GameInProgressContainerProps {
  gameSession: IGameSession;
  teamId: string;
  currentState: GameSessionState;
  setCurrentState: (state: GameSessionState) => void;
  teamAvatar: number;
  addTeamAnswerToTeamMember: (question: IQuestion, answerText: string, gameSessionState: GameSessionState) => void;
  updateTeamScore: (teamId: string, score: number) => void;
}

export default function GameInProgressContainer({gameSession, teamId, currentState, teamAvatar, addTeamAnswerToTeamMember, updateTeamScore} : GameInProgressContainerProps) {
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true); 
  const currentQuestion =   gameSession?.questions[gameSession?.currentQuestionIndex ?? 0];
  const currentTeam = gameSession?.teams?.find((team) => team.id === teamId);
  const [score, setScore] = useState(currentTeam?.score ?? 0);
  const leader = true;
  const answerChoices = currentQuestion?.choices!.map((choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  }));
  
  const handlePregameTimerFinished = () => {
    setIsPregameCountdown(false);
  };

  const handleUpdateScore = (inputScore: number) => {
    setScore(inputScore);
    updateTeamScore(teamId, inputScore);
  }

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
        teamId={teamId}
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
        teamAvatar={teamAvatar}
        answerChoices={answerChoices}
        teamId={teamId}
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
        currentQuestionIndex={gameSession!.currentQuestionIndex ?? 0}
        teamAvatar={teamAvatar}
        teamId={teamId}
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
      <FinalResults
        {...gameSession}
        currentState={currentState}
        score={score}
        selectedAvatar={teamAvatar}
        teamId={teamId}
        leader={leader}
      />
    );
  }
}