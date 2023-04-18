import React, { useState } from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
} from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import GameInProgress from '../pages/GameInProgress'; // eslint-disable-line @typescript-eslint/no-unused-vars
import JoinGame from '../pages/JoinGame';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState(  // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [joinGamePhase, setjoinGamePhase] = useState<number>(0);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setjoinGamePhase(parseInt(event.target.value, 10));
  };

  return (
    // <GameInProgress
    //   {...gameSession}
    //   teamAvatar={teamAvatar}
    //   teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
    // />
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
        <div>
          <input
            type="radio"
            name="option"
            value="0"
            checked={joinGamePhase === 0}
            onChange={handleOptionChange}
          />
          <input
            type="radio"
            name="option"
            value="1"
            checked={joinGamePhase === 1}
            onChange={handleOptionChange}
          />
          <input
            type="radio"
            name="option"
            value="2"
            checked={joinGamePhase === 2}
            onChange={handleOptionChange}
          />
          <input
            type="radio"
            name="option"
            value="3"
            checked={joinGamePhase === 3}
            onChange={handleOptionChange}
          />
          <input
            type="radio"
            name="option"
            value="4"
            checked={joinGamePhase === 4}
            onChange={handleOptionChange}
          />
        </div>
      </div>

      <JoinGame joinGamePhase={joinGamePhase} />
    </>
  );
}
