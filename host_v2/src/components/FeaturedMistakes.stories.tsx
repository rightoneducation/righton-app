import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import FeaturedMistakes from './FeaturedMistakes';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';
import sortMistakes from "../lib/HelperFunctions"
import { ShortAnswerResponse } from '../lib/HostModels';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/FeaturedMistakes',
  component: FeaturedMistakes,
} as Meta<typeof FeaturedMistakes>;

const Template: StoryFn<typeof FeaturedMistakes> = function CardTemplate(args) {
    const [isPopularMode, setIsPopularMode] = useState<boolean>(true);
    const [shortAnswerResponses, setShortAnswerResponses] = useState<ShortAnswerResponse[]>([ // eslint-disable-line
        {
          rawAnswer: 'y=x^2',
          normAnswer: 'y=x^2',
          isCorrect: true, // only every one
          isSelectedMistake: true, 
          count: 13,
          teams: ['Name1', 'Name2']
        },
        {
          rawAnswer: 'No Idea',
          normAnswer: 'No Idea',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 2,
          teams: ['Name3', 'Name13']
        },
        {
          rawAnswer: '2x^4 + 6x^2 - 3x',
          normAnswer: '2x^4 + 6x^2 - 3x',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 4,
          teams: ['Name4', 'Name5', 'Name6', 'Name7']
        },
        {
          rawAnswer: '4x^4 - x^3 + 7x^2 - 6x',
          normAnswer: '4x^4 - x^3 + 7x^2 - 6x',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 5,
          teams: ['Name8', 'Name9', 'Name10', 'Name11', 'Name12']
        }, 
        {
          rawAnswer: 'x^2 - 4x - 12',
          normAnswer: 'x^2 - 4x - 12',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 1,
          teams: ['Name14']
        },
      ]);  

      const [sortedMistakes, setSortedMistakes] = useState(React.useMemo(() => // eslint-disable-line
      sortMistakes(shortAnswerResponses, shortAnswerResponses.length, isPopularMode, 3),
      [shortAnswerResponses, isPopularMode]
   ));

    const [selectedMistakes, setSelectedMistakes] = useState<any[]>([]); // eslint-disable-line
    const onSelectMistake = (value: string, isBasedOnPopularity: boolean): void => {
      setSelectedMistakes((prev: string[]) => {
        if (prev.includes(value)) {
          if (isBasedOnPopularity === false)
            return prev.filter((mistake: string) => mistake !== value);
          return prev;
        } 
        return [...prev, value];
      });
    }

  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <FeaturedMistakes
          {...args}
          setIsPopularMode={setIsPopularMode}
          setSortedMistakes={setSortedMistakes}
          onSelectMistake={onSelectMistake}
        />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const Top3Answers = Template.bind({});
Top3Answers.args = {
  sortedMistakes: [
    { answer: '4x^4 - x^3 + 7x^2 - 6x', percent: 100, isSelected: true },
    { answer: '2x^4 + 6x^2 - 3x', percent: 80, isSelected: true },
    { answer: 'No Idea', percent: 40, isSelected: true },
    { answer: 'x^2 - 4x - 12', percent: 20, isSelected: false },
  ],
  isPopularMode: true,
  featuredMistakesSelectionValue: 'A',
};

export const Manual = Template.bind({});
Manual.args = {
  sortedMistakes: [
    { answer: '4x^4 - x^3 + 7x^2 - 6x', percent: 100, isSelected: true },
    { answer: '2x^4 + 6x^2 - 3x', percent: 80, isSelected: true },
    { answer: 'No Idea', percent: 40, isSelected: true },
    { answer: 'x^2 - 4x - 12', percent: 20, isSelected: false },
  ],
  isPopularMode: false,
  featuredMistakesSelectionValue: 'B',
};
