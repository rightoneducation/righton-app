import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import {ConfidenceLevel } from '@righton/networking';

import FeaturedMistakes from './FeaturedMistakes';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';
import {sortMistakes} from "../lib/HelperFunctions"

import { ShortAnswerResponse } from '../lib/HostModels';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/FeaturedMistakes',
  component: FeaturedMistakes,
} as Meta<typeof FeaturedMistakes>;

const myConfidenceLevel1: ConfidenceLevel = ConfidenceLevel.VERY;

const anotherConfidenceLevel2: ConfidenceLevel = ConfidenceLevel.KINDA;

const Template: StoryFn<typeof FeaturedMistakes> = function CardTemplate(args) {
    const [isPopularMode, setIsPopularMode] = useState<boolean>(true);
    const [shortAnswerResponses, setShortAnswerResponses] = useState<ShortAnswerResponse[]>([ // eslint-disable-line
        {
          rawAnswer: 'y=x^2',
          normAnswer: 'y=x^2',
          isCorrect: true, // only every one
          isSelectedMistake: true, 
          count: 13,
          teams: [{name: 'Name1', id: "1", confidence:  myConfidenceLevel1}, 
      {name: 'Name2', id: "2", confidence:  anotherConfidenceLevel2}]
        },
        {
          rawAnswer: 'No Idea',
          normAnswer: 'No Idea',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 2,
          teams: [{name: 'Name3', id: "3", confidence:  myConfidenceLevel1}, 
          {name: 'Name4', id: "4", confidence:  anotherConfidenceLevel2}]
        },
        {
          rawAnswer: '2x^4 + 6x^2 - 3x',
          normAnswer: '2x^4 + 6x^2 - 3x',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 4,
          teams: [{name: 'Name5', id: "5", confidence:  anotherConfidenceLevel2}, 
          {name: 'Name6', id: "6", confidence:  anotherConfidenceLevel2}, 
          {name: 'Name7', id: "7", confidence:  anotherConfidenceLevel2},
          {name: 'Name8', id: "8", confidence:  anotherConfidenceLevel2}]
        },
        {
          rawAnswer: '4x^4 - x^3 + 7x^2 - 6x',
          normAnswer: '4x^4 - x^3 + 7x^2 - 6x',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 5,
          teams: [{name: 'Name9', id: "9", confidence:  anotherConfidenceLevel2},
          {name: 'Name10', id: "10", confidence:  myConfidenceLevel1},
          {name: 'Name11', id: "11", confidence:  myConfidenceLevel1},
          {name: 'Name12', id: "12", confidence:  myConfidenceLevel1},
          {name: 'Name13', id: "13", confidence:  anotherConfidenceLevel2}]
        }, 
        {
          rawAnswer: 'x^2 - 4x - 12',
          normAnswer: 'x^2 - 4x - 12',
          isCorrect: false,
          isSelectedMistake: true, 
          count: 1,
          teams: [{name: 'Name14', id: "14", confidence:  myConfidenceLevel1}],
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
