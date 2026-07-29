import React, { useState } from 'react';
import { Button, TextField, Typography, Link as MuiLink, Divider } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { useMicroCoachDataDispatch } from '../hooks/context/useMicroCoachDataContext';
import { UserStatusType } from '../lib/MicroCoachModels';

export default function Login() {
  const apiClients = useAPIClientsContext();
  const dispatch = useMicroCoachDataDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!apiClients) return null;

  const handleLogin = async () => {
    setError('');
    try {
      const profile = await apiClients.microcoachDataManager.loginAndRetrieveUserProfile(
        email,
        password,
      );
      if (profile) {
        dispatch({ type: 'SET_USER_PROFILE', payload: profile });
        dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
        navigate('/');
      } else {
        setError('Signed in, but no MicroCoach profile was found.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  return (
    <AuthShell title="Log in">
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Button variant="contained" onClick={handleLogin}>Log in</Button>
      <Divider>or</Divider>
      <Button variant="outlined" onClick={() => apiClients.auth.awsSignInFederated()}>
        Continue with Google
      </Button>
      <Typography variant="body2" align="center">
        New here? <MuiLink component={RouterLink} to="/signup">Sign up</MuiLink>
      </Typography>
      <Typography variant="body2" align="center">
        <MuiLink component={RouterLink} to="/password/reset">Forgot password?</MuiLink>
      </Typography>
    </AuthShell>
  );
}
