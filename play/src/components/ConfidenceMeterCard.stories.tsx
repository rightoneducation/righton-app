import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { ConfidenceLevel } from '@righton/networking';
import ConfidenceMeterCard from './ConfidenceMeterCard';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/ConfidenceMeterCard',
  component: ConfidenceMeterCard,
} as Meta<typeof ConfidenceMeterCard>;

const Template: StoryFn<typeof ConfidenceMeterCard> =
  function ConfidenceMeterCardTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <ConfidenceMeterCard {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

const handleSelectOption = () => {};

// no input i.e. no selected option without sending response text
export const noSelection = Template.bind({});
noSelection.args = {
  selectedOption: ConfidenceLevel.NOT_RATED,
  isSelected: false,
  handleSelectOption,
};

// different inputs with sending response text
export const notAtAll = Template.bind({});
notAtAll.args = {
  selectedOption: ConfidenceLevel.NOT_AT_ALL,
  isSelected: true,
  handleSelectOption,
};

export const kinda = Template.bind({});
kinda.args = {
  selectedOption: ConfidenceLevel.KINDA,
  isSelected: true,
  handleSelectOption,
};

export const quite = Template.bind({});
quite.args = {
  selectedOption: ConfidenceLevel.QUITE,
  isSelected: true,
  handleSelectOption,
};

export const very = Template.bind({});
very.args = {
  selectedOption: ConfidenceLevel.VERY,
  isSelected: true,
  handleSelectOption,
};

export const totally = Template.bind({});
totally.args = {
  selectedOption: ConfidenceLevel.TOTALLY,
  isSelected: true,
  handleSelectOption,
};
