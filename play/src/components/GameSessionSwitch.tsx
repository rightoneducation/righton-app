import React, { useState } from 'react';
import {
  IAPIClients,
  IChoice,
  IQuestion,
  IGameSession,
  IPhase,
  GameSessionState,
  IHostTeamAnswersResponse,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Navigate } from 'react-router-dom';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import FinalResultsContainer from '../containers/FinalResultsContainer';
import StartPhase2 from '../pages/StartPhase2';
import { LocalModel } from '../lib/PlayModels';

interface GameSessionSwitchProps {
  apiClients: IAPIClients;
  currentTimer: number;
  hasRejoined: boolean;
  gameSession: IGameSession;
  isAddTime: boolean;
  localModel: LocalModel;
  newPoints: number;
}

export default function GameSessionSwitch({
  apiClients,
  currentTimer,
  hasRejoined,
  gameSession,
  isAddTime,
  localModel,
  newPoints,
}: GameSessionSwitchProps) {
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(
    !hasRejoined
  );
  const { currentState } = gameSession;
  const currentPhase = gameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || gameSession.currentState === GameSessionState.PHASE_1_DISCUSS || gameSession.currentState === GameSessionState.PHASE_2_START ? IPhase.ONE : IPhase.TWO;
  const currentQuestion =
    gameSession.questions[gameSession.currentQuestionIndex] as IQuestion;
  const responses = currentPhase === IPhase.ONE ? currentQuestion.answerData.phase1.responses : currentQuestion.answerData.phase2.responses;

  const currentTeam = gameSession.teams.find( 
    (team) => team.id === localModel.teamId
  );
  // locally held score value for duration of gameSession, updates backend during each PHASE_X_RESULTS
  const score = currentTeam?.score ?? 0;
  // this condition is used to display the pregamecountdown only on initial game start
  // this prevents a player from rejoining into the first screen and continually getting the pregame countdown
  // placed into a separate variable for readability in the switch statement
  const isGameFirstStarting = isPregameCountdown && !hasRejoined && gameSession.currentQuestionIndex === 0;
  const isShortAnswerEnabled = currentQuestion?.isShortAnswerEnabled;
  const answerChoices =
  (isShortAnswerEnabled
    ? responses.reduce(
        (acc: IChoice[], response: IHostTeamAnswersResponse) => {
          console.log(response);
          const shouldAddResponse = 
            (currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER && 
            currentState !== GameSessionState.PHASE_1_DISCUSS) 
              ? (response.isSelectedMistake || response.isCorrect) 
              : true;
          if (shouldAddResponse) {
            acc.push({
              id: uuidv4(),
              text: response.rawAnswer,
              isAnswer: response.isCorrect,
            } as IChoice);
          }
          return acc;
        },
        []
      )
    : currentQuestion?.choices?.map(
        (choice: IChoice) =>
          ({
            id: uuidv4(),
            text: choice.text,
            isAnswer: choice.isAnswer,
            reason: choice.reason ?? '',
          } as IChoice) ?? []
      )
    );
  switch (currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return isGameFirstStarting ? (
        <PregameCountdown setIsPregameCountdown={setIsPregameCountdown} currentTimer={currentTimer}/>
      ) : (
        <GameInProgress
          {...gameSession}
          apiClients={apiClients}
          teamMemberAnswersId={localModel.teamMemberAnswersId}
          teamId={localModel.teamId}
          teamName={localModel.teamName}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          score={score}
          hasRejoined={hasRejoined}
          currentTimer={currentTimer}
          localModel={localModel}
          isAddTime={isAddTime}
          currentQuestionIndex={gameSession.currentQuestionIndex}
          isShortAnswerEnabled={isShortAnswerEnabled}
          gameSession={gameSession}
        />
      );
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
      return (
        <GameInProgress
          {...gameSession}
          apiClients={apiClients}
          teamMemberAnswersId={localModel.teamMemberAnswersId}
          teamId={localModel.teamId}
          teamName={localModel.teamName}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          score={score}
          hasRejoined={hasRejoined}
          currentTimer={currentTimer}
          localModel={localModel}
          isAddTime={isAddTime}
          currentQuestionIndex={gameSession.currentQuestionIndex}
          isShortAnswerEnabled={isShortAnswerEnabled}
          gameSession={gameSession}
        />
      );
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.PHASE_2_DISCUSS:
      return (
        <GameInProgress
          {...gameSession}
          // adding a key here to trigger a rerender of the component, resetting backendAnswer after answering phases
          key={uuidv4()}
          apiClients={apiClients}
          teamName={localModel.teamName}
          teamMemberAnswersId={localModel.teamMemberAnswersId}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={localModel.teamId}
          score={score}
          hasRejoined={hasRejoined}
          currentTimer={currentTimer}
          localModel={localModel}
          isAddTime={isAddTime}
          currentQuestionIndex={gameSession.currentQuestionIndex}
          isShortAnswerEnabled={isShortAnswerEnabled}
          gameSession={gameSession}
          newPoints={newPoints}
        />
      );

    case GameSessionState.PHASE_2_START:
      return <StartPhase2 /> 

    case GameSessionState.FINAL_RESULTS:
    case GameSessionState.TEAMS_JOINING:
      return (
        <FinalResultsContainer
          {...gameSession}
          currentState={currentState}
          score={score}
          selectedAvatar={localModel.selectedAvatar}
          teamId={localModel.teamId}
        />
      );
    default:
      return <Navigate replace to="/" />;
  }
}