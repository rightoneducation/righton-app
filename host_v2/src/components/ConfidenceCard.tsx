import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';
import ConfidenceResponsesGraph from './ConfidenceComponents/ConfidenceResponseGraph';
import ConfidenceResponseDropdown from './ConfidenceComponents/ConfidenceResponseDropdown';

interface Team {
  name: string; // team name
}

interface Answer {
  count: number; // number of teams that selected this answer
  teams: Team[]; // an array of the teams that selected this answer
  isCorrect: boolean; // true iff this answer is the correct answer
}

interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer 
  name: string; // this player's name
}

// TODO: maybe also update confidence to use ConfidenceOption type (think this is in networking)
interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; // number of teams who selected this option and answered correctly 
  incorrect: number; // number of players who selected tgis option and answered incorrectly 
  players: Player[]; // an array of the players that selected this option
}

// TODO: figure out what to do about keeping graph as 'confidence' instead of 
// current toggle functionality based on click behavior
interface GraphClickInfo {
  graph: string | null;
  selectedIndex: number | null;
}

interface CardProps {
  // TODO: change these to their correct types (and make them non-optional)
  // TODO: uncomment rest of props later
  confidenceData?: ConfidenceOption[];
  orderedAnswers?: Answer[];
  // graphClickInfo?: GraphClickInfo;
  // handleGraphClick?: ({ graph, selectedIndex }: { graph: string | null; selectedIndex: number | null; }) => void;
}

const CardContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'inline'
}));

const SmallTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
  marginTop: `${theme.sizing.extraSmallPadding}px`
}));

const InstructionsText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.playerFeedbackLabelColor}`,
  fontSize: `${theme.typography.h4.fontSize}`,
}));

const TitleText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  fontSize: `${theme.typography.subtitle1.fontSize}`,
  fontWeight: `${theme.typography.subtitle1.fontWeight}`,
  lineHeight: `${theme.typography.subtitle1.lineHeight}`,
  textAlign: 'left',
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: `${theme.typography.h2.color}`,
  fontWeight: `${theme.typography.body1.fontWeight}`
}));

export default function ConfidenceCard({
  // TODO: uncomment rest of props later
  confidenceData,
  orderedAnswers,
  // graphClickInfo,
  // handleGraphClick
}: CardProps) {

  // TODO: MOVE THIS UP TO PARENT AND THEN PARENT'S PARENT
  const samplePlayerOne: Player = { answer: 'C', isCorrect: false, name: 'Alex Williams' }
  const samplePlayerTwo: Player = { answer: 'C', isCorrect: false, name: 'Alessandro DeLuca-Smith' }
  const samplePlayerThree: Player = { answer: 'D', isCorrect: true, name: 'Jackson Cameron' }
  const samplePlayerFour: Player = { answer: 'A', isCorrect: false, name: 'Jeremiah Tanaka' }
  const sampleConfidenceData: ConfidenceOption[] = [{ confidence: 'NOT_RATED', correct: 0, incorrect: 0, players: [] },
  { confidence: 'NOT_AT_ALL', correct: 0, incorrect: 0, players: [] },
  { confidence: 'KINDA', correct: 0, incorrect: 2, players: [samplePlayerOne, samplePlayerTwo] },
  { confidence: 'QUITE', correct: 0, incorrect: 0, players: [] },
  { confidence: 'VERY', correct: 1, incorrect: 1, players: [samplePlayerThree, samplePlayerFour] },
  { confidence: 'TOTALLY', correct: 0, incorrect: 0, players: [] }]

  const [graphClickInfo, setGraphClickInfo] = useState<GraphClickInfo>({
    graph: null,
    selectedIndex: null
  });

  const handleGraphClick = ({ graph, selectedIndex }: { graph: string | null, selectedIndex: number | null }) => {
    setGraphClickInfo({ graph, selectedIndex });
  };

  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <HostDefaultCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <CardContentContainer>
          <TitleText>
            {t('gamesession.confidenceCard.title')}
          </TitleText>
          <SmallTextContainer>
            <DescriptionText>
              {t('gamesession.confidenceCard.description')}
            </DescriptionText>
          </SmallTextContainer>
          <ConfidenceResponsesGraph
            confidenceData={sampleConfidenceData}
            graphClickInfo={graphClickInfo}
            handleGraphClick={handleGraphClick} />
          {graphClickInfo.selectedIndex !== null ?
            <ConfidenceResponseDropdown
              graphClickInfo={graphClickInfo}
              selectedConfidenceData={
                sampleConfidenceData[graphClickInfo.selectedIndex]
              } /> :
            <SmallTextContainer>
              <InstructionsText>
                {t('gamesession.confidenceCard.instructions')}
              </InstructionsText>
            </SmallTextContainer>
          }
        </CardContentContainer>
      </BodyCardContainerStyled>
    </HostDefaultCardStyled >
  );
}
