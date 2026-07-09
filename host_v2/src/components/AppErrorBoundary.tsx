import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { trackError, HostEvent } from '../lib/analytics';

export default class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    trackError(HostEvent.UNHANDLED_JS_ERROR, error, {
      componentStack: info.componentStack ?? '',
      location: window.location.pathname,
    });
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          flexDirection="column"
          gap={2}
          padding={6}
          textAlign="center"
        >
          <Typography variant="h4">Something went wrong.</Typography>
          <Typography variant="body1">
            Please refresh the page and try again.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Box>
      );
    }
    return children;
  }
}
