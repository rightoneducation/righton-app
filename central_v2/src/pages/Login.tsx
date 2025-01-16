import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { IAuthAPIClient } from '@righton/networking';
import RightOnLogo from '../images/RightOnLogo.png';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';

const InnerBodyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  gap: '20px',
  // height: '100vh',
  border: '1px solid red'
}));

const UpperLogin = styled(Box)(({ theme }) => ({
  display: 'flex',
  // border: '1px solid blue',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
}));

const UpperLoginText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700, 
  fontSize: '24px', 
  color: '#02215F',
  textAlign: 'center', 
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
  minHeight: '52px',
}));


export default function Login() {
  return (
    <SignUpMainContainer>

      <InnerBodyContainer>
        <UpperLogin>
          <img src={RightOnLogo} alt="Right On Logo" style={{ width: '200px', height: '200px' }} />
          <UpperLoginText>Sign In to an Existing Account</UpperLoginText>
          <UpperLoginGoogleButton>Sign Up with Google</UpperLoginGoogleButton>
        </UpperLogin>
      </InnerBodyContainer>

    </SignUpMainContainer>


  );
}
