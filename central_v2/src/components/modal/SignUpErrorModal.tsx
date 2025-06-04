

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUserProfile } from '@righton/networking';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(90%)',
  height: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
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
  fontWeight: 700,
  textAlign: 'center'
}));

const SubText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '16px',
  fontWeight: 400,
  textAlign: 'center'
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}))

interface CreatingTemplateModalProps {
  isModalOpen: boolean;
  errorMessage?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignUpErrorModal({
  isModalOpen,
  errorMessage,
  setIsModalOpen,
}: CreatingTemplateModalProps) {
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralDataDispatch = useCentralDataDispatch();

  const handleCloseModalClick = () => {
    setIsModalOpen(false);
    centralDataDispatch({ type: 'SET_USER_ERROR_STRING', payload: '' });
  }

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}  style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%)'}}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '16px', padding: '24px'
        }}> 
          <DragText> Error Signing Up </DragText>
          {errorMessage && errorMessage.length > 0 && (
            <SubText> {errorMessage} </SubText>
          )}
          <Box style={{display: 'flex', gap: '16px'}}>
              <CentralButton 
                buttonType={ButtonType.RETRY} 
                isEnabled 
                smallScreenOverride
                onClick={handleCloseModalClick}
              />
          </Box>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
