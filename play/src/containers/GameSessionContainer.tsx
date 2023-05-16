import React, { useState } from 'react';
import {
  ApiClient,
  IGameSession,
  GameSessionParser,
  GameSessionState,
  IAWSGameSession
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next'; // debug
import MockGameSession from '../mock/MockGameSession.json';
import JoinGameContainer from './JoinGameContainer';
import ConnectedGameContainer from './GameInProgressContainer';
import { JoinBasicGameData } from '../lib/PlayModels';

interface GameSessionContainerProps {
  apiClient: ApiClient;
}

export default function GameSessionContainer({ apiClient }: GameSessionContainerProps) {
  const [currentState, setCurrentState] = useState(GameSessionState.TEAMS_JOINING); 
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  const [teamAvatar, setTeamAvatar] = useState<number>(0);
  const subscribeToGame = (gameSessionId: string) => {
    let gameSessionSubscription: any | null = null;
    gameSessionSubscription =  apiClient.subscribeUpdateGameSession(gameSessionId, response => { 
      setGameSession({ ...gameSession, ...response });
      setCurrentState(response.currentState);
    });
    console.debug(`subscribed to game session with id: ${gameSessionId}`);
    return () => {
      gameSessionSubscription?.unsubscribe();
    };
  };

  const addTeamToGame = async (joinBasicGameData: JoinBasicGameData) => {
    const teamName = `${joinBasicGameData.firstName} ${joinBasicGameData.lastName}`;
    try {
      const team = await apiClient.addTeamToGameSessionId(joinBasicGameData.gameSessionId, teamName, null)
      if (!team) {
        console.error("Failed to add team")
      }
      else {
        apiClient.addTeamMemberToTeam(team.id, true, uuidv4())
        .then((teamMember) => {
          if (!teamMember) {
            console.error("Failed to add team member")
          }
        }).catch((error) => {
          console.error(error)
        })
      }
    }
    catch (error) {
      console.error(error)
    }
  };

  // when a player selects a team avatar, we need to add them to the game and subscribe to the game session
  // TODO: add in rejoin functionality, starting here 
  const handleJoinBasicGameFinished = (joinBasicGameData: JoinBasicGameData) => {
    setTeamAvatar(joinBasicGameData.selectedAvatar);
    addTeamToGame(joinBasicGameData);
    subscribeToGame(joinBasicGameData.gameSessionId);
  };

  const { i18n } = useTranslation(); // debug

  const changeLanguage = () => { // debug
    if (i18n.language === 'en') {
      i18n.changeLanguage('es');
    }
    else 
      i18n.changeLanguage('en');
  }

  switch (currentState) {
    case GameSessionState.TEAMS_JOINING:
      return ( 
        <>
          <button type='button' onClick={() => changeLanguage()} style={{position: 'absolute', top: 0, left: 0, zIndex: 5}}>lang</button>
          <JoinGameContainer handleJoinGameFinished={(joinBasicGameData) => handleJoinBasicGameFinished(joinBasicGameData)}/>
        </>
      );
    default:
      return gameSession && (
        <>
          <button type='button' onClick={() => changeLanguage()} style={{position: 'absolute', top: 0, left: 0, zIndex: 5}}>lang</button>
          <ConnectedGameContainer gameSession={gameSession} currentState={currentState} setCurrentState={setCurrentState} teamAvatar={teamAvatar} />
        </>
      );
     
  }
}
