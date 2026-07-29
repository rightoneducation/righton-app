import React, { ReactNode } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';

// Minimal centered card used by the auth pages. Intentionally plain — the design
// team's new auth UX replaces these visuals later.
export default function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Stack spacing={2}>
          <Typography variant="h5" color="primary" align="center">
            {title}
          </Typography>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
