import React, { ReactNode } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';

// Minimal centered card used by the auth pages. Intentionally plain — the design
// team's new auth UX replaces these visuals later. Values come from the design
// system (src/lib/Theme.tsx) rather than literals so that swap is a token edit.
export default function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: (theme) => `${theme.sizing.smPadding}px`,
        background: (theme) => theme.palette.designSystem.gradients.background,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: (theme) => `${theme.sizing.lgPadding}px`,
          width: '100%',
          maxWidth: (theme) => `${theme.sizing.authCardMaxWidth}px`,
          background: (theme) => theme.palette.designSystem.surface.card,
          border: (theme) => theme.borders.solid,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="title" align="center">
            {title}
          </Typography>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
