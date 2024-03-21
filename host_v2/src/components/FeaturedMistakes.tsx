import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  withStyles,
} from '@mui/material';
import { ShortAnswerResponse, Mistake } from '../lib/HostModels';
import MistakeSelector from './MistakeSelector';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';

import { sortMistakes } from '../lib/HelperFunctions';

// Need to remove featuredMistakesSelectionValue. Duplicate of isPopularMode.
interface FeaturedMistakesProps {
  onSelectMistake: (answer: string, isSelected: boolean) => void;
  sortedMistakes: Mistake[];
  setSortedMistakes: (value: Mistake[]) => void;
  isPopularMode: boolean;
  setIsPopularMode: (value: boolean) => void;
  featuredMistakesSelectionValue: string;
}

const BackgroundStyled = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  padding: `16px`,
  backgroundColor: 'rgba(0,0,0,0)',
  gap: 16,
});

const TitleStyled = styled(Typography)({
  color: '#FFFFFF',
  fontFamily: 'Poppins',
  textAlign: 'left',
  fontSize: '24px',
  fontWeight: 700,
  width: '100%',
});

const SubtitleStyled = styled(Typography)({
  color: '#FFFFFF',
  fontFamily: 'Rubik',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 400,
});

const RadioLabelStyled = styled(FormControlLabel)({
  color: '#FFFFFF',
  '& .MuiTypography-root': {
    color: '#FFFFFF',
  },
});

const RadioButtonStyled = styled(FormControlLabel)({
  color: 'rgba(255, 255, 255, 0.60)',
  '&.Mui-checked': {
    color: '#2196F3',
  },
});

export default function FeaturedMistakes({
  onSelectMistake,
  sortedMistakes,
  setSortedMistakes,
  isPopularMode,
  setIsPopularMode,
  featuredMistakesSelectionValue,
}: FeaturedMistakesProps) {
  const title = 'Featured Mistakes';
  const subtitle =
    'Selected responses will be presented to players as options for popular incorrect answers.';
  const radioButtonText1 = 'Use the top 3 answers by popularity';
  const radioButtonText2 = 'Manually pick the options';
  const numOfPopularMistakes = 3;
  console.log('Featured sorted mistakes below');
  console.log(sortedMistakes);
  const resetMistakesToPopular = () => {
    const resetMistakes = sortedMistakes.map((mistake, index) => {
      if (index < numOfPopularMistakes) {
        onSelectMistake(mistake.answer, true);
        return { ...mistake, isSelected: true };
      }
      return { ...mistake, isSelected: false };
    });
    setSortedMistakes(resetMistakes);
  };
  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'A') {
      resetMistakesToPopular();
      setIsPopularMode(true);
    } else {
      setIsPopularMode(false);
    }
  };
  // Initialize the state and call the resetMistakesToPopular function when the component mounts

  // useState(() => {
  // resetMistakesToPopular();
  //   setIsPopularMode(true);
  // });

  const handleSelectMistake = (index: number) => {
    onSelectMistake(sortedMistakes[index].answer, false);
    const newMistakes = [...sortedMistakes];
    newMistakes[index].isSelected = !newMistakes[index].isSelected;
    setSortedMistakes([...newMistakes]);
  };

  return (
    <HostDefaultCardStyled elevation={10}>
      <BackgroundStyled elevation={0}>
        <TitleStyled>{title}</TitleStyled>
        <SubtitleStyled>{subtitle}</SubtitleStyled>
        <RadioGroup
          defaultValue={featuredMistakesSelectionValue}
          onChange={handleModeChange}
        >
          <RadioLabelStyled
            value="A"
            control={<Radio />}
            label={radioButtonText1}
          />
          <RadioLabelStyled
            value="B"
            control={<Radio />}
            label={radioButtonText2}
          />
        </RadioGroup>
        {sortedMistakes.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: '8px',
              width: '100%',
            }}
          >
            {sortedMistakes.map((mistake, index) => (
              <MistakeSelector
                key={mistake.answer}
                mistakeText={mistake.answer}
                mistakePercent={mistake.percent}
                isPopularMode={isPopularMode}
                isSelected={mistake.isSelected}
                mistakeIndex={index}
                handleSelectMistake={handleSelectMistake}
                // style={{width:'100%'}}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            <SubtitleStyled
              style={{ fontStyle: 'italic', textAlign: 'center' }}
            >
              Student responses will appear here
            </SubtitleStyled>
          </Box>
        )}
      </BackgroundStyled>
    </HostDefaultCardStyled>
  );
}
