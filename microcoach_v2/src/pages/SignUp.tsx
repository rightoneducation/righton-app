import React, { useState } from 'react';
import { Button, TextField, Typography, Link as MuiLink, Divider } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { UserRole, IUserProfile } from '../api';
import AuthShell from '../components/AuthShell';
import { useAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { useMicroCoachDataDispatch } from '../hooks/context/useMicroCoachDataContext';

export default function SignUp() {
  const apiClients = useAPIClientsContext();
  const dispatch = useMicroCoachDataDispatch();
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  if (!apiClients) return null;

  const handleSubmit = async () => {
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    const profile: IUserProfile = { email, password, teacherName, role: UserRole.MEMBER, classes: [] };
    try {
      await apiClients.microcoachDataManager.signUpSendConfirmationCode(profile);
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      navigate('/confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.');
    }
  };

  return (
    <AuthShell title="Create your account">
      <TextField label="Teacher name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} fullWidth />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      <TextField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth />
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Button variant="contained" onClick={handleSubmit}>Sign up</Button>
      <Divider>or</Divider>
      <Button variant="outlined" onClick={() => apiClients.auth.awsSignInFederated()}>
        Sign up with Google
      </Button>
      <Typography variant="body2" align="center">
        Already have an account? <MuiLink component={RouterLink} to="/login">Log in</MuiLink>
      </Typography>
    </AuthShell>
  );
}
