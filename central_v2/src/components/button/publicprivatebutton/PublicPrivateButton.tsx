import React, { useState } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PublicPrivateContainer = styled(Button)(({theme}) => ({
  width: '144px',
  minHeight: '36px',
  borderRadius: '24px',
  background: `${theme.palette.primary.sliderGrey}`,
  ':hover': {
    background: `${theme.palette.primary.sliderGrey}`,
  },
  padding: 0,
  position: 'relative',
}));

const PublicPrivateSelectionPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isPublic',
})<{ isPublic: boolean }>(({ theme, isPublic }) => ({
  width: '71px',
  height: '33px',
  borderRadius: '24px',
  background: `${theme.palette.primary.sliderBlue}`,
  ':hover': {
    background: `${theme.palette.primary.sliderBlue}`,
  },
  position: 'absolute',
  left: isPublic ? '2px' : '70px', 
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

interface PublicPrivateTextProps {
  isSelected: boolean;
}

const PublicPrivateText = styled(Typography)<PublicPrivateTextProps>(({isSelected, theme}) => ({
  fontSize: '14px',
  color: isSelected ? `${theme.palette.primary.main}` : `${theme.palette.primary.sliderBlue}`,
  textTransform: 'none',
  transition: 'color 0.3 ease-in-out'
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