import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SplashScreen from '../components/joingame/SplashScreen';
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
    case JoinGameState.SPLASH:
    default:
      return <SplashScreen />;
  }
}
