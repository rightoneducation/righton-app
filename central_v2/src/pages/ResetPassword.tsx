import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import RightOnLogo from '../images/RightOnLogo.png';
import CentralButton from "../components/button/Button";
import { ButtonType } from '../components/button/ButtonModels';

const InnerBodyContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    // border: '1px solid blue',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    // height: '100vh',
    // border: '1px solid red'
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

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  const buttonTypeResetLink = ButtonType.RESETLINK;
  const [isResetLinkEnabled, setIsResetLinkEnabled] = useState(true);
  
  const buttonTypeSignup = ButtonType.SIGNUP;
  const [isSignupEnabled, setIsSignupEnabled] = useState(true);
  
  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleSignupClick = () => {
    navigate('/Signup'); // Navigate to the Signup page
  };


  return (
    <SignUpMainContainer>
        <InnerBodyContainer>
            <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
            <ResetPasswordText>
                Reset Password
            </ResetPasswordText>
            <UserTextField
                variant="outlined"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <CentralButton buttonType={buttonTypeResetLink} isEnabled={isResetLinkEnabled}/>
            <SignupContainer>
                <NoAccountText>Dont have an account?</NoAccountText>
                <CentralButton buttonType={buttonTypeSignup} isEnabled={isSignupEnabled} onClick={handleSignupClick}/>
            </SignupContainer>
        </InnerBodyContainer>

    </SignUpMainContainer>
  )
}
