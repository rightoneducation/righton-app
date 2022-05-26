import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GameInProgress from './GameInProgress';
import MockGameSession from '../../mocks/gamesession.json';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'GameInProgress',
  component: GameInProgress,
} 

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = ( overrides ) => <GameInProgress {...MockGameSession} {...overrides} />  

export const OpeningScreen = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
OpeningScreen.args = {
    
};


