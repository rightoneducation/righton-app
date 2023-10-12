/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider, createMemoryRouter, useLoaderData } from 'react-router-dom';
import ReactModal from 'react-modal';
import { GameSessionState } from '@righton/networking';
import Theme from '../../src/lib/Theme';
import i18n from '../../src/i18n.mock';
import apiClient from './mock/ApiClient.mock';
import { GameInProgressContainer } from '../../src/containers/GameInProgressContainer';
import useFetchAndSubscribeGameSession from '../../src/hooks/useFetchAndSubscribeGameSession';
import { localModelLoaderMock } from './mock/MockHelperFunctions';
import { BodyContentAreaPhaseResultsStyled } from '../../src/lib/styledcomponents/layout/BodyContentAreasStyled';

ReactModal.setAppElement('body');
// mock for useFetchAndSubscribeGameSession hook
jest.mock('../../src/hooks/useFetchAndSubscribeGameSession', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(() => localModelLoaderMock),
}));

// mock for mediaQueries from: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// mock for router object, specifically allowing mocked loader data to be passed to the component
const routes = [
  {
    path: '/game',
    element: <GameInProgressContainer apiClient={apiClient} />,
    loader: () => localModelLoaderMock,
    
  }
];
const router = createMemoryRouter(routes, {
  initialEntries: ['/game'], // start the history at a specific location
  initialIndex: 0, // optional, defaults to 0
});

function renderWithThemeRouterTranslation(children: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>{children}</ThemeProvider>
    </I18nextProvider>
  );
}

// mock for i18n strings imports translations.json to keep them synched
const howToPlayLoading = i18n.t('howtoplay.loading');
const howToPlayDescription = i18n.t('howtoplay.description');

// tests that the gameinprogresscontainer renders the correct components
// based on the received subscription object from the useFetchAndSubscribeGameSession hook
describe('GameInProgressContainer', () => {
  beforeEach(() => {
    const mockData = localModelLoaderMock();
    (useLoaderData as jest.Mock).mockReturnValue(mockData);
  });
  it('should render error modal', async () => {
    // Mock the hook's return value
    (useFetchAndSubscribeGameSession as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      error: 'Sample Connection Error',
      gameSession: null,
      hasRejoined: false,
    }));
    renderWithThemeRouterTranslation(<RouterProvider router={router} />);
    // expects error modal to be popped if there are connection errors
    expect(screen.getByTestId('errormodal')).toBeInTheDocument();
  });

  it('should render the lobby page in loading', async () => {
    // Mock the hook's return value
    (useFetchAndSubscribeGameSession as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      error: null,
      gameSession: null,
      hasRejoined: true,
    }));
    renderWithThemeRouterTranslation(<RouterProvider router={router} />);
    // expects lobby to render in Rejoin mode (Loading game...)
    expect(screen.getByTestId('lobby-rejoin')).toBeInTheDocument();
  });

  it('should render the lobby page in getting game session', async () => {
    // Mock the hook's return value
    (useFetchAndSubscribeGameSession as jest.Mock).mockImplementation(() => ({
      isLoading: true,
      error: null,
      gameSession: null,
      hasRejoined: false,
    }));
    renderWithThemeRouterTranslation(<RouterProvider router={router} />);
    // expects the how-to-play page to render
    // expect 'Getting game session' text to render indicating app is connecting to game
    expect(screen.getByTestId('lobby-howtoplay')).toBeInTheDocument();
    expect(screen.getByText(howToPlayLoading)).toBeInTheDocument();
  });

  it('should render the lobby page in how to play', async () => {
    const gameSession = await apiClient.createGameSession(1111, false);
    expect(gameSession).toBeDefined();
    gameSession.currentState = GameSessionState.TEAMS_JOINING;
    // Mock the hook's return value
    (useFetchAndSubscribeGameSession as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      error: null,
      gameSession,
      hasRejoined: false,
    }));
    renderWithThemeRouterTranslation(<RouterProvider router={router} />);
    // expects the how-to-play page to render (connecting to game)
    // expects how to play description text to be rendered as howToPlay status text
    expect(screen.getByTestId('lobby-howtoplay')).toBeInTheDocument();
    expect(screen.getByText(howToPlayDescription)).toBeInTheDocument();
  });

  it('should render the GameSessionSwitch page (pregame countdown)', async () => {
    const gameSession = await apiClient.createGameSession(1111, false);
    expect(gameSession).toBeDefined();
    gameSession.currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;
    // Mock the hook's return value
    (useFetchAndSubscribeGameSession as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      error: null,
      gameSession,
      hasRejoined: false,
    }));
    renderWithThemeRouterTranslation(<RouterProvider router={router} />);
    // expects the pregame countdown to start
    expect(screen.getByTestId('pregame-countdown')).toBeInTheDocument();
  });
});
