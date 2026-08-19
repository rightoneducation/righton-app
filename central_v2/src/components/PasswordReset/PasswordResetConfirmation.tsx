import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from '../button/Button';
import VerificationCodeInput from '../VerificationCodeInput';
import { ErrorIcon } from '../../lib/styledcomponents/CentralStyledComponents';
import errorIcon from '../../images/errorIcon.svg';

// Styled components
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
  '&:hover': {
    opacity: 0.8,
  },
}));

const VerifyBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

// Props interface
interface PasswordResetProps {
  handleNextStep: () => void;
  onCodeChange: (code: string[]) => void;
  code: string[];
  isForgotPassword: boolean;
  userName: string;
}

function PasswordResetConfirmation({
  handleNextStep,
  onCodeChange,
  code,
  isForgotPassword,
  userName,
}: PasswordResetProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const handleCodeSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      alert('Please enter all 6 digits of the confirmation code.');
      setIsCodeError(true);
      return;
    }
    handleNextStep();
  };

  const handleResendCodeClick = async () => {
    try {
      // user is logged out
      if (isForgotPassword && userName) {
        await apiClients.auth.awsResetPassword(userName);
      }
      // user is logged in
      else if (centralData.userProfile.email) {
        await apiClients.auth.awsResetPassword(centralData.userProfile.email);
      }
    } catch (error) {
      console.error('Error resending confirmation code:', error);
    }
  };

  const [isVerify, setIsVerify] = useState(true);

  return (
    <>
      <VerifyText>Step 1: Verify Account</VerifyText>
      <EnterText>
        Enter the verification code you have received in your email
      </EnterText>
      <CodeandResendContainer>
        <VerificationCodeInput
          code={code}
          onCodeChange={onCodeChange}
          hasError={isCodeError}
        >
          {isCodeError && <ErrorIcon src={errorIcon} alt="error icon" />}
        </VerificationCodeInput>
        <ResendCodeText onClick={handleResendCodeClick}>
          Resend Code
        </ResendCodeText>
      </CodeandResendContainer>
      <VerifyBox>
        <CentralButton
          buttonWidthOverride="160px"
          buttonType={ButtonType.VERIFY}
          isEnabled={isVerify && !isVerifying}
          smallScreenOverride
          onClick={handleCodeSubmit}
        />
      </VerifyBox>
    </>
  );
}

export default PasswordResetConfirmation;
