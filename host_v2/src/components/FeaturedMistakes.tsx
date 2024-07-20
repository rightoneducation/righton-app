import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from '@mui/material';
import { IHostTeamAnswersResponse, IQuestion } from "@righton/networking";
import { useTSHostTeamAnswersContext, useTSDispatchContext } from '../hooks/context/useLocalHostTeamAnswersContext';
import { LocalHostTeamAnswersContext, LocalHostTeamAnswersDispatchContext } from '../lib/context/LocalHostTeamAnswersContext';
import {Mistake } from "../lib/HostModels";
import MistakeSelector from "./MistakeSelector";
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';

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

interface FeaturedMistakesProps {
  currentQuestion: IQuestion,
  responses: IHostTeamAnswersResponse[];
  featuredMistakesSelectionValue: string;
}

export default function FeaturedMistakes({
  currentQuestion,
  responses,
  featuredMistakesSelectionValue,
}: FeaturedMistakesProps) {
  const [isPopularMode, setIsPopularMode] = useState<boolean>(true);
  const title = 'Featured Mistakes';
  const subtitle =
    'Selected responses will be presented to players as options for popular incorrect answers.';
  const radioButtonText1 = 'Use the top 3 answers by popularity';
  const radioButtonText2 = 'Manually pick the options';
  const numOfPopularMistakes = 3;
  const totalAnswers = responses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  // const localHostTeamAnswers = useTSHostTeamAnswersContext(LocalHostTeamAnswersContext);
  const dispatchHostTeamAnswers = useTSDispatchContext(LocalHostTeamAnswersDispatchContext);


  // TODO move all this logic to hostTeamAnswersDataManager
  const buildMistakes = (inputMistakes: IHostTeamAnswersResponse[]): Mistake[] => {
    const mistakes = responses
    .filter(response => !response.isCorrect && response.multiChoiceCharacter !== '–')
    .map((response) => ({
      answer: response.rawAnswer,
      percent: (response.count/totalAnswers)*100,
      isSelected: false
      }));
    const sortedMistakes = mistakes.sort((a: any, b: any) => b.percent - a.percent) ?? [];
    let finalMistakes = sortedMistakes;
    if (isPopularMode)
      finalMistakes = sortedMistakes.map((mistake, index) => {
        if (index < numOfPopularMistakes) {
          return { ...mistake, isSelected: true };
        }
        return { ...mistake, isSelected: false };
      }); 
    return finalMistakes;
  };
  const [sortedMistakes, setSortedMistakes] = useState<Mistake[]>(buildMistakes(responses));

  useEffect(()=> {
    setSortedMistakes(buildMistakes(responses));
  }, [responses]); // eslint-disable-line

  const resetMistakesToPopular = () => {
    const resetMistakes = sortedMistakes.map((mistake, index) => {
      if (index < numOfPopularMistakes) {
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

  const handleSelectMistake = (index: number) => {

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
