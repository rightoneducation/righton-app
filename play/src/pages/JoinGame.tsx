import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SplashScreen from '../components/joingame/SplashScreen';
import EnterGameCode from '../components/joingame/EnterGameCode';
import EnterPlayerName from '../components/joingame/EnterPlayerName';
import SelectAvatar from '../components/joingame/SelectAvatar';
import HowToPlay from '../components/joingame/HowToPlay';
import { JoinGameState } from '../lib/PlayModels';

interface JoinGameProps {
  joinGameState: JoinGameState;
}

export default function JoinGame({ joinGameState }: JoinGameProps) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [inputError, setInputError] = useState(true); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [gameCodeValue, setGameCodeValue] = useState('####');
  const [playerFirstName, setPlayerFirstName] = useState('First Name');
  const [playerLastName, setPlayerLastName] = useState('Last Name');
  const [avatar, setAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  switch (joinGameState) {
    case JoinGameState.HOWTOPLAY:
      return <HowToPlay />;
    case JoinGameState.SELECTAVATAR:
      return (
        <SelectAvatar
          selectedAvatar={selectedAvatar}
          handleAvatarSelected={setSelectedAvatar}
          playerFirstName={playerFirstName}
          playerLastName={playerLastName}
          isMobileDevice={isMobileDevice}
        />
      );
    case JoinGameState.ENTERNAME:
      return (
        <EnterPlayerName
          playerFirstName={playerFirstName}
          playerLastName={playerLastName}
          handlePlayerFirstNameChange={setPlayerFirstName}
          handlePlayerLastNameChange={setPlayerLastName}
          inputError={inputError}
        />
      );
    case JoinGameState.ENTERGAMECODE:
      return (
        <EnterGameCode
          gameCodeValue={gameCodeValue}
          handleGameCodeChange={setGameCodeValue}
          inputError={inputError}
        />
      );
    case JoinGameState.SPLASH:
    default:
      return <SplashScreen />;
  }
}
