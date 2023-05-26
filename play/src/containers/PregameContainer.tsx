import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiClient,
  isNullOrUndefined,
  IGameSession,
  GameSessionState,
} from '@righton/networking';
import SplashScreen from '../pages/pregame/SplashScreen';
import EnterGameCode from '../pages/pregame/EnterGameCode';
import EnterPlayerName from '../pages/pregame/EnterPlayerName';
import SelectAvatar from '../pages/pregame/SelectAvatar';
import { PregameState, PregameModel, LocalSessionModel } from '../lib/PlayModels';
import { isGameCodeValid } from '../lib/HelperFunctions';

interface PregameFinished {
  apiClient: ApiClient;
  isConnectionError: boolean;
}

export default function Pregame({ apiClient, isConnectionError }: PregameFinished) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const [pregameState, setPregameState] = useState<PregameState>(
    PregameState.SPLASH_SCREEN
  );

  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(
    Math.floor(Math.random() * 6)
  );
  // TODO: coord with u/x for modal to pop up this error message
  const [APIerror, setAPIError] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars

  // on click of game code button, check if game code is valid
  // if game code is invalid, return false to display error
  // if game code is valid, store gameSessionId for future subscription and advance to ENTER_NAME state
  const handleGameCodeClick = async (
    inputGameCodeValue: string
  ): Promise<boolean> => {
    if (!isGameCodeValid(inputGameCodeValue)) {
      return false;
    }
    try {
      const gameSessionResponse = await apiClient.getGameSessionByCode(
        parseInt(inputGameCodeValue, 10)
      );
      if (isNullOrUndefined(gameSessionResponse)) {
        return false;
      }
      if (
        gameSessionResponse.currentState === GameSessionState.FINISHED ||
        gameSessionResponse.currentState === GameSessionState.NOT_STARTED
      ) {
        return false;
      }
      setGameSession(gameSessionResponse);
      setPregameState(PregameState.ENTER_NAME);
      return true;
    } catch (error) {
      return false;
    }
  };

  const addTeamToGame = async () => {
    const teamName = `${firstName} ${lastName}`;
    try {
      const team = await apiClient.addTeamToGameSessionId(
        gameSession!.id, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        teamName,
        null
      );
      if (!team) {
        setAPIError(true);
      } else {
        try {
          const teamMember = await apiClient.addTeamMemberToTeam(team.id, true, uuidv4());
          if (!teamMember) {
            setAPIError(true);
          }
          return { teamId: team.id, teamMemberId: teamMember.id };
        } catch (error) {
          setAPIError(true);
        }
      }
    } catch (error) {
      setAPIError(true);
    }
    return undefined;
  };
  
  const handleAvatarSelectClick = async () => {
    try {
      if (gameSession) {
        const teamInfo = await addTeamToGame();
        if (!teamInfo) {
          setAPIError(true);
          return;
        }
        const storageObject: LocalSessionModel = {
          gameSessionId: gameSession.id,
          teamId: teamInfo.teamId,
          teamMemberId: teamInfo.teamMemberId,
          selectedAvatar,
        };
        window.localStorage.setItem('rightOn', JSON.stringify(storageObject));
        navigate(`/game`);
      }
    }
    catch (error) {
      setAPIError(true);
    }
  };

  const handleGameInProgressFinished = () => {
    setPregameState(PregameState.SPLASH_SCREEN);
  };

  switch (pregameState) {
    case PregameState.SELECT_AVATAR:
      return (
        <SelectAvatar
          selectedAvatar={selectedAvatar}
          firstName={firstName}
          lastName={lastName}
          setSelectedAvatar={setSelectedAvatar}
          isSmallDevice={isSmallDevice}
          handleAvatarSelectClick={handleAvatarSelectClick}
        />
      );
    case PregameState.ENTER_NAME:
      return (
        <EnterPlayerName
          isSmallDevice={isSmallDevice}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          setPregameState={setPregameState}
        />
      );
    case PregameState.ENTER_GAME_CODE:
      return <EnterGameCode handleGameCodeClick={handleGameCodeClick} />;
    case PregameState.SPLASH_SCREEN:
    default:
      return <SplashScreen setPregameState={setPregameState} isConnectionError={isConnectionError}/>;
  }
}
