

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUserProfile } from '@righton/networking';
import { GameQuestionType } from '../../lib/CentralModels';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  borderRadius: '16px',
  width: 'calc(90%)',
  height: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '100%',
  maxWidth: '400px',
  background: '#FFF',
  paddingTop: '16px',
  paddingBottom: '16px',
  paddingLeft: '24px',
  paddingRight: '24px',
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  boxSizing: 'border-box'
}));

const DragText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  lineHeight: '32px',
  fontWeight: 700,
  textAlign: 'center'
}));

const SubText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  lineHeight: '32px',
  fontWeight: 400,
  textAlign: 'center'
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}))

interface DeleteModalProps {
  isModalOpen: boolean;
  gameQuestion: GameQuestionType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleProceedToDelete: () => void;
}

export default function DeleteModal({
  isModalOpen,
  gameQuestion,
  setIsModalOpen,
  handleProceedToDelete
}: DeleteModalProps) {

  const handleDelete = () => {
    setIsModalOpen(false);
    handleProceedToDelete();
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }


  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000} >
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '16px', padding: '24px'
        }}> 
          <DragText>{`Warning: You are about to delete a public ${gameQuestion === GameQuestionType.GAME ? 'game' : 'question'}.`} </DragText>
          <SubText> {`This will remove the ${gameQuestion === GameQuestionType.GAME ? 'game' : 'question'} for anyone that is using it!`} </SubText>
          <SubText> Do you want to continue? </SubText>
          <Box style={{display: 'flex', gap: '16px'}}>
              <CentralButton 
                buttonType={ButtonType.YES} 
                isEnabled 
                smallScreenOverride
                onClick={handleDelete}
              />
              <CentralButton 
                buttonType={ButtonType.NO} 
                isEnabled 
                smallScreenOverride
                onClick={handleCancel}
              />
          </Box>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
