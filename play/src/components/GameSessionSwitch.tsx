import React, { useState } from 'react';
import {
  IAPIClients,
  IChoice,
  IQuestion,
  IGameSession,
  IResponse,
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

interface GameSessionSwitchProps {
  apiClients: IAPIClients;
  currentTimer: number;
  hasRejoined: boolean;
  gameSession: IGameSession;
  localModel: LocalModel;
  newPoints: number;
}

export default function GameSessionSwitch({
  apiClients,
  currentTimer,
  hasRejoined,
  gameSession,
  localModel,
  newPoints,
}: GameSessionSwitchProps) {
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(
    !hasRejoined
  );
  const { currentState } = gameSession;
  const currentQuestion =
    gameSession.questions[gameSession.currentQuestionIndex] as IQuestion;
  const currentTeam = gameSession.teams.find( 
    (team) => team.id === localModel.teamId
  );
  // locally held score value for duration of gameSession, updates backend during each PHASE_X_RESULTS
  const score = currentTeam?.score ?? 0;
  // this condition is used to display the pregamecountdown only on initial game start
  // this prevents a player from rejoining into the first screen and continually getting the pregame countdown
  // placed into a separate variable for readability in the switch statement
  const isGameFirstStarting = isPregameCountdown && !hasRejoined;
  const isShortAnswerEnabled = currentQuestion?.isShortAnswerEnabled;
  const answerChoices =
  (isShortAnswerEnabled
    ? currentQuestion?.responses?.reduce(
        (acc: IChoice[], response: IResponse) => {
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
          } as IChoice)
      )) ?? [];
  switch (currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return isGameFirstStarting ? (
        <PregameCountdown setIsPregameCountdown={setIsPregameCountdown} />
      ) : (
        <GameInProgress
          {...gameSession}
          apiClients={apiClients}
          teamMemberAnswersId={localModel.teamMemberAnswersId}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={localModel.teamId}
          score={score}
          hasRejoined={hasRejoined}
          currentTimer={currentTimer}
          localModel={localModel}
          currentQuestionIndex={gameSession.currentQuestionIndex}
          isShortAnswerEnabled={isShortAnswerEnabled}
          gameSession={gameSession}
          newPoints={0}
        />
      );
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
      return (
        <GameInProgress
          {...gameSession}
          apiClients={apiClients}
          teamMemberAnswersId={localModel.teamMemberAnswersId}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={localModel.teamId}
          score={score}
          hasRejoined={hasRejoined}
          currentTimer={currentTimer}
          localModel={localModel}
          currentQuestionIndex={gameSession.currentQuestionIndex}
          isShortAnswerEnabled={isShortAnswerEnabled}
          gameSession={gameSession}
          newPoints={0}
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
          teamMemberAnswersId={localModel.teamMemberAnswersId}
          teamAvatar={localModel.selectedAvatar}
          answerChoices={answerChoices}
          teamId={localModel.teamId}
          score={score}
          hasRejoined={hasRejoined}
          currentTimer={currentTimer}
          localModel={localModel}
          currentQuestionIndex={gameSession.currentQuestionIndex}
          isShortAnswerEnabled={isShortAnswerEnabled}
          gameSession={gameSession}
          newPoints={newPoints}
        />
      );
    // case GameSessionState.PHASE_1_RESULTS:
    // case GameSessionState.PHASE_2_RESULTS:
    //   return (
    //     <PhaseResults
    //       {...gameSession}
    //       apiClients={apiClients}
    //       gameSession={gameSession}
    //       currentQuestionIndex={gameSession.currentQuestionIndex}
    //       teamAvatar={localModel.selectedAvatar}
    //       teamId={localModel.teamId}
    //       answerChoices={answerChoices}
    //       score={score}
    //       hasRejoined={hasRejoined}
    //       isShortAnswerEnabled={isShortAnswerEnabled}
    //     />
    //   );
    case GameSessionState.PHASE_2_START:
      return <StartPhase2 /> 

    case GameSessionState.FINAL_RESULTS:
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
