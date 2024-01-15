import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';
import ResponsesGraph from './PopularMistake/ResponsesGraph';

const CardContentContainer = styled(Box)({
  width: '100%',
  display: 'inline'
});

const SmallTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
  marginTop: `${theme.sizing.extraSmallPadding}px`
}));

const TitleText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  fontSize: `${theme.typography.subtitle1.fontSize}`,
  fontWeight: `${theme.typography.subtitle1.fontWeight}`,
  lineHeight: `${theme.typography.subtitle1.lineHeight}`,
  textAlign: 'left',
}));

const InstructionsText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.feedbackCardsInstructionsColor}`,
  fontSize: `${theme.typography.h4.fontSize}`,
}));

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

interface QuestionChoice {
  reason: string;
  text: string;
  isAnswer: boolean;
}

// TODO: change this later
interface GraphClickInfo {
  graph: string | null;
  selectedIndex: number | null;
}
// interface CardProps {
// }

export default function PopularMistakeCard() {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  // TODO: move up
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
    answerCount: 2,
    answerTeams: [sampleTeam, sampleTeam],
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

  // sample data has to be 'reversed' because the graph is built bottom -> up
  const sampleData: PopularMistakeOption[] = [
    sampleChoiceD, sampleChoiceC, sampleChoiceB, sampleChoiceA, sampleChoiceNone
  ]
  const sampleNumPlayers = 1;
  const sampleTotalAnswers = 1;
  const sampleQuestionChoices: QuestionChoice[] = [
    { reason: '', text: '714', isAnswer: true },
    { reason: 'Although 21 and 34 are the nex..', text: '55', isAnswer: false },
    { reason: 'knknknknkn…', text: '21', isAnswer: false },
    { reason: 'wdijwdiwidjwi…', text: '273', isAnswer: false },
  ]

  const sampleStatePosition = 2;
  const [sampleGraphClickInfo, setSampleGraphClickInfo] = useState<GraphClickInfo>({
    graph: null,
    selectedIndex: null,
  });

  const handleGraphClick = ({ graph, selectedIndex }: { graph: string | null, selectedIndex: number | null }) => {
    setSampleGraphClickInfo({ graph, selectedIndex });
    // setTimeout(() => {
    //   if (graph === 'realtime')
    //     responsesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //   else if (graph === 'confidence')
    //     confidenceCardRef.current.scrollIntoView({ behavior: 'smooth' });
    //   else
    //     hintCardRef.current.scrollIntoView({ behavior: 'smooth' });
    // }, 0);
  };

  return (
    <HostDefaultCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <CardContentContainer>
          <TitleText>{t('gamesession.popularMistakeCard.title')}</TitleText>
          <ResponsesGraph data={sampleData}
            numPlayers={sampleNumPlayers}
            totalAnswers={sampleTotalAnswers}
            questionChoices={sampleQuestionChoices}
            statePosition={sampleStatePosition}
            graphClickInfo={sampleGraphClickInfo}
            isShortAnswerEnabled
            handleGraphClick={handleGraphClick} />
          {/* TODO: add dropdown if selectedGraphIndex is not null */}
          <SmallTextContainer>
            <InstructionsText>
              {t('gamesession.popularMistakeCard.instructions')}
            </InstructionsText>
          </SmallTextContainer>
        </CardContentContainer>
      </BodyCardContainerStyled>
    </HostDefaultCardStyled>
  );
}
