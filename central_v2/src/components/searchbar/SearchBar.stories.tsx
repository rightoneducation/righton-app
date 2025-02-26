import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { ScreenSize } from '../../lib/CentralModels';
import SearchBar from './SearchBar';
import Theme from '../../lib/Theme';
// import i18n from '../i18n.mock';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/SearchBar',
  component: SearchBar,
} as Meta<typeof SearchBar>;

const Template: StoryFn<typeof SearchBar> = function CardTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <SearchBar {...args} />
    </ThemeProvider>
  );
};

export const Mobile = Template.bind({});
Mobile.args = {
  screenSize: ScreenSize.SMALL,
};
Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile2',
  },
};

export const TabletDesktop = Template.bind({});
TabletDesktop.args = {
  screenSize: ScreenSize.LARGE,
};
TabletDesktop.parameters = {
  viewport: {
    defaultViewport: 'desktop',
  },
};
