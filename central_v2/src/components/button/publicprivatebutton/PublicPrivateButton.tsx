import React, { useState } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PublicPrivateContainerProps {
  isDisabled: boolean;
}

export const PublicPrivateContainer = styled(Button)<PublicPrivateContainerProps>(({theme, isDisabled}) => ({
  width: '120px',
  minHeight: '30px',
  borderRadius: '24px',
  background: `${theme.palette.primary.sliderGrey}`,
  ':hover': {
    background: `${theme.palette.primary.sliderGrey}`,
  },
  padding: 0,
  position: 'relative',
  cursor: isDisabled ? 'default' : 'pointer'
}));

export const PublicPrivateSelectionPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isPublic',
})<{ isPublic: boolean }>(({ theme, isPublic }) => ({
  width: '59px',
  height: '27px',
  borderRadius: '24px',
  background: `${theme.palette.primary.sliderBlue}`,
  ':hover': {
    background: `${theme.palette.primary.sliderBlue}`,
  },
  position: 'absolute',
  left: isPublic ? '2px' : '59px', 
  transition: 'left 0.3s ease-in-out',   
  boxSizing: 'border-box',
  zIndex: 3,
}));

export const LabelContainer = styled(Box)(({theme}) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  paddingLeft: '10px',
  paddingRight: '10px',
  zIndex: 4,
  position: 'relative'
}))

export const SubContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  transition: 'opacity 0.3 ease-in-out'
}));

interface PublicPrivateTextProps {
  isSelected: boolean;
}

export const PublicPrivateText = styled(Typography)<PublicPrivateTextProps>(({isSelected, theme}) => ({
  fontSize: '12px',
  fontFamily: "Rubik",
  color: isSelected ? `${theme.palette.primary.main}` : `${theme.palette.primary.sliderBlue}`,
  textTransform: 'none',
  transition: 'color 0.3 ease-in-out'
}));

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