/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ApiClient, Environment } from '@righton/networking';
import Theme from '../../src/lib/Theme';
import i18n from '../mockTranslations';
import { GameInProgressContainer } from '../../src/containers/GameInProgressContainer';

jest.mock('../../src/hooks/useFetchAndSubscribeGameSession', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useFetchAndSubscribeGameSession from '../../src/hooks/useFetchAndSubscribeGameSession';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route 
        path="/" 
        element={<PregameContainer apiClient={apiClient}/>}
        loader={PregameLocalModelLoader} 
      />
      <Route
        path="/game"
        element={<GameInProgressContainer apiClient={apiClient} />}
        loader={LocalModelLoader}
      />
      <Route element={<RedirectToPlayIfMissing />} />
    </>
  )
);

export function renderWithThemeRouterTranslation(children: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
          {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}
const apiClient = new ApiClient(Environment.Staging);


describe ('GameInProgressContainer', () => {

  it('should render the GameInProgressContainer page', async () => {
    renderWithThemeRouterTranslation(
      <RouterProvider router={router} />
    );

    // Mock the hook's return value
    (useFetchAndSubscribeGameSession as jest.Mock).mockImplementation(() => ({
      isLoading: true,
      error: null,
      gameSession: null,
    }));
    // expects text fields to render, invalid text field not to render
    expect(
      screen.getByTestId('lobby-rejoin')
    ).toBeInTheDocument();

  });

});
