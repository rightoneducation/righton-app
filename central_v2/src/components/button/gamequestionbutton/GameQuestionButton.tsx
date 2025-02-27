import React, { useState } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface GameQuestionContainerProps {
  isDisabled: boolean;
}

const GameQuestionContainer = styled(Button)<GameQuestionContainerProps>(({theme, isDisabled}) => ({
  width: '144px',
  minHeight: '36px',
  borderRadius: '24px',
  background: `${theme.palette.primary.sliderGrey}`,
  ':hover': {
    background: `${theme.palette.primary.sliderGrey}`,
  },
  padding: 0,
  position: 'relative',
  cursor: isDisabled ? 'default' : 'pointer'
}));

const GameQuestionSelectionPill = styled(Box, {
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

interface GameQuestionTextProps {
  isSelected: boolean;
}

const GameQuestionText = styled(Typography)<GameQuestionTextProps>(({isSelected, theme}) => ({
  fontSize: '14px',
  color: isSelected ? `${theme.palette.primary.main}` : `${theme.palette.primary.sliderBlue}`,
  textTransform: 'none',
  transition: 'color 0.3 ease-in-out'
}));

interface GameQuestionButtonInterface {
  isDisabled: boolean;
}

export default function GameQuestionButton({
  isDisabled
}: GameQuestionButtonInterface) {
  const { t } = useTranslation();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const handleGameQuestionSwitch = () =>{
    setIsPublic(!isPublic);
  }
  return (
    <GameQuestionContainer isDisabled={isDisabled} onClick={!isDisabled ? handleGameQuestionSwitch : undefined}>
      <GameQuestionSelectionPill isPublic={isPublic}/>
      <LabelContainer>
        <SubContainer isSelected={isPublic}>     
          <GameQuestionText isSelected={isPublic}>
            {t(`publicPrivateButton.public`)}
          </GameQuestionText>
        </SubContainer>
        <SubContainer isSelected={!isPublic}>
          <GameQuestionText isSelected={!isPublic}>
            {t(`publicPrivateButton.private`)}
          </GameQuestionText>
        </SubContainer>
      </LabelContainer>
    </GameQuestionContainer>
  );
}