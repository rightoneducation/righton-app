import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GameInProgress from './GameInProgress';

export default {
  title: 'Design System/4_Pages/GameInProgress',
  component: GameInProgress,
} as ComponentMeta<typeof GameInProgress>;

const Template: ComponentStory<typeof GameInProgress> =
  function GameInProgressTemplate(args) {
    return <GameInProgress {...args} />;
  };

export const TestStoryOne = Template.bind({});
TestStoryOne.args = {
  teamAvatar: 0,
  id: '2d609343-de50-4830-b65e-71eb72bb9bef',
};

export const TestStoryTwo = Template.bind({});
TestStoryTwo.args = {
  teamAvatar: 1,
  id: '2d609343-de50-4830-b65e-71eb72bb9bef',
};
