import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from './i18n.mock';

// Smoke test: mounts the full provider stack (StyledEngineProvider ->
// ThemeProvider -> CssBaseline -> RouterProvider). This catches styling-engine
// and duplicate-React failures that a static index.html check cannot.
//
// i18n.mock supplies a synchronous `en` instance so the tree never hits the
// HTTP backend; it has to come in through I18nextProvider because the mock
// deliberately skips `.use(initReactI18next)` (same pattern as central_v2's
// stories).
test('renders the landing shell without crashing', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>,
  );
  expect(await screen.findByText('How it works')).toBeInTheDocument();
});
