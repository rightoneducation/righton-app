import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAPIClientsContext } from '../hooks/context/useAPIClientsContext';

export default function ResetPassword() {
  const apiClients = useAPIClientsContext();
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  if (!apiClients) return null;

  const handleRequest = async () => {
    setError('');
    try {
      await apiClients.auth.awsResetPassword(email);
      setStep('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the reset.');
    }
  };

  const handleConfirm = async () => {
    setError('');
    try {
      await apiClients.auth.awsConfirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset your password.');
    }
  };

  return (
    <AuthShell title="Reset password">
      {step === 'request' ? (
        <>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button variant="contained" onClick={handleRequest}>Send reset code</Button>
        </>
      ) : (
        <>
          <TextField label="Confirmation code" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
          <TextField label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button variant="contained" onClick={handleConfirm}>Set new password</Button>
        </>
      )}
    </AuthShell>
  );
}
