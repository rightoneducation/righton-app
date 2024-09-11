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

  const title = 'Common Mistakes';
  const subtitle =
    'Selected responses will be presented to players as options for popular incorrect answers.';
  const radioButtonText1 = 'Use the top 3 answers by popularity';
  const radioButtonText2 = 'Manually pick the options';
  const numOfPopularMistakes = 3;

  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localHostTeamAnswers = useTSHostTeamAnswersContext(HostTeamAnswersContext);
  const dispatchHostTeamAnswers = useTSDispatchContext(HostTeamAnswersDispatchContext);
  const hostTeamAnswerResponses = localHostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.phase1.responses ?? [];
  const totalAnswers = hostTeamAnswerResponses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const buildFeaturedMistakes = (inputMistakes: IHostTeamAnswersResponse[]): Mistake[] => {
    const mistakes = inputMistakes
      .filter(response => !response.isCorrect && response.multiChoiceCharacter !== '–')
      .map((response) => ({
        answer: response.rawAnswer,
        percent: Math.trunc((response.count/totalAnswers)*100),
        isSelectedMistake: response.isSelectedMistake ?? false,
        }));
    const sortedMistakes = mistakes.sort((a: any, b: any) => b.percent - a.percent) ?? [];
    let finalMistakes = sortedMistakes;
    if (isPopularMode)
      finalMistakes = sortedMistakes.map((mistake, index) => {
        if (index < numOfPopularMistakes) {
          return { ...mistake, isSelectedMistake: true };
        }
        return { ...mistake, isSelectedMistake: false };
      }); 
      apiClients.hostDataManager?.updateHostTeamAnswersSelectedMistakes([...finalMistakes], currentQuestion);
    return finalMistakes;
  };
  const sortedMistakes = buildFeaturedMistakes(hostTeamAnswerResponses);
  const resetMistakesToPopular = () => {
    const resetMistakes = sortedMistakes.map((mistake, index) => {
      if (index < numOfPopularMistakes) {
        return { ...mistake, isSelected: true };
      }
      return { ...mistake, isSelected: false };
    });
    const newHostTeamAnswers = apiClients.hostDataManager?.updateHostTeamAnswersSelectedMistakes([...resetMistakes], currentQuestion);
    if (newHostTeamAnswers)
      dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {...newHostTeamAnswers}});
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetMistakesToPopular();
    if (event.target.value === 'A') {
      setIsPopularMode(true);
    } else {
      setIsPopularMode(false);
    }
  };

  const handleSelectMistake = (index: number) => {
    const newMistakes = [...sortedMistakes];
    newMistakes[index].isSelectedMistake = !newMistakes[index].isSelectedMistake;
    const newHostTeamAnswers = apiClients.hostDataManager?.updateHostTeamAnswersSelectedMistakes([...newMistakes], currentQuestion);
    if (newHostTeamAnswers)
      dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {...newHostTeamAnswers}});
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
            control={<Radio sx={{color: '#FFFFFF'}}/>}
            label={radioButtonText1}
          />
          <RadioLabelStyled
            value="B"
            control={<Radio sx={{color: '#FFFFFF'}}/>}
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
                isSelected={mistake.isSelectedMistake}
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
