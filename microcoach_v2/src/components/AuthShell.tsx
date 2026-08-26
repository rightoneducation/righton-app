import React, { ReactNode } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';

export default function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Paper elevation={3}>
        <Stack spacing={2}>
          <Typography variant="h2" align="center">
            {title}
          </Typography>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
