import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import PregameContainer from './PregameContainer';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/4_Pages/PregameContainer',
  component: PregameContainer,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PregameContainer>;

const Template: ComponentStory<typeof PregameContainer> =
  function PregameContainerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <PregameContainer {...args} />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {};
