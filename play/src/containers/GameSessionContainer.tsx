import React, { useState } from 'react';
import {
  IGameSession,
  IChoice,
  IAWSGameSession,
  GameSessionParser,
  GameSessionState,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import MockGameSession from '../mock/MockGameSession.json';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import JoinGame from '../pages/JoinGame';
import FinalResults from '../pages/FinalResults';
import StartPhase2 from '../pages/StartPhase2';
import { JoinGameState, FinalResultsState } from '../lib/PlayModels';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState( // eslint-disable-line @typescript-eslint/no-unused-vars
    // TODO: update exchange mock gamesession with subscription via @righton/networking
    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  // TODO: add gameSession subscription and update below states accordingly.
  const [joinGameState, setjoinGameState] = useState<JoinGameState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    JoinGameState.SPLASH_SCREEN
  );
  const [gameState, setGameState] = useState<GameSessionState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionState.PHASE_1_DISCUSS
  );
  const [finalResultsState, setFinalResultsState] = useState( // eslint-disable-line @typescript-eslint/no-unused-vars
    FinalResultsState.LEADERBOARD
  );
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true); // eslint-disable-line @typescript-eslint/no-unused-vars
  const selectedAvatar = 0;
  const leader = true;
  const teamId = '2d609343-de50-4830-b65e-71eb72bb9bef';

  const currentQuestion =
    gameSession.questions[gameSession.currentQuestionIndex ?? 0];
  const answerChoices = currentQuestion.choices!.map((choice: IChoice) => ({ // eslint-disable-line @typescript-eslint/no-non-null-assertion
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  }));

  const handlePregameTimerFinished = () => {
    setIsPregameCountdown(false);
  };

  switch (gameState) {
    case GameSessionState.TEAMS_JOINING:
      return <JoinGame joinGameState={joinGameState} />;
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
          currentState={gameState}
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
          currentState={gameState}
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
