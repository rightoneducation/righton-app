import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import RightOnLogo from '../images/RightOnUserLogo.svg';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import PasswordCodeConfirmation from '../components/PasswordReset/PasswordResetConfirmation';
import PassWordResetEmailConfirmation from '../components/PasswordReset/PasswordResetEmail';
import ConfirmationErrorModal from '../components/modal/ConfirmationErrorModal';
import ModalBackground from '../components/modal/ModalBackground';
import NewPasswordInputs from '../components/PasswordReset/NewPasswordInputs';

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '20px',
  height: '100%',
  width: '100%',
  // maxWidth: '500px',
  paddingTop: '40px',
  paddingBottom: '40px',
  paddingLeft: '40px',
  paddingRight: '40px',
  boxSizing: 'border-box',
}));

interface ResetLinkProps {
  setIsTabsOpen: (isOpen: boolean) => void;
}
export default function ResetPassword({ setIsTabsOpen }: ResetLinkProps) {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const action = queryParams.get('action');
  const [code, setCode] = useState(Array(6).fill(''));
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState<number>(action === 'update' ? 1 : 0);
  const [verifying, setIsVerifying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState<{
    newPassword: string;
    confirmPassword: string;
  }>({
    newPassword: '',
    confirmPassword: '',
  });
  const { newPassword, confirmPassword } = password;

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  }

  // STEP 0: send reset link to registered e-mail
  const handleResetLink = async () => {
    if (userName) {
      try {
        const response = await apiClients.auth.awsResetPassword(userName);
        if(response.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE'){
          handleNextStep();
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  const handlePasswordInputs = (pw: string, inputType: 'new' | 'confirm') => {
    if (inputType === 'new') {
      setPassword((prev) => ({ ...prev, newPassword: pw }));
    } else if (inputType === 'confirm') {
      setPassword((prev) => ({ ...prev, confirmPassword: pw }));
    }
  };

  const handleConfirmationError = () => {
    handlePrevStep();
    setIsTabsOpen(true);
    setIsModalOpen(true);
  };

  // STEP 2: update password with user
  const handleUpdatePassword = async () => {
    setIsVerifying(true);
    const fullCode = code.join('');

    if (newPassword !== confirmPassword || fullCode.length < 6) {
      return;
    }

    try {
      await apiClients.auth.awsConfirmResetPassword({
        username: action === 'update' ? centralData.userProfile.email : userName,
        newPassword: confirmPassword,
        confirmationCode: fullCode,
      });
      
      // update local user profile if it's a password update
      if(action === 'update') {
        const newUser = {
          ...centralData.userProfile,
          password: confirmPassword,
        }
        const localProfile = await apiClients.centralDataManager?.userProfileInformationUpdate(newUser, centralData.userProfile);
        centralDataDispatch({ type: 'SET_USER_PROFILE', payload: localProfile?.updatedUser });
        setIsVerifying(false);
        navigate("/userprofile");
      } else {
        await apiClients.user.updateUserPass(userName, confirmPassword);
        setIsVerifying(false);
        navigate('/login');
      }
    } catch (error: any) {
      setIsVerifying(false);
      console.log(error);
      if (error.message) {
        handleConfirmationError();
      }
    }
  };

  let component;
  switch (step) {
    case 0:
      component = (
        <PassWordResetEmailConfirmation
          onUserName={(email: string) => setUserName(email)}
          handleResetLink={handleResetLink}
          userName={userName}
        />
      );
      break;
    case 1:
      component = (
        <PasswordCodeConfirmation
          handleNextStep={handleNextStep}
          code={code}
          onCodeChange={setCode}
          isForgotPassword={action !== 'update'}
          userName={userName}
        />
      );
      break;
    case 2:
      component = (
        <NewPasswordInputs
          password={password}
          handlePasswordInputs={handlePasswordInputs}
          onSubmitNewPassword={handleUpdatePassword}
          isVerifying={verifying}
        />
      );
      break;
    default:
      component = (
        <PassWordResetEmailConfirmation
          userName={userName}
          onUserName={setUserName}
          handleResetLink={handleResetLink}
        />
      );
  }

  return (
    <SignUpMainContainer>
      <ConfirmationErrorModal
        userProfile={centralData.userProfile}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userName={userName}
        setIsTabsOpen={setIsTabsOpen}
        isForgotPassword={action !== 'update'}
      />
      <ModalBackground
        isModalOpen={isModalOpen}
        handleCloseModal={() => setIsModalOpen(false)}
      />
      <InnerBodyContainer>
        <ImageContainer>
          <img
            src={RightOnLogo}
            alt="Right On Logo"
            style={{ width: '200px', height: '200px' }}
          />
        </ImageContainer>
        {component}
      </InnerBodyContainer>
    </SignUpMainContainer>
  );
}

