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
import { useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import closeX from '../../images/closeX.svg';

const IntegratedContainer = styled(Paper)(({ theme }) => ({
  // NB: Fade below clones this element with an inline `style`, and inline wins
  // over a styled() class -- so position/top/transform must agree there too or
  // edits here silently do nothing. Fixed (not absolute) to centre on the
  // viewport like ModalBackground, rather than on an unpositioned ancestor.
  position: 'fixed',
  borderRadius: '16px',
  width: 'calc(90%)',
  height: 'auto',
  top: '50%',
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
  boxSizing: 'border-box',
}));

const DragText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  fontWeight: 700,
  textAlign: 'center',
}));

const SubText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '16px',
  fontWeight: 400,
  textAlign: 'center',
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer',
}));

const UNUSABLE = ['', 'undefined', 'null'];

// the modal decides what the user reads; an unusable or unrecognised message
// still yields something actionable rather than leaking internals
const resolveErrorCopy = (
  errorMessage?: string,
): { header: string; body: string } => {
  const text = (errorMessage ?? '').trim();
  if (UNUSABLE.includes(text.toLowerCase())) {
    return {
      header: 'Error Signing Up',
      body: 'Something went wrong while creating your account. Please try again.',
    };
  }
  // the PreSignup lambda signals collisions as `CODE|message`, which Cognito
  // wraps in UserLambdaValidationException noise -- match the code, not the
  // whole string, and replace the copy rather than surfacing the raw throw
  if (/USERNAME_EXISTS/.test(text)) {
    return {
      header: 'Username Unavailable',
      body: 'That username is already taken. Please choose a different one.',
    };
  }
  if (/EMAIL_EXISTS/.test(text)) {
    return {
      header: 'Email Already Registered',
      body: 'An account already exists with that email. Try logging in instead.',
    };
  }
  if (/teacher\s*id|upload/i.test(text)) {
    return {
      header: 'Upload Required',
      body: 'Please upload images of the front and back of your Teacher ID to complete your signup.',
    };
  }
  return { header: 'Error Signing Up', body: text };
};

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

  const { header, body } = resolveErrorCopy(errorMessage);

  const handleCloseModalClick = () => {
    setIsModalOpen(false);
    centralDataDispatch({ type: 'SET_USER_ERROR_STRING', payload: '' });
  };

  return (
    <Fade
      in={isModalOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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
          <Box
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <CloseButton
              src={closeX}
              alt="Close"
              onClick={handleCloseModalClick}
            />
          </Box>
          <DragText> {header} </DragText>
          <SubText> {body} </SubText>
          <Box style={{ display: 'flex', gap: '16px' }}>
            <CentralButton
              buttonType={ButtonType.CLOSE}
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
