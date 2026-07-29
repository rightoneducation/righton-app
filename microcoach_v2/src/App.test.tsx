import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test: mounts the full provider stack (StyledEngineProvider ->
// ThemeProvider -> CssBaseline -> RouterProvider). This catches styling-engine
// and duplicate-React failures that a static index.html check cannot.
test('renders the landing shell without crashing', () => {
  render(<App />);
  expect(screen.getByText('MicroCoach')).toBeInTheDocument();
});
