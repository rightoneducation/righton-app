import React, {useState} from 'react';
import { PublicPrivateType } from '@righton/networking';
import {
  CreateGameMainContainer,
  CreateGameBackground,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import CreateGamePublicPrivateHeader from '../components/game/publicprivate/CreateGamePublicPrivateHeader';
import CreateGamePublicPrivateBody from '../components/game/publicprivate/CreateGamePublicPrivateBody';
import { ScreenSize } from '../lib/CentralModels';

interface CreateGamePublicPrivateProps {
  screenSize: ScreenSize
  handleBackClick: () => void;
  handleStartCreating: (selected: PublicPrivateType) => void;
}

export default function CreateGamePublicPrivate({ screenSize, handleBackClick, handleStartCreating }: CreateGamePublicPrivateProps) {
  const [selectedButton, setSelectedButton] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  return (
    <CreateGameMainContainer screenSize={screenSize}>
      <CreateGameBackground />
      <CreateGamePublicPrivateHeader handleBackClick={handleBackClick} screenSize={screenSize} />
      <CreateGamePublicPrivateBody screenSize={screenSize} selectedButton={selectedButton} setSelectedButton={setSelectedButton} handleStartCreating={handleStartCreating} />
    </CreateGameMainContainer>
  );
}