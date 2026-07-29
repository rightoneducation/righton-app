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
        gap: (theme) => `${theme.sizing.xSmPadding}px`,
        padding: (theme) => `${theme.sizing.mdPadding}px`,
        textAlign: 'center',
        background: (theme) => theme.palette.designSystem.gradients.background,
      }}
    >
      <Typography variant="title">MicroCoach</Typography>
      <Typography variant="paragraph">
        Project skeleton is up and running.
      </Typography>
    </Box>
  );
}
