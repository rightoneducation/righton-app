import React, { useState } from 'react';
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
import { PregameState, PregameModel, LocalSession } from '../lib/PlayModels';
import { isGameCodeValid } from '../lib/HelperFunctions';
import GameInProgressContainer from './GameInProgressContainer';

interface PregameFinished {
  apiClient: ApiClient;
}

export default function Pregame({ apiClient }: PregameFinished) {
  const theme = useTheme();
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
  const [pregameModel, setPregameModel] = useState<PregameModel | null>(null);
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
        setPregameModel({
          gameSession,
          teamId: teamInfo.teamId,
          teamMemberId: teamInfo.teamMemberId,
          selectedAvatar,
          isRejoin: false,
        });
        const storageObject: LocalSession = { gameSessionId: gameSession.id, teamId: teamInfo.teamId, teamMemberId: teamInfo.teamMemberId, selectedAvatar };
        window.localStorage.setItem('rightOn', JSON.stringify(storageObject));
        setPregameState(PregameState.FINISHED);
      }
    }
    catch (error) {
      setAPIError(true);
    }
  };

  const handleGameInProgressFinished = () => {
    window.localStorage.removeItem('rightOn');
    setPregameState(PregameState.SPLASH_SCREEN);
  };

  const handleRejoinSession = async () => {
    const storageObject = window.localStorage.getItem('rightOn');
    if (storageObject) {
      const localSession: LocalSession = JSON.parse(storageObject);
      const localGameSession = await apiClient.getGameSession(localSession.gameSessionId);
      
      setPregameModel({
        gameSession: localGameSession,
        teamId: localSession.teamId,
        teamMemberId: localSession.teamMemberId,
        selectedAvatar: localSession.selectedAvatar,
        isRejoin: true,
      });
      setPregameState(PregameState.FINISHED);
    }
  };

  switch (pregameState) {
    case PregameState.FINISHED:
      return (
        pregameModel && 
        <GameInProgressContainer
          apiClient={apiClient}
          pregameModel={pregameModel} // eslint-disable-line @typescript-eslint/no-non-null-assertion
          handleGameInProgressFinished={handleGameInProgressFinished}
        />
      )
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
      return <SplashScreen setPregameState={setPregameState} handleRejoinSession={handleRejoinSession}/>;
  }
}
