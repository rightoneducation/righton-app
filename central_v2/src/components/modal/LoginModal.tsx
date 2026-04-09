import React from 'react';
import {
  Box,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';

const DragText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  lineHeight: '32px',
  fontWeight: 700,
  textAlign: 'center',
}));

const SubText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '18px',
  lineHeight: '20px',
  fontWeight: 400,
  textAlign: 'center',
}));

export default function LoginModal() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup')
  };

  return (
      <Paper
        style={{
          width: '100%',
          maxWidth: '430px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '24px',
          padding: '48px',
        }}
      >
        <DragText>
          Want to view answers?
        </DragText>
        <SubText>
          Solution steps and wrong answer explanations are only available to logged-in users. It is free to create an account.
        </SubText>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <CentralButton
            buttonType={ButtonType.LOGIN}
            isEnabled
            hideIcon
            smallScreenOverride
            onClick={handleLogin}
          />
          <CentralButton
            buttonType={ButtonType.SIGNUPNULL}
            isEnabled
            hideIcon
            smallScreenOverride
            onClick={handleSignUp}
          />
        </Box>
      </Paper>
  );
}
