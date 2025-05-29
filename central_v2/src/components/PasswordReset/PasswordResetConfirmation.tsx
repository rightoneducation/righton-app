import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
} from '@mui/material';
import {
  useCentralDataState,
} from '../../hooks/context/useCentralDataContext';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from '../button/Button';
import { TextContainerStyled } from '../../lib/styledcomponents/CreateQuestionStyledComponents';
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
  
  const UserCodeTextBoxesContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  }));
  
  const UserCodeTextBoxes = styled(TextContainerStyled)(({ theme }) => ({
    width: '40px',
    maxHeight: '54px',
    textAlign: 'center',
    '& .MuiInputBase-root': {
      fontFamily: 'Rubik',
      fontWeight: 700,
      fontSize: '20px',
      color: theme.palette.primary.darkBlue,
    },
    '& .MuiOutlinedInput-root': {
      height: '54px',
      '&.Mui-error fieldset': {
        borderWidth: '2px',
        borderColor: '#F60E44',
      },
    },
    '& .MuiTextField-root': {},
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
interface PasswordResetProps {
  handleNextStep: () => void;
  onCodeChange: (code: string[]) => void;
  code: string[];
}

function PasswordResetConfirmation({
  handleNextStep,
  onCodeChange,
  code,
}: PasswordResetProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]); // Refs for each input box

  const handleCodeInputChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return; // Only allow numeric input
    const newCode = [...code];
    newCode[index] = value;
    onCodeChange(newCode);

    // Automatically move to the next input box if a character is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
      await apiClients.auth.awsResendConfirmationCode(
        centralData.userProfile.email,
      );
    } catch (error) {
      console.error('Error resending confirmation code:', error);
    }
  };

  const setInputRef = (index: number, el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const [isVerify, setIsVerify] = useState(true);
  const uniqueKeys = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <>
      <VerifyText>Step 1: Verify Account</VerifyText>
      <EnterText>
        Enter the verification code you have received in your email
      </EnterText>
      <CodeandResendContainer>
        <UserCodeTextBoxesContainer>
          {code.map((value, index) => (
            <UserCodeTextBoxes
              error={isCodeError}
              variant="outlined"
              key={`code-${uniqueKeys[index]}`}
              inputRef={(el) => setInputRef(index, el)}
              value={value}
              onChange={(e) => handleCodeInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputProps={{ maxLength: 1 }}
            />
          ))}
          {isCodeError && <ErrorIcon src={errorIcon} alt="error icon" />}
        </UserCodeTextBoxesContainer>
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
