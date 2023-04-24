import React, { useState } from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
  GameSessionState
} from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import GameInProgress from '../pages/GameInProgress'; 
import PhaseResults from '../pages/PhaseResults'; 
import JoinGame from '../pages/JoinGame';
import { JoinGameState } from '../lib/PlayModels';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState(  // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [joinGameState, setjoinGameState] = useState<JoinGameState>(JoinGameState.SPLASHSCREEN);
  const [tempPhase, setTempPhase] = useState<GameSessionState>(GameSessionState.PHASE_1_RESULTS);
 
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    switch (value) {
      case 0:
        setjoinGameState(JoinGameState.SPLASHSCREEN);
        break;
      case 1:
        setjoinGameState(JoinGameState.ENTERGAMECODE);
        break;
      case 2:
        setjoinGameState(JoinGameState.ENTERNAME);
        break;
      case 3:
        setjoinGameState(JoinGameState.SELECTAVATAR);
        break;
      case 4:
        setjoinGameState(JoinGameState.HOWTOPLAY);
        break;
      default:
        // Handle invalid value here
        break;
    }
  };

  switch (tempPhase) {
    case GameSessionState.TEAMS_JOINING:
      return (
        <>
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
          <div>
            <input
              type="radio"
              name="option"
              value="0"
              checked={joinGameState === JoinGameState.SPLASHSCREEN}
              onChange={handleOptionChange}
            />
            <input
              type="radio"
              name="option"
              value="1"
              checked={joinGameState === JoinGameState.ENTERGAMECODE}
              onChange={handleOptionChange}
            />
            <input
              type="radio"
              name="option"
              value="2"
              checked={joinGameState === JoinGameState.ENTERNAME}
              onChange={handleOptionChange}
            />
            <input
              type="radio"
              name="option"
              value="3"
              checked={joinGameState === JoinGameState.SELECTAVATAR}
              onChange={handleOptionChange}
            />
            <input
              type="radio"
              name="option"
              value="4"
              checked={joinGameState === JoinGameState.HOWTOPLAY}
              onChange={handleOptionChange}
            />
          </div>
        </div>
        <JoinGame joinGameState={joinGameState} />
      </>
      );
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
      return (
        <GameInProgress
              {...gameSession}
              teamAvatar={teamAvatar}
              teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
            /> 
      );
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <PhaseResults 
          {...gameSession}
          teamAvatar={teamAvatar}
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
        />           
      )
      default:
        return (
        <GameInProgress
        {...gameSession}
        teamAvatar={teamAvatar}
        teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
      /> );
  }
}
