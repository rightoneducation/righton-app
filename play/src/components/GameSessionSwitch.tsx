import React, { useState } from 'react';
import {
  ApiClient,
  IChoice,
  IQuestion,
  IGameSession,
  GameSessionState,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import FinalResultsContainer from '../containers/FinalResultsContainer';
import StartPhase2 from '../pages/StartPhase2';
import { PregameModel } from '../lib/PlayModels';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
  gameSession: IGameSession;
  pregameModel: PregameModel;
}

export default function GameInProgressContainer({
  apiClient,
  gameSession,
  pregameModel,
}: GameInProgressContainerProps) {
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true);
  const { currentState } = gameSession;
  const currentQuestion =
    gameSession.questions[gameSession.currentQuestionIndex!]; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const currentTeam = gameSession.teams!.find( // eslint-disable-line @typescript-eslint/no-non-null-assertion
    (team) => team.id === pregameModel.teamId
  );
  // locally held score value for duration of gameSession, updates backend during each PHASE_X_RESULTS
  const [score, setScore] = useState(currentTeam?.score ?? 0);
  const leader = true;
  const answerChoices =
    currentQuestion?.choices?.map((choice: IChoice) => ({ 
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

  switch (currentState) {
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
          currentQuestionIndex={gameSession.currentQuestionIndex ?? 0} 
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