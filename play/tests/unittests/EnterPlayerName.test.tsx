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

describe('EnterPlayerName', () => {
  it('should render the EnterPlayerName page', async () => {
    const {debug} = renderWithTheme( <EnterPlayerName isSmallDevice={true} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} setPregameState={setPregameState}/> );
    expect(screen.getByTestId('playername-firstinputtextfield')).toBeInTheDocument();
    expect(screen.getByTestId('playername-lastinputtextfield')).toBeInTheDocument();
    // debug();
  });

  it ('first name is placeholder', async () => {
    const setFirstName = jest.fn().mockImplementation((value) => value);
    const {debug} = renderWithTheme( <EnterPlayerName isSmallDevice={true} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} setPregameState={setPregameState}/> );
    const FirstNameContainer = screen.getByTestId('playername-firstinputtextfield');
    const FirstNameElement = within(FirstNameContainer).getByRole('textbox');
    

    // const LastNameContainer = screen.getByTestId('playername-lastinputtextfield');
    // const LastNameElement = within(LastNameContainer).getByRole('textbox');
    
    // test for placeholder first name
    fireEvent.change(FirstNameElement, { target: { value: 'First Name' } });
    expect(FirstNameElement).toHaveValue('First Name');
    // fireEvent.change(LastNameElement, { target: { value: 'Valid' } });
    // expect(FirstNameElement).toHaveValue('Valid');

    // const buttonElement = screen.getByText('joingame.playername.button');
    // fireEvent.click(buttonElement);
    // expect(screen.getByTestId('playername-invalidtext')).toBeInTheDocument();
  });

  // it ('last name is placeholder', async () => {
  //   const {debug} = renderWithTheme( <EnterPlayerName isSmallDevice={true} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} setPregameState={setPregameState}/> );
  //   const FirstNameContainer = screen.getByTestId('playername-firstinputtextfield');
  //   const FirstNameElement = within(FirstNameContainer).getByRole('textbox');
  //   const LastNameContainer = screen.getByTestId('playername-lastinputtextfield');
  //   const LastNameElement = within(LastNameContainer).getByRole('textbox');

  //   // test for placeholder last name
  //   fireEvent.change(FirstNameElement, { target: { value: 'Valid' } });
  //   fireEvent.change(LastNameElement, { target: { value: 'Last Name' } });

  //   const buttonElement = screen.getByText('joingame.playername.button');
  //   fireEvent.click(buttonElement);
  //   expect(screen.getByTestId('playername-invalidtext')).toBeInTheDocument();
  // });

  // it ('both names are placeholder', async () => {
  //   const {debug} = renderWithTheme( <EnterPlayerName isSmallDevice={true} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} setPregameState={setPregameState}/> );
  //   const FirstNameContainer = screen.getByTestId('playername-firstinputtextfield');
  //   const FirstNameElement = within(FirstNameContainer).getByRole('textbox');
  //   const LastNameContainer = screen.getByTestId('playername-lastinputtextfield');
  //   const LastNameElement = within(LastNameContainer).getByRole('textbox');

  //   // test for placeholder both names
  //   fireEvent.change(FirstNameElement, { target: { value: 'First Name' } });
  //   fireEvent.change(LastNameElement, { target: { value: 'Last Name' } });

  //   const buttonElement = screen.getByText('joingame.playername.button');
  //   fireEvent.click(buttonElement);
  //   expect(screen.getByTestId('playername-invalidtext')).toBeInTheDocument();
  // });

  // it ('both names are valid', async () => {
  //   const {debug} = renderWithTheme( <EnterPlayerName isSmallDevice={true} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} setPregameState={setPregameState}/> );
  //   const FirstNameContainer = screen.getByTestId('playername-firstinputtextfield');
  //   const FirstNameElement = within(FirstNameContainer).getByRole('textbox');
  //   const LastNameContainer = screen.getByTestId('playername-lastinputtextfield');
  //   const LastNameElement = within(LastNameContainer).getByRole('textbox');

  //   // test for valid input
  //   fireEvent.change(FirstNameElement, { target: { value: 'Valid' } });
  //   fireEvent.change(LastNameElement, { target: { value: 'Valid' } });
  //   expect(LastNameElement).toHaveValue('Valid');

  //   const buttonElement = screen.getByText('joingame.playername.button');
  //   fireEvent.click(buttonElement);
  //   debug();
  //   expect(screen.getByTestId('playername-invalidtext')).not.toBeInTheDocument();

  // });
});