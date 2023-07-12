import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import InputTextFieldStyled from './InputTextFieldStyled';
import Theme from '../Theme';
import i18n from '../../i18n.mock';

export default {
  title: 'Design System/1_Atoms/InputTextField',
  component: InputTextFieldStyled,
} as Meta<typeof InputTextFieldStyled>;

const Template: StoryFn<typeof InputTextFieldStyled> =
  function InputTextFieldStyledTemplate() {
    const theme = useTheme();
    const [gameCodeValue, setGameCodeValue] = useState('####');

    const handleGameCodeChange = (newValue: string) => {
      setGameCodeValue(newValue);
    };

    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <InputTextFieldStyled
            fullWidth
            variant="filled"
            autoComplete="off"
            onChange={(newValue) => {
              handleGameCodeChange(newValue.target.value);
            }}
            onFocus={(newValue) => {
              if (newValue.target.value === '####') {
                handleGameCodeChange('');
              }
            }}
            value={gameCodeValue}
            InputProps={{
              disableUnderline: true,
              inputProps: {
                style: {
                  color:
                    gameCodeValue === '####'
                      ? theme.palette.primary.darkGrey
                      : theme.palette.primary.extraDarkGrey,
                  paddingTop: '9px',
                  textAlign: 'center',
                  fontSize: `${theme.typography.h2.fontSize}px`,
                },
              },
            }}
          />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {};
