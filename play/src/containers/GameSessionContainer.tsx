import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  ApiClient,
  Environment,
  IGameSession,
  IChoice,
  IAWSGameSession,
  GameSessionParser,
  GameSessionState,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import DefaultGameSession from '../lib/DefaultGameSession.json'
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import JoinGame from '../pages/JoinGame';
import FinalResults from '../pages/FinalResults';
import StartPhase2 from '../pages/StartPhase2';
import { FinalResultsState, JoinGameData } from '../lib/PlayModels';

export default function GameSessionContainer() {
  const apiClient = new ApiClient(Environment.Staging);
  let { gameSessionId } = useParams<{ gameSessionId: string }>();
  const [gameSession, setGameSession] = useState<IGameSession>(
    GameSessionParser.gameSessionFromAWSGameSession(
      DefaultGameSession as IAWSGameSession
  ) as IGameSession
  );
  
  const [teamAvatar, setTeamAvatar] = useState(0); 
  const [finalResultsState, setFinalResultsState] = useState( // eslint-disable-line @typescript-eslint/no-unused-vars
    FinalResultsState.LEADERBOARD
  );
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true); 
  const selectedAvatar = 0;
  const leader = true;
  const teamId = '2d609343-de50-4830-b65e-71eb72bb9bef';

  const currentQuestion =
    gameSession.questions[gameSession.currentQuestionIndex ?? 0];
  const answerChoices = currentQuestion.choices!.map((choice: IChoice) => ({ 
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  }));

  const handlePregameTimerFinished = () => {
    setIsPregameCountdown(false);
  };

  const handleJoinGameFinished = (joinGameData: JoinGameData) => {
    // const testGameSessionId = '819e1e7f-79d2-48f7-90a4-c301951a77aa';
    console.log("sup");

  //  console.log(joinGameData.gameSessionId)
  //   apiClient.getGameSession(joinGameData.gameSessionId).then(response => {
  //     console.log(response.id);
  //     console.log(response);
  //   });
   
    gameSessionId = joinGameData.gameSessionId;
    let gameSessionSubscription: any | null = null;
    gameSessionSubscription =  apiClient.subscribeUpdateGameSession(gameSessionId, response => { console.log(response)});
    

    setTeamAvatar(joinGameData.selectedAvatar);

    return () => {
      gameSessionSubscription?.unsubscribe();
    };
  };

  switch (gameSession.currentState) {
    case GameSessionState.TEAMS_JOINING:
      return <JoinGame handleJoinGameFinished={(joinGameData) => handleJoinGameFinished(joinGameData)}/>;
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
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
        />
      );
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
      return (
        <GameInProgress
          {...gameSession}
          teamAvatar={teamAvatar}
          answerChoices={answerChoices}
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
        />
      );
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <PhaseResults
          {...gameSession}
          gameSession={gameSession}
          currentQuestionIndex={gameSession.currentQuestionIndex ?? 0}
          currentState={gameSession.currentState}
          teamAvatar={teamAvatar}
          teamId={teamId}
          answerChoices={answerChoices}
        />
      );
    case GameSessionState.PHASE_2_START:
      return <StartPhase2 />;
    case GameSessionState.FINAL_RESULTS:
      return (
        <FinalResults
          {...gameSession}
          currentState={gameSession.currentState}
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
          answerChoices={answerChoices}
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
        />
      );
  }
}
