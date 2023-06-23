/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { ApiClient, Environment } from '@righton/networking';
import Theme from '../../src/lib/Theme';
import i18n from '../mockTranslations';
import { GameInProgressContainer } from '../../src/containers/GameInProgressContainer';
import localModel from './mock/localModel.json';
import gameSession from './mock/gamesessions/teamsJoinGameSession.json'

jest.mock('../../src/hooks/useFetchAndSubscribeGameSession', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useFetchAndSubscribeGameSession from '../../src/hooks/useFetchAndSubscribeGameSession';
const apiClient = new ApiClient(Environment.Staging);
const routes = [
  {
    path: "/game",
    element: <GameInProgressContainer apiClient={apiClient} />,
    loader: () => localModel,
  },
];
const router = createMemoryRouter(routes, {
  initialEntries: ['/game'],  // start the history at a specific location
  initialIndex: 0,  // optional, defaults to 0
});

export function renderWithThemeRouterTranslation(children: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
          {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}


describe ('GameInProgressContainer', () => {
  it('should render the GameInProgressContainer page', async () => {
    // Mock the hook's return value
    (useFetchAndSubscribeGameSession as jest.Mock).mockImplementation(() => ({
      isLoading: true,
      error: null,
      gameSession: null,
    }));
    renderWithThemeRouterTranslation(
      <RouterProvider router={router} />
    );
    // expects text fields to render, invalid text field not to render
    expect(
      screen.getByTestId('lobby-rejoin')
    ).toBeInTheDocument();

  });

});
