import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfidenceLevel, IHostTeamAnswersConfidence, IHostTeamAnswersResponse } from '@righton/networking';
import { IGraphClickInfo, IGraphClickIndices } from '../../lib/HostModels';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import ConfidenceResponsesGraph from './ConfidenceResponseGraph';
import ConfidenceResponseDropdown from './ConfidenceResponseDropdown';

interface CardProps {
  confidences: IHostTeamAnswersConfidence[];
  numPlayers: number;
  responses: IHostTeamAnswersResponse[];
  isShortAnswerEnabled: boolean;
  graphClickInfo: IGraphClickIndices;
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

const CardContentContainer = styled(Box)(({theme}) => {
  return {
    width: '100%',
    display: 'inline',
    gap: `${theme.sizing.smPadding}px`
  }
});

const SmallTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  marginTop: `${theme.sizing.xSmPadding}px`,
}));

export default function ConfidenceCard({
  confidences,
  numPlayers,
  responses,
  isShortAnswerEnabled,
  graphClickInfo,
  setGraphClickInfo,
}: CardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const ratedConfidences = confidences.filter(
    confidence => confidence.level !== ConfidenceLevel.NOT_RATED
  );
  const selectedIndex = graphClickInfo.confidence ?? null;
  return (
    <HostDefaultCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <CardContentContainer>
          <Typography variant='h3' style={{color: theme.palette.primary.main}}>
            {t('gamesession.confidenceCard.title')}
          </Typography>
          <SmallTextContainer>
             <Typography variant='label' style={{color: theme.palette.primary.main}}>
              {t('gamesession.confidenceCard.description')}
            </Typography>
          </SmallTextContainer>
          <ConfidenceResponsesGraph
            confidences={ratedConfidences}
            graphClickIndex={selectedIndex}
            setGraphClickInfo={setGraphClickInfo}
          />
          {selectedIndex !== null ? (
            <ConfidenceResponseDropdown
              key={selectedIndex}
              selectedConfidence={ratedConfidences[selectedIndex]}
              numPlayers={numPlayers}
              responses={responses}
              isShortAnswerEnabled={isShortAnswerEnabled}
            />
          ) : (
            <SmallTextContainer>
              <Typography variant='label' style={{opacity: 0.5}}>
                {t('gamesession.confidenceCard.instructions')}
              </Typography>
            </SmallTextContainer>
          )}
        </CardContentContainer>
      </BodyCardContainerStyled>
    </HostDefaultCardStyled>
  );
}
