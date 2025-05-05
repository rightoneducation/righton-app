import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; 
import { useGoogleLogin } from '@react-oauth/google';
import RightOnLogo from '../images/RightOnUserLogo.svg';
import GoogleImageSvg from "../images/googleicon.svg";
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { 
  TextContainerStyled,
} from '../lib/styledcomponents/CreateQuestionStyledComponents';
import CentralButton from "../components/button/Button";
import { ButtonType } from '../components/button/ButtonModels';
import ResetPassword from './ResetPassword';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import LoginErrorModal from '../components/modal/LoginErrorModal';
import ModalBackground from '../components/modal/ModalBackground';
import { UserStatusType } from '../lib/CentralModels';
import { useCentralDataDispatch } from '../hooks/context/useCentralDataContext';


const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
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

const GoogleLoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',  // Make background transparent
  color: '#0966E0',
  padding: '10px 16px',
  fontSize: '16px',
  fontWeight: 500,
  fontFamily: 'Poppins, sans-serif',
  borderRadius: '8px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  border: '2px solid #0966E0',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
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
  handleForgotPasswordClick: () => void;
  handleLogOut: () => void;
}

function Login({handleForgotPasswordClick, handleLogOut} : LoginProps) {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate
  const [userName, setUserName] = useState('');

  const buttonTypeLogin = ButtonType.LOGIN;
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);
  
  const buttonTypeSignup = ButtonType.SIGNUP;
  const [isSignupEnabled, setIsSignupEnabled] = useState(true);

  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  
  const centralDataDispatch = useCentralDataDispatch();

  const handleLoginClick = async () => {
    try {
      setIsLoggingIn(true);
      const localProfile = await apiClients.centralDataManager?.loginUserAndRetrieveUserProfile(userName, password);
      centralDataDispatch({ type: 'SET_USER_PROFILE', payload: localProfile });
      centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
      setIsLoggingIn(false);
      navigate('/');
    } catch (error) {
      setIsModalOpen(true);
      setIsLoggingIn(false);
      console.error('Error during login:', error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const idToken = credentialResponse.access_token; // Use `access_token` for OAuth login
        if (idToken) {
          await apiClients.auth.awsSignInFederated();
        } else {
          console.error('Google sign-in token is missing');
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
      }
    },
    onError: () => {
      console.error('Google Sign-In Failed');
    },
  });

  const handleSignupClick = () => {
    navigate('/Signup'); // Navigate to the Signup page
  };
  
  return (
    <SignUpMainContainer>
      <LoginErrorModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleLogOut={handleLogOut}/>
      <ModalBackground isModalOpen={isModalOpen} handleCloseModal={() => setIsModalOpen(false)}/>
      <InnerBodyContainer>
        <UpperLogin>
          <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
          <UpperLoginText>Sign In to an Existing Account</UpperLoginText>
          <GoogleLoginButton onClick={() => googleLogin()} variant="contained">
            <img src={GoogleImageSvg} alt="Google Icon" width="30px" height="30px" />
            Login with Google
          </GoogleLoginButton>
        </UpperLogin>
        <OrText>or</OrText>
        <MiddleContainer>
          <TextContainerStyled
                variant="outlined"
                placeholder="Email"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
          />
          <TextContainerStyled
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
          <CentralButton buttonType={buttonTypeLogin} isEnabled={isLoginEnabled && !isLoggingIn} smallScreenOverride onClick={handleLoginClick}/>
        </LoginContainer>
        <SignupContainer>
          <NoAccountText>Don&rsquo;t have an account?</NoAccountText>
          <CentralButton buttonType={buttonTypeSignup} isEnabled={isSignupEnabled} smallScreenOverride  onClick={handleSignupClick}/>
        </SignupContainer>
        {isLoggingIn && 
          <Box style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
              <CircularProgress style={{color: theme.palette.primary.darkBlueCardColor}}/>
          </Box>
        } 
      </InnerBodyContainer>
    </SignUpMainContainer>
  );
}

interface LoginSwitchProps {
  handleLogOut: () => void;
}

export default function LoginSwitch({handleLogOut}: LoginSwitchProps) {
  const [isPasswordForgot, setisPasswordForgot] = useState(false); // Track submission state

  const handleForgotPasswordClick = () => {
    setisPasswordForgot(true)
  };

  return isPasswordForgot? (
    <ResetPassword />
  ) : (
    <Login handleForgotPasswordClick={handleForgotPasswordClick} handleLogOut={handleLogOut}/>
  )

}
