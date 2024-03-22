import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';
import ConfidenceResponsesGraph from './ConfidenceComponents/ConfidenceResponseGraph';
import ConfidenceResponseDropdown from './ConfidenceComponents/ConfidenceResponseDropdown';

interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer
  name: string; // this player's name
}

interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; // number of teams who selected this option and answered correctly
  incorrect: number; // number of players who selected tgis option and answered incorrectly
  players: Player[]; // an array of the players that selected this option
}

interface CardProps {
  confidenceData: ConfidenceOption[];
  graphClickIndex: number | null;
  handleGraphClick: (selectedIndex: number | null) => void;
}

const CardContentContainer = styled(Box)({
  width: '100%',
  display: 'inline',
});

const SmallTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
  marginTop: `${theme.sizing.extraSmallPadding}px`,
}));

const InstructionsText = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.feedbackCardsInstructionsColor}`,
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
  fontWeight: `${theme.typography.body1.fontWeight}`,
}));

export default function ConfidenceCard({
  confidenceData,
  graphClickIndex,
  handleGraphClick,
}: CardProps) {
  const { t } = useTranslation();
  return (
    <HostDefaultCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <CardContentContainer>
          <TitleText>{t('gamesession.confidenceCard.title')}</TitleText>
          <SmallTextContainer>
            <DescriptionText>
              {t('gamesession.confidenceCard.description')}
            </DescriptionText>
          </SmallTextContainer>
          <ConfidenceResponsesGraph
            confidenceData={confidenceData}
            graphClickIndex={graphClickIndex}
            handleGraphClick={handleGraphClick}
          />
          {graphClickIndex !== null ? (
            <ConfidenceResponseDropdown
              graphClickIndex={graphClickIndex}
              selectedConfidenceData={confidenceData[graphClickIndex]}
            />
          ) : (
            <SmallTextContainer>
              <InstructionsText>
                {t('gamesession.confidenceCard.instructions')}
              </InstructionsText>
            </SmallTextContainer>
          )}
        </CardContentContainer>
      </BodyCardContainerStyled>
    </HostDefaultCardStyled>
  );
}
