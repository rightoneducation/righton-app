import React, { useState } from "react";
import FooterContent from "./FooterContent";
import { GameSessionState } from '@righton/networking'

export default {
  title: 'Design System/3_Organisms/FooterContent',
  component: FooterContent
};

const Template = args => <FooterContent {...args} />;

export const Team0 = Template.bind({});
Team0.args = {
  avatar: 0,
  teamName: 'Edward Hopper',
  score: 9,
};

export const Team1 = Template.bind({});
Team1.args = {
  avatar: 1,
  teamName: 'Mark Rothko',
  score: 120,
};

export const Team2 = Template.bind({});
Team2.args = {
  avatar: 2,
  teamName: 'Gustave Caillebotte',
  score: 240,
};

export const Team3 = Template.bind({});
Team3.args = {
  avatar: 3,
  teamName: 'Katsushika Hokusai',
  score: 360,
};

export const Team4 = Template.bind({});
Team4.args = {
  avatar: 4,
  teamName: 'Andrew Wyeth',
  score: 360,
};

export const Team5 = Template.bind({});
Team5.args = {
  avatar: 5,
  teamName: 'Michelangelo Caravaggio',
  score: 360,
};