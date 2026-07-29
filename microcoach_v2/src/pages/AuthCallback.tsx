import React from 'react';
import { Typography } from '@mui/material';
import AuthShell from '../components/AuthShell';

// Landing route for the Cognito Hosted-UI redirect (/auth). validateUser (run in
// AuthLayout) resolves the session and AuthGuard redirects based on userStatus,
// so this is just a brief placeholder while that happens.
export default function AuthCallback() {
  return (
    <AuthShell title="Completing sign-in…">
      <Typography variant="body2" align="center">
        One moment while we finish signing you in.
      </Typography>
    </AuthShell>
  );
}
