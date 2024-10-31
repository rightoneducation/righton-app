import React, { useState } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import globe from '../../../images/buttonIconGlobe.svg';
import lock from '../../../images/buttonIconLock.svg';

const PublicPrivateContainer = styled(Button)(({theme}) => ({
  width: '160px',
  minHeight: '45px',
  borderRadius: '50px',
  background: `${theme.palette.primary.extraDarkBlue}`,
  ':hover': {
    background: `${theme.palette.primary.extraDarkBlue}`,
  },
  padding: 0,
  position: 'relative',
}));

const PublicPrivateSelectionPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isPublic',
})<{ isPublic: boolean }>(({ theme, isPublic }) => ({
  width: '80px',
  height: '45px',
  borderRadius: '50px',
  background: `${theme.palette.primary.buttonGradientBlue}`,
  ':hover': {
    background: `${theme.palette.primary.buttonGradientBlue}`,
  },
  position: 'absolute',
  left: isPublic ? '0' : '80px', 
  transition: 'left 0.3s ease-in-out',   
  boxSizing: 'border-box',
  zIndex: 3,
}));

const LabelContainer = styled(Box)(({theme}) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  paddingLeft: '16px',
  paddingRight: '16px',
  zIndex: 4,
  position: 'relative'
}))

const SubContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  opacity: isSelected ? 1 : 0.5,
  transition: 'opacity 0.3 ease-in-out'
}));

const PublicPrivateIcon = styled('img')(({theme}) => ({
  height: '20px',
  width: '20px'
}));

const PublicPrivateText = styled(Typography)(({theme}) => ({
  fontSize: '14px',
  color: `${theme.palette.primary.main}`,
  textTransform: 'none'
}));

export default function PublicPrivateButton() {
  const { t } = useTranslation();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const handlePublicPrivateSwitch = () =>{
    setIsPublic(!isPublic);
  }
  return (
    <PublicPrivateContainer onClick={handlePublicPrivateSwitch}>
      <PublicPrivateSelectionPill isPublic={isPublic}/>
      <LabelContainer>
        <SubContainer isSelected={isPublic}>     
          <PublicPrivateIcon src={globe} />   
          <PublicPrivateText>
            {t(`publicPrivateButton.public`)}
          </PublicPrivateText>
        </SubContainer>
        <SubContainer isSelected={!isPublic}>
          <PublicPrivateIcon src={lock} />
          <PublicPrivateText>
            {t(`publicPrivateButton.public`)}
          </PublicPrivateText>
        </SubContainer>
      </LabelContainer>
    </PublicPrivateContainer>
  );
}