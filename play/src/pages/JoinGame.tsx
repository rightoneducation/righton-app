import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SplashScreen from '../components/joingame/SplashScreen';
import EnterGameCode from '../components/joingame/EnterGameCode';
import EnterPlayerName from '../components/joingame/EnterPlayerName';
import HowToPlay from '../components/joingame/HowToPlay';
import SelectAvatar from '../components/joingame/SelectAvatar';

interface JoinGameProps {
  joinGamePhase: number;
}

export default function JoinGame({ joinGamePhase }: JoinGameProps) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [inputError, setInputError] = useState(true); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [gameCodeValue, setGameCodeValue] = useState('####');
  const [playerFirstName, setPlayerFirstName] = useState('First Name');
  const [playerLastName, setPlayerLastName] = useState('Last Name');
  const [avatar, setAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  switch (joinGamePhase) {
    case 1:
      return (
        <EnterGameCode
          gameCodeValue={gameCodeValue}
          handleGameCodeChange={setGameCodeValue}
          inputError={inputError}
        />
      );
    case 2:
      return (
        <EnterPlayerName
          playerFirstName={playerFirstName}
          playerLastName={playerLastName}
          handlePlayerFirstNameChange={setPlayerFirstName}
          handlePlayerLastNameChange={setPlayerLastName}
          inputError={inputError}
        />
      );
    case 3:
      return (
        <SelectAvatar
          selectedAvatar={selectedAvatar}
          handleAvatarSelected={setSelectedAvatar}
          playerFirstName={playerFirstName}
          playerLastName={playerLastName}
          isMobileDevice={isMobileDevice}
        />
      );
    case 4:
      return <HowToPlay />;
    case 0:
    default:
      return <SplashScreen />;
  }
}
