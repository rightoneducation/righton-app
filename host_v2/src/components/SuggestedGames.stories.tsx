import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import SuggestedGames from './SuggestedGames';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/SuggestedGames',
  component: SuggestedGames,
} as Meta<typeof SuggestedGames>;

const Template: StoryFn<typeof SuggestedGames> = function SuggestedGamesTemplate(args) {
  const [isGameSelected, setIsGameSelected] = useState(false);
  
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <SuggestedGames {...args} isGameSelected={isGameSelected} setIsGameSelected={setIsGameSelected} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const SuggestedGamesNotEmpty = Template.bind({});

SuggestedGamesNotEmpty.args = {
  gametemplates: [{cluster: "RP",
  description: "There’s a sale at the mall! These questions will help you calculate how much you save on items.",
  domain: "A",
  grade: "7",
  id: "31982226-1e80-4a83-8f93-e32da3bf1ad2",
  imageUrl: "https://imageio.forbes.com/specials-images/dam/imageserve/1138257321/960x0.jpg",
  owner: "Owner's Name",
  phaseOneTime: 180,
  phaseTwoTime: 180,
  questionTemplates: [],
  questionTemplatesCount: 0,
  standard: "3",
  title: "A Day at the Mall",
  version: 0},
{cluster: "G",
description: "Solve problems involving area, volume and surface area of two- and three-dimensional objects composed of triangles, quadrilaterals, polygons, cubes, and right prisms.",
domain: "B",
grade: "7",
id: "4e529df7-6125-4032-b568-2c3a182849db",
imageUrl: "https://images.unsplash.com/photo-1546617885-4822125f891e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c3RvcCUyMHNpZ258ZW58MHx8MHx8",
owner: "Owner's Name",
phaseOneTime: 180,
phaseTwoTime: 180,
questionTemplates: [],
questionTemplatesCount: 0,
standard: "6",
title: "Polygons in Everyday Life",
version: 0
}],
};

export const SuggestedGamesEmpty = Template.bind({});

SuggestedGamesEmpty.args = {
  gametemplates: [],
};

