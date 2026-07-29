import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Landing() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        px: 3,
        textAlign: 'center',
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Typography variant="h3" color="primary">
        MicroCoach
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Project skeleton is up and running.
      </Typography>
    </Box>
  );
}
