import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { GoogleLogin } from '@react-oauth/google';
import { IAuthAPIClient } from '@righton/networking';
import { useNavigate } from 'react-router-dom'; 
import RightOnLogo from '../images/RightOnLogo.png';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import CentralButton from "../components/button/Button";
import { ButtonType } from '../components/button/ButtonModels';
import ResetPassword from './ResetPassword';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';

const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  gap: '20px',
  // height: '100vh',
  // border: '1px solid red'
  marginTop: '-8px',
  marginBottom: '-100px'
}));

const UpperLogin = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
}));

const UpperLoginText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700, 
  fontSize: '24px', 
  color: '#02215F',
  textAlign: 'center', 
  // border: '1px solid green',

}));

const UpperLoginGoogleButton = styled(Typography)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#0966E0', 
  border: '2px solid #0966E0', // Set border to 2px with the same color
  borderRadius: '8px', // Set border radius to 8px
  backgroundColor: 'white', // Set background color to white
  minHeight: '45.77px',
  
}));

const OrText = styled(Typography)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  color: '#384466', 
  // border: '1px solid yellow',
  fontFamily: 'Poppins, sans-serif', 
  fontWeight: 600, 
  fontSize: '16px', 
  // border: '1px solid green',

}));

const MiddleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid green',
  flexDirection: 'column',
  gap: '12px'

}));

const ForgotPasswordButton = styled('button')(({ theme }) => ({
  all: 'unset', // Resets all default styles for a button
  color: '#02215F', 
  fontFamily: 'Rubik, sans-serif', 
  fontWeight: 400, 
  fontSize: '16px', 
  marginTop: '-8px',
  cursor: 'pointer', // Add pointer cursor for button-like behavior
  // border:'1px red solid'
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

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid green',
  justifyContent: 'center',
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

interface LoginProps{
  handleForgotPasswordClick: () => void

}

function Login({handleForgotPasswordClick} : LoginProps) {

  const navigate = useNavigate(); // Initialize useNavigate
  const [userName, setUserName] = useState('');

  const buttonTypeLogin = ButtonType.LOGIN;
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);
  
  const buttonTypeSignup = ButtonType.SIGNUP;
  const [isSignupEnabled, setIsSignupEnabled] = useState(true);

  const [password, setPassword] = useState('');
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const handleLoginClick = async () => {
    try {
      await apiClients.auth.awsSignIn(userName, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Error during login:', error);
      // You can also display an error message to the user if needed
    }
  };


  const handleSignupClick = () => {
    navigate('/Signup'); // Navigate to the Signup page
  };
  
  return (
    <SignUpMainContainer>
      <InnerBodyContainer>
        <UpperLogin>
          <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
          <UpperLoginText>Sign In to an Existing Account</UpperLoginText>
          <UpperLoginGoogleButton>Log in with Google</UpperLoginGoogleButton>
        </UpperLogin>
        <OrText>or</OrText>
        <MiddleContainer>
          <UserTextField
                variant="outlined"
                placeholder="Username or Email"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
          />
          <UserTextField
                variant="outlined"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
          />
          <ForgotPasswordButton onClick={handleForgotPasswordClick}>
            Forgot your password?
          </ForgotPasswordButton>
        </MiddleContainer>
        <LoginContainer>
          <CentralButton buttonType={buttonTypeLogin} isEnabled={isLoginEnabled} onClick={handleLoginClick}/>
        </LoginContainer>
        <SignupContainer>
          <NoAccountText>Dont have an account?</NoAccountText>
          <CentralButton buttonType={buttonTypeSignup} isEnabled={isSignupEnabled} onClick={handleSignupClick}/>
        </SignupContainer>
      </InnerBodyContainer>
    </SignUpMainContainer>
  );
}

export default function LoginSwitch() {
  const [isPasswordForgot, setisPasswordForgot] = useState(false); // Track submission state

  const handleForgotPasswordClick = () => {
    setisPasswordForgot(true)
  };

  return isPasswordForgot? (
    <ResetPassword />
  ) : (
    <Login handleForgotPasswordClick={handleForgotPasswordClick}/>
  )

}
