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
import { JoinGameState } from '../lib/PlayModels';



export default function JoinGame() {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const apiClient = new ApiClient(Environment.Staging);

  const [joinGameState, setJoinGameState] = useState<JoinGameState>(
    JoinGameState.SPLASH_SCREEN
  );
  const [inputError, setInputError] = useState(false); 
  const [avatar, setAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [selectedAvatar, setSelectedAvatar] = useState<number>(Math.floor(Math.random() * 6)); // default selection is random number between 0 and 5
  const [gameSessionId, setGameSessionId] = useState(''); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [playerName, setPlayerName] = useState(''); // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleSplashScreenClick = () => {
    setJoinGameState(JoinGameState.ENTER_GAME_CODE);
  }

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
      .catch((e) => {
        setInputError(true);
      }
    );
  }

  const handlePlayerNameClick = (inputFirstName: string, inputLastName: string) => {
    setPlayerName(`${inputFirstName} ${inputLastName}`);
    console.log(playerName);
    setJoinGameState(JoinGameState.SELECT_AVATAR);
  };
  
  const handleAvatarSelectClick = (inputAvatar: number) => {
    setAvatar(inputAvatar);
  };

  switch (joinGameState) {
    case JoinGameState.HOW_TO_PLAY:
      return <HowToPlay />;
    case JoinGameState.SELECT_AVATAR:
      return (
        <SelectAvatar
          selectedAvatar={selectedAvatar}
          playerName={playerName}
          handleAvatarSelected={setSelectedAvatar}
          isSmallDevice={isSmallDevice}
        />
      );
    case JoinGameState.ENTER_NAME:
      return (
        <EnterPlayerName
          isSmallDevice={isSmallDevice}
          handlePlayerNameClick={handlePlayerNameClick}
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
      return <SplashScreen handleSplashScreenClick={handleSplashScreenClick} />;
  }
}
