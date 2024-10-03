import React, { useState, useEffect } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';
import {
  IAPIClients,
  APIClients,
  isNullOrUndefined,
  IGameSession,
  GameSessionState,
} from '@righton/networking';
import SplashScreen from '../pages/pregame/SplashScreen';
import JoinGame from '../pages/pregame/JoinGame';
import {
  PregameState,
  LocalModel,
  StorageKey,
} from '../lib/PlayModels';
import { isGameCodeValid, fetchLocalData } from '../lib/HelperFunctions';

interface PregameFinished {
  apiClients: IAPIClients;
}

export function PregameContainer({ apiClients }: PregameFinished) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedDevice = useMediaQuery(theme.breakpoints.down('md'));
  const [shouldShowAvatarSelect, setShouldShowAvatarSelect] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [pregameState, setPregameState] = useState<PregameState>(
    PregameState.SPLASH_SCREEN
  );
  // retreive local storage data so that player can choose to rejoin game
  const [rejoinGameObject, setRejoinGameObject] = useState<LocalModel | null>(
    useLoaderData() as LocalModel
  );
  // state variables used to collect player information in pregame phase
  // information is loaded into local storage on select avatar screen and passed to /game
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(
    Math.floor(Math.random() * 6)
  );

  // TODO: coord with u/x for modal to pop up this error message
  const [isAPIerror, setIsAPIError] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars

  // if player has opted to rejoin old game session through modal on SplashScreen, set local storage data and navigate to game
  const handleRejoinSession = () => {
    const storageObject: LocalModel = {
      ...rejoinGameObject!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      hasRejoined: true,
    };
    window.localStorage.setItem(StorageKey, JSON.stringify(storageObject));
    navigate(`/game`);
  };

  // if player doesn't want to rejoin, remove the localStorage and set rejoinGameObject to null
  const handleDontRejoinSession = () => {
    window.localStorage.removeItem(StorageKey);
    setRejoinGameObject(null);
  };

  // create team and teammember on backend
  const addTeamToGame = async (inputGameSession: IGameSession) => {
    const teamName = `${firstName} ${lastName}`;
    try {
      const team = await apiClients.team.addTeamToGameSessionId(
        inputGameSession!.id, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        teamName,
        null,
        selectedAvatar
      );
      if (!team) {
        setIsAPIError(true);
      } else {
        try {
          const teamMember = await apiClients.teamMember.addTeamMemberToTeam(
            team.id,
            true,
            uuidv4()
          );
          if (!teamMember) {
            setIsAPIError(true);
          }
          return { teamId: team.id, teamMemberAnswersId: teamMember.id };
        } catch (error) {
          console.log(error);
          setIsAPIError(true);
        }
      }
    } catch (error) {
      console.log(error);
      setIsAPIError(true);
    }
    return undefined;
  };

  // on click of avatar select button, add team and team member, store local storage data, and navigate to game
  const handleAvatarSelectClick = async (gameSessionResponse: IGameSession) => {
    try {
      if (gameSessionResponse) {
        const teamInfo = await addTeamToGame(gameSessionResponse);
        if (!teamInfo) {
          setIsAPIError(true);
          return;
        }
        const storageObject: LocalModel = {
          currentTime: new Date().getTime() / 60000,
          gameSessionId: gameSessionResponse.id,
          teamMemberAnswersId: teamInfo.teamMemberAnswersId,
          teamId: teamInfo.teamId,
          teamName: `${firstName} ${lastName}`,
          selectedAvatar,
          hasRejoined: false,
          currentTimer: gameSessionResponse.phaseOneTime,
          answer: null,
        };
        window.localStorage.setItem(StorageKey, JSON.stringify(storageObject));
        navigate(`/game`);
      }
    } catch (error) {
      setIsAPIError(true);
    }
  };

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
      const gameSessionResponse = await apiClients.gameSession.getGameSessionByCode(
        parseInt(inputGameCodeValue, 10)
      );
      console.log(gameSessionResponse);
      if (isNullOrUndefined(gameSessionResponse)) {
        return false;
      }
      if (
        gameSessionResponse.currentState !== GameSessionState.TEAMS_JOINING
      ) {
        return false;
      }
      setGameSession(gameSessionResponse);
      handleAvatarSelectClick(gameSessionResponse);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  
  switch (pregameState) {
    case PregameState.ENTER_GAME_CODE:
      return (
        <JoinGame
          isSmallDevice={isSmallDevice}
          isMedDevice={isMedDevice}
          shouldShowAvatarSelect={shouldShowAvatarSelect}
          setShouldShowAvatarSelect={setShouldShowAvatarSelect}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          handleGameCodeClick={handleGameCodeClick}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          isButtonDisabled={isButtonDisabled}
          setIsButtonDisabled={setIsButtonDisabled}
        />
      );
    case PregameState.SPLASH_SCREEN:
    default:
      return (
        <SplashScreen
          rejoinGameObject={rejoinGameObject}
          setPregameState={setPregameState}
          handleRejoinSession={handleRejoinSession}
          handleDontRejoinSession={handleDontRejoinSession}
        />
      );
  }
}

export function PregameLocalModelLoader(): LocalModel | null {
  return fetchLocalData();
}
