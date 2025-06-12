import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import RightOnLogo from '../images/RightOnUserLogo.svg';
import GoogleImageSvg from '../images/googleicon.svg';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import { TextContainerStyled } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import CentralButton from '../components/button/Button';
import { ButtonType } from '../components/button/ButtonModels';
import ResetPassword from './ResetPassword';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import LoginErrorModal from '../components/modal/LoginErrorModal';
import ModalBackground from '../components/modal/ModalBackground';
import { UserStatusType } from '../lib/CentralModels';
import { useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import NotVerifiedModal from '../components/modal/NotVerifiedModal';

const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
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
}));

const GoogleLoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent', // Make background transparent
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
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  fontSize: '16px',
}));

const MiddleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));

const ForgotPasswordButton = styled('button')(({ theme }) => ({
  all: 'unset', // Resets all default styles for a button
  color: '#02215F',
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400,
  fontSize: '16px',
  marginTop: '-8px',
  cursor: 'pointer', // Add pointer cursor for button-like behavior
}));

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const SignupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
}));

const NoAccountText = styled(Typography)(({ theme }) => ({
  color: '#02215F',
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400,
  fontSize: '16px',
}));

interface LoginProps {
  handleLogOut: () => void;
}

export default function Login({ handleLogOut }: LoginProps) {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate
  const [userName, setUserName] = useState('');

  const buttonTypeLogin = ButtonType.LOGIN;
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);

  const buttonTypeSignup = ButtonType.SIGNUP;
  const [isSignupEnabled, setIsSignupEnabled] = useState(true);

  // password input field
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isNotVerifiedModalOpen, setIsNotVerifiedModalOpen] = useState(false);
  const handleClickShowPassword = () => setIsShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const [isNonVerifiedModalOpen, setIsNonVerifiedModalOpen] = useState(false);

  const centralDataDispatch = useCentralDataDispatch();

  const handleLoginClick = async () => {
    try {
      setIsLoggingIn(true);
      const localProfile =
        await apiClients.centralDataManager?.loginUserAndRetrieveUserProfile(
          userName,
          password,
        );
      centralDataDispatch({ type: 'SET_USER_PROFILE', payload: localProfile });
      centralDataDispatch({
        type: 'SET_USER_STATUS',
        payload: UserStatusType.LOGGEDIN,
      });
      setIsLoggingIn(false);
      navigate('/');
    } catch (error) {
      // TODO: Needs to check for actual verification.
      // Signin just returns bad requrest 400 instead of giving specific errors.

      if (
        error instanceof Error &&
        error.message.includes(
          'UserUnAuthenticatedException: User needs to be authenticated to call this API',
        )
      ) {
        const response = await apiClients.user.deleteUnverifiedUser(userName);
        setIsNotVerifiedModalOpen(true);
      } else {
        setIsModalOpen(true);
      }
      setIsLoggingIn(false);
      console.error(error);
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

  const handleGoogleClick = async () => {
    googleLogin();
  };

  const handleSignupClick = () => {
    navigate('/Signup'); // Navigate to the Signup page
  };

  const handleForgotPasswordClick = () => {
    navigate('/password/reset');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsNotVerifiedModalOpen(false);
  };

  return (
    <SignUpMainContainer>
      <LoginErrorModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleLogOut={handleLogOut}
      />
      <NotVerifiedModal
        isModalOpen={isNotVerifiedModalOpen}
        setIsModalOpen={setIsNotVerifiedModalOpen}
      />
      <ModalBackground
        isModalOpen={isModalOpen || isNotVerifiedModalOpen}
        handleCloseModal={handleCloseModal}
      />
      <InnerBodyContainer>
        <UpperLogin>
          <img
            src={RightOnLogo}
            alt="Right On Logo"
            style={{ width: '200px', height: '200px' }}
          />
          <UpperLoginText>Sign In to an Existing Account</UpperLoginText>
          <GoogleLoginButton onClick={handleGoogleClick} variant="contained">
            <img
              src={GoogleImageSvg}
              alt="Google Icon"
              width="30px"
              height="30px"
            />
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
            type={isShowPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      isShowPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <ForgotPasswordButton onClick={handleForgotPasswordClick}>
            Forgot your password?
          </ForgotPasswordButton>
        </MiddleContainer>
        <LoginContainer>
          <CentralButton
            buttonType={buttonTypeLogin}
            isEnabled={isLoginEnabled && !isLoggingIn}
            smallScreenOverride
            onClick={handleLoginClick}
          />
        </LoginContainer>
        <SignupContainer>
          <NoAccountText>Don&rsquo;t have an account?</NoAccountText>
          <CentralButton
            buttonType={buttonTypeSignup}
            isEnabled={isSignupEnabled}
            smallScreenOverride
            onClick={handleSignupClick}
          />
        </SignupContainer>
        {isLoggingIn && (
          <Box
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <CircularProgress
              style={{ color: theme.palette.primary.darkBlueCardColor }}
            />
          </Box>
        )}
      </InnerBodyContainer>
    </SignUpMainContainer>
  );
}
