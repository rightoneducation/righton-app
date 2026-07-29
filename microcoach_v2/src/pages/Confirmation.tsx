import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import {
  useMicroCoachDataState,
  useMicroCoachDataDispatch,
} from '../hooks/context/useMicroCoachDataContext';
import { UserStatusType } from '../lib/MicroCoachModels';

export default function Confirmation() {
  const apiClients = useAPIClientsContext();
  const { userProfile } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!apiClients) return null;
  if (!userProfile) {
    navigate('/signup');
    return null;
  }

  const handleConfirm = async () => {
    setError('');
    try {
      const created = await apiClients.microcoachDataManager.signUpConfirmAndBuildBackendUser(
        userProfile,
        code,
      );
      dispatch({ type: 'SET_USER_PROFILE', payload: created });
      dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify that code.');
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await apiClients.auth.awsResendConfirmationCode(userProfile.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code.');
    }
  };

  return (
    <AuthShell title="Verify your email">
      <Typography variant="body2" align="center">
        Enter the code we sent to {userProfile.email}.
      </Typography>
      <TextField label="Confirmation code" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Button variant="contained" onClick={handleConfirm}>Verify</Button>
      <Button variant="text" onClick={handleResend}>Resend code</Button>
    </AuthShell>
  );
}
