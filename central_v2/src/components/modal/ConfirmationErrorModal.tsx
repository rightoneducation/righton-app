import React from 'react';
import {
  Box,
  Paper,
  Fade,
  Typography,
  styled,
  CircularProgress,
  useTheme,
  Button,
} from '@mui/material';
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
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  boxSizing: 'border-box',
}));

const DragText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  fontWeight: 700,
  textAlign: 'center',
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer',
}));

interface CreatingTemplateModalProps {
  userProfile?: IUserProfile;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTabsOpen: (isOpen: boolean) => void;
  userName?: string;
  isForgotPassword?: boolean;
}

export default function ConfirmationErrorModal({
  userProfile,
  isModalOpen,
  setIsModalOpen,
  setIsTabsOpen,
  userName,
  isForgotPassword,
}: CreatingTemplateModalProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const handleRetry = async () => {
    setIsModalOpen(false);
    setIsTabsOpen(false);
  };

  const handleCancel = async () => {
    if (!isForgotPassword) {
      await apiClients.auth.awsUserCleaner(userProfile as IUserProfile);
    }
    setIsModalOpen(false);
    setIsTabsOpen(false);
    navigate('/');
  };

  return (
    <Fade
      in={isModalOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%)',
      }}
    >
      <IntegratedContainer elevation={12}>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
          }}
        >
          <DragText> Error: Invalid Confirmation Code </DragText>
          <Box style={{ display: 'flex', gap: '16px' }}>
            <CentralButton
              buttonType={ButtonType.RETRY}
              isEnabled
              smallScreenOverride
              onClick={handleRetry}
            />
            <CentralButton
              buttonType={ButtonType.CANCEL}
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
