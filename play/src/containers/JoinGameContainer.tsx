import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ApiClient,
  Environment,
  isNullOrUndefined,
  GameSessionState,
} from '@righton/networking';
import SplashScreen from '../pages/joingame/SplashScreen';
import EnterGameCode from '../pages/joingame/EnterGameCode';
import EnterPlayerName from '../pages/joingame/EnterPlayerName';
import SelectAvatar from '../pages/joingame/SelectAvatar';
import HowToPlay from '../pages/joingame/HowToPlay';
import { JoinGameState, JoinBasicGameData } from '../lib/PlayModels';
import { isGameCodeValid, isNameValid } from '../lib/HelperFunctions';

interface JoinGameFinished {
  handleJoinGameFinished: (JoinBasicGameData: JoinBasicGameData) => void;
}

export default function JoinGame({ handleJoinGameFinished }: JoinGameFinished) {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const apiClient = new ApiClient(Environment.Staging);

  const [joinGameState, setJoinGameState] = useState<JoinGameState>(
    JoinGameState.SPLASH_SCREEN
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(
    Math.floor(Math.random() * 6)
  );
  const [gameSessionId, setGameSessionId] = useState('');

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
      setGameSessionId(gameSessionResponse.id);
      setJoinGameState(JoinGameState.ENTER_NAME);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleAvatarSelectClick = () => {
    if (isNameValid(firstName) && isNameValid(lastName)) {
      const joinBasicGameData = {
        gameSessionId,
        firstName,
        lastName,
        selectedAvatar,
      };
      handleJoinGameFinished(joinBasicGameData);
      setJoinGameState(JoinGameState.HOW_TO_PLAY);
    }
  };

  switch (joinGameState) {
    case JoinGameState.HOW_TO_PLAY:
      return <HowToPlay />;
    case JoinGameState.SELECT_AVATAR:
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
    case JoinGameState.ENTER_NAME:
      return (
        <EnterPlayerName
          isSmallDevice={isSmallDevice}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          setJoinGameState={setJoinGameState}
        />
      );
    case JoinGameState.ENTER_GAME_CODE:
      return <EnterGameCode handleGameCodeClick={handleGameCodeClick} />;
    case JoinGameState.SPLASH_SCREEN:
    default:
      return <SplashScreen setJoinGameState={setJoinGameState} />;
  }
}
