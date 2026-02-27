import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Typography, Stack } from '@mui/material';
import { trackError, PlayEvent } from '../lib/analytics';
import BackgroundContainerStyled from '../lib/styledcomponents/layout/BackgroundContainerStyled';
import IntroButtonStyled from '../lib/styledcomponents/IntroButtonStyled';

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
    trackError(PlayEvent.UNHANDLED_JS_ERROR, error, {
      componentStack: info.componentStack ?? '',
      location: window.location.pathname,
    });
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <BackgroundContainerStyled justifyContent="center" alignItems="center">
          <Stack spacing={2} sx={{ alignItems: 'center', padding: '48px', textAlign: 'center' }}>
            <Typography variant="h1">Something went wrong.</Typography>
            <Typography variant="h2">
              Please refresh the page and try again.
            </Typography>
            <IntroButtonStyled onClick={() => window.location.reload()}>
              Refresh Page
            </IntroButtonStyled>
          </Stack>
        </BackgroundContainerStyled>
      );
    }
    return children;
  }
}
