

import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUserProfile } from '@righton/networking';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';


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
  zIndex: 7,
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

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}))

interface CreatingTemplateModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userDuplicate: boolean;
  setUserDuplicate: React.Dispatch<React.SetStateAction<boolean>>;

}

export default function SignUpErrorModal({
  isModalOpen,
  setIsModalOpen,
  userDuplicate,
  setUserDuplicate
}: CreatingTemplateModalProps) {
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}  style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%)'}}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '16px', padding: '24px'
        }}> 
          <DragText>
            {userDuplicate ? 'Duplicated Username' : 'Error Signing Up'}
          </DragText>
          <Box style={{display: 'flex', gap: '16px'}}>
              <CentralButton 
                buttonType={ButtonType.RETRY} 
                isEnabled 
                smallScreenOverride
                onClick={() => setIsModalOpen(false)}
              />
          </Box>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
