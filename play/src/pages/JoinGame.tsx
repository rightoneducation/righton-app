import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ApiClient,
  Environment,
  isNullOrUndefined,
  GameSessionState,
} from '@righton/networking';
import SplashScreen from '../components/joingame/SplashScreen';
import EnterGameCode from '../components/joingame/EnterGameCode';
import EnterPlayerName from '../components/joingame/EnterPlayerName';
import SelectAvatar from '../components/joingame/SelectAvatar';
import HowToPlay from '../components/joingame/HowToPlay';
import { JoinGameState, JoinGameData } from '../lib/PlayModels';


interface JoinGameFinished {
  handleJoinGameFinished: (joinGameData: JoinGameData) => void;
}

export default function JoinGame({handleJoinGameFinished}: JoinGameFinished) {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const apiClient = new ApiClient(Environment.Staging);

  const [joinGameState, setJoinGameState] = useState<JoinGameState>(
    JoinGameState.SPLASH_SCREEN
  );


  const [inputError, setInputError] = useState(false); 
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState(''); 
  const [selectedAvatar, setSelectedAvatar] = useState<number>(Math.floor(Math.random() * 6)); 
  const [gameSessionId, setGameSessionId] = useState(''); 

  // on click of game code button, check if game code is valid 
  // if game code is invalid, set inputError to true to display error message
  // if game code is valid, store gameSessionId for future subscription and advance to ENTER_NAME state
  const handleGameCodeClick = (inputGameCodeValue: string) => {
    if (isNullOrUndefined(inputGameCodeValue)) {
      setInputError(true);
      return;
    }
    apiClient.getGameSessionByCode(parseInt(inputGameCodeValue, 10))
      .then((gameSessionResponse) => {
        if (isNullOrUndefined(gameSessionResponse)) {
          setInputError(true);
          return;
        } 
        if (
          gameSessionResponse.currentState === GameSessionState.FINISHED ||
          gameSessionResponse.currentState === GameSessionState.NOT_STARTED) {
          setInputError(true);
          return;
        }
        setGameSessionId(gameSessionResponse.id);
        setJoinGameState(JoinGameState.ENTER_NAME);
      })
      .catch(() => {
        setInputError(true);
      }
    );
  }
  
  const handleAvatarSelectClick = () => {
    const joinGameData = {
      gameSessionId,
      firstName,
      lastName,
      selectedAvatar,
    }
    handleJoinGameFinished(joinGameData);
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
      return (
        <EnterGameCode
          handleGameCodeClick={handleGameCodeClick}
          inputError={inputError}
        />
      );
    case JoinGameState.SPLASH_SCREEN:
    default:
      return <SplashScreen setJoinGameState={setJoinGameState} />;
  }
}
