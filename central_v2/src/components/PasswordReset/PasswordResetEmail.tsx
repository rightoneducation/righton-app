import React, { useState } from 'react';
import { useNavigate, } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CentralButton from "../button/Button";
import { ButtonType } from '../button/ButtonModels';


const ResetPasswordText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700, 
    fontSize: '24px', 
    color: '#02215F',
    textAlign: 'center', 
    // border: '1px solid green',
  }));

const UserTextField = styled(TextField)(({ theme }) => ({
    borderRadius: '8px', // Set border radius to 8px
    backgroundColor: '#FFFFFF', // Set background color to white
    width: '100%',
    '& .MuiInputBase-root': {
        height: '43px',
    '& fieldset': {
      borderWidth: `2px`,
      borderColor: `${theme.palette.primary.grey}`,
      borderRadius: `${theme.sizing.xSmPadding}px`,
    },
    '&.Mui-focused fieldset': {
      borderWidth: `2px`,
      borderColor:`${theme.palette.primary.grey}`,
    },
    '&:hover fieldset': {
      borderWidth: `2px`,
      borderColor:`${theme.palette.primary.extraDarkGrey}`,
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.primary.errorBorder,
    },
    },
    '& .MuiInputBase-input': {
      color: '#384466', // Set text color of the input
      height: '10px',
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
