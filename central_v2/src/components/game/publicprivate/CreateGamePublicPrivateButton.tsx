import React from 'react';
import { Box, Button, Typography, styled, Radio } from '@mui/material';
import publicIconSelected from '../../../images/publicIconSelected.svg';
import publicIconUnselected from '../../../images/publicIconUnselected.svg';
import privateIconSelected from '../../../images/privateIconSelected.svg';
import privateIconUnselected from '../../../images/privateIconUnselected.svg';

interface HeaderTextProps {
  isSelected: boolean;
}

const HeaderText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<HeaderTextProps>(({ isSelected, theme }) => ({ 
  fontSize: '24px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  lineHeight: '32px',
  color: isSelected ? "#FFF" : '#384466',
  transition: 'color 0.3s ease-in-out',
}));

interface ButtonContainerProps {
  isSelected: boolean;
}

const ButtonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<ButtonContainerProps>(({ isSelected, theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: isSelected ? '#02215F' : '#FFF',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  borderRadius: '8px',
  padding: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: isSelected ? '#02215F' : '#CCD3DF',
  },
}));

interface CreateGamePublicPrivateButtonProps {
  isPublic: boolean;
  isSelected: boolean;
}

export default function CreateGamePublicPrivateButton(
  { isPublic, isSelected }: CreateGamePublicPrivateButtonProps
) {
  const iconByState = {
    public: {
      selected: publicIconSelected,
      unselected: publicIconUnselected,
    },
    private: {
      selected: privateIconSelected,
      unselected: privateIconUnselected,
    },
  };
  
  const visibility = isPublic ? 'public' : 'private';
  const selection = isSelected ? 'selected' : 'unselected';
  const buttonIcon = iconByState[visibility][selection];
  const buttonText = isPublic ? 'Public' : 'Private';

  return (
    <ButtonContainer isSelected={isSelected}>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '40px',
        }}
      >
        <img src={buttonIcon} alt="Public" />
        <HeaderText isSelected={isSelected}>{buttonText}</HeaderText>
      </Box>
      <Radio 
        checked={isSelected} 
        style={{
          padding: 0,
          width: '20px',
          height: '20px'
        }}
      />
    </ButtonContainer>
  )
}