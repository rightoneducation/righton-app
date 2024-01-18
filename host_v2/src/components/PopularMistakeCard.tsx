import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';
import ResponsesGraph from './PopularMistake/ResponseGraph';
import ResponseDropdown from './PopularMistake/ResponseDropdown';

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

interface CardProps {
  responseData: PopularMistakeOption[],
  totalNumPlayers: number;
  statePositon: number;
  graphClickIndex: number | null;
  handleGraphClick: (selectedIndex: number | null) => void;
}

export default function PopularMistakeCard({
  responseData,
  totalNumPlayers,
  statePositon,
  graphClickIndex,
  handleGraphClick
}: CardProps) {

  const { t } = useTranslation();
  return (
    <HostDefaultCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <CardContentContainer>
          <TitleText>{t('gamesession.popularMistakeCard.title')}</TitleText>
          <ResponsesGraph
            data={responseData}
            statePosition={statePositon}
            graphClickIndex={graphClickIndex}
            handleGraphClick={handleGraphClick} />
          {graphClickIndex !== null ?
            <ResponseDropdown responseData={responseData} graphClickIndex={graphClickIndex} numPlayers={totalNumPlayers} /> :
            <SmallTextContainer>
              <InstructionsText>
                {t('gamesession.popularMistakeCard.instructions')}
              </InstructionsText>
            </SmallTextContainer>
          }
        </CardContentContainer>
      </BodyCardContainerStyled>
    </HostDefaultCardStyled>
  );
}
