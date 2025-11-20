import React from 'react';
import {
  CreateGameMainContainer,
  CreateGameBackground,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import CreateGamePublicPrivateHeader from '../components/game/publicprivate/CreateGamePublicPrivateHeader';
import CreateGamePublicPrivateBody from '../components/game/publicprivate/CreateGamePublicPrivateBody';
import { ScreenSize } from '../lib/CentralModels';

interface CreateGamePublicPrivateProps {
  screenSize: ScreenSize;
  handleBackClick: () => void;
}

export default function CreateGamePublicPrivate({ screenSize, handleBackClick }: CreateGamePublicPrivateProps) {
  return (
    <CreateGameMainContainer screenSize={screenSize}>
      <CreateGameBackground />
      <CreateGamePublicPrivateHeader handleBackClick={handleBackClick} screenSize={screenSize} />
      <CreateGamePublicPrivateBody screenSize={screenSize} />
    </CreateGameMainContainer>
  );
}