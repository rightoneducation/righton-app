import { useNavigate, } from 'react-router-dom';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { SignUpMainContainer } from '../../lib/styledcomponents/SignUpStyledComponents';
import RightOnLogo from '../../images/RightOnUserLogo.svg';
import CentralButton from "../button/Button";
import { ButtonColor, ButtonType } from '../button/ButtonModels';
import { APIClientsContext } from '../../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { ButtonContent, ButtonIconContainer, ButtonStyled, ButtonTypography } from '../../lib/styledcomponents/ButtonStyledComponents';
import signup from '../../images/buttonIconSignup.svg';

const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '20px',
  height: '100%',
  width: '100%',
  maxWidth: '500px',
  paddingTop: '40px',
  paddingBottom: '40px',
  paddingLeft: '40px',
  paddingRight: '40px',
  boxSizing: 'border-box',
}));

const ResetPasswordText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700, 
    fontSize: '24px', 
    color: '#02215F',
    textAlign: 'center', 
    // border: '1px solid green',
  }));

const UserTextField = styled(TextField)(({ theme }) => ({
    border: '2px solid #CCCCCC', // Set border to 2px
    borderRadius: '8px', // Set border radius to 8px
    backgroundColor: '#FFFFFF', // Set background color to white
    width: '100%',
    '& .MuiInputBase-root': {
      borderRadius: '8px', // Ensure border radius is applied to the input field
      height: '43px',
    },
    '& .MuiInputBase-input': {
      color: '#384466', // Set text color of the input
  
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#384466', // Set the placeholder text color
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CCCCCC', // Set border color for the outline
    },
}));

const SignupContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    // border: '1px solid green',
    // flexDirection: 'column',
    gap: '16px',
    alignItems: 'center'
}));

const NoAccountText = styled(Typography)(({ theme }) => ({
    color: '#02215F', 
    // border: '1px solid blue',
    fontFamily: 'Rubik, sans-serif', 
    fontWeight: 400, 
    fontSize: '16px', 
  }));

  interface IResetLink {
    handleResetLink: () => Promise<void>;
    onUserName: (username: string) => void;
    userName: string;
  }
export default function PassWordResetEmailInput({ handleResetLink, onUserName, userName }: IResetLink) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isSignupEnabled, setIsSignupEnabled] = useState(true);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailRegex.test(userName);

  const handleSignupClick = () => {
    navigate('/Signup'); // Navigate to the Signup page
  };

  const handleSendResetLink = async () => {
    await handleResetLink();
  };

  return (
        <>
            <ResetPasswordText>
                Reset Password
            </ResetPasswordText>
            <UserTextField
            sx={{ maxWidth: '350px'}}
                variant="outlined"
                placeholder="Email"
                value={userName}
                onChange={(event) => onUserName(event.target.value)}
            />
            <CentralButton buttonWidthOverride='183px' buttonType={ButtonType.RESETLINK} isEnabled={isValidEmail} onClick={handleSendResetLink}/>
            <SignupContainer>
                <NoAccountText>Don&rsquo;t have an account?</NoAccountText>
                <CentralButton isReset buttonWidthOverride='160px' buttonType={ButtonType.SIGNUP} isEnabled={isSignupEnabled} onClick={handleSignupClick}/>
            </SignupContainer>
        </>
  )
}
