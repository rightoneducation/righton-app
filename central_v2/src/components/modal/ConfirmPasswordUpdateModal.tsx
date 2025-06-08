import React from 'react';
import { Box, Paper, Fade, Typography, styled, CircularProgress, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUserProfile } from '@righton/networking';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { TitleText } from '../../lib/styledcomponents/CreateGameStyledComponent';


const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  height: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '100%',
  maxWidth: '431px',
  background: '#FFF',
  padding: '45px',
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

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer'
}));

const BackButton = styled(Button)(({theme}) => ({
    textTransform: 'none', 
    borderRadius: '8px', 
    height: '38px', 
    color: '#1B376F',
    fontWeight: 600, 
    fontSize: '20px', 
    fontFamily: 'Poppins', 
    padding: '4px 12px', 
    border: `1px solid #1B376F`,
	"&:hover": {  border: `1px solid #1B376F` }
}))

interface ConfirmPasswordUpdateProps {
  isModalOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function ConfirmPasswordUpdateModal({
  isModalOpen,
  onClose,
  userEmail,
}: ConfirmPasswordUpdateProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);


  const handleContinue = async () => {
    try {
      await apiClients.auth.awsResetPassword(userEmail);
      navigate("/password/reset?action=update");
      onClose();
    } catch(err: any) {
      console.log("error with the email provided: ", err);
    }
  }

  const handleCancel = () => {
    onClose();
  }

  return (
    <Fade in={isModalOpen} mountOnEnter unmountOnExit timeout={1000}>
      <IntegratedContainer elevation={12}>
        <Box style={{
          width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column',
          gap: '24px',
        }}> 
        <DragText style={{ fontFamily: 'Poppins', color: '#1B376F' }}>Confirm Password Change</DragText>
          <DragText sx={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Rubik' }}> Are you sure you want to change password? This will require you to re-verify your email using a code sent to your account email. </DragText>
          <Box style={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%'}}>
              <CentralButton isEnabled buttonType={ButtonType.CONFIRMSENDCODE} onClick={handleContinue} />
              <BackButton
              disableTouchRipple
              onClick={handleCancel}
              variant="outlined">
                Back
              </BackButton>
          </Box>
        </Box>
      </IntegratedContainer>      
    </Fade>
  );
}


/**
 *  <Box style={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%'}}>
    
              <CentralButton isEnabled buttonType={ButtonType.CONFIRMSENDCODE} onClick={handleContinue} />
              <CentralButton hideIcon isEnabled isReset buttonType={ButtonType.BACK} onClick={handleCancel} />
          </Box>

          <Button
          onClick={handleContinue}
          variant="contained" 
          sx={{ 
            background: '#1B376F', 
            textTransform: 'none', 
            borderRadius: '8px',
            fontWeight: 600,
            height: '38px', 
            color: `${theme.palette.primary.main}`, 
            fontSize: '20px', 
            fontFamily: 'Poppins', 
            padding: '4px 12px',
            "&:hover": {
              background: `${theme.palette.primary.buttonPrimaryHover}`,
            } 
            }}>
                Confirm & Send Code
              </Button>
 */