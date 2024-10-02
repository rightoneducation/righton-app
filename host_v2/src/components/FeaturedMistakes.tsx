import React, { useState, useEffect, useMemo } from "react";
import { styled } from '@mui/material/styles';
import {
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from '@mui/material';
import { IHostTeamAnswersResponse, IQuestion, GameSessionState } from "@righton/networking";
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { useTSHostTeamAnswersContext, useTSDispatchContext } from '../hooks/context/useHostTeamAnswersContext';
import { HostTeamAnswersContext, HostTeamAnswersDispatchContext } from '../lib/context/HostTeamAnswersContext';
import { Mistake } from "../lib/HostModels";
import MistakeSelector from "./MistakeSelector";
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';

const BackgroundStyled = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
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
  lineHeight: '36px',
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
  currentState: GameSessionState;
  featuredMistakesSelectionValue: string;
  isPopularMode: boolean;
  setIsPopularMode: (isPopularMode: boolean) => void;
}

export default function FeaturedMistakes({
  currentQuestion,
  currentState,
  featuredMistakesSelectionValue,
  isPopularMode,
  setIsPopularMode
}: FeaturedMistakesProps) {

  const title = (currentState === GameSessionState.PHASE_1_DISCUSS || currentState === GameSessionState.PHASE_2_START)
    ? 'Common Mistakes' 
    : 'Common Mistakes Preview';
  const subtitle = (currentState === GameSessionState.PHASE_1_DISCUSS || currentState === GameSessionState.PHASE_2_START)
    ? 'Selected responses will be presented to players as options for popular incorrect answers.'
    : 'On the next screen, you will select from these incorrect answers to be options in Phase 2.';
  const radioButtonText1 = 'Use the top 3 answers by popularity';
  const radioButtonText2 = 'Manually pick the options';
  const numOfPopularMistakes = 3;
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localHostTeamAnswers = useTSHostTeamAnswersContext(HostTeamAnswersContext);
  const dispatchHostTeamAnswers = useTSDispatchContext(HostTeamAnswersDispatchContext);
  const hostTeamAnswerResponses = useMemo(() => {
    return localHostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.phase1.responses ?? [];
  }, [localHostTeamAnswers, currentQuestion.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalAnswers = useMemo(() => {
    return hostTeamAnswerResponses.reduce((acc, response) => acc + response.count, 0);
  }, [hostTeamAnswerResponses]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pure function to build sorted mistakes
  const buildFeaturedMistakes = (inputMistakes: IHostTeamAnswersResponse[]) => {
    const mistakes = inputMistakes
      .filter(response => !response.isCorrect && response.multiChoiceCharacter !== '–')
      .map((response) => ({
        answer: response.rawAnswer,
        percent: Math.trunc((response.count / totalAnswers) * 100),
        isSelectedMistake: response.isSelectedMistake ?? false,
      }));
    const sortMistakes = mistakes.sort((a, b) => b.percent - a.percent) ?? [];
    return sortMistakes;
  };

  // Memoize sortedMistakes 
  const sortedMistakes = useMemo(() => buildFeaturedMistakes(hostTeamAnswerResponses), [hostTeamAnswerResponses, totalAnswers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to reset mistakes to popular mode
  const resetMistakesToPopular = () => {
    const resetMistakes = sortedMistakes.map((mistake, index) => {
      if (index < numOfPopularMistakes) {
        return { ...mistake, isSelectedMistake: true };
      }
      return { ...mistake, isSelectedMistake: false };
    });
    // Only update if there are changes
    const needsUpdate = resetMistakes.some((mistake, index) => mistake.isSelectedMistake !== sortedMistakes[index].isSelectedMistake);
    if (needsUpdate) {
      const newHostTeamAnswers = apiClients.hostDataManager?.updateHostTeamAnswersSelectedMistakes([...resetMistakes], currentQuestion);
      if (newHostTeamAnswers) {
        dispatchHostTeamAnswers({ type: 'synch_local_host_team_answers', payload: { ...newHostTeamAnswers } });
      }
    }
  };

  // Handle mode change from radio buttons
  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMode = event.target.value;
    if (selectedMode === 'A') {
      setIsPopularMode(true);
    } else {
      setIsPopularMode(false);
    }
  };

  // Handle selecting/deselecting a mistake manually
  const handleSelectMistake = (index: number) => {
    const numSelected = sortedMistakes.map((mistake) => mistake.isSelectedMistake).filter((isSelected) => isSelected).length;
      const newMistakes = sortedMistakes.map((mistake, idx) => {
        if (idx === index) {
          if (numSelected < numOfPopularMistakes || mistake.isSelectedMistake)
            return { ...mistake, isSelectedMistake: !mistake.isSelectedMistake };
        }
        return mistake;
      });
      const newHostTeamAnswers = apiClients.hostDataManager?.updateHostTeamAnswersSelectedMistakes([...newMistakes], currentQuestion);
      if (newHostTeamAnswers) {
        dispatchHostTeamAnswers({ type: 'synch_local_host_team_answers', payload: { ...newHostTeamAnswers } });
      }
  };

  // Effect to handle initial and subsequent updates when in popular mode
  useEffect(() => {
    if (isPopularMode) {
      const topSelected = sortedMistakes.slice(0, numOfPopularMistakes).every(mistake => mistake.isSelectedMistake);
      const othersDeselected = sortedMistakes.slice(numOfPopularMistakes).every(mistake => !mistake.isSelectedMistake);
      if (!topSelected || !othersDeselected) {
        resetMistakesToPopular();
      }
    }
  }, [isPopularMode, sortedMistakes]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HostDefaultCardStyled elevation={10}>
      <BackgroundStyled elevation={0}>
        <TitleStyled>{title}</TitleStyled>
        <SubtitleStyled>{subtitle}</SubtitleStyled>
        {(currentState === GameSessionState.PHASE_1_DISCUSS || currentState === GameSessionState.PHASE_2_START) &&
          <RadioGroup
            value={isPopularMode ? "A" : "B"} // Controlled component
            onChange={handleModeChange}
          >
            <RadioLabelStyled
              value="A"
              control={<Radio sx={{ color: '#FFFFFF' }} />}
              label={radioButtonText1}
            />
            <RadioLabelStyled
              value="B"
              control={<Radio sx={{ color: '#FFFFFF' }} />}
              label={radioButtonText2}
            />
          </RadioGroup>
        }
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
                isSelected={mistake.isSelectedMistake}
                mistakeIndex={index}
                handleSelectMistake={handleSelectMistake}
                currentState={currentState}
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
