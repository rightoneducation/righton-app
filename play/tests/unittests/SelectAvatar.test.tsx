/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import Theme from '../../src/lib/Theme';
import i18n from '../mockTranslations';
import SelectAvatar from '../../src/pages/pregame/SelectAvatar';
import ReactModal from 'react-modal';
ReactModal.setAppElement('body');

export function renderWithThemeRouterTranslation(children: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

const setSelectedAvatar = jest.fn();
const setIsAPIError = jest.fn();

describe('SelectAvatar', () => {
  it('should render the SelectAvatar page', async () => {
    const handleAvatarSelectClick = jest.fn();
    renderWithThemeRouterTranslation(
      <SelectAvatar
        selectedAvatar={0}
        firstName={'Test'}
        lastName={'Test'}
        setSelectedAvatar={setSelectedAvatar}
        isSmallDevice={true}
        handleAvatarSelectClick={handleAvatarSelectClick}
        isAPIError={false}
        setIsAPIError={setIsAPIError}
      />
    );
    // expects all 6 monster icons and button to render
    expect(screen.getAllByTestId('selectavatar-icon').length === 6);
    expect(screen.getByTestId('selectavatar-button')).toBeInTheDocument();
  });

  it ('onclick should fire add teams callback' , async () => {
    const handleAvatarSelectClick = jest.fn();
    renderWithThemeRouterTranslation(
      <SelectAvatar
        selectedAvatar={0}
        firstName={'Test'}
        lastName={'Test'}
        setSelectedAvatar={setSelectedAvatar}
        isSmallDevice={true}
        handleAvatarSelectClick={handleAvatarSelectClick}
        isAPIError={false}
        setIsAPIError={setIsAPIError}
      />
    );
    const buttonElement = screen.getByTestId('selectavatar-button');
    fireEvent.click(buttonElement);
    expect(handleAvatarSelectClick).toHaveBeenCalled();

  });


  it ('error should reveal error modal' , async () => {
    const handleAvatarSelectClick = jest.fn();
    renderWithThemeRouterTranslation(
      <SelectAvatar
        selectedAvatar={0}
        firstName={'Test'}
        lastName={'Test'}
        setSelectedAvatar={setSelectedAvatar}
        isSmallDevice={true}
        handleAvatarSelectClick={handleAvatarSelectClick}
        isAPIError={true}
        setIsAPIError={setIsAPIError}
      />
    );
    expect(screen.getByTestId('errormodal')).toBeInTheDocument();

  });
});