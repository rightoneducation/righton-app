import React, { useState } from 'react';
import { ApiClient } from '@righton/networking';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import PlaceholderContentArea from '../components/PlaceholderContentArea';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}
// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption {
  instructions: string[] | null;
  reason: string | null;
  content: string;
}

interface QuestionData {
  text: string;
  imageUrl: string | undefined;
}

interface Team {
  name: string;
}

interface PopularMistakeOption {
  answerChoice: string;
  answerCorrect: boolean;
  answerCount: number;
  answerTeams: Team[];
  answerText: string;
}

export default function GameSessionContainer({
  apiClient,
}: GameInProgressContainerProps) {
  console.log(apiClient); // eslint-disable-line
  // TODO: delete hard coded values later
  const sampleQuestion: QuestionData = {
    text: "A pair of shoes were 10% off last week. This week, theres an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that youd get if you buy the shoes this week?",
    imageUrl: "https://images.unsplash.com/photo-1609188944094-394637c26769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
  }

  const sampleAnswerOptionOne: AnswerOption = {
    instructions: ['step 1 step 1 step 1 step 1 step 1 step 1  step 1 step 1 step 1 step 1 step 1 step 1 ', 'step 2', 'step 3', 'step 4'],
    reason: null,
    content: "an answer choice"
  }

  const sampleAnswerOptionTwo: AnswerOption = {
    instructions: null,
    reason: "reasoning",
    content: "another answer choice"
  }

  // For popular mistake card
  const sampleTeam: Team = { name: 'first last' };

  const sampleChoiceNone: PopularMistakeOption = {
    answerChoice: '-',
    answerCorrect: false,
    answerCount: 2,
    answerTeams: [sampleTeam, sampleTeam],
    answerText: 'No Response'
  }

  const sampleChoiceA: PopularMistakeOption = {
    answerChoice: 'A',
    answerCorrect: true,
    answerCount: 6,
    answerTeams: [sampleTeam, sampleTeam, sampleTeam, sampleTeam, sampleTeam, sampleTeam],
    answerText: ' 714'
  }

  const sampleChoiceB: PopularMistakeOption = {
    answerChoice: 'B',
    answerCorrect: false,
    answerCount: 0,
    answerTeams: [],
    answerText: ' 55'
  }

  const sampleChoiceC: PopularMistakeOption = {
    answerChoice: 'C',
    answerCorrect: false,
    answerCount: 4,
    answerTeams: [sampleTeam, sampleTeam, sampleTeam, sampleTeam],
    answerText: ' 21'
  }

  const sampleChoiceD: PopularMistakeOption = {
    answerChoice: 'D',
    answerCorrect: false,
    answerCount: 1,
    answerTeams: [sampleTeam],
    answerText: ' 273'
  }

  const sampleData: PopularMistakeOption[] = [
    sampleChoiceD, sampleChoiceC, sampleChoiceB, sampleChoiceA, sampleChoiceNone
  ]

  function getNumPlayers(responsesData: PopularMistakeOption[]) {
    let sum = 0;
    responsesData.forEach((datum) => { sum += datum.answerCount });
    return sum;
  }

  const sampleNumPlayers = getNumPlayers(sampleData);


  const sampleStatePosition = 2;
  const [sampleGraphClickIndex, setSampleGraphClickIndex] = useState<(number | null)>(null);

  const handlePopularMistakeGraphClick = (selectedIndex: number | null) => {
    setSampleGraphClickIndex(selectedIndex);
  };

  const { t } = useTranslation();
  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderBackgroundStyled />
      <HeaderStackContainerStyled>
        <Typography variant="h1">{t('gamesession.placeholder')}</Typography>
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <PlaceholderContentArea
          questionData={sampleQuestion}
          answerOptions={[sampleAnswerOptionOne, sampleAnswerOptionTwo]}
          popularMistakeResponseData={sampleData}
          totalNumPlayers={sampleNumPlayers}
          statePositon={sampleStatePosition}
          popularMistakeGraphClickIndex={sampleGraphClickIndex}
          handlePopularMistakeGraphClick={handlePopularMistakeGraphClick} />
      </BodyStackContainerStyled>
    </StackContainerStyled>
  );
}
