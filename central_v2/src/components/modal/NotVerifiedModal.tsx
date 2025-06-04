import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUserProfile } from '@righton/networking';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import { UserStatusType} from '../../lib/CentralModels';


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

const ContentContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    // border: '1px solid red',
    alignItems: 'center',
    maxWidth: '320px'
}));


const DragText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif', 
  width: '100%',
  fontSize: '24px',
  fontWeight: 700,
  textAlign: 'center',
  color: '#02215F'
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif', 
  width: '100%',
  fontSize: '16px',
  fontWeight: 400,
  textAlign: 'center', 
//   border: '1px solid yellow',
  maxWidth: '300px'
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    // border: '1px solid brown',
    // alignItems: 'center',
    // maxWidth: '320px'
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}))

interface CreatingTemplateModalProps {
  isNonVerifiedModalOpen: boolean;
  setIsNonVerifiedModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotVerifiedModal({
  isNonVerifiedModalOpen,
  setIsNonVerifiedModalOpen,
}: CreatingTemplateModalProps) {
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralDataDispatch = useCentralDataDispatch();
  const message = "It seems like you've already started an account, please do one of the following:";
  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleCloseModalClickResend = () => {
    setIsNonVerifiedModalOpen(false);
    centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.NONVERIFIED});
  }

  const handleCloseModalClickCancel = () => {
    setIsNonVerifiedModalOpen(false);
  }

  return (
    <Fade in={isNonVerifiedModalOpen} mountOnEnter unmountOnExit timeout={1000}  style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%)'}}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '16px', padding: '24px'
        }}> 
          <ContentContainer>
            <DragText>Emal Verification Needed</DragText>
            <SubText>{message}</SubText>
            <ButtonsContainer>
                <CentralButton 
                    buttonType={ButtonType.RETRY} 
                    isEnabled 
                    smallScreenOverride
                    onClick={handleCloseModalClickResend}
                />
                <CentralButton 
                    buttonType={ButtonType.CANCEL} 
                    isEnabled 
                    smallScreenOverride
                    onClick={handleCloseModalClickCancel}
                />
            </ButtonsContainer>
          </ContentContainer>

        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}
