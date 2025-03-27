import React, { useState } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GameQuestionType } from '../../../lib/CentralModels';

interface GameQuestionContainerProps {
  isDisabled: boolean;
}

const GameQuestionContainer = styled(Button,{
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<GameQuestionContainerProps>(({theme, isDisabled}) => ({
  width: '416px',
  minHeight: '68px',
  borderRadius: '8px',
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
  width: '200px',
  height: '52px',
  borderRadius: '8px',
  background: `${theme.palette.primary.sliderBlue}`,
  ':hover': {
    background: `${theme.palette.primary.sliderBlue}`,
  },
  position: 'absolute',
  left: isPublic ? '8px' : '208px', 
  transition: 'left 0.3s ease-in-out',   
  boxSizing: 'border-box',
  zIndex: 3,
}));

const LabelContainer = styled(Box)(({theme}) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  paddingLeft: '8px',
  zIndex: 4,
  position: 'relative'
}))

const SubContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '200px',
  opacity: isSelected ? 1 : 0.5,
  transition: 'opacity 0.3 ease-in-out'
}));

interface GameQuestionTextProps {
  isSelected: boolean;
}

const GameQuestionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<GameQuestionTextProps>(({isSelected, theme}) => ({
  fontSize: '24px',
  fontWeight: 700,
  color: isSelected ? `${theme.palette.primary.main}` : `${theme.palette.primary.sliderBlue}`,
  textTransform: 'none',
  transition: 'color 0.3 ease-in-out'
}));

interface GameQuestionButtonInterface {
  isDisabled: boolean;
  gameQuestion?: GameQuestionType;
  setGameQuestion?: (gameQuestion: GameQuestionType) => void;
}

export default function GameQuestionButton({
  isDisabled,
  gameQuestion,
  setGameQuestion
}: GameQuestionButtonInterface) {
  const { t } = useTranslation();
  const isPublic = gameQuestion === GameQuestionType.GAME;
  const handleGameQuestionSwitch = () =>{
    if (setGameQuestion)
      setGameQuestion(gameQuestion === GameQuestionType.GAME ? GameQuestionType.QUESTION : GameQuestionType.GAME);
  }
  return (
    <GameQuestionContainer isDisabled={isDisabled} onClick={!isDisabled ? handleGameQuestionSwitch : undefined}>
      <GameQuestionSelectionPill isPublic={isPublic}/>
      <LabelContainer>
        <SubContainer isSelected={isPublic}>     
          <GameQuestionText isSelected={isPublic}>
            {t(`gameQuestionButton.games`)}
          </GameQuestionText>
        </SubContainer>
        <SubContainer isSelected={!isPublic}>
          <GameQuestionText isSelected={!isPublic}>
            {t(`gameQuestionButton.questions`)}
          </GameQuestionText>
        </SubContainer>
      </LabelContainer>
    </GameQuestionContainer>
  );
}