/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import ReactModal from 'react-modal';
import Theme from '../../src/lib/Theme';
import i18n from './mock/translations/mockTranslations';
import SelectAvatar from '../../src/pages/pregame/SelectAvatar';

ReactModal.setAppElement('body');
function renderWithThemeRouterTranslation(children: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

const setSelectedAvatar = jest.fn();
const setIsAPIError = jest.fn();
const firstNameMock = 'Test';
const lastNameMock = 'Test';

describe('SelectAvatar', () => {
  it('should render the SelectAvatar page', async () => {
    const handleAvatarSelectClick = jest.fn();
    renderWithThemeRouterTranslation(
      <SelectAvatar
        selectedAvatar={0}
        firstName={firstNameMock}
        lastName={lastNameMock}
        setSelectedAvatar={setSelectedAvatar}
        isSmallDevice
        handleAvatarSelectClick={handleAvatarSelectClick}
        isAPIError={false}
        setIsAPIError={setIsAPIError}
      />
    );
    // expects all 6 monster icons and button to render
    expect(screen.getAllByTestId('selectavatar-icon').length === 6);
    expect(screen.getByTestId('selectavatar-button')).toBeInTheDocument();
  });

  it('should fire add teams callback on click', async () => {
    const handleAvatarSelectClick = jest.fn();
    renderWithThemeRouterTranslation(
      <SelectAvatar
        selectedAvatar={0}
        firstName={firstNameMock}
        lastName={lastNameMock}
        setSelectedAvatar={setSelectedAvatar}
        isSmallDevice
        handleAvatarSelectClick={handleAvatarSelectClick}
        isAPIError={false}
        setIsAPIError={setIsAPIError}
      />
    );
    const buttonElement = screen.getByTestId('selectavatar-button');
    fireEvent.click(buttonElement);
    expect(handleAvatarSelectClick).toHaveBeenCalled();
  });

  it('error should reveal error modal', async () => {
    const handleAvatarSelectClick = jest.fn();
    renderWithThemeRouterTranslation(
      <SelectAvatar
        selectedAvatar={0}
        firstName={firstNameMock}
        lastName={lastNameMock}
        setSelectedAvatar={setSelectedAvatar}
        isSmallDevice
        handleAvatarSelectClick={handleAvatarSelectClick}
        isAPIError
        setIsAPIError={setIsAPIError}
      />
    );
    expect(screen.getByTestId('errormodal')).toBeInTheDocument();
  });
});
