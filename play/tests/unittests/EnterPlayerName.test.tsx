/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import Theme from '../../src/lib/Theme';
import i18n from './mock/translations/mockTranslations';
import EnterPlayerName from '../../src/pages/pregame/EnterPlayerName';
import { PregameState } from '../../src/lib/PlayModels';

function renderWithThemeAndTranslation(children: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>{children}</ThemeProvider>
    </I18nextProvider>
  );
}

const setFirstNameMock = jest.fn();
const setLastNameMock = jest.fn();
const setPregameStateMock = jest.fn();

describe('EnterPlayerName', () => {
  it('should render the EnterPlayerName page', async () => {
    renderWithThemeAndTranslation(
      <EnterPlayerName
        isSmallDevice
        firstName=""
        setFirstName={setFirstNameMock}
        lastName=""
        setLastName={setLastNameMock}
        setPregameState={setPregameStateMock}
      />
    );
    // expects text fields to render, invalid text field not to render
    expect(
      screen.getByTestId('playername-firstinputtextfield')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('playername-lastinputtextfield')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('playername-invalidtext')
    ).not.toBeInTheDocument();
  });

  it('first name is placeholder', async () => {
    const setFirstName = jest.fn();
    const setLastName = jest.fn();
    const setPregameState = jest.fn();
    renderWithThemeAndTranslation(
      <EnterPlayerName
        isSmallDevice
        firstName="First Name"
        setFirstName={setFirstName}
        lastName="Valid"
        setLastName={setLastName}
        setPregameState={setPregameState}
      />
    );
    const buttonElement = screen.getByTestId('playername-button');
    fireEvent.click(buttonElement);
    // expects invalid text to render
    expect(screen.getByTestId('playername-invalidtext')).toBeInTheDocument();
  });

  it('last name is placeholder', async () => {
    const buttonText = i18n.t('joingame.playername.button');
    renderWithThemeAndTranslation(
      <EnterPlayerName
        isSmallDevice
        firstName="Valid"
        setFirstName={setFirstNameMock}
        lastName="Last Name"
        setLastName={setLastNameMock}
        setPregameState={setPregameStateMock}
      />
    );
    const buttonElement = screen.getByText(buttonText);
    fireEvent.click(buttonElement);
    // expects invalid text to render
    expect(screen.getByTestId('playername-invalidtext')).toBeInTheDocument();
  });

  it('both names valid', async () => {
    const buttonText = i18n.t('joingame.playername.button');
    renderWithThemeAndTranslation(
      <EnterPlayerName
        isSmallDevice
        firstName="Valid"
        setFirstName={setFirstNameMock}
        lastName="Valid"
        setLastName={setLastNameMock}
        setPregameState={setPregameStateMock}
      />
    );
    const buttonElement = screen.getByText(buttonText);
    fireEvent.click(buttonElement);
    // expects invalid text not to render, setPregameState to be called with Pregamestate.SELECT_AVATAR
    expect(
      screen.queryByTestId('playername-invalidtext')
    ).not.toBeInTheDocument();
    expect(setPregameStateMock).toHaveBeenCalledWith(
      PregameState.SELECT_AVATAR
    );
  });
});
