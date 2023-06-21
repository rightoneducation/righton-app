/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../src/lib/Theme';
import EnterGameCode from '../../src/pages/pregame/EnterGameCode';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

export function renderWithTheme(children: React.ReactElement) {
  return render(<ThemeProvider theme={Theme}>{children}</ThemeProvider>);
}

const handleGameCodeClick = jest.fn(async () => {
  return true;
});

describe('EnterGameCode', () => {
  it('should render the EnterGameCode page', async () => {
    const { debug } = renderWithTheme(
      <EnterGameCode
        isSmallDevice={true}
        handleGameCodeClick={handleGameCodeClick}
      />
    );
    expect(screen.getByTestId('gameCode-inputtextfield')).toBeInTheDocument();
    // debug();
  });

  it('validate textfield input', async () => {
    const { debug } = renderWithTheme(
      <EnterGameCode
        isSmallDevice={true}
        handleGameCodeClick={handleGameCodeClick}
      />
    );
    const inputElementContainer = screen.getByTestId('gameCode-inputtextfield');
    const inputElement = within(inputElementContainer).getByRole('textbox');

    // test for text input
    fireEvent.change(inputElement, { target: { value: '1234' } });
    expect(inputElement).toHaveValue('1234');

    // test for non-numeric input
    fireEvent.change(inputElement, { target: { value: '1aa4' } });
    expect(inputElement).toHaveValue('14');

    // test for too long input
    fireEvent.change(inputElement, { target: { value: 'dafdasdfa111sdf' } });
    expect(inputElement).toHaveValue('111');

    const buttonElement = screen.getByText('joingame.gamecode.button');
    // Simulate button click
    fireEvent.click(buttonElement);
    // Ensure handleGameCodeClick function is called
    expect(handleGameCodeClick).toHaveBeenCalled();
  });
});
