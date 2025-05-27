import { useNavigate, } from 'react-router-dom';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import RightOnLogo from '../images/RightOnUserLogo.svg';
import CentralButton from "../components/button/Button";
import { ButtonColor, ButtonType } from '../components/button/ButtonModels';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ButtonContent, ButtonIconContainer, ButtonStyled, ButtonTypography } from '../lib/styledcomponents/ButtonStyledComponents';
import signup from '../images/buttonIconSignup.svg';
import PasswordResetConfirmation from '../components/PasswordReset/PasswordResetConfirmation';
import PassWordResetEmailInput from '../components/PasswordReset/PasswordResetEmail';

interface ResetLinkProps {
  setIsTabsOpen: (isOpen: boolean) => void;
}
export default function ResetPassword({ setIsTabsOpen }: ResetLinkProps) {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState<number>(0);
  
  const handleSignupClick = () => {
    navigate('/Signup'); // Navigate to the Signup page
  };

  const handleResetLink = async () => {
    try {
      const response = await apiClients.auth.awsResetPassword(userName);
      console.log("reset password response", response);
    } catch (error) {
      console.error('Error during login:', error);
      // You can also display an error message to the user if needed
    }
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  }

  switch(step) {
    case 0: 
    return <PassWordResetEmailInput handleNextStep={handleNextStep} />;
    case 1:
    case 2:
    return <PasswordResetConfirmation handleNextStep={handleNextStep} step={step} setIsTabsOpen={setIsTabsOpen} />
    default:
      return <PassWordResetEmailInput handleNextStep={handleNextStep} />
  }
}
