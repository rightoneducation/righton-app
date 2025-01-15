import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { IAuthAPIClient } from '@righton/networking';
import RightOnLogo from '../images/RightOnLogo.png';

const UpperSignup = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px'
  
}));
const UpperSignupSubStepText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700, 
  fontSize: '24px', 
  color: '#02215F',
  textAlign: 'center', 
}));

const UpperSignupSubGoogle = styled(Typography)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#0966E0', 
  border: '2px solid #0966E0', // Set border to 2px with the same color
  borderRadius: '8px', // Set border radius to 8px
  backgroundColor: 'white', // Set background color to white
  minHeight: '52px',
}));


export default function Login() {
  return (
    <UpperSignup>
      <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
      <UpperSignupSubStepText>Step 1: New Account Registration</UpperSignupSubStepText>
      <UpperSignupSubGoogle>Sign Up with Google</UpperSignupSubGoogle>
    </UpperSignup>
  );
}
