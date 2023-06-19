/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../src/lib/Theme';
import EnterPlayerName from '../../src/pages/pregame/EnterPlayerName';
import { PregameState } from '../../src/lib/PlayModels';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
  }));

export function renderWithTheme(children: React.ReactElement) {
   return render(<ThemeProvider theme={Theme}>{children}</ThemeProvider>);
}

let firstName = '';
let lastName = '';

const setFirstName = (name: string) => {
  return true;
}

const setLastName = (name: string) => {
  return true;
}

const setPregameState = (state: PregameState) => {
};

describe('EnterGameCode', () => {
  it('should render the EnterGameCode page', async () => {
      const {debug} = renderWithTheme( <EnterPlayerName isSmallDevice={true} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} setPregameState={setPregameState}/> );
      expect(screen.getByTestId('playername-firstinputtextfield')).toBeInTheDocument();
      expect(screen.getByTestId('playername-lastinputtextfield')).toBeInTheDocument();
      // debug();
  });
});