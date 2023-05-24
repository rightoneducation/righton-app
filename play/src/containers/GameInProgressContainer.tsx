import React, { useEffect, useState } from 'react';
import {
  ApiClient,
  IGameSession,
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
import { PregameModel } from '../lib/PlayModels';

interface GameInProgressContainerProps {
  isPregameCountdown: boolean;
  setIsPregameCountdown: (isPregameCountdown: boolean) => void;
  pregameModel: PregameModel;
  apiClient: ApiClient;
  handleGameInProgressFinished: () => void;
}

export default function GameInProgressContainer({
  isPregameCountdown,
  setIsPregameCountdown,
  pregameModel,
  apiClient,
  handleGameInProgressFinished,
}: GameInProgressContainerProps) {

  const [gameSession, setGameSession] = useState<IGameSession>(
    pregameModel.gameSession
  );
  const [currentState, setCurrentState] = useState<GameSessionState>(
    pregameModel.gameSession.currentState
  );
  const [isRejoin, setIsRejoin] = useState<boolean>(pregameModel.isRejoin); // eslint-disable-line @typescript-eslint/no-unused-vars
  const currentQuestion =
    gameSession?.questions[gameSession?.currentQuestionIndex ?? 0];
  const currentTeam = gameSession?.teams?.find(
    (team) => team.id === pregameModel.teamId
  );
  // locally held score value for duration of gameSession, updates backend during each PHASE_X_RESULTS
  const [score, setScore] = useState(currentTeam?.score ?? 0);
  const leader = true;
  const answerChoices = currentQuestion?.choices!.map((choice: IChoice) => ({ // eslint-disable-line @typescript-eslint/no-non-null-assertion
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  }));

  // subscribes to game on initial container load
  useEffect(() => {
    let gameSessionSubscription: any | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any
    gameSessionSubscription = apiClient.subscribeUpdateGameSession(
      gameSession.id,
      (response) => {
        if (response.currentState === GameSessionState.FINISHED) {
          handleGameInProgressFinished();
        }
        setGameSession({ ...gameSession, ...response });
        setCurrentState(response.currentState);
      }
    );
    console.debug(`subscribed to game session with id: ${gameSession.id}`);
    return () => {
      gameSessionSubscription?.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    case GameSessionState.TEAMS_JOINING:
      return <HowToPlay />;
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return isPregameCountdown ? (
        <PregameCountdown
          setIsPregameCountdown={setIsPregameCountdown}
        />
      ) : (
        <GameInProgress
          {...gameSession}
          teamAvatar={pregameModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={pregameModel.teamId}
          score={score}
          addTeamAnswerToTeamMember={addTeamAnswerToTeamMember}
          isRejoin={isRejoin}
          setIsRejoin={setIsRejoin}
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
          setIsRejoin={setIsRejoin}
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
          setIsRejoin={setIsRejoin}
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
