import React, { useState } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GlobeImg from '../../../images/buttonIconGlobe.svg';
import LockImg from '../../../images/buttonIconLock.svg'
import { PublicPrivateContainer, PublicPrivateSelectionPill, LabelContainer, SubContainer, PublicPrivateText } from '../../../lib/styledcomponents/CreateGameStyledComponent';

interface PublicPrivateButtonInterface {
  isDisabled: boolean;
}

export default function PublicPrivateButton({
  isDisabled
}: PublicPrivateButtonInterface) {
  const { t } = useTranslation();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const handlePublicPrivateSwitch = () =>{
    setIsPublic(!isPublic);
  }
  return (
    <PublicPrivateContainer isDisabled={isDisabled} onClick={!isDisabled ? handlePublicPrivateSwitch : undefined}>
      <PublicPrivateSelectionPill isPublic={isPublic}/>
      <LabelContainer>
        <SubContainer isSelected={isPublic}>
          <PublicPrivateText isSelected={isPublic}>
            {t(`publicPrivateButton.public`)}
          </PublicPrivateText>
        </SubContainer>
        <SubContainer isSelected={!isPublic}>
          <PublicPrivateText isSelected={!isPublic}>
            {t(`publicPrivateButton.private`)}
          </PublicPrivateText>
        </SubContainer>
      </LabelContainer>
    </PublicPrivateContainer>
  );
}