import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUserProfile, UserRole } from '../api';
import AuthShell from '../components/AuthShell';
import { useAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import {
  useMicroCoachDataState,
  useMicroCoachDataDispatch,
} from '../hooks/context/useMicroCoachDataContext';
import { UserStatusType } from '../lib/MicroCoachModels';

// Step 2 after Google federation: collect any remaining fields and create the
// backend User row.
export default function GoogleSignup() {
  const apiClients = useAPIClientsContext();
  const { userProfile } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState(userProfile?.teacherName ?? '');
  const [error, setError] = useState('');

  if (!apiClients) return null;

  const handleFinish = async () => {
    setError('');
    const profile: IUserProfile = {
      email: userProfile?.email ?? '',
      teacherName,
      role: UserRole.MEMBER,
      classes: [],
    };
    try {
      const created = await apiClients.microcoachDataManager.signUpGoogleBuildBackendUser(profile);
      dispatch({ type: 'SET_USER_PROFILE', payload: created });
      dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not finish setting up your account.');
    }
  };

  return (
    <AuthShell title="Finish setting up your account">
      <TextField label="Teacher name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} fullWidth />
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Button variant="contained" onClick={handleFinish}>Get started</Button>
    </AuthShell>
  );
}
