import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../hooks/context/useCentralDataContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from '../components/button/Button';
import VerificationCodeInput from '../components/VerificationCodeInput';
import ConfirmationErrorModal from '../components/modal/ConfirmationErrorModal';
import SignUpErrorModal from '../components/modal/SignUpErrorModal';
import NoticeModal from '../components/modal/NoticeModal';
import RightOnLogo from '../images/RightOnUserLogo.svg';
import ModalBackground from '../components/modal/ModalBackground';
import errorIcon from '../images/errorIcon.svg';

interface UserCodeTextBoxesProps {
  $isPink?: boolean;
}

// Styled components
const OuterBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  alignItems: 'center',
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
}));

const InnerBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  maxWidth: '672px',
  paddingTop: '40px',
  paddingBottom: '40px',
  paddingLeft: '40px',
  paddingRight: '40px',
  boxSizing: 'border-box',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const VerifyText = styled(Typography)(({ theme }) => ({
  color: '#02215F',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '36px',
  textAlign: 'center',
}));

const EnterText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  fontFamily: 'Rubik, sans-serif',
  color: '#02215F',
}));

const CodeandResendContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}));

const ResendCodeText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400,
  fontSize: '16px',
  color: '#02215F',
  textDecoration: 'underline',
  textAlign: 'center',
  cursor: 'pointer',
}));

const VerifyBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

// Props interface
interface ConfirmationProps {
  frontImage: File;
  backImage: File;
  handlerImageUpload: (file: File) => Promise<any>;
  setIsTabsOpen: (isOpen: boolean) => void;
}

// Use function declaration for the component
function Confirmation({
  frontImage,
  backImage,
  handlerImageUpload,
  setIsTabsOpen,
}: ConfirmationProps) {
  const theme = useTheme();
  const [code, setCode] = useState(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [hasError, setHasError] = useState(false);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState('');
  const [isSignUpErrorOpen, setIsSignUpErrorOpen] = useState(false);
  const [resendNotice, setResendNotice] = useState<{
    header: string;
    body: string;
  } | null>(null);

  const handleSubmit = async () => {
    setIsVerifying(true);
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      alert('Please enter all 6 digits of the confirmation code.');
    }
    try {
      const response =
        await apiClients.centralDataManager?.signUpConfirmAndBuildBackendUser(
          centralData.userProfile,
          fullCode,
          frontImage,
          backImage,
        );
      if (response?.updatedUser) {
        setHasError(false);
        centralDataDispatch({
          type: 'SET_USER_PROFILE',
          payload: response?.updatedUser,
        });
        setIsVerifying(false);
        navigate('/');
      }
    } catch (error: any) {
      setIsVerifying(false);
      if (error?.name === 'CodeMismatchException') {
        setHasError(true);
        return;
      }
      // anything else (ID upload, createUser, network) used to fail silently
      setSignUpErrorMessage(error?.message ?? '');
      setIsSignUpErrorOpen(true);
    }
  };
  const handleResendCodeClick = async () => {
    try {
      await apiClients.auth.awsResendConfirmationCode(
        centralData.userProfile.email,
      );
      setResendNotice({
        header: 'Code Sent',
        body: `A new verification code is on its way to ${centralData.userProfile.email}.`,
      });
    } catch (error: any) {
      setResendNotice({
        header: "Couldn't Send Code",
        body:
          error?.message ??
          'We could not send a new code. Please try again in a moment.',
      });
    }
  };
  const buttonTypeVerify = ButtonType.VERIFY;
  const [isVerify, setIsVerify] = useState(true);

  return (
    <OuterBody>
      <ConfirmationErrorModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userProfile={centralData.userProfile}
        setIsTabsOpen={setIsTabsOpen}
      />
      <SignUpErrorModal
        isModalOpen={isSignUpErrorOpen}
        setIsModalOpen={setIsSignUpErrorOpen}
        errorMessage={signUpErrorMessage}
      />
      <NoticeModal
        isModalOpen={resendNotice !== null}
        header={resendNotice?.header ?? ''}
        body={resendNotice?.body ?? ''}
        onClose={() => setResendNotice(null)}
      />
      <ModalBackground
        isModalOpen={isModalOpen || isSignUpErrorOpen || resendNotice !== null}
        handleCloseModal={() => {
          setIsModalOpen(false);
          setIsSignUpErrorOpen(false);
          setResendNotice(null);
        }}
      />
      <InnerBody>
        <ImageContainer>
          <img
            src={RightOnLogo}
            alt="Right On Logo"
            style={{ width: '280px', height: '280px' }}
          />
        </ImageContainer>
        <VerifyText>Step 2: Verify Your Email</VerifyText>
        <EnterText>Enter the verification code we sent you.</EnterText>
        <CodeandResendContainer>
          <VerificationCodeInput
            code={code}
            onCodeChange={setCode}
            hasError={hasError}
          >
            {hasError ? <img src={errorIcon} alt="Error Icon" /> : null}
          </VerificationCodeInput>
          <ResendCodeText onClick={handleResendCodeClick}>
            Resend Code
          </ResendCodeText>
        </CodeandResendContainer>
        <VerifyBox>
          <CentralButton
            buttonType={buttonTypeVerify}
            isEnabled={isVerify && !isVerifying}
            smallScreenOverride
            onClick={handleSubmit}
          />
        </VerifyBox>
        {isVerifying && (
          <Box
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <CircularProgress
              style={{ color: theme.palette.primary.darkBlueCardColor }}
            />
          </Box>
        )}
      </InnerBody>
    </OuterBody>
  );
}

export default Confirmation;
