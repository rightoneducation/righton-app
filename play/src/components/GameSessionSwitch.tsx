import React, { useState } from 'react';
import {
  ApiClient,
  IChoice,
  IQuestion,
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
import { PregameModel } from '../lib/PlayModels';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
  isRejoin: boolean;
  gameSession: IGameSession;
  pregameModel: PregameModel;
}

export default function GameInProgressContainer({
  apiClient,
  isRejoin,
  gameSession,
  pregameModel,
}: GameInProgressContainerProps) {
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(!isRejoin);
  const { currentState } = gameSession;
  const currentQuestion =
    gameSession.questions[gameSession.currentQuestionIndex ?? 0];
  const currentTeam = gameSession.teams?.find(
    (team) => team.id === pregameModel.teamId
  );
  // locally held score value for duration of gameSession, updates backend during each PHASE_X_RESULTS
  const [score, setScore] = useState(currentTeam?.score ?? 0);
  const leader = true;
  const answerChoices =
    currentQuestion?.choices!.map((choice: IChoice) => ({ // eslint-disable-line @typescript-eslint/no-non-null-assertion
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

  const handleUpdateScore = (inputScore: number) => {
    updateTeamScore(pregameModel.teamId, inputScore);
    setScore(inputScore);
  };

  switch (currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return isPregameCountdown && !isRejoin ? (
        <PregameCountdown setIsPregameCountdown={setIsPregameCountdown} />
      ) : (
        <GameInProgress
          {...gameSession}
          teamAvatar={pregameModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={pregameModel.teamId}
          score={score}
          addTeamAnswerToTeamMember={addTeamAnswerToTeamMember}
          isRejoin={isRejoin}
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
          isRejoin={isRejoin}
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
          isRejoin={isRejoin}
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
          selectedAvatar={pregameModel.selectedAvatar}
          teamId={pregameModel.teamId}
          leader={leader}
        />
      );
    default:
      return <Navigate replace to="/" />;
  }
}
